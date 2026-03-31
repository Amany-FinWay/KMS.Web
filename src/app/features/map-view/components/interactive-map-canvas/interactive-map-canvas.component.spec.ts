import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveMapCanvasComponent } from './interactive-map-canvas.component';

describe('InteractiveMapCanvasComponent', () => {
  let component: InteractiveMapCanvasComponent;
  let fixture: ComponentFixture<InteractiveMapCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveMapCanvasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractiveMapCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
