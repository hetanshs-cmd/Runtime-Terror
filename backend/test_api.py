#!/usr/bin/env python3
import urllib.request
import json

def test_registration():
    data = {
        'username': 'testuser',
        'password': 'testpass123',
        'fullName': 'Test User',
        'email': 'test@example.com'
    }

    req = urllib.request.Request(
        'http://localhost:5000/api/auth/register',
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        print('Registration successful:', result)
        return True
    except Exception as e:
        print('Registration error:', e)
        return False

def test_login():
    data = {
        'username': 'testuser',
        'password': 'testpass123'
    }

    req = urllib.request.Request(
        'http://localhost:5000/api/auth/login',
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        print('Login successful:', result)
        return response.headers.get('Set-Cookie')
    except Exception as e:
        print('Login error:', e)
        return None

def test_health():
    try:
        response = urllib.request.urlopen('http://localhost:5000/api/health')
        result = json.loads(response.read())
        print('Health check:', result)
        return True
    except Exception as e:
        print('Health check error:', e)
        return False

if __name__ == '__main__':
    print("Testing GovConnect Backend...")

    # Test health
    test_health()

    # Test registration
    test_registration()

    # Test login
    cookies = test_login()
    if cookies:
        print("Cookies received:", cookies)