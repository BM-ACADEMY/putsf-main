# from urllib.parse import quote
# from rest_framework import viewsets, status
# from rest_framework.decorators import action, api_view
# from rest_framework.response import Response
# from django.http import HttpResponse
# from django.template.loader import render_to_string
# from weasyprint import HTML
# from bson import ObjectId
# from putsf_backend.settings import get_db
# from django.core.files.storage import default_storage
# import io
# import os

# # =========================================
# # MongoDB Collection
# # =========================================
# mongo_db = get_db()
# license_collection = mongo_db["licenses"] if mongo_db is not None else None


# # =========================================
# # License ViewSet (Using MongoDB)
# # =========================================
# class LicenseViewSet(viewsets.ViewSet):
#     http_method_names = ["get", "post", "delete"]

#     # ---------------------------
#     # GET - List all licenses
#     # ---------------------------
#     def list(self, request):
#         if license_collection is None:
#             return Response({"error": "MongoDB not connected"}, status=500)

#         data = list(license_collection.find())
#         for item in data:
#             item["_id"] = str(item["_id"])
#         return Response(data)

#     # ---------------------------
#     # POST - Create a new license
#     # ---------------------------
#     def create(self, request):
#         if license_collection is None:
#             return Response({"error": "MongoDB not connected"}, status=500)

#         data = request.data.dict() if hasattr(request.data, "dict") else dict(request.data)
#         phone = data.get("phone")

#         # --------------------------
#         # Basic phone validation
#         # --------------------------
#         if not phone:
#             return Response({"error": "Phone number is required."}, status=400)

#         phone = "".join(filter(str.isdigit, phone))
#         if len(phone) != 10:
#             return Response({"error": "Please enter a valid 10-digit phone number."}, status=400)

#         # Check existing phone
#         if license_collection.find_one({"phone": phone}):
#             return Response(
#                 {"error": "This phone number is already registered with PUTSF."},
#                 status=400
#             )

#         # --------------------------
#         # Handle Photo Upload
#         # --------------------------
#         photo = request.FILES.get("photo")
#         photo_path = None
#         if photo:
#             photo_path = default_storage.save(f"licenses/photos/{photo.name}", photo)

#         # --------------------------
#         # Prepare document
#         # --------------------------
#         license_doc = {
#             "name": data.get("name"),
#             "education": data.get("education"),
#             "gender": data.get("gender"),
#             "phone": phone,
#             "address": data.get("address"),
#             "photo": request.build_absolute_uri(f"/media/{photo_path}") if photo_path else None,
#             "is_approved": False,
#         }

#         result = license_collection.insert_one(license_doc)
#         license_doc["_id"] = str(result.inserted_id)

#         return Response(
#             {"message": "Membership request submitted successfully!", "data": license_doc},
#             status=201
#         )

#     # ---------------------------
#     # GET - Check if phone exists
#     # ---------------------------
#     @action(detail=False, methods=["get"])
#     def check_phone(self, request):
#         if license_collection is None:
#             return Response({"error": "MongoDB not connected"}, status=500)

#         phone = request.query_params.get("phone", "").strip()
#         phone = "".join(filter(str.isdigit, phone))

#         if not phone:
#             return Response({"error": "Phone number is required."}, status=400)
#         if len(phone) != 10:
#             return Response({"error": "Invalid phone number."}, status=400)

#         exists = license_collection.find_one({"phone": phone})
#         return Response({
#             "exists": bool(exists),
#             "message": "This phone number is already registered with PUTSF." if exists else "Phone number is available."
#         })

#     # ---------------------------
#     # DELETE - Remove license
#     # ---------------------------
#     def destroy(self, request, pk=None):
#         if license_collection is None:
#             return Response({"error": "MongoDB not connected"}, status=500)

#         license_collection.delete_one({"_id": ObjectId(pk)})
#         return Response({"message": "License deleted"}, status=204)

#     # ---------------------------
#     # POST - Approve license (Generate PDF)
#     # ---------------------------
#     @action(detail=True, methods=["post"])
#     def approve(self, request, pk=None):
#         if license_collection is None:
#             return Response({"error": "MongoDB not connected"}, status=500)

