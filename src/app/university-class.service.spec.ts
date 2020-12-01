import { TestBed } from '@angular/core/testing';

import { UniversityClassService } from './university-class.service';

describe('UniversityClassService', () => {
  let service: UniversityClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversityClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
