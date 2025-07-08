import cv2
import numpy as np
from PIL import Image
from rest_framework import serializers


def validate_document_file(value):
    # Check size
    max_size = 5 * 1024 * 1024
    if value.size > max_size:
        raise serializers.ValidationError("Document size must be under 5MB.")

    # Check MIME
    valid_mime_types = ["application/pdf", "image/jpeg", "image/png"]
    if value.content_type not in valid_mime_types:
        raise serializers.ValidationError("Only PDF, JPG, or PNG files are allowed.")

    # If image, validate resolution + blurriness
    if value.content_type in ["image/jpeg", "image/png"]:
        image = Image.open(value)
        width, height = image.size
        if width < 100 or height < 100:
            raise serializers.ValidationError(
                "Image resolution too low. Please upload a clear scan."
            )

        value.seek(0)
        file_bytes = np.asarray(bytearray(value.read()), dtype=np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)

        if img is None:
            raise serializers.ValidationError("Unable to read image file.")

        variance = cv2.Laplacian(img, cv2.CV_64F).var()
        if variance < 100:
            raise serializers.ValidationError(
                "Image too blurry. Please upload a sharper scan."
            )
    return value
