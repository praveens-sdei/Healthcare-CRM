import { TestBed } from '@angular/core/testing';

import { GeoLocAddressService } from './geo-loc-address.service';

describe('GeoLocAddressService', () => {
  let service: GeoLocAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoLocAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
