import csv
from .models import Avatar

def run():
    with open('FoodOverflowApp/avatars.csv', 'r') as file:
        reader = csv.DictReader(file)
        counter_exists = 0
        counter_new = 0
        for row in reader:
            if not Avatar.objects.filter(avatar_url = row['avatar_url']).exists():
                Avatar.objects.create_avatar(
                    url = row['avatar_url']
                )
                print(row['avatar_url']+" avatar created.")
                counter_new += 1
            else:
                counter_exists += 1
        print(str(counter_exists)+" avatars exists before.")
        print(str(counter_new)+" avarars added to the model.")