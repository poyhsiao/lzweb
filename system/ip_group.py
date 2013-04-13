import cherrypy
import json
import auth
import controller
import lang
import info
import xte_ip_group
from mako import exceptions
from auth import require, member_of

class ip_group(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def ipgroupHandler(self, **kwargs):
		self.msg = []
		fqdn_jcfg = info.getGroupJcfg()[2]
		ipgroup_jcfg = json.loads(kwargs['IpgroupSetting'])
		ret = xte_ip_group.set(ipgroup_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("ip_group.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> IP Group"))
			return tmp.render(ipgroup_args = ipgroup_jcfg, fqdn_args = fqdn_jcfg,
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(ipgroup_args = ipgroup_jcfg, fqdn_args = fqdn_jcfg,
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			ipgroup_jcfg = xte_ip_group.get()
			fqdn_jcfg = info.getGroupJcfg()[2]
			tmp = controller.lookup.get_template("ip_group.mako")
			if ipgroup_jcfg[0]: # load successfully
				return tmp.render(ipgroup_args = ipgroup_jcfg[1], fqdn_args = fqdn_jcfg,
					msg_list = self.msg)
			else:
				self.addMsg(str(ipgroup_jcfg[1]))
				return tmp.render(ipgroup_args = {}, fqdn_args = [], msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
