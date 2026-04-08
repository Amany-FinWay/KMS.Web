import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensingTabComponent } from './licensing-tab.component';

describe('LicensingTabComponent', () => {
  let component: LicensingTabComponent;
  let fixture: ComponentFixture<LicensingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicensingTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicensingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
