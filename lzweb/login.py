import cherrypy
import os
import gettext
import auth
import lang
import controller
import interface
from auth import AuthController, require, member_of, name_is

class Login(object):

	def __init__(self):
		self.msg = []

	def addMsg(self, msg):
		self.msg.append(msg)

	@cherrypy.expose
	def doLogin(self, Language=None, AccountAlias=None, Password=None, CheckAdmin=None, Action=None, **kwargs):
		self.msg = []
		mytemplate = controller.lookup.get_template("login.mako")
		if not Language:
			cherrypy.session['iUserLanguage'] = 0
		else:
			cherrypy.session['iUserLanguage'] = Language

		if Action == "ChangeLanguage":

			return mytemplate.render(msg_list = self.msg)

		auth = AuthController()
		ret = auth.login(AccountAlias, Password)
		if ret:  # error
			self.addMsg(ret)
			return mytemplate.render(msg_list = self.msg)
		else:
			auth.on_login(AccountAlias)

	@cherrypy.expose
	@cherrypy.tools.proxy()
	def index(self):
		self.msg = []
		# set default language
		cherrypy.session['iUserLanguage'] = 0

		# if user using duplicate session, it will redirect system/summary page
		auth.check_duplicate_session()

		mytemplate = controller.lookup.get_template("login.mako")
		return mytemplate.render(msg_list = self.msg)
