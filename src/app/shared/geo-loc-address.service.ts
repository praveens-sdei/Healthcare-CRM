import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GeoLocAddressService {

  constructor(private http: HttpClient) { }
  
  getAddress(latitude: number, longitude: number): Promise<string> {
    const apiKey = '';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    
    return this.http.get<any>(url)
      .toPromise()
      .then(response => {
        if (response.results && response.results[0]) {
          return response.results[0].formatted_address;
        } else {
          return 'Address not found';
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        return 'Error fetching address';
      });
  }
}
