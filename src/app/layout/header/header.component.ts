import { CommonModule } from '@angular/common';
import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Map,
  CircleDollarSign,
  Settings,
  Bell,
  Rocket,
  FileText,
  MoreHorizontal,
  ChevronDown, 
  ShoppingBag, 
  Lock,
  Wallet,
  Users
} from 'lucide-angular';

const myIcons = {
  LayoutDashboard,
  Map,
  CircleDollarSign,
  Settings,
  Bell,
  Rocket,
  FileText,
  MoreHorizontal,
  ChevronDown,
  ShoppingBag,
  Lock,
  Wallet,
  Users
};

type MyIconKey = keyof typeof myIcons;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly iconList = myIcons;
  isMoreOpen = signal(false);

  mainNav: { id: string; icon: MyIconKey; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'map', label: 'Map View', icon: 'Map' },
    { id: 'transactions', label: 'Transactions', icon: 'CircleDollarSign' },
    { id: 'integrations', label: 'Integrations', icon: 'Settings' },
    { id: 'deployment', label: 'Deployment', icon: 'Rocket' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
  ];

  moreNav: { id: string; icon: MyIconKey; label: string }[] = [
    { id: 'vending', label: 'Vending Machines', icon: 'ShoppingBag' },
    { id: 'lockers', label: 'Smart Lockers', icon: 'Lock' },
    { id: 'cash', label: 'Cash Handling', icon: 'Wallet' },
    { id: 'admin', label: 'User Admin', icon: 'Users' },
  ];

  toggleMore(event: Event) {
    event.stopPropagation();
    this.isMoreOpen.update((v) => !v);
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isMoreOpen.set(false);
  }
}
