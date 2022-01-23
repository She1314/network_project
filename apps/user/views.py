import io
import re
import random
import time
import jwt
from django.shortcuts import render
from django_redis import get_redis_connection
from django.views import View
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from celery_tasks.email.tasks import send_mail_task
from config.Token.token_config import iss, TOKEN_KEY
from utils.VerifyUtil import VerifyParam
from utils.resFormatutil import JsonFormatUtil, ImageVerifyUtil
from network_project.settings import EMAIL_HOST_USER, CACHES
from user.models import User


# Create your views here.
class EmailVerification(View):
    DURATION = 3
    EMAIL_KEY = "EMAIL:verification:%s"

    @method_decorator(decorator=VerifyParam('email'))
    def post(self, request):
        email = request.POST.get('email')
        if not re.match(r'^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}$', email):
            return JsonFormatUtil(STATUS='PARAM_ERROR').parseJson()
        verify_code = random.randint(100000, 999999)
        # self.send_mail_task(email=email, DURATION=self.DURATION, verify_code=verify_code)
        send_mail_task.delay(email=email, DURATION=self.DURATION, verify_code=verify_code, EMAIL_KEY=self.EMAIL_KEY)
        return JsonFormatUtil().parseJson()


class RegisterView(View):
    EMAIL_KEY = "EMAIL:verification:%s"

    @method_decorator(decorator=VerifyParam('email', 'password', 'verify_code'))
    def post(self, request):
        email = request.POST.get("email")
        password = make_password(password=request.POST.get('password'))
        # print(password)
        verify_code = request.POST.get('verify_code')
        if not re.match(r'^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}$', email):
            return JsonFormatUtil(STATUS='PARAM_ERROR').parseJson()
        cache_verify_code = get_redis_connection(alias='verify_code')
        redis_code = cache_verify_code.get(self.EMAIL_KEY % email)
        if (redis_code != verify_code) or not redis_code:
            return JsonFormatUtil(STATUS='PARAM_ERROR').parseJson()
        user = {
            'email': email,
            'password': password,
        }
        user = User.objects.create(**user)
        return JsonFormatUtil().parseJson()


class ImageVerify(View):
    DURATION = 3
    IMAGE_KEY = "LOGIN_KEY:%s"

    def get(self, request, uuid):
        image = ImageVerifyUtil(140, 40, 4, 28)
        img, code = image.image()
        # print(code)
        # print(uuid)
        cache = get_redis_connection(alias='image_code')
        # print(cache)
        cache.set(self.IMAGE_KEY % uuid, code, self.DURATION * 60)
        # print(cache.get(self.IMAGE_KEY % uuid))
        img_io = io.BytesIO()
        img.save(fp=img_io, format='PNG')
        image_bytes = img_io.getvalue()
        return HttpResponse(image_bytes, content_type='image/png')


class LoginView(View):
    IMAGE_KEY = "LOGIN_KEY:%s"

    @method_decorator(decorator=VerifyParam('email', 'password', 'image_code'))
    def post(self, request, uuid):
        global user
        print(uuid)
        email = request.POST.get('email')
        password = request.POST.get('password')
        image_code = request.POST.get('image_code')
        cache = get_redis_connection(alias='image_code')
        code = cache.get(self.IMAGE_KEY % uuid)
        if not code:
            return JsonFormatUtil(STATUS='CODE_EXPIRED').parseJson()
        if code.lower() != image_code.lower():
            return JsonFormatUtil(STATUS='CODE_ERROR').parseJson()
        try:
            user = User.objects.get(email=email)
        except:
            return JsonFormatUtil(STATUS='PARAM_ERROR').parseJson()
        else:
            # print(check_password(password=password, encoded=user.password))
            if not check_password(password=password, encoded=user.password):
                return JsonFormatUtil(STATUS='PARAM_ERROR').parseJson()
            headers = {
                'alg': 'HS256',
                'typ': 'JWT',
            }
            payload = {
                'iss': iss,
                'sub': email,
                'iat': int(time.time()),
                'exp': int(time.time() + 3600),
                'data': user.password
            }
            encode_jwt = jwt.encode(payload=payload, key=TOKEN_KEY, algorithm='HS256', headers=headers)
            return JsonFormatUtil(data=encode_jwt).parseJson()
