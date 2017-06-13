import time
import json


def fake_true(func):
    def wrapper(*args, **kwargs):
        print('Fake True')
        time.sleep(1)
        return True
    return wrapper


def fake_users(func):
    def wrapper(*args, **kwargs):
        print('Fake Users')
        time.sleep(1)
        with open('non_followers.json') as f:
            return json.load(f)
    return wrapper
