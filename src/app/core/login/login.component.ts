import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-angular';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SuccessfulLogin } from '../models/models/login.model';
import { SpinnerToasterService } from '../services/spinner-toaster.service';

const icons = {
  Mail,
  Lock,
  Eye,
  EyeOff
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly iconList = icons;

  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(SpinnerToasterService);

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  onLogin() {
    this.loginService
      .Login({
        userNameOrEmail: this.email,
        password: this.password,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: SuccessfulLogin) => {
          localStorage.setItem('token', response.data.token);
          this.toastService.showToaster(
            'success',
            'Logged in successfully, you\'re being redirected'
          );

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });
  }
}