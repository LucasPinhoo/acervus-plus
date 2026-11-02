import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any = null;
  message = '';
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar dados do perfil.';
      }
    });
  }

  onSalvar(): void {
    this.message = '';
    this.errorMessage = '';
    this.authService.updateProfile({
      email: this.user.email,
      first_name: this.user.first_name,
      last_name: this.user.last_name
    }).subscribe({
      next: () => {
        this.message = 'Dados atualizados com sucesso!';
      },
      error: () => {
        this.errorMessage = 'Erro ao atualizar dados.';
      }
    });
  }

  onInativar(): void {
    if (confirm('Tem certeza de que deseja inativar sua conta? Você não poderá mais entrar.')) {
      this.authService.deactivateAccount().subscribe({
        next: () => {
          alert('Conta inativada.');
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorMessage = 'Erro ao inativar conta.';
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}