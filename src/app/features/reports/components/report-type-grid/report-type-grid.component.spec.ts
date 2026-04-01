import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTypeGridComponent } from './report-type-grid.component';

describe('ReportTypeGridComponent', () => {
  let component: ReportTypeGridComponent;
  let fixture: ComponentFixture<ReportTypeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTypeGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportTypeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
