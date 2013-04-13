import cherrypy
import json
import auth
import controller
import lang
import info
import xte_virtual_server
from mako import exceptions
from auth import require, member_of

class virtual_server(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def virtualserverHandler(self, **kwargs):
		self.msg = []
		group_jcfg = info.getGroupJcfg()
		vs_jcfg = json.loads(kwargs['VirtualserverSetting'])
		ret = xte_virtual_server.set(vs_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("virtual_server.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> Virtual Server"))
			return tmp.render(vsargs = vs_jcfg,
				servicegroup_args = group_jcfg[1],
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(vsargs = vs_jcfg,
				servicegroup_args = group_jcfg[1],
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			vs_jcfg = xte_virtual_server.get()
			group_jcfg = info.getGroupJcfg()
			tmp = controller.lookup.get_template("virtual_server.mako")
			if vs_jcfg[0]: # load successfully
				return tmp.render(vsargs = vs_jcfg[1],
					servicegroup_args = group_jcfg[1],
					msg_list = self.msg)
			else:
				self.addMsg(str(vs_jcfg[1]))
				return tmp.render(vsargs = {},
					servicegroup_args = group_jcfg[1],
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
