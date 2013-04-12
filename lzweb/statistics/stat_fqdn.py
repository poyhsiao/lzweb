import cherrypy
import auth
import controller
import lang
import xte_stat_fqdn
from mako import exceptions
from auth import require

class stat_fqdn(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require()
	def statFqdnHandler(self, **kwargs):
		self.msg = []
		refresh_time = kwargs['time']
		stat_fqdn_jcfg = xte_stat_fqdn.get()
		tmp = controller.lookup.get_template("stat_fqdn.mako")
		if stat_fqdn_jcfg[0]: 
			return tmp.render(stat_fqdn_args = stat_fqdn_jcfg[1],
				time = refresh_time,
				msg_list = self.msg)
		else:
			self.addMsg(str(stat_fqdn_jcfg[1]))
			return tmp.render(stat_fqdn_args = {},
				time = refresh_time,
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			stat_fqdn_jcfg = xte_stat_fqdn.get()
			tmp = controller.lookup.get_template("stat_fqdn.mako")
			if stat_fqdn_jcfg[0]: 
				return tmp.render(stat_fqdn_args = stat_fqdn_jcfg[1],
					time = "0",
					msg_list = self.msg)
			else:
				self.addMsg(str(stat_fqdn_jcfg[1]))
				return tmp.render(stat_fqdn_args = {},
					time = "0",
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
