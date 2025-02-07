import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let mapsService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mapsService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapsService).toBeTruthy();
  });

  describe('getCurrentPosition', () => {
    it('should set the center coordinates', () => {
      const position = {
        coords: {
          latitude: 10,
          longitude: 20,
        },
      };

      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (callback) => {
          const mockGeo: GeolocationPosition = {
            coords: {
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              speed: 0,
              latitude: 10,
              longitude: 20,
              toJSON: () => null,
            },
            timestamp: 0,
            toJSON: () => null,
          };
          callback(mockGeo);
        }
      );

      mapsService.getCurrentPosition();

      expect(mapsService.center).toEqual({ lat: 10, lng: 20 });
    });
  });
});
