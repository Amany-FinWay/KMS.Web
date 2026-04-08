import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartLockerUploadModalComponent } from './smart-locker-upload-modal.component';

describe('SmartLockerUploadModalComponent', () => {
  let component: SmartLockerUploadModalComponent;
  let fixture: ComponentFixture<SmartLockerUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartLockerUploadModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartLockerUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
