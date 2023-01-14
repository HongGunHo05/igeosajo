from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'request'

router = DefaultRouter()
router.register('user', views.UserViewSet)
router.register('reqterm', views.ReqtermViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
