from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_session import Session
import bcrypt
import jwt
import json
import os
from datetime import datetime, timedelta
import secrets
from rate_limit import rate_limit
from scheduler import admit
from config import (
    SECRET_KEY, DEBUG, HOST, PORT, SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS, SESSION_TYPE
)
from models import db, User, UserSession, decode_token, get_user_by_token, get_session_by_refresh_token, Hospital, Farmer

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS with credentials

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SESSION_TYPE'] = SESSION_TYPE

# Initialize extensions
db.init_app(app)
Session(app)

# Create database tables
with app.app_context():
    db.create_all()
    # Create admin user if not exists
    admin_user = User.query.filter_by(username='admin').first()
    if not admin_user:
        admin_user = User(
            username='admin',
            email='admin@govconnect.com',
            full_name='System Administrator',
            password='admin123'
        )
        admin_user.role = 'admin'
        db.session.add(admin_user)
        db.session.commit()
        print("Admin user created: username='admin', password='admin123'")
    else:
        print("Admin user already exists")

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login endpoint"""
    try:
        # Apply rate limiting based on IP or user identifier
        user_id = request.remote_addr  # Use IP for rate limiting
        rate_limit(user_id)

        data = request.get_json()

        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password are required'}), 400

        username = data['username']
        password = data['password']

        # Find user in database
        user = User.query.filter_by(username=username, is_active=True).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username or password'}), 401

        # Generate tokens
        access_token = user.generate_access_token()
        refresh_token = user.generate_refresh_token()

        # Create session
        session = UserSession(
            user_id=user.id,
            session_token=access_token,
            refresh_token=refresh_token,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        db.session.add(session)
        db.session.commit()

        # Schedule a login tracking task
        admit({
            'type': 'user_login',
            'username': username,
            'user_id': user.id,
            'timestamp': datetime.utcnow().isoformat(),
            'ip': request.remote_addr
        }, priority=1)

        # Create response with cookies
        response = make_response(jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'fullName': user.full_name,
                'email': user.email
            }
        }), 200)

        # Set secure cookies
        response.set_cookie(
            'access_token',
            access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=30 * 60  # 30 minutes
        )

        response.set_cookie(
            'refresh_token',
            refresh_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=7 * 24 * 60 * 60  # 7 days
        )

        return response

    except Exception as e:
        print(f"Login error: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registration endpoint"""
    try:
        # Apply rate limiting
        user_id = request.remote_addr
        rate_limit(user_id)

        data = request.get_json()

        required_fields = ['username', 'password', 'fullName', 'email']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'All fields are required'}), 400

        username = data['username']
        password = data['password']
        full_name = data['fullName']
        email = data['email']

        # Basic validation
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400

        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Please enter a valid email address'}), 400

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409

        # Create new user
        user = User(username=username, email=email, full_name=full_name, password=password)
        db.session.add(user)
        db.session.commit()

        # Schedule a registration tracking task
        admit({
            'type': 'user_registration',
            'username': username,
            'email': email,
            'user_id': user.id,
            'timestamp': datetime.utcnow().isoformat(),
            'ip': request.remote_addr
        }, priority=2)

        return jsonify({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'fullName': user.full_name,
                'email': user.email
            }
        }), 201

    except Exception as e:
        print(f"Registration error: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/verify', methods=['GET'])
def verify():
    """Verify token endpoint"""
    try:
        # Try to get token from cookie first, then from Authorization header
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Token is required'}), 401

        user = get_user_by_token(access_token)
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401

        # Apply rate limiting
        rate_limit(user.username)

        return jsonify({
            'valid': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'fullName': user.full_name,
                'email': user.email
            }
        }), 200

    except Exception as e:
        print(f"Verification error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token using refresh token"""
    try:
        refresh_token = request.cookies.get('refresh_token')
        if not refresh_token:
            return jsonify({'error': 'Refresh token required'}), 401

        # Get session by refresh token
        session = get_session_by_refresh_token(refresh_token)
        if not session or session.is_expired():
            return jsonify({'error': 'Invalid or expired refresh token'}), 401

        user = session.user
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401

        # Generate new access token
        new_access_token = user.generate_access_token()

        # Update session with new access token
        session.session_token = new_access_token
        session.extend_session()
        db.session.commit()

        # Create response with new access token cookie
        response = make_response(jsonify({
            'message': 'Token refreshed successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'fullName': user.full_name,
                'email': user.email
            }
        }), 200)

        response.set_cookie(
            'access_token',
            new_access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=30 * 60  # 30 minutes
        )

        return response

    except Exception as e:
        print(f"Token refresh error: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout endpoint"""
    try:
        access_token = request.cookies.get('access_token')
        refresh_token = request.cookies.get('refresh_token')

        # Invalidate session if tokens are provided
        if refresh_token:
            session = get_session_by_refresh_token(refresh_token)
            if session:
                session.is_active = False
                db.session.commit()

        # Create response that clears cookies
        response = make_response(jsonify({'message': 'Logged out successfully'}), 200)

        response.set_cookie('access_token', '', expires=0, httponly=True)
        response.set_cookie('refresh_token', '', expires=0, httponly=True)

        return response

    except Exception as e:
        print(f"Logout error: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Get current user information"""
    try:
        # Get user from token
        user = get_user_by_token()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401

        return jsonify({
            'id': user.id,
            'username': user.username,
            'fullName': user.full_name,
            'email': user.email,
            'role': user.role
        }), 200

    except Exception as e:
        print(f"Get user error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/tasks/submit', methods=['POST'])
def submit_task():
    """Submit a task to the worker pool"""
    try:
        # Verify authentication
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Authentication required'}), 401

        user = get_user_by_token(access_token)
        if not user:
            return jsonify({'error': 'Invalid token'}), 401

        # Apply rate limiting
        rate_limit(user.username)

        data = request.get_json()
        if not data or 'taskType' not in data:
            return jsonify({'error': 'Task type is required'}), 400

        task_data = {
            'type': data['taskType'],
            'username': user.username,
            'user_id': user.id,
            'data': data.get('data', {}),
            'timestamp': datetime.utcnow().isoformat(),
            'taskId': secrets.token_hex(8)
        }

        # Schedule the task with appropriate priority
        priority = data.get('priority', 1)
        admit(task_data, priority)

        return jsonify({
            'message': 'Task submitted successfully',
            'taskId': task_data['taskId'],
            'status': 'queued'
        }), 202

    except Exception as e:
        print(f"Task submission error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/dashboard/metrics', methods=['GET'])
def get_dashboard_metrics():
    """Get dashboard metrics (requires authentication)"""
    try:
        # Verify authentication
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Authentication required'}), 401

        user = get_user_by_token(access_token)
        if not user:
            return jsonify({'error': 'Invalid token'}), 401

        # Apply rate limiting
        rate_limit(user.username)

        # Schedule a metrics collection task
        admit({
            'type': 'collect_metrics',
            'username': user.username,
            'user_id': user.id,
            'timestamp': datetime.utcnow().isoformat(),
            'taskId': secrets.token_hex(8)
        }, priority=3)

        # Return mock dashboard data (in production, this would come from processed tasks)
        return jsonify({
            'healthcare': {
                'activePatients': 1247,
                'availableBeds': 89,
                'appointmentsToday': 156
            },
            'agriculture': {
                'activeFarms': 342,
                'cropYield': 89.5,
                'waterUsage': 72.3
            },
            'infrastructure': {
                'trafficFlow': 78.2,
                'powerConsumption': 94.1,
                'networkUptime': 99.8
            },
            'alerts': {
                'critical': 3,
                'warning': 12,
                'info': 28
            }
        }), 200

    except Exception as e:
        print(f"Dashboard metrics error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/healthcare/hospitals', methods=['GET'])
def get_hospitals():
    """Get all hospitals (requires authentication)"""
    try:
        # Verify authentication
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Authentication required'}), 401

        user = get_user_by_token(access_token)
        if not user:
            return jsonify({'error': 'Invalid token'}), 401

        # Apply rate limiting
        rate_limit(user.username)

        hospitals = Hospital.query.all()
        return jsonify({
            'hospitals': [hospital.to_dict() for hospital in hospitals]
        }), 200

    except Exception as e:
        print(f"Get hospitals error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/healthcare/hospitals', methods=['POST'])
def create_hospital():
    """Create a new hospital (admin only)"""
    try:
        # Verify authentication
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Authentication required'}), 401

        user = get_user_by_token(access_token)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        # Apply rate limiting
        rate_limit(user.username)

        data = request.get_json()
        required_fields = ['name', 'location', 'hospitalType']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Name, location, and hospital type are required'}), 400

        hospital = Hospital(
            name=data['name'],
            location=data['location'],
            hospital_type=data['hospitalType'],
            num_rooms=data.get('numRooms', 0),
            num_doctors=data.get('numDoctors', 0),
            num_nurses=data.get('numNurses', 0),
            capacity=data.get('capacity', 0),
            phone=data.get('phone'),
            email=data.get('email')
        )

        db.session.add(hospital)
        db.session.commit()

        return jsonify({
            'message': 'Hospital created successfully',
            'hospital': hospital.to_dict()
        }), 201

    except Exception as e:
        print(f"Create hospital error: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/agriculture/farmers', methods=['GET'])
def get_farmers():
    """Get all farmers (requires authentication)"""
    try:
        # Verify authentication
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Authentication required'}), 401

        user = get_user_by_token(access_token)
        if not user:
            return jsonify({'error': 'Invalid token'}), 401

        # Apply rate limiting
        rate_limit(user.username)

        farmers = Farmer.query.all()
        return jsonify({
            'farmers': [farmer.to_dict() for farmer in farmers]
        }), 200

    except Exception as e:
        print(f"Get farmers error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/agriculture/farmers', methods=['POST'])
def create_farmer():
    """Create a new farmer (admin only)"""
    try:
        # Verify authentication
        access_token = request.cookies.get('access_token')
        if not access_token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token = auth_header.split(' ')[1]

        if not access_token:
            return jsonify({'error': 'Authentication required'}), 401

        user = get_user_by_token(access_token)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        # Apply rate limiting
        rate_limit(user.username)

        data = request.get_json()
        required_fields = ['name', 'location', 'areaPlot']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Name, location, and area plot are required'}), 400

        farmer = Farmer(
            name=data['name'],
            location=data['location'],
            area_plot=data['areaPlot'],
            crop_type=data.get('cropType'),
            irrigation_type=data.get('irrigationType'),
            phone=data.get('phone'),
            email=data.get('email'),
            farm_size_category=data.get('farmSizeCategory')
        )

        db.session.add(farmer)
        db.session.commit()

        return jsonify({
            'message': 'Farmer created successfully',
            'farmer': farmer.to_dict()
        }), 201

    except Exception as e:
        print(f"Create farmer error: {e}")
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    print("Starting GovConnect Backend...")
    print("Available endpoints:")
    print("POST /api/auth/login")
    print("POST /api/auth/register")
    print("GET /api/auth/verify")
    print("POST /api/auth/refresh")
    print("POST /api/auth/logout")
    print("POST /api/tasks/submit")
    print("GET /api/dashboard/metrics")
    print("GET /api/health")
    print(f"Running on {HOST}:{PORT}")
    app.run(debug=DEBUG, host=HOST, port=PORT)