import cherrypy
import controller
import auth
import lang
from mako import exceptions
from auth import require
 
class network_header(object):

	@cherrypy.expose
	@cherrypy.tools.proxy()
	@require()
 	def index(self):
 		try:
 			tmp = controller.lookup.get_template("network_header.mako")
 			return tmp.render()
 		except:
 			exceptions.html_error_template().render()