#         license_doc = license_collection.find_one({"_id": ObjectId(pk)})
#         if not license_doc:
#             return Response({"error": "License not found"}, status=404)

#         # Mark approved
#         license_collection.update_one({"_id": ObjectId(pk)}, {"$set": {"is_approved": True}})

#         # Generate PDF
#         html_content = render_to_string("license_template.html", {
#             "license": license_doc,
#             "request": request,
#         })

#         base_url = request.build_absolute_uri("/")
#         pdf_bytes = HTML(string=html_content, base_url=base_url).write_pdf()

#         pdf_filename = f"licenses/pdf/PUTSF_{license_doc['phone']}.pdf"
#         pdf_path = default_storage.save(pdf_filename, io.BytesIO(pdf_bytes))
#         pdf_url = request.build_absolute_uri(f"/media/{pdf_path}")

#         license_collection.update_one(
#             {"_id": ObjectId(pk)},
#             {"$set": {"license_pdf": pdf_url}}
#         )

#         # WhatsApp message
#         name = license_doc.get("name", "")
#         phone = license_doc.get("phone", "")
#         download_link = "https://putsf.com/#/membership-download"

#         message = (
#             f"🎉 Hello {name}!\n\n"
#             f"Your membership card has been approved.\n"
#             f"Download here:\n{download_link}"
#         )

#         encoded_message = quote(message)
#         whatsapp_link = f"https://wa.me/91{phone}?text={encoded_message}"

#         return Response({
#             "message": "License approved successfully!",
#             "license_pdf": pdf_url,
#             "whatsapp_link": whatsapp_link,
#         })


# # =========================================
# # DOWNLOAD LICENSE PDF (with WeasyPrint)
# # =========================================
# @api_view(["GET"])
# def download_license(request):
#     try:
#         phone = request.GET.get("phone")
#         if not phone:
#             return Response({"error": "Phone required"}, status=400)

#         license_doc = license_collection.find_one({
#             "phone": phone,
#             "is_approved": True
#         })

#         if not license_doc:
#             return Response({"error": "Not found or not approved"}, status=404)

#         license_doc["id"] = str(license_doc["_id"])

#         # Member photo
#         photo = license_doc.get("photo")
#         member_photo = None

#         if photo and "/media/" in photo:
#             rel = photo.split("/media/")[-1]
#             media_root = "/root/arshad/Putsf/server/media"
#             abs_path = os.path.join(media_root, rel)

#             if os.path.exists(abs_path):
#                 member_photo = f"file://{abs_path}"

#         if not member_photo:
#             member_photo = "file:///var/www/putsf_static/putsf_logo.png"

#         static_dir = "/root/arshad/Putsf/server/static"

#         logo_url = f"file://{os.path.join(static_dir, 'putsf_logo.jpg')}"
#         signature_url = f"file://{os.path.join(static_dir, 'signature_blue.png')}"
#         default_photo = f"file://{os.path.join(static_dir, 'putsf_logo_final.png')}"

#         # Render HTML template
#         html_content = render_to_string("license_template.html", {
#             "license": license_doc,
#             "logo_url": logo_url,
#             "signature_url": signature_url,
#             "member_photo": member_photo,
#             "default_photo": default_photo,
#         })

#         pdf_file = HTML(
#             string=html_content,
#             base_url=f"file://{static_dir}/"
#         ).write_pdf()

#         name = "".join(c for c in license_doc.get("name", "Member") if c.isalnum() or c in " _-")

#         response = HttpResponse(pdf_file, content_type="application/pdf")
#         response["Content-Disposition"] = f'attachment; filename="PUTSF_{name}.pdf"'
#         return response

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return Response({"error": str(e)}, status=500)




from urllib.parse import quote
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from bson import ObjectId
from putsf_backend.settings import get_db
from django.core.files.storage import default_storage

# =========================================
# MongoDB Collection
# =========================================
mongo_db = get_db()
license_collection = mongo_db["licenses"] if mongo_db is not None else None


