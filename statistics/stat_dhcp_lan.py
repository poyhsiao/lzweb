import cherrypy
import auth
import controller
import lang
import xte_stat_dhcp_lan
from mako import exceptions
from auth import require

class stat_dhcp_lan(object):

	def __init__(self):
		self.msg = []
		self.caption = "DHCP (LAN)"

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require()
	def statDhcpHandler(self, **kwargs):
		self.msg = []
		refresh_time = kwargs['time']
		stat_dhcp_lan_jcfg = xte_stat_dhcp_lan.get()
		tmp = controller.lookup.get_template("stat_dhcp.mako")
		if stat_dhcp_lan_jcfg[0]: 
			return tmp.render(stat_dhcp_args = stat_dhcp_lan_jcfg[1],
				dhcp_caption = self.caption,
				time = refresh_time,
				msg_list = self.msg)
		else:
			self.addMsg(str(stat_dhcp_lan_jcfg[1]))
			return tmp.render(stat_dhcp_args = {},
				dhcp_caption = self.caption,
				time = refresh_time,
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			stat_dhcp_lan_jcfg = xte_stat_dhcp_lan.get()
			tmp = controller.lookup.get_template("stat_dhcp.mako")
			if stat_dhcp_lan_jcfg[0]: 
				return tmp.render(stat_dhcp_args = stat_dhcp_lan_jcfg[1],
					dhcp_caption = self.caption,
					time = "0",
					msg_list = self.msg)
			else:
				self.addMsg(str(stat_dhcp_lan_jcfg[1]))
				return tmp.render(stat_dhcp_args = {},
					dhcp_caption = self.caption,
					time = "0",
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
