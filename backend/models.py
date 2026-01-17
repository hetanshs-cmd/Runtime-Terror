from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import bcrypt
import jwt
from config import JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRE_MINUTES, JWT_REFRESH_TOKEN_EXPIRE_DAYS

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    sessions = db.relationship('UserSession', backref='user', lazy=True, cascade='all, delete-orphan')

    def __init__(self, username, email, full_name, password):
        self.username = username
        self.email = email
        self.full_name = full_name
        self.set_password(password)

    def set_password(self, password):
        """Hash and set the password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """Check if password matches the hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def generate_access_token(self):
        """Generate JWT access token"""
        payload = {
            'user_id': self.id,
            'username': self.username,
            'exp': datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
            'iat': datetime.utcnow(),
            'type': 'access'
        }
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

    def generate_refresh_token(self):
        """Generate JWT refresh token"""
        payload = {
            'user_id': self.id,
            'username': self.username,
            'exp': datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAYS),
            'iat': datetime.utcnow(),
            'type': 'refresh'
        }
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'fullName': self.full_name,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'isActive': self.is_active
        }

class UserSession(db.Model):
    __tablename__ = 'user_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_token = db.Column(db.String(500), unique=True, nullable=False)
    refresh_token = db.Column(db.String(500), unique=True, nullable=False)
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    user_agent = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def __init__(self, user_id, session_token, refresh_token, ip_address=None, user_agent=None):
        self.user_id = user_id
        self.session_token = session_token
        self.refresh_token = refresh_token
        self.ip_address = ip_address
        self.user_agent = user_agent
        self.expires_at = datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAYS)

    def is_expired(self):
        """Check if session is expired"""
        return datetime.utcnow() > self.expires_at

    def extend_session(self):
        """Extend session expiration"""
        self.expires_at = datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAYS)

    def to_dict(self):
        """Convert session object to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'ipAddress': self.ip_address,
            'userAgent': self.user_agent,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'expiresAt': self.expires_at.isoformat() if self.expires_at else None,
            'isActive': self.is_active
        }

# Utility functions for token validation
def decode_token(token):
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_user_by_token(token):
    """Get user by access token"""
    payload = decode_token(token)
    if not payload or payload.get('type') != 'access':
        return None

    user_id = payload.get('user_id')
    if not user_id:
        return None

    return User.query.get(user_id)

def get_session_by_refresh_token(refresh_token):
    """Get session by refresh token"""
    payload = decode_token(refresh_token)
    if not payload or payload.get('type') != 'refresh':
        return None

    return UserSession.query.filter_by(
        refresh_token=refresh_token,
        is_active=True
    ).first()

class Hospital(db.Model):
    __tablename__ = 'hospitals'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    hospital_type = db.Column(db.String(50), nullable=False)  # e.g., 'general', 'specialty', 'clinic'
    num_rooms = db.Column(db.Integer, default=0)
    num_doctors = db.Column(db.Integer, default=0)
    num_nurses = db.Column(db.Integer, default=0)
    capacity = db.Column(db.Integer, default=0)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'hospitalType': self.hospital_type,
            'numRooms': self.num_rooms,
            'numDoctors': self.num_doctors,
            'numNurses': self.num_nurses,
            'capacity': self.capacity,
            'phone': self.phone,
            'email': self.email,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

class Farmer(db.Model):
    __tablename__ = 'farmers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    area_plot = db.Column(db.Float, nullable=False)  # in acres/hectares
    crop_type = db.Column(db.String(100))
    irrigation_type = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    farm_size_category = db.Column(db.String(20))  # 'small', 'medium', 'large'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'areaPlot': self.area_plot,
            'cropType': self.crop_type,
            'irrigationType': self.irrigation_type,
            'phone': self.phone,
            'email': self.email,
            'farmSizeCategory': self.farm_size_category,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }