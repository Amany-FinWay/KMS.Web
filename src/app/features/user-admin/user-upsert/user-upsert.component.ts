import { Component, signal, output, inject, input, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CreateUserDto, RoleOptionDto, UpdateUserDto } from '../../../core/models/models/user/user.model';
import { UserItem } from '../../../core/models/models/user/user.model';
import { SpinnerToasterService } from '../../../core/services/spinner-toaster.service';

@Component({
  selector: 'app-user-upsert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-upsert.component.html',
  styleUrl: './user-upsert.component.css',
})
export class UserUpsertComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(SpinnerToasterService);
  userData = input<UserItem | null>(null);
  // Inputs & Outputs
  roleOptions = input<RoleOptionDto[]>([]);
  onClose = output<void>();
  isEditMode = computed(() => !!this.userData());
  onSuccess = output<string>();
  addUserModel: CreateUserDto = {
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: null as any,
    password: '',
  };

  passwordErrors = signal<string[]>([]);

  ngOnInit() {
    const data = this.userData();
    if (data) {
      this.addUserModel = {
        fullName: data.name,
        userName: data.username,
        email: data.email,
        phoneNumber: data.phone || '',
        department: data.department,
        role: this.mapRoleNameToValue(data.role),
        password: '',
      };
    }
  }

  close() {
    this.onClose.emit();
  }

  submit() {
    if (this.isEditMode()) {
      const UpdateUserDto: UpdateUserDto = {
        id: this.userData()?.id || 0,
        fullName: this.addUserModel.fullName,
        //userName: this.addUserModel.userName,
        email: this.addUserModel.email,
        phoneNumber: this.addUserModel.phoneNumber,
        department: this.addUserModel.department,
        role: this.addUserModel.role!,
        isActive: true
      }
      this.userService.updateUser(UpdateUserDto).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastService.showToaster(
              'success',
              res.message || 'User updated successfully',
            );
            this.onSuccess.emit(res.message || 'User updated successfully');
          }else{
            this.toastService.showToaster(
              'error',
              res.message || 'Failed to update user',
            );
          }
        },
      });
    } else {
      this.userService.createUser(this.addUserModel).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastService.showToaster(
              'success',
              res.message || 'User created successfully',
            );
            this.onSuccess.emit(res.message || 'User created successfully');
          }else{
            this.toastService.showToaster(
              'error',
              res.message || 'Failed to create user',
            );
          }
        },
      });
    }
  }

  private isFormValid(): boolean {
    if (!this.addUserModel.fullName?.trim()) {
      alert('Full Name is required');
      return false;
    }
    if (!this.addUserModel.email?.trim()) {
      alert('Email is required');
      return false;
    }
    if (!this.addUserModel.role) {
      alert('Role is required');
      return false;
    }
    return true;
  }

  validatePassword(password: string): string[] {
    const errors: string[] = [];
    if (!password) return ['Password is required'];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    return errors;
  }

  mapRoleNameToValue(roleName: string): number {
    const mapping: Record<string, number> = {
      SuperAdmin: 1,
      Administrator: 2,
      Operator: 3,
      Technician: 4,
      Viewer: 5,
    };
    return mapping[roleName] || 0;
  }

  onPasswordChange(value: string) {
    this.addUserModel.password = value;
    this.passwordErrors.set(this.validatePassword(value));
  }
}
