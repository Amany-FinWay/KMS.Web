import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Settings } from 'lucide-angular';

import { VendingManagementService } from '../../../../../../../core/services/vending-management.service';
import {
  ProductDto,
  ProductFilterDto,
  VendingMachineDto,
  KioskLineViewDto,
  KioskLineDto,
  SaveKioskLinesDto,
} from '../../../../../../../core/models/models/vending-management.model';

type EditableLine = KioskLineViewDto & {
  localKey: string;
};

@Component({
  selector: 'app-machines-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './machines-tab.component.html',
  styleUrl: './machines-tab.component.css',
})
export class MachinesTabComponent implements OnInit {
  private service = inject(VendingManagementService);

  readonly icons = {
    Settings,
  };

  kiosks = signal<VendingMachineDto[]>([]);
  selectedKiosk = signal<VendingMachineDto | null>(null);

  products = signal<ProductDto[]>([]);

  loadingKiosks = signal(false);
  loadingSelected = signal(false);
  loadingProducts = signal(false);
  saving = signal(false);

  editableLines = signal<EditableLine[]>([]);

  readonly lineCountOptions = [12, 16, 20, 24, 30, 36];

  selectedLineCount = signal(12);

  ngOnInit(): void {
    this.loadKiosks();
    this.loadProducts();
  }

  loadKiosks(): void {
    this.loadingKiosks.set(true);

    this.service.getLinesForAllKiosks().subscribe({
      next: (res) => {
        this.loadingKiosks.set(false);

        if (res.status && res.data) {
          this.kiosks.set(res.data ?? []);
        } else {
          this.kiosks.set([]);
        }
      },
      error: (err) => {
        this.loadingKiosks.set(false);
        this.kiosks.set([]);
        console.error('Failed to load kiosks', err);
      },
    });
  }

  loadProducts(): void {
    this.loadingProducts.set(true);

    const filter: ProductFilterDto = {
      search: null,
      categoryId: null,
      active: true,
      pagination: {
        pageNumber: 1,
        pageSize: 500,
      },
    };

    this.service.getProducts(filter).subscribe({
      next: (res) => {
        this.loadingProducts.set(false);

        if (res.status && res.data) {
          this.products.set(res.data.items ?? []);
        } else {
          this.products.set([]);
        }
      },
      error: (err) => {
        this.loadingProducts.set(false);
        this.products.set([]);
        console.error('Failed to load products', err);
      },
    });
  }

selectKiosk(kiosk: VendingMachineDto): void {
  this.loadingSelected.set(true);

  this.service.getLinesForKiosk(kiosk.kioskId).subscribe({
    next: (res) => {
      this.loadingSelected.set(false);

      if (res.status && res.data) {
        const machine: VendingMachineDto = {
          kioskId: kiosk.kioskId,
          code: kiosk.code,
          name: kiosk.name,
          location: kiosk.location,
          lines: res.data.lines ?? [],
          alerts: res.data.alerts ?? [],
        };

        this.selectedKiosk.set(machine);

        const lines = this.normalizeLines(machine.lines ?? []);
        const count = lines.length || 12;

        this.selectedLineCount.set(count);
        this.editableLines.set(lines);
        this.ensureLinesCount(count);
      }
    },
    error: (err) => {
      this.loadingSelected.set(false);
      console.error('Failed to load kiosk details', err);
    },
  });
}

  ensureLinesCount(count: number): void {
  const current = [...this.editableLines()].sort((a, b) => a.lineNumber - b.lineNumber);
  const next: EditableLine[] = [];

  for (let i = 1; i <= count; i++) {
    const existing = current.find((x) => x.lineNumber === i);

    if (existing) {
      next.push(existing);
    } else {
      next.push({
        lineNumber: i,
        lineCode: String(i).padStart(2, '0'),
        productId: null,
        productNameEn: null,
        productNameAr: null,
        currentStock: 0,
        maxStock: 10,
        threshold: 3,
        replQty: 1,
        active: true,
        localKey: `new-${i}`,
      });
    }
  }

  this.editableLines.set(next);
}

