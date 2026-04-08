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
import {
  CategoryDto,
  CategoryFilterDto,
  ProductDto,
} from '../../../../../../../../core/models/models/vending-management.model';
import { VendingManagementService } from '../../../../../../../../core/services/vending-management.service';

@Component({
  selector: 'app-product-upsert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './product-upsert-modal.component.html',
  styleUrl: './product-upsert-modal.component.css',
})
export class ProductUpsertModalComponent implements OnChanges {
  private service = inject(VendingManagementService);

  @Input() product: ProductDto | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    X,
  };

  saving = signal(false);
  categoriesLoading = signal(false);
  categories = signal<CategoryDto[]>([]);

  form = signal({
    id: 0,
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    categoryId: 0,
    price: 0,
    sku: '',
    barcode: '',
    posBankCharge: 0,
    taxRate: 0,
    weightInGrams: 0,
    active: true,
  });

  get isEditMode(): boolean {
    return !!this.product;
  }

  constructor() {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      if (this.product) {
        this.form.set({
          id: this.product.id,
          nameEn: this.product.nameEn,
          nameAr: this.product.nameAr,
          descriptionEn: this.product.descriptionEn ?? '',
          descriptionAr: this.product.descriptionAr ?? '',
          categoryId: this.product.categoryId,
          price: this.product.price,
          sku: this.product.sku,
          barcode: this.product.barcode,
          posBankCharge: this.product.posBankCharge,
          taxRate: this.product.taxRate,
          weightInGrams: this.product.weightInGrams,
          active: this.product.active,
        });
      } else {
        const firstCategoryId = this.categories()[0]?.id ?? 0;

        this.form.set({
          id: 0,
          nameEn: '',
          nameAr: '',
          descriptionEn: '',
          descriptionAr: '',
          categoryId: firstCategoryId,
          price: 0,
          sku: '',
          barcode: '',
          posBankCharge: 0,
          taxRate: 0,
          weightInGrams: 0,
          active: true,
        });
      }
    }
  }

  loadCategories(): void {
    this.categoriesLoading.set(true);

    const filter: CategoryFilterDto = {
      search: null,
      active: true,
      pagination: {
        pageNumber: 1,
        pageSize: 100,
      },
    };

    this.service.getCategories(filter).subscribe({
      next: (res) => {
        this.categoriesLoading.set(false);

        if (res.status && res.data) {
          const items = res.data.items ?? [];
          this.categories.set(items);

          if (!this.product && items.length > 0) {
            this.form.update((prev) => ({
              ...prev,
              categoryId: prev.categoryId || items[0].id,
            }));
          }
        } else {
          this.categories.set([]);
        }
      },
      error: (err) => {
        this.categoriesLoading.set(false);
        this.categories.set([]);
        console.error('Failed to load categories', err);
      },
    });
  }

  updateForm(key: string, value: any): void {
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

    if (
      !form.nameEn.trim() ||
      !form.nameAr.trim() ||
      !form.categoryId ||
      !form.sku.trim() ||
      !form.barcode.trim()
    ) {
      alert('Please fill all required fields');
      return;
    }

    this.saving.set(true);

    const formData = new FormData();

    if (this.isEditMode) {
      formData.append('Id', String(form.id));
    }

    formData.append('NameEn', form.nameEn.trim());
    formData.append('NameAr', form.nameAr.trim());
    formData.append('DescriptionEn', form.descriptionEn?.trim() || '');
    formData.append('DescriptionAr', form.descriptionAr?.trim() || '');
    formData.append('CategoryId', String(form.categoryId));
    formData.append('Price', String(form.price));
    formData.append('SKU', form.sku.trim());
    formData.append('Barcode', form.barcode.trim());
    formData.append('PosBankCharge', String(form.posBankCharge));
    formData.append('TaxRate', String(form.taxRate));
    formData.append('WeightInGrams', String(form.weightInGrams));
    formData.append('Active', String(form.active));

    const request$ = this.isEditMode
      ? this.service.updateProduct(formData)
      : this.service.createProduct(formData);

    request$.subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res.status) {
          alert(res.message || 'Product saved successfully');
          this.saved.emit();
        } else {
          alert(res.message || 'Save failed');
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error(err);
        alert(err?.error?.message || 'Save failed');
      },
    });
  }
}