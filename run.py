import sys
import os
import logging

if 'XTERA_ROOT' not in os.environ :
	_rootdir = os.getcwd()
	while not os.path.isdir(os.path.join(_rootdir,'etc')) and \
			_rootdir != os.path.normpath(os.path.join(_rootdir,'..')) :
		_rootdir = os.path.normpath(os.path.join(_rootdir,'..'))
	os.environ['XTERA_ROOT']= _rootdir

cfg={    
	'environment':'staging' ,
	'engine.autoreload_on': True,
	'checker.on': False,
	'tools.log_headers.on': False,
	'request.show_tracebacks': True,
	'log.screen': True,
}

import root
root.run(blocking=True,cfg=cfg)
