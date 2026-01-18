# Configuration for GovConnect Backend

import os

# Flask Configuration
SECRET_KEY = 'your-secret-key-change-in-production'
DEBUG = False  # Disabled to prevent restarts during testing
SESSION_TYPE = 'filesystem'  # Can be changed to 'redis' for production

# Database Configuration
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'Soul#13211993'
MYSQL_DB = 'govconnect'
MYSQL_PORT = 3306

# SQLAlchemy Configuration
SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = DEBUG

# Redis Configuration
REDIS_HOST = 'localhost'
REDIS_PORT = 6379

# Rate Limiting
RATE_LIMIT = 100  # requests per window
RATE_WINDOW = 60  # seconds

# JWT Configuration
JWT_SECRET_KEY = SECRET_KEY
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
JWT_REFRESH_TOKEN_EXPIRE_DAYS = 7     # 7 days

# Server Configuration
HOST = '0.0.0.0'
# Use port 5000 for HTTP as requested
PORT = 5000

# LLM (Large Language Model) Configuration
# Use environment variables to choose provider and model. Default to 'huggingface' and 'gpt-5-mini'.
LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'huggingface')
LLM_DEFAULT_MODEL = os.getenv('LLM_DEFAULT_MODEL', 'gpt-5-mini')
LLM_API_URL = os.getenv('LLM_API_URL', '')
LLM_API_KEY = os.getenv('LLM_API_KEY', '')