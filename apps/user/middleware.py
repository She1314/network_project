#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2021/12/8 17:49
# @Author : XXX
# @Site :
# @File : middleware.py
# @Software: PyCharm
import re
import uuid

import jwt

from config.Token.token_config import TOKEN_KEY
from utils.resFormatutil import JsonFormatUtil
from network_project.settings import TOKEN_URL


class LoginMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        self.request = request
        if request.path.split('/')[1] != 'user':
            get = request.META
            try:
                HTTP_AUTHORIZATION = get.get('HTTP_AUTHORIZATION')
                data = jwt.decode(jwt=HTTP_AUTHORIZATION, key=TOKEN_KEY, algorithms='HS256')
            except jwt.exceptions.InvalidSignatureError:
                return JsonFormatUtil(STATUS='Signature_none').parseJson()
            except jwt.exceptions.ExpiredSignatureError:
                return JsonFormatUtil(STATUS='Signature_expired').parseJson()
            except jwt.exceptions.DecodeError:
                return JsonFormatUtil(STATUS='Signature_none').parseJson()
            response = self.get_response(self.request, *args, **kwargs)
        else:
            response = self.get_response(self.request, *args, **kwargs)
        return response
