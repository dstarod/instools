import logging
import sys
import os
from hashlib import md5
import asyncio
from concurrent.futures import ThreadPoolExecutor

from aiohttp import web
import aiohttp_jinja2
from jinja2 import FileSystemLoader

from fakes import fake_true, fake_users
from instapi import InstAPI

LOG_FMT = '%(asctime)s ' \
          '%(name)-15s %(levelname)-8s %(message)s'
DATE_FMT = "%Y-%m-%d %H:%M:%S"
logging.basicConfig(
    stream=sys.stdout, level=logging.INFO, format=LOG_FMT, datefmt=DATE_FMT)
logger = logging.getLogger('instools')
logging.getLogger('asyncio').setLevel(logging.WARNING)


loop = asyncio.get_event_loop()
loop.set_debug(True)
executor = ThreadPoolExecutor(max_workers=1)

root = os.path.dirname((os.path.abspath(__file__)))
app = web.Application(loop=loop)
aiohttp_jinja2.setup(app, loader=FileSystemLoader(root+'/templates'))


def authorize(handler):
    def wrapper(request):
        token = request.GET.get('token', None)
        if not token or token not in app:
            return web.json_response(
                {'error': 'Unauthorized'},
                status=401
            )
        return handler(request, token)
    return wrapper


def generate_api_task(username, password):
    try:
        return InstAPI(username, password)
    except SystemExit:
        return 'Login error'
    except Exception as e:
        return str(e)


# @fake_users
def load_subscribers_task(token):
    return app[token].getTotalSelfFollowers()


# @fake_users
def load_subscriptions_task(token):
    return app[token].getTotalSelfFollowings()


@fake_true
def unfollow_user_task(user_id, token):
    app[token].unfollow(user_id)
    return True


@fake_true
def follow_user_task(user_id, token):
    app[token].follow(user_id)
    return True


@aiohttp_jinja2.template('main.jinja2')
def index(request):
    return {'title': 'InsTools'}


@asyncio.coroutine
def login(request):
    try:
        payload = yield from request.json()
        username = payload.get('username', None)
        password = payload.get('password', None)
    except Exception as e:
        return web.json_response(
            {'error': 'Incorrect format'},
            status=400
        )

    if not all([username, password]):
        return web.json_response(
            {'error': 'Username or password is empty'},
            status=400
        )

    token = md5(
        ('{}{}'.format(username, password)).encode('utf-8')
    ).hexdigest()

    if token not in app:
        api = yield from loop.run_in_executor(
            executor, generate_api_task, username, password
        )
        if not isinstance(api, InstAPI):
            return web.json_response({'error': api}, status=401)
        app[token] = api

    logger.info('Got token {} for user {}'.format(token, username))
    return web.json_response({'token': token})


@authorize
@asyncio.coroutine
def logout(request, token):
    app[token].logger.info('Logout')
    del app[token]
    return web.json_response({'success': True})


@authorize
@asyncio.coroutine
def unfollow_user(request, token):
    user_id = request.match_info.get('user_id', None)
    unfollow_result = yield from loop.run_in_executor(
        executor, unfollow_user_task, user_id, token
    )
    return web.json_response({'result': unfollow_result})


@authorize
@asyncio.coroutine
def follow_user(request, token):
    user_id = request.match_info.get('user_id', None)
    follow_result = yield from loop.run_in_executor(
        executor, follow_user_task, user_id, token
    )
    return web.json_response({'result': follow_result})


@authorize
@asyncio.coroutine
def get_subscribers(request, token):
    subscribers = yield from loop.run_in_executor(
        executor, load_subscribers_task, token
    )
    return web.json_response(subscribers)


@authorize
@asyncio.coroutine
def get_subscriptions(request, token):
    subscriptions = yield from loop.run_in_executor(
        executor, load_subscriptions_task, token
    )
    return web.json_response(subscriptions)


app.router.add_get('/api/subscribers', get_subscribers)
app.router.add_get('/api/subscriptions', get_subscriptions)
app.router.add_put('/api/unfollow/{user_id}', unfollow_user)
app.router.add_put('/api/follow/{user_id}', follow_user)
app.router.add_post('/api/login', login)
app.router.add_put('/api/logout', logout)
# Index page
for route in [
    '/', '/login', '/friends', '/fans', '/not-followers',
]:
    app.router.add_get(route, index)

app.router.add_static('/static', root+'/static')
app.router.add_static('/bower_components', root+'/bower_components')

try:
    web.run_app(app, port=8082)
except KeyboardInterrupt:
    loop.stop()
finally:
    loop.close()
