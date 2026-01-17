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
REDIS_URL=redis://localhost:6379
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
<!--  -->
<!-- ```env -->
<!-- VITE_API_URL=http://localhost:5000 -->
<!-- VITE_APP_NAME=GovConnect -->
<!-- ``` -->
<!--  -->
<!-- --- -->
<!--  -->
<!-- ## Error Handling -->
<!--  -->
<!-- The application implements comprehensive error handling: -->
<!--  -->
<!-- - **Authentication Errors**: 401 Unauthorized responses with clear messages -->
<!-- - **Validation Errors**: 400 Bad Request with field-specific error details -->
<!-- - **Rate Limiting**: 429 Too Many Requests (Redis-based) -->
<!-- - **Server Errors**: 500 with logging and user-friendly messages -->
<!-- - **Network Errors**: Automatic retry logic with exponential backoff -->
<!-- - **Token Expiration**: Auto-redirect to login with notification -->
<!--  -->
<!-- --- -->
<!--  -->
<!-- ## Security & Secrets Confirmation -->
<!--  -->
<!-- ✅ **No secrets committed to repository** -->
<!--  -->
<!-- - Environment variables are in `.env` files (listed in `.gitignore`) -->
<!-- - Demo credentials are for development only -->
<!-- - JWT tokens are stored securely in HTTP-only cookies -->
<!-- - Passwords are hashed with bcrypt (never stored in plain text) -->
<!-- - For production: Use proper secrets management (AWS Secrets Manager, HashiCorp Vault) -->
<!--  -->
<!-- --- -->
<!--  -->
<!-- ## Troubleshooting -->
<!--  -->
<!-- | Issue | Solution | -->
<!-- |-------|----------| -->
<!-- | `Module not found` | Run `npm install` (frontend) or `pip install -r requirements.txt` (backend) | -->
<!-- | `Port already in use` | Change port in `app.py` (Flask) or Vite config | -->
<!-- | `CORS errors` | Verify `CORS_ORIGINS` in backend `.env` | -->
<!-- | `JWT token invalid` | Clear cookies and re-login | -->
<!-- | `Redis connection failed` | Ensure Redis is running on localhost:6379 | -->
<!--  -->
<!-- ``` -->
<!-- ``` -->
<!--  -->
<!--  -->
<!-- A comprehensive government infrastructure dashboard built with React and TypeScript, featuring real-time monitoring, user authentication, and multi-sector analytics. -->
<!--  -->
<!-- ## Features -->
<!--  -->
<!-- - 🔐 **User Authentication**: Secure login/registration with JWT tokens -->
<!-- - 🎨 **Theme Support**: Light/dark mode toggle -->
<!-- - 📊 **Real-time Dashboard**: Infrastructure monitoring across multiple sectors -->
<!-- - 🏥 **Healthcare Sector**: Appointment management and health metrics -->
<!-- - 🌾 **Agriculture Sector**: Crop monitoring and yield analytics -->
<!-- - 🏙️ **Urban Infrastructure**: Traffic and utility monitoring -->
<!-- - 🚨 **Alert System**: Real-time notifications and status updates -->
<!-- - 📱 **Responsive Design**: Works on desktop and mobile devices -->
<!--  -->
<!-- ## Tech Stack -->
<!--  -->
<!-- ### Frontend -->
<!-- - **React 18** with TypeScript -->
<!-- - **React Router DOM** for routing -->
<!-- - **Tailwind CSS** for styling -->
<!-- - **Lucide React** for icons -->
<!-- - **Vite** for build tooling -->
<!--  -->
<!-- ### Backend -->
<!-- - **Flask** (Python) with advanced features: -->
  <!-- - JWT authentication system -->
  <!-- - Redis-based rate limiting -->
  <!-- - Task scheduling with priority queues -->
  <!-- - Background worker processing -->
  <!-- - Password hashing with bcrypt -->
<!-- - **Note**: Frontend currently uses hardcoded login (admin/admin) for development. Backend authentication endpoints are ready for integration. -->
<!--  -->
<!-- ## Getting Started -->
<!--  -->
<!-- ### Prerequisites -->
<!--  -->
<!-- - **Node.js** (v16 or higher) -->
<!-- - **Python 3** (v3.8 or higher) -->
<!-- - **pip** (Python package manager) -->
<!--  -->
<!-- ### Installation -->
<!--  -->
<!-- 1. **Clone the repository** -->
   <!-- ```bash -->
   <!-- git clone <repository-url> -->
   <!-- cd GovConnect -->
   <!-- ``` -->
