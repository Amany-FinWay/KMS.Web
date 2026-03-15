import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Shield,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  Users
} from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import {
  CreateUserDto,
  RoleOptionDto,
  UserDto,
  UserFilterDto
} from '../../core/models/user.model';

const icons = {
  Search,
  Shield,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  Users
};

type StatusType = 'active' | 'inactive';

interface UserItem {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: StatusType;
  lastLogin: string;
}

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './user-admin.component.html'
})
export class UserAdminComponent implements OnInit {
  private userService = inject(UserService);

  readonly iconList = icons;

  loading = signal(false);

  searchTerm = signal('');
  selectedRole = signal('All Roles');
  selectedStatus = signal('All Status');

  roles = signal<string[]>(['All Roles']);
  roleOptions = signal<RoleOptionDto[]>([]);

  statuses = ['All Status', 'active', 'inactive'];

  isAddUserOpen = signal(false);

  users = signal<UserItem[]>([]);

  totalUsers = signal(0);
  activeUsers = signal(0);
  inactiveUsers = signal(0);
  administratorUsers = signal(0);

deleteTarget = signal<UserItem | null>(null);
isDeleteModalOpen = signal(false);
passwordErrors = signal<string[]>([]);

showRoles = signal(false);

  addUserModel: CreateUserDto = {
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: 0,
    password: ''
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const role = this.selectedRole();
    const status = this.selectedStatus();

    return this.users().filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term);

      const matchesRole = role === 'All Roles' || user.role === role;
      const matchesStatus = status === 'All Status' || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  loadUsers(): void {
    this.loading.set(true);

    const filter: UserFilterDto = {
      search: this.searchTerm().trim() || null,
      role: this.mapRoleNameToValue(this.selectedRole()),
      isActive: this.mapStatusToBoolean(this.selectedStatus()),
      pagination: {
        pageNumber: 1,
        pageSize: 100
      }
    };

    this.userService.getUsers(filter).subscribe({
      next: (res: any) => {
        this.loading.set(false);

        console.log('API response:', res);

        if (!res?.status || !res?.data) {
          console.log('Invalid response format');
          return;
        }

        const apiUsers = res.data?.users?.items ?? [];
        console.log('apiUsers:', apiUsers);

        const mappedUsers = apiUsers.map((u: UserDto) => this.mapApiUserToViewModel(u));
        console.log('mappedUsers:', mappedUsers);

        this.users.set(mappedUsers);

        this.totalUsers.set(res.data?.statistics?.totalUsers ?? 0);
        this.activeUsers.set(res.data?.statistics?.activeUsers ?? 0);
        this.administratorUsers.set(res.data?.statistics?.administrators ?? 0);
        this.inactiveUsers.set(res.data?.statistics?.inactiveUsers ?? 0);

        this.roleOptions.set(res.data?.roles ?? []);
        this.roles.set([
          'All Roles',
          ...(res.data?.roles?.map((r: RoleOptionDto) => r.role) ?? [])
        ]);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Load users failed', err);
      }
    });
  }

  mapApiUserToViewModel(user: UserDto): UserItem {
    return {
      id: user.id,
      name: user.fullName,
      username: user.userName,
      email: user.email,
      phone: user.phoneNumber || '-',
      department: user.department || '-',
      role: user.role,
      status: user.isActive ? 'active' : 'inactive',
      lastLogin: user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleDateString()
        : '-'
    };
  }

mapRoleNameToValue(roleName: string): number | null {
  switch (roleName) {
    case 'SuperAdmin':
      return 1;
    case 'Administrator':
      return 2;
    case 'Operator':
      return 3;
    case 'Technician':
      return 4;
    case 'Viewer':
      return 5;
    case 'All Roles':
    default:
      return null;
  }
}

  mapStatusToBoolean(status: string): boolean | null {
    if (status === 'All Status') return null;
    return status === 'active';
  }

  trackByUser(_: number, user: UserItem) {
    return user.id;
  }

  onEdit(user: UserItem) {
    console.log('Edit user:', user);
  }

onDelete(user: UserItem) {
  this.openDeleteModal(user);
}

  openDeleteModal(user: UserItem) {
  this.deleteTarget.set(user);
  this.isDeleteModalOpen.set(true);
}

closeDeleteModal() {
  this.deleteTarget.set(null);
  this.isDeleteModalOpen.set(false);
}

confirmDeleteUser() {
  const user = this.deleteTarget();

  if (!user) return;

  this.userService.deleteUser(user.id).subscribe({
    next: (res: any) => {
      if (res.status) {
        this.closeDeleteModal();
        this.loadUsers();
        alert(res.message || 'User deleted successfully');
      } else {
        alert(res.message || 'Delete failed');
      }
    },
    error: (err) => {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  });
}

 onAddUser() {
  this.addUserModel = {
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    department: '',
role: this.mapRoleNameToValue(String(this.roleOptions()[0]?.role ?? '')) ?? 0,
    password: ''
  };

    this.passwordErrors.set([]);
  this.isAddUserOpen.set(true);
}
  closeAddUserModal() {
      this.passwordErrors.set([]);
    this.isAddUserOpen.set(false);
  }

submitAddUser() {
  if (!this.addUserModel.fullName?.trim()) {
    alert('Full Name is required');
    return;
  }

  if (!this.addUserModel.userName?.trim()) {
    alert('Username is required');
    return;
  }

  if (!this.addUserModel.email?.trim()) {
    alert('Email is required');
    return;
  }

  if (!this.addUserModel.role) {
    alert('Role is required');
    return;
  }

const passwordValidationErrors = this.validatePassword(this.addUserModel.password);
this.passwordErrors.set(passwordValidationErrors);

if (passwordValidationErrors.length > 0) {
  return;
}
  const dto: CreateUserDto = {
    fullName: this.addUserModel.fullName.trim(),
    userName: this.addUserModel.userName.trim(),
    email: this.addUserModel.email.trim(),
    phoneNumber: this.addUserModel.phoneNumber?.trim() || '',
    department: this.addUserModel.department?.trim() || '',
    role: this.addUserModel.role,
    password: this.addUserModel.password
  };

  console.log('Create DTO:', dto);

  this.userService.createUser(dto).subscribe({
    next: (res: any) => {
      console.log('Create response:', res);

      if (res?.status) {
        this.closeAddUserModal();
        this.loadUsers();
        alert(res.message || 'User created successfully');
      } else {
        alert(res?.message || 'Create failed');
      }
    },
    error: (err) => {
      console.error('Create user failed', err);
      console.log('status:', err.status);
      console.log('error body:', err.error);
    }
  });
}
 onViewRoles() {
  this.showRoles.update(value => !value);
}


  getRoleClass(role: string): string {
    switch (role) {
      case 'SuperAdmin':
        return 'inline-flex rounded-full px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700';
      case 'Administrator':
        return 'inline-flex rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-600';
      case 'Operator':
        return 'inline-flex rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700';
      case 'Technician':
        return 'inline-flex rounded-full px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700';
      case 'Viewer':
        return 'inline-flex rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700';
      default:
        return 'inline-flex rounded-full px-3 py-1 text-sm font-medium bg-slate-100 text-slate-700';
    }
  }

  getStatusClass(status: StatusType): string {
    return status === 'active'
      ? 'inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize bg-emerald-100 text-emerald-700'
      : 'inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize bg-slate-100 text-slate-700';
  }


  // Validation Password
  validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
    return errors;
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
}

onPasswordChange(value: string) {
  this.addUserModel.password = value;
  this.passwordErrors.set(this.validatePassword(value));
}
}