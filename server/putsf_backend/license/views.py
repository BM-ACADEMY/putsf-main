from urllib.parse import quote
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from bson import ObjectId
from putsf_backend.settings import get_db
from django.core.files.storage import default_storage
import io
import os

# =========================================
# MongoDB Collection
# =========================================
mongo_db = get_db()
license_collection = mongo_db["licenses"] if mongo_db is not None else None


# =========================================
# License ViewSet (Using MongoDB)
# =========================================
class LicenseViewSet(viewsets.ViewSet):
    """
    Custom ViewSet using MongoDB directly (bypasses Django ORM)
    """
    http_method_names = ["get", "post", "delete"]

    # ---------------------------
    # GET - List all licenses
    # ---------------------------
    def list(self, request):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        data = list(license_collection.find())
        for item in data:
            item["_id"] = str(item["_id"])
        return Response(data)

    # ---------------------------
    # POST - Create a new license
    # ---------------------------
    def create(self, request):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        data = request.data.dict() if hasattr(request.data, "dict") else dict(request.data)
        phone = data.get("phone")

        # ✅ Basic validation
        if not phone:
            return Response({"error": "Phone number is required."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Normalize & validate
        phone = "".join(filter(str.isdigit, phone))
        if len(phone) != 10:
            return Response(
                {"error": "Please enter a valid 10-digit phone number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Check if phone already exists (MongoDB)
        existing = license_collection.find_one({"phone": phone})
        if existing:
            return Response(
                {"error": "This phone number is already registered with PUTSF."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Handle photo upload
        photo = request.FILES.get("photo")
        photo_path = None
        if photo:
            photo_path = default_storage.save(f"licenses/photos/{photo.name}", photo)

        # ✅ Prepare license document
        license_doc = {
            "name": data.get("name"),
            "aadhar_number": data.get("aadhar_number"),
            "phone": phone,
            "address": data.get("address"),
            "photo": request.build_absolute_uri(f"/media/{photo_path}") if photo_path else None,
            "is_approved": False,
        }

        # ✅ Insert to MongoDB
        result = license_collection.insert_one(license_doc)
        license_doc["_id"] = str(result.inserted_id)

        return Response(
            {"message": "✅ Membership request submitted successfully!", "data": license_doc},
            status=status.HTTP_201_CREATED
        )

    # ---------------------------
    # GET - Check if phone exists (real-time validation)
    # ---------------------------
    @action(detail=False, methods=["get"])
    def check_phone(self, request):
        """✅ Check if a phone number already exists (for live frontend validation)"""
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        phone = request.query_params.get("phone", "").strip()
        phone = "".join(filter(str.isdigit, phone))

        if not phone:
            return Response({"error": "Phone number is required."}, status=400)
        if len(phone) != 10:
            return Response({"error": "Invalid phone number."}, status=400)

        exists = license_collection.find_one({"phone": phone})
        if exists:
            return Response(
                {"exists": True, "message": "This phone number is already registered with PUTSF."}
            )
        else:
            return Response(
                {"exists": False, "message": "Phone number is available."}
            )

    # ---------------------------
    # DELETE - Remove license
    # ---------------------------
    def destroy(self, request, pk=None):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        license_collection.delete_one({"_id": ObjectId(pk)})
        return Response({"message": "License deleted"}, status=204)

    # ---------------------------
    # POST - Approve license (Generate PDF)
    # ---------------------------
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        license_doc = license_collection.find_one({"_id": ObjectId(pk)})
        if not license_doc:
            return Response({"error": "License not found"}, status=404)

        # ✅ Update approval status
        license_collection.update_one({"_id": ObjectId(pk)}, {"$set": {"is_approved": True}})

        # ✅ Generate license PDF
        html_content = render_to_string("license_template.html", {
            "license": license_doc,
            "request": request,
        })
        base_url = request.build_absolute_uri("/")
        pdf_bytes = HTML(string=html_content, base_url=base_url).write_pdf()

        # ✅ Save PDF to /media/licenses/pdf/
        pdf_filename = f"licenses/pdf/PUTSF_{license_doc['phone']}.pdf"
        pdf_path = default_storage.save(pdf_filename, io.BytesIO(pdf_bytes))
        pdf_url = request.build_absolute_uri(f"/media/{pdf_path}")

        # ✅ Update MongoDB with PDF path
        license_collection.update_one(
            {"_id": ObjectId(pk)},
            {"$set": {"license_pdf": pdf_url}}
        )

        # ✅ WhatsApp message
        name = license_doc.get("name", "")
        phone = license_doc.get("phone", "")
        download_link = "https://putsf.com/#/membership-download"
        message = (
            f"🎉 Hello {name}!\n\n"
            f"Your membership card has been approved ✅.\n"
            f"You can download it here:\n"
            f"{download_link}"
        )

        encoded_message = quote(message)
        whatsapp_link = f"https://wa.me/91{phone}?text={encoded_message}"

        return Response({
            "message": "✅ License approved successfully!",
            "license_pdf": pdf_url,  # ✅ include generated PDF URL
            "whatsapp_link": whatsapp_link,
        })



@api_view(["GET"])
def download_license(request):
    try:
        phone = request.GET.get("phone")
        if not phone:
            return Response({"error": "Phone required"}, status=400)

        # Fetch approved license
        license_doc = license_collection.find_one({
            "phone": phone,
            "is_approved": True
        })

        if not license_doc:
            return Response({"error": "Not found or not approved"}, status=404)

        license_doc["id"] = str(license_doc["_id"])

        # ============================================================
        # FIXED: MEMBER PHOTO (convert http URL → file:// path)
        # ============================================================
        photo = license_doc.get("photo")
        member_photo = None

        if photo:
            # detect relative media path from "media/"
            if "/media/" in photo:
                rel = photo.split("/media/")[-1]

                # ABSOLUTE PATH TO MEDIA ROOT
                media_root = "/root/arshad/Putsf/server/media"

                abs_path = os.path.join(media_root, rel)

                if os.path.exists(abs_path):
                    member_photo = f"file://{abs_path}"

        # fallback to default
        if not member_photo:
            member_photo = "file:///var/www/putsf_static/putsf_logo.png"

        # ============================================================
        # STATIC ASSETS (LOGO + SIGNATURE)
        # ============================================================
        # static_dir = "/var/www/putsf_static"
        static_dir = "/root/arshad/Putsf/server/static"


        logo_path = os.path.join(static_dir, "putsf_logo.jpg")
        signature_path = os.path.join(static_dir, "signature_blue.png")
        default_photo_path = os.path.join(static_dir, "putsf_logo_final.png")

        logo_url = f"file://{logo_path}"
        signature_url = f"file://{signature_path}"
        default_photo = f"file://{default_photo_path}"

        # ============================================================
        # Render template
        # ============================================================
        html_content = render_to_string("license_template.html", {
            "license": license_doc,
            "logo_url": logo_url,
            "signature_url": signature_url,
            "member_photo": member_photo,
            "default_photo": default_photo,
        })

        # pdf_file = HTML(string=html_content, base_url=f"file://{static_dir}").write_pdf()
        pdf_file = HTML(
        string=html_content,
        base_url=f"file://{static_dir}/"
        ).write_pdf()

        name = "".join(c for c in license_doc.get("name", "Member") if c.isalnum() or c in " _-")

        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="PUTSF_{name}.pdf"'
        return response

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)
