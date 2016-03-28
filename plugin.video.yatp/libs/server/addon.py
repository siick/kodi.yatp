# -*- coding: utf-8 -*-
# Name:        utils
# Author:      Roman Miroshnychenko aka Roman V. M.
# Created on:  09.05.2015
# Licence: GPL v.3: http://www.gnu.org/copyleft/gpl.html
"""
Auxiliary module to access Kodi addon parameters
"""

import os
import sys
import xbmc
from collections import namedtuple
import simpleplugin

Credentials = namedtuple('Credentials', ['login', 'password'])


class Addon(simpleplugin.Addon):
    """Helper class to access addon parameters"""
    def __init__(self, id_=''):
        super(Addon, self).__init__(id_)
        self._download_dir = self.get_setting('download_dir') or xbmc.translatePath('special://temp')
        if sys.platform == 'win32':
            self._download_dir = self._download_dir.decode('utf-8')
        if not os.path.exists(self._download_dir):
            os.mkdir(self._download_dir)

    @property
    def credentials(self):
        return Credentials(self.get_setting('web_login'), self.get_setting('web_pass'))

    @property
    def download_dir(self):
        return self._download_dir
