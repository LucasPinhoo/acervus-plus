from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# ver e editar os dados do usuário autenticado
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)
    def get_object(self):
        return self.request.user


# inativar própria conta
class DeactivateAccountView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({"message": "Conta inativada com sucesso."})