from rest_framework import serializers

from applications.models import Application, ApplicationDocument
from applications.validators import validate_document_file


class ApplicationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationDocument
        fields = ["doc_type", "file", "status", "pushback_reason", "uploaded_at"]


class ApplicationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["status", "document", "pushback_reason", "created_at", "updated_at"]


class ReuploadDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["document"]

    def validate_document(self, value):
        return validate_document_file(value)
