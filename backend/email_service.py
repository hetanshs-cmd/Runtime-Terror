# email_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from email_templates import appointment_confirmation_email


# ==========================
# EMAIL CONFIG (EDIT SAFELY)
# ==========================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "thinkincode2025@gmail.com"
SENDER_PASSWORD = "fobk fjfw wgqr tqvu"


# ==========================
# SEND EMAIL FUNCTION
# ==========================
def send_appointment_email(
    to_email,
    patient_name,
    doctor_name,
    hospital_name,
    appointment_date,
    appointment_time
):
    subject, body = appointment_confirmation_email(
        patient_name,
        doctor_name,
        hospital_name,
        appointment_date,
        appointment_time
    )

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()

        return True

    except Exception as e:
        print("Email sending failed:", str(e))
        return False
