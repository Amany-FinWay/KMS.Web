import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-actions-buttons',
  imports: [],
  standalone: true,
  templateUrl: './grid-actions-buttons.component.html',
  styleUrl: './grid-actions-buttons.component.css'
})
export class GridActionsButtonsComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onEditClick() {
    // بننادي function موجودة في الـ Parent Component
    if (this.params.context.componentParent.onEdit) {
      this.params.context.componentParent.onEdit(this.params.data);
    }
  }

  onDeleteClick() {
    if (this.params.context.componentParent.onDelete) {
      this.params.context.componentParent.onDelete(this.params.data);
    }
  }
}
