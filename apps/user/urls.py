# from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('EmailVerification/', views.EmailVerification.as_view()),
    path('RegisterView/', views.RegisterView.as_view()),
    path('ImageVerify/<uuid:uuid>/', views.ImageVerify.as_view()),
    path('LoginView/<uuid:uuid>/', views.LoginView.as_view()),
    # path('TokenView/', views.TokenView.as_view()),
]
