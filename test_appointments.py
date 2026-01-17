#!/usr/bin/env python3
"""
Test script for appointment booking functionality
"""
import requests
import json

BASE_URL = 'http://localhost:5001'

def test_appointment_booking():
    """Test appointment booking functionality"""
    print("🧪 Testing Appointment Booking System")
    print("=" * 50)

    # Test data
    appointment_data = {
        'patientName': 'John Doe',
        'patientEmail': 'john.doe@example.com',
        'patientPhone': '9876543210',
        'hospitalId': 'GOV-DEL-123',  # Using one of the existing hospitals
        'department': 'Cardiology',
        'appointmentDate': '2026-01-25',
        'appointmentTime': '14:00'
    }

    try:
        # Test appointment booking
        print("📅 Testing appointment booking...")
        response = requests.post(f'{BASE_URL}/api/appointments', json=appointment_data)

        print(f"Status Code: {response.status_code}")

        if response.status_code == 201:
            result = response.json()
            print("✅ Appointment booked successfully!")
            print(f"Appointment ID: {result['appointment']['id']}")
            print(f"Patient: {result['appointment']['patientName']}")
            print(f"Date: {result['appointment']['appointmentDate']}")
            print(f"Time: {result['appointment']['appointmentTime']}")

            # Test viewing appointments by email
            print("\n📋 Testing appointment retrieval...")
            email_response = requests.get(f'{BASE_URL}/api/appointments/my?email={appointment_data["patientEmail"]}')
            if email_response.status_code == 200:
                email_data = email_response.json()
                print(f"✅ Found {len(email_data['appointments'])} appointments for {appointment_data['patientEmail']}")
            else:
                print(f"❌ Failed to retrieve appointments: {email_response.status_code}")

        elif response.status_code == 409:
            print("⚠️  Time slot already booked (this is expected if running multiple times)")
        else:
            error_data = response.json()
            print(f"❌ Appointment booking failed: {error_data.get('error', 'Unknown error')}")

    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server. Make sure it's running on port 5001")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == '__main__':
    test_appointment_booking()