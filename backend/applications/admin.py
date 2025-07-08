from django.contrib import admin

from applications.models import Application, ApplicationDocument


class ApplicationDocumentInline(admin.TabularInline):
    model = ApplicationDocument
    extra = 0
    fields = ("doc_type", "file", "status", "pushback_reason", "uploaded_at")
    readonly_fields = ("uploaded_at",)
    show_change_link = True


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("user", "overall_status", "created_at", "updated_at")
    list_filter = ("overall_status",)
    search_fields = ("user__username", "user__email")
    readonly_fields = ("created_at", "updated_at")
    inlines = [ApplicationDocumentInline]

    def has_add_permission(self, request):
        return False
