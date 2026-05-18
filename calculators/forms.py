from decimal import Decimal

from django import forms
from django.core.exceptions import ValidationError


class CalculatorForm(forms.Form):
    """Form for basic calculator operations.

    Fields:
    - num1: first operand (Decimal)
    - num2: second operand (Decimal)
    - operation: one of add, sub, mul, div

    The form's clean method validates that both numbers are provided and
    that division-by-zero does not occur when operation is 'div'.
    """

    OPERATION_CHOICES = [
        ("add", "Add (+)"),
        ("sub", "Subtract (-)"),
        ("mul", "Multiply (×)"),
        ("div", "Divide (÷)"),
    ]

    num1 = forms.DecimalField(
        label="First number",
        required=True,
        decimal_places=10,
        max_digits=30,
        widget=forms.NumberInput(attrs={"class": "form-control", "step": "any"}),
    )
    num2 = forms.DecimalField(
        label="Second number",
        required=True,
        decimal_places=10,
        max_digits=30,
        widget=forms.NumberInput(attrs={"class": "form-control", "step": "any"}),
    )
    operation = forms.ChoiceField(
        label="Operation",
        choices=OPERATION_CHOICES,
        required=True,
        widget=forms.Select(attrs={"class": "form-select"}),
    )

    def clean(self):
        """Custom validation for empty inputs and division by zero."""
        cleaned_data = super().clean()
        num1 = cleaned_data.get("num1")
        num2 = cleaned_data.get("num2")
        operation = cleaned_data.get("operation")

        # Ensure both numbers are present
        if num1 in (None, "") or num2 in (None, ""):
            raise ValidationError("Both numbers are required.")

        # Division by zero check
        if operation == "div":
            try:
                # Use Decimal comparison
                if Decimal(num2) == Decimal(0):
                    raise ValidationError("Cannot divide by zero.")
            except (TypeError, InvalidOperation):
                raise ValidationError("Invalid numeric input.")

        return cleaned_data
