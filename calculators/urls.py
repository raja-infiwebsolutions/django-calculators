from django.urls import path

from .views import CalculatorView

app_name = 'calculators'

urlpatterns = [
    # Root of the app shows calculator UI
    path('', CalculatorView.as_view(), name='index'),
]
