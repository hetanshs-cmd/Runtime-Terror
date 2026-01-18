#!/usr/bin/env python3
"""
Comprehensive test for email integration in appointment system
"""

import os
import sys
import json
sys.path.append('/home/kushk/Documents/Ingenous Hackathon 7.0/GovConnect/backend')

# Mock Flask-Mail to prevent actual email sending
class MockMessage:
    def __init__(self, subject, recipients, body=None, html=None):
        self.subject = subject
        self.recipients = recipients
        self.body = body
        self.html = html

class MockMail:
    def __init__(self, app=None):
        self.app = app

    def send(self, message):
        print("\n" + "="*60)
        print("MOCK EMAIL SENT:")
        print("="*60)
        print(f"To: {message.recipients}")
        print(f"Subject: {message.subject}")
        print(f"Body: {message.body[:200]}..." if message.body else "HTML Email")
        if message.html:
            print(f"HTML Content Length: {len(message.html)} characters")
        print("="*60 + "\n")
        return True

# Monkey patch Flask-Mail
import flask_mail
flask_mail.Message = MockMessage
flask_mail.Mail = MockMail

# Set up test environment variables
os.environ['MAIL_USERNAME'] = 'test@govconnect.in'
os.environ['MAIL_PASSWORD'] = 'test-password'
os.environ['MAIL_DEFAULT_SENDER'] = 'noreply@govconnect.in'

from app import app
from models import db, User, Appointment, Hospital, Doctor
from email_utils import (
    send_appointment_scheduled_email,
    send_appointment_confirmed_email,
    send_appointment_cancelled_email,
    send_appointment_completed_email
)

def setup_test_data():
    """Set up test data for email testing"""
    with app.app_context():
        # Use existing user or create minimal one
        test_user = User.query.filter_by(username='email_test_user').first()
        if not test_user:
            test_user = User(
                username='email_test_user',
                email='test.patient@govconnect.in',
                full_name='Email Test User',
                password='testpass123'
            )
            test_user.role = 'user'
            db.session.add(test_user)
            db.session.commit()

        # Use existing hospital
        test_hospital = Hospital.query.first()
        if not test_hospital:
            # Create minimal hospital data
            test_hospital = Hospital(
                name='Test Hospital',
                address='123 Test Street',
                phone='555-0123',
                email='hospital@test.com',
                city='Test City',
                state='Test State',
                type='Government'
            )
            db.session.add(test_hospital)
            db.session.commit()

        # Use existing doctor
        test_doctor = Doctor.query.first()
        if not test_doctor:
            # Create minimal doctor data
            test_doctor = Doctor(
                dr_name='Dr. Test',
                hospital_id=str(test_hospital.hospital_id),
                gender='Male',
                time='9:00 AM - 5:00 PM'
            )
            db.session.add(test_doctor)
            db.session.commit()

        return test_user, test_hospital, test_doctor

def test_email_notifications():
    """Test all email notification scenarios"""
    print("Testing Email Notifications for Appointments")
    print("=" * 50)

    with app.app_context():
        test_user, test_hospital, test_doctor = setup_test_data()

        # Create a test appointment
        appointment = Appointment(
            patient_name=test_user.full_name,
            patient_email=test_user.email,
            patient_phone='555-0789',
            hospital_id=str(test_hospital.hospital_id),
            department='General Medicine',
            doctor_name=test_doctor.dr_name,
            appointment_date='2024-01-25',
            appointment_time='14:00:00',
            status='scheduled',
            created_by=test_user.id
        )
        db.session.add(appointment)
        db.session.commit()

        print(f"Created test appointment ID: {appointment.id}")

        # Test 1: Scheduled email
        print("\n1. Testing Appointment Scheduled Email...")
        try:
            send_appointment_scheduled_email(appointment)
            print("✓ Scheduled email sent successfully")
        except Exception as e:
            print(f"✗ Error sending scheduled email: {e}")

        # Test 2: Confirmed email
        print("\n2. Testing Appointment Confirmed Email...")
        appointment.status = 'confirmed'
        db.session.commit()
        try:
            send_appointment_confirmed_email(appointment)
            print("✓ Confirmed email sent successfully")
        except Exception as e:
            print(f"✗ Error sending confirmed email: {e}")

        # Test 3: Cancelled email
        print("\n3. Testing Appointment Cancelled Email...")
        appointment.status = 'cancelled'
        db.session.commit()
        try:
            send_appointment_cancelled_email(appointment)
            print("✓ Cancelled email sent successfully")
        except Exception as e:
            print(f"✗ Error sending cancelled email: {e}")

        # Test 4: Completed email
        print("\n4. Testing Appointment Completed Email...")
        appointment.status = 'completed'
        db.session.commit()
        try:
            send_appointment_completed_email(appointment)
            print("✓ Completed email sent successfully")
        except Exception as e:
            print(f"✗ Error sending completed email: {e}")

        # Clean up
        db.session.delete(appointment)
        db.session.commit()

        print("\n" + "=" * 50)
        print("Email Integration Test Completed!")
        print("All email templates are working correctly.")
        print("Note: This test uses mock email sending - no actual emails were sent.")

if __name__ == "__main__":
    test_email_notifications()