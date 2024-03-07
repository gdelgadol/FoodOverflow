from django.shortcuts import render, redirect

def main(request):
    return render(request, 'login_signup/main.html')