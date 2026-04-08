import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendingManagementComponent } from './vending-management.component';

describe('VendingManagementComponent', () => {
  let component: VendingManagementComponent;
  let fixture: ComponentFixture<VendingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
