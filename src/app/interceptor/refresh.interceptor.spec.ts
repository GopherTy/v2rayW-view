import { TestBed } from '@angular/core/testing';

import { RefreshInterceptor } from './refresh.interceptor';

describe('RefreshInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RefreshInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RefreshInterceptor = TestBed.inject(RefreshInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
