import sys
import os
import shutil
import time
import logging
_log = logging.getLogger(__name__)

import cherrypy
from cherrypy.process import plugins
import controller

if __name__ == '__main__':
	packagePath=os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
	sys.path.insert(0,packagePath)
	_rootdir = os.path.normpath(os.path.dirname(__file__)) 
	while _rootdir != os.path.normpath(os.path.join(_rootdir,'..')) and \
			not os.path.isdir(os.path.join(_rootdir,'etc')): 
		_rootdir = os.path.normpath(os.path.join(_rootdir,'..'))
	os.environ['XTERA_ROOT']= os.path.abspath(_rootdir)

_curdir = os.path.join("/swlb/webui", os.path.dirname(__file__))

sys.path.append(controller.middlewaredir)

sys.path.insert(0, _curdir)
sys.path.insert(0, _curdir+"/system")
sys.path.insert(0, _curdir+"/service")
sys.path.insert(0, _curdir+"/statistics")
sys.path.insert(0, _curdir+"/log")

import xt_func
from login import Login
from auth import AuthController
from interface import Interface

from summary import summary
from dns import dns
from network_header import network_header
from network import network
from wan_detection import wan_detection
from fqdn import fqdn
from ip_group import ip_group
from service_group import service_group
from diagnostic_tools import diagnostic_tools
from arp_table import arp_table
from date_time import date_time
from ddns import ddns
from administration import administration
from dhcp_lan import dhcp_lan
from dhcp_dmz import dhcp_dmz
from virtual_server import virtual_server
from firewall import firewall
from connection_limit import connection_limit
from auto_routing import auto_routing
from nat import nat
from snmp import snmp
from stat_bandwidth_utilization import stat_bandwidth_utilization
from stat_wan_detection import stat_wan_detection
from stat_dhcp_lan import stat_dhcp_lan
from stat_dhcp_dmz import stat_dhcp_dmz
from stat_fqdn import stat_fqdn
from view import view
from syslog import syslog


class RepeatableTimer(object):
	def __init__(self, interval, function, args=[], kwargs={}):
		self.interval = interval
		self.function = function
		self.args = args
		self.kwargs = kwargs

	def start(self):
		self.stop()
		import threading
		self._timer = threading.Timer(self.interval, self._run)
		self._timer.setDaemon(True)
		self._timer.start()

	def restart(self):
		self.start()

	def stop(self):
		if self.__dict__.has_key("_timer"):
			self._timer.cancel()
			del self._timer

	def _run(self):
		try:
			self.function(*self.args, **self.kwargs)
		except:
			pass
		self.restart()

