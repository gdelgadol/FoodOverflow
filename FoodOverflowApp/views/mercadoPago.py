from django.http import JsonResponse
import mercadopago
import json

# Inicializa MercadoPago SDK
#mercado_pago_sdk = SDK("TEST-4421427497096873-051617-3a02b3af353fadc2e2f6870bd7788e24-1547220359")
sdk = mercadopago.SDK("TEST-2262180838343969-052817-f1ce30df8a58d3eae9303a8531ab1fa2-1547220359")

def create_preference(request):
    if request.method == 'POST':
        # Aquí deberías obtener los datos del producto desde el request
        product_data = request.POST
        data = json.loads(request.body)
        preference_data = {
            "items": [
                {
                    "title": data.get("title"),
                    "quantity": data.get("quantity"),
                    "unit_price": data.get("unit_price"),
                    "currency_id": "COP"
                }
            ],
            "back_urls": {
                "success": "https://foodoverflow.onrender.com/diploma",
                "failure": "https://foodoverflow.onrender.com/support",
                "pending": "https://foodoverflow.onrender.com/pending_payment"
            },
            "auto_return": "approved",
            "payment_methods": {
                "excluded_payment_methods": [],
                "excluded_payment_types": []
            }
        }


        #preference_response = mercado_pago_sdk.preference().create(preference_data)
        preference_response = sdk.preference().create(preference_data)
        print(preference_response['response'])

        preference_id = preference_response['response']['id']
        link_pago = preference_response['response']['sandbox_init_point']

        return JsonResponse({'id': preference_id, 'link_pago': link_pago})
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

