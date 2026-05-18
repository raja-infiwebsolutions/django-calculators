from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

# Render-only view for the calculator UI
def calculator_view(request):
    return render(request, 'calculator/card_calculator.html')


# Simple compute endpoint for AJAX POST requests.
# Expects JSON body: {"a": number, "b": number, "op": "add|sub|mul|div"}
# Returns JSON: {"result": number, "error": null|string}
@require_POST
def compute_view(request):
    import json

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'result': None, 'error': 'Invalid JSON payload'}, status=400)

    a = data.get('a')
    b = data.get('b')
    op = data.get('op')

    # Basic validation
    try:
        a = float(a)
    except Exception:
        return JsonResponse({'result': None, 'error': 'Invalid value for a'}, status=400)
    try:
        b = float(b)
    except Exception:
        return JsonResponse({'result': None, 'error': 'Invalid value for b'}, status=400)

    if op not in ('add', 'sub', 'mul', 'div'):
        return JsonResponse({'result': None, 'error': 'Invalid operation'}, status=400)

    try:
        if op == 'add':
            res = a + b
        elif op == 'sub':
            res = a - b
        elif op == 'mul':
            res = a * b
        elif op == 'div':
            if b == 0:
                return JsonResponse({'result': None, 'error': 'Division by zero'}, status=400)
            res = a / b
    except Exception as e:
        return JsonResponse({'result': None, 'error': str(e)}, status=500)

    return JsonResponse({'result': res, 'error': None}, status=200)
