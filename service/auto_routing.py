import cherrypy
import json
import auth
import controller
import lang
import info
import xte_auto_routing
from mako import exceptions
from auth import require, member_of

class auto_routing(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def autoroutingHandler(self, **kwargs):
		self.msg = []
		group_jcfg = info.getGroupJcfg()
		ar_jcfg = json.loads(kwargs['AutoroutingSetting'])
		ret = xte_auto_routing.set(ar_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("auto_routing.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> Auto Routing"))
			return tmp.render(arargs = ar_jcfg,
				ipgroup_args = group_jcfg[0],
				servicegroup_args = group_jcfg[1],
				fqdn_args = group_jcfg[2],
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(arargs = ar_jcfg,
				ipgroup_args = group_jcfg[0],
				servicegroup_args = group_jcfg[1],
				fqdn_args = group_jcfg[2],
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			ar_jcfg = xte_auto_routing.get()
			group_jcfg = info.getGroupJcfg()
			tmp = controller.lookup.get_template("auto_routing.mako")
			if ar_jcfg[0]: # load successfully
				return tmp.render(arargs = ar_jcfg[1],
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					msg_list = self.msg)
			else:
				self.addMsg(str(ar_jcfg[1]))
				return tmp.render(arargs = {},
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
