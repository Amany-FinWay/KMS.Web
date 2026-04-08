import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesTabComponent } from './machines-tab.component';

describe('MachinesTabComponent', () => {
  let component: MachinesTabComponent;
  let fixture: ComponentFixture<MachinesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachinesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachinesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
