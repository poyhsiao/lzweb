import cherrypy
import json
import auth
import controller
import lang
import xte_dns
from mako import exceptions
from auth import require, member_of
 
class dns(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def dnsHandler(self, **kwargs):
		self.msg = []
		dns_jcfg = json.loads(kwargs['DnsSetting'])
		ret = xte_dns.set(dns_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("dns.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page System -> DNS"))
			return tmp.render(dnsargs = dns_jcfg, msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(dnsargs = dns_jcfg, msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			dns_jcfg = xte_dns.get()
			tmp = controller.lookup.get_template("dns.mako")
			if dns_jcfg[0]: # load successfully
				return tmp.render(dnsargs = dns_jcfg[1], msg_list = self.msg)
			else:
				self.addMsg(str(dns_jcfg[1]))
				return tmp.render(dnsargs = {}, msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
