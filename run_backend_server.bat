pip install -q -r requirements.txt
python manage.py runscript FoodOverflowApp.import_avatars
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
