from django.urls import path

from applications.views import ApplicationDetailView, ReuploadDocumentView

app_name = "applications"

urlpatterns = [
    path("me/", ApplicationDetailView.as_view(), name="application-detail"),
    path("me/reupload/", ReuploadDocumentView.as_view(), name="application-reupload"),
]
