import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  center: { lat: number; lng: number } = { lat: 0, lng: 0 };

  constructor() {}

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.center = { lat: latitude, lng: longitude };
    });
  }
}
