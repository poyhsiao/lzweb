#!/bin/bash

set -eu

if [ $UID -ne 0 ]; then
	sudo rm -rf *.pyc
	sudo rm -rf lib/*.pyc
	sudo rm -rf system/*.pyc
	sudo rm -rf service/*.pyc
	sudo rm -rf statistics/*.pyc
	sudo rm -rf log/*.pyc
else
	rm -rf *.pyc
	rm -rf lib/*.pyc
	rm -rf system/*.pyc
	rm -rf service/*.pyc
	rm -rf statistics/*.pyc
	rm -rf log/*.pyc
fi
