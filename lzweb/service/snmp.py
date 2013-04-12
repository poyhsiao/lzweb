import cherrypy
import json
import auth
import controller
import lang
import xte_snmp
from mako import exceptions
from auth import require, member_of

class snmp(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def snmpHandler(self, **kwargs):
		self.msg = []
		snmp_jcfg = json.loads(kwargs['SnmpSetting'])
		ret = xte_snmp.set(snmp_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("snmp.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> SNMP"))
			return tmp.render(snmpargs = snmp_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(snmpargs = snmp_jcfg, msg_list = self.msg)
		

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			snmp_jcfg = xte_snmp.get()
			tmp = controller.lookup.get_template("snmp.mako")
			if snmp_jcfg[0]: # load successfully
				return tmp.render(snmpargs = snmp_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(snmp_jcfg[1]))
				return tmp.render(snmpargs = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
