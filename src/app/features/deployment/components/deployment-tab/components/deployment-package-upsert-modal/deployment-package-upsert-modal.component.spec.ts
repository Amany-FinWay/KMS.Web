import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentPackageUpsertModalComponent } from './deployment-package-upsert-modal.component';

describe('DeploymentPackageUpsertModalComponent', () => {
  let component: DeploymentPackageUpsertModalComponent;
  let fixture: ComponentFixture<DeploymentPackageUpsertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploymentPackageUpsertModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentPackageUpsertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
