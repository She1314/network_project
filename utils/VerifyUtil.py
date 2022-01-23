"""
    :return
"""
from django.http import HttpResponse
from utils.resFormatutil import JsonFormatUtil


def VerifyParam(*param):
    def VerificationUtil(func):
        def Main(request, *args, **kwargs):
            # print(args, kwargs)
            if hasattr(request, request.method):
                method = getattr(request, request.method)
                for i in param:
                    data = method.get(i)
                    if not data:
                        # return HttpResponse("参数错误")
                        return JsonFormatUtil(STATUS='ERROR').parseJson()
                    print(func(request, *args, **kwargs))
                return func(request, *args, **kwargs)

        return Main

    return VerificationUtil
