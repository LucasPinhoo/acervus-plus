import re
from rest_framework import serializers
from .models import Category, Book

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'category', 'category_name',
            'publication_year', 'pdf_file', 'uploaded_by', 'created_at'
        ]
        read_only_fields = ['uploaded_by', 'created_at']

    def validate_isbn(self, value):
        cleaned = re.sub(r'[-\s]', '', value).upper()
        if not (re.match(r'^\d{13}$', cleaned) or re.match(r'^\d{9}[\dX]$', cleaned)):
            raise serializers.ValidationError("ISBN inválido. Informe um ISBN-10 ou ISBN-13 válido.")

        qs = Book.objects.filter(isbn=cleaned)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Já existe um livro cadastrado com este ISBN.")

        return cleaned

    def validate_pdf_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("O arquivo deve estar no formato PDF.")

        max_size = 50 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("O arquivo PDF não pode ultrapassar 50 MB.")

        return value
