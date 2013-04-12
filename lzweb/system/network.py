import cherrypy
import json
import auth
import controller
import lang
import const
import xte_network
from mako import exceptions
from auth import require, member_of

class network(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def networkHandler(self, **kwargs):
		self.msg = []
		network_jcfg = json.loads(kwargs['NetworkSetting'])
		ret = xte_network.set(network_jcfg, str(cherrypy.request.login))
		# To avoid password wrong
		network_cfg = xte_network.get()
		usb_jcfg = xte_network.getusb()
		for i in const.ALL_NICS:
			network_jcfg[i]["pppoe-mode"]["password"] = network_cfg[1][i]["pppoe-mode"]["password"]
	
		tmp = controller.lookup.get_template("network.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> Network Setting"))
			return tmp.render(network_args = network_jcfg, usb_args = usb_jcfg[1], msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(network_args = network_jcfg, usb_args = usb_jcfg[1], msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			network_jcfg = xte_network.get()
			usb_jcfg = xte_network.getusb()
			tmp = controller.lookup.get_template("network.mako")
			if network_jcfg[0]: # load successfully
				return tmp.render(network_args = network_jcfg[1], usb_args = usb_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(network_jcfg[1]))
				return tmp.render(network_args = {}, usb_args = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
