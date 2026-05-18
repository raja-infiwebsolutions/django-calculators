from django.test import TestCase, Client
from django.urls import reverse

class CalculatorViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_index_renders(self):
        resp = self.client.get(reverse('calculators:index'))
        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, 'calculators/index.html')

    def test_compute_add(self):
        resp = self.client.post(reverse('calculators:compute'), content_type='application/json', data='{"a": 2, "b": 3, "op": "add"}')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('result', resp.json())
        self.assertEqual(resp.json()['result'], 5)
