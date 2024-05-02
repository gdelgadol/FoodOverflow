import csv
import random
from .models import Avatar, Profile

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

        print(str(counter_exists) + " avatars exists before.")
        print(str(counter_new) + " avarars added to the model.")

        avatares = Avatar.objects.all()

        profiles = Profile.objects.filter(avatar_id = None)
        profiles_count = 0

        for profile in profiles:
            profile.avatar_id = avatares[random.randint(0, len(avatares)-1)]
            profile.save()
            profiles_count += 1
        
        print(str(profiles_count) + " profles edited.")