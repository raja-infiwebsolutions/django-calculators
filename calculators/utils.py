"""Pure calculation utilities for the calculators app.

These functions are intentionally simple and pure to allow straightforward
unit testing and reuse from views or other modules.
"""
from decimal import Decimal, InvalidOperation


def add(a, b):
    """Return a + b as Decimal.

    Accepts numbers or Decimal-like inputs; returns Decimal.
    """
    try:
        return Decimal(a) + Decimal(b)
    except (TypeError, InvalidOperation) as exc:
        raise ValueError("Invalid input for addition") from exc


def sub(a, b):
    """Return a - b as Decimal."""
    try:
        return Decimal(a) - Decimal(b)
    except (TypeError, InvalidOperation) as exc:
        raise ValueError("Invalid input for subtraction") from exc


def mul(a, b):
    """Return a * b as Decimal."""
    try:
        return Decimal(a) * Decimal(b)
    except (TypeError, InvalidOperation) as exc:
        raise ValueError("Invalid input for multiplication") from exc


def div(a, b):
    """Return a / b as Decimal. Raises ValueError on divide-by-zero."""
    try:
        da = Decimal(a)
        db = Decimal(b)
    except (TypeError, InvalidOperation) as exc:
        raise ValueError("Invalid input for division") from exc

    if db == Decimal(0):
        raise ValueError("Division by zero")

    return da / db
