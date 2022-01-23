#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2021/12/4 18:13
# @Author : XXX
# @Site : 
# @File : celery_main.py
# @Software: PyCharm


# 设置配置文件路径
import os
from celery import Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'network_project.settings')

celery = Celery('network_project')

celery.config_from_object(obj='celery_tasks.celery_config')

celery.autodiscover_tasks(packages=['email', ])