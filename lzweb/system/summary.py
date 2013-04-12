import cherrypy
import json
import auth
import controller
import lang
import xte_summary
import const
from mako import exceptions
from auth import require, member_of

class summary(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def summaryHandler(self, **kwargs):
		self.msg = []
		pos = kwargs['position']
		summary_jcfg = xte_summary.get()
		tmp = controller.lookup.get_template("summary.mako")

		for index in const.ALL_NICS:
			if index == pos:
				ret = xte_summary.reconnect_dynamic_wan(pos)
				if ret[0]: # reconnect successfully
					self.addMsg(_("Reconnect successfully"))
				else:
					self.addMsg(lang.change_error_msg(ret[1]))
		
		for index in const.ALL_USBS:
			if index == pos:
				ret = xte_summary.reconnect_dynamic_usb_wan(pos)
				if ret[0]: # reconnect successfully
					self.addMsg(_("Reconnect successfully"))
				else:
					self.addMsg(lang.change_error_msg(ret[1]))		
		

		if summary_jcfg[0]: # load successfully
			return tmp.render(summary_args = summary_jcfg[1], msg_list = self.msg)
		else:
			self.addMsg(str(summary_jcfg[1]))
			return tmp.render(summary_args = {}, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			summary_jcfg = xte_summary.get()
			tmp = controller.lookup.get_template("summary.mako")
			if summary_jcfg[0]: # load successfully
				return tmp.render(summary_args = summary_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(summary_jcfg[1]))
				return tmp.render(summary_args = {}, msg_list = self.msg)
			return tmp.render()
		except:
			exceptions.html_error_template().render()
