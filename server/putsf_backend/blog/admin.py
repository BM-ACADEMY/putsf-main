# putsf_backend/blog/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'custom_actions')
    list_filter = ('created_at',)
    search_fields = ('title',)
    readonly_fields = ('created_at',)

    def custom_actions(self, obj):
        edit_url = f'/admin/blog/blog/{obj.id}/change/'
        delete_url = f'/admin/blog/blog/{obj.id}/delete/'

        return format_html(
            '<a class="button" href="{}">Edit</a>&nbsp;'
            '<a class="button" href="{}">Delete</a>',
            edit_url,
            delete_url,
        )

    custom_actions.short_description = 'Actions'