try:
	def config_web(cfg={}):
		# override Cherrypy's default session behaviour

		application_conf = {
			'/' : {
				'tools.staticdir.root': _curdir,
				'tools.staticdir.on' : True,
				'tools.staticdir.dir' : ".",
				'tools.sessions.on'  : True,
				'tools.sessions.storage_type' : "file",
				'tools.sessions.storage_path' : "/tmp/",
				'tools.sessions.timeout' : 60,
				'tools.sessions.locking' : 'explicit',
				'tools.auth.on': True,
				'tools.encode.on' : True,
				'tools.encode.encoding': "utf-8"
			},
			'/favicon.ico' : {
				'tools.staticfile.on' : True,
				'tools.staticfile.filename' : os.path.join(_curdir,'/image/favicon.ico')
			},
			'/css' : {
				'tools.staticdir.on' : True,
				'tools.staticdir.dir' : "css"
			},
			'/script' : {
				'tools.staticdir.on' : True,
				'tools.staticdir.dir' : "script"
			},
			'/image' : {
				'tools.staticdir.on' : True,
				'tools.staticdir.dir' : "image"
			},
		}

		#No Root controller as we provided all our own.
		#cherrypy.tree.mount(root=None, config=config)
		root = Login()
		root.logout = AuthController().logout
		root.xteralink = Interface()
		root.system = summary()
		root.system.summary = summary()
		root.system.dns = dns()
		root.system.network_header = network_header()
		root.system.network = network()
		root.system.wan_detection = wan_detection()
		root.system.fqdn = fqdn()
		root.system.ip_group = ip_group()
		root.system.service_group = service_group()
		root.system.diagnostic_tools = diagnostic_tools()
		root.system.arp_table = arp_table()
		root.system.date_time = date_time()
		root.system.ddns = ddns()
		root.system.administration = administration()
		root.service = dhcp_lan()
		root.service.dhcp_lan = dhcp_lan()
		root.service.dhcp_dmz = dhcp_dmz()
		root.service.virtual_server = virtual_server()
		root.service.firewall = firewall()
		root.service.connection_limit = connection_limit()
		root.service.auto_routing = auto_routing()
		root.service.nat = nat()
		root.service.snmp = snmp()
		root.statistics = stat_bandwidth_utilization()
		root.statistics.stat_bandwidth_utilization = stat_bandwidth_utilization()
		root.statistics.stat_wan_detection = stat_wan_detection()
		root.statistics.stat_dhcp_lan = stat_dhcp_lan()
		root.statistics.stat_dhcp_dmz = stat_dhcp_dmz()
		root.statistics.stat_fqdn = stat_fqdn()
		root.log = view();
		root.log.view = view();
		root.log.syslog = syslog();
		cherrypy.tree.mount(root, "/", config=application_conf)

		cherrypy.server.unsubscribe()
		server1 = cherrypy._cpserver.Server()
		server1.socket_port = 443
		server1._socket_host = '0.0.0.0'
		server1.ssl_certificate = '/usr/local/conf/server.crt'
		server1.ssl_private_key = '/usr/local/conf/server.key'
		server1.subscribe()

		server2 = cherrypy._cpserver.Server()
		server2.socket_port = 80
		server2._socket_host = "0.0.0.0"
		server2.subscribe()

	def run(blocking=True,cfg={}):

		config_web(cfg)

		"""
		if cherrypy.config.get('environment',None) == 'production' :
			cherrypy.config.update({'error_page.default': "%s/index.html" % (xtera.paths['static'])
			,'error_page.401': "%s/errors/401.html" % (xtera.paths['static'])
			,'error_page.403': "%s/errors/403.html" % (xtera.paths['static'])
			,'error_page.404': "%s/errors/404.html" % (xtera.paths['static'])
			,'error_page.500': "%s/errors/500.html" % (xtera.paths['static'])
			}
		)
		"""
		# remove session and account online dir
		xt_func.sudo(["rm -rf", '/tmp/session-*'])
		xt_func.sudo(["rm -rf", controller.acc_online_dir])
		xt_func.sudo(["rm -rf", controller.acc_session_dir])
		os.makedirs(controller.acc_online_dir)
		os.makedirs(controller.acc_session_dir)

		def check_acc():
			for dirPath, dirNames, fileNames in os.walk(controller.acc_online_dir):
				for f in fileNames:
					now_time = time.time()
					acc_time = os.path.getmtime(controller.acc_online_dir + f)
					# check account have expired over 60 seconds
					if (int(now_time) - int(acc_time) > 60):
						xt_func.sudo(["rm -rf", controller.acc_online_dir + f])
						# also delete account seesion dir: may has bug, so mark it
						#for dirPath_1, dirNames_1, fileNames_1 in os.walk(controller.acc_session_dir):
						#	for f_1 in fileNames_1:
						#		xt_func.sudo(["rm -rf", controller.acc_session_dir + f_1])

		# every 30 seconds to check account status
		t = RepeatableTimer(30, check_acc)
		t.start()

		#bind log controll with cherrypy
		def _setlog(k,v):
			setattr(cherrypy.log, k, )
		cherrypy.config.namespaces['log'] = _setlog

		engine = cherrypy.engine

		"""Setup the signal handler to stop the application while running"""
		if hasattr(engine, "signal_handler"):
			engine.signal_handler.subscribe()
		if hasattr(engine, "console_control_handler"):
			engine.console_control_handler.subscribe()

		cherrypy.engine.start()
		if blocking:
			# this routine that starts this as a windows service will not want us to block here.
			cherrypy.engine.block()

		if __name__ == '__main__':
			run(blocking=True)

except Exception, e:
	_log.error('Unable to start WebUI')
	_log.exception(e)
	sys.exit(1)
