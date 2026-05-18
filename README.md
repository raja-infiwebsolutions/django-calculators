# django-calculators

A simple Django calculator project built using Django.

---

# Features

* Django project setup
* Calculator form
* Add two numbers
* Django templates
* URL routing
* Simple UI

---

# Install Django

```bash
pip install django
```

---

# Create Django Project

```bash
django-admin startproject django_calculators
```

---

# Move Into Project

```bash
cd django_calculators
```

---

# Create Django App

```bash
python manage.py startapp calculators
```

---

# Project Structure

```txt
django_calculators/
│
├── django_calculators/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── calculators/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
│       └── index.html
│
├── manage.py
└── README.md
```

---

# Add App In settings.py

```python
INSTALLED_APPS = [
    'calculators',
]
```

---

# Create View

File: `calculators/views.py`

```python
from django.shortcuts import render


def home(request):
    result = None

    if request.method == 'POST':
        num1 = int(request.POST.get('num1'))
        num2 = int(request.POST.get('num2'))

        result = num1 + num2

    return render(request, 'index.html', {'result': result})
```

---

# Create App URLs

File: `calculators/urls.py`

```python
from django.urls import path
from .views import home

urlpatterns = [
    path('', home, name='home'),
]
```

---

# Configure Main URLs

File: `django_calculators/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('calculators.urls')),
]
```

---

# Create HTML Template

File: `calculators/templates/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Django Calculator</title>
</head>
<body>

    <h1>Simple Calculator</h1>

    <form method="POST">
        {% csrf_token %}

        <input type="number" name="num1" placeholder="First Number">

        <input type="number" name="num2" placeholder="Second Number">

        <button type="submit">Add</button>
    </form>

    {% if result %}
        <h2>Result: {{ result }}</h2>
    {% endif %}

</body>
</html>
```

---

# Run Migrations

```bash
python manage.py migrate
```

---

# Run Server

```bash
python manage.py runserver
```

---

# Open In Browser

```txt
http://127.0.0.1:8000
```

---

# Future Improvements

* Subtraction
* Multiplication
* Division
* Scientific Calculator
* Better UI
* User Authentication

---

# Author

Raja Kumar
