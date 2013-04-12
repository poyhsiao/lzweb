import cherrypy
import auth
import controller
import lang
import xte_stat_wan_detection
from mako import exceptions
from auth import require

class stat_wan_detection(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require()
	def statWanDetectionHandler(self, **kwargs):
		self.msg = []
		wan_idx = kwargs['wan_index']
		refresh_time = kwargs['time']
		stat_wan_det_jcfg = xte_stat_wan_detection.get()
		tmp = controller.lookup.get_template("stat_wan_detection.mako")
		if stat_wan_det_jcfg[0]: 
			return tmp.render(stat_wan_det_args = stat_wan_det_jcfg[1],
				wan_index = wan_idx,
				time = refresh_time,
				msg_list = self.msg)
		else:
			self.addMsg(str(stat_wan_det_jcfg[1]))
			return tmp.render(stat_wan_det_args = {},
				wan_index = wan_idx,
				time = refresh_time,
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			stat_wan_det_jcfg = xte_stat_wan_detection.get()
			tmp = controller.lookup.get_template("stat_wan_detection.mako")
			if stat_wan_det_jcfg[0]: 
				return tmp.render(stat_wan_det_args = stat_wan_det_jcfg[1],
					wan_index = "1",
					time = "0",
					msg_list = self.msg)
			else:
				self.addMsg(str(stat_wan_det_jcfg[1]))
				return tmp.render(stat_wan_det_args = {},
					wan_index = "1",
					time = "0",
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
