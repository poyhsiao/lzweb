import cherrypy
import json
import auth
import controller
import lang
import xte_fqdn
from mako import exceptions
from auth import require, member_of

class fqdn(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def fqdnHandler(self, **kwargs):
		self.msg = []
		fqdn_jcfg = json.loads(kwargs['FqdnSetting'])
		ret = xte_fqdn.set(fqdn_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("fqdn.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> FQDN"))
			return tmp.render(fqdnargs = fqdn_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(fqdnargs = fqdn_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			fqdn_jcfg = xte_fqdn.get()
			tmp = controller.lookup.get_template("fqdn.mako")
			if fqdn_jcfg[0]: # load successfully
				return tmp.render(fqdnargs = fqdn_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(fqdn_jcfg[1]))
				return tmp.render(fqdnargs = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
