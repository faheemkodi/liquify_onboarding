from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from applications.models import Application, ApplicationDocument

@receiver([post_save, post_delete], sender=ApplicationDocument)
def update_application_overall_status(sender, instance, **kwargs):
    app = instance.application
    docs = app.documents.all()

    if any(doc.status == ApplicationDocument.Status.PUSHBACK for doc in docs):
        app.overall_status = "Pushback"
    elif any(doc.status == ApplicationDocument.Status.REJECTED for doc in docs):
        app.overall_status = "Rejected"
    elif all(doc.status == ApplicationDocument.Status.APPROVED for doc in docs):
        app.overall_status = "Approved"
    else:
        app.overall_status = "Pending"

    app.save(update_fields=["overall_status"])