# email_templates.py

def appointment_confirmation_email(
    patient_name,
    doctor_name,
    hospital_name,
    appointment_date,
    appointment_time
):
    subject = "Appointment Confirmation"

    body = f"""
Dear {patient_name},

Your appointment has been successfully booked.

📍 Hospital: {hospital_name}
👨‍⚕️ Doctor: {doctor_name}
📅 Date: {appointment_date}
⏰ Time: {appointment_time}

Please arrive 10 minutes early and carry any relevant medical documents.

Thank you for choosing our healthcare services.

Regards,
Healthcare Appointment System
"""

    return subject, body
