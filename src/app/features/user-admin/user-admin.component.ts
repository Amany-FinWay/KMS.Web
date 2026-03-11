import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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

type RoleType = 'Administrator' | 'Operator' | 'Technician' | 'Viewer';
type StatusType = 'active' | 'inactive';

interface UserItem {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  role: RoleType;
  status: StatusType;
  lastLogin: string;
}

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './user-admin.component.html'
})
export class UserAdminComponent {
  readonly iconList = icons;

  searchTerm = signal('');
  selectedRole = signal('All Roles');
  selectedStatus = signal('All Status');

  roles = ['All Roles', 'Administrator', 'Operator', 'Technician', 'Viewer'];
  statuses = ['All Status', 'active', 'inactive'];

  isAddUserOpen = signal(false);

  users = signal<UserItem[]>([
    {
      id: 1,
      name: 'Admin User',
      username: '@admin',
      email: 'admin@kioskmanager.com',
      phone: '+1 555-0100',
      department: 'IT',
      role: 'Administrator',
      status: 'active',
      lastLogin: '3/11/2026'
    },
    {
      id: 2,
      name: 'John Operator',
      username: '@john.operator',
      email: 'john@kioskmanager.com',
      phone: '+1 555-0101',
      department: 'Operations',
      role: 'Operator',
      status: 'active',
      lastLogin: '3/11/2026'
    },
    {
      id: 3,
      name: 'Sarah Technician',
      username: '@sarah.tech',
      email: 'sarah@kioskmanager.com',
      phone: '+1 555-0102',
      department: 'Maintenance',
      role: 'Technician',
      status: 'active',
      lastLogin: '3/10/2026'
    },
    {
      id: 4,
      name: 'Mike Viewer',
      username: '@mike.viewer',
      email: 'mike@kioskmanager.com',
      phone: '+1 555-0103',
      department: 'Analytics',
      role: 'Viewer',
      status: 'active',
      lastLogin: '3/9/2026'
    },
    {
      id: 5,
      name: 'Jane Inactive',
      username: '@jane.inactive',
      email: 'jane@kioskmanager.com',
      phone: '+1 555-0104',
      department: 'Operations',
      role: 'Operator',
      status: 'inactive',
      lastLogin: '2/9/2026'
    }
  ]);

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

  totalUsers = computed(() => this.filteredUsers().length);

  activeUsers = computed(
    () => this.filteredUsers().filter((user) => user.status === 'active').length
  );

  inactiveUsers = computed(
    () => this.filteredUsers().filter((user) => user.status === 'inactive').length
  );

  administratorUsers = computed(
    () => this.filteredUsers().filter((user) => user.role === 'Administrator').length
  );

  trackByUser(_: number, user: UserItem) {
    return user.id;
  }

  onEdit(user: UserItem) {
    console.log('Edit user:', user);
  }

  onDelete(user: UserItem) {
    console.log('Delete user:', user);
  }


onAddUser() {
  debugger
    this.isAddUserOpen.set(true);
  }

  closeAddUserModal() {
    debugger
    this.isAddUserOpen.set(false);
  }
  onViewRoles() {
    console.log('View roles');
  }



  getRoleClass(role: RoleType): string {
    switch (role) {
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