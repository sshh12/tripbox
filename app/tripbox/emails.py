import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

FROM_EMAIL = "noreply@sshh.io"

sg = SendGridAPIClient(os.environ.get("SENDGRID_API_KEY"))


def send_email(to_email, subject, html_content):
    message = Mail(from_email=FROM_EMAIL, to_emails=to_email, subject=subject, html_content=html_content)
    resp = sg.send(message)
    return resp
