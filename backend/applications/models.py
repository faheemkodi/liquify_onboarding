from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Application(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="application"
    )
    overall_status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Application for {self.user.email}"


class ApplicationDocument(models.Model):
    class DocType(models.TextChoices):
        INCORPORATION = "incorporation", "Certificate of Incorporation"
        PROOF_OF_ADDRESS = "proof_of_address", "Proof of Address"
        LICENSE = "license", "Business License"

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"
        PUSHBACK = "Pushback", "Pushback"

    application = models.ForeignKey(
        Application, on_delete=models.CASCADE, related_name="documents"
    )
    doc_type = models.CharField(max_length=50, choices=DocType.choices)
    file = models.FileField(upload_to="documents/%Y/%m/%d/")
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    pushback_reason = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doc_type} for {self.application.user.email} - {self.status}"
