import { TestBed } from '@angular/core/testing';

import { V2rayService } from './v2ray.service';

describe('V2rayService', () => {
  let service: V2rayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V2rayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
