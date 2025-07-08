from django.contrib.auth import get_user_model
from rest_framework import serializers

from applications.models import Application, ApplicationDocument
from applications.validators import validate_document_file

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    incorporation = serializers.FileField(write_only=True, required=True)
    proof_of_address = serializers.FileField(write_only=True, required=False)
    license = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "password",
            "incorporation",
            "proof_of_address",
            "license",
        ]

    def create(self, validated_data):
        full_name = validated_data.pop("name")
        parts = full_name.split(" ", 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""
        username = validated_data["email"]

        incorporation = validated_data.pop("incorporation")
        # proof_of_address = validated_data.pop('proof_of_address', None)
        # license = validated_data.pop('license', None)

        user = User(
            username=username,
            email=username,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(validated_data["password"])
        user.save()

        application = Application.objects.create(user=user)

        # Validate incorporation doc, other docs can be validated and created similarly
        validate_document_file(incorporation)
        # validate_document_file(proof_of_address)
        # validate_document_file(license)

        ApplicationDocument.objects.create(
            application=application, doc_type=ApplicationDocument.DocType.INCORPORATION, file=incorporation
        )
        # ApplicationDocument.objects.create(
        #     application=application, doc_type=ApplicationDocument.DocType.PROOF_OF_ADDRESS, file=incorporation
        # )
        # ApplicationDocument.objects.create(
        #     application=application, doc_type=ApplicationDocument.DocType.LICENSE, file=incorporation
        # )

        return user
