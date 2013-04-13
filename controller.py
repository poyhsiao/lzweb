from mako.template import Template
from mako.lookup import TemplateLookup
from mako import exceptions

tmpdir = '/swlb/webui/templates/'
lookup = TemplateLookup(directories=[tmpdir],
		input_encoding='utf8',
		output_encoding='utf8',
		imports=['import cherrypy'])
middlewaredir = '/swlb/middleware'
jcfgdir = '/swlb/middleware/unittest/'
acc_online_dir = '/tmp/acc_online/'
acc_session_dir = '/tmp/acc_session/'
