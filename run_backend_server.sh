source venv/bin/activate
pip install -q -r requirements.txt
python3 manage.py runscript FoodOverflowApp.import_avatars
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
