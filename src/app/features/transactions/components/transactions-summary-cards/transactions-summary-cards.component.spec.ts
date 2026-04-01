import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsSummaryCardsComponent } from './transactions-summary-cards.component';

describe('TransactionsSummaryCardsComponent', () => {
  let component: TransactionsSummaryCardsComponent;
  let fixture: ComponentFixture<TransactionsSummaryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsSummaryCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsSummaryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
