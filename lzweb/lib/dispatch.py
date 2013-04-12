import os
import sys
import re
import logging

import cherrypy

_log = logging.getLogger(__name__)

class RoutesDispatcher(cherrypy.dispatch.RoutesDispatcher):
	"""A Routes based dispatcher for CherryPy."""
	def __init__(self):
		cherrypy.dispatch.RoutesDispatcher.__init__(self)
		self.mapper.directory = xtera.paths['controllers']
		self.mapper.controller_scan = self._controller_scan
		
	def connect(self, name, route=None, controller=None, **kwargs):
		if controller in self.controllers:
			self.mapper.connect(name, route, controller=controller, **kwargs)
		else:
			self.mapper.connect(name, route,**kwargs)
			_log.debug("No available controller for (%s,%s).%r" %(name,route,kwargs))

	def setup_controllers(self,cust_controllers={}):
		for name, controller in cust_controllers.iteritems():
			self.controllers[name] = controller

	def setup_routes(self,cust_routes=[]):
		""" Setup routes with route map array """
		m = self.mapper
		for route in cust_routes:
			params = route.copy()
			if params:
				params.pop('name', None)
				params.pop('path', None)
			
			self.connect(route['name'], route['path'],**params)

	def find_handler(self, path_info):
		"""Find the right page handler, and set request.config."""
		import routes

		request = cherrypy.request
		
		config = routes.request_config()
		config.mapper = self.mapper
		if hasattr(cherrypy.request, 'wsgi_environ'):
			config.environ = cherrypy.request.wsgi_environ

		config.host = request.headers.get('Host', None)
		config.protocol = request.scheme
		config.redirect = self.redirect

		result = self.mapper.match(path_info)
		_log.debug('find %s = %s' %(path_info,result))
		config.mapper_dict = result
		params = {}
		if result:
			params = result.copy()
		else:
			_log.debug("%s not in Routes" % path_info)

		if not self.full_result:
			params.pop('controller', None)
			params.pop('action', None)
			# routes add id attribute if when routes not explicit.
			# we remove id form result, to avoid attribute error
			if not params.get('id',None):
				params.pop('id', None)

		params.update(request.params)
		request.params.update(params)


	def _controller_scan(self,directory):
		""" Scan a directory for python files and use them as controllers ."""
		controllers = []
		def find_controllers_modules(full_module_name):
			import pkgutil
			def iter_packages(full_module_name):
				mod = sys.modules.get(full_module_name,None)
				prefix = mod.__name__+'.'
				for importer, name, ispkg in pkgutil.iter_modules(mod.__path__, prefix ):
					if not name.startswith(prefix):
						name = prefix + name
					if ispkg:
						for item in iter_packages(name):
							yield item
					yield name
				
			prefix_len = len(full_module_name)+1
			mod_lists = []
			for modname in iter_packages(full_module_name):
				mod_lists.append(modname[prefix_len:].replace('.', '/')) 
			return mod_lists	