<!--  -->
<!-- 2. **Setup Backend** -->
   <!-- ```bash -->
   <!-- cd backend -->
   <!-- pip install -r requirements.txt -->
   <!-- ``` -->
<!--  -->
<!-- 3. **Setup Frontend** -->
   <!-- ```bash -->
   <!-- cd ..  # Back to root directory -->
   <!-- npm install -->
   <!-- ``` -->
<!--  -->
<!-- ### Running the Application -->
<!--  -->
<!-- 1. **Start the Backend** (Terminal 1) -->
   <!-- ```bash -->
   <!-- cd backend -->
   <!-- ./run.sh -->
   <!-- # or manually: python app.py -->
   <!-- ``` -->
   <!-- Backend will run on `http://localhost:5000` -->
<!--  -->
<!-- 2. **Start the Frontend** (Terminal 2) -->
   <!-- ```bash -->
   <!-- npm run dev -->
   <!-- ``` -->
   <!-- Frontend will run on `http://localhost:3000` or `http://localhost:3001` -->
<!--  -->
<!-- ### Default Credentials -->
<!--  -->
<!-- After starting the backend, you can register a new account or use these demo credentials: -->
<!-- - **Username**: `admin` -->
<!-- - **Password**: `admin` -->
<!--  -->
<!-- ## API Endpoints -->
<!--  -->
<!-- ### Authentication -->
<!-- - `POST /api/auth/login` - User login -->
<!-- - `POST /api/auth/register` - User registration -->
<!-- - `GET /api/auth/verify` - Token verification -->
<!-- - `GET /api/health` - Health check -->
<!--  -->
<!-- ## Project Structure -->
<!--  -->
<!-- ``` -->
<!-- GovConnect/ -->
<!-- ├── backend/                 # Flask API server -->
<!-- │   ├── app.py              # Main Flask application -->
<!-- │   ├── requirements.txt    # Python dependencies -->
<!-- │   ├── users.json          # User data storage (dev only) -->
<!-- │   └── README.md           # Backend documentation -->
<!-- ├── components/             # React components -->
<!-- │   ├── Login.tsx          # Authentication component -->
<!-- │   ├── Dashboard.tsx      # Main dashboard -->
<!-- │   ├── Sidebar.tsx        # Navigation sidebar -->
<!-- │   └── ... -->
<!-- ├── pages/                  # Page components -->
<!-- │   ├── HomePage.tsx -->
<!-- │   ├── HealthcarePage.tsx -->
<!-- │   └── ... -->
<!-- ├── App.tsx                # Main app component -->
<!-- ├── index.tsx              # App entry point -->
<!-- └── package.json           # Frontend dependencies -->
<!-- ``` -->
<!--  -->
<!-- ## Development -->
<!--  -->
<!-- ### Available Scripts -->
<!--  -->
<!-- - `npm run dev` - Start development server -->
<!-- - `npm run build` - Build for production -->
<!-- - `npm run preview` - Preview production build -->
<!--  -->
<!-- ### Backend Development -->
<!--  -->
<!-- - `python app.py` - Run Flask development server -->
<!-- - `./run.sh` - Automated setup and run script -->
<!--  -->
<!-- ## Security Notes -->
<!--  -->
<!-- - JWT tokens expire after 24 hours -->
<!-- - Passwords are hashed using bcrypt -->
<!-- - User data is stored in JSON file (development only) -->
<!-- - Use proper database in production -->
<!-- - Configure CORS appropriately for production deployment -->
<!--  -->
<!-- ## Collaborators -->
<!--  -->
<!-- - [Hetansh Sutaria](https://github.com/hetanshs-cmd) (Team Leader) -->
<!-- - [Kunal Pundhir](https://github.com/augustbeyondinfinity) -->
<!-- - [Krish Pundhir](https://github.com/Charlie199KO) -->
<!-- - [Kush Kelaiya](https://github.com/Kush-Kelaiya22) -->
<!-- - [Tanish Shah](https://github.com/tanishshahhh) -->
<!--  -->
<!-- ## License -->
<!--  -->
<!-- This project is licensed under the MIT License. -->