from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('FoodOverflowApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('publication_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('publication_title', models.CharField(max_length=100)),
                ('publication_description', models.TextField(unique=True)),
                ('profile_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
