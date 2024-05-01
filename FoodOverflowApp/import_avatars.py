import csv
from .models import Avatar

def import_avatars(file_path):
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if not Avatar.objects.filter(avatar_url = row['avatar_url']).exists():
                Avatar.objects.create_avatar(
                    url = row['avatar_url']
                )
                print(row['avatar_url']+" avatar created.")

import_avatars('FoodOverflowApp/avatars.csv')