import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideAngularModule, Plus, Pencil, Trash2 } from 'lucide-angular';

import { VendingManagementService } from '../../../../../../../core/services/vending-management.service';
import { CategoryDto, CategoryFilterDto } from '../../../../../../../core/models/models/vending-management.model';
import { CategoryUpsertModalComponent } from '../category-upsert-modal/category-upsert-modal/category-upsert-modal.component';

@Component({
  selector: 'app-categories-tab',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    CategoryUpsertModalComponent,
  ],
  templateUrl: './categories-tab.component.html',
  styleUrl: './categories-tab.component.css',
})
export class CategoriesTabComponent implements OnInit {
  private service = inject(VendingManagementService);

  readonly icons = {
    Plus,
    Pencil,
    Trash2,
  };

  categories = signal<CategoryDto[]>([]);
  loading = signal(false);

  isUpsertOpen = signal(false);
  selectedCategory = signal<CategoryDto | null>(null);

  isDeleteModalOpen = signal(false);
  deleteTarget = signal<CategoryDto | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);

    const filter: CategoryFilterDto = {
      search: null,
      active: null,
      pagination: {
        pageNumber: 1,
        pageSize: 50,
      },
    };

    this.service.getCategories(filter).subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res.status && res.data) {
          this.categories.set(res.data.items ?? []);
        } else {
          this.categories.set([]);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.categories.set([]);
        console.error('Failed to load categories', err);
      },
    });
  }

  openAddModal(): void {
    this.selectedCategory.set(null);
    this.isUpsertOpen.set(true);
  }

  openEditModal(category: CategoryDto): void {
    this.selectedCategory.set(category);
    this.isUpsertOpen.set(true);
  }

  closeUpsertModal(): void {
    this.isUpsertOpen.set(false);
    this.selectedCategory.set(null);
  }

  onUpsertSaved(): void {
    this.closeUpsertModal();
    this.loadCategories();
  }

  openDeleteModal(category: CategoryDto): void {
    this.deleteTarget.set(category);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteTarget.set(null);
    this.isDeleteModalOpen.set(false);
  }

  confirmDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;

    this.service.deleteCategory(target.id).subscribe({
      next: (res) => {
        if (res.status) {
          this.closeDeleteModal();
          this.loadCategories();
          alert(res.message || 'Category deleted successfully');
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

  trackByCategory(_: number, item: CategoryDto): number {
    return item.id;
  }

  getProductCount(category: CategoryDto): number {
    return (category as any).productCount ?? 0;
  }
}