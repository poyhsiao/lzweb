# -*- coding: utf-8 -*1-
import __builtin__
import gettext
import jcfg
from types import *
from jcfg import N_

# These are extracted from /data/trunk/link/release, and maually put here for pygettext.py
# to get them into the .pot file.
BACKEND_MESSAGES = [
	N_('Only root can apply remote downgrade file'),
	N_('Patch too new'),
	N_('Incompatible version'),
	N_('Checksum error'),
	N_('I/O error'),
	N_('Only root can apply remote update file'),
	N_('Patch too old'),
	N_('Only root can apply remote update file'),
	N_('Invalid update file'),
	N_('Debug on'),
	N_('Debug off'),
	N_('Incompatible version/build'),
	N_('Incompatible platform'),
	N_('Invalid update key'),
	N_('Invalid update file type'),
	N_('Invalid downgrade file'),
	N_('Invalid downgrade file type')
]

localedir = '/swlb/webui/locale/'
en_trans = gettext.translation('messages', localedir, languages=['en_US'])
ct_trans = gettext.translation('messages', localedir, languages=['zh_TW'])
cs_trans = gettext.translation('messages', localedir, languages=['zh_CN'])
	
def smart_gettext(s):
	import cherrypy
	global en_trans, ct_trans, cs_trans
	
	lang = cherrypy.session.get('iUserLanguage')
	if lang == '1': # Traditional Chinese
		return ct_trans.gettext(s)
	if lang == '2': # Simplified Chinese
		return cs_trans.gettext(s)
	# English
	return en_trans.gettext(s)

__builtin__._ = smart_gettext


def change_error_msg(msgArray):
	if msgArray[-1]==jcfg.SEMERR_INVAL_VAL:
		# ['auto-routing', 'aging', u'-1', 'invalid value']
		# ['auto-routing', 'parameter', u'aaaa', 'invalid value']
		# ['auto-routing', 'rule-array', 1, 'source', u'333.333.333.333', 'invalid value']
		# ['ip-group', 'group-array', 1, 'ip-array', 1, u'333.333.333.333', 'invalid value']
		msgArray.pop(0)		# drop tag
		msgArray.pop(-1)	# drop 'invalid value'
		message = ''
		while msgArray:
			e = msgArray.pop(0)
			if e[-6:]=='-array':
				index = msgArray.pop(0)
				message += '%s %s > ' % (_(e[:-6]), index)
			else:
				message += '%s > ' % (_(e))
		message = '%s : %s' % (message[:-2], _(jcfg.SEMERR_INVAL_VAL))
	elif msgArray[-1]=="can't be empty":
		# ["network", pos, "static-mode", "ip", "can't be empty"]
		msgArray.pop(0)		# drop tag
		if len(msgArray) == 3:
			message = '%s > %s %s.' % tuple([_(e) for e in msgArray])
		else:
			message = '%s > %s > %s %s.' % tuple([_(e) for e in msgArray])
	elif msgArray[0]=='wan-detection':
		# ['wan-detecion', 'wan1', u'icmp-target', 'too less elements']
		# ['wan-detection', 'wan1', u'icmp-target', '#2', u'198.41.0.10', 'is duplicated']
		if (msgArray[-1]=='too less elements'):
			message = '%s > %s : %s' % tuple([_(e) for e in msgArray[1:]])
		elif (msgArray[-1]=='is duplicated'):
			e = msgArray
			message = '%s > %s %s : %s %s' % (_(e[1]), _(e[2]), e[3], e[4], _(e[5]))
		else:
			message = str(msgArray)
	elif msgArray[0]=='virtual-server':
		# ["virtual-server", "port-mapping", "port must be > 0 and < 65535"]
		if msgArray[1]=='port-mapping':
			message = _(msgArray[-1])
		else:
			message = str(msgArray)
	elif msgArray[0][:3]=='wan':
		# [pos, 'is disabled']
		# [pos, 'is not dynamic']
		message = '%s %s.' % (_(msgArray[0]), _(msgArray[1]))
	elif isinstance(msgArray[0], list):
		# [['sourcea', 'invalid key']]
		if msgArray[0][-1]==jcfg.SEMERR_INVAL_KEY:
			message = '%s: %s' % (msgArray[0][0], _(jcfg.SEMERR_INVAL_KEY))
		else:
			message = str(msgArray)
	elif isinstance(msgArray[0], str):
		message = _(msgArray[0].strip())	# could be a message from the backend
	else:
		message = str(msgArray)
	return message


