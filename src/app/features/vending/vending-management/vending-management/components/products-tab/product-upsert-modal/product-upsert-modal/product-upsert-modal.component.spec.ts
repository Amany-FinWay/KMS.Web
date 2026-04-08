import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpsertModalComponent } from './product-upsert-modal.component';

describe('ProductUpsertModalComponent', () => {
  let component: ProductUpsertModalComponent;
  let fixture: ComponentFixture<ProductUpsertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductUpsertModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductUpsertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
