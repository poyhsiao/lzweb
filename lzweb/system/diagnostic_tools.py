import cherrypy
import json
import auth
import controller
import lang
import xte_diagnostic_tools
from mako import exceptions
from auth import require, member_of

class diagnostic_tools(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def enforce(self):
		ret = xte_diagnostic_tools.do_arpenforce()
		if ret[0]: # successfully
			return _("ARP caches are updated")
		else:
			retun (str(ret[1]))

	@cherrypy.expose
	@require(member_of("admin"))
	def conflict_test(self):
		ret = xte_diagnostic_tools.do_ip_conflict_test()
		if ret[0]: # some ip conflict
			# [(ip, pos, mac), (ip, pos, mac), ...]
			message = ''
			for e in ret[1]:
				message += '%s: %s on %s\n' % (_(e[1]),e[0],e[2][:17])
			return message
		else:
			return _("Test finished successfully")

	@cherrypy.expose
	@require(member_of("admin"))
	def ping(self, target, pos):
		ret = xte_diagnostic_tools.start_ping(pos, target)
		if not ret[0]: # some thing error
			return (str(ret[1]))

	@cherrypy.expose
	@require(member_of("admin"))
	def poll_ping_result(self):
		ret = xte_diagnostic_tools.poll_ping_result()
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@require(member_of("admin"))
	def traceroute(self, target, pos):
		ret = xte_diagnostic_tools.start_traceroute(pos, target)
		if not ret[0]: # some thing error
			return (str(ret[1]))

	@cherrypy.expose
	@require(member_of("admin"))
	def poll_traceroute_result(self):
		ret = xte_diagnostic_tools.poll_traceroute_result()
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@require(member_of("admin"))
	def kill_ping(self):
		ret = xte_diagnostic_tools.kill_ping()
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@require(member_of("admin"))
	def kill_traceroute(self):
		ret = xte_diagnostic_tools.kill_traceroute()
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			tmp = controller.lookup.get_template("diagnostic_tools.mako")
			return tmp.render(text = "", msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
