import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/shared/auth.service";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";

@Injectable()
export class PharmacyPlanService {
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

  getHeader(token: any, deviceId: any = "") {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
      role: "pharmacy",
      Authorization: `Bearer ${token}`,
      uuid: localStorage.getItem("deviceId"),
    });
    return httpHeaders;
  }

  getPharmacyBasePath() {
    return environment.insuranceURL;
  }

  getBasePath() {
    return environment.apiUrl;
  }

  getPharmacySubscriptionPlan(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/all-subscription-plans`,
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

  getPharmacySubscriptionPlanDetails(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-superadmin/superadmin/get-subscription-plan-details`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  getPurchasedPlanOfUser(parameter: any) {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/payment/subscription-purchased-plan`,
      {
        params: parameter,
        headers: this.getHeader(token),
      }
    );
  }

  signUp(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/signup`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeMobile(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/send-sms-otp`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  getVerificationCodeEmail(data: any) {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/send-email-verification`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  verifyMobileOtp(data: any): Observable<any> {
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/match-sms-otp`,
      data,
      {
        headers: this.getHeader(""),
      }
    );
  }

  // verifyEmailOtp(data:any):Observable<any>{
  //   return this.http.post(this.getBasePath()+`/healthcare-crm-pharmacy/patient/match-email-otp-for-2fa`,data ,{
  //     headers: this.getHeader('')
  //   });
  // }

  saveOpeningHour(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/pharmacy-opening-hours`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  saveOnDuty(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-pharmacy/pharmacy/pharmacy-on-duty`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineServiceType(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/service-type`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/service-type`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  serviceTypeDoctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/service-type`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/serviceTypeDoctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  hospitalServiceData(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/service-type`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/hospitalServiceData`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }



  serviceTypeFourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/service-type`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/serviceTypeFourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  claimDocumentUpload(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/document-upload`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/document-upload`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  documentUploadDoctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/document-upload`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/documentUploadDoctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getApprovedInsurance(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/superadmin/get-insurance-admin-approved-list`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getInsuranceAcceptedList(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-pharmacy/claim/getInsuranceAcceptedList?pharmacyId=${param.pharmacyId}`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getInsuranceAcceptedListForFourPortal(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/getInsuranceAcceptedListForFourPortal?portal_id=${param.portal_id}`,
      {
        // params: param,
        headers: this.getHeader(token),
      }
    );
  }


  getInsuranceAcceptedListDoctor(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-hospital/patient/getInsuranceAcceptedListForDoc?pharmacyId=${param.doctorId}`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getAllPatientList(): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() + `/healthcare-crm-patient/patient/get-all-patient`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  saveStepOne(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step1`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/common-information-step1`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  checkInsuranceStaff(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step1`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/checkInsuranceStaff`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commonInformationStep1Doctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step1`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep1Doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  commonInformationStep1FourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step1`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep1FourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commoninformationStep1HospitalClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step1`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commoninformationStep1HospitalClaim`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  deleteMedicineExisting(data: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/claim/deleteMedicineExisting`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  getAllPrimaryInsuredFields(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-assign-claim-content-primary`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  saveStepTwo(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step2`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/common-information-step2`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  commonInformationStep2FourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step2`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep2FourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commonInformationStep2Doctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step2`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep2Doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  commoninformationStep2HospitalClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step2`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commoninformationStep2HospitalClaim`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllSecondaryInsuredFields(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-assign-claim-content-secondary`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  saveStepThree(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step3`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/common-information-step3`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commonInformationStep3FourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step3`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep3FourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commonInformationStep3Doctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step3`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep3Doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commoninformationStep3HospitalClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step3`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commoninformationStep3HospitalClaim`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllAccidentInsurerFields(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-assign-claim-content-accident`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  saveStepFour(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step4`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/common-information-step4`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  commonInformationStep4FourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step4`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep4FourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commonInformationStep4Doctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step4`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep4Doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commoninformationStep4HospitalClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step4`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commoninformationStep4HospitalClaim`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }
  saveStepFive(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step5`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/common-information-step5`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }


  commonInformationStep5FourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step5`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep5FourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commonInformationStep5Doctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step5`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commonInformationStep5Doctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  commoninformationStep5HospitalClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/common-information-step5`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/commoninformationStep5HospitalClaim`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  eSignature(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/e-signature`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/e-signature`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getInsurancePlanDetails(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance-subscriber/verify-insurance-details`, {
      params: param,
      headers: this.getHeader(token)
    });
  }

  //----medicine claim dashboard------------
  medicineClaimList(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineConsultationListInsuranceAdmin(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineConsultationListInsuranceAdmin?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineListInsuranceAdmin(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineListInsuranceAdmin?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  MakeInsuranceAdminFourPortalList(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/claim/MakeInsuranceAdminFourPortalList?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}&claimType=${data.claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimListDoctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineClaimListDoctor?status=${data.status}&createdByIds=${data.createdByIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}&sort=${data.sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimListDoctorHospitalization(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineClaimListDoctorHospitalization?status=${data.status}&createdByIds=${data.createdByIds}&limit=${data.limit}&hospitalName=${data.hospitalName}&page=${data.page}&insuranceIds=${data.insuranceIds}&sort=${data.sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimListHospitalclaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineClaimListHospitalclaim?status=${data.status}&createdByIds=${data.createdByIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}&sort=${data.sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimListHospitalclaimExtensionFinal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-list?status=${data.status}&pharmacyIds=${data.pharmacyIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}`,
      `/healthcare-crm-insurance/claim/medicineClaimListHospitalclaimExtensionFinal?status=${data.status}&createdByIds=${data.createdByIds}&limit=${data.limit}&page=${data.page}&insuranceIds=${data.insuranceIds}&sort=${data.sort}`,
      {
        headers: this.getHeader(token),
      }
    );
  }



  getClaimsStatusCount(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  medicineClaimCountByStatusInsuranceAdmin(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusInsuranceAdmin?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
  appointmentclaimInsuranceAdmin(data): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/appointmentclaimInsuranceAdmin?pharmacyId=${data.pharmacyId}&insuranceIds=${data.insuranceIds}&fromDate=${data.fromDate}&Todate=${data.Todate}&claimType=${data.claimType}`,
      {
        headers: this.getHeader(token),
      }
    );
  }




  medicineClaimCountByStatusInsuranceAdminMedicine(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusInsuranceAdminMedicine?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimCountByStatusPharmacyDoctor(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusPharmacyDoctor?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimCountByStatusPharmacyDoctorHospital(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusPharmacyDoctorHospital?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimCountByStatusHospitalClaim(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusHospitalClaim?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimCountByStatusHospitalClaimExtensionFinal(pharmacyID: any, insuranceId: any, fromDate: any = '', ToDate: any = ''): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-count-by-status-pharmacy?pharmacyId=${pharmacyID}`,
      `/healthcare-crm-insurance/claim/medicineClaimCountByStatusHospitalClaimExtensionFinal?pharmacyId=${pharmacyID}&&insuranceIds=${insuranceId}&&fromDate=${fromDate}&&Todate=${ToDate}`,
      {
        headers: this.getHeader(token),
      }
    );
  }



  medicineClaimDetails(claimId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimDetailswithHospitalData(claimId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/medicineClaimDetailswithHospitalData?claimId=${claimId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  medicineClaimDetailsPharmacyClaimObjectIdHopitalization(claimId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/medicineClaimDetailsPharmacyClaimObjectIdHopitalization?claimId=${claimId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }



  medicineClaimDetailsPharmacyByClaimObjectId(claimObjectId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/medicineClaimDetailsPharmacyByClaimObjectId?claimObjectId=${claimObjectId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getAllDetailsPlanCalculate(patientId: any, healthplan_id, serviceName, service_count, family_count): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/getAllDetailsPlanCalculate?patientId=${patientId}&healthplan_id=${healthplan_id}&serviceName=${serviceName}&serviceCount=${JSON.stringify(service_count)}&family_count=${family_count}`,
      {
        headers: this.getHeader(token),
      }
    );
  }


  getServiceClaimCount(subscriber_id: any, health_plan_id: any, service_name: any, plan_validity: any, category_name: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/getServiceClaimCount?subscriber_id=${subscriber_id}&health_plan_id=${health_plan_id}&service_name=${service_name}&plan_validity=${plan_validity}&category_name=${category_name}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getWaitingTime(patientId: any, healthplan_id, serviceName, waitingCount): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/getWaitingTime?patientId=${patientId}&healthplan_id=${healthplan_id}&serviceName=${serviceName}&waitingCount=${JSON.stringify(waitingCount)}`,
      {
        headers: this.getHeader(token),
      }
    );
  }



  medicineClaimDetailsPharmacyByClaimObjectIdHopitalization(claimObjectId: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      // `/healthcare-crm-pharmacy/claim/medicine-claim-details-pharmacy?claimId=${claimId}`,
      `/healthcare-crm-insurance/claim/medicineClaimDetailsPharmacyByClaimObjectIdHopitalization?claimObjectId=${claimObjectId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }



  getInsuranceTemplate(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance/get-insurance-template-details`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getAllSubscriber(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/list-all-type-of-subscriber`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getAllSubscriberbyid(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() +
      `/healthcare-crm-insurance/insurance-subscriber/list-all-type-of-subscriberbyid`,
      param,
      {

        headers: this.getHeader(token),
      }
    );
  }

  finalSubmitClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/final-submit-claim`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/final-submit-claim`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  finalSubmitClaimFourPortal(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/final-submit-claim`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/finalSubmitClaimFourPortal`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  finalSubmitClaimDoctor(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      // this.getBasePath() + `/healthcare-crm-pharmacy/claim/final-submit-claim`,
      this.getBasePath() + `/healthcare-crm-insurance/claim/finalSubmitClaimDoctor`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

  finalSubmitClaimandPdf(param: any) {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/insurance/finalSubmitClaimandPdf`,
      param,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getPharmacyStaffName(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(
      this.getBasePath() +
      `/healthcare-crm-pharmacy/pharmacy/list-category-staff`,
      {
        params: param,
        headers: this.getHeader(token),
      }
    );
  }

  getInsurancePlanDetailsbysubscriber(param: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.get(this.getBasePath() + `/healthcare-crm-insurance/insurance-subscriber/get-plan-service-by-subscriber`, {
      params: param,
      headers: this.getHeader(token)
    });
  }

  removeImageFromClaim(data: any): Observable<any> {
    let token = this.auth.getToken();
    return this.http.post(
      this.getBasePath() + `/healthcare-crm-insurance/claim/delete-document`,
      data,
      {
        headers: this.getHeader(token),
      }
    );
  }

}