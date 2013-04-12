import cherrypy
import json
import auth
import controller
import lang
import info
import xte_nat
import xte_summary
from mako import exceptions
from auth import require, member_of

class nat(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def natHandler(self, **kwargs):
		self.msg = []
		group_jcfg = info.getGroupJcfg()
		nat_jcfg = json.loads(kwargs['NatSetting'])
		summary_jcfg = xte_summary.get()
		if not summary_jcfg[0]:
			summary_jcfg[1] = {};
		ret = xte_nat.set(nat_jcfg, str(cherrypy.request.login))
		tmp = controller.lookup.get_template("nat.mako")
		if ret[0]: # save successfully
			self.addMsg(_("Settings are applied for page Service -> NAT"))
			return tmp.render(nat_args = nat_jcfg,
				ipgroup_args = group_jcfg[0],
				servicegroup_args = group_jcfg[1],
				fqdn_args = group_jcfg[2],
				summary_args = summary_jcfg[1],
				msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(nat_args = nat_jcfg,
				ipgroup_args = group_jcfg[0],
				servicegroup_args = group_jcfg[1],
				fqdn_args = group_jcfg[2],
				summary_args = summary_jcfg[1],
				msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		self.msg = []
		try:
			nat_jcfg = xte_nat.get()
			group_jcfg = info.getGroupJcfg()
			summary_jcfg = xte_summary.get()
			if not summary_jcfg[0]:
				summary_jcfg[1] = {};
			tmp = controller.lookup.get_template("nat.mako")
			if nat_jcfg[0]: # load successfully
				return tmp.render(nat_args = nat_jcfg[1],
					ipgroup_args = group_jcfg[0],
					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					summary_args = summary_jcfg[1],
					msg_list = self.msg)
			else:
				self.addMsg(str(nat_jcfg[1]))
				return tmp.render(nat_args = {},
					ipgroup_args = group_jcfg[0],
 					servicegroup_args = group_jcfg[1],
					fqdn_args = group_jcfg[2],
					summary_args = summary_jcfg[1],
					msg_list = self.msg)
		except:
			exceptions.html_error_template().render()
