import logging

from instabot.api import API

LOG_FMT = '%(asctime)s %(processName)-15s ' \
          '%(name)-15s %(levelname)-8s %(message)s'
DATE_FMT = "%Y-%m-%d %H:%M:%S"


class InstAPI(API):
    def __init__(self, username, password):
        super(InstAPI, self).__init__()
        self.logger = logging.getLogger(username)
        self.logger.setLevel(logging.DEBUG)
        self.login(username, password)
