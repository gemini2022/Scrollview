import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollbarButtonComponent } from './scrollbar-button.component';

describe('ScrollbarButtonComponent', () => {
  let component: ScrollbarButtonComponent;
  let fixture: ComponentFixture<ScrollbarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollbarButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollbarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
