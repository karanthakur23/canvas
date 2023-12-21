from django.urls import re_path
from .consumers import CanvasConsumer

websocket_urlpatterns = [
    re_path(r'ws/drawing/$', CanvasConsumer.as_asgi()),
]
