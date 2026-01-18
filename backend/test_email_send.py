#!/usr/bin/env python3
"""
Test script to send a test email using the configured credentials
"""

import sys
sys.path.append('/home/kushk/Documents/Ingenous Hackathon 7.0/GovConnect/backend')

from flask import Flask
from flask_mail import Mail, Message
from config import (
    MAIL_SERVER, MAIL_PORT, MAIL_USE_TLS, MAIL_USE_SSL,
    MAIL_USERNAME, MAIL_PASSWORD, MAIL_DEFAULT_SENDER
)

def send_test_email():
    """Send a test email to verify email configuration"""

    # Create Flask app for mail extension
    app = Flask(__name__)

    # Configure mail
    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
    app.config['MAIL_USE_SSL'] = MAIL_USE_SSL
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
    app.config['MAIL_DEFAULT_SENDER'] = MAIL_DEFAULT_SENDER

    mail = Mail(app)

    with app.app_context():
        try:
            msg = Message(
                subject="Test Email from GovConnect",
                recipients=["kelaiyakush@gmail.com"],
                html=f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Test Email</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f8f9fa; }}
                        .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>GovConnect Healthcare</h1>
                            <p>Test Email</p>
                        </div>
                        <div class="content">
                            <h2>Hello!</h2>
                            <p>This is a test email to verify that the email integration is working correctly.</p>
                            <p>If you received this email, it means the email configuration is properly set up and ready to send appointment notifications.</p>
                            <p><strong>Test Details:</strong></p>
                            <ul>
                                <li>Sender: {MAIL_DEFAULT_SENDER}</li>
                                <li>SMTP Server: smtp.gmail.com</li>
                                <li>Port: 587</li>
                                <li>TLS: Enabled</li>
                            </ul>
                            <p>Best regards,<br>GovConnect Development Team</p>
                        </div>
                        <div class="footer">
                            <p>This is a test message from GovConnect Healthcare System.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                body=f"""
                Hello!

                This is a test email to verify that the email integration is working correctly.

                If you received this email, it means the email configuration is properly set up and ready to send appointment notifications.

                Test Details:
                - Sender: {MAIL_DEFAULT_SENDER}
                - SMTP Server: smtp.gmail.com
                - Port: 587
                - TLS: Enabled

                Best regards,
                GovConnect Development Team

                This is a test message from GovConnect Healthcare System.
                """
            )

            mail.send(msg)
            print("✅ Test email sent successfully to kelaiyakush@gmail.com!")
            print(f"📧 From: {MAIL_DEFAULT_SENDER}")
            print("📧 To: kelaiyakush@gmail.com")
            print("📧 Subject: Test Email from GovConnect")

        except Exception as e:
            print(f"❌ Failed to send test email: {e}")
            print("Please check your email credentials and network connection.")

if __name__ == "__main__":
    send_test_email()