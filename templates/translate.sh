#!/bin/bash

set -eu

# translate *.mako to messages.po file
python ./../lib/pygettext.py -a -v -d messages -o messages.po *.mako
