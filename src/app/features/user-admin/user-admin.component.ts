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
  UserFilterDto,
  UserItem,
  StatusType
} from '../../core/models/models/user/user.model';
import { SharedGridComponent } from '../../shared/components/shared-grid/shared-grid.component';
import { GridActionsButtonsComponent } from '../../shared/components/grid-actions-buttons/grid-actions-buttons.component';
import { UserUpsertComponent } from './user-upsert/user-upsert.component';
import { SpinnerToasterService } from '../../core/services/spinner-toaster.service';

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


@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    SharedGridComponent,
    LucideAngularModule,
    UserUpsertComponent,
  ],
  templateUrl: './user-admin.component.html',
})
export class UserAdminComponent implements OnInit {
  private userService = inject(UserService);
  private toastService = inject(SpinnerToasterService);
  readonly iconList = icons;

  loading = signal(false);

  searchTerm = signal('');
  selectedRole = signal('All Roles');
  selectedStatus = signal('All Status');

  roles = signal<string[]>(['All Roles']);
  roleOptions = signal<RoleOptionDto[]>([]);

  statuses = ['All Status', 'active', 'inactive'];

  //isAddUserOpen = signal(false);
  isUpsertOpen = signal(false);
  selectedUser = signal<UserItem | null>(null);
  users = signal<UserItem[]>([]);

  totalUsers = computed(() => this.filteredUsers().length);

  activeUsers = computed(
    () => this.filteredUsers().filter((u) => u.status === 'active').length,
  );

  inactiveUsers = computed(
    () => this.filteredUsers().filter((u) => u.status === 'inactive').length,
  );

  administratorUsers = computed(
    () => this.filteredUsers().filter((u) => u.role === 'Administrator').length,
  );

  deleteTarget = signal<UserItem | null>(null);
  isDeleteModalOpen = signal(false);
  passwordErrors = signal<string[]>([]);

  showRoles = signal(false);
  columns = [
    {
      headerName: 'User',
      field: 'name',
      cellRenderer: (params: any) => `
      <div class="flex flex-col justify-center h-full">
        <span class="text-sm font-semibold text-gray-900 leading-tight">${params.data.name}</span>
        <span class="text-xs text-gray-500 font-normal mt-0.5">@${params.data.username}</span>
      </div>`,
    },
    {
      headerName: 'Contact',
      field: 'email',
      cellRenderer: (params: any) => {
        return `
        <div class="flex flex-col justify-center h-full space-y-1">
          <div class="flex items-center gap-2 text-gray-500 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>${params.data.email}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${params.data.phone}</span>
          </div>
        </div>`;
      },
    },
    { headerName: 'Department', field: 'department' },
    {
      headerName: 'Role',
      field: 'role',
      cellRenderer: (params: any) => `
      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
        ${params.value}
      </span>`,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        const isActive = params.value;
        const classes =
          isActive == 'active'
            ? 'bg-green-50 text-green-600 border-green-100'
            : 'bg-gray-50 text-gray-500 border-gray-100';
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 ${classes}">
                ${isActive ? 'Active' : 'Inactive'}
              </span>`;
      },
    },
    {
      headerName: 'Actions',
      cellRenderer: GridActionsButtonsComponent,
      minWidth: 120,
    },
  ];
  addUserModel: CreateUserDto = {
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: 0,
    password: '',
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
      search: null,
      role: null,
      isActive: null,
      pagination: { pageNumber: 1, pageSize: 100 },
    };

    this.userService.getUsers(filter).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        if (res?.status && res?.data) {
          const apiUsers = res.data.users?.items ?? [];
          const mappedUsers = apiUsers.map((u: any) =>
            this.mapApiUserToViewModel(u),
          );
          this.users.set(mappedUsers);
          const apiRoles = res.data.roles ?? [];
          this.roleOptions.set(apiRoles);
          this.roles.set(['All Roles', ...apiRoles.map((r: any) => r.role)]);
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Load users failed', err);
      },
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
        : '-',
    };
  }

  mapRoleNameToValue(roleName: string): number | null {
    const mapping: Record<string, number> = {
      SuperAdmin: 1,
      Administrator: 2,
      Operator: 3,
      Technician: 4,
      Viewer: 5,
    };
    return mapping[roleName] || null;
  }

  closeUpsert() {
    this.isUpsertOpen.set(false);
    this.selectedUser.set(null);
  }

  mapStatusToBoolean(status: string): boolean | null {
    if (status === 'All Status') return null;
    return status === 'active';
  }

  trackByUser(_: number, user: UserItem) {
    return user.id;
  }

  handleUserAdded(message: string) {
    this.isUpsertOpen.set(false);
    this.loadUsers();
    alert(message);
  }

  onEdit(user: UserItem) {
    console.log('Opening edit for:', user);
    this.selectedUser.set(user);
    this.isUpsertOpen.set(true);
  }

  handleUpsertSuccess(message: string) {
    this.isUpsertOpen.set(false);
    this.selectedUser.set(null);
    this.loadUsers();
    //alert(message);
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
          //alert(res.message || 'User deleted successfully');
          this.toastService.showToaster(
            'success',
            res.message || 'User deleted successfully',
          );
        } else {
          //alert(res.message || 'Delete failed');
          this.toastService.showToaster(
            'error',
            res.message || 'Delete failed',
          );
        }
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Delete failed');
      },
    });
  }

  onAddUser() {
    this.selectedUser.set(null);
    this.isUpsertOpen.set(true);
  }

  onViewRoles() {
    this.showRoles.update((value) => !value);
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
}