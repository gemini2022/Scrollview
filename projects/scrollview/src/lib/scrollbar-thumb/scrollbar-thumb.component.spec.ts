import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollbarThumbComponent } from './scrollbar-thumb.component';

describe('ScrollbarThumbComponent', () => {
  let component: ScrollbarThumbComponent;
  let fixture: ComponentFixture<ScrollbarThumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollbarThumbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollbarThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
