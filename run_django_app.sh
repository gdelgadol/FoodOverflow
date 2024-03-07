pip install -r requirements.txt
cd FoodOverflow
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
