import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LabimagingdentalopticalService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getHeader(token: any) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "role": "superadmin",
      "Authorization": `Bearer ${token}`,
    });
    return httpHeaders;
  }

  getBasePath() {
    return environment.apiUrl;
  }

  laboratoryList(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-four-portal-superadmin-list`, {
      params,
      headers: this.getHeader(token)
    });
  }

  approveOrRejectLabimagingdentaloptical(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/approve-or-reject-labimagingdentaloptical`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  activeLockDeleteLabimagingdentaloptical(data: any) {
    let token = this.auth.getToken();
    console.log(token)
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/active-lock-delete-labimagingdentaloptical`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  getMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-menus`, {
      params,
      headers: this.getHeader(token)
    });
  }

  getUserMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-user-menu`, {
      params,
      headers: this.getHeader(token)
    });
  }

  asignMenuSubmit(data: any){
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath()+`/menu/add-user-menu`, data ,{
      params: {
        module_name: 'superadmin',
      },
      headers: this.getHeader(token)
    });
  }

  getLabimagingdentalopticalDetails(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/view-doctor-profile-labimagingdentaloptical`,
      { params,headers: this.getHeader(token) }
    );
  }

  getLocations(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-get-locations`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
}
