import cherrypy
import json
import auth
import controller
import lang
import xte_syslog
from mako import exceptions
from auth import require, member_of

class syslog(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def syslogHandler(self, **kwargs):
		self.msg = []
		syslog_jcfg = json.loads(kwargs['SyslogSetting'])
		syslog_jcfg['server'] = str(syslog_jcfg['server'])
		ret = xte_syslog.set(syslog_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("syslog.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Log -> Syslog"))
			return tmp.render(syslogargs = syslog_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(syslogargs = syslog_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			syslog_jcfg = xte_syslog.get()
			tmp = controller.lookup.get_template("syslog.mako")
			if syslog_jcfg[0]: # load successfully
				return tmp.render(syslogargs = syslog_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(syslog_jcfg[1]))
				return tmp.render(syslogargs = {}, msg_list=self.msg)
		except:
			exceptions.html_error_template().render()
