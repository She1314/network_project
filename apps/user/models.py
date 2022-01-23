from django.db import models


# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=120)
    status = models.IntegerField(default=0)
    c_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)
    u_time = models.DateTimeField(verbose_name='修改时间', auto_now=True)

    class Meta:
        db_table = 'user'


class UserDetail(models.Model):
    name = models.CharField(max_length=50, verbose_name='姓名', null=True)
    nickname = models.CharField(max_length=50, verbose_name='昵称', null=True)
    sex = models.SmallIntegerField(default=1)
    role = models.CharField(max_length=20, verbose_name='角色', null=True)
    phone = models.CharField(max_length=20, verbose_name='电话', null=True)
    status = models.IntegerField(default=0)
    Job = models.CharField(max_length=20, verbose_name='职务', null=True)
    user = models.OneToOneField(to='User', on_delete=models.CASCADE, related_name='detail')

    class Meta:
        db_table = 'user_detail'










