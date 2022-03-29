import os
from urllib.parse import urlparse

BASE_URL = os.environ["BASE_URL"]
DEV_URL = "http://localhost:3000"
USE_DEMO_LOGIN = bool(os.environ.get("USE_DEMO_LOGIN"))
DATABASE_URL = urlparse(os.environ["DATABASE_URL"])
INBOX_DOMAIN = "tripbox.sshh.io"
