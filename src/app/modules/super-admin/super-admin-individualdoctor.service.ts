import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminIndividualdoctorService {


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

  asignMenuSubmit(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/menu/add-user-menu`, data, {
      params: {
        module_name: 'superadmin',
      },
      headers: this.getHeader(token)
    });
  }

  doctorsList(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/get-doctor-list`, {
      params,
      headers: this.getHeader(token)
    });
  }

  approveOrRejectDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/approve-or-reject-doctor`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  getDoctorDetails(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-view-doctor-profile?portal_user_id=${id}`,
      { headers: this.getHeader(token) }
    );
  }


  activeLockDeleteDoctor(data: any) {
    let token = this.auth.getToken();
    console.log(token)
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/active-lock-delete-doctor`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  DentalList(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/getFourPortalList`, {
      params,
      headers: this.getHeader(token)
    });
  }

}
