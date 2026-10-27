import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  constructor(private authService: Auth, private router: Router) { }
  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        alert('Login realizado com sucesso!');

      },
      error: (err) => {
        this.errorMessage = 'Usuário ou senha incorretos.';
      }
    });
  }
}
