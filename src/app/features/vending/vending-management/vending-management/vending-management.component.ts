import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  LucideAngularModule,
  Package,
  Tag,
  Grid3X3,
  ShoppingBag
} from 'lucide-angular';
import { ProductsTabComponent } from './components/products-tab/products-tab/products-tab.component';
import { MachinesTabComponent } from './components/machines-tab/machines-tab/machines-tab.component';
import { CategoriesTabComponent } from './components/categories-tab/categories-tab/categories-tab.component';


type TabType = 'products' | 'categories' | 'machines';

@Component({
  selector: 'app-vending-management',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ProductsTabComponent,
    CategoriesTabComponent,
    MachinesTabComponent,
  ],
  templateUrl: './vending-management.component.html',
  styleUrl: './vending-management.component.css',
})
export class VendingManagementComponent {
  activeTab = signal<TabType>('products');

  readonly icons = {
    ShoppingBag,
    Package,
    Tag,
    Grid3X3,
  };

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }
}