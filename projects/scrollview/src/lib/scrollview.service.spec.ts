import { TestBed } from '@angular/core/testing';

import { ScrollviewService } from './scrollview.service';

describe('ScrollviewService', () => {
  let service: ScrollviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
