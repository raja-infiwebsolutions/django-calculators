from decimal import Decimal
from typing import Any, Dict

from django.shortcuts import render
from django.views import View

from .forms import CalculatorForm
from .utils import calculate


class CalculatorView(View):
    """
    Render and process a simple calculator form.

    GET: display the empty form
    POST: validate form, perform calculation, and return result in context
    """

    template_name = 'calculators/index.html'

    def get(self, request, *args, **kwargs):
        form = CalculatorForm()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = CalculatorForm(request.POST)
        context: Dict[str, Any] = {'form': form}

        if form.is_valid():
            operand1 = form.cleaned_data['operand1']
            operand2 = form.cleaned_data['operand2']
            operation = form.cleaned_data['operation']

            try:
                result, symbol = calculate(Decimal(operand1), Decimal(operand2), operation)
                # Format result as string for template display; normalize to remove exponent if any
                context['result'] = str(result.normalize()) if hasattr(result, 'normalize') else str(result)
                context['operation_symbol'] = symbol
            except Exception as exc:  # pragma: no cover - defensive
                # Unexpected errors should be surfaced as non-field error
                form.add_error(None, f'Error performing calculation: {exc}')

        return render(request, self.template_name, context)
