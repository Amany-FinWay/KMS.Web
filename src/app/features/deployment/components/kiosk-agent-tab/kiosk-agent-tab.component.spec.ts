import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskAgentTabComponent } from './kiosk-agent-tab.component';

describe('KioskAgentTabComponent', () => {
  let component: KioskAgentTabComponent;
  let fixture: ComponentFixture<KioskAgentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskAgentTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KioskAgentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
