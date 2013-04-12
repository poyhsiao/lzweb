import cherrypy
import json
import auth
import controller
import lang
import xte_arp_table
from mako import exceptions
from auth import require, member_of

class arp_table(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def arptableHandler(self, **kwargs):
		self.msg = []
		arp_table_jcfg = json.loads(kwargs['ArptableSetting'])
		ret = xte_arp_table.set(arp_table_jcfg, str(cherrypy.request.login))
		arp_table_new_jcfg = xte_arp_table.get()
		tmp = controller.lookup.get_template("arp_table.mako")
		if ret[0] and arp_table_new_jcfg[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> ARP Table"))
			return tmp.render(arptable_args = arp_table_new_jcfg[1], msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(arptable_args = arp_table_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			arp_table_jcfg = xte_arp_table.get()
			tmp = controller.lookup.get_template("arp_table.mako")
			if arp_table_jcfg[0]: # load successfully
				return tmp.render(arptable_args = arp_table_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(arp_table_jcfg[1]))
				return tmp.render(arptable_args = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
