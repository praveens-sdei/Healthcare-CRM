import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, of } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class IndiviualDoctorService {
  param: any;
  private shareprofiledata = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private _coreService: CoreService
  ) {
    this.param = {
      module_name: this.auth.getRole(),
    };
  }

  setData(data: string) {
    this.shareprofiledata.next(data);
  }

  getData() {
    return this.shareprofiledata.asObservable();
  }

  getHeader(token: any) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      role: "hospital",
      Authorization: `Bearer ${token}`,
      uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }
  getHeaderFileUpload(token: any) {
    const httpHeaders = new HttpHeaders({
      // "Content-Type": "application/json",
      role: "hospital",
      Authorization: `Bearer ${token}`,
      // uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }
  getBasePath() {
    return environment.apiUrl;
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
    let token = this.auth.getToken();
    console.log(data, "data");
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-participant-details?roomName=${data.roomName}&identtity=${data.identity}`,

      {
        headers: this.getHeader(token),
      }
    );
    // let observable = Observable.create(observer => {
    //   let finalResponse = {
    //     participantName: "vikas",
    //     userId: "63e1f567a825766f5c52b0de",
    //     Identity: "544dishfhsdgfds",
    //     image: null,
    //     isAudioMute: false,
    //     isVideoMute: false,
    //   };
    //   let data1={
    //     status: 'Success',
    //     messageID: 200,
    //     message: "FETCH_SUCCESS",
    //     data: finalResponse,
    //   }
    //     observer.next(data1); // This method same as resolve() method from Angular 1
    //     observer.complete();//to show we are done with our processing
    //     // observer.error(new Error("error message"));
    // })

    // return observable
  }
  getPlanBasePath() {
    return environment.insuranceURL;
  }
  getPurchasedPlanOfUser(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/payment/subscription-purchased-plan`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getDoctorSubscriptionPlan(parameter: any) {
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

  viewAppointmentDetailsbyroomname(id: any, token: any, portal_type: any): Observable<any> {
    //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY1MTNjYjg3NzJhNTgzYjM4MDY2NDg1ZSIsImVtYWlsIjoiZGhpcmFqZ3VydmUrc2FtX2RvY0BzbWFydGRhdGFpbmMubmV0Iiwicm9sZSI6IklORElWSURVQUxfRE9DVE9SIiwidXVpZCI6IjRhNDcwMjMyMGZhZjVkNmU0OGE5NGU4NDNlMWNjYzJiIn0sImV4cCI6MTcxMDQzNjM1MywiaWF0IjoxNzEwNDAwMzUzfQ.KHuB51u8LrHK_WwbkALXgNn9c9C3bEjv90uG04J5FMs";
    if (portal_type != "") {
      return this.http.get(
        this.getBasePath() +
        `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptiscal/view-appointment-by-roomname?appointment_id=${id}`,
        {
          headers: this.getHeader(token),
        }
      );
    } else {
      return this.http.get(
        this.getBasePath() +
        `/healthcare-crm-hospital/hospital-doctor/view-appointment-by-roomname?appointment_id=${id}`,
        {
          headers: this.getHeader(token),
        }
      );
    }
  }

  updateUnreadMessage(chatId: any, id: any, token: any, portal_type: any): Observable<any> {
    //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY1MTNjYjg3NzJhNTgzYjM4MDY2NDg1ZSIsImVtYWlsIjoiZGhpcmFqZ3VydmUrc2FtX2RvY0BzbWFydGRhdGFpbmMubmV0Iiwicm9sZSI6IklORElWSURVQUxfRE9DVE9SIiwidXVpZCI6IjRhNDcwMjMyMGZhZjVkNmU0OGE5NGU4NDNlMWNjYzJiIn0sImV4cCI6MTcxMDQzNjM1MywiaWF0IjoxNzEwNDAwMzUzfQ.KHuB51u8LrHK_WwbkALXgNn9c9C3bEjv90uG04J5FMs";
    if (portal_type != "") {
      return this.http.get(
        this.getBasePath() +
        `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptiscal/updateUnreadMessage?id=${id}&chatId=${chatId}`,
        {
          headers: this.getHeader(token),
        }
      );
    } else {
      return this.http.get(
        this.getBasePath() +
        `/healthcare-crm-hospital/hospital-doctor/updateUnreadMessage?id=${id}&chatId=${chatId}`,
        {
          headers: this.getHeader(token),
        }
      );
    }
  }

  viewAppointmentCheck(id: any, portal_type: any): Observable<any> {
    //let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY1MTNjYjg3NzJhNTgzYjM4MDY2NDg1ZSIsImVtYWlsIjoiZGhpcmFqZ3VydmUrc2FtX2RvY0BzbWFydGRhdGFpbmMubmV0Iiwicm9sZSI6IklORElWSURVQUxfRE9DVE9SIiwidXVpZCI6IjRhNDcwMjMyMGZhZjVkNmU0OGE5NGU4NDNlMWNjYzJiIn0sImV4cCI6MTcxMDQzNjM1MywiaWF0IjoxNzEwNDAwMzUzfQ.KHuB51u8LrHK_WwbkALXgNn9c9C3bEjv90uG04J5FMs";
    if (portal_type != "") {
      return this.http.get(
        this.getBasePath() +
        `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptiscal/viewAppointmentCheck?appointment_id=${id}`
      );
    } else {
      return this.http.get(
        this.getBasePath() +
        `/healthcare-crm-hospital/hospital-doctor/viewAppointmentCheck?appointment_id=${id}`
      );
    }
  }


  createGuestUser(name: any) {

    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/create-guest-user`
      , {
        name: name
      }
    );
  }

  sendExternalUserEmail(email: any, appointmentId: any, portaltype: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/send-external-user-email`
      , {
        email: email,
        appointment: appointmentId,
        portaltype: portaltype
      },
      {
        headers: this.getHeader(token),
      }
    );
  }

  getcinetpaylink(data: any) {
    return this.http.post('https://api-checkout.cinetpay.com/v2/payment', data, { headers: this.getHeader("") });
  }

  hospitalSignup(data: any) {
    let token = this.auth.getToken();
    console.log(data, "data");
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/sign-up`,
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
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/add-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  editStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/edit-staff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadDoc(formaData: any) {
    console.log(formaData);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/upload-document`,
      formaData,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }
  //....................emailVerification.............
  getVerificationCodeEmail(data: any) {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/send-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyOtp(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/match-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyEmailOtp(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/match-Email-Otp-For-2-fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  //...................LOGIN...........
  hospitalLogin(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/login`,
      data,
      {
        headers: this.getHeader("asdasd"),
      }
    );
  }

  //.................mobileVerification..............
  getVerificationCodeMobile(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getAllStaff(paramsData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-all-staff`,
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
      `/healthcare-crm-hospital/individual-doctor/get-all-staff-without-pagination`,
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
      `/healthcare-crm-hospital/individual-doctor/get-staff-details`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  getAllRole(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/all-staff-role`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  deleteActiveAndLockStaff(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/delete-active-and-lock-staff`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  serachFilterdoctor(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/advance-doctor-filter`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  doctorDetails(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/view-doctor-details-for-patient`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }
  getDoctorSubscriptionPlanDetails(parameter: any) {
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

  DoctorReviweandRating(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/patient/post-review-and-rating`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getDoctorReviweAndRating(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/patient/get-review-and-rating`,
      {
        params: param,
        // headers: this.getHeader(token),
      }
    );
  }

  getReviweAndRatingForSuperAdmin(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/patient/get-review-and-rating-for-superadmin`,
      {
        params: param,
        // headers: this.getHeader(token),
      }
    );
  }

  deleteRatingAndReview(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/patient/delete-review-and-rating-hospital`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getHospitalListUnderDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-hospital-list-under-doctor`,
      {
        params: data,
        headers: this.getHeader(token),
      }
    );
  }

  doctorAvailableSlot(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/doctor-available-slot`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  doctorAppoinment(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/doctor-appointment`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }
  viewAppoinment(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/patient/view-appointment`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  resonForAppoinment(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/reason-for-appointment-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  // doctor-appointment-list
  appoinmentListApi(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/list-appointment`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }
  // multiple-cancel-appointment
  cancelMultipleAppoinmentApi(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/cancel-and-approve-appointment`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }
  // single-cancel-appointment
  cancelSingleAppoinmentApi(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/cancel-and-approve-appointment`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addPatientByDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-patient/patient/patient-add-by-doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  assignHealthCareProvider(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/assign-healthcare-provider`,
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

  viewAppointmentDetails(id: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/view-appointment?appointment_id=${id}`,
      {
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

  getPatientListAddedByDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/get-all-patient-added-by-doctor?doctorId=${data.doctorId}&limit=${data.limit}&page=${data.page}&searchText=${data.searchText}&sort=${data.sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getAllPatientForSuperAdmin(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-patient/patient/getAllPatientForSuperAdmin`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  rescheduleAppointment(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/reschedule-appointment`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  nextAvailableSlot(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/next-available-slot?appointmentId=${id}`,

      {
        headers: this.getHeader(token),
      }
    );
  }
  // templateBuilder
  addtemplateBuilder(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/add-template`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  gettemplateBuilderListApi(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/template-list`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  editTemplateBuilder(templateId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/template-details?templateId=${templateId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  deleteTemplateBuilder(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/template-delete`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  // appointmentReason
  addAppointmentReasonApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-appointment-reason`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  uploadExcelAppointmentReason(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/bulk-upload-appointment-reason`,
      data,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }

  listAppointmentReason(params: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/reason-for-appointment-list`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateAppointmentReasonApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/update-appointment-reason`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteAppointmentReasonApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/action-on-appointment-reason`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  forgotPassword(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/forgot-password`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  setNewPassword(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/reset-forgot-password`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  changePassword(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/change-password`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  //-----------Roles & Permissions-------------
  addRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/add-staff-role`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllStaffRole(userId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/all-staff-role?userId=${userId}`,

      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllStaffRoles(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/all-staff-role`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateStaffRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/update-staff-role`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  deleteStaffRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/delete-staff-role`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-menus`, {
      params,
      headers: this.getHeader(token),
    });
  }

  getAllSubMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-submenus`, {
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

  submenudatabyuser(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/get-submenu-by-user`, {
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

  addSubmenusInfo(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/menu/add-submenu-permission`,
      data,
      { params: { module_name: "hospital" }, headers: this.getHeader(token) }
    );
  }
  //Questionnaire
  questiinnaireListApi(params: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/questionnaire-list`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  deleteQuestionnaireApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/action-on-questionnaire`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  relatedDoctors(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-related-doctors`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  relatedDoctorsForFourPortals(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-related-doctors-fourPortals`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  addQuestionnaire(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-questionnaire`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  getQuestionnaire(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/questionnaire-list`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }
  getQuestionnaireDetails(params: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/questionnaire-details`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  updateQuestionnaire(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-questionnaire`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  Allsubscriber() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/all-subscribers`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  AllPatient() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/get-all-patient`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getmedicineListWithParam(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/list-medicine-without-pagination-for-doctor`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getLabListData(parameters: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/lab-test-master-list-for-doctor`,
      {
        params: parameters,
        headers: this.getHeader(token),
      }
    );
  }

  createEprescription(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/create-eprescription`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionMedicineDosages(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-medicine-dosage`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getMedicineDosages(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription-medicine-dosage`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  deleteMedicineDose(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/delete-eprescription-medicine-dosage`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getEprescription(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionLabTest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-labTest`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getEprescriptionLabTest(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription-lab-test`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionImagingTest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-imagingTest`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getEprescriptionImagingTest(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription-imaging-test`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionVaccinationTest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-vaccination`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getEprescriptionVaccinationTest(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription-vaccination-test`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionOtherTest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-other`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getEprescriptionOtherTest(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription-other-test`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionEyeglassTest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-eyeglass`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getEprescriptionEyeglassTest(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-eprescription-eyeglass-test`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getAllEprescriptionTests(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-all-eprescription-tests`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  addEprescriptionSignature(formdata: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-eprescription-esignature`,
      formdata,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }

  listAllEprescription(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/list-all-eprescription`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getRecentPrescribedMedicinesList(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/recent-medicine-prescribed-by-doctor`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  listImagingForDoctor(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/imaging-test-master-list-for-doctor`,

      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  listVaccinationForDoctor(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/vaccination-master-list-for-doctor`,

      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  listEyeglassessForDoctor(parameter: any) {
    let token = this.auth.getToken();

    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/list-eyeglass-master-for-doctor`,

      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  listOthersForDoctor(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/others-test-master-list-for-doctor`,

      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getLocationInfo(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-doctor-location`,

      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getLocationInfoWithNames(data: any) {
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

  updateConsultation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/add-consulatation-data`,
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
      `/healthcare-crm-hospital/payment/hospital-is-plan-purchased`,
      {
        params,
        headers: this.getHeader(token),
      }
    );
  }

  async isPlanPurchesdByDoctor(user_id: any): Promise<boolean> {
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

  getnotificationdate(data: any) {
    return this.http.get(this.getBasePath() +
      `/healthcare-crm-hospital/hospital/notificationlist`, { params: data, headers: this.getHeader(localStorage.getItem("token")) })
  }
  getInsurancePlanDetailsbysubscriber(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance-subscriber/get-plan-service-by-subscriber`, {
      params: param,
      headers: this.getHeader(token)
    });
  }

  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/get-all-notification`,

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
      `/healthcare-crm-hospital/hospital/update-notification`,
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
    return this.http.put(this.getBasePath() + `/healthcare-crm-hospital/hospital/mark-all-read-notification`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-hospital/hospital/mark-read-notification-id`, data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getdepartmentAsperDoctor(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/department-Asper-Hospital_Doctor`,
      {
        departmentArray: param.departmentArray,
        doctor_list: param.doctor_list,

        serviceArray: param.serviceArray,

        unitArray: param.unitArray,
        in_hospital: param.in_hospital,



      },
      {

        headers: this.getHeader(token),
      }
    );
  }

  postAssignDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/get-AssignDoctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  onlineConsultationApi(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/online-consultation-count`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  facetofaceConsultationApi(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/facetoface-consultation-count`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  homeConsultationApi(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/home-consultation-count`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  allConsultationApi(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/all-consultation-count`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  patientPaymentHistoryToDoc(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/Patient-payment-historyToDoc`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  appointmentRevenuesCount(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/appointment-revenues-count`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getTotalRevenueMonthwiseF2F(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/totalRevenue-monthwise-f2f`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getTotalRevenueMonthwiseOnline(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/totalRevenue-monthwise-online`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  approvedStatusApi(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/graph-list-status`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  //--------User Invitation--------------
  invitationList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-email-invitation-list`,
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
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-email-invitation-id`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  inviteUser(data: any) {
    console.log("data======?", data)
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/send-email-invitation`, data, {
      headers: this.getHeader(token),
    });
    // return of({
    //   response: { status: true, message: "Invitation Sent", ...data },
    // });
  }

  deleteInvitation(data: any) {
    // return of({ status: true, message: "Succesfully delete invitation" });

    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/delete-email-invitation`, data,
      {
        headers: this.getHeader(token)
      }
    );
  }
  getAllTitle() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/common-titlelist`,
      {

        headers: this.getHeader(token),
      }
    );
  }


  getAllDesignation() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/common-designationlist`,
      {

        headers: this.getHeader(token),
      }
    );
  }

  getAllTeam() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/common-teamlist`,
      {

        headers: this.getHeader(token),
      }
    );
  }
  myLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/get-myleave`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }

  // Hospitalids list for dropdown
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
  doctorStaffleaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/doctorstaffleave-list`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }


  // all leave list
  allStaff_Leave_List_in_doctor(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/staffallleave-list`,
      {
        params: paramData,
        headers: this.getHeader(token),
      }
    );
  }



  leaveReject(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/leave/staffleave-reject`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }

  leaveAccept(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/leave/staffleave-accept`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }
  addleave(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/leave/add-leave`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  sendMailToPAtient(data: any) {
    console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/send-Mail-TO-Patient`,
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
      `/healthcare-crm-hospital/hospital/update-notification-status`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getDoctorBasicInfo(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-view-basic-info?portal_user_id=${id}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getLocationDetailsById(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-doctor-location-by-id?portal_user_id=${data.portal_user_id}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  addManualTestss(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/add-manuall-tests`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  editTests(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/edit-manual-tests`,
      data,

      {
        headers: this.getHeader(token),
      }
    );
  }

  updateLogs(data: any) {

    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/update-logs`,
      data,

    );
  }

  getUserLogs(params: any) {

    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/individual-doctor/get-all-logs-by-userId`,
      {
        params,

      }
    );
  }

  getTestsTotalClaimsForGraph(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/doctor_totalClaims_ForGraph`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getTotalTests(param: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/doctor_totalTests_allAppTypes`,
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
      `/healthcare-crm-hospital/hospital/providerdocument`,
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
      this.getBasePath() + `/healthcare-crm-hospital/hospital/providerdocumentlist`,
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
      this.getBasePath() + `/healthcare-crm-hospital/hospital/inactive_isdelete_providerdocument`,
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
      this.getBasePath() + `/healthcare-crm-hospital/hospital/getproviderdocument`,
      {
        params: param,
        headers: this.getHeader(token),

      }
    );
  }

  createUnRegisteredDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/create-unregister-doctor`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }

  createUnRegisteredDoctorStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/individual-doctor/create-unregister-doctor-staff`,
      data,
      {
        headers: this.getHeader(token),

      }
    );
  }

}

