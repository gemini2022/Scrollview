import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollbarTrackComponent } from './scrollbar-track.component';

describe('ScrollbarTrackComponent', () => {
  let component: ScrollbarTrackComponent;
  let fixture: ComponentFixture<ScrollbarTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollbarTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollbarTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
