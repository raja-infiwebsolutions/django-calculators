from decimal import Decimal, InvalidOperation
from typing import Tuple


def calculate(operand1: Decimal, operand2: Decimal, operation: str) -> Tuple[Decimal, str]:
    """
    Perform a basic arithmetic operation on two Decimal operands.

    Returns a tuple of (result, operation_symbol).
    Raises ValueError for unsupported operations or InvalidOperation if Decimal ops fail.
    """
    try:
        if operation == 'add':
            return operand1 + operand2, '+'
        if operation == 'sub':
            return operand1 - operand2, '-'
        if operation == 'mul':
            return operand1 * operand2, '*'
        if operation == 'div':
            # Caller should ensure division by zero is prevented
            return operand1 / operand2, '/'
        raise ValueError(f'Unsupported operation: {operation}')
    except InvalidOperation:
        raise
