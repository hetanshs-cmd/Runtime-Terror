# GovConnect Backend

Advanced Flask-based backend API for GovConnect dashboard with enterprise-grade features including authentication, rate limiting, task scheduling, and background processing.

## Features

### 🔐 Authentication System
- User registration and login with JWT tokens
- Password hashing using bcrypt
- Token-based session management (24-hour expiration)
- Secure user data storage

### 🛡️ Rate Limiting
- Redis-based rate limiting (100 requests per 60 seconds per user)
- IP-based and user-based throttling
- Prevents abuse and ensures fair usage

### ⚡ Task Scheduling & Processing
- Redis-backed priority queue system
- Background worker processing
- Asynchronous task handling for:
  - User login tracking
  - Registration processing
  - Metrics collection
  - Appointment booking
  - Alert processing

### 📊 Dashboard Integration
- Real-time metrics endpoints
- Task submission and status tracking
- Background processing results storage

## Tech Stack

- **Flask** - Web framework
- **Redis** - Caching and queue management
- **bcrypt** - Password hashing
- **PyJWT** - JSON Web Tokens
- **Flask-CORS** - Cross-origin resource sharing

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start Redis Server** (if not already running)
   ```bash
   redis-server
   ```

3. **Run the Flask Server**
   ```bash
   python app.py
   ```

4. **Run Background Workers** (optional, in separate terminals)
   ```bash
   python worker.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "username": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "fullName": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "username": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

#### GET `/api/auth/verify`
Verify JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "username": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

### Task Management

#### POST `/api/tasks/submit`
Submit a task for background processing.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "taskType": "string",
  "data": {},
  "priority": 1
}
```

**Response:**
```json
{
  "message": "Task submitted successfully",
  "taskId": "string",
  "status": "queued"
}
```

#### GET `/api/tasks/{task_id}`
Get task status and results.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": "processed",
  "task": {...},
  "result": {...},
  "timestamp": "ISO string"
}
```

### Dashboard

#### GET `/api/dashboard/metrics`
Get dashboard metrics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "healthcare": {...},
  "agriculture": {...},
  "infrastructure": {...},
  "alerts": {...}
}
```

### Health Check

#### GET `/api/health`
Check if the service is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "GovConnect Backend",
  "features": ["authentication", "rate_limiting", "task_scheduling", "redis_cache"]
}
```

## Architecture

### Components

1. **app.py** - Main Flask application with API endpoints
2. **config.py** - Configuration settings
3. **redis_client.py** - Redis connection management
4. **rate_limit.py** - Rate limiting functionality
5. **scheduler.py** - Task scheduling system
6. **worker.py** - Background worker process
7. **worker_pool.py** - Task processing logic

### Data Flow

1. **Authentication**: User logs in → JWT token generated → Stored in Redis with rate limiting
2. **Task Processing**: API receives task → Queued in Redis → Worker processes → Results stored
3. **Rate Limiting**: Each request checked against Redis counters → Throttled if exceeded

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Rate limiting prevents abuse (100 req/min per user)
- CORS enabled for development (configure for production)
- User data stored in JSON (use database in production)
- Redis should be secured in production environment

## Development Notes

- Frontend currently uses hardcoded login (admin/admin)
- Backend authentication endpoints are ready for integration
- Run workers in separate processes for production
- Monitor Redis memory usage for large deployments