import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartLockerManagementComponent } from './smart-locker-management.component';

describe('SmartLockerManagementComponent', () => {
  let component: SmartLockerManagementComponent;
  let fixture: ComponentFixture<SmartLockerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartLockerManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartLockerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
