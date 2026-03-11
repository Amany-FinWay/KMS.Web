import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-angular';

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
  templateUrl: './login.component.html'
})
export class LoginComponent {
  readonly iconList = icons;

  email = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  onLogin() {
    console.log('Login:', {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }
}