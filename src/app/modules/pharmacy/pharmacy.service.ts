import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Constants } from "src/app/config/constants";
import { AuthService } from "src/app/shared/auth.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { QueryStringParameters } from "src/app/shared/classes/query-string-parameters";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import { ApiEndpointsService } from "../../core/services/api-endpoints.service";
import { ApiHttpService } from "../../core/services/api-http.service";
import { IUniqueId } from "../patient/homepage/retailpharmacy/retailpharmacy.type";
import {
  IFileUploadResult,
  IProfileRequest,
  IProfileResponse,
} from "./pharmacy-creatprofile/pharmacy-creatprofile.type";
import {
  ISendEmailRequest,
  ISendOtpRequest,
  ISendOtpResponse,
  IVerifyOtpRequest,
} from "./pharmacy-entercode/pharmacy-entercode.type";
import {
  ILoginRequest,
  ILoginResponse,
} from "./pharmacy-login/pharmacy-login.type";
import { IResetPasswordRequest } from "./pharmacy-newpassword/pharmacy-newpassword.type";
import {
  IDocumentMetaDataResponse,
  IMedicineUpdateResponse,
  IOrderCancelResponse,
  IOrderConfimRequest,
  IOrderDetailsRequest,
  IOrderDetailsResponse,
  IOrderUpdateRequest,
  ISignedUrlRequest,
} from "./pharmacy-prescriptionorder/neworder/neworder.type";
import {
  IOrderCountResponse,
  IOrderListRequest,
  IOrderListResponse,
  IPatientDetailsRequest,
  IOrderCountRequest,
} from "./pharmacy-prescriptionorder/prescriptionorder/prescriptionorder.type";
import {
  IRegisterRequest,
  IRegisterResponse,
} from "./pharmacy-signup/pharmacy-signup.type";

