import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError, of, map, BehaviorSubject } from "rxjs";
import { Constants } from "src/app/config/constants";
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";
import { AuthService } from "src/app/shared/auth.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { QueryStringParameters } from "src/app/shared/classes/query-string-parameters";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import {
  IDocMetaDataRequest,
  IDocMetaDataResponse,
  INewOrderRequest,
  INewOrderResponse,
  ISubscriberData,
  IUniqueId,
} from "./homepage/retailpharmacy/retailpharmacy.type";
import {
  IDocumentMetaDataResponse,
  IMedicineConfirmResponse,
  IMedicineUpdateResponse,
  IOrderCancelResponse,
  IOrderConfimRequest,
  IOrderDetailsRequest,
  IOrderDetailsResponse,
  IOrderUpdateRequest,
  ISignedUrlRequest,
} from "./patient-prescriptionorder/neworder/neworder.type";
import {
  IOrderCountResponse,
  IOrderListRequest,
  IOrderListResponse,
  IOrderCountRequest,
} from "./patient-prescriptionorder/prescriptionorder/prescriptionorder.type";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  private pharmacyDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private uuid = localStorage.getItem("deviceId");
  private patientURL = "";
  private pharmacyURL = "";
  private insuranceURL = "";
  param: any;
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private constants: Constants,
    private coreService: CoreService
  ) {
    this.param = {
      module_name: this.auth.getRole(),
    };
    this.patientURL = this.constants.PATIENT_PORTAL;
    this.pharmacyURL = this.constants.PHARMACY_PORTAL;
    this.insuranceURL = this.constants.INSURANCE_PORTAL;
  }
  getAccessToken(data: any) {
    let token = this.auth.getToken();
    console.log(data, "data");
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/fetch-room-call`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getParticipantDetails(data: any) {
    // let token = this.auth.getToken();
    // console.log(data, "data");
    // return this.http.post(
    //   this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-participant-details`,
    //   data,
    //   {
    //     headers: this.getHeader(token),
    //   }
    // );
    let observable = Observable.create(observer => {
      let finalResponse = {
        participantName: "vikas",
        userId: "63e1f567a825766f5c52b0de",
        Identity: "544dishfhsdgfds",
        image: null,
        isAudioMute: false,
        isVideoMute: false,
      };
      let data1 = {
        status: 'Success',
        messageID: 200,
        message: "FETCH_SUCCESS",
        data: finalResponse,
      }
      observer.next(data1); // This method same as resolve() method from Angular 1
      observer.complete();//to show we are done with our processing
      // observer.error(new Error("error message"));
    })

    return observable
  }

  getHeader(token: any, deviceId: any = "") {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      role: "patient",
      Authorization: `Bearer ${token}`,
      uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }

  getBasePath() {
    return environment.apiUrl;
  }

  addPatient(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/patient/signup`, data, {
      headers: this.getHeader(""),
    });
  }

  getcinetpaylink(data: any) {
    return this.http.post('https://api-checkout.cinetpay.com/v2/payment', data, { headers: this.getHeader("") });
  }

  getVerificationCode(data: any) {
    return this.http.post(
      this.getBasePath() + `/patient/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader("asdasd"),
      }
    );
  }

  verifyOtp(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/patient/match-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader("", uuid),
      }
    );
  }

  getVerificationCodeMobile(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeEmail(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/send-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyMobileOtp(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/match-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyEmailOtp(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/match-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  login(data: any, uuid: any = "") {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/login`,
      data,
      {
        headers: this.getHeader("", uuid),
      }
    );
  }

  public newOrder(
    orderData: INewOrderRequest
  ): Observable<IResponse<INewOrderResponse>> {
    const NEW_ORDER_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/new-order",
      true
    );
    return this.apiHttpService
      .post<INewOrderResponse>(NEW_ORDER_URL, orderData, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public validateSubscriber(
    subscriberData: IUniqueId
  ): Observable<IResponse<ISubscriberData>> {
    const GET_SUBSCRIBER_URL = this.apiEndpointsService.createUrl(
      this.insuranceURL + "insurance-subscriber/subscriber-by-insurance",
      true
    );
    return this.apiHttpService
      .post<ISubscriberData>(GET_SUBSCRIBER_URL, subscriberData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleEncryptedError)
      );
  }

  public saveMetadata(
    docData: any
  ): Observable<IResponse<IDocMetaDataResponse[]>> {
    const META_DATA_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/save-documentmetadata",
      true
    );
    return this.apiHttpService
      .post<IDocMetaDataResponse[]>(META_DATA_URL, docData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public orderList(
    listRequest: IOrderListRequest
  ): Observable<IResponse<IOrderListResponse>> {
    const ORDER_LIST_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/list-order",
      true
    );
    return this.apiHttpService
      .post<IOrderListResponse>(ORDER_LIST_URL, listRequest, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public orderCount(
    countRequest: IOrderCountRequest
  ): Observable<IResponse<IOrderCountResponse[]>> {
    const ORDER_COUNT_URL =
      this.apiEndpointsService.createUrlWithQueryParameters(
        this.pharmacyURL + "order/order-count",
        (qs: QueryStringParameters) => {
          const listEntries = Object.entries(countRequest);
          listEntries.forEach((entry) => {
            qs.push(entry[0], entry[1]);
          });
        }
      );
    return this.apiHttpService
      .get<IOrderCountResponse[]>(ORDER_COUNT_URL, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public getOrderDetails(userData: IOrderDetailsRequest): Observable<IResponse<IOrderDetailsResponse>> {
    const ORDER_DETAIL_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/order-details",
      true
    );
    return this.apiHttpService
      .post<IOrderDetailsResponse>(ORDER_DETAIL_URL, userData, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }


  public fetchAppointmentDetails(userData: IOrderDetailsRequest): Observable<IResponse<IOrderDetailsResponse>> {
    const ORDER_DETAIL_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "labimagingdentaloptical/appointment-details",
      true
    );
    return this.apiHttpService
      .post<IOrderDetailsResponse>(ORDER_DETAIL_URL, userData, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }


  public updateOrderDetails(
    userData: IOrderUpdateRequest
  ): Observable<IResponse<IMedicineUpdateResponse>> {
    const ORDER_DETAIL_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/order-details",
      true
    );
    return this.apiHttpService
      .put<IMedicineUpdateResponse>(ORDER_DETAIL_URL, userData, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public confirmOrderDetails(
    userData: IOrderConfimRequest
  ): Observable<IResponse<IMedicineConfirmResponse>> {
    const ORDER_DETAIL_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/confirm-order",
      true
    );
    return this.apiHttpService
      .post<IMedicineConfirmResponse>(ORDER_DETAIL_URL, userData, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public cancelOrderDetails(
    userData: IOrderConfimRequest
  ): Observable<IResponse<IOrderCancelResponse>> {
    const ORDER_DETAIL_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/cancel-order",
      true
    );
    return this.apiHttpService
      .post<IOrderCancelResponse>(ORDER_DETAIL_URL, userData, {
        headers: new HttpHeaders().set(
          "Authorization",
          "Bearer " + this.auth.getToken()
        ),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public getDocumentMetadata(
    userData: IUniqueId
  ): Observable<IResponse<IDocumentMetaDataResponse>> {
    const DOC_METADATA_URL =
      this.apiEndpointsService.createUrlWithQueryParameters(
        this.pharmacyURL + "pharmacy/get-document-metadata",
        (qs: QueryStringParameters) => {
          const listEntries = Object.entries(userData);
          listEntries.forEach((entry) => {
            qs.push(entry[0], entry[1]);
          });
        }
      );
    return this.apiHttpService
      .get<IDocumentMetaDataResponse>(DOC_METADATA_URL)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public signedUrl(userData: ISignedUrlRequest): Observable<IResponse<string>> {
    const DOC_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/get-signed-url",
      true
    );
    return this.apiHttpService.post<string>(DOC_URL, userData).pipe(
      map((response) => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  private handleEncryptedError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.error));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof ErrorEvent) {
      errorMessage = err.error.message;
    } else {
      errorMessage = err.error.errorCode;
    }
    return throwError(() => new Error(errorMessage));
  }

  private handleResponse<T>(response: T) {
    if (environment.production) {
      return this.coreService.decryptContext(response as unknown as string);
    }
    return response;
  }

  //signup
  addPatSuperAdmin(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/patient/signup`, data, {
      headers: this.getHeader("asdasd"),
    });
  }

  //...........forgotPassword.............
  forgotPassword(body: any) {
    // console.log("lllll")
    console.log("checkkkk", body);
    console.log(this.getBasePath());
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/forgot-password`,
      body,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //...........resetPassword...........
  setNewPassword(data: any) {
    console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/reset-forgot-password`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //--------User Invitation--------------
  invitationList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/get-email-invitation-list`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  invitationListById(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/get-email-invitation-id`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  inviteUser(data: any) {
    console.log("data======?", data)
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-patient/patient/send-email-invitation`, data, {
      headers: this.getHeader(token),
    });
    // return of({
    //   response: { status: true, message: "Invitation Sent", ...data },
    // });
  }

  deleteInvitation(data: any) {
    // return of({ status: true, message: "Succesfully delete invitation" });

    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-patient/patient/delete-email-invitation`, data,
      {
        headers: this.getHeader(token)
      }
    );
  }

  //---------------Profile Creation -------------

  uploadFile(formData: any) {
    return this.http.post(
      this.getBasePath() + `/patient/upload-document`,
      formData
    );
  }

  profileDetails(paramData: any) {

    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/patient-details`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  updateNotification(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/update-notification-status`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  viewPaientPersonalDetails(paramData: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/patient-personal-details`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  // profileDetails(params: any) {
  //   let token = this.auth.getToken();
  //   return this.http.get(
  //     this.getBasePath() + `/healthcare-crm-patient/patient/patient-details`,
  //     {
  //       params: params,
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }

  commonData() {
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/common-api`,
      {
        headers: this.getHeader(""),
      }
    );
  }

  immunizationList() {
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/static-immunization-list`,
      {
        headers: this.getHeader(""),
      }
    );
  }
  vaccineList() {
    var token = localStorage.getItem("token");
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/vaccination-master-list?searchText=&limit=0&page=1`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  allergiesList() {
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/static-allergies-list`,
      {
        headers: this.getHeader(""),
      }
    );
  }

  patientHistoryTypeList() {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/static-patient-history-type-list`,
      {
        headers: this.getHeader(""),
      }
    );
  }

  lifestyleTypeList() {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/static-patient-lifestyle-type-list`,
      {
        headers: this.getHeader(""),
      }
    );
  }

  familyHistoryTypeList() {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/static-family-history-type-list`,
      {
        headers: this.getHeader(""),
      }
    );
  }

  personalDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/personal-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  insuranceDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/insurance-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addVitals(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/add-vitals`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicines(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/medicine-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  immunizations(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/immunization-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  editImmunization(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/edit-immunization`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteImmunization(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/delete-Immunization`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  patientHistory(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/history-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicalDocuments(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/medical-document`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  dependentFamilyMembers(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/family-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //patient purchase plan service

  getPatientSubscriptionPlan(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/all-subscription-plans`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  parseStringToHTML(str) {
    var dom = document.createElement('div');
    dom.innerHTML = str;
    return dom.firstChild;

  }

  getPatientSubscriptionPlanDetails(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-subscription-plan-details`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getPatientPlanOfUser(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/payment/subscription-purchased-plan`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  //patient purchase plan service ends

  //get common data

  public getAllCommonData() {
    // let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/common-api`,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getmedicineListWithParam(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/list-medicine-without-pagination`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimList(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicine-claim-listPatient?status=${data.status}&patientId=${data.patientId}&limit=${data.limit}&page=${data.page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimListLabImaging(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineClaimListLabImaging?status=${data.status}&patientId=${data.patientId}&limit=${data.limit}&page=${data.page}&claimType=${data.claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimListLabImagingAppointment(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineClaimListLabImagingAppointment?status=${data.status}&patientId=${data.patientId}&limit=${data.limit}&page=${data.page}&claimType=${data.claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getClaimsStatusCount(patientId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicine-claim-count-by-status-patient?patientId=${patientId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimCountByStatusLabImagin(patientId: any, claimType: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusLabImagin?patientId=${patientId}&claimType=${claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimCountByStatusLabImaginAppointment(patientId: any, claimType: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusLabImaginAppointment?patientId=${patientId}&claimType=${claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimCountByStatusLabImaginAppointmentPatient(patientId: any, claimType: any): Observable<any> {
    console.log(claimType, "check type");

    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusLabImaginAppointmentPatient?patientId=${patientId}&claimType=${claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getmedicineList(param: any = {}) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/list-medicine-without-pagination`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getInsuanceList(isDeleted: any = "") {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/superadmin/get-insurance-admin-approved-list?limit=10000&page=1&isDeleted=${isDeleted}`,
      { headers: this.getHeader(token) }
    );
  }
  getInsuanceAlowedList(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-insurance-admin-approved-allowed-list?limit=10000&page=1`,
      {
        params,
        headers: this.getHeader(token)
      }
    );
  }
  spokenLanguage() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/common-api`,
      { headers: this.getHeader(token) }
    );
  }

  getPharmacyDetails(pharmacyID: any) {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/pharmacy-details?pharmacyId=${pharmacyID}`,
      { headers: this.getHeader("") }
    );
  }

  patientExistingDocs(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/patient-existing-docs`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  createMedicalDoc(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/patient/create-profile/medical-document`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  SubscribersList(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/subscribers-list-for-patient`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  subscribersDetails(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/subscriber-details`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  createPayment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/payment/create-payment-intent`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // getInsuranceList(){
  //   return this.http.get(this.getBasePath() + `/get-insurance-admin-approved-list`,
  //   { headers: this.getHeader('') }
  //   );
  // }

  //   getInsuranceDetails(data:any){
  //     return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance/subscriber-list-by-first-last-name-dob-mobile?insurance_id=${data.insurance_id}&firstName=${data.firstName}&lastName=${data.lastName}&dob=${data.dob}&mobile=${data.mobile}`,
  //     { headers: this.getHeader('') }
  //     );
  //   }
  // }

  getInsuranceList() {
    return this.http.get(
      this.getBasePath() + `/get-insurance-admin-approved-list`,
      { headers: this.getHeader("") }
    );
  }

  getInsuranceDetails(data: any) {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/subscriber-list-by-first-last-name-dob-mobile?insurance_id=${data.insurance_id}&firstName=${data.firstName}&lastName=${data.lastName}&dob=${data.dob}&mobile=${data.mobile}`,
      { headers: this.getHeader("") }
    );
  }


  patientAppointmentList(parameter: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/patient/list-appointment`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }


  getAll(parameter: any): Observable<any> {
    // const headers = new HttpHeaders({
    //   additionalHeaders: this.getAdditionalHeaders,
    // });
    // isLoading && this.loadingStateSubject.next(true);
    let token = this.auth.getToken();
    return this.http
      .get<any>(this.getBasePath() + `/healthcare-crm-hospital/patient/list-appointment`, { params: parameter, headers: this.getHeader(token) })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }




  cancelAppointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/patient/cancel-appointment`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  setReminder(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/set-reminder-for-appointment`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getRemindersData(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/get-reminder-for-appointment`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }
  getDoctorInfo(parameter: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/view-doctor-details-for-patient`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }
  getAppointmentDetails(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/patient/view-appointment`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getPastAppointOfPatient(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/list-appointment?patient_portal_id=${data.patient_portal_id}&page=${data.page}&limit=${data.limit}&status=${data.status}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getAllDoctor() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/all-doctors`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  allDoctorsHopitalizationList() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/allDoctorsHopitalizationList`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getPermission(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/get-profile-permission`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  setPermission(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/set-profile-permission`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addMedicineOnWaitingRoom(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/add-medicine-on-waiting-room`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  editMedicineOnWaitingRoom(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/edit-medicine-on-waiting-room`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  getAssesment(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/assessment-list`,
      {
        params: parameter,
        headers: this.getHeader(token)
      })

  }
  allRole(userId: string) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/role/all-role`, {
      params: {
        userId,
        module_name: "pharmacy",
      },
      headers: this.getHeader(token),
    });
  }
  addAssesment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-hospital/hospital/add-and-edit-assessment`,
      data,
      {
        headers: this.getHeader(token)
      })



  }

  getAssessmentList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/assessment-list`,

      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  getLocationInfoWithNames(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-locations-name`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getSubscriberDetails(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance-subscriber/view-subscriber`,

      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getAllRatingAndReviews(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/all-rating-reviews-by-patient`,

      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getAllFourPortalRatingAndReviews(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-rating-and-reveiws`,

      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getPurchasedPlanByPatient(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/get-plan-purchased-by-patient`,

      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  checkForPlanPurchased(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/payment/patient-is-plan-purchased`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  async isPlanPurchesdByPatient(user_id: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let reqData = {
        user_id,
      };
      this.checkForPlanPurchased(reqData).subscribe(async (res) => {
        let isPlanPurchased = false;
        let response = await this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          isPlanPurchased = response?.isPlanPurchased;
        }
        resolve(isPlanPurchased);
      }, error => {
        reject(error);
      });
    });
  }



  getDependentFamilyMembers(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/patient-dependent-family-members`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getPatientVitals(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/get-vitals`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  // getPatientVitalsMonthly(parameter: any) {
  //   let token = this.auth.getToken();
  //   return this.http.get(
  //     this.getBasePath() +
  //       `/healthcare-crm-patient/patient/get-vitals-monthly`,
  //     {
  //       params: parameter,
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }

  getPatientAppointmentss(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/list-appointment-upcoming`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }


  getallplanPriceforPatient(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/payment/patient-getallplanPrice`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  // sendInvitation(data: any) {
  //   let token = this.auth.getToken();
  //   return this.http.post(this.getBasePath() + `patient/send-email-invitation`, data, {
  //     headers: this.getHeader(""),
  //   });
  // }

  updatePharmacyData(data: any) {
    this.pharmacyDataSubject.next(data);
  }

  getPharmacyData(): Observable<any> {
    return this.pharmacyDataSubject.asObservable();
  }

  getAboutUs(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-about-us`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  blogListApi(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/get-blog`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  // contactus
  getContactus(params: any) {
    let token = this.auth.getToken();
    console.log("params===============", params)
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-contact-us`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getlistpNc(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-privacy-condition`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getlistTNC(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-terms-condition`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  articleListApi(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/get-article`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  getPaymentHistoryForPatient(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/payment/getPaymentHistoryForPatient`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  addfaqApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/add-faq`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getallFaq(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/all-faq`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  listVideo(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/get-video`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  //...........forgotPassword.............
  changePassword(body: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/change-password`,
      body,
      {
        headers: this.getHeader(token),
      }
    );
  }



  postInsuranceDetails(body: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/post-subscriber-list-by-first-last-name-dob-mobile`,
      body,
      {
        headers: this.getHeader(token),
      }
    );
  }


  articleByIdApi(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/get-Article-by-Id`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-patient/patient/get-all-notification`,

      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateNotificationStatus(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/update-notification`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  markAllReadNotification(data: any) {
    // console.log(data,"ppppppppppppp")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-patient/patient/mark-all-read-notification`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    // console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    // console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-patient/patient/mark-read-notification-id`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getLabListDataWithoutPagination(param: any = {}) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/labTestList-without-pagination`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getLabTestId(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/lab-test-byId`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  newLabOrder(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/add-new-lab-order`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  savefourPortalMetaData(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/save-documentmetadata`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  orderlistallfourPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-order-list`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  totalcountallPortal(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-totalOrderCount`,

      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fetchOrderDetailsallPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-fetchOrderDetails`, data,

      {

        headers: this.getHeader(token),
      }
    );
  }

  getIamgingListDataWithoutPagination(param: any = {}) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imagingTestList-without-pagination`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getImagingTestId(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-byId`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getOthersListDataWithoutPagination(param: any = {}) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/othersTestList-without-pagination`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getOthersTestId(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/others-test-byId`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getEyeglassesListDataWithoutPagination(param: any = {}) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/eyeglassesTestList-without-pagination`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getEyeglassesTestId(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/eyeglasses-test-byId`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_bookAppointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-appointment`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_viewAppointment(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-view-Appointment`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getallClinicHospital(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-hospital-and-clinic`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getfourportalClinicHospital(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-fourportal-all-hospital-and-clinic`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getIDbyImmunization(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/get-id-by-immunization`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  searchbyPortaluserName(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/search-any-portaluser-by-search-keyword`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  blogByIdApi(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/get-Blog-by-Id`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

}


