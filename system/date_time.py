import cherrypy
import json
import auth
import controller
import lang
import xte_date_and_time
from mako import exceptions
from auth import require, member_of

class date_time(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def timeHandler(self, **kwargs):
		self.msg = []
		time_jcfg = json.loads(kwargs['TimeSetting'])
		tmp = controller.lookup.get_template("date_time.mako")
		ret = xte_date_and_time.set(time_jcfg, str(cherrypy.request.login))
		date_time = xte_date_and_time.get()
		if date_time[0]:
			time_jcfg["date"] = date_time[1]["date"]

		if ret[0] and date_time[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> Date/Time"))
			return tmp.render(timeargs = time_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(timeargs = time_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def set_date_time(self, date_time):
		ret = xte_date_and_time.set_datetime(json.loads(date_time), str(cherrypy.request.login))
		if ret[0]: # save successfully
			return _("Set Time Successfully")
		else:
			return (str(ret[1]))

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			time_jcfg = xte_date_and_time.get()
			tmp = controller.lookup.get_template("date_time.mako")
			if time_jcfg[0]: # load successfully
				return tmp.render(timeargs = time_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(time_jcfg[1]))
				return tmp.render(timeargs = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
