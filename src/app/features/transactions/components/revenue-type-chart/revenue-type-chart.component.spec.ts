import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueTypeChartComponent } from './revenue-type-chart.component';

describe('RevenueTypeChartComponent', () => {
  let component: RevenueTypeChartComponent;
  let fixture: ComponentFixture<RevenueTypeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueTypeChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevenueTypeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
