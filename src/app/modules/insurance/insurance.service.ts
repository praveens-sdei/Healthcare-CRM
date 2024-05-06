import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InsuranceService {
  param: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private _coreService: CoreService
  ) {
    this.param = {
      module_name: this.auth.getRole(),
    };
  }



  getHeader(token: any) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      role: "insurance",
      Authorization: `Bearer ${token}`,
      uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }

  addcardFields(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-card`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getCardTemplates() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-cardPreview-template`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getCardFields(companyId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-card-fields?companyId=${companyId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getcategoryServForCard(companyId: any) {

    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-CategoryServiceFor-card?companyId=${companyId}`,
      {
        headers: this.getHeader(token),
      }
    );
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

  getPlanBasePath() {
    return environment.insuranceURL;
  }

  addInsSuperAdmin(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/insurance/insurance-admin-signup`,
      data,
      {
        headers: this.getHeader("asdasd"),
      }
    );
  }

  getVerificationCode(data: any) {
    return this.http.post(
      this.getBasePath() + `/insurance/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader("asdasd"),
      }
    );
  }

  verifyOtp(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/insurance/match-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeMobile(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeEmail(data: any) {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/send-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyMobileOtp(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/match-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyEmailOtp(data: any): Observable<any> {
    return this.http.post(this.getBasePath() + `/healthcare-crm-insurance/insurance/match-email-otp-for-2fa`, data, {
      headers: this.getHeader('')
    });
  }

  login(data: any, uuid: any = "") {
    return this.http.post(
      this.getBasePath() + `/insurance/insurance-admin-login`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  updateCreateProfile(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/insurance/edit-insurance-profile`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadFile(formData: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/upload-document`,
      formData
    );
  }

  getProfileDetails(paramData: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-insurance-details`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
  // updatesuperadminpermission(paramData: any) {
  //   let token = this.auth.getToken();
  //   return this.http.put(
  //     this.getBasePath() + `/healthcare-crm-insurance/insurance/updatesuperadminpermission`,

  //     {
  //       params: paramData,
  //       headers: this.getHeader(token),
  //     }
  //   );
  // }
  updatesuperadminpermission(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/updatesuperadminpermission`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
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

  addRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/role/add-role`, data, {
      params: {
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  allRole(userId: string) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/role/all-role`, {
      params: {
        userId,
        module_name: this.auth.getRole(),
      },
      headers: this.getHeader(token),
    });
  }

  allRoles(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/role/all-role`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }


  /* super admin get role on behalf of insurance company */

  allRoleInsurance(userId: string) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/role/all-role`, {
      params: {
        userId,
        module_name: "insurance",
      },
      headers: this.getHeader(token),
    });
  }
  /* super admin get role on behalf of insurance company end*/

  //...........forgotpassword........
  forgotPassword(body: any) {
    console.log(body);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/insurance/forgot-password`,
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
      this.getBasePath() + `/insurance/reset-forgot-password`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addStaff(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/insurance/add-staff`,
      formData,
      {
        // headers: this.getHeader(token)
      }
    );
  }

  editStaff(formData: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/insurance/edit-staff`,
      formData,
      {
        // headers: this.getHeader(token)
      }
    );
  }

  getAllInsuranceStaff(userID: string) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/insurance/get-all-staff`, {
      params: { for_user: userID },
      headers: this.getHeader(token),
    });
  }

  getStaffDetails(staffID: string) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/insurance/get-staff-details`, {
      params: { staff_id: staffID },
      headers: this.getHeader(token),
    });
  }

  getAllStaff(paramsData: any) {
    // console.log(params, 'params');
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/insurance/get-all-insurance-staff`,
      {
        params: paramsData,
        headers: this.getHeader(token),
      }
    );
  }

  getAllStafforStaffmanagement(paramsData: any) {
    // console.log(params, 'params');
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-all-insurance-staff-for-staffmanagement`,
      {
        params: paramsData,
        headers: this.getHeader(token),
      }
    );
  }

  getAllStaffWithoutPageLimit(data: any) {
    console.log("DATA=========================>", data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/medicine-claim-next-insurance-staff-list`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  deleteActiveAndLockStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/insurance/delete-active-and-lock-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getLastClaimRole(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/claim/get-last-claim-process-role`, {
      params,
      headers: this.getHeader(token),
    });
  }

  // Handle Roles and permissions for Staff
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

  getInsuranceSubscriptionPlan(parameter: any) {
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

  getcinetpaylink(data: any) {
    // return this.http.post('https://api-checkout.cinetpay.com/v2/payment', data,{  headers: this.getHeader("")});
    return this.http.post('https://api-checkout.cinetpay.com/v2/payment', data, { headers: this.getHeader("") });

  }

  getInsuranceSubscriptionPlanDetails(parameter: any) {
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

  getPurchasedPlanOfUser(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/payment/subscription-purchased-plan`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  listPlan(data: any) {
    let token = this.auth.getToken();
    console.log(data, "KKKKKKKKK");

    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/list-plan`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listPlanWithoutPagination(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/list-plan-without-pagination`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPlanById(planId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/plan-details/${planId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  getClaimProcessById(planId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/get-claim-process-byId?_id=${planId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  listPlanServices(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/list-plan-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listPlanExclusions(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/list-plan-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addPlan(data: any) {
    console.log("Plan Data", data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-plan`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updatePlan(data: any) {
    console.log("Plan Update Data", data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/update-plan`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addPlanService(data: any) {
    console.log("Plan service data", data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-plan-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updatePlanService(data: any) {
    console.log("Plan service data", data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/update-plan-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deletePlanService(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/delete-plan-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addPlanExclusion(data: any) {
    console.log("Plan exclusion data", data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-plan-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updatePlanExclusion(data) {
    console.log("Plan exclusion data", data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/update-plan-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deletePlanExclusion(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/delete-plan-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listCategory(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    // let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/list-category`,
      reqData,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listCategoryForInsurance(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/insurance-assign-categories`,
      reqData,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addCategory(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-category`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateCategory(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/update-category`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteCategory(categoryId: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/delete-category`,
      { categoryId },
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

  listCategoryServiceForInsurance(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/insurance-assign-category-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addCategoryServices(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-category-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateCatgeoryService(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/update-category-service`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteCategoryService(serviceId: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/delete-category-service`,
      { serviceId },
      {
        headers: this.getHeader(token),
      }
    );
  }

  listExclusions(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/list-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listExclusionForInsurance(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/insurance-assign-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addExclusion(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateExclusion(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/update-exclusion`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteExclusion(exclusionId: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/delete-exclusion`,
      { exclusionId },
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

  listExclusionDetailsForInsurance(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/insurance-assign-exclusion-data`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addExclusionDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/add-exclusion-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateExclusionDetail(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/update-exclusion-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteExclusionDetail(exclusionDataId: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/delete-exclusion-data`,
      { exclusionDataId },
      {
        headers: this.getHeader(token),
      }
    );
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

  //----------Medicines-----------
  medicineClaimList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-insurance`,
      `/healthcare-crm-insurance/claim/medicine-claim-list-for-insurance`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }


  medicineConsultationListInsurance(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-insurance`,
      `/healthcare-crm-insurance/claim/medicineConsultationListInsurance`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  appointmentClaimListInsuranceAdminAll(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-insurance`,
      `/healthcare-crm-insurance/claim/appointmentClaimListInsuranceAdminAll`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  appointmentClaimListInsuranceAdmin(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-insurance`,
      `/healthcare-crm-insurance/claim/appointmentClaimListInsuranceAdmin`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  hospitalizationClaimListHospitalclaimAllList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-insurance`,
      `/healthcare-crm-insurance/claim/hospitalizationClaimListHospitalclaimAllList`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }


  hospitalizationClaimListHospitalclaimAllListFinalExtension(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list-for-insurance`,
      `/healthcare-crm-insurance/claim/hospitalizationClaimListHospitalclaimAllListFinalExtension`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }



  claimDetails(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-insurance`,
      `/healthcare-crm-insurance/claim/medicine-claim-details-insurance`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  addClaimForInsuranceStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/claim/add-insurance-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  countClaims(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-insurance?insuranceId=${data?.adminId}&insuranceStaffRole=${data?.role}`,
      `/healthcare-crm-insurance/claim/medicine-claim-count-by-status-insurance?insuranceId=${data?.insuranceId}&insuranceStaffRole=${data?.insuranceStaffRole}&insuranceStaffId=${data?.insuranceStaffId}`,

      {
        headers: this.getHeader(token),
      }
    );
  }



  medicineClaimCountByStatusInsuranceDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusInsuranceDoctor?insuranceId=${data?.adminId}&insuranceStaffRole=${data?.role}&insuranceStaffId=${data?.insuranceStaffId}&claimType=${data?.claimType}&requestType=${data?.requestType}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  appointmentClaimStatusInsuranceAllView(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/appointmentClaimStatusInsuranceAllView?insuranceId=${data?.adminId}&insuranceStaffRole=${data?.role}&insuranceStaffId=${data?.insuranceStaffId}&claimType=${data?.claimType}&requestType=${data?.requestType}`,

      {
        headers: this.getHeader(token),
      }
    );
  }


  hospitalizationCountByStatusInsuranceAdmin(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/hospitalizationCountByStatusInsuranceAdmin?insuranceId=${data?.insuranceId}&insuranceStaffRole=${data?.insuranceStaffRole}&insuranceStaffId=${data?.insuranceStaffId}&claimType=${data?.claimType}&requestType=${data?.requestType}`,

      {
        headers: this.getHeader(token),
      }
    );
  }
  approveOrRejectMedicine(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/medicine-approve-or-reject-by-insurance-staff`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  commentOnClaim(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/comment-on-medicine-by-insurance-staff`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  approveOrRejectClaim(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/claim/approval-by-insurance-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  editclaimprocessRole(data: any) {
    console.log("Plan Update Data", data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/claim/edit-claim-claimprocessRole`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  deleteServiceApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/claim/delete-claim-claimprocessRole`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  public uploadExcelMedicine(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/read-file/upload-csv-for-json`,
      formData,
      { headers: this.getHeaderFormdata(token) }
    );
  }

  addSubmenusInfo(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/menu/add-submenu-permission`,
      data,
      { params: { module_name: "insurance" }, headers: this.getHeader(token) }
    );
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

  leaveClaimByStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/leave-medicine-claim-by-insurance-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPatientCobntractPlan(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/view-subscriber`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  getClaimHistory(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/claim/claim-history`,
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

  resubmitClaimByStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/claim-resubmit-by-insurance-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  changePassword(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/change-password`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  checkForPlanPurchased(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/payment/insurance-is-plan-purchased`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  async isPlanPurchesdByInsurance(user_id: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let reqData = {
        user_id,
      };
      this.checkForPlanPurchased(reqData).subscribe(async (res) => {
        let isPlanPurchased = false;
        let response = await this._coreService.decryptObjectData({ data: res });
        if (response.status) {
          isPlanPurchased = response?.isPlanPurchased;
        }
        resolve(isPlanPurchased);
      }, error => {
        reject(error);
      });
    });
  }




  addClaimRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/claim/claim-claimprocessRole`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fetchClaimProcessBy_insuranceId(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/list-claim-claimprocessRole`, {
      params,
      headers: this.getHeader(token),
    }
    );
  }

  getInsuranceChatUser(paramData: any) {
    let token = this.auth.getToken();
    console.log(paramData, "paramData")
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-user-list-for-chat`,

      {
        params: paramData,
        headers: this.getHeader(token),
      }

    );
  }

  getAllMessagesService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance/all-message`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getRoomlistService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance/get-create-chat`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }



  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance/get-all-notification`,

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
      `/healthcare-crm-insurance/insurance/update-notification`,
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
    return this.http.put(this.getBasePath() + `/healthcare-crm-insurance/insurance/mark-all-read-notification`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-insurance/insurance/mark-read-notification-id`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearAllMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-insurance/insurance/clear-all-messages`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearSingleMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-insurance/insurance/clear-single-message`, data,
      {
        headers: this.getHeader(token)
      }
    );
  }

  getSubscriberListDataexport(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/subscriber-list-export-insurance`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getSubscriberListDataexportforSuperadmin(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/subscriber-list-export-insurance-superadmin`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }


  getnotificationdate(data: any) {
    return this.http.get(this.getBasePath() +
      `/healthcare-crm-insurance/insurance/notificationlist`, { params: data, headers: this.getHeader(localStorage.getItem("token")) })
  }


  healthplanDelete(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/healthplanDelete`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateNotification(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/update-notification-status`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getInusranceAdminDataById(data:any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-Inusrance-AdminData-By-Id`,
      {
        params:data,
        headers: this.getHeader(token),
      }
    );
  }

  count_eClaims(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/medicine-claim-count`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }


  polyClaim_dashboard(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/policy_dashboard-count-insurance`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  polyClaim_dashboardMonthCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/get-eClaim-Count-By-Month`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }


  polyClaim_dashboardBarChart(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/get-data-For-Bar-chart`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }


  polyClaim_dashboardClaimtypeList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/get-list-by-claim-Type`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  polyClaim_allMonthwiseclaim(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/get-total-Month-Wise-for-Claim`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }


  insuranceAnalysis_subscriberCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/allSubscriberCountByinsuranceId`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  companyNameById(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-insurance-details-by-portal-id`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  categoryclaimGraph(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-insurance`,
      `/healthcare-crm-insurance/claim/get-medicineclaim-category-graph`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }
  updateLogs(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/update-logs`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  
  getUserLogs(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/get-all-logs-by-userId`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
}
