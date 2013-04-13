import cherrypy
import json
import auth
import controller
import lang
import info
import xte_connection_limit
from mako import exceptions
from auth import require, member_of

class connection_limit(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def connlimitHandler(self, **kwargs):
		self.msg = []
		group_jcfg = info.getGroupJcfg()
		connlimit_jcfg = json.loads(kwargs['ConnlimitSetting'])
		ret = xte_connection_limit.set(connlimit_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("connection_limit.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> Connection Limit"))
			return tmp.render(connlimit_args = connlimit_jcfg,
				ipgroup_args = group_jcfg[0],
				servicegroup_args = group_jcfg[1],
				fqdn_args = group_jcfg[2],
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(connlimit_args = connlimit_jcfg,
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
			connlimit_jcfg = xte_connection_limit.get()
			group_jcfg = info.getGroupJcfg()
			tmp = controller.lookup.get_template("connection_limit.mako")
			if connlimit_jcfg[0]: # load successfully
				return tmp.render(connlimit_args = connlimit_jcfg[1],
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					msg_list = self.msg)
			else:
				self.addMsg(str(connlimit_jcfg[1]))
				return tmp.render(connlimit_args = {},
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
