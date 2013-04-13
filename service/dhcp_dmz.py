import cherrypy
import json
import auth
import controller
import lang
import xte_dhcp_dmz
from mako import exceptions
from auth import require, member_of

class dhcp_dmz(object):

	def __init__(self):
		self.msg = []
		self.caption = "IPv4 DHCP (DMZ) Setting"

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def dhcpHandler(self, **kwargs):
		self.msg = []
		dhcp_jcfg = json.loads(kwargs['DhcpSetting'])
		ret = xte_dhcp_dmz.set(dhcp_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("dhcp.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> DHCP (DMZ)"))
			return tmp.render(dhcpargs = dhcp_jcfg,
				dhcp_caption = self.caption,
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(dhcpargs = dhcp_jcfg,
				dhcp_caption = self.caption,
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			dhcp_jcfg = xte_dhcp_dmz.get()
			tmp = controller.lookup.get_template("dhcp.mako")
			if dhcp_jcfg[0]: # load successfully
				return tmp.render(dhcpargs = dhcp_jcfg[1],
					dhcp_caption = self.caption,
					msg_list = self.msg)
			else:
				self.addMsg(str(dhcp_jcfg[1]))
				return tmp.render(dhcpargs = {},
					dhcp_caption = self.caption,
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
