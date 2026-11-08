from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserProfileSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)
    def get_object(self):
        return self.request.user

class DeactivateAccountView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({"message": "Conta inativada com sucesso."})