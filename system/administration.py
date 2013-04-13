import cherrypy
import cgi
import tempfile
import os
import json
import auth
import controller
import lang
import xte_administration
from mako import exceptions
from auth import require, member_of

firmware_updatekey = ""

class myFieldStorage(cgi.FieldStorage):
	def make_file(self, binary=None):
		return tempfile.NamedTemporaryFile()

def noBodyProcess():
	cherrypy.request.process_request_body = False

cherrypy.tools.noBodyProcess = cherrypy.Tool('before_request_body', noBodyProcess)

class administration(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def add_account(self, name, param):
		ret = xte_administration.add_account(str(name), json.loads(param), str(cherrypy.request.login))
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)
	
	@cherrypy.expose
	@require(member_of("admin"))
	def edit_account(self, name, password, group):
		ret = xte_administration.change_password(str(name), str(password), str(cherrypy.request.login))
		if ret[0] and xte_administration.get()[1][name]["g"] != group:
			ret = xte_administration.change_group(str(name), str(group), str(cherrypy.request.login))

		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@require(member_of("admin"))
	def del_account(self, name):
		ret = xte_administration.delete_account(str(name), str(cherrypy.request.login))
		auth.delete_session_dir(name)
		cherrypy.response.headers['Content-Type'] = 'application/json'
		return json.dumps(ret)

	@cherrypy.expose
	@require(member_of("admin"))
	def factory_default(self):
		ret = xte_administration.factory_default()
		return (str(ret[1]))

	@cherrypy.expose
	@require(member_of("admin"))
	def reboot(self):
		ret = xte_administration.reboot()
		return (lang.change_error_msg(ret[1]))
		
	@cherrypy.expose
	@require(member_of("admin"))
	def save_cfg(self):
		cherrypy.response.headers['Content-Type'] = "application/x-download"
		cherrypy.response.headers['Content-Disposition'] = 'attachment; filename="XteraLink.txt"'
		cherrypy.response.headers['Pragma'] = "public"
		cherrypy.response.headers['Cache-Control'] = "private"
		cherrypy.response.headers['Expires'] = "0"

		ret = xte_administration.export()
		if ret[0]:
			return ret[1]
		else:
			return {}

	@cherrypy.expose
	@require(member_of("admin"))
	@cherrypy.tools.noBodyProcess()
	def restore_cfg(self, cfgFile=None):
		CfgPath = "/tmp/cfgfile"
		lcHDRS = {}
		for key, val in cherrypy.request.headers.iteritems():
		 	lcHDRS[key.lower()] = val

		formFields = myFieldStorage(fp=cherrypy.request.rfile,
						 headers=lcHDRS,
						 environ={'REQUEST_METHOD':'POST'},
						 keep_blank_values=True)

		cfgFile = formFields['cfgFile']
		os.link(cfgFile.file.name, CfgPath)

		ret = xte_administration.importing(CfgPath, str(cherrypy.request.login))
		login_name = cherrypy.session.get("LoginName")
		administration_jcfg = xte_administration.get()
		for dirPath, dirNames, fileNames in os.walk(controller.acc_online_dir):
			accName = fileNames
		tmp = controller.lookup.get_template("administration.mako")
		self.msg = []
		if ret[0]:
			self.addMsg(_("Restore Configuration successfully"))
			return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)

	@cherrypy.expose
	@require(member_of("admin"))
	def firmware_updatekey(self, updatekey):
		global firmware_updatekey
		firmware_updatekey = updatekey

	@cherrypy.expose
	@require(member_of("admin"))
	@cherrypy.tools.noBodyProcess()
	def firmware_update(self, fwupfile=None):
		global firmware_updatekey
		CfgPath = "/tmp/updatefile"
		lcHDRS = {}
		for key, val in cherrypy.request.headers.iteritems():
		 	lcHDRS[key.lower()] = val

		formFields = myFieldStorage(fp=cherrypy.request.rfile,
						 headers=lcHDRS,
						 environ={'REQUEST_METHOD':'POST'},
						 keep_blank_values=True)

		fwupfile = formFields['fwupfile']
		os.link(fwupfile.file.name, CfgPath)

		ret = xte_administration.firmware_update(firmware_updatekey, CfgPath)

		login_name = cherrypy.session.get("LoginName")
		administration_jcfg = xte_administration.get()
		for dirPath, dirNames, fileNames in os.walk(controller.acc_online_dir):
			accName = fileNames
		tmp = controller.lookup.get_template("administration.mako")
		self.msg = []
		if ret[0]:
			self.addMsg(_("Firmware update successfully, system rebooting..."))
			return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)

	@cherrypy.expose
	@require(member_of("admin"))
	@cherrypy.tools.noBodyProcess()
	def firmware_downgrade(self, fwdownfile=None):
		CfgPath = "/tmp/downgradefile"
		lcHDRS = {}
		for key, val in cherrypy.request.headers.iteritems():
		 	lcHDRS[key.lower()] = val

		formFields = myFieldStorage(fp=cherrypy.request.rfile,
						 headers=lcHDRS,
						 environ={'REQUEST_METHOD':'POST'},
						 keep_blank_values=True)

		fwdownfile = formFields['fwdownfile']
		os.link(fwdownfile.file.name, CfgPath)

		ret = xte_administration.firmware_downgrade(CfgPath)

		login_name = cherrypy.session.get("LoginName")
		administration_jcfg = xte_administration.get()
		for dirPath, dirNames, fileNames in os.walk(controller.acc_online_dir):
			accName = fileNames
		tmp = controller.lookup.get_template("administration.mako")
		self.msg = []
		if ret[0]:
			self.addMsg(_("Firmware downgrade successfully, system rebooting..."))
			return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)
		else:
			self.addMsg(lang.change_error_msg(ret[1]))
			return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require(member_of("admin"))
	def index(self):
		self.msg = []
		try:
			login_name = cherrypy.session.get("LoginName")
			administration_jcfg = xte_administration.get()
			for dirPath, dirNames, fileNames in os.walk(controller.acc_online_dir):
				accName = fileNames
			tmp = controller.lookup.get_template("administration.mako")
			if administration_jcfg[0]: # load successfully
				return tmp.render(administration_args = administration_jcfg[1],
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)
			else:
				self.addMsg(str(administration_jcfg[1]))
				return tmp.render(administration_args = {},
					acc_list = accName,
					user_name = login_name,
					msg_list = self.msg)
			return tmp.render()
		except:
			exceptions.html_error_template().render()
