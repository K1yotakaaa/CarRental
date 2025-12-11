import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  full_name: string = '';
  password2: string = '';
  errorMessage: string = '';
  loading = false;

  isSignupMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  private validatePassword(password: string, password2: string): string | null {
    if (!password || !password2) return 'Please enter password and confirm it.';
    if (password !== password2) return "Passwords don't match.";
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return 'Password must contain at least one special character (e.g. !@#$%).';
    return null;
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (tokens) => {
        this.authService.saveTokens(tokens);
        this.loading = false;

        this.router.navigate(['/']);
        console.log('Login successful!');
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid email or password';
        this.loading = false;
      },
    });
  }

  onRegister() {
    this.loading = true;
    this.errorMessage = '';

    const pwError = this.validatePassword(this.password, this.password2);
    if (pwError) {
      this.errorMessage = pwError;
      this.loading = false;
      return;
    }
    
    this.authService.register(this.email, this.password, this.password2, this.full_name).subscribe({
      next: () => {
        alert('Account created! You can now log in.');
        this.isSignupMode = false;
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.errorMessage = '';
  }
}
