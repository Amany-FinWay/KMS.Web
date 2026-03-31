import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentTabComponent } from './deployment-tab.component';

describe('DeploymentTabComponent', () => {
  let component: DeploymentTabComponent;
  let fixture: ComponentFixture<DeploymentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
