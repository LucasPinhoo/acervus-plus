from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nome")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ['name']

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200, verbose_name="Título")
    author = models.CharField(max_length=150, verbose_name="Autor")
    isbn = models.CharField(max_length=17, unique=True, verbose_name="ISBN")
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='books',
        verbose_name="Categoria"
    )
    publication_year = models.IntegerField(blank=True, null=True, verbose_name="Ano de Publicação")
    pdf_file = models.FileField(upload_to='books/pdfs/', verbose_name="Arquivo PDF")
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Enviado por"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")

    class Meta:
        verbose_name = "Livro"
        verbose_name_plural = "Livros"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.isbn})"
