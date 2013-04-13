import cherrypy
import json
import auth
import controller
import lang
import info
import xte_firewall
from mako import exceptions
from auth import require, member_of

class firewall(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def firewallHandler(self, **kwargs):
		self.msg = []
		group_jcfg = info.getGroupJcfg()
		fw_jcfg = json.loads(kwargs['FirewallSetting'])
		ret = xte_firewall.set(fw_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("firewall.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> Firewall"))
			return tmp.render(fwargs = fw_jcfg,
				ipgroup_args = group_jcfg[0],
				servicegroup_args = group_jcfg[1],
				fqdn_args = group_jcfg[2],
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(fwargs = fw_jcfg,
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
			fw_jcfg = xte_firewall.get()
			group_jcfg = info.getGroupJcfg()
			tmp = controller.lookup.get_template("firewall.mako")
			if fw_jcfg[0]: # load successfully
				return tmp.render(fwargs = fw_jcfg[1],
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					msg_list = self.msg)
			else:
				self.addMsg(str(fw_jcfg[1]))
				return tmp.render(fwargs = {},
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
