import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSidebarComponent } from './reports-sidebar.component';

describe('ReportsSidebarComponent', () => {
  let component: ReportsSidebarComponent;
  let fixture: ComponentFixture<ReportsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
