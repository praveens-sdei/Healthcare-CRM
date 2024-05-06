import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { AuthService } from "src/app/shared/auth.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { environment } from "src/environments/environment";
import { IFileUploadResult } from "../pharmacy/pharmacy-creatprofile/pharmacy-creatprofile.type";
import { CoreService } from "src/app/shared/core.service";

@Injectable()
export class HospitalService {
  private uuid = localStorage.getItem("uuid");
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private coreService: CoreService,

    private apiEndpointsService: ApiEndpointsService
  ) { }

  // getHeader(token: any) {
  //   const httpHeaders = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     "role": "insurance",
  //     "Authorization": `Bearer ${token}`,
  //   });
  //   return httpHeaders;
  // }

  getHeaderHospital(token: any) {
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

  //....................Signup.....................
  hospitalSignup(data: any) {
    let token = this.auth.getToken();
    console.log(data, "data");
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/admin-signup`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  //.................mobileVerification..............
  getVerificationCodeMobile(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/send-sms-otp-for-2fa`,
      data,
      {
        headers: this.getHeaderHospital(""),
      }
    );
  }

  verifyOtp(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/match-otp-for-2fa`,
      data,
      {
        headers: this.getHeaderHospital(""),
      }
    );
  }

  verifyOtpEmail(data: any, uuid: any = ""): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/match-Email-Otp-For2fa`,
      data,
      {
        headers: this.getHeaderHospital(""),
      }
    );
  }

  //....................emailVerification.............
  getVerificationCodeEmail(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/send-email-otp-for-2fa`,
      data,
      {
        headers: this.getHeaderHospital(""),
      }
    );
  }

  //...................LOGIN...........
  hospitalLogin(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/login`,
      data,
      {
        headers: this.getHeaderHospital("asdasd"),
      }
    );
  }

  createProfile(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/create-hospital-profile`,
      data,
      {
        headers: this.getHeaderHospital("asdasd"),
      }
    );
  }

  //..................forgotPassword..................
  forgotPassword(body: any) {
    console.log(body);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/forgot-password`,
      body,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  //..................Get Association Group List..................
  associationList() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-all-association-group?group_type=hospital`,
      {
        headers: this.getHeaderHospital("asdasd"),
      }
    );
  }

  //...................resetPassword...........
  setNewPassword(data: any) {
    console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/reset-forgot-password`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  addStaff(data: any) {
    console.log(data);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-staff`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  editStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/edit-staff`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllStaff(paramsData: any) {
    // console.log(params, 'params');
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-all-staff`,
      {
        params: paramsData,
        headers: this.getHeaderHospital(token),
        // headers: this.getHeader(token),
      }
    );
  }

  getStaffDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-staff-details`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }
  getAllDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/get-doctor-list`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllDoctorOfHospital(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/view-hospital-doctor-for-patient`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  uploadDoc(formaData: any) {
    console.log(formaData);
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/upload-document`,
      formaData,
      {
        headers: this.getHeaderFileUpload(token),
      }
    );
  }

  // deleteActiveAndLockStaff(data: any) {
  //   let token = this.auth.getToken();
  //   return this.http.post(
  //     this.getBasePath() +
  //       `/healthcare-crm-hospital/hospital/delete-active-and-lock-staff`,
  //     data,
  //     { headers: this.getHeaderHospital(token) }
  //   );
  // }

  getAllStaffRoles(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-staff-role?userId=${data}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getUnits(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/all-unit`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
        // headers: this.getHeader(token),
      }
    );
  }
  getAllService(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/all-service`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
        // headers: this.getHeader(token),
      }
    );
  }

  //--------------------Upload Document-----------
  // uploadDocument(formData: FormData) {
  //   return this.http.post(
  //     this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/upload-document`,
  //     formData
  //   );
  // }

  getInsuranceSubscriptionPlan(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/all-subscription-plans`,
      {
        params: parameter,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getInsuranceSubscriptionPlanDetails(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-subscription-plan-details`,
      {
        params: parameter,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getPurchasedPlanOfUser(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/payment/subscription-purchased-plan`,
      {
        params: parameter,
        headers: this.getHeaderHospital(token),
      }
    );
  }
  deleteActiveAndLockStaff(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/delete-active-and-lock-staff`,
      data,
      { headers: this.getHeaderHospital(token) }
    );
  }
  public uploadDocument(
    docData: FormData
  ): Observable<IResponse<IFileUploadResult[]>> {
    const UPLOAD_URL = this.apiEndpointsService.createUrl(
      "healthcare-crm-hospital/hospital/upload-document",
      true
    );
    return this.http.post<IResponse<IFileUploadResult[]>>(UPLOAD_URL, docData, {
      headers: new HttpHeaders().set("uuid", this.uuid),
    });
  }

  // ----------------hospital-master-department-------------
  addDepartmentApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-department`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  getAllDepartment(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-department?added_by=${reqData.added_by}&limit=${reqData.limit}&page=${reqData.page}&searchText=${reqData.searchText}&sort=${reqData.sort}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  updateDepartmentApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-department`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  deleteDepartmentApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/action-on-department`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  // ---------------hospital-master-service-------------
  addServicesApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-service`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  getAllServiceApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-service?limit=${reqData.limit}&page=${reqData.page}&added_by=${reqData.added_by}&searchText=${reqData.searchText}&for_department=${reqData.for_department}&sort=${reqData.sort}`,

      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  deleteServiceApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/action-on-service`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  updateServiceApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-service`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  // ----------------hospital-master-unit------------
  getAllUnitApi(reqData: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-unit?limit=${reqData.limit}&page=${reqData.page}&added_by=${reqData.added_by}&searchText=${reqData.searchText}&for_service=${reqData.for_service}&sort=${reqData.sort}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  addUnitApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-unit`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  updateUnitApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-unit`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  deleteUnitApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/action-on-unit`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  // ----------------hospital-master-expertise------------
  getExpertiseApi(reqData) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-expertise?added_by=${reqData.added_by}&limit=${reqData.limit}&page=${reqData.page}&searchText=${reqData.searchText}&sort=${reqData.sort}`,

      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  addExpertiseApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-expertise`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  updateExpertiseApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-expertise`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  deleteExpertiseApi(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/action-on-expertise`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  gettAllStaffListing(paramsData: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-staff-without-pagination`,
      {
        params: paramsData,
        headers: this.getHeaderHospital(token),
        // headers: this.getHeader(token),
      }
    );
  }

  asignMenuSubmit(data: any) {
    let token = this.auth.getToken();
    return this.http.post(this.getBasePath() + `/menu/add-user-menu`, data, {
      params: {
        module_name: "superadmin",
      },
      headers: this.getHeaderHospital(token),
    });
  }

  addSubmenusInfo(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/menu/add-submenu-permission`,
      data,
      {
        params: { module_name: "hospital" },
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getUserMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-user-menu`, {
      params,
      headers: this.getHeaderHospital(token),
    });
  }
  //--------------------Upload Document-----------
  // uploadDocument(formData: FormData) {
  //   return this.http.post(
  //     this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/upload-document`,
  //     formData
  //   );
  // }

  //-------------------Manage Doctor-------------------
  getDoctorsList(data: any) {
    let token = this.auth.getToken();
    console.log(token);
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-list-doctor?page=${data?.page}&limit=${data.limit}&hospital_portal_id=${data.hospital_portal_id}&searchKey=${data.searchText}&sort=${data.sort}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getDoctorasPerlocList(data: any) {
    let token = this.auth.getToken();
    console.log(token);
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-doctor-as-per-loc?clinic_id=${data.clinic_id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getDoctorsRequestList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-request-list`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  acceptOrRejectDoctorRequest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-accept-or-reject`, data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  activeLockDeleteDoctor(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-active-lock-delete-doctor?`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getDoctorProfileDetails(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-view-doctor-profile?portal_user_id=${id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getDoctorBasicInfo(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-view-basic-info?portal_user_id=${id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  basicInformation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-basic-info`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  educationalDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-educational-details`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  locationDetails(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-hospital-location`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  doctorAvailability(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-doctor-availability`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getLocations(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-get-locations?portal_user_id=${id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  hospitalList(data: any) {
    let token = this.auth.getToken();
   return this.http.get(
     this.getBasePath() +
       `/healthcare-crm-hospital/hospital/get-all-hospital-list?page=${data.page}&limit=${data.limit}&status=${data.status}&sort=${data.sort}`,
     { headers: this.getHeaderHospital(token) }
   );
 }

  deleteAvailabiltiesOnDeletingLocation(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/delete-availabilty-by-deleting-location`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  feeManagement(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-fee-management`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  updateRole(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-staff-role`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  deleteRole(data: any) {
    let roleInfo;
    if (this.auth.getRole() == "super-admin") {
      roleInfo = "hospital";
    } else {
      roleInfo = this.auth.getRole();
    }
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/delete-staff-role`,
      data,
      {
        params: {
          module_name: roleInfo,
        },
        headers: this.getHeaderHospital(token),
      }
    );
  }

  allRole(userId: string) {
    let token = this.auth.getToken();
    console.log(this.auth.getRole(), "getting role");

    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/all-staff-role`,
      {
        params: {
          userId,
        },
      }
    );
  }

  allRoles(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/all-staff-role`,
      {
        params,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  addRole(data: any) {
    let token = this.auth.getToken();
    console.log("test");

    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-staff-role`,
      data,
      {
        // params: {
        //   module_name: "hospital",
        // },
        headers: this.getHeaderHospital(token),
      }
    );
  }

  documentManage(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-management-document-management`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  // getAllDepartment(data:any){
  //   let token = JSON.parse(this.auth.getToken());
  //   return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/all-department?added_by=${data.added_by}&limit=${data.limit}&page=${data.page}&searchText=${data.searchText}`, {
  //     headers: this.getHeaderHospital(token)
  //   });
  // }

  getAllServices(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-service?limit=0&page=1&added_by=${data.added_by}&searchText=&for_department=${data.for_department}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllUnits(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-unit?limit=0&page=1&added_by=${data.added_by}&searchText=&for_service=${data.for_service}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllExperties(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/all-expertise?added_by=${id}&limit=0&page=1&searchText=`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllSpeciality() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/speciality/speciality-list?limit=0&page=1&searchText=`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalDetails(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/view-hospital-admin-details?hospital_admin_id=${id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  uploadFileForPortal(formData: FormData) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-document-for-portal`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }

  getHospitalLocationById(id: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/read-hospital-locations?hospital_id=${id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-hospital-list?page=${data.page}&limit=${data.limit}&status=${data.status}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  viewProfile(userId: any) {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-hospital-details?hospital_portal_id=${userId}`
    );
  }

  deletePathologyTest(data: any) {
    
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/delete-hospital-pathology-tests`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  //advance search list hospital(for patient/homepage)
  adSearchHospital(data: any) {
    let token = this.auth.getToken();
    // console.log("service------------>",data)
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/advance-hospital-filter`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }
  getDepartment_service_units(data: any) {
    console.log(data, "data1213");

    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/list-of-department-service-unit`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getServiceDepartmentUnit(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/list-of-department-service-unit`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-menus`, {
      params,
      headers: this.getHeaderHospital(token),
    });
  }

  submenudatabyuser(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/get-submenu-by-user`, {
      params,
      headers: this.getHeaderHospital(token),
    });
  }

  getSubMenus(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/menu/all-submenus`, {
      params,
      headers: this.getHeaderHospital(token),
    });
  }
  // view_hospital_detail_list
  hospitalDetailsApi(hospitalID: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/view-hospital-details-for-patient?hospital_portal_id=${hospitalID}`,
      { headers: this.getHeaderHospital(token) }
    );
  }

  hospitalDetailsById(hospitalID: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/hospitalDetailsById?hospital_portal_id=${hospitalID}`,
      { headers: this.getHeaderHospital(token) }
    );
  }

  getHospitalSubscriptionPlan(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/all-subscription-plans`,
      {
        params: parameter,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getcinetpaylink(data: any) {
    return this.http.post('https://api-checkout.cinetpay.com/v2/payment', data,{  headers: this.getHeaderHospital("")});
  }

  getHospitalSubscriptionPlanDetails(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/superadmin/get-subscription-plan-details`,
      {
        params: parameter,
        headers: this.getHeaderHospital(token),
      }
    );
  }
  // view_hospital_doctor_list
  hospitalDoctorListApi(data: any) {
    console.log(data);
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/view-hospital-doctor-for-patient`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
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
        headers: this.getHeaderHospital(token),
      }
    );
  }

  async isPlanPurchesdByHospital(user_id: any): Promise<boolean> {
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


  getAllTitle() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/common-titlelist`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  HospitalLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/particularhospitalleave-list`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  leaveAccept(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/leave/leave-accept`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  getAllDesignation() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/common-designationlist`,
      {

        headers: this.getHeaderHospital(token),
      }
    );
  }
  getAllTeam(hospitalId:any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/common-teamlist?hospitalId=${hospitalId}`,
      {

        headers: this.getHeaderHospital(token),
      }
    );
  }
  getAll_TypeHealthCenter() {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-superadmin/common-api/common-healthcentrelist`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  leaveReject(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/leave/leave-reject`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  HospitalAcceptedLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/getacceptedleave-list`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
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
        headers: this.getHeaderHospital(token),
      }
    );
  }




  OwnStaffLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/hospitalstaffleavelist-list`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }


  HospitalStaffLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/hospitalstaffallleave-list`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }



  HospitalbyStaffLEave(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/leave/hospitalstaffallleave-list`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }



  HospitalStaffleaveAccept(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/leave/hospitalstaffleave-accept`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  HospitalStaffleaveReject(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/leave/hospitalstaffleave-reject`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalChatUser(paramData: any) {
    let token = this.auth.getToken();
    console.log(paramData, "paramData")
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-all-user-for-chat`,

      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }

    );
  }

  getAllMessagesService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/all-message`,
      {
        params,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getRoomlistService(params: any) {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/get-create-chat`,
      {
        params,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllNotificationService(params: any) {
    let token = this.auth.getToken();
    // return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/get-all-notification`,
    return this.http.get(this.getBasePath() + `/healthcare-crm-hospital/hospital/notificationlist`,
      {
        params,
        headers: this.getHeaderHospital(token),
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
        headers: this.getHeaderHospital(token),
      }
    );
  }


  markAllReadNotification(data: any) {
    // console.log(data,"ppppppppppppp")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-hospital/hospital/mark-all-read-notification`, data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  markReadNotificationById(data: any) {
    console.log(data, "dsgfghdrfsgfdr")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-hospital/hospital/mark-read-notification-id`, data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  clearAllMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-hospital/hospital/clear-all-messages`, data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  clearSingleMessages(data: any) {
    // console.log(data,"ddddddddddddddddd")
    let token = this.auth.getToken();
    console.log("token", token)
    return this.http.put(this.getBasePath() + `/healthcare-crm-hospital/hospital/clear-single-message`, data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  saveOpeningHour(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/opening-hours`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  changePassword(body: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/change-password`,
      body,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  uploadExcelforDepartment(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/uploadExcelforDepartment`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }


  uploadExcelforExpertise(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/uploadExcelforExpertise`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }


  uploadCSVForService(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/uploadCSVForService`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }


  expertiseListforexport(page: any, limit: any, searchText: string, userId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/expertiseListforexport?searchText=${searchText}&limit=${limit}&page=${page}&userid=${userId}`,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }

  departmentListforexport(page: any, limit: any, searchText: string, userId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/departmentListforexport?searchText=${searchText}&limit=${limit}&page=${page}&userid=${userId}`,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }


  serviceListforexport(page: any, limit: any, searchText: string, userId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/serviceListforexport?searchText=${searchText}&limit=${limit}&page=${page}&userid=${userId}`,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }


  uploadCSVForUnitHospital(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/uploadCSVForUnitHospital`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }

  unitListforexport(page: any, limit: any, searchText: string, userId: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/unitListforexport?searchText=${searchText}&limit=${limit}&page=${page}&userid=${userId}`,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }



  addTeam(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/add-team`,
      data,
      {
        headers: this.getHeaderFormData(token)
      }
    );
  }
  TeamLists(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/list-team`,
      {
        params: paramData,
        headers: this.getHeaderFormData(token)
      }
    );
  }
  updateTeamApi(data: any) {
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-team`,
      data,
      {
        headers: this.getHeaderFormData(token)
      }
    );
  }
  deleteTeam(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/delete-team`,
      data,
      {
        headers: this.getHeaderFormData(token)
      }
    );
  }

  allTeamListforexport(page: any, limit: any, searchText: string, userId:any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/exportsheetlist-team?searchText=${searchText}&limit=${limit}&page=${page}&userId=${userId}`,
      {
        headers: this.getHeaderFormData(token)
      }
    );
  }

  uploadExcelTeamList(formData: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/upload-csv-for-team-list`,
      formData,
      {
        headers: this.getHeaderFormData(token),
      }
    );
  }

  getByIdTeam(data:any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/getById-team`,
    
      {
        params: data,
        headers: this.getHeaderFormData(token),
      }
    );
  }

  getFourPortalsRequestList(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-request-list`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getAllPortalsList(data: any) {
    let token = this.auth.getToken();
    console.log(token);
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-all-management-list?page=${data?.page}&limit=${data.limit}&hospital_portal_id=${data.hospital_portal_id}&searchKey=${data.searchText}&doctorId=${data.doctorId}&sort=${data.sort}&type=${data.type}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  activeLockDeleteLabimagingdentaloptical(data: any) {
    let token = this.auth.getToken();
    console.log(token)
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/active-lock-delete-labimagingdentaloptical`,
      data,
      { headers: this.getHeaderHospital(token) }
    );
  }

  acceptOrRejectFourPortalRequest(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-management-accept-or-reject`, data,
      {
        headers: this.getHeaderHospital(token),
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
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getDoctorsFourPortalList(data: any) {
    let token = this.auth.getToken();
    console.log(token);
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital-doctor/doctor-four-portal-management-list?hospital_portal_id=${data.hospital_portal_id}`,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  gethospitalPatient(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/patient/getAllPatientAddedByHospitalDoctor`,
      {
        params: parameter,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  addManualTestss(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/add-manuall-tests`,
      data,

      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  editTests(data:any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital-doctor/edit-manual-tests`,
      data,

      {
        headers: this.getHeaderHospital(token),
      }
    );
  }


  updateLogs(data:any) {   
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/update-logs`,
      data,      
    );
  }

  getUserLogs(parameter: any) {
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-all-logs-by-userId`,
      {
        params: parameter,     
      }
    );
  }

  getHospitalDashboardCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-hospital-dashboard-count`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalDashboardstaffCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-hospital-dashboard-staff-count`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalRevenueCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-revenue-management-count`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalOnlineRevenueCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-online-revenue-for-hospital`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getHospitalf2fRevenueCount(data: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-hospital/hospital/get-f2f-revenue-for-hospital`,
      {
        params: data,
        headers: this.getHeaderHospital(token),
      }
    );
  }


  HospitallaboratoryLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getAllLaboratoryLeave`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }
  HospitalDentalLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getAllDentalLeave`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  HospitalOpticalLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getAllOpticalLeave`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  HospitalParaMedicalLeaveList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/getAllParaMedicalLeave`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  fourportalleaveAccept(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/fourPortalLeaveAcceptInDoctor`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  fourportalleaveReject(data: any) {
    // console.log(data);
    let token = this.auth.getToken();
    return this.http.put(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/leave/fourPortalLeaveRejectInDoctor`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

  gethospitalpaymentHistory(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-doctor-fourportal-payment-history`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getInsuranceAcceptedHospitalList(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/get-insurance_accepted-hospital-list`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }

  getFourPortalListByhospitalId(paramData: any) {
    // return of({ status: true });
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/get-all-fouportal-list-for-hospital`,
      {
        params: paramData,
        headers: this.getHeaderHospital(token),
      }
    );
  }


  createUnregisteredHospital(data: any) {
    let token = this.auth.getToken();
    console.log(data, "data");
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-hospital/hospital/create-unRegistered-Hospital`,
      data,
      {
        headers: this.getHeaderHospital(token),
      }
    );
  }

}