# =========================================
# License ViewSet (Using MongoDB)
# =========================================
class LicenseViewSet(viewsets.ViewSet):
    http_method_names = ["get", "post", "delete"]

    # ---------------------------
    # GET - List all licenses
    # ---------------------------
    def list(self, request):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        data = []
        for item in license_collection.find():
            item["_id"] = str(item["_id"])
            data.append(item)

        return Response(data)

    # ---------------------------
    # POST - Create a new license
    # ---------------------------
    def create(self, request):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        data = request.data.dict() if hasattr(request.data, "dict") else dict(request.data)
        phone = data.get("phone")

        # Validate phone
        if not phone:
            return Response({"error": "Phone number is required."}, status=400)

        phone = "".join(filter(str.isdigit, phone))
        if len(phone) != 10:
            return Response({"error": "Please enter a valid 10-digit phone number."}, status=400)

        if license_collection.find_one({"phone": phone}):
            return Response({"error": "This phone number is already registered with PUTSF."}, status=400)

        # Handle Photo Upload
        photo = request.FILES.get("photo")
        photo_path = None
        if photo:
            photo_path = default_storage.save(f"licenses/photos/{photo.name}", photo)

        # Prepare document
        license_doc = {
            "name": data.get("name"),
            "education": data.get("education"),
            "gender": data.get("gender"),
            "phone": phone,
            "address": data.get("address"),
            "photo": request.build_absolute_uri(f"/media/{photo_path}") if photo_path else None,
            "is_approved": False,
        }

        result = license_collection.insert_one(license_doc)
        license_doc["_id"] = str(result.inserted_id)

        return Response(
            {"message": "Membership request submitted successfully!", "data": license_doc},
            status=201
        )

    # ---------------------------
    # GET - Check phone
    # ---------------------------
    @action(detail=False, methods=["get"])
    def check_phone(self, request):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        phone = request.query_params.get("phone", "").strip()
        phone = "".join(filter(str.isdigit, phone))

        if not phone:
            return Response({"error": "Phone number is required."}, status=400)
        if len(phone) != 10:
            return Response({"error": "Invalid phone number."}, status=400)

        exists = license_collection.find_one({"phone": phone})

        return Response({
            "exists": bool(exists),
            "message": "This phone number is already registered with PUTSF." if exists else "Phone number is available."
        })

    # ---------------------------
    # DELETE License
    # ---------------------------
    def destroy(self, request, pk=None):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        license_collection.delete_one({"_id": ObjectId(pk)})
        return Response({"message": "License deleted"}, status=204)

    # ---------------------------
    # POST - Approve license (NO PDF)
    # ---------------------------
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if license_collection is None:
            return Response({"error": "MongoDB not connected"}, status=500)

        license_doc = license_collection.find_one({"_id": ObjectId(pk)})
        if not license_doc:
            return Response({"error": "License not found"}, status=404)

        # Update approved status
        license_collection.update_one(
            {"_id": ObjectId(pk)},
            {"$set": {"is_approved": True}}
        )

        # WhatsApp link
        name = license_doc.get("name", "")
        phone = license_doc.get("phone", "")
        frontend_download_page = "https://putsf.com/#/membership-download"

        message = (
            f"🎉 Hello {name}!\n\n"
            f"Your membership card has been approved.\n\n"
            f"Download here:\n{frontend_download_page}"
        )

        whatsapp_link = f"https://wa.me/91{phone}?text={quote(message)}"

        return Response({
            "message": "License approved successfully!",
            "approved_data": {
                "_id": str(license_doc["_id"]),
                "name": license_doc["name"],
                "gender": license_doc.get("gender"),
                "education": license_doc.get("education"),
                "phone": license_doc["phone"],
                "address": license_doc["address"],
                "photo": license_doc.get("photo"),
                "is_approved": True,
            },
            "whatsapp_link": whatsapp_link
        })


# =========================================
# DOWNLOAD LICENSE (Return JSON, No PDF)
# =========================================
@api_view(["GET"])
def download_license(request):
    try:
        phone = request.GET.get("phone")
        if not phone:
            return Response({"error": "Phone required"}, status=400)

        license_doc = license_collection.find_one({
            "phone": phone,
            "is_approved": True
        })

        if not license_doc:
            return Response({"error": "Not found or not approved"}, status=404)

        license_doc["_id"] = str(license_doc["_id"])

        # ❗ No PDF — return JSON for frontend React view
        return Response({
            "message": "Approved license data",
            "data": license_doc
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