@Injectable()
export class PharmacyService {
  private uuid = localStorage.getItem("uuid");
  private pharmacyURL = "";
  private patientURL = "";
  private insuranceURL = "";
  param:
    | HttpParams
    | {
      [param: string]:
      | string
      | number
      | boolean
      | readonly (string | number | boolean)[];
    };
  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private http: HttpClient,
    private constants: Constants,
    private coreService: CoreService,
    private auth: AuthService
  ) {
    this.pharmacyURL = this.constants.PHARMACY_PORTAL;
    this.patientURL = this.constants.PATIENT_PORTAL;
    this.insuranceURL = this.constants.INSURANCE_PORTAL;
  }

  getHeader(token: any, deviceId: any = "") {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      role: "insurance",
      Authorization: `Bearer ${token}`,
      uuid: deviceId,
    });
    return httpHeaders;
  }



  getStaffDetails(staffID: any) {
    let token = this.auth.getToken();

    return this.http.get(
      this.getBasePath() + `/pharmacy/view-staff-details?userId=${staffID}`,
      { headers: this.getHeader(token) }
    );
  }



  getHeaderFormdata(token: any) {
    const httpHeaders = new HttpHeaders({
      // "Accept": "application/json",
      // "Content-Type": "multipart/form-data",
      role: "pharmacy",
      Authorization: `Bearer ${token}`,
      // "uuid": localStorage.getItem('deviceId')
    });
    return httpHeaders;
  }

  getBasePath() {
    return environment.apiUrl;
  }

  public registerUser(
    userData: IRegisterRequest
  ): Observable<IResponse<IRegisterResponse>> {
    const REGISTER_ADMIN_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/signup",
      true
    );
    return this.apiHttpService
      .post<IRegisterResponse>(REGISTER_ADMIN_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  allRoleInfo(userId: string) {
    let token = this.auth.getToken();
    console.log(this.auth.getRole(), "getting role");
    let roleInfo;
    if (this.auth.getRole() == "super-admin") {
      roleInfo = "superadmin";
    } else {
      roleInfo = this.auth.getRole();
    }

    return this.http.get(this.getBasePath() + `/role/all-role`, {
      params: {
        userId,
        module_name: roleInfo,
      },
      headers: this.getHeader(token),
    });
  }

  public loginUser(
    userData: ILoginRequest
  ): Observable<IResponse<ILoginResponse>> {
    const LOGIN_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/login",
      true
    );
    return this.apiHttpService.post<ILoginResponse>(LOGIN_URL, userData).pipe(
      map((response) => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  public sendOtp(
    userData: ISendOtpRequest
  ): Observable<IResponse<ISendOtpResponse>> {
    const SEND_OTP_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/send-sms-otp",
      true
    );
    return this.apiHttpService
      .post<ISendOtpResponse>(SEND_OTP_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public sendVerifyEmail(
    userData: ISendEmailRequest
  ): Observable<IResponse<ISendOtpResponse>> {
    const SEND_EMAIL_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/send-email-verification",
      true
    );
    return this.apiHttpService
      .post<ISendOtpResponse>(SEND_EMAIL_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public verifyOtp(
    userData: IVerifyOtpRequest
  ): Observable<IResponse<ISendOtpResponse>> {
    const VERIFY_OTP_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/match-sms-otp",
      true
    );
    return this.apiHttpService
      .post<ISendOtpResponse>(VERIFY_OTP_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public viewProfile(userId: any): Observable<IResponse<IProfileResponse>> {
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + `pharmacy/view-pharmacy-admin-details?id=${userId.userId}`,
      true
    );
    return this.apiHttpService.get<IProfileResponse>(PROFILE_URL).pipe(
      map((response) => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  public viewProfileById(userId: any): Observable<IResponse<IProfileResponse>> {
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + `pharmacy/view-pharmacy-admin-details?id=${userId}`,
      true
    );
    return this.apiHttpService.get<IProfileResponse>(PROFILE_URL).pipe(
      map((response) => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  public createProfile(
    userData: IProfileRequest
  ): Observable<IResponse<IProfileResponse>> {
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/pharmacy-profile",
      true
    );
    let token = this.auth.getToken();
    return this.apiHttpService
      .post<IProfileResponse>(PROFILE_URL, userData, { headers: this.getHeader(token) })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  editProfile(data: any) {
    let token = this.auth.getToken();
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/pharmacy-profile",
      true
    );
    return this.apiHttpService.post<IProfileResponse>(PROFILE_URL, data).pipe(
      map((response) => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  public createProfile1(
    userData: IProfileRequest
  ): Observable<IResponse<IProfileResponse>> {
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/pharmacy-profile-create",
      true
    );
    return this.apiHttpService
      .post<IProfileResponse>(PROFILE_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  editProfile1(data: any) {
    let token = this.auth.getToken();
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/pharmacy-profile-create",
      true
    );
    return this.apiHttpService.post<IProfileResponse>(PROFILE_URL, data).pipe(
      map((response) => this.handleResponse(response)),
      catchError(this.handleError)
    );
  }

  sethours(data: any) {
    let token = this.auth.getToken();
    const PROFILE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/pharmacy-profile-set-hours",
      true
    );
    return this.apiHttpService
      .post(PROFILE_URL, data, {
        headers: this.getHeader(token),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public forgotPasswordUser(
    userData: ISendEmailRequest
  ): Observable<IResponse<ISendOtpResponse>> {
    const FORGOT_PASSWORD_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/forgot-password",
      true
    );
    return this.apiHttpService
      .post<ISendOtpResponse>(FORGOT_PASSWORD_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public resetPasswordUser(
    userData: IResetPasswordRequest
  ): Observable<IResponse<ISendOtpResponse>> {
    const RESET_PASSWORD_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/reset-password",
      true
    );
    console.log(RESET_PASSWORD_URL, "RESET_PASSWORD_URL");

    return this.apiHttpService
      .post<ISendOtpResponse>(RESET_PASSWORD_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  changePassword(data: any) {
    const CHANGE_PASSWORD_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/change-password",
      true
    );
    return this.apiHttpService
      .post<ISendOtpResponse>(CHANGE_PASSWORD_URL, data)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public uploadDocument(
    docData: FormData
  ): Observable<IResponse<IFileUploadResult[]>> {
    const UPLOAD_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/upload-document",
      true
    );
    return this.http
      .post<IResponse<IFileUploadResult[]>>(UPLOAD_URL, docData, {
        headers: new HttpHeaders().set("uuid", this.uuid),
      })
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  addClaimEsignature(formdata: FormData) {
    console.log("check route");

    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/add-claim-esignature`,
      formdata,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }





  public uploadBase64(
    docData: FormData
  ): Observable<IResponse<IFileUploadResult[]>> {
    const UPLOAD_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "pharmacy/upload-base64",
      true
    );
    return this.http
      .post<IResponse<IFileUploadResult[]>>(UPLOAD_URL, docData, {
        headers: new HttpHeaders().set("uuid", this.uuid),
      })
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
  PharmacyReviweandRating(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/post-review-and-rating`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPharmcyRaviweandRating(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-review-and-rating`,
      {
        params: param,
        // headers: this.getHeader(token),
      }
    );
  }

  deletePharmcyRaviweandRating(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/delete-review-and-rating-pharmacy`,
      data,
      {
        headers: this.getHeader(token),
      }
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

  // public patientProfile(userData: IPatientDetailsRequest): Observable<IResponse<IOrderCountResponse[]>> {
  //   const PATIENT_PROFILE_URL = this.apiEndpointsService.createUrlWithQueryParameters(
  //     this.patientURL + "patient/profile-details",
  //     (qs: QueryStringParameters) => {
  //       const listEntries = Object.entries(userData);
  //       listEntries.forEach((entry) => {
  //         qs.push(entry[0], entry[1]);
  //       });
  //     }
  //   );
  //   return this.apiHttpService.get<IOrderCountResponse[]>(PATIENT_PROFILE_URL).pipe(
  //     map((response) => this.handleResponse(response)),
  //     catchError(this.handleError)
  //   );
  // }

  public patientProfile(
    pateintId: any,
    insurance_no: any = null,
    subscriber_id: any = null
  ): Observable<IResponse<IOrderCountResponse[]>> {
    const PATIENT_PROFILE_URL = this.apiEndpointsService.createUrl(
      this.patientURL +
      `patient/profile-details?patient_id=${pateintId}&insurance_no=${insurance_no}&subscriber_id=${subscriber_id}`,
      true
    );
    return this.apiHttpService
      .get<IOrderCountResponse[]>(PATIENT_PROFILE_URL)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public getPaymentDetails(
    pateintId: any,
    order_id: any
  ): Observable<IResponse<IOrderCountResponse[]>> {
    const PATIENT_PROFILE_URL = this.apiEndpointsService.createUrl(
      this.patientURL +
      `patient/get-payment-details?patient_id=${pateintId}&order_id=${order_id}`,
      true
    );
    return this.apiHttpService
      .get<IOrderCountResponse[]>(PATIENT_PROFILE_URL)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public checkSubscriptionExpiry(
    data: any
  ): Observable<IResponse<IOrderCountResponse[]>> {
    const CHECK_EXPIRY_URL = this.apiEndpointsService.createUrl(
      this.insuranceURL + `insurance-subscriber/check-subscription-expiry`,
      true
    );
    return this.apiHttpService
      .post<IOrderCountResponse[]>(CHECK_EXPIRY_URL, data)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public getOrderDetails(
    userData: IOrderDetailsRequest
  ): Observable<IResponse<IOrderDetailsResponse>> {
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

  public verifyInsuranceForOrder(
    data: any
  ): Observable<IResponse<IMedicineUpdateResponse>> {
    const VERIFY_INSURANCE_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + "order/verify-insurance-for-order",
      true
    );
    return this.apiHttpService
      .post<IMedicineUpdateResponse>(VERIFY_INSURANCE_URL, data, {
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

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof ErrorEvent) {
      errorMessage = err.error.message;
    } else {
      errorMessage = err.error?.errorCode;
    }
    return throwError(() => new Error(errorMessage));
  }

  private handleResponse<T>(response: T) {
    if (environment.production) {
      return this.coreService.decryptContext(response as unknown as string);
    }
    return response;
  }

  getAllStaff(paramsData: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/pharmacy/list-staff`, {
      params: paramsData,
      headers: this.getHeader(token),
    });
  }
  //advance search list pharmacy(for patient/homepage)
  public listPharmacy(data: any): Observable<IResponse<IOrderCountResponse[]>> {
    const NEW_ORDER_URL = this.apiEndpointsService.createUrl(
      this.pharmacyURL + `pharmacy/advance-search-pharmacy-list`,
      true
    );
    return this.apiHttpService
      .post<IOrderCountResponse[]>(NEW_ORDER_URL, data)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  public getcountrylist() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/country-list`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  public getRegionListByCountryId(countryId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/region-list?country_id=${countryId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  public getProvinceListByRegionId(regionId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/province-list?region_id=${regionId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  public getDepartmentListByProvinceId(provinceId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/department-list?province_id=${provinceId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  public getCityListByDepartmentId(departmentId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/city-list?department_id=${departmentId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  public getVillageListByDepartmentId(departmentId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/village-list?department_id=${departmentId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //.............AddStaff............
  addStaff(formData: any) {
    console.log(formData);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/pharmacy/add-staff`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  //...............allRole..................
  allRole(userId: string) {
    var module_name = '';
    console.log(this.auth.getRole(), "67");

    if (this.auth.getRole() == 'individual-doctor') {
      console.log("inside name");

      module_name = "hospital"
    }
    else if (this.auth.getRole() == 'patient') {
      module_name = "pharmacy"
    }
    else {
      console.log("check else name");

      module_name = this.auth.getRole()
    }
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/role/all-role`, {
      params: {
        userId,
        module_name: module_name,
      },
      headers: this.getHeader(token),
    });
  }

  TitleLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-title`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }



  allRoles(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-pharmacy/role/all-role`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  gettAllStaff(paramsData: any) {
    // console.log(params, 'params');
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/pharmacy/list-staff`, {
      params: paramsData,
      headers: this.getHeaderFormdata(token),
      // headers: this.getHeader(token),
    });
  }

  editStaff(formData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/pharmacy/edit-staff`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }
  deleteActiveAndLockStaff(data: any) {
    let token = JSON.stringify(this.auth.getToken());
    return this.http.post(
      this.getBasePath() + `/pharmacy/delete-active-lock-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/role/add-role`, data, {
      params: {
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  updateRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/role/update-role`, data, {
      params: {
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  deleteRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/role/delete-role`, data, {
      params: {
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  getMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-menus`, {
      params,
      headers: this.getHeader(token),
    });
  }

  getUserMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-user-menu`, {
      params,
      headers: this.getHeader(token),
    });
  }

  asignMenuSubmit(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/menu/add-user-menu`, data, {
      params: {
        module_name: "superadmin",
      },
      headers: this.getHeader(token),
    });
  }

  getSubMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-submenus`, {
      params,
      headers: this.getHeader(token),
    });
  }

  addSubmenusInfo(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/menu/add-submenu-permission`,
      data,
      { params: { module_name: "pharmacy" }, headers: this.getHeader(token) }
    );
  }

  submenudatabyuser(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/get-submenu-by-user`, {
      params,
      headers: this.getHeader(token),
    });
  }

  gettAllStaffListing(paramsData: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/pharmacy/get-all-staff`, {
      params: paramsData,
      headers: this.getHeaderFormdata(token),
      // headers: this.getHeader(token),
    });
  }

  associationList() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-all-association-group?group_type=pharmacy`,
      { headers: this.getHeader(token) }
    );
  }

  checkForPlanPurchased(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/payment/pharmacy-is-plan-purchased`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  async isPlanPurchasedByPharmacy(user_id: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let reqData = {
        user_id,
      };
      this.checkForPlanPurchased(reqData).subscribe(
        async (res) => {
          let isPlanPurchased = false;
          let response = await this.coreService.decryptObjectData({
            data: res,
          });
          if (response.status) {
            isPlanPurchased = response?.isPlanPurchased;
          }
          resolve(isPlanPurchased);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  getEprescriptionDetailsForMedicineClaim(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-all-eprescription-details-for-claim-medicine`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }


  getAllEprescriptionDetailsForFourPortal(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/getAllEprescriptionDetailsForFourPortal`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }


  getlistApprovedPharmacyAdminUserparams(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/list-approved-pharmacy-admin-user`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }



  getPortalTypeAndInsuranceId(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-portaltypeandinsuranceId`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  inviteUser(data: any) {
    console.log("data======?", data)
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/send-email-invitation`, data, {
      headers: this.getHeader(token),
    });
    // return of({
    //   response: { status: true, message: "Invitation Sent", ...data },
    // });
  }

  invitationList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-email-invitation-list`,
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
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-email-invitation-id`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  deleteInvitation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/delete-email-invitation`, data,
      {
        headers: this.getHeader(token)
      }
    );
    // return of({ status: true, message: "Succesfully delete invitation" });
  }

  getPharmacyChatUser(paramData: any) {
    let token = this.auth.getToken();
    console.log(paramData, "paramData")
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/chat-list-staff`,

      {
        params: paramData,
        headers: this.getHeader(token),
      }

    );
  }

  getAllMessagesService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/all-message`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getRoomlistService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-create-chat`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  clearSingleMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/clear-single-message`, data,
      {
        headers: this.getHeader(token)
      }
    );
  }



  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-all-notification`,

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
      `/healthcare-crm-pharmacy/pharmacy/update-notification`,
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
    return this.http.put(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/mark-all-read-notification`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/mark-read-notification-id`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearAllMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/clear-all-messages`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateConfirmSchedule(data: any) {
    console.log("data----------------------", data);

    let token = this.auth.getToken();
    console.log(token);
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/update-schedule-order`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  pharmacyAssociationApi(pharmacyID: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/get-pharmacy-association-by-id?pharmacy_portal_id=${pharmacyID}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getOnDutyGroup(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-on-duty-group`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  public matchEmailOtpFor2fa(
    userData: IVerifyOtpRequest
  ): Observable<IResponse<ISendOtpResponse>> {
    const VERIFY_OTP_URL = this.apiEndpointsService.createUrl(
      `healthcare-crm-pharmacy/pharmacy/match-Email-Otp-For2fa`,
      true
    );
    console.log("VERIFY_OTP_URL", VERIFY_OTP_URL);

    return this.apiHttpService
      .post<ISendOtpResponse>(VERIFY_OTP_URL, userData)
      .pipe(
        map((response) => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  updateNotification(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/update-notification-status`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateLogs(data: any) {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/update-logs`,
      data,

    );
  }

  getUserLogs(params: any) {
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-all-logs-by-userId`,
      {
        params,

      }
    );
  }

  getTotalCounts(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/order/totalorder`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getAllClaimRevenue(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/claim/get-pharmacy-claim-revenue`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getTotalCopayment(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/order/total-copayment-for-revenue`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getdashboardLineGraph(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/order/dashboardLineGraph-montlyCount`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getpaymentHistory(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/order/order-payment-history`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
}
