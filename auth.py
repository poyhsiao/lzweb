# -*- encoding: UTF-8 -*-
#
# Form based authentication for CherryPy. Requires the
# Session tool to be loaded.
#

import os
import cherrypy
import controller
import xte_administration
import xt_func
import xtd_logd
import lang

SESSION_KEY = 'LoginName'

def delete_session_dir(name):
	xt_func.sudo(["rm -rf", controller.acc_session_dir + str(name)])

def check_session_dir():
	cherrypy.session.acquire_lock()
	login_name = cherrypy.session.get(SESSION_KEY)
	cherrypy.session.release_lock()
	hasSession = False
	for dirPath, dirNames, fileNames in os.walk(controller.acc_session_dir):
		for f in fileNames:
			if f == login_name:
				hasSession = True
				break

	return hasSession

def check_duplicate_session():
	cherrypy.session.acquire_lock()
	login_name = cherrypy.session.get(SESSION_KEY)
	cherrypy.session.release_lock()
	if cherrypy.session.id == cherrypy.session.originalid and login_name is not None:
		raise cherrypy.HTTPRedirect("/xteralink")

def check_credentials(name, password):
	"""Verifies credentials for username and password.
	Returns None on success or a string describing the error on failure"""

	admin_jcfg = xte_administration.get()
	if admin_jcfg[0]:
		if name not in admin_jcfg[1]:
			return _("Account: %s is not found") %name
		elif password != admin_jcfg[1][name]["p"]:
			# log
			xtd_logd.add_log("Incorrect " + str(name) + " password from " + str(cherrypy.request.remote.ip))
			return _("Password is not correct!")
		else:
			return None
	else:
		return _("Get administration configuration error!")

	# An example implementation which uses an ORM could be:
	# u = User.get(name)
	# if u is None:
	#     return u"Username %s is unknown to me." % name
	# if u.password != md5.new(password).hexdigest():
	#     return u"Incorrect password"

def check_auth(*args, **kwargs):
	"""A tool that looks in config for 'auth.require'. If found and it
	is not None, a login is required and the entry is evaluated as a list of
	conditions that the user must fulfill"""
	conditions = cherrypy.request.config.get('auth.require', None)
	if conditions is not None:
		cherrypy.session.acquire_lock()
		username = cherrypy.session.get(SESSION_KEY)
		cherrypy.session.release_lock()
		if username:
			cherrypy.request.login = username
			for condition in conditions:
				# A condition is just a callable that returns true or false
				if not condition():
					raise cherrypy.HTTPRedirect("/logout")
		else:
			raise cherrypy.HTTPRedirect("/logout")

cherrypy.tools.auth = cherrypy.Tool('before_handler', check_auth)

def require(*conditions):
	 """A decorator that appends conditions to the auth.require config
	 variable."""
	 def decorate(f):
	 	if not hasattr(f, '_cp_config'):
	 		f._cp_config = dict()
	 	if 'auth.require' not in f._cp_config:
	 		f._cp_config['auth.require'] = []
	 	f._cp_config['auth.require'].extend(conditions)
	 	return f
	 return decorate


# Conditions are callables that return True
# if the user fulfills the conditions they define, False otherwise
#
# They can access the current username as cherrypy.request.login
#
# Define those at will however suits the application.

def member_of(groupname):
	def check():
		cherrypy.session.acquire_lock()
		name = cherrypy.session.get(SESSION_KEY)
		cherrypy.session.release_lock()
		admin_jcfg = xte_administration.get()
		if admin_jcfg[0]:
			return groupname == admin_jcfg[1][name]["g"]
		else:
			return false
	return check

def name_is(reqd_username):
	return lambda: reqd_username == cherrypy.request.login

def any_of(*conditions):
	"""Returns True if any of the conditions match"""
	def check():
		for c in conditions:
			if c():
				return True
		return False
	return check

# By default all conditions are required, but this might still be
# needed if you want to use it inside of an any_of(...) condition
def all_of(*conditions):
	"""Returns True if all of the conditions match"""
	def check():
		for c in conditions:
			if not c():
				return False
		return True
	return check


# Controller to provide login and logout actions

class AuthController(object):

	def on_login(self, username):
		"""Called on successful login"""
		check_duplicate_session()
		admin_jcfg = xte_administration.get()
		cherrypy.session.clean_up()
		cherrypy.session.delete()
		cherrypy.session.regenerate()
		cherrypy.session[SESSION_KEY] = cherrypy.request.login = username
		cherrypy.session['LoginGroup'] = admin_jcfg[1][username]["g"]
		xtd_logd.add_log(str(username) + " logged in from " + str(cherrypy.request.remote.ip))
		f = open(controller.acc_online_dir + username, "w")
		f.close()
		f = open(controller.acc_session_dir + username, "w")
		f.close()
		raise cherrypy.HTTPRedirect("/xteralink")
	
	@cherrypy.expose
	def login(self, username=None, password=None, from_page="/"):
		return check_credentials(username, password)

	@cherrypy.expose
	def logout(self, from_page="/"):
		cherrypy.session.acquire_lock()
		name = cherrypy.session.get(SESSION_KEY)
		cherrypy.session.release_lock()
		if name is not None:
			xtd_logd.add_log(str(name) + " logged out from " + str(cherrypy.request.remote.ip))

		xt_func.sudo(["rm -rf", controller.acc_online_dir + str(name)])
		cherrypy.session.clear()
		cherrypy.session.delete()
		raise cherrypy.HTTPRedirect(from_page or "/")

# Redirect HTTP to HTTPS
def proxy():
	if (cherrypy.request.local.port != 443):
		server_url = cherrypy.request.base
		server_https_url = server_url.replace('http', 'https')
		raise cherrypy.HTTPRedirect(server_https_url)

cherrypy.tools.proxy = cherrypy.Tool('before_request_body', proxy)
