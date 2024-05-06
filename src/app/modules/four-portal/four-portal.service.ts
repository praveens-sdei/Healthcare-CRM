import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class FourPortalService {
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
      role: "labimagingdentaloptical",
      Authorization: `Bearer ${token}`,
      uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }

  getHeaderFileUpload(token: any) {
    const httpHeaders = new HttpHeaders({
      // "Content-Type": "application/json",
      role: "labimagingdentaloptical",
      Authorization: `Bearer ${token}`,
      // uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }
  getHeaderFormData(token: any) {
    const httpHeaders = new HttpHeaders({
      // "Content-Type": "application/json",
      role: "hospital",
      Authorization: `Bearer ${token}`,
      // "uuid": localStorage.getItem('deviceId')
    });
    return httpHeaders;
  }
  getBasePath() {
    return environment.apiUrl;
  }


  fourPortalSignup(data: any) {
    let token = this.auth.getToken();
    console.log(data, "data");
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/sign-up`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortalLogin(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/login`,
      data,
      {
        headers: this.getHeader("asdasd"),
      }
    );
  }

  sendOtpSMS(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }


  listCategoryStaff(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/listCategoryStaff?pharmacyId=${param.pharmacyId}&staffRoleId=${param.staffRoleId}`,
      {
        // params: param,
        headers: this.getHeader(token),
      }
    );
  }


  all_role(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/all-role`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  sendOtpEmail(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/send-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyOtpSMS(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/match-otp-SMS-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyEmailOtp(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/match-Otp-Email-For-2-fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/forgot-password`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  resetPassword(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/reset-password`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  createProfile(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/fourPortal-create-profile`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addManualTestss(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/add-manuall-tests`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  editTests(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/edit-manual-tests`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  getProfileDetailsById(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/fourPortal-view-profile?portal_user_id=${data.portal_user_id}&type=${data.type}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getLocationDetailsById(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-location-by-id?portal_user_id=${data.portal_user_id}&type=${data.type}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadFileForPortal(formData: FormData) {
    console.log("insideee__________");

    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/upload-document-for-four-portal`,
      formData,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }

  educationalDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-educational-details`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  locationDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-hospital-location`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortalAvailability(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-availability`,
      data,
      {
        headers: this.getHeader(token),
      }
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

  feeManagement(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-fee-management`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  documentManage(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-document-management`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteAvailabiltiesOnDeletingLocation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/delete-availabilty-by-deleting-location`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  //--------User Invitation--------------
  invitationList(paramData: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-email-invitation-list`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  invitationListById(paramData: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-email-invitation-id`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  inviteUser(data: any) {
    console.log("data======?", data)
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/send-email-invitation`, data, {
      headers: this.getHeader(token),
    });
  }


  changePassword(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/change-password`,
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
      `/healthcare-crm-labimagingdentaloptical/payment/four-portal-is-plan-purchased`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  async isPlanPurchesdByfourPortal(user_id: any, portal_type: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let reqData = {
        user_id,
        portal_type
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


  getPurchasedPlanOfUser(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/payment/subscription-purchased-plan`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }



  getSubscriptionPlan(parameter: any) {
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
    return this.http.post('https://api-checkout.cinetpay.com/v2/payment', data, { headers: this.getHeader("") });
  }

  getSubscriptionPlanDetails(parameter: any) {
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


  addAppointmentReason(data: any) {
    console.log(data, "dataa_Servicee_____");

    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-appointmentReasons`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  listAppointmentReason(params: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-getAppointmentReasons`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateAppointmentReason(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-updateAppointmentReasons`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteAppointmentReason(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-updateAppointmentReasonsStatus`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelAppointmentReason(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-bulkImportAppointmentReasons`,
      data,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }

  addQuestionnaire(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-addQuestionnaire`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  questiinnaireList(params: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-getQuestionnaires`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getQuestionnaireDetails(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-getQuestionnaireDetail`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateQuestionnaire(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-updateQuestionnaire`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteQuestionnaire(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-deleteQuestionnaire`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  serachFilterForFourPortals(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-advFilters`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortalDetails(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-detail`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  portalAvailableSlot(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-available-slots`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortalReviweandRating(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-addReviews`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPortalReviweAndRating(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-getReviews`,
      {
        params: param,
        // headers: this.getHeader(token),
      }
    );
  }

  deleteRatingAndReview(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/delete-review-and-rating-fourportal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllSubMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-submenus`, {
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


  getAllMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-menus`, {
      params,
      headers: this.getHeader(token),
    });
  }

  addSubmenusInfo(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/menu/add-submenu-permission`,
      data,
      { params: { module_name: "labimagingdentaloptical" }, headers: this.getHeader(token) }
    );
  }

  addRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/add-role`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllRoles(params: any) {
    console.log("params=====", params);

    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/all-role`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/update-role`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/delete-role`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  addStaff(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/add-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/edit-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllStaff(paramsData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-staff`,
      {
        params: paramsData,
        headers: this.getHeader(token),
      }
    );
  }

  getAllStaffWithoutPagination(paramsData: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-staff-without-pagination`,
      {
        params: paramsData,
        headers: this.getHeader(token),
      }
    );
  }

  getStaffDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-staff-details`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  deleteActiveAndLockStaff(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/delete-active-and-lock-staff`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deletePathologyTest(data: any) {

    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/delete-fourportal-pathology-tests`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // templateBuilder
  addtemplateBuilder(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/add-template`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  gettemplateBuilderListApi(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/template-list`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  editTemplateBuilder(templateId: any, type: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/template-details?templateId=${templateId}&type=${type}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteTemplateBuilder(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/template-delete`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // Chat
  getAllFourPortalChatUser(paramData: any) {
    let token = this.auth.getToken();
    console.log(paramData, "paramData")
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-chat-user`,
      {
        params: paramData,
        headers: this.getHeader(token)
      }
    );
  }

  getAllMessagesService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/all-message`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getRoomlistService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-create-chat`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-notification`,

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
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/update-notification`,
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
    return this.http.put(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/mark-all-read-notification`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    // console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    // console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/mark-read-notification-id`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearAllMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/clear-all-messages`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  clearSingleMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/clear-single-message`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateOrderDetailsallPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-update-order-details`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // Patient Management
  getPatientListAddedByFourPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/get-all-patient-added-by-doctor?doctorId=${data.doctorId}&limit=${data.limit}&page=${data.page}&searchText=${data.searchText}&sort=${data.sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  verifyInsuaranceallPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-verify-insurance-for-order`, data,

      {

        headers: this.getHeader(token),
      }
    );
  }

  addPatientByFourPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/patient-add-by-doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  activeAndLockPatient(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/patient-action`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  cancelOrderFourPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-cancel-order`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  confirmOrderFourPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-confirm-order`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  scheduleConfirmOrderFourPortal(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-update-schedule-order`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_appointment_list(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-list-Appointment`,

      {
        params: params,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_cancel_approved_appointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-cancel-and-approve-appointment`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_appointment_deatils(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal_appointment-details`,

      {
        params: params,
        headers: this.getHeader(token),
      }
    );
  }




  fourPortal_assignedStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-assign-healthcare-provider`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_paymentReceived(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-consulatation-data`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  getPastAppointOfPatient(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/appointmentList_for_patient`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  getTotalTests(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal_totalTests_allAppTypes`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortalappointmentRevenuesCount(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-appointment-revenues-count`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_nextAvaiable_slot(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-next-available-slot`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getfourPortalTotalRevenueMonthwiseOnline(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-totalRevenue-monthwise-online`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getfourPortalTotalRevenueMonthwiseF2F(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-totalRevenue-monthwise-f2f`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getRevenueForAlltypeAppointment(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-totalRevenue-all-appointment-type`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getTotalTestsForLineChart(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal_totalTests_ForLineChart`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getTestsTotalClaimsForGraph(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal_totalClaims_ForGraph`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_reschedule_Appointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-reschedule-appointment`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_setReminder_Appointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-set-reminder`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_getReminder_Appointment(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-reminder`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_AddEditAssesment_Appointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-and-edit-assessment`,
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
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/update-notification-status`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_orderflowPdf(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-save-pdf-data`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_listAssesment_Appointment(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-assessment-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_get_ePrescription(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_RecentMedicine_prescribed(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-recent-medicine-prescribed`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_getMedicineDose_prescribed(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-medicine`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_addMedicineDose(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-medicine`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_delete_MedicineDose(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-delete-eprescription-medicine`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_create_eprescription(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-create-eprescription`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_get_all_testEprescription(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-all-tests-eprescription`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_getlocationbyid(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-LocationInfo-ById`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_addEprescriptionSignature(formdata: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-esignature`,
      formdata,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }


  fourPortal_listAllePrescription(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-list-all-eprescription`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_getEprescriptionLabTest(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-labTest`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_getEprescriptionImaging(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-imaging`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_getEprescriptionVaccination(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-vaccination`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_getEprescriptionOthers(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-others`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_getEprescriptionEyeglasses(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-eyeglasses`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_addLABTest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-lab`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_addImaging(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-imaging`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_addVaccination(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-vaccination`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_addEyeglass(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-eyeglasses`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_addOthers(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-add-eprescription-others`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  fourPortal_sendMailToPatient(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-send-Mail-TO-Patient`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  fourPortal_fetchRoomcall(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-fetch-room-call`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  fourPortal_participantDetails(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-participant-details`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getFourPortalasPerlocList(data: any) {
    let token = this.auth.getToken();
    console.log(token);
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-fouportal-as-per-loc?clinic_id=${data.clinic_id}&type=${data.type}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateLogs(data: any) {

    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/update-logs`,
      data,
      {

      }
    );
  }

  getUserLogs(params: any) {

    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-logs-by-userId`,
      {
        params,

      }
    );
  }

  patientPaymentHistoryToFourPortal(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-payment-history`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  uploadDocumentProvider(formData: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/addProviderDocuments`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    )
  }

  getPortaldocumentList(param: any) {
    console.log(param, "param");

    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/getProviderDocumentslist`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  statusUpdateProviderDoc(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/updatestatusDocuments`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }

  getProviderDoc(param: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/getProviderDocuments`,
      {
        params: param,
        headers: this.getHeader(token),

      }
    );
  }

  addleaves(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/addfourPortalleave`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getStaffLeaveListinStaffPortal(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getLeavelistforstaffportal`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  getallStaffLeavesInfourPortals(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getallStaffleavesInfourportal`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }


  leaveAccepts(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/fourportalstaffleaveaccept`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }
  leaveRejects(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/fourportalstaffleavereject`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }
  addHospitalIds(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/leave/hospitalIds`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  myLeaveListforFourportal(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getAllMyLeaveFourPortal`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  fourPortalRatingBySuperAdmin(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-reviews-rating-superadmin`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }
}






