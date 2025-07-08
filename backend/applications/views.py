from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from applications.models import Application, ApplicationDocument
from applications.serializers import ApplicationDocumentSerializer
from applications.validators import validate_document_file


class ApplicationDetailView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            app = request.user.application
        except Application.DoesNotExist:
            return Response(
                {"error": "No application found."}, status=status.HTTP_404_NOT_FOUND
            )

        docs = ApplicationDocument.objects.filter(application=app)
        data = {
            "overall_status": app.overall_status,
            "documents": ApplicationDocumentSerializer(docs, many=True).data,
        }
        return Response(data)


class ReuploadDocumentView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        doc_type = request.data.get("doc_type")
        file = request.data.get("file")
        if not doc_type or not file:
            return Response(
                {"error": "doc_type and file are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            app = request.user.application
        except Application.DoesNotExist:
            return Response(
                {"error": "No application found."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            doc = app.documents.get(doc_type=doc_type)
        except ApplicationDocument.DoesNotExist:
            return Response(
                {"error": f"No document of type {doc_type} found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        validate_document_file(file)
        doc.file = file
        doc.status = "Pending"
        doc.pushback_reason = ""
        doc.save()

        return Response({"success": True, "status": "Pending"})
