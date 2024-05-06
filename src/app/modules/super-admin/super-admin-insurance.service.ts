import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceManagementService {

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

  insuranceGetFields(data: any) {
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance/get-mange-claim-content-field?fieldType=${data}`)
  }

  primaryInsuranceById(data: any) {
    return this.http.post(this.getBasePath() + `/healthcare-crm-insurance/insurance/get-assign-claim-content-primary`, data)
  }

  secondaryInsuranceById(data: any) {
    return this.http.post(this.getBasePath() + `/healthcare-crm-insurance/insurance/get-assign-claim-content-secondary`, data)
  }

  AccidentalInsuranceById(data: any) {
    return this.http.post(this.getBasePath() + `/healthcare-crm-insurance/insurance/get-assign-claim-content-accident`, data)
  }


  saveInsurance(data: any) {

    return this.http.post(this.getBasePath() + `/healthcare-crm-insurance/insurance/mange-claim-content`, data)
  }
  insuranceList() {
    console.log("enter new")
    return this.http.get(this.getBasePath() + `/superadmin/get-insurance-admin-approved-list?limit=10000&page=1`)
  }


  addAssociationData(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/superadmin/addAssociationData`, data, {
      params: {
        module_name: 'superadmin',
      },
      headers: this.getHeader(token)
    });
  }

}
