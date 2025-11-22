from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AdminLoginSerializer

class AdminLoginAPIView(APIView):
    """
    POST /api/admin/login/
    Request: { "email": "...", "password": "..." }
    Response: { "refresh": "...", "access": "...", "user": { ... } }
    """
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
