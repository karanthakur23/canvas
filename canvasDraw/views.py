from django.shortcuts import render

# Create your views here.

def canvas(request):
    return render(request, 'canvasDraw/index.html')