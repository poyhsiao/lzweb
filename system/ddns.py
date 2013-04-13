import cherrypy
import json
import auth
import controller
import lang
import xte_ddns
import const
from mako import exceptions
from auth import require, member_of
 
class ddns(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def ddnsHandler(self, **kwargs):
		self.msg = []
		ddns_jcfg = json.loads(kwargs['DDnsSetting'])
		ret = xte_ddns.set(ddns_jcfg, str(cherrypy.request.login))
		
		# To avoid password wrong
		ddns_cfg = xte_ddns.get()
		for i in const.ALL_WANS:
			ddns_jcfg[i]["password"] = ddns_cfg[1][i]["password"]
		
		tmp = controller.lookup.get_template("ddns.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> DDNS"))
			return tmp.render(ddns_args = ddns_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(ddns_args = ddns_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			ddns_jcfg = xte_ddns.get()
			tmp = controller.lookup.get_template("ddns.mako")
			if ddns_jcfg[0]: # load successfully
				return tmp.render(ddns_args = ddns_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(ddns_jcfg[1]))
				return tmp.render(ddns_args = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
