import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}
@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  constructor() { }

  getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
}
