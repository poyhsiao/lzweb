import cherrypy
import controller
import auth
import lang
import xte_stat_dhcp_dmz
from mako import exceptions
from auth import require

class stat_dhcp_dmz(object):

	def __init__(self):
		self.msg = []
		self.caption = "DHCP (DMZ)"

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require()
	def statDhcpHandler(self, **kwargs):
		self.msg = []
		refresh_time = kwargs['time']
		stat_dhcp_dmz_jcfg = xte_stat_dhcp_dmz.get()
		tmp = controller.lookup.get_template("stat_dhcp.mako")
		if stat_dhcp_dmz_jcfg[0]: 
			return tmp.render(stat_dhcp_args = stat_dhcp_dmz_jcfg[1],
				dhcp_caption = self.caption,
				time = refresh_time,
				msg_list = self.msg)
		else:
			self.addMsg(str(stat_dhcp_dmz_jcfg[1]))
			return tmp.render(stat_dhcp_args = {},
				dhcp_caption = self.caption,
				time = refresh_time,
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		try:
			stat_dhcp_dmz_jcfg = xte_stat_dhcp_dmz.get()
			tmp = controller.lookup.get_template("stat_dhcp.mako")
			if stat_dhcp_dmz_jcfg[0]: 
				return tmp.render(stat_dhcp_args = stat_dhcp_dmz_jcfg[1],
					dhcp_caption = self.caption,
					time = "0",
					msg_list = self.msg)
			else:
				self.addMsg(str(stat_dhcp_dmz_jcfg[1]))
				return tmp.render(stat_dhcp_args = {},
					dhcp_caption = self.caption,
					time = "0",
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
