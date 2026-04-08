import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationUpsertModalComponent } from './documentation-upsert-modal.component';

describe('DocumentationUpsertModalComponent', () => {
  let component: DocumentationUpsertModalComponent;
  let fixture: ComponentFixture<DocumentationUpsertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationUpsertModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentationUpsertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
