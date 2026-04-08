import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideAngularModule, Plus, Pencil, Trash2 } from 'lucide-angular';

import { VendingManagementService } from '../../../../../../../core/services/vending-management.service';
import {
  ProductDto,
  ProductFilterDto,
} from '../../../../../../../core/models/models/vending-management.model';
import { ProductUpsertModalComponent } from '../product-upsert-modal/product-upsert-modal/product-upsert-modal.component';



@Component({
  selector: 'app-products-tab',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ProductUpsertModalComponent,
  ],
  templateUrl: './products-tab.component.html',
  styleUrl: './products-tab.component.css',
})
export class ProductsTabComponent implements OnInit {
  private service = inject(VendingManagementService);

  readonly icons = {
    Plus,
    Pencil,
    Trash2,
  };

  products = signal<ProductDto[]>([]);
  loading = signal(false);

  isUpsertOpen = signal(false);
  selectedProduct = signal<ProductDto | null>(null);

  isDeleteModalOpen = signal(false);
  deleteTarget = signal<ProductDto | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);

    const filter: ProductFilterDto = {
      search: null,
      categoryId: null,
      active: null,
      pagination: {
        pageNumber: 1,
        pageSize: 100,
      },
    };

    this.service.getProducts(filter).subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res.status && res.data) {
          this.products.set(res.data.items ?? []);
        } else {
          this.products.set([]);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.products.set([]);
        console.error('Failed to load products', err);
      },
    });
  }

  openAddModal(): void {
    this.selectedProduct.set(null);
    this.isUpsertOpen.set(true);
  }

  openEditModal(product: ProductDto): void {
    this.selectedProduct.set(product);
    this.isUpsertOpen.set(true);
  }

  closeUpsertModal(): void {
    this.isUpsertOpen.set(false);
    this.selectedProduct.set(null);
  }

  onUpsertSaved(): void {
    this.closeUpsertModal();
    this.loadProducts();
  }

  openDeleteModal(product: ProductDto): void {
    this.deleteTarget.set(product);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteTarget.set(null);
    this.isDeleteModalOpen.set(false);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.service.deleteProduct(target.id).subscribe({
      next: (res) => {
        if (res.status) {
          this.closeDeleteModal();
          this.loadProducts();
          alert(res.message || 'Product deleted successfully');
        } else {
          alert(res.message || 'Delete failed');
        }
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Delete failed');
      },
    });
  }

  trackByProduct(_: number, item: ProductDto): number {
    return item.id;
  }

  getProductImage(product: ProductDto): string | null {
    return product.imageUrl || null;
  }

  getCategoryTagClasses(categoryName: string): string {
    const value = categoryName.toLowerCase();

    if (value.includes('beverage') || value.includes('drink')) {
      return 'bg-blue-100 text-blue-700';
    }

    if (value.includes('snack')) {
      return 'bg-amber-100 text-amber-700';
    }

    if (value.includes('candy') || value.includes('chocolate')) {
      return 'bg-pink-100 text-pink-700';
    }

    if (value.includes('healthy')) {
      return 'bg-emerald-100 text-emerald-700';
    }

    return 'bg-slate-100 text-slate-700';
  }
}