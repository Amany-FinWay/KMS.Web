import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStatusChartComponent } from './transaction-status-chart.component';

describe('TransactionStatusChartComponent', () => {
  let component: TransactionStatusChartComponent;
  let fixture: ComponentFixture<TransactionStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStatusChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
