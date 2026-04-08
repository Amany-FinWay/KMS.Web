import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { VendingManagementService } from '../../../../../../../../core/services/vending-management.service';
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../../../../../../core/models/models/vending-management.model';

@Component({
  selector: 'app-category-upsert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './category-upsert-modal.component.html',
  styleUrl: './category-upsert-modal.component.css',
})
export class CategoryUpsertModalComponent implements OnChanges {
  private service = inject(VendingManagementService);

  @Input() category: CategoryDto | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    X,
  };

  saving = signal(false);

  form = signal<Omit<UpdateCategoryDto, 'active'>>({
    id: 0,
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    icon: '📦',
  });

  get isEditMode(): boolean {
    return !!this.category;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      if (this.category) {
        this.form.set({
          id: this.category.id,
          nameEn: this.category.nameEn,
          nameAr: this.category.nameAr,
          descriptionEn: this.category.descriptionEn ?? '',
          descriptionAr: this.category.descriptionAr ?? '',
          icon: this.category.icon || '📦',
        });
      } else {
        this.form.set({
          id: 0,
          nameEn: '',
          nameAr: '',
          descriptionEn: '',
          descriptionAr: '',
          icon: '📦',
        });
      }
    }
  }

  updateForm<K extends keyof Omit<UpdateCategoryDto, 'active'>>(
    key: K,
    value: Omit<UpdateCategoryDto, 'active'>[K],
  ): void {
    this.form.update((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    const form = this.form();

    if (!form.nameEn.trim() || !form.nameAr.trim()) {
      alert('Name EN and Name AR are required');
      return;
    }

    this.saving.set(true);

    if (this.isEditMode) {
      const dto: UpdateCategoryDto = {
        ...form,
        active: true, // default
      };

      this.service.updateCategory(dto).subscribe({
        next: (res) => {
          this.saving.set(false);

          if (res.status) {
            alert(res.message || 'Category updated successfully');
            this.saved.emit();
          } else {
            alert(res.message || 'Update failed');
          }
        },
        error: (err) => {
          this.saving.set(false);
          console.error(err);
          alert(err?.error?.message || 'Update failed');
        },
      });

      return;
    }

    const dto: CreateCategoryDto = {
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim(),
      descriptionEn: form.descriptionEn?.trim() || null,
      descriptionAr: form.descriptionAr?.trim() || null,
      icon: '📦',
    };

    this.service.createCategory(dto).subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res.status) {
          alert(res.message || 'Category created successfully');
          this.saved.emit();
        } else {
          alert(res.message || 'Create failed');
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error(err);
        alert(err?.error?.message || 'Create failed');
      },
    });
  }
}