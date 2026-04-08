import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskagentUpsertModalComponent } from './kioskagent-upsert-modal.component';

describe('KioskagentUpsertModalComponent', () => {
  let component: KioskagentUpsertModalComponent;
  let fixture: ComponentFixture<KioskagentUpsertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KioskagentUpsertModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KioskagentUpsertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
