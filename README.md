# GovConnect
# GovConnect - Government Infrastructure Dashboard

> A comprehensive government infrastructure dashboard built with React and TypeScript, featuring real-time monitoring, user authentication, and multi-sector analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Test Credentials](#test-credentials)
- [Error Handling](#error-handling)
- [Security & Secrets](#security--secrets)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Collaborators](#collaborators)

---

## Environment Variables

### Backend (.env in `/backend`)

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_EXPIRATION=86400
I can help you clean up this README, but I need to clarify a few things:

1. **The markdown has duplicated content** - The "Environment Variables" and "Features" sections appear multiple times
2. **There's a syntax error** - At `$SELECTION_PLACEHOLDER$`, the `DATABASE_URL` line is missing a newline
3. **Extensive commented-out code** - Large blocks are already commented out at the bottom

Here's the fix for the `$SELECTION_PLACEHOLDER$` location:

```env
REDIS_URL=redis://localhost:6379
DATABASE_URL=sqlite:///govconnect.db
```

**To properly clean this up, I recommend:**
- Remove the first duplicate "# GovConnect" heading
- Delete all the commented-out code at the end (or keep it in a separate `.backup.md` file)
- Remove duplicate section headers

Would you like me to provide a cleaned, consolidated version of the entire README without duplicates?
```env
REDIS_URL=redis://localhost:6379
```

However, I notice your README has significant duplication and commented-out content. Here's a **clean, consolidated version** for your entire file:

```markdown
# GovConnect - Government Infrastructure Dashboard

> A comprehensive government infrastructure dashboard built with React and TypeScript, featuring real-time monitoring, user authentication, and multi-sector analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Test Credentials](#test-credentials)
- [Error Handling](#error-handling)
- [Security & Secrets](#security--secrets)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Collaborators](#collaborators)

---

## Features

- 🔐 **User Authentication**: Secure login/registration with JWT tokens
- 🎨 **Theme Support**: Light/dark mode toggle
- 📊 **Real-time Dashboard**: Infrastructure monitoring across multiple sectors
- 🏥 **Healthcare Sector**: Appointment management and health metrics
- 🌾 **Agriculture Sector**: Crop monitoring and yield analytics
- 🏙️ **Urban Infrastructure**: Traffic and utility monitoring
- 🚨 **Alert System**: Real-time notifications and status updates
- 📱 **Responsive Design**: Works on desktop and mobile devices

---

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router DOM for routing
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Flask (Python) with JWT authentication
- Redis-based rate limiting
- Task scheduling with priority queues
- Password hashing with bcrypt

---

## Prerequisites

- Node.js v16 or higher
- Python 3.8 or higher
- pip (Python package manager)
- Redis (for rate limiting and caching)

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd GovConnect
```

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. Setup Frontend
```bash
cd ..
npm install
```

---

## Environment Variables

### Backend (.env in `/backend`)
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_EXPIRATION=86400
REDIS_URL=redis://localhost:6379
DATABASE_URL=sqlite:///govconnect.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=INFO
```

### Frontend (.env in root)
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=GovConnect
```

---

## Running Locally

### Start Backend (Terminal 1)
```bash
cd backend
python app.py
```
Backend runs on `http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

---

## Test Credentials

- **Username**: `admin`
- **Password**: `admin`

Or register a new account at the login page.

---

## Error Handling

- **Authentication Errors**: 401 Unauthorized with clear messages
- **Validation Errors**: 400 Bad Request with field-specific details
- **Rate Limiting**: 429 Too Many Requests (Redis-based)
- **Server Errors**: 500 with logging and user-friendly messages
- **Network Errors**: Automatic retry logic with exponential backoff
- **Token Expiration**: Auto-redirect to login with notification

---

## Security & Secrets

✅ **No secrets committed to repository**

- Environment variables stored in `.env` files (listed in `.gitignore`)
- JWT tokens stored securely in HTTP-only cookies
- Passwords hashed with bcrypt (never plain text)
- Production: Use AWS Secrets Manager or HashiCorp Vault

---

## Project Structure

```
GovConnect/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── users.json
│   └── README.md
├── components/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Sidebar.tsx
│   └── ...
├── pages/
│   ├── HomePage.tsx
│   ├── HealthcarePage.tsx
│   └── ...
├── App.tsx
├── index.tsx
├── package.json
├── .env
└── .gitignore
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification
- `GET /api/health` - Health check

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Run `npm install` or `pip install -r requirements.txt` |
| Port already in use | Change port in `app.py` or Vite config |
| CORS errors | Verify `CORS_ORIGINS` in `.env` |
| JWT token invalid | Clear cookies and re-login |
| Redis connection failed | Ensure Redis runs on localhost:6379 |

---

## Collaborators

- [Hetansh Sutaria](https://github.com/hetanshs-cmd) (Team Leader)
- [Kunal Pundhir](https://github.com/augustbeyondinfinity)
- [Krish Pundhir](https://github.com/Charlie199KO)
- [Kush Kelaiya](https://github.com/Kush-Kelaiya22)
- [Tanish Shah](https://github.com/tanishshahhh)

---

## License

MIT License
```

<!--
OLD CONTENT - ARCHIVED
[Previous duplicated and commented sections removed]
-->
```

Replace your entire file with this clean version.

DATABASE_URL=sqlite:///govconnect.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=INFO
```

### Frontend (.env in root)
# GovConnect - Government Infrastructure Dashboard

> A comprehensive government infrastructure dashboard built with React and TypeScript, featuring real-time monitoring, user authentication, and multi-sector analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Test Credentials](#test-credentials)
- [Error Handling](#error-handling)
- [Security & Secrets](#security--secrets)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Collaborators](#collaborators)

---

## Features

- 🔐 **User Authentication**: Secure login/registration with JWT tokens
- 🎨 **Theme Support**: Light/dark mode toggle
- 📊 **Real-time Dashboard**: Infrastructure monitoring across multiple sectors
- 🏥 **Healthcare Sector**: Appointment management and health metrics
- 🌾 **Agriculture Sector**: Crop monitoring and yield analytics
- 🏙️ **Urban Infrastructure**: Traffic and utility monitoring
- 🚨 **Alert System**: Real-time notifications and status updates
- 📱 **Responsive Design**: Works on desktop and mobile devices

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Flask** (Python) with:
   - JWT authentication system
   - Redis-based rate limiting
   - Task scheduling with priority queues
   - Background worker processing
   - Password hashing with bcrypt

---

## Prerequisites

- **Node.js** (v16 or higher)
- **Python 3** (v3.8 or higher)
- **pip** (Python package manager)
- **Redis** (for rate limiting and caching)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GovConnect
```

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. Setup Frontend
```bash
cd ..
npm install
```

---

## Environment Variables

### Backend (.env in `/backend`)

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_EXPIRATION=86400
REDIS_URL=redis://localhost:6379
DATABASE_URL=sqlite:///govconnect.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=INFO
```

### Frontend (.env in root)

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=GovConnect
```

---

## Running Locally

### Start Backend (Terminal 1)
```bash
cd backend
python app.py
```
Backend runs on `http://localhost:5000`

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

---

## Test Credentials

After starting the backend, use these demo credentials:
- **Username**: `admin`
- **Password**: `admin`

Or register a new account at the login page.

---

## Error Handling

The application implements comprehensive error handling:

- **Authentication Errors**: 401 Unauthorized with clear messages
- **Validation Errors**: 400 Bad Request with field-specific details
- **Rate Limiting**: 429 Too Many Requests (Redis-based)
- **Server Errors**: 500 with logging and user-friendly messages
- **Network Errors**: Automatic retry logic with exponential backoff
- **Token Expiration**: Auto-redirect to login with notification

---

## Security & Secrets

✅ **No secrets committed to repository**

- Environment variables stored in `.env` files (listed in `.gitignore`)
- Demo credentials for development only
- JWT tokens stored securely in HTTP-only cookies
- Passwords hashed with bcrypt (never plain text)
- Production: Use AWS Secrets Manager or HashiCorp Vault

---

## Project Structure

```
GovConnect/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── users.json
│   └── README.md
├── components/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Sidebar.tsx
│   └── ...
├── pages/
│   ├── HomePage.tsx
│   ├── HealthcarePage.tsx
│   └── ...
├── App.tsx
├── index.tsx
├── package.json
├── .env
└── .gitignore
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification
- `GET /api/health` - Health check

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `npm install` (frontend) or `pip install -r requirements.txt` (backend) |
| `Port already in use` | Change port in `app.py` or Vite config |
| `CORS errors` | Verify `CORS_ORIGINS` in backend `.env` |
| `JWT token invalid` | Clear cookies and re-login |
| `Redis connection failed` | Ensure Redis runs on localhost:6379 |

---

## Collaborators

- [Hetansh Sutaria](https://github.com/hetanshs-cmd) (Team Leader)
- [Kunal Pundhir](https://github.com/augustbeyondinfinity)
- [Krish Pundhir](https://github.com/Charlie199KO)
- [Kush Kelaiya](https://github.com/Kush-Kelaiya22)
- [Tanish Shah](https://github.com/tanishshahhh)

---

## License

This project is licensed under the MIT License.