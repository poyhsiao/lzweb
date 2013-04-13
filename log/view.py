import cherrypy
import auth
import controller
import lang
import xte_viewlog
from mako import exceptions
from auth import require

class view(object):

	@cherrypy.expose
	@require()
	def refreshLog(self, logtype):
		view_jcfg = xte_viewlog.get()
		if view_jcfg[0]:
			if logtype == "system":
				view_jcfg[1]['system'].reverse()
				return view_jcfg[1]['system']
			else:
				view_jcfg[1]['traffic'].reverse()
				return view_jcfg[1]['traffic']
		else:
				return []

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
	def index(self):
		try:
			view_jcfg = xte_viewlog.get()
			tmp = controller.lookup.get_template("view.mako")
			if view_jcfg[0]:
				return tmp.render(viewargs = view_jcfg[1])
			else:
				return tmp.render(viewargs = {})
		except:
			exceptions.html_error_template().render()
