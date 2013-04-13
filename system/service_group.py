import cherrypy
import json
import auth
import controller
import lang
import xte_service_group
from mako import exceptions
from auth import require, member_of

class service_group(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def servicegroupHandler(self, **kwargs):
		self.msg = []
		servicegroup_jcfg = json.loads(kwargs['ServicegroupSetting'])
		ret = xte_service_group.set(servicegroup_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("service_group.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> Service Group"))
			return tmp.render(servicegroup_args = servicegroup_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(servicegroup_args = servicegroup_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			servicegroup_jcfg = xte_service_group.get()
			tmp = controller.lookup.get_template("service_group.mako")
			if servicegroup_jcfg[0]: # load successfully
				return tmp.render(servicegroup_args = servicegroup_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(servicegroup_jcfg[1]))
				return tmp.render(servicegroup_args = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
