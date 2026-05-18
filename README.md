# Django Calculators

Simple Django project providing a web-based calculator.

Run instructions (development):

1. Create and activate a virtualenv with Python 3.10+

2. Install requirements:

    pip install -r requirements.txt

3. Run migrations:

    python manage.py makemigrations
    python manage.py migrate

4. Run the development server:

    python manage.py runserver

5. Open http://127.0.0.1:8000/ to use the calculator.

Run tests:

    python manage.py test

Notes:
- The calculator uses Decimal for arithmetic and validates division-by-zero.
- Static files are configured for development using STATICFILES_DIRS.
