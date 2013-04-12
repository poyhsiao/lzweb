import cherrypy
import os
import auth
import lang
import json
import controller
from mako import exceptions
from auth import require, member_of

class Interface(object):

	@cherrypy.expose
	def refresh(self):
		cherrypy.response.headers['Content-Type'] = 'application/json'
		if cherrypy.session.missing:
			return json.dumps("False")
		try:
			cherrypy.session.acquire_lock()
			login_name = cherrypy.session.get('LoginName')
			cherrypy.session.release_lock()
			if login_name is None:
				return json.dumps("False")
			if auth.check_session_dir() is False:
				return json.dumps("Delete")
			else:
				#update account online
				f = open(controller.acc_online_dir + login_name, "w")
				f.close()
				return json.dumps("True")
		except:
			return json.dumps("False")

	@cherrypy.expose
	@require()
	def ChangeLang(self, **kwarg):
		if not kwarg:
			raise cherrypy.HTTPRedirect("/xteralink")

		cherrypy.session['iCurrentCategory'] = kwarg['CurrentCategory']
		cherrypy.session['iCurrentPage'] = kwarg['CurrentPage']
		cherrypy.session['iUserLanguage'] = kwarg['CurrentLanguage']
		mytemplate = controller.lookup.get_template("interface.mako")
		return mytemplate.render(iCurrentCategory = kwarg['CurrentCategory'],
			iCurrentPage = kwarg['CurrentPage'],
			iUserLanguage = kwarg['CurrentLanguage'])

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		try:
			cherrypy.session['iCurrentCategory'] = 0
			cherrypy.session['iCurrentPage'] = 1
			mytemplate = controller.lookup.get_template("interface.mako")
			return mytemplate.render(iCurrentCategory = cherrypy.session['iCurrentCategory'],
				iCurrentPage = cherrypy.session['iCurrentPage'],
				iUserLanguage = cherrypy.session['iUserLanguage'])
		except:
			exceptions.html_error_template().render()

