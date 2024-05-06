import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { identity, Observable, throwError, of } from "rxjs";
import { AuthService } from "src/app/shared/auth.service";
import { environment } from "src/environments/environment";
import {
  ISendEmailRequest,
  ISendOtpResponse,
} from "./super-admin-entercode/super-admin-entercode.type";
import { IResponse } from "src/app/shared/classes/api-response";
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "../../core/services/api-http.service";
import { catchError, map } from "rxjs/operators";
import { CoreService } from "src/app/shared/core.service";

@Injectable()
export class SuperAdminService {
  param: any;
  private superAdminURL = "";

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private apiHttpService: ApiHttpService,
    private coreService: CoreService,
    private apiEndpointsService: ApiEndpointsService
  ) {
    this.param = {
      module_name: this.auth.getRole(),
    };
  }

  getHeader(token: any, deviceId: any = "") {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      role: "superadmin",
      Authorization: `Bearer ${token}`,
      uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }

  getHeaderFormdata(token: any) {
    const httpHeaders = new HttpHeaders({
      // "Accept": "application/json",
      // "Content-Type": "multipart/form-data",
      role: "superadmin",
      Authorization: `Bearer ${token}`,
      // "uuid": localStorage.getItem('deviceId')
    });
    return httpHeaders;
  }

  getBasePath() {
    return environment.apiUrl;
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

  addInsSuperAdmin(data: any) {
    return this.http.post(
      this.getBasePath() + `/insurance/insurance-admin-signup`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeMobile(data: any) {
    return this.http.post(
      this.getBasePath() + `/superadmin/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeEmail(data: any) {
    return this.http.post(
      this.getBasePath() + `/superadmin/send-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyMobileOtp(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/superadmin/match-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyEmailOtp(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/match-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  login(data: any) {
    return this.http.post(this.getBasePath() + `/superadmin/login`, data, {
      headers: this.getHeader(""),
    });
  }

  getPendingData(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/get-insurance-admin-not-approved-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getPendingDataforSuperadmin(param: any) {
    console.log("service params")
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-insurance-admin-not-approved-list-superadmin`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  deleteInsurance(data: any) {
    console.log("data=>>>",data)
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/delete-active-insurance-admin`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getApprovedData(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/get-insurance-admin-approved-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getApprovedDataSuperadmin(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-insurance-admin-approved-list-superadmin`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getRejectData(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/get-insurance-admin-rejected-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getRejectDataSuperadmin(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-insurance-admin-rejected-list-superadmin`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getAllHospitalList(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/get-hospital-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getInsuranceAdminDetails(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/get-insurance-details`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getTemplate() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/get-insurance-template-list`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getCardPreviewTemplate() {
    console.log("hitttttttttttt");
    
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-cardPreview-template`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateInsAdminStatus(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/superadmin/approve-or-reject-insurance-admin`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateInsAdminStatusWithTemp(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/superadmin/set-insurance-template`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPlan(
    page: any,
    limit: any,
    plan_name: any,
    plan_for: any,
    is_activated: any,
    sort:any
  ) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/all-subscription-plans?limit=${limit}&page=${page}&is_deleted=false&is_activated=${is_activated}&plan_name=${plan_name}&plan_for=${plan_for}&sort=${sort}`,
      { headers: this.getHeader(token) }
    );
  }

  addPlan(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/create-subscription-plan`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updatePlan(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/update-subscription-plan`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  deletePlan(_id: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/delete-subscription-plan`,
      { _id },
      { headers: this.getHeader(token) }
    );
  }

  getPlanFor(plan_for: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-service-field?plan_for=${plan_for}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPeriodicList() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-periodic-list`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPlanDetails() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-subscription-plan-details?id=638873c402d1d878c99c5a0b`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //...........forgotPassword.............
  forgotPassword(body: any) {
    console.log(body);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/forgot-password`,
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
      this.getBasePath() + `/superadmin/reset-forgot-password`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //......AddMEDICINE.......
  addMedicine(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/add-medicine`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //..........MedicineList......
  getmedicineList(page: any, limit: any, userId: string, searchText: string,sort='') {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/list-medicine?limit=${limit}&page=${page}&userId=${userId}&searchText=${searchText}&sort=${sort}`,
      { headers: this.getHeader(token) }
    );
  }

  listMedicineforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/list-medicine-export?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //... upload excel medicine
  public uploadExcelMedicine(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/upload-csv-for-medicine`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }

  //...update medicine

  public updateMedicine(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/edit-medicine`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //--------Delete Medicine---------
  public deleteMedicine(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/delete-medicine`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //----Association Group API's--------------

  listPharmacy(searchKey: any = "") {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/pharmacy/get-all-pharmacy?searchKey=${searchKey}`,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }


  getPharamacyAcceptedListPatient(insuranceId: any = "") {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/claim/getPharamacyAcceptedListPatient?insuranceId=${insuranceId}`,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  listHospital(searchKey: any = "") {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-hospital?searchKey=${searchKey}`,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  addAssociationGroup(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/create-association-group`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }
  addmanualMedicinClaim(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/addmanualMedicinClaim`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }
  getviewofmanualmedicinClaim(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/getviewofmanualmedicinClaim?id=${id}`,
      { headers: this.getHeader(token) }
    );
  }

  listAssociationGroup(page: any, limit: any, searchKey: any = "",sort:any='') {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/superadmin/list-association-group?page=${page}&limit=${limit}&searchKey=${searchKey}&sort=${sort}`,
      { headers: this.getHeader(token) }
    );
  }

  viewAssociationGroup(groupID: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/superadmin/view-association-group?groupID=${groupID}`,
      { headers: this.getHeader(token) }
    );
  }

  updateAsscociationGroup(formData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/edit-association-group`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }

  editPharmacyForAssociationGroup(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/edit-pharmacy-association-group`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  deleteAssociationGeroup(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/delete-active-lock-association-group`,
      data,
      { headers: this.getHeader(token) }
    );
  }
  deletemanualmedicinClaim(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/deletemanualmedicinClaim`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  pharmacyList(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/pharmacy/list-pharmacy-admin-user`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  addMaximumReq(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/set-maximum-request`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  public getPharmacyDetails(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/pharmacy-admin-details`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  public approveRejectPharmacy(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/approve-or-reject-pharmacy`,
      data,
      {
        headers: this.getHeader(token),
      }
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

  listCategoryServices(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/list-category-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listExclusionDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/list-exclusion-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  saveAssignPlanInsurance(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/insurance-assign-plan`,
      data,
      {
        headers: this.getHeader(token),
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

  // getTotalClaims(data: any) {
  //   let token = this.auth.getToken();
  //   return this.http.post(this.getBasePath() + `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-association-group`, data,
  //   {
  //     headers: this.getHeader(token),
  //   }
  //   );
  // }

  //...............allRole..................
  allRole(userId: string) {
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

  //.............AddStaff............
  addStaff(formData: any) {
    console.log(formData);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/add-staff`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  getAllStaff(paramsData: any) {
    // console.log(params, 'params');
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/superadmin/list-staff`, {
      params: paramsData,
      headers: this.getHeaderFormdata(token),
      // headers: this.getHeader(token),
    });
  }

  getAllStaffforChat(paramsData: any) {
    // console.log(params, 'params');
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/superadmin/list-staff-forchat`, {
      params: paramsData,
      headers: this.getHeaderFormdata(token),
      // headers: this.getHeader(token),
    });
  }

  getStaffDetails(staffID: any) {
    console.log("staffIDService",staffID);
    
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/view-staff-details?userId=${staffID}`,
      { headers: this.getHeader(token) }
    );
  }

  //...................editStaff.................

  editStaff(formData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/edit-staff`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }

  deleteActiveAndLockStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/superadmin/delete-active-lock-staff`,
      data,
      { headers: this.getHeader(token) }
    );
  }

  getTotalClaims(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-association-group`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  gettAllStaffListing(paramsData: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/superadmin/get-all-staff`, {
      params: paramsData,
      headers: this.getHeader(token),
      // headers: this.getHeader(token),
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

  addSubmenusInfo(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/menu/add-submenu-permission`,
      data,
      { params: { module_name: "superadmin" }, headers: this.getHeader(token) }
    );
  }
  getUserMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-user-menu`, {
      params,
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
  submenudatabyuser(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/get-submenu-by-user`, {
      params,
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

  //super-admin-speciality

  addSpeciality(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/speciality/add`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listSpeciality(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/speciality/speciality-list?limit=${reqData.limit}&page=${reqData.page}&searchText=${reqData.searchText}&sort=${reqData.sort}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  listSpecialitypatient(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/speciality/speciality-list?limit=${reqData.limit}&page=${reqData.page}&searchText=${reqData.searchText}`,

      {
        headers: this.getHeader(token),
      }
    );
  }


  allSpecialtyListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/export-speciality?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateSpeciality(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/speciality/update`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteSpeciality(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/speciality/action`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadSpecialityApi(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-csv-for-specialty`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  // master-eyeglassess
  addEyeglassessApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-eyeglass-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listEyeglassessApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    // let token = this.auth.getToken());

    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/list-eyeglass-master?page=${reqData.page}&limit=${reqData.limit}&searchText=${reqData.searchText}&sort=${reqData.sort}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  listEyeglassMasterforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/eyeglasses-list-export?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateEyeglassessApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-eyeglass-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteEyeglassessApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/active-delete-eyeglass-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelEyeGlasses(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-csv-for-eyeglass-master`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  // master-Others
  addOthersApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-others-test-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listOthersApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/others-test-master-list?searchText=${reqData.searchText}&limit=${reqData.limit}&page=${reqData.page}&sort=${reqData.sort}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  othersTestTestMasterListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/otherstest-list-export?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateOthersApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/others-test-master-edit`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteOthersApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/others-test-master-action`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelOthers(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-csv-for-others-test`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  otherInfoDetailsApi(otherID: any) {
    console.log("otherId==========>", otherID);
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/others-test-master-details?otherTestId=${otherID}`,
      { headers: this.getHeader(token) }
    );
  }

  // master-Vaccination
  addVaccinationApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-vaccination-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listVaccinationApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/vaccination-master-list?searchText=${reqData.searchText}&limit=${reqData.limit}&page=${reqData.page}&sort=${reqData.sort}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  vaccinationTestMasterListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/vaccination-master-list-export?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateVaccinationApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/vaccination-master-edit`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteVaccinationApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/vaccination-master-action`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelVaccination(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-csv-for-vaccination-test`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  // master-HealthcareNetwork
  addHealthcareNetworkApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/add-healthcare-network`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listHealthcareNetworkApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/healthcare-network-list?searchText=${reqData.searchText}&insuranceId=${reqData.insuranceId}&providerType=${reqData.providerType}&limit=${reqData.limit}&page=${reqData.page}&sort=${reqData.sort}`,

      {
        headers: this.getHeader(token),
      }
    );
  }


  listHealthcareNetworkforexport(for_portal_user: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/export-healthcare-network-list?for_portal_user=${for_portal_user}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateHealthcareNetworkApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/edit-healthcare-network`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteHealthcareNetworkApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/delete-healthcare-network`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelHealthcareNetwork(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/import-healthcare-network`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  // master-Imaging
  addImagingApi(data: any) {
    console.log("data=======>", data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-imaging-test-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listImagingApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-master-list?searchText=${reqData.searchText}&limit=${reqData.limit}&page=${reqData.page}&sort=${reqData.sort}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  imagingTestMasterListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-master-list-export?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  updateImagingApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-master-edit`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteImagingApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-master-action`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelImaging(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-csv-for-imaging-test`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  otherImagingDetailsApi(imagingID: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-master-details?imagingTestId=${imagingID}`,
      { headers: this.getHeader(token) }
    );
  }

  // labtest
  labAddTest(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-lab-test-master`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getLabListData(page: any, limit: any, searchText: string,sort:string='') {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/lab-test-master-list?searchText=${searchText}&limit=${limit}&page=${page}&sort=${sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  getLabListDataexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/lab-test-master-list-export?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  updateLabAddTest(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/lab-test-master-edit`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteLabs(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/lab-test-master-action`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getLabDataId(labTestId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/lab-test-master-details?labTestId=${labTestId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  //... upload excel lab
  public uploadExcelLab(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/upload-csv-for-lab-test`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }

  public getAddMaximumReq(userId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-maximum-request?userId=${userId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // content-mangement
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

  addContactusApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-contact-us-en`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addContactusApiFr(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-contact-us-fr`,
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
  getInsurancePlanDetailsbysubscriber(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/get-plan-service-by-subscriber`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  // Added by tanay portaltypecategory component 
  getplanserviceneByForUser(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-planserviceneByForUser?for_user=${id}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  portaltypeandinsuranceId(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/add-portaltypeandinsuranceId`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getportaltypeandinsuranceId(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-portaltypeandinsuranceId?insuranceId=${data.insuranceId}&portalType=${data.portalType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }





  medicineClaimDetails(claimId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`
    );
  }
  // aboutus
  getAboutUsfr() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-about-us-fr`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getAboutUsen() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-about-us-en`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editAboutusEn(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-about-us-en`,
      formData,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editAboutusFr(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-about-us-fr`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
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
  // privacyAndcondition
  getlistpNcEn() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-privacy-condition-en`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getlistpNcFr() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-privacy-condition-fr`,
      {
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

  editpNcEn(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-privacy-condition-en`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editpNcFr(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-privacy-condition-fr`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  // termsAndConditiom
  getlistTNCEn() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-terms-condition-en`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getlistTNCFr() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/get-terms-condition-fr`,
      {
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
  editTNCEn(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-terms-condition-en`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editTNCFr(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-terms-condition-fr`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  // videoEditor
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
  addVideoApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/add-video`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editVideoApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/edit-video`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteVideoApi(videoId: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/delete-video`,
      videoId,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // blog
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
  addBlogApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/add-blog`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editBlogApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/edit-blog`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteBlogApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/delete-blog`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimList(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}&fromdate=${data.fromdate}&todate=${data.todate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // article
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
  addArticleApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/content-management/add-article`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editArticleApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/edit-article`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteArticleApi(articleId: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/content-management/delete-article`,
      articleId,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addOndutyGroupPhar(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/add-on-duty-group`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadBulkCsvDutyGroup(formdata: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/upload-on-duty-group-csv`,
      formdata,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  listDutyGroup(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/list-on-duty-group`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getOnDutyGroupDetails(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-on-duty-group`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  deleteGroup(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/delete-on-duty-group`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteOnDutyGroupMasterAction(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/deleteOnDutyGroupMasterAction`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addPharmacyInOnDuty(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/add-pharmacy-on-duty-group`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadBulkCsvPharmacyDutyGroup(formdata: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/upload-on-duty-pharmcy-group-csv`,
      formdata,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  listHospitalBySuperadmin(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/list-hospital-added-by-superadmin`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  listOnDutyPharmacy(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/list-pharmacy-on-duty-group`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getOnDutyPhmarmacyDetails(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/details-pharmacy-on-duty-group`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  editPharmacyInOnDuty(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/edit-pharmacy-on-duty-group`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getMedicinesById(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-all-medicine-byits-id`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //hospital
  getHealthCenterTypes() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-health-center-types`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  addHospitalBySuperadmin(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-hospital`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadBulkCsvHospital(formdata: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-hospital-bulk-csv`,
      formdata,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  getHospitalDetails(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-hospital-details-by-superadmin`,

      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  editHospitalBySuperadmin(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/edit-hospital-by-superadmin`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteHospitalBySuperadmin(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/delete-hospital-by-superadmin`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  deleteHospitalMasterAction(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/deleteHospitalMasterAction`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //Appointment Commision Management

  getAppointmentCommissions(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-appointment-commission`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  saveCommission(data) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/add-or-update-appointment-commission`,
      data,
      {
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

  // complaint
  addComplaint(data) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/complaint-management/add-complaint-management`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }



  getComplaintList(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/complaint-management/all-complaint-management`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getUserComplaint(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/complaint-management/allDetails-complaint-management`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  updateComplaintResponse(data) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/complaint-management/add-response`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getallplanPriceforSuperAdmin(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/getallplanPriceforSuperAdmin`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  gettotalMonthWiseforSuperAdmingraph(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/gettotalMonthWiseforSuperAdmingraph`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  addRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/role/add-role`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }


  deleteRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/role/delete-role`, data, {
      params: {
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  updateRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/role/update-role`, data, {
      params: {
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  allRoleSuperAdmin(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-superadmin/role/all-role`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getAllMessagesService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/all-message`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getRoomlistService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-create-chat`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }



  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-all-notification`,

      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  getlistofmanualmedicinClaim(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/getlistofmanualmedicinClaim`,


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
      `/healthcare-crm-superadmin/superadmin/update-notification`,
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
    return this.http.put(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/mark-all-read-notification`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/mark-read-notification-id`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearAllMessages(data: any) {
    let token = this.auth.getToken();
    // console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/clear-all-messages`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearSingleMessages(data: any) {
    let token = this.auth.getToken();
    // console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/clear-single-message`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadFile(formData: any) {
    return this.http.post(
      this.getBasePath() + `/superadmin/upload-document`,
      formData
    );
  }
  // }

  // addMemberToExistingGroup(data:any){
  //     // console.log(data,"ddddddddddddddddd")
  //     let token = this.auth.getToken();
  //     console.log("token",token)
  //     return this.http.put(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/addMembers-to-GroupChat`,data,
  //       {  
  //         headers: this.getHeader(token),
  //       }
  //     );
  // }

  //--------User Invitation--------------
  invitationList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-email-invitation-list`,
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
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-email-invitation-id`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  inviteUser(data: any) {
    console.log("data======?", data)
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/send-email-invitation`, data, {
      headers: this.getHeader(token),
    });
    // return of({
    //   response: { status: true, message: "Invitation Sent", ...data },
    // });
  }

  deleteInvitation(data: any) {
    // return of({ status: true, message: "Succesfully delete invitation" });
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/superadmin/delete-email-invitation`, data,
      {
        headers: this.getHeader(token)
      }
    );
  }

  getallPaymentHistory(params) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/getallPaymentHistory`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }


  addCountry(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-country`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }

  CoutryLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-country`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  updateCountryApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/edit-country`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  deleteCountryApi(data: any) {
    console.log("data---------------------",data);
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/delete-country`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  countryexcelListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-country?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  uploadExcelCountryList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-country-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  Country_dropdownLists() {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-dropdowncountries`,
      {
       
        headers: this.getHeader(token),
      }
    );
  }
  addRegion(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-region`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }


  RegionLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-region`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }


  deleteRegionApi(data: any) {
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/delete-region`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  regionexcelListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-region?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  uploadExcelRegionList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-region-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  updateRegionApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/edit-region`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }



  addProvince(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-province`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }


  ProvinceLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-province`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }



  deleteProvinceApi(data: any) {
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/delete-province`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  updateProvinceApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/edit-province`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  provinceexcelListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-province?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelProvinceList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-province-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  addDepartment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-department`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }


  DepartmentLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-department`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }


  deleteDepartmentApi(data: any) {
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/delete-department`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  updateDepartmentApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/edit-department`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  departmentexcelListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-department?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelDepartmentList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-department-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  addCity(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-city`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }


  CityMasterLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-city`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  CityMasteresLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-city`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
  deleteCityApi(data: any) {
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/delete-city`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  cityexcelListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-city?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelCityList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-city-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  updateCityApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/edit-city`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  addVillage(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-village`, data, {
      params: this.param,
      headers: this.getHeader(token),
    });
  }
  VillageMasterLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-village`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
  deleteVillageApi(data: any) {
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/delete-village`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  updateVillageApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/edit-village`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  villageexcelListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-village?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelVillageList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-village-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }


  // addTeam(data: any) {
  //   let token = this.auth.getToken();
  //   return this.http.post(
  //     this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-team`,
  //     data,
  //     {
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }
  // TeamLists(paramData: any) {
  //   // return of({ status: true });
  //   let token = this.auth.getToken();
  //   return this.http.get(
  //     this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-team`,
  //     {
  //       params: paramData,
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }
  // updateTeamApi(data: any) {
  //   let token = this.auth.getToken();
  //   return this.http.put(
  //     this.getBasePath() + `/healthcare-crm-superadmin/common-api/update-team`,
  //     data,
  //     {
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }
  // deleteTeam(data: any) {
  //   let token = this.auth.getToken();
  //   return this.http.post(
  //     this.getBasePath() + `/healthcare-crm-superadmin/common-api/delete-team`,
  //     data,
  //     {
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }

  // allTeamListforexport(page: any, limit: any, searchText: string) {
  //   let token = this.auth.getToken();
  //   return this.http.get(
  //     this.getBasePath() +
  //     `/healthcare-crm-superadmin/common-api/exportsheetlist-team?searchText=${searchText}&limit=${limit}&page=${page}`,
  //     {
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }

  // uploadExcelTeamList(formData: any) {
  //   let token = this.auth.getToken();
  //   return this.http.post(
  //     this.getBasePath() +
  //     `/healthcare-crm-superadmin/common-api/upload-csv-for-team-list`,
  //     formData,
  //     {
  //       headers: this.getHeaderFormdata(token),
  //     }
  //   );
  // }
  addDesignation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-designation`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  DesignationLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-designation`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
  updateDesignatonApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/update-designation`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteDesignation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/delete-designation`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  allDesignationListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-designation?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelDesignationList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-designation-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }

  addTitle(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-title`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
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
  updateTitleApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/update-title`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteTitle(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/delete-title`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  allTitleListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-title?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelTitleList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-title-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }
  addHealthCentre(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/add-healthcentre`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  HealthCentreLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/list-healthcentre`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
  updateHealthCentreApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/update-healthcentre`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteHealthCentre(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/delete-healthcentre`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


 

  allHealthCentreListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/exportsheetlist-healthcentre?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelHealthCentreList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/upload-csv-for-healthcentre-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }



  addLanguage(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/add-language`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  LanguageLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/list-language`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
  updateLanguageApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/update-language`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteLanguage(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/delete-language`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  allLanguageListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/exportsheetlist-language?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  uploadExcelLanguageList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/upload-csv-for-language-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }



  addImmunization(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/add-immunization`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  ImmunizationLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/list-immunizationlist`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }


  updateImmunizationApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-patient/patient/update-immunization`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  deleteImmunization(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/delete-immunizationstatus`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  allImmunizationListforexport(page: any, limit: any, searchText: string) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/exportsheetlist-immunization?searchText=${searchText}&limit=${limit}&page=${page}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  uploadExcelImmunizationList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/upload-csv-for-immunization-list`,
      formData,
      {
        headers: this.getHeaderFormdata(token),
      }
    );
  }



  getByIdDesignation(_id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/getById-designation?_id=${_id}`,
    
      {
        headers: this.getHeader(token),
      }
    );
  }


  getByIdTitle(_id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/common-api/getById-title?_id=${_id}`,
    
      {
        headers: this.getHeader(token),
      }
    );
  }

  // getByIdTeam(_id: any) {
  //   let token = this.auth.getToken();
  //   return this.http.get(
  //     this.getBasePath() + `/healthcare-crm-superadmin/common-api/getById-team?_id=${_id}`,
    
  //     {
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }


  changePassword(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/change-password`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addNotification(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/add-notification`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getNotificationlist(params:any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-all-notification-list`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  notificationListById(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-notification-by-id`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  deleteNotification(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/delete-notification`,
      data,
      {
        headers: this.getHeader(token)
      }
    );
  }

  getInsuranceforSuperadminDashboard() {
    console.log("service params")
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-insurance-count-superadmin-dashboard`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPharmacyforSuperadminDashboard() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/get-pharmacy-count-superadmin-dashboard`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getHospitalforSuperadminDashboard() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-hospital-count-superadmin-dashboard`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getIndiDoctorforSuperadminDashboard() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-individualdoctor-count-superadmin-dashboard`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getConsultationDashboard() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-consultation-count`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getClaimforSuperadminDashboard(params:any) {
    console.log("service params")
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-claim-count-superadmin-dashboard`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }


  updateLogs(data: any) {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/update-logs`,
      data,
     
    );
  }
  
  getUserLogs(params: any) {
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-all-logs-by-userId`,
      {
        params,
       
      }
    );
  }
}


