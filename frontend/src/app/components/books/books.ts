import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService, Book } from '../../services/book';
import { CategoryService, Category } from '../../services/category';

@Component({
  selector: 'app-books',
  imports: [FormsModule, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];

  title = '';
  author = '';
  isbn = '';
  categoryId: number | null = null;
  publicationYear: number | null = null;
  selectedFile: File | null = null;

  message = '';
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
    this.carregarCategorias();
  }

  carregarLivros(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar livros.';
        this.cdr.detectChanges();
      }
    });
  }

  carregarCategorias(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  salvar(fileInput: HTMLInputElement): void {
    this.message = '';
    this.errorMessage = '';

    if (!this.title.trim() || !this.author.trim() || !this.isbn.trim() || !this.categoryId) {
      this.errorMessage = 'Preencha título, autor, ISBN e categoria.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Selecione um arquivo PDF.';
      return;
    }

    if (!this.selectedFile.name.toLowerCase().endsWith('.pdf')) {
      this.errorMessage = 'O arquivo deve ser um PDF.';
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (this.selectedFile.size > maxSize) {
      this.errorMessage = 'O arquivo PDF não pode ultrapassar 50 MB.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('author', this.author);
    formData.append('isbn', this.isbn);
    formData.append('category', String(this.categoryId));
    if (this.publicationYear) {
      formData.append('publication_year', String(this.publicationYear));
    }
    formData.append('pdf_file', this.selectedFile);

    this.bookService.createBook(formData).subscribe({
      next: () => {
        this.message = 'Livro cadastrado com sucesso!';
        this.title = '';
        this.author = '';
        this.isbn = '';
        this.categoryId = null;
        this.publicationYear = null;
        this.selectedFile = null;
        fileInput.value = '';
        this.carregarLivros();
      },
      error: (err) => {
        if (err.error?.isbn) {
          this.errorMessage = err.error.isbn[0];
        } else if (err.error?.pdf_file) {
          this.errorMessage = err.error.pdf_file[0];
        } else {
          this.errorMessage = 'Erro ao cadastrar livro. Verifique os dados.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  deletar(id: number | undefined): void {
    if (!id) return;
    if (confirm('Deseja realmente excluir este livro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.message = 'Livro excluído com sucesso!';
          this.carregarLivros();
        },
        error: () => {
          this.errorMessage = 'Erro ao excluir livro.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
