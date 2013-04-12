import cherrypy
import json
import auth
import controller
import lang
import xte_wan_detection
from mako import exceptions
from auth import require, member_of

class wan_detection(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def wan_detHandler(self, **kwargs):
		self.msg = []
		wandet_jcfg = json.loads(kwargs['WanDetSetting'])
		ret = xte_wan_detection.set(wandet_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("wan_detection.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> WAN Detection"))
			return tmp.render(wandet_args = wandet_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(wandet_args = wandet_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		wandet_jcfg = xte_wan_detection.get()
		tmp = controller.lookup.get_template("wan_detection.mako")
		if wandet_jcfg[0]: # load successfully
			return tmp.render(wandet_args = wandet_jcfg[1], msg_list = self.msg)
		else:
			self.addMsg(str(wandet_jcfg[1]))
			return tmp.render(wandet_args = {}, msg_list = self.msg)
