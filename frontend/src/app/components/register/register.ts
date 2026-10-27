import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  userData = {
    username: '',
    email: '',
    password: ''
  };
  errorMessage = '';
  constructor(private authService: Auth, private router: Router) { }
  onSubmit(): void {
    this.errorMessage = '';
    this.authService.register(this.userData).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao cadastrar. Verifique os dados digitados.';
      }
    });
  }
}
