from decimal import Decimal, InvalidOperation

from django import forms
from django.core.exceptions import ValidationError


class CalculatorForm(forms.Form):
    """
    CalculatorForm accepts two numeric operands and an operation choice.

    Validation rules:
    - Both operands are required and must be valid decimals.
    - Division by zero is not allowed when operation is 'divide'.
    """

    OPERATION_ADD = 'add'
    OPERATION_SUB = 'sub'
    OPERATION_MUL = 'mul'
    OPERATION_DIV = 'div'

    OPERATION_CHOICES = [
        (OPERATION_ADD, '+'),
        (OPERATION_SUB, '-'),
        (OPERATION_MUL, '*'),
        (OPERATION_DIV, '/'),
    ]

    operand1 = forms.DecimalField(
        required=True,
        max_digits=20,
        decimal_places=10,
        widget=forms.NumberInput(attrs={'step': 'any', 'class': 'form-control'}),
        label='Operand 1',
    )
    operand2 = forms.DecimalField(
        required=True,
        max_digits=20,
        decimal_places=10,
        widget=forms.NumberInput(attrs={'step': 'any', 'class': 'form-control'}),
        label='Operand 2',
    )
    operation = forms.ChoiceField(
        required=True,
        choices=OPERATION_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'}),
        label='Operation',
    )

    def clean(self):
        """
        Perform cross-field validation.
        Ensure operands are present and that division by zero doesn't occur.
        """
        cleaned_data = super().clean()
        op1 = cleaned_data.get('operand1')
        op2 = cleaned_data.get('operand2')
        operation = cleaned_data.get('operation')

        # If field-level validation already added errors, skip further checks
        if self.errors:
            return cleaned_data

        # Ensure operands are not None (should be enforced by required=True)
        if op1 is None:
            raise ValidationError({'operand1': 'This field is required.'})
        if op2 is None:
            raise ValidationError({'operand2': 'This field is required.'})

        # Validate divide-by-zero
        if operation == self.OPERATION_DIV:
            try:
                # Decimal('0') comparison
                if Decimal(op2) == Decimal('0'):
                    raise ValidationError({'operand2': 'Division by zero is not allowed.'})
            except (InvalidOperation, TypeError):
                # If conversion fails, rely on field validation to report it
                raise ValidationError('Invalid numeric input.')

        return cleaned_data
