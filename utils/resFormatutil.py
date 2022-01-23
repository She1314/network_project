#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2021/12/3 22:25
# @Author : XXX
# @Site : 
# @File : resFormatutil.py
# @Software: PyCharm
"""
:return
构造json数据
"""
import os

from django.http import JsonResponse
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import string


class JsonFormatUtil(object):
    SUCCESS = '访问成功', 200
    ERROR = '访问失败', 400
    PARAM_ERROR = '参数错误', 401
    CODE_EXPIRED = '验证码过期', 503
    CODE_ERROR = '验证码错误', 504
    Signature_expired = '签证过期', 505
    Signature_error = '签证失败', 506
    Signature_none = '签证为空', 507

    def __init__(self, STATUS='SUCCESS', data=''):
        self.STATUS, self.code = getattr(self, STATUS)
        self.dict_data = {}
        self.data = data

    def parseDict(self):
        if not self.data:
            self.dict_data['msg'] = self.STATUS
            self.dict_data['code'] = self.code
        else:
            self.dict_data['msg'] = self.STATUS
            self.dict_data['code'] = self.code
            self.dict_data['data'] = self.data
        return self.dict_data

    def parseJson(self):
        # print(self.parseDict())
        return JsonResponse(data=self.parseDict(), json_dumps_params={'ensure_ascii': False})


class ImageVerifyUtil:
    def __init__(self, width, height, length, size):
        self.width = width
        self.height = height
        self.size = size
        self.length = length

    def randomStr(self):
        stringData = string.ascii_lowercase + '1234567890' + string.ascii_uppercase
        randomStr = ''.join(random.sample(stringData, self.length))
        return randomStr

    def randomColor(self, start, end):
        randomColor = (random.randint(start, end) for i in range(3))
        # print(tuple(randomColor))
        return tuple(randomColor)

    def image(self):
        img = Image.new('RGB', size=(self.width, self.height), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        file = os.path.dirname(os.path.abspath(__file__)) + '/HYYakuHei-85W.ttf'
        # file = os.getcwd() + '/' + 'HYYakuHei-85W.ttf'
        # print(file + '', file1)
        font = ImageFont.truetype(font=file, size=self.size)
        count = 0
        code = self.randomStr()
        for i in range(len(code)):
            count += 1
            draw.text((25 * count, 3), text=code[i], font=font, fill=self.randomColor(64, 255))
        return img, code

# if __name__ == '__main__':
#     image = ImageVerifyUtil(140, 40, 4, 28)
#     print(image.randomStr())
#     img = image.image()
#     with open(file='test.png', mode='wb') as f:
#         img.save(fp=f)
