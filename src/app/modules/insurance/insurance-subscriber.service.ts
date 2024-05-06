import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceSubscriber {

  constructor(private http: HttpClient) { }

  getHeader(token: any) {
    const httpHeaders = new HttpHeaders({
      "role": "insurance",
      "Authorization": "Bearer " + token
    });
    return httpHeaders;
  }

  getBasePath(){
    return environment.apiUrl;
  }

  getInsurancePath(){
    return environment.insuranceURL;
  }

  updateSubscriberPlanValidity(data: any) {
    return this.http.post(this.getBasePath()+`/healthcare-crm-insurance/insurance-subscriber/update-subscriber-plan-validity`, data,{
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }

  addSubscriberPlanHistory(data: any) {
    return this.http.post(this.getBasePath()+`/healthcare-crm-insurance/insurance-subscriber/add-subscriber-plan-history`, data,{
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }
  getSubscriberPlanHistory(subscriberId: any) {
    console.log(subscriberId,"subscriberIdd_dd_____");
    
    return this.http.post(this.getBasePath()+`/healthcare-crm-insurance/insurance-subscriber/get-subscriber-plan-history`,subscriberId, {

      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }

  getPriSubscriberWithItsSecondarylist(userId:any,limit:any=0,page:any=1,selectedsubscriber:any='',sortArray:any='unique:1') {
    
    return this.http.get(this.getBasePath()+`/healthcare-crm-insurance/insurance-subscriber/get-primaryWithItsSecondary-subscribers`, {
      params: {userId,limit,page,selectedsubscriber,sort:sortArray},
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }

  getSubscriberPlanDetails(planHistoryId: any) {
    console.log(planHistoryId,"planHistoryIdd_dd_____");
    
    return this.http.post(this.getBasePath()+`/healthcare-crm-insurance/insurance-subscriber/get-subscriber-plan-details`,planHistoryId, {

      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }
  
  getSubscriberType() {
    return this.http.get(this.getBasePath()+`/insurance/list-subscriber-type`, {
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }
  deleteSubscriber(data: any) {
    return this.http.post(this.getBasePath()+`/insurance/delete-subscriber`, data, {
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }
  getHealthPlans(userId: any) {
    return this.http.get(this.getBasePath()+`/insurance/get-all-health-plan`, {
      params: {userId},
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }
  viewSubscriberDetails(subscriberID: any) {
    return this.http.get(this.getBasePath()+`/insurance/view-subscriber`, {
      params: {subscriber_id: subscriberID},
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }

  viewSubscriberDetailsWithItsSecondary(data: any) {
    return this.http.post(this.getBasePath()+`/healthcare-crm-insurance/insurance-subscriber/view-subscribers-detail`, data, {
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }

  getSubscriberList(param: any) {
    return this.http.get(this.getBasePath()+`/insurance/list-subscriber`, {
      params: param,
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }
  submitSubscriberForm(data: any, type: string){
    if (type === 'secondary') {
      return this.http.post(`${this.getBasePath()}/insurance/add-secondary-subscriber`, data, {
        headers: this.getHeader('asdasd'),
        responseType: 'text'
      });
    } else if(type === 'edit'){
      return this.http.post(`${this.getBasePath()}/insurance/update-subscriber`, data, {
        headers: this.getHeader('asdasd'),
        responseType: 'text'
      });
    } else {
      return this.http.post(`${this.getBasePath()}/insurance/add-primary-subscriber`, data, {
        headers: this.getHeader('asdasd'),
        responseType: 'text'
      });
    }
  }
  uploadCSVFile(data: any){
    console.log("data========", data);
    
    return this.http.post(`${this.getBasePath()}/insurance/upload-subscribers-csv`, data, {
      headers: this.getHeader('asdasd'),
      responseType: 'text'
    });
  }

  active_deactive(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance-subscriber/active_deactive-subscriber`,
      data,
      {
        headers: this.getHeader('asdasd'),
      }
    );
    
  }

}