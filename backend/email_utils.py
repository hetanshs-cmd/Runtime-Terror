"""
Email utility functions for GovConnect
"""
import os
from flask import current_app
from flask_mail import Message
from datetime import datetime
import logging

def send_email(to, subject, html_body, text_body=None):
    """
    Send an email using Flask-Mail

    Args:
        to (str): Recipient email address
        subject (str): Email subject
        html_body (str): HTML content of the email
        text_body (str, optional): Plain text version of the email

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        msg = Message(
            subject=subject,
            recipients=[to],
            html=html_body
        )

        if text_body:
            msg.body = text_body

        current_app.extensions['mail'].send(msg)
        logging.info(f"Email sent successfully to {to}: {subject}")
        return True

    except Exception as e:
        logging.error(f"Failed to send email to {to}: {e}")
        return False

def send_appointment_scheduled_email(appointment):
    """
    Send email notification when appointment is scheduled

    Args:
        appointment: Appointment model instance
    """
    subject = f"Appointment Scheduled - GovConnect Healthcare"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Scheduled</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f8f9fa; }}
            .appointment-details {{ background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GovConnect Healthcare</h1>
                <p>Appointment Confirmation</p>
            </div>

            <div class="content">
                <h2>Hello {appointment.patient_name},</h2>

                <p>Your appointment has been successfully scheduled. Here are the details:</p>

                <div class="appointment-details">
                    <h3>Appointment Details</h3>
                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                    <p><strong>Department:</strong> {appointment.department}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor_name or 'To be assigned'}</p>
                    <p><strong>Date:</strong> {appointment.appointment_date.strftime('%B %d, %Y')}</p>
                    <p><strong>Time:</strong> {appointment.appointment_time.strftime('%I:%M %p')}</p>
                    {f'<p><strong>Symptoms:</strong> {appointment.symptoms}</p>' if appointment.symptoms else ''}
                </div>

                <p><strong>Important Notes:</strong></p>
                <ul>
                    <li>Please arrive 15 minutes before your scheduled time</li>
                    <li>Bring your ID and any relevant medical documents</li>
                    <li>If you need to reschedule or cancel, please contact us at least 24 hours in advance</li>
                </ul>

                <p>If you have any questions, please don't hesitate to contact our support team.</p>

                <p>Best regards,<br>GovConnect Healthcare Team</p>
            </div>

            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2026 GovConnect. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    GovConnect Healthcare - Appointment Scheduled

    Hello {appointment.patient_name},

    Your appointment has been successfully scheduled.

    Appointment Details:
    - Patient Name: {appointment.patient_name}
    - Department: {appointment.department}
    - Doctor: {appointment.doctor_name or 'To be assigned'}
    - Date: {appointment.appointment_date.strftime('%B %d, %Y')}
    - Time: {appointment.appointment_time.strftime('%I:%M %p')}
    {f'- Symptoms: {appointment.symptoms}' if appointment.symptoms else ''}

    Important Notes:
    - Please arrive 15 minutes before your scheduled time
    - Bring your ID and any relevant medical documents
    - If you need to reschedule or cancel, please contact us at least 24 hours in advance

    Best regards,
    GovConnect Healthcare Team
    """

    return send_email(appointment.patient_email, subject, html_body, text_body)

def send_appointment_confirmed_email(appointment):
    """
    Send email notification when appointment is confirmed

    Args:
        appointment: Appointment model instance
    """
    subject = f"Appointment Confirmed - GovConnect Healthcare"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Confirmed</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #059669; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f8f9fa; }}
            .appointment-details {{ background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GovConnect Healthcare</h1>
                <p>Appointment Confirmed</p>
            </div>

            <div class="content">
                <h2>Hello {appointment.patient_name},</h2>

                <p>Great news! Your appointment has been confirmed. Here are the details:</p>

                <div class="appointment-details">
                    <h3>Appointment Details</h3>
                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                    <p><strong>Department:</strong> {appointment.department}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor_name or 'To be assigned'}</p>
                    <p><strong>Date:</strong> {appointment.appointment_date.strftime('%B %d, %Y')}</p>
                    <p><strong>Time:</strong> {appointment.appointment_time.strftime('%I:%M %p')}</p>
                    {f'<p><strong>Symptoms:</strong> {appointment.symptoms}</p>' if appointment.symptoms else ''}
                </div>

                <p><strong>What to expect:</strong></p>
                <ul>
                    <li>Our medical team will be ready to assist you</li>
                    <li>Please bring your appointment confirmation (this email)</li>
                    <li>Arrive 15 minutes early for check-in procedures</li>
                </ul>

                <p>If you need to make any changes to your appointment, please contact us as soon as possible.</p>

                <p>We look forward to seeing you!</p>

                <p>Best regards,<br>GovConnect Healthcare Team</p>
            </div>

            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2026 GovConnect. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    GovConnect Healthcare - Appointment Confirmed

    Hello {appointment.patient_name},

    Great news! Your appointment has been confirmed.

    Appointment Details:
    - Patient Name: {appointment.patient_name}
    - Department: {appointment.department}
    - Doctor: {appointment.doctor_name or 'To be assigned'}
    - Date: {appointment.appointment_date.strftime('%B %d, %Y')}
    - Time: {appointment.appointment_time.strftime('%I:%M %p')}
    {f'- Symptoms: {appointment.symptoms}' if appointment.symptoms else ''}

    What to expect:
    - Our medical team will be ready to assist you
    - Please bring your appointment confirmation (this email)
    - Arrive 15 minutes early for check-in procedures

    We look forward to seeing you!

    Best regards,
    GovConnect Healthcare Team
    """

    return send_email(appointment.patient_email, subject, html_body, text_body)

def send_appointment_cancelled_email(appointment):
    """
    Send email notification when appointment is cancelled

    Args:
        appointment: Appointment model instance
    """
    subject = f"Appointment Cancelled - GovConnect Healthcare"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Cancelled</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #dc2626; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f8f9fa; }}
            .appointment-details {{ background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GovConnect Healthcare</h1>
                <p>Appointment Cancelled</p>
            </div>

            <div class="content">
                <h2>Hello {appointment.patient_name},</h2>

                <p>We regret to inform you that your appointment has been cancelled. Here are the details:</p>

                <div class="appointment-details">
                    <h3>Appointment Details</h3>
                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                    <p><strong>Department:</strong> {appointment.department}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor_name or 'To be assigned'}</p>
                    <p><strong>Date:</strong> {appointment.appointment_date.strftime('%B %d, %Y')}</p>
                    <p><strong>Time:</strong> {appointment.appointment_time.strftime('%I:%M %p')}</p>
                    {f'<p><strong>Symptoms:</strong> {appointment.symptoms}</p>' if appointment.symptoms else ''}
                </div>

                <p>If you would like to reschedule your appointment, please visit our website or contact our support team.</p>

                <p>We apologize for any inconvenience this may have caused.</p>

                <p>Best regards,<br>GovConnect Healthcare Team</p>
            </div>

            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2026 GovConnect. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    GovConnect Healthcare - Appointment Cancelled

    Hello {appointment.patient_name},

    We regret to inform you that your appointment has been cancelled.

    Appointment Details:
    - Patient Name: {appointment.patient_name}
    - Department: {appointment.department}
    - Doctor: {appointment.doctor_name or 'To be assigned'}
    - Date: {appointment.appointment_date.strftime('%B %d, %Y')}
    - Time: {appointment.appointment_time.strftime('%I:%M %p')}
    {f'- Symptoms: {appointment.symptoms}' if appointment.symptoms else ''}

    If you would like to reschedule your appointment, please visit our website or contact our support team.

    We apologize for any inconvenience this may have caused.

    Best regards,
    GovConnect Healthcare Team
    """

    return send_email(appointment.patient_email, subject, html_body, text_body)

def send_appointment_completed_email(appointment):
    """
    Send email notification when appointment is completed

    Args:
        appointment: Appointment model instance
    """
    subject = f"Appointment Completed - GovConnect Healthcare"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Completed</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #7c3aed; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f8f9fa; }}
            .appointment-details {{ background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GovConnect Healthcare</h1>
                <p>Appointment Completed</p>
            </div>

            <div class="content">
                <h2>Hello {appointment.patient_name},</h2>

                <p>Your appointment has been completed successfully. Thank you for choosing GovConnect Healthcare.</p>

                <div class="appointment-details">
                    <h3>Appointment Details</h3>
                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                    <p><strong>Department:</strong> {appointment.department}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor_name or 'Assigned doctor'}</p>
                    <p><strong>Date:</strong> {appointment.appointment_date.strftime('%B %d, %Y')}</p>
                    <p><strong>Time:</strong> {appointment.appointment_time.strftime('%I:%M %p')}</p>
                    {f'<p><strong>Symptoms:</strong> {appointment.symptoms}</p>' if appointment.symptoms else ''}
                </div>

                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Follow any instructions provided by your healthcare provider</li>
                    <li>Take prescribed medications as directed</li>
                    <li>Schedule follow-up appointments if recommended</li>
                    <li>Contact us if you have any questions about your treatment</li>
                </ul>

                <p>We hope to see you again soon. Your health is our priority!</p>

                <p>Best regards,<br>GovConnect Healthcare Team</p>
            </div>

            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; 2026 GovConnect. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    GovConnect Healthcare - Appointment Completed

    Hello {appointment.patient_name},

    Your appointment has been completed successfully. Thank you for choosing GovConnect Healthcare.

    Appointment Details:
    - Patient Name: {appointment.patient_name}
    - Department: {appointment.department}
    - Doctor: {appointment.doctor_name or 'Assigned doctor'}
    - Date: {appointment.appointment_date.strftime('%B %d, %Y')}
    - Time: {appointment.appointment_time.strftime('%I:%M %p')}
    {f'- Symptoms: {appointment.symptoms}' if appointment.symptoms else ''}

    Next Steps:
    - Follow any instructions provided by your healthcare provider
    - Take prescribed medications as directed
    - Schedule follow-up appointments if recommended
    - Contact us if you have any questions about your treatment

    We hope to see you again soon. Your health is our priority!

    Best regards,
    GovConnect Healthcare Team
    """

    return send_email(appointment.patient_email, subject, html_body, text_body)


def send_user_registration_email(user):
    """
    Send welcome email notification when user registers

    Args:
        user: User model instance
    """
    subject = f"Welcome to GovConnect Healthcare - Account Created Successfully"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to GovConnect</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f8f9fa; }}
            .welcome-box {{ background-color: white; padding: 20px; border-radius: 5px; margin: 15px 0; }}
            .features {{ background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>GovConnect Healthcare</h1>
                <p>Welcome to Our Healthcare Platform</p>
            </div>

            <div class="content">
                <h2>Hello {user.full_name}!</h2>

                <div class="welcome-box">
                    <h3>🎉 Welcome to GovConnect Healthcare!</h3>
                    <p>Your account has been successfully created. You can now access our comprehensive healthcare services including:</p>
                </div>

                <div class="features">
                    <h3>Available Services:</h3>
                    <ul>
                        <li><strong>🏥 Hospital Registration:</strong> Register and manage hospital information</li>
                        <li><strong>👨‍⚕️ Doctor Management:</strong> Add and manage healthcare professionals</li>
                        <li><strong>📅 Appointment Scheduling:</strong> Book appointments at registered hospitals</li>
                        <li><strong>🚜 Agriculture Support:</strong> Access farming and agricultural services</li>
                        <li><strong>📊 System Monitoring:</strong> Real-time health monitoring and alerts</li>
                        <li><strong>🤖 AI Assistant:</strong> Get help with our intelligent chatbot</li>
                    </ul>
                </div>

                <h3>Getting Started:</h3>
                <ol>
                    <li><strong>Login:</strong> Use your username <strong>{user.username}</strong> to log in</li>
                    <li><strong>Complete Profile:</strong> Add additional information to your profile</li>
                    <li><strong>Explore Services:</strong> Browse available healthcare and agricultural services</li>
                    <li><strong>Book Appointments:</strong> Schedule appointments at your preferred hospitals</li>
                </ol>

                <p><strong>Important Security Notes:</strong></p>
                <ul>
                    <li>Keep your login credentials secure and confidential</li>
                    <li>Change your password regularly for better security</li>
                    <li>Contact support if you notice any suspicious activity</li>
                </ul>

                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

                <p>Thank you for choosing GovConnect Healthcare. We're committed to providing you with the best healthcare services!</p>

                <p>Best regards,<br>GovConnect Healthcare Team</p>
            </div>

            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>© 2026 GovConnect Healthcare. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text_body = f"""
    Hello {user.full_name}!

    🎉 Welcome to GovConnect Healthcare!

    Your account has been successfully created. You can now access our comprehensive healthcare services.

    Account Details:
    - Username: {user.username}
    - Email: {user.email}
    - Registration Date: {user.created_at.strftime('%B %d, %Y') if user.created_at else 'Recent'}

    Available Services:
    - Hospital Registration: Register and manage hospital information
    - Doctor Management: Add and manage healthcare professionals
    - Appointment Scheduling: Book appointments at registered hospitals
    - Agriculture Support: Access farming and agricultural services
    - System Monitoring: Real-time health monitoring and alerts
    - AI Assistant: Get help with our intelligent chatbot

    Getting Started:
    1. Login using your username to access the platform
    2. Complete your profile with additional information
    3. Explore available healthcare and agricultural services
    4. Book appointments at your preferred hospitals

    Security Notes:
    - Keep your login credentials secure and confidential
    - Change your password regularly for better security
    - Contact support if you notice any suspicious activity

    If you have any questions, please contact our support team.

    Thank you for choosing GovConnect Healthcare!

    Best regards,
    GovConnect Healthcare Team

    This is an automated message. Please do not reply to this email.
    © 2026 GovConnect Healthcare. All rights reserved.
    """

    return send_email(user.email, subject, html_body, text_body)