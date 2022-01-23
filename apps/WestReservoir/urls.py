# from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # path('indexview/', views.IndexView.as_view()),
    path('HruView/', views.HruView.as_view()),
    path('LandUseView/', views.LandUseCView.as_view()),
    path('PrecipitationView/', views.PrecipitationView.as_view()),
    path('NutrientOut/', views.NutrientOutPutView.as_view()),
    path('RchView/', views.RchView.as_view()),
    path('SubViewJuly/', views.SubViewJuly.as_view()),
    path('MouOutPut/', views.MouOutPut.as_view()),
]
