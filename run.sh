#!/bin/bash

set -eu

if [ $UID -ne 0 ]; then
	sudo python /swlb/webui/run.py
else
	python /swlb/webui/run.py
fi
