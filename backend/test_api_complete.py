#!/usr/bin/env python3
import urllib.request
import json
import http.cookiejar

# Create a cookie jar to handle cookies
cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

def make_request(url, method='GET', data=None, headers=None):
    if headers is None:
        headers = {}

    if data and isinstance(data, dict):
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        response = opener.open(req)
        result = json.loads(response.read())
        print(f"Success: {result}")
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_health():
    print("Testing health endpoint...")
    return make_request('http://localhost:5000/api/health')

def test_register():
    print("Testing registration...")
    data = {
        'username': 'testuser2',
        'password': 'testpass123',
        'fullName': 'Test User 2',
        'email': 'test2@example.com'
    }
    return make_request('http://localhost:5000/api/auth/register', 'POST', data)

def test_login():
    print("Testing login...")
    data = {
        'username': 'testuser2',
        'password': 'testpass123'
    }
    return make_request('http://localhost:5000/api/auth/login', 'POST', data)

def test_verify():
    print("Testing token verification...")
    return make_request('http://localhost:5000/api/auth/verify')

def test_dashboard():
    print("Testing dashboard metrics...")
    return make_request('http://localhost:5000/api/dashboard/metrics')

if __name__ == '__main__':
    print("Testing GovConnect API endpoints...")

    # Test health
    test_health()

    # Test registration
    test_register()

    # Test login
    test_login()

    # Test verify
    test_verify()

    # Test dashboard
    test_dashboard()

    print("Testing complete!")