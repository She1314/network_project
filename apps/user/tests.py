import re

from django.test import TestCase

# Create your tests here.
from datetime import datetime
import time
import jwt
print(datetime.now().timestamp())
start = int(time.time())
end = int(time.time()) + 300
headers = {
    'alg': "HS256",
    'typ': 'JWT'
}

payload = {
    'iss': 'network_project',
    'sub': 'login',
    'exp': end,
    'iat': start,
    'data': '2185902575@qq.com'
}
TOKEN_KEY = 'network_project'
encode_jwt = jwt.encode(payload=payload, key=TOKEN_KEY, algorithm='HS256', headers=headers)
print(encode_jwt)
print(jwt.decode(jwt=encode_jwt, key=TOKEN_KEY, algorithms='HS256'))