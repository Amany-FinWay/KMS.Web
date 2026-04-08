import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsDataPanelComponent } from './transactions-data-panel.component';

describe('TransactionsDataPanelComponent', () => {
  let component: TransactionsDataPanelComponent;
  let fixture: ComponentFixture<TransactionsDataPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsDataPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
