# -*- coding: utf-8 -*-
# Module: messages
# Author: Roman V.M.
# Created on: 12.05.2015
# License: GPL v.3 https://www.gnu.org/copyleft/gpl.html

import xbmcgui


class TopLeftLabel(object):
    """
    On-screen label in the top left corner.
    """
    def __init__(self, x=10, y=10, width=1900, height=50, text='', color='0xFFFFFF00'):
        self._window = xbmcgui.Window(12005)
        self._label = xbmcgui.ControlLabel(x, y, width, height, text, textColor=color)
        self._window.addControl(self._label)

    @property
    def text(self):
        """
        Label text
        """
        return self._label.getLabel()

    @text.setter
    def text(self, text):
        self._label.setLabel(text)

    def show(self):
        """
        Show on-screen label
        """
        self._label.setVisible(True)

    def hide(self):
        """
        Hide on-screen label
        """
        self._label.setVisible(False)