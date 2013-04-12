import cherrypy
import json
import auth
import controller
import lang
import xte_stat_bandwidth_utilization
from mako import exceptions
from auth import require

class stat_bandwidth_utilization(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require()
	def statBandwidthUtilizationHandler(self, pos, direction, unit):
		ret = xte_stat_bandwidth_utilization.get(pos, direction, unit)
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			tmp = controller.lookup.get_template("stat_bandwidth_utilization.mako")
			return tmp.render(msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