  normalizeLines(lines: KioskLineViewDto[]): EditableLine[] {
    return [...lines]
      .sort((a, b) => a.lineNumber - b.lineNumber)
      .map((line) => ({
        ...line,
        lineCode: line.lineCode || String(line.lineNumber).padStart(2, '0'),
        productId: line.productId ?? null,
        productNameEn: line.productNameEn ?? null,
        productNameAr: line.productNameAr ?? null,
        currentStock: line.currentStock ?? 0,
        maxStock: line.maxStock ?? 10,
        threshold: line.threshold ?? 3,
        replQty: line.replQty ?? 1,
        active: line.active ?? true,
        localKey: `${line.lineNumber}-${line.productId ?? 'empty'}`,
      }));
  }

onLineCountChange(value: number): void {
  const count = +value;
  this.selectedLineCount.set(count);
  this.ensureLinesCount(count);
}

  updateLine(lineNumber: number, key: keyof EditableLine, value: any): void {
  this.editableLines.update((lines) =>
    lines.map((line) => {
      if (line.lineNumber !== lineNumber) return line;

      const updated = {
        ...line,
        [key]: value,
      };

      if (key === 'productId') {
        const normalizedProductId =
          value === null || value === undefined || value === '' || +value <= 0
            ? null
            : +value;

        const selectedProduct = this.products().find(
          (p) => p.id === normalizedProductId
        );

        updated.productId = normalizedProductId;
        updated.productNameEn = selectedProduct?.nameEn ?? null;
        updated.productNameAr = selectedProduct?.nameAr ?? null;
      }

      return updated;
    })
  );
}

  getAssignedCount(machine: VendingMachineDto): number {
    return (machine.lines ?? []).filter((x) => !!x.productId).length;
  }

  selectedAlerts = computed(() => this.selectedKiosk()?.alerts ?? []);

  visibleLayoutLines = computed(() =>
    [...this.editableLines()].sort((a, b) => a.lineNumber - b.lineNumber)
  );

saveConfiguration(): void {
  debugger
  const machine = this.selectedKiosk();

  if (!machine || !machine.kioskId || machine.kioskId <= 0) {
    alert('Please select a valid kiosk first.');
    return;
  }

  this.saving.set(true);

  const dto: SaveKioskLinesDto = {
    kioskId: machine.kioskId,
    lines: this.editableLines().map<KioskLineDto>((line) => ({
      lineNumber: line.lineNumber,
      productId:
        line.productId === null ||
        line.productId === undefined ||
        +line.productId <= 0
          ? null
          : +line.productId,
      currentStock: +line.currentStock || 0,
      maxStock: +line.maxStock || 0,
      threshold: +line.threshold || 0,
      replQty: +line.replQty || 0,
      active: !!line.active,
    })),
  };

  console.log('SELECTED KIOSK:', machine);
  console.log('SAVE DTO:', dto);

  this.service.saveKioskLines(dto).subscribe({
    next: (res) => {
      this.saving.set(false);

      if (res.status) {
        alert(res.message || 'Configuration saved successfully');
        this.loadKiosks();
        this.selectKiosk(machine);
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

  isSelected(machine: VendingMachineDto): boolean {
    return this.selectedKiosk()?.kioskId === machine.kioskId;
  }

  getStatusDotClass(machine: VendingMachineDto): string {
    const assigned = this.getAssignedCount(machine);
    return assigned > 0 ? 'bg-green-500' : 'bg-slate-400';
  }

  getLineCardClass(line: EditableLine): string {
    return line.productId
      ? 'border-2 border-emerald-400 bg-emerald-50'
      : 'border border-slate-300 bg-slate-50';
  }

  getLineSubtitle(line: EditableLine): string {
    if (!line.productId) return 'Empty';

    return `${line.currentStock}/${line.maxStock}`;
  }

  trackByKiosk(_: number, item: VendingMachineDto): number {
    return item.kioskId;
  }

  trackByLine(_: number, item: EditableLine): number {
    return item.lineNumber;
  }
}
