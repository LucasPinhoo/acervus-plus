import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../services/category';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categories: Category[] = [];

  formCategory: Category = { name: '', description: '' };
  isEditing = false;
  editingId: number | null = null;

  message = '';
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar categorias.';
        this.cdr.detectChanges();
      }
    });
  }

  salvar(): void {
    this.message = '';
    this.errorMessage = '';

    if (!this.formCategory.name.trim()) {
      this.errorMessage = 'O nome da categoria é obrigatório.';
      return;
    }

    if (this.isEditing && this.editingId) {
      this.categoryService.updateCategory(this.editingId, this.formCategory).subscribe({
        next: () => {
          this.message = 'Categoria atualizada com sucesso!';
          this.cancelarEdicao();
          this.carregarCategorias();
        },
        error: () => {
          this.errorMessage = 'Erro ao atualizar categoria.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.categoryService.createCategory(this.formCategory).subscribe({
        next: () => {
          this.message = 'Categoria criada com sucesso!';
          this.formCategory = { name: '', description: '' };
          this.carregarCategorias();
        },
        error: () => {
          this.errorMessage = 'Erro ao criar categoria. Verifique se o nome já existe.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  iniciarEdicao(cat: Category): void {
    this.isEditing = true;
    this.editingId = cat.id ?? null;
    this.formCategory = {
      name: cat.name,
      description: cat.description || ''
    };
  }

  cancelarEdicao(): void {
    this.isEditing = false;
    this.editingId = null;
    this.formCategory = { name: '', description: '' };
  }

  deletar(id: number | undefined): void {
    if (!id) return;
    if (confirm('Deseja realmente excluir esta categoria?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.message = 'Categoria excluída com sucesso!';
          this.carregarCategorias();
        },
        error: () => {
          this.errorMessage = 'Erro ao excluir categoria.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
