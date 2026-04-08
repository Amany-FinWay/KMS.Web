import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskLocationsSidebarComponent } from './kiosk-locations-sidebar.component';

describe('KioskLocationsSidebarComponent', () => {
  let component: KioskLocationsSidebarComponent;
  let fixture: ComponentFixture<KioskLocationsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskLocationsSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KioskLocationsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
