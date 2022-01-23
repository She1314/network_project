#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2021/12/4 18:28
# @Author : XXX
# @Site : 
# @File : tasks.py
# @Software: PyCharm
from datetime import datetime
import time
import socket

from django_redis import get_redis_connection

from celery_tasks.celery_main import celery
from django.core.mail import send_mail
import logging

from network_project.settings import EMAIL_HOST_USER

logger = logging.getLogger(__name__)


@celery.task(name="send_mail_task")
def send_mail_task(email, DURATION, verify_code, EMAIL_KEY):
    try:
        time_now = datetime.fromtimestamp(int(time.time()))
        # 获取本机计算机名称
        hostname = socket.gethostname()
        # 获取本机ip
        ip = socket.gethostbyname(hostname)
        data = {
            'subject': 'network_project',
            'message': '',
            'from_email': EMAIL_HOST_USER,
            'recipient_list': [email, ],
            'html_message': f"""
                    <div style="background-color:#ECECEC; padding: 35px;">
            <table cellpadding="0" align="center"
               style="width: 600px; margin: 0px auto; text-align: left; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; font-size: 14px; font-family:微软雅黑, 黑体; line-height: 1.5; box-shadow: rgb(153, 153, 153) 0px 0px 5px; border-collapse: collapse; background-position: initial initial; background-repeat: initial initial;background:#fff;">
            <tbody>
            <tr>
                <th valign="middle"
                    style="height: 25px; line-height: 25px; padding: 15px 35px; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #42a3d3; background-color: #49bcff; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;">
                    <font face="微软雅黑" size="5" style="color: rgb(255, 255, 255); ">注册成功! （滁州三库一体生态监测平台）</font>
                </th>
            </tr>
            <tr>
                <td>
                    <div style="padding:25px 35px 40px; background-color:#fff;">
                        <h2 style="margin: 5px 0px; ">
                            <font color="#333333" style="line-height: 20px; ">
                                <font style="line-height: 22px; " size="4">
                                    亲爱的 用户</font>
                            </font>
                        </h2>
                        <p>首先感谢您注册成功！下面是您的账号信息<br>
                            您的验证码：<b style="color: orange;">{verify_code}</b><br>
                            您的邮箱：<b>{email}</b><br>
                            您注册时的日期：<b>{time_now}</b><br>
                            您注册时的IP：<b>192.168.12.1</b><br>
                            您的验证码有效时间为：<b>{DURATION}分钟</b><br>
                            当您在使用本网站时，遵守当地法律法规。<br>
                            如果您有什么疑问可以联系管理员，Email: **@**.com</p>
                        <p align="right">BER分接口网</p>
                        <p align="right">{time_now}</p>
                        <div style="width:700px;margin:0 auto;">
                            <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
                                <p>此为系统邮件，请勿回复<br>
                                    请保管好您的邮箱，避免账号被他人盗用
                                </p>
                                <p>©***</p>
                            </div>
                        </div>
                    </div>
                    </td>
                 </tr>
                </tbody>
            </table>
        </div>
            """
        }
        res_email = send_mail(**data)
    except Exception as e:
        logger.error('验证码发送失败：%s， %s' % (email, e))
    else:
        if res_email != 1:
            logger.warning('验证码获取异常：%s' % email)
        else:
            cache = get_redis_connection(alias='verify_code')
            cache.set(EMAIL_KEY % email, verify_code, DURATION * 60)
            logger.info('验证码发送成功：email:%s, verify_code:%s' % (email, verify_code))
