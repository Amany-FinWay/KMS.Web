import { Component, Input, signal, computed, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ModuleRegistry, AllCommunityModule, GridOptions } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-shared-grid',
  imports: [CommonModule, AgGridModule, LucideAngularModule],
  standalone: true,
  templateUrl: './shared-grid.component.html',
  styleUrl: './shared-grid.component.css'
})
export class SharedGridComponent implements OnChanges{
  @Input() columnDefs: any[] = [];
  @Input() rowData: any[] = []; // دي الداتا المفلترة اللي جاية من الـ Parent
  @Input() parentReference: any;
  pageSize = signal(10);
  currentPage = signal(1);
  protected readonly Math = Math;
  private dataSource = signal<any[]>([]);

  paginatedData = computed(() => {
    const data = this.dataSource(); // مراقبة الـ signal
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return data.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.dataSource().length / this.pageSize()) || 1;
  });

  // دوال التحكم
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // عشان لما الداتا تتغير (بسبب السيرش مثلاً) نرجع للصفحة الأولى أوتوماتيكياً
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowData']) {
      this.dataSource.set(this.rowData || []);
      this.currentPage.set(1); // نرجع لأول صفحة مع كل تغيير داتا
    }
  }

  // إعدادات الجدول العامة
  gridOptions: GridOptions = {
    animateRows: true,
    //pagination: true,
    //paginationPageSize: 10,
    //paginationPageSizeSelector: [5, 10, 20],
    rowHeight: 80, // نفس القيمة اللي في الـ CSS
    headerHeight: 56,
    domLayout: 'autoHeight',
    rowStyle: { borderBottom: '1px solid #e0e0e0' },
    // لإلغاء أي حدود جانبية
    suppressCellFocus: true,
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      //resizable: true,
      //sortable: true,
      //filter: true
    }
  };
}
