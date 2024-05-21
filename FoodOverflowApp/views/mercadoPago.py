from django.http import JsonResponse
import mercadopago
import json

# Inicializa MercadoPago SDK
#mercado_pago_sdk = SDK("TEST-4421427497096873-051617-3a02b3af353fadc2e2f6870bd7788e24-1547220359")
sdk = mercadopago.SDK("APP_USR-4421427497096873-051617-3ff5d58d8fca35c9d8c7c45caf633715-1547220359")

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
                "success": "https://www.youtube.com/watch?v=7wtfhZwyrcc",
                "failure": "http://localhost:5173/support",
                "pending": "https://www.youtube.com/watch?v=hgfNaXGW2Bw&t=1s"
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
        link_pago = preference_response['response']['init_point']

        return JsonResponse({'id': preference_id, 'link_pago': link_pago})
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

