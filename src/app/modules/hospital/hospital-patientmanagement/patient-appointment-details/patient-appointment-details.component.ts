import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { ToastrService } from "ngx-toastr";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Subject } from "rxjs";
import { DecimalPipe, Location, DatePipe } from "@angular/common";
import { WebSocketService } from "src/app/shared/web-socket.service";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Select2UpdateEvent } from "ng-select2-component";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  medicine: string;
  packorunit: string;
  frequency: string;
  duration: number;
}
import { ThemePalette } from "@angular/material/core";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { PharmacyPlanService } from "src/app/modules/pharmacy/pharmacy-plan.service";
import { FourPortalService } from "src/app/modules/four-portal/four-portal.service";

export interface ILocationData {
  mode: "CALENDER" | "REMAINDER_CALENDER";
}

@Component({
  selector: 'app-patient-appointment-details',
  templateUrl: './patient-appointment-details.component.html',
  styleUrls: ['./patient-appointment-details.component.scss']
})
export class PatientAppointmentDetailsComponent implements OnInit {

  @Input() patientId: any;
  isSubmitted: boolean = false;
  @ViewChild("picker") picker: any;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate = new Date();
  public maxDate = new Date();
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = "primary";
  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
  });
  public dateControl = new FormControl(new Date());
  public dateControlMinMax = new FormControl(new Date());

  public options = [
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];

  public listColors = ["primary", "accent", "warn"];

  public stepHours = [];
  public stepMinutes = [];
  public stepSeconds = [];

  displayedColumns: string[] = [
    "medicine",
    "packorunit",
    "frequency",
    "duration",
  ];
  dataSource: any = [];

  @ViewChild("htmlData") htmlData!: ElementRef;
  @ViewChild("noPermissionModal") noPermissionModal: ElementRef;
  @ViewChild("consultationModal") consultationModal: ElementRef;
  @ViewChild("confirmationMessage") confirmationMessage: ElementRef;
  @ViewChild("confirmationPaymenforNOinsurance") confirmationPaymenforNOinsurance: ElementRef;
  @ViewChild("confirmationPaymenforInsurance") confirmationPaymenforInsurance: ElementRef;



  timeHourValue: any = [
    { name: "0  Hour", value: 0 },
    { name: "1  Hour", value: 1 },
    { name: "2  Hour", value: 2 },
    { name: "3  Hour", value: 3 },
    { name: "4  Hour", value: 4 },
    { name: "5  Hour", value: 5 },
    { name: "6  Hour", value: 6 },
    { name: "7  Hour", value: 7 },
    { name: "8  Hour", value: 8 },
    { name: "9  Hour", value: 9 },
    { name: "10 Hour", value: 10 },
    { name: "11 Hour", value: 11 },
    { name: "12 Hour", value: 12 },
    { name: "13 Hour", value: 13 },
    { name: "14 Hour", value: 14 },
    { name: "15 Hour", value: 15 },
    { name: "16 Hour", value: 16 },
    { name: "17 Hour", value: 17 },
    { name: "18 Hour", value: 18 },
    { name: "19 Hour", value: 19 },
    { name: "20 Hour", value: 20 },
    { name: "21 Hour", value: 21 },
    { name: "22 Hour", value: 22 },
    { name: "23 Hour", value: 23 },
  ];

  timeMinuteValue: any = [
    { name: "0  Minute", value: 0 },
    { name: "5  Minute", value: 5 },
    { name: "10  Minute", value: 10 },
    { name: "15  Minute", value: 15 },
    { name: "20  Minute", value: 20 },
    { name: "25  Minute", value: 25 },
    { name: "30  Minute", value: 30 },
    { name: "35  Minute", value: 35 },
    { name: "40  Minute", value: 40 },
    { name: "45  Minute", value: 45 },
    { name: "50  Minute", value: 50 },
    { name: "55  Minute", value: 55 },
    { name: "59  Minute", value: 59 },
    ,
  ];
  userRole: any;
  patientAllDetails: any;
  formatted_appointment_type: any;
  type: any;
  insuranceId: null;
  categoryData: any;
  planService: any;
  selectedcategoryName: any = "";
  portalId: any;
  portal_type: any;
  // Assign Healthcare Provider Model
  openVerticallyCenteredAssignhealthcare(assignhealthcare_content: any) {
    this.modalService.open(assignhealthcare_content, {
      centered: true,
      windowClass: "assign_healthcare",
    });
  }
  doctorId: any = "";
  appointmentId: any = "";
  patient_id: any = "";
  profile: any;
  appointmentDetails: any;
  country: any = "";
  isVisible: boolean = false;
  serachText: any = "";

  vitals: any;
  medicines: any;
  immunizations: any;
  history: any;
  medicalDocuments: any;

  genderList: any[] = [];
  bloodGroupList: any[] = [];
  martialStatusList: any[] = [];
  spokenLanguageList: any[] = [];
  relationshipList: any[] = [];
  staffList: any[] = [];

  selectedStaff: any[] = [];
  assignedStaff: any[] = [];
  appointmentStatus: any = "";
  operatingDoctorDetails: any;

  remainderForm: any = FormGroup;

  isVitals: boolean = true;
  isCurrentMedicines: boolean = true;
  isPastMedicines: boolean = true;
  isImmunizations: boolean = true;
  isHistory: any;
  isMedicalDocument: any;
  primarySubscriberId: any = "";
  subscriberDetails: any[] = [];
  consulatationData: any = "";
  subject$ = new Subject();

  dateForSlot: any = new Date();
  choose_slot: any;
  appointment_type: any = "";
  patientProfile: any = "";
  location_id: any = "";
  doctor_availability: any[] = [];
  doctorAvailableTimeSlot: any[] = [];
  hospital_location: any[] = [];
  doctordetailsData: any = {};
  doctorRating: any;
  nearestAvailableSlot: any;
  nearestAvailableDate: any;
  consultationDate: any;
  ansjson: any = "";
  appointment: any = "appointment";

  listMedicineDosagess: any[] = [];
  allDosagess: any[] = [];
  dosages: any[] = [];
  labs: any[] = [];
  imaging: any[] = [];
  vaccination: any[] = [];
  eyeglasses: any[] = [];
  others: any[] = [];
  totalCounts: any = 0;

  loggedInUserName: any;
  overlay: false;
  serviceList: any = [];
  appointmentPayment: boolean;
  paymentType: any = "";
  subsciberId: any = "";
  serviceValue: any = "";
  consultationFee: any = "";
  copayment: any = "";
  insurancePay: any = "";
  serviceName: any;
  paymentDetails: any = [];
  selectedService: any = "";
  serviceId: any = "";
  currentDate: any = new Date();
  innerMenuPremission: any = [];
  value = new Date();
  categoryList: any = [];
  categoryObject: any = [];

  @ViewChild("confirmationModel") confirmationModel: any;
  @ViewChild("myDiv") myDivRef!: ElementRef;
  constructor(
    private modalService: NgbModal,
    private patientService: PatientService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private sadminService: SuperAdminService,
    private indiviualDoctorService: IndiviualDoctorService,
    private toastr: ToastrService,
    private route: Router,
    private fb: FormBuilder,
    private location: Location,
    private websocket: WebSocketService,
    private DecimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private loader: NgxUiLoaderService,
    private pharmacySerivice: PharmacyService,
    private pharmacyPlanService: PharmacyPlanService,
    private fourPortalService: FourPortalService,

  ) {
    this.remainderForm = this.fb.group({
      remainderrr: this.fb.array([]),
      remainderDT: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    console.log("patientId=========>", this.patientId);

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userRole = loginData?.role;

    this.loggedInUserName = adminData?.full_name;



    this.activatedRoute.queryParams.subscribe((params) => {
      this.portal_type = params["portal_type"],
        this.appointmentId = params["appointmentId"]
    });



    this.subject$.subscribe((val) => {
      if (val == 1) this.getAppointmentDetails();
    });

    if (this.portal_type) {

      this.get4portalAppointmentDetails();
    } else {
      this.getAppointmentDetails();
    }


    // this.activatedRoute.queryParams.subscribe((params) => {
    //  console.log("NEW PARAM________________",params);

    //  this.type = params
    //  if( this.type){
    // //  this.addConsulatationNotes(this.type)

    //  }
    // });

    const dateObject1 = new Date(this.currentDate);
    dateObject1.setHours(0, 0, 0, 0);

    this.currentDate = dateObject1;
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

        } else {
          console.log(`does not exist in the object.`);
        }

      } else {
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({ name: checkSubmenu[key].name, slug: key, status: true });
        }

        this.innerMenuPremission = innerMenu;
        console.log("this.innerMenuPremission_______________-", this.innerMenuPremission);

      }
    }


  }
  giveInnerPermission(value) {
    if (this.userRole === "HOSPITAL_STAFF") {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    } else {
      return true;
    }


  }

  public consultationForm = new FormGroup({
    categoryService: new FormControl(""),
    service_name: new FormControl(""),
    reimbursement_rate: new FormControl("", [Validators.required]),
    doctor_fees: new FormControl("", [Validators.required]),
    insurance_pay: new FormControl("", [Validators.required]),
    comment: new FormControl(""),
    co_payment: new FormControl(""),
  });


  public consultationForm_nothaveInsurnace = new FormGroup({
    doctor_fees: new FormControl("", [Validators.required]),
    comment: new FormControl(""),
  });


  private async getPlanDetails(patientId) {
    let param = {
      subscriber_id: patientId,
    };
    this.indiviualDoctorService
      .getInsurancePlanDetailsbysubscriber(param)
      .subscribe({
        next: async (res) => {
          const encData = await res;
          let result = this.coreService.decryptContext(encData);
          console.log("plandetails", result);
          if (result.status) {
            this.insuranceId = result?.body?.resultData?.health_plan_for?.for_user;


            this.planService = result.body?.planService;

          } else {
            this.coreService.showInfo(
              "Given Insurance Id is not applicable for Reimbursment",
              ""
            );
          }
        },
      });
  }



  async update(event: Select2UpdateEvent<any>) {
    // this[key] = event.value;
    console.log(this.planService, "select2updateEvent", event);

    let reimbursmentRate = "";

    if (event.component.option != null) {
      for await (const iterator of this.planService) {
        if (iterator.service == event.options[0].label) {
          reimbursmentRate = iterator.reimbursment_rate;
        }
      }
      // this.medicineNameObject[index] = event.options[0].label;
      // this.medicineIDObject[index] = event.options[0].value;
      this.serviceName = event.options[0].label;
      this.serviceValue = reimbursmentRate;
      console.log("this.serviceValue__________", this.serviceValue);


      this.insurancePay = (this.serviceValue / 100) * this.consultationFee;
      let copay = this.consultationFee - this.insurancePay
      console.log("copay", copay);

      this.copayment = this.transformDecimal(copay);
      // consultationFee
      this.serviceId = event.options[0].value;
    }
  }

  openVerticallyCenteredconfirmPaymentforNOinsurance(confirmationPaymenforNOinsurance: any) {
    this.modalService.open(confirmationPaymenforNOinsurance, {
      centered: true,
      size: "md",
      windowClass: "end_appointment",
    });
  }

  openVerticallyCenteredconfirmPaymentforInsurance(confirmationPaymenforInsurance: any) {
    this.modalService.open(confirmationPaymenforInsurance, {
      centered: true,
      size: "md",
      windowClass: "end_appointment",
    });
  }

  onSubmit(type: any) {
    let reqData: any;
    if (type === 'insurance') {
      if (this.consultationForm.invalid) {
        return;
      }

      reqData = {
        appointment_id: this.appointmentId,
        columnData: {
          isPaymentDone: true,
          paymentDetails: {
            serviceName: this.serviceName,
            reimburstment_rate: this.serviceValue,
            doctorFees: this.consultationForm.value.doctor_fees,
            copay: this.consultationForm.value.co_payment,
            insuranceTobePaid: this.consultationForm.value.insurance_pay,
            comment: this.consultationForm.value.comment,
            serviceId: this.serviceId,
            catoegory: this.categoryObject
          },
        },
      };
    } else if (type === 'noInsurance') {
      if (this.consultationForm_nothaveInsurnace.invalid) {
        return;
      }

      reqData = {
        appointment_id: this.appointmentId,
        columnData: {
          isPaymentDone: true,
          paymentDetails: {
            doctorFees: this.consultationForm_nothaveInsurnace.value.doctor_fees,
            comment: this.consultationForm_nothaveInsurnace.value.comment,
          },
        },
      };
    }
    this.loader.start();
    console.log("REQDATAAAAAA===>", reqData);
    this.indiviualDoctorService.updateConsultation(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("PAYMENT_RESPONSE===>", response);
        if (response.status) {
          this.toastr.success(response.message);
          this.getAppointmentDetails();
          this.closePopup();
          this.loader.stop();
        } else {
          this.loader.stop();
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  scrollToDiv(content: any) {
    if (this.myDivRef) {
      this.modalService.dismissAll("close");
      setTimeout(() => {
        this.myDivRef.nativeElement.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }

  callUser(type?: string) {
    if (
      !this.appointmentDetails?.paymentStatus &&
      this.appointmentDetails?.paymentType === "post-payment"
    ) {
      this.modalService.open(this.confirmationModel);
      return;
    }

    let mediaPermission;
    mediaPermission = { audio: true };
    if (type == "video") {
      mediaPermission = { ...mediaPermission, video: true };
    }
    AgoraRTC.getDevices()
      .then(async (devices) => {
        let audioDevices, videoDevices;
        audioDevices = devices.filter(function (device) {
          return device.kind === "audioinput";
        });
        let selectedMicrophoneId = audioDevices[0].deviceId;
        videoDevices = devices.filter(function (device) {
          return device.kind === "videoinput";
        });
        let selectedCameraId = videoDevices[0].deviceId;
        // return Promise.all([
        //   this.rtc
        // ]);
      })
      .then((res) => {
        console.log("testtt");
        let roomid = this.appointmentId;
        console.log("calluser");
        const data = {
          loggedInUserId: this.doctorId,
          loggedInUserName: this.loggedInUserName,
          chatId: roomid,
          type: type,
          token: "Bearer " + localStorage.getItem("token"),
        };
        this.websocket.isCallStarted(true);
        this.websocket.callUser(data);
      })
      .catch((e) => {
        this.toastr.error("Please check your camera and mic");
        console.log(e, "error");
      });
    // navigator.mediaDevices.getUserMedia(mediaPermission).then((res: any) => {
    // let roomid=this.appointmentId
    // console.log("calluser");
    // const data = {loggedInUserId: this.doctorId, chatId: roomid, type: type,token:"Bearer "+localStorage.getItem("token")};
    // this.websocket.isCallStarted(true);
    // this.websocket.callUser(data);
    // }).catch((err: any) => {
    //   this.toastr.error(this.commonServ.handleUserMediaError(err));
    // });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const locationInfo = this.location.getState() as ILocationData;
      console.log(locationInfo, "FROM CALENDER===>");
      if (locationInfo.mode === "CALENDER") {
        let element: HTMLElement = document.getElementById(
          "auto_trigger"
        ) as HTMLElement;
        element.click();
      }
      if (locationInfo.mode === "REMAINDER_CALENDER") {
        let element: HTMLElement = document.getElementById(
          "remainderauto_trigger"
        ) as HTMLElement;
        element.click();
      }
    }, 5000);
  }

  getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe(
        async (res) => {
          let response = await this.coreService.decryptObjectData({
            data: res,
          });
          console.log("RESPONSE===>", response);
          this.ansjson = response?.data?.otherinfo?.ANSJSON;
          this.profile = response?.data?.patinetDetails;
          this.patientAllDetails = response?.data?.patientAllDetails?.personalDetails
          console.log("patinetDetails===>", this.profile);
          this.appointmentDetails = response?.data?.appointmentDetails;
          this.appointment_type =
            response?.data?.appointmentDetails?.consultationType;
          this.formatted_appointment_type = response?.data?.appointmentDetails?.consultationType.replace(/_/g, ' ');

          this.location_id = this.location_id =
            this.appointmentDetails?.hospital_details?.hospital_id;
          this.appointmentPayment =
            response?.data?.appointmentDetails?.paymentStatus;
          this.patientProfile = response?.data?.patinetDetails?.patient_profle;
          this.consultationFee = await response?.data?.appointmentDetails
            ?.consultationFee;
          this.paymentType = await response?.data?.appointmentDetails
            ?.paymentType;
          this.paymentDetails.push(
            response?.data?.appointmentDetails?.paymentdetails
          );
          this.patient_id =
            response?.data?.patientAllDetails?.portalUserDetails?._id;
          this.doctorId = response?.data?.appointmentDetails?.doctorId;
          this.consultationDate = response?.data?.appointmentDetails?.date;
          this.assignedStaff = response?.data?.assignedStaff;
          this.appointmentStatus = response?.data?.appointmentDetails?.status;
          this.primarySubscriberId = await response?.data?.patientAllDetails
            ?.insuranceDetails?.primary_subscriber_id;
          console.log(this.primarySubscriberId);
          this.consulatationData =
            response?.data?.appointmentDetails?.consultationData;

          const dateString = this.appointmentDetails?.date;
          const date = new Date(dateString);
          const formattedDate = date.toString();


          this.maxDate = new Date(formattedDate);
          this.value = new Date(formattedDate);
          this.dateForSlot = new Date(formattedDate);
          this.choose_slot = this.appointmentDetails?.time;

          this.subsciberId = await response?.data?.appointmentDetails
            ?.subscriberId;
          if (
            this.subsciberId != undefined &&
            this.subsciberId != "" &&
            this.subsciberId != null
          ) {
            this.getPlanDetails(this.subsciberId);
            this.findSubscriberDetails(this.subsciberId);
          }

          this.assignedStaff.forEach((staff) => {
            this.selectedStaff.push(staff?.staff_portal_id);
          });

          this.operatingDoctorDetails = response?.data?.doctor_basic_info;

          // this.appointmentDetails = response?.data?.result;
          // this.patient_id = response?.data?.result?.patientId;
          // this.selectedStaff = response?.data?.result?.assigned_staff;

          // this.appointmentStatus = response?.data?.result?.status;
          // this.consultationDate = response?.data?.result?.consultationDate;

          this.getCommonData();
          this.getPatientDetails();
          this.getStaffList();
          this.updatePaymentDetails();

          if (
            this.appointmentStatus === "Upcoming" ||
            this.appointmentStatus === "Today"
          ) {
            // this.doctorDetails();
          }

          if (this.appointmentStatus === "Past") {
            this.getEprescription();
          }
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.message);
        }
      );
  }

  addConsulatationNotes(type: string) {
    console.log("typetype=====>", type);

    this.openVerticallyCenteredapproved(this.consultationModal);
  }

  private async updatePaymentDetails() {
    if (this.paymentDetails != "" && this.paymentDetails != null) {
      console.log(" this.paymentDetails", this.paymentDetails);

      for await (const iterator of this.paymentDetails) {
        console.log(iterator, "iterator");
        if (iterator.serviceId !== null) {
          this.selectedService = iterator.serviceId;
          this.selectedcategoryName = iterator.catoegory;
          this.serviceValue = iterator.reimburstment_rate;
          this.consultationFee = iterator.doctorFees;

          this.copayment = this.transformDecimal(iterator.copay);
          this.insurancePay = iterator.insuranceTobePaid;

          this.consultationForm.patchValue({
            comment: iterator.comment,
          });
        } else {
          this.consultationFee = iterator.doctorFees;

          this.consultationForm_nothaveInsurnace.patchValue({
            comment: iterator.comment,
          });
        }


      }
    }
  }

  private transformDecimal(num) {
    console.log("numnumnum", num);

    return this.DecimalPipe.transform(num, '1.2-2').replace(',', '');
    // return num.toFixed(2);
  }





  findSubscriberDetails(subscriberId: any = "") {
    // console.log(subscriberId,'findSubscriberDetails');

    if (subscriberId != "") {
      let param = {
        subscriber_id: subscriberId,
      };
      console.log(param, "findSubscriberDetails");
      // return;
      this.patientService.getSubscriberDetails(param).subscribe({
        next: async (res) => {
          let result = await this.coreService.decryptContext(res);

          this.subscriberDetails.push(result.body.subscriber_details);
          console.log(this.subscriberDetails, "findSubscriberDetails");
        },
      });
    }
  }

  getPatientDetails() {
    let params = {
      patient_id: this.patient_id,
      doctor_id: this.doctorId,
    };
    this.patientService.profileDetails(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("response======>", response?.body);

      this.isVitals = response?.body?.vitalPermission; //based on perminssions
      this.isCurrentMedicines = response?.body?.currentMedicinePermission;
      this.isPastMedicines = response?.body?.pastMedicinePermission;
      this.isImmunizations = response?.body?.immunizationPermission;
      this.isHistory = response?.body?.historyDetails;
      this.isMedicalDocument = response?.body?.medicalDocument;
      console.log("response======>", this.isHistory);
      this.vitals = {
        patient_id: this.patient_id,
        vitals: response?.body?.vitalsDetails,
        bloodGroups: this.bloodGroupList,
      };

      this.medicines = {
        patient_id: this.patient_id,
        medicines: response?.body?.medicineDetails,
        isMedicines: {
          isCurrentMedicines: this.isCurrentMedicines,
          isPastMedicines: this.isPastMedicines,
        },
      };

      this.immunizations = {
        patient_id: this.patient_id,
        immunizations: response?.body?.immunizationDetails,
      };

      this.history = {
        patient_id: this.patient_id,
        history: response?.body?.historyDetails,
      };

      this.medicalDocuments = {
        patient_id: this.patient_id,
        documents: response?.body?.medicalDocument,
      };

      // console.log("PATIENT DETAILS=====>", response);
      // this.profile = {
      //   ...response?.body?.personalDetails,
      //   ...response?.body?.portalUserDetails,
      //   ...response?.body?.locationDetails,
      // };
      this.isVisible = true;
      this.getCountryList();
    });
  }



  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.profile?.country) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  refreshDetails(fromChild: any) {
    if (fromChild === "refresh") {
      this.getPatientDetails();
    }
  }

  getStaffList() {
    if(this.portal_type){
      let reqData = {
        portalId: this.portalId,
        page: 1,
        limit: 1000000,
        searchText: this.serachText,
        role: "",
        type: this.portal_type
      };
  
      this.fourPortalService.getAllStaff(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.staffList = [];
        response?.body[0]?.paginatedResults.forEach((element) => {
          this.staffList.push({
            name: element?.name,
            role: element?.roles?.name,
            id: element?.for_portal_user,
            mobile: element?.portalusers?.mobile,
          });
        });
      });
    }else{

      let reqData = {
        hospitalId: this.doctorId,
        page: 1,
        limit: 1000000,
        searchText: this.serachText,
        role: "",
      };
  
      this.indiviualDoctorService.getAllStaff(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Satff list==>", response);
        this.staffList = [];
        response?.body[0]?.paginatedResults.forEach((element) => {
          this.staffList.push({
            name: element?.profileinfos?.name,
            role: element?.roles?.name,
            id: element?.for_portal_user,
            mobile: element?.portalusers?.mobile,
          });
        });
      });
    }
  }

  returnClass(id: string) {
    let isPresent = this.selectedStaff.filter((ele) => ele == id);
    if (isPresent.length === 0) {
      return "";
    } else {
      return "active";
    }
  }

  handleSearch(text: any) {
    console.log(text);
    this.serachText = text;
    this.getStaffList();
  }

  handleSelectStaff(id: any) {
    let result = this.selectedStaff.filter((ele, index) => ele == id);

    if (result.length === 0) {
      this.selectedStaff.push(id);
    } else {
      this.selectedStaff.forEach((element, index) => {
        if (element == id) {
          this.selectedStaff.splice(index, 1);
        }
      });
    }

    console.log("Array==>", this.selectedStaff);
  }

  getCommonData() {
    this.patientService.commonData().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.genderList = response?.body?.gender;
      this.bloodGroupList = response?.body?.bloodGroup;
      this.martialStatusList = response?.body?.martialStatus;
      this.spokenLanguageList = response?.body?.spokenLanguage;
      this.relationshipList = response?.body?.relationship;
    });
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
      keyboard: false,
      backdrop: false,
    });
  }

  //  Reject modal
  rejectModal: any;
  openVerticallyCenteredreject(reject: any) {
    this.rejectModal = this.modalService.open(reject, {
      centered: true,
      size: "md",
      windowClass: "reject_data",
      keyboard: false,
      backdrop: false,
    });
  }

  // Reason Modal
  openVerticallyCenteredcancelappointment(cancelappintmentcontent: any) {
    this.rejectModal.close();
    this.modalService.open(cancelappintmentcontent, {
      centered: true,
      size: "lg",
      windowClass: "cancel_appointment",
    });
  }

  openVerticallyCenteredconfirmationappointment(confirmationMessage: any) {
    this.modalService.open(confirmationMessage, {
      centered: true,
      size: "lg",
      windowClass: "end_appointment",
    });
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  //-------Form Array Handling--------------->
  newRemainderForm(): FormGroup {
    return this.fb.group({
      minutes: ["", [Validators.required]],
      hours: ["", [Validators.required]],
    });
  }

  newRemainderDTForm(): FormGroup {
    return this.fb.group({
      dateTime: ["", [Validators.required]],
    });
  }

  get remainderrr1(): FormArray {
    return this.remainderForm.get("remainderrr") as FormArray;
  }
  get remainderDT(): FormArray {
    return this.remainderForm.get("remainderDT") as FormArray;
  }

  // remainder
  addnewRemainder() {
    this.remainderrr1.push(this.newRemainderForm());
  }
  removeRemainder(i: number) {
    this.remainderrr1.removeAt(i);
  }
  // remainderDT
  addnewRemainderDT() {
    this.remainderDT.push(this.newRemainderDTForm());
  }
  removeRemainderDT(i: number) {
    this.remainderDT.removeAt(i);
  }

  // Remainder Modal
  openVerticallyCenteredremainder(remaindermodal: any) {
    this.getReminders(this.appointmentId);
    this.remainderForm.reset();
    this.remainderrr1.clear();
    this.remainderDT.clear();

    this.addnewRemainder();
    this.addnewRemainderDT();
    this.modalService.open(remaindermodal, { centered: true, size: "lg" });
  }

  setReminderSave() {
    let reminderData = [];
    let reminderData2 = [];
    console.log("  this.remainderForm.value.", this.remainderForm.value);

    if (
      this.remainderForm.value.remainderrr &&
      this.remainderForm.value.remainderrr.length > 0
    )
      this.remainderForm.value.remainderrr.forEach((el) => {
        reminderData.push({ hours: el?.hours, minutes: el?.minutes });
      });
    if (
      this.remainderForm.value.remainderDT &&
      this.remainderForm.value.remainderDT.length > 0
    )
      this.remainderForm.value.remainderDT.forEach((el) => {
        console.log("el===", el);

        reminderData2.push({
          datetime: el.dateTime,
        });
      });

    let reqData = {
      appointment_id: this.appointmentId,
      doctorId: this.doctorId,
      patientId: this.patient_id,
      format: "hours",
      time_reminder_data: reminderData,
      datetime_reminder_data: reminderData2,
    };

    console.log("REQDATA FOR REMIENDER==>", reqData);

    this.patientService.setReminder(reqData).subscribe((res: any) => {
      let data = this.coreService.decryptObjectData({ data: res });
      this.remainderForm.reset();
      this.modalService.dismissAll();
      this.toastr.success(data.message);
      // this.getAppointmentlist();
    });
  }

  getReminders(appointmentId: any) {
    let data = {
      appointment_id: appointmentId,
    };
    this.patientService.getRemindersData(data).subscribe((res: any) => {
      let data = this.coreService.decryptObjectData({ data: res });
      console.log("GET REMENDER===>", data);
      var timeData = [];
      for (let i = 0; i < data?.data?.data?.time_reminder_data?.length; i++) {
        var timeDataValue = data?.data?.data?.time_reminder_data[i];

        if (i > 0) {
          this.addnewRemainder();
        }
        let dataObj = {
          minutes: timeDataValue.minutes,
          hours: timeDataValue.hours,
        };
        timeData.push(dataObj);
      }

      var dateData = [];
      for (
        let i = 0;
        i < data?.data?.data?.datetime_reminder_data?.length;
        i++
      ) {
        var timeDataValue1 =
          data?.data?.data?.datetime_reminder_data[i].datetime;

        if (i > 0) {
          this.addnewRemainderDT();
        }
        let dataObj = {
          dateTime: timeDataValue1,
        };
        dateData.push(dataObj);
      }


      this.remainderForm.patchValue({
        remainderrr: timeData,
      });
      this.remainderForm.patchValue({
        remainderDT: dateData,
      });

      console.log("AFTER PATCH====>", this.remainderForm.value)
    });
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  //------------Reschedule work--------------------------------

  doctorDetails() {
    let param = { doctor_portal_id: this.doctorId };
    // let param = { doctor_portal_id: "63e2493509a65d0de48c70c8" };
    console.log("PARAMS===>", param);
    this.indiviualDoctorService.doctorDetails(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptObjectData({ data: res });
        console.log("DOCTOR DETAILS===>", result);

        this.doctordetailsData = result.body?.data;
        this.doctorRating = result.body?.doctor_rating;
        this.doctor_availability = result.body?.data.in_availability;
        this.hospital_location = result.body?.data?.hospital_location;
        // this.location_id = this.location_id =
        //   result.body?.data.hospital_location[0].hospital_id;

        this.doctorAvailableSlot();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async openVerticallyCenteredrechedule(choosedate: any) {
    const dateString = this.appointmentDetails?.date;
    const date = new Date(dateString);
    const formattedDate = date.toString();

    this.value = new Date(formattedDate);
    this.dateForSlot = new Date(formattedDate);
    this.choose_slot = this.appointmentDetails?.time;

    this.getNextAvailablleSlot(this.appointmentId);
    this.doctorDetails();

    this.modalService.open(choosedate, {
      centered: true,
      size: "lg",
      windowClass: "choose_date",
    });
  }

  getNextAvailablleSlot(id: any) {
    this.indiviualDoctorService.nextAvailableSlot(id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("AVAILABLE SLOT===>", response);
      if (response.status) {
        this.nearestAvailableSlot = response?.body?.slot?.slot;
        this.nearestAvailableDate = response?.body?.timeStamp;
      }
    });
  }

  openVerticallyCenteredChooseDateTime(chooseCalender: any) {
    // this.isOpen = false;
    this.nearestAvailableSlot = "";
    this.modalService.dismissAll();
    this.modalService.open(chooseCalender, {
      centered: true,
      size: "xl",
      windowClass: "select_datetime",
    });
  }

  public onSelection(data: any) {
    if (data.date) {
      const date = new Date(data.date);
      date.setHours(date.getHours() + 5, date.getMinutes() + 30); //adding 5.30 hr extra to get proper date
      const isoString = date.toISOString();
      this.dateForSlot = isoString;

      const inputDate = new Date(this.currentDate);
      const formattedDate = this.datePipe.transform(inputDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
      console.log(formattedDate, "DATE===>", this.dateForSlot);
      console.log("DATE===>", this.dateForSlot >= formattedDate);

      if (this.dateForSlot >= formattedDate) {
        console.log("IFF");
      } else {
        this.toastr.error('Unable to continue, Please select future date');
        return;
      }
    } else if (data.type) {
      this.appointment_type = data.type;
      console.log(this.appointment_type);
    } else {
      this.location_id = data.locationid;
    }

    this.doctorAvailableSlot();
  }

  doctorAvailableSlot() {
    console.log("daata", this.dateForSlot);
    let param = {
      locationId: this.location_id,
      appointmentType: this.appointment_type,
      timeStamp: this.dateForSlot,
      doctorId: this.doctorId,
    };

    console.log("param", param);

    this.indiviualDoctorService.doctorAvailableSlot(param).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.doctorAvailableTimeSlot = result.body.allGeneralSlot;
        console.log("doctorAvailableSlot", this.doctorAvailableTimeSlot);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleSelectSlot(slot: any) {
    console.log(slot);
    this.choose_slot = slot;
  }

  handleRescheduleAppointment(isNextAvailable: any) {
    let reqData = {
      appointmentId: this.appointmentId,
      rescheduleConsultationDate:
        isNextAvailable === "no"
          ? new DatePipe("en-US").transform(this.dateForSlot, "yyyy-MM-dd")
          : new DatePipe("en-US").transform(
            this.nearestAvailableDate,
            "yyyy-MM-dd"
          ),

      rescheduleConsultationTime:
        isNextAvailable === "no" ? this.choose_slot : this.nearestAvailableSlot,
      rescheduled_by: "doctor",
      rescheduled_by_id: this.doctorId,
    };

    console.log(reqData, "reqData");

    // return;

    this.indiviualDoctorService
      .rescheduleAppointment(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log(response);
        if (response.status) {
          this.modalService.dismissAll("close");
          this.toastr.success(response.message);
          this.getAppointmentDetails();
        }
      });
  }

  viewOtherPastAppointment(fromChild: any) {
    if (fromChild === "refresh") {
      window.location.reload();
      // let paramId = this.activatedRoute.snapshot.paramMap.get("id");
      // this.appointmentId = paramId;
      // this.getAppointmentDetails();
    }
  }

  public openPDF(): void {
    window.location.href = this.templateSigneUrl;
  }


  eprescriptionDetails: any;
  isPrescriptionValidate: boolean = false;
  templateSigneUrl: any = "";

  async getEprescription() {

    if(this.portal_type){
      let reqData = {
        appointmentId: this.appointmentId,
        portal_type: this.portal_type
      };
  
      this.fourPortalService.fourPortal_get_ePrescription(reqData)
        .subscribe(async (res) => {
          let response = await this.coreService.decryptObjectData({ data: res });
          if (response.status == true) {
            this.eprescriptionDetails = response?.body;
            this.isPrescriptionValidate = response?.body?.isValidate;
            this.templateSigneUrl = response?.body?.previewTemplateSigendUrl;
            // this.getAllMedicineDosage(response?.body?._id);
            this.getAllEprescriptionsTests();
          }
        });
    }else{
      let reqData = {
        appointmentId: this.appointmentId,
      };
  
      this.indiviualDoctorService
        .getEprescription(reqData)
        .subscribe(async (res) => {
          let response = await this.coreService.decryptObjectData({ data: res });
  
          console.log("Eprescription Get====>", response);
  
          if (response.status == true) {
            this.eprescriptionDetails = response?.body;
            this.isPrescriptionValidate = response?.body?.isValidate;
            this.templateSigneUrl = response?.body?.previewTemplateSigendUrl;
            // this.getAllMedicineDosage(response?.body?._id);
            this.getAllEprescriptionsTests();
          }
        });
    }
   
  }

  ngOnDestroy() {
    this.subject$.complete();
  }

  getAllEprescriptionsTests() {
    if(this.portal_type){
      let reqData = {
        appointmentId: this.appointmentId,
        portal_type: this.portal_type
  
      };
      this.fourPortalService.fourPortal_get_all_testEprescription(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status == true) {
            let data = response?.body[0];
            //For MEdicine Dosage
            this.allDosagess = data?.dosages;
  
            data?.dosages.forEach(async (element) => {
              let obj = {
                _id: element?.medicineId,
                medicine_name: element?.medicine_name,
              };
  
              let result = this.listMedicineDosagess.filter((s) =>
                s?.medicine_name.includes(element.medicine_name)
              );
              if (result.length === 0) {
                this.listMedicineDosagess.push(obj);
              }
            });
  
            this.labs = data?.labs;
            this.imaging = data?.imaging;
            this.vaccination = data?.vaccinations;
            this.eyeglasses = data?.eyeglasses;
            this.others = data?.others;
  
            this.totalCounts =
              this.listMedicineDosagess?.length +
              this.labs?.length +
              this.vaccination?.length +
              this.others?.length +
              this.eyeglasses?.length +
              this.imaging?.length;
          }
        });
    }else{

      let reqData = {
        appointmentId: this.appointmentId,
      };
      this.indiviualDoctorService
        .getAllEprescriptionTests(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("All Tests---->", response);
          if (response.status) {
            let data = response?.body[0];
            //For MEdicine Dosage
            this.allDosagess = data?.dosages;
  
            data?.dosages.forEach(async (element) => {
              let obj = {
                _id: element?.medicineId,
                medicine_name: element?.medicine_name,
              };
  
              let result = this.listMedicineDosagess.filter((s) =>
                s?.medicine_name.includes(element.medicine_name)
              );
              if (result.length === 0) {
                this.listMedicineDosagess.push(obj);
              }
            });
  
            this.labs = data?.labs;
            this.imaging = data?.imaging;
            this.vaccination = data?.vaccinations;
            this.eyeglasses = data?.eyeglasses;
            this.others = data?.others;
  
            this.totalCounts =
              this.listMedicineDosagess?.length +
              this.labs?.length +
              this.vaccination?.length +
              this.others?.length +
              this.eyeglasses?.length +
              this.imaging?.length;
          }
        });
    }

  }

  returnDosagesForMedicine(medicineName) {
    let doseArray = [];
    let statementArray = [];
    this.allDosagess.forEach((dose) => {
      if (dose.medicine_name === medicineName) {
        doseArray.push(dose);
      }
    });

    doseArray.forEach((dose) => {
      if (
        dose?.quantities?.quantity_type === "Exact_Quantity" ||
        dose?.quantities?.quantity_type === "Enough_Quantity"
      ) {
        if (dose?.frequency?.frequency_type === "Moment") {
          let statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Morning(${dose?.frequency?.morning}), Midday(${dose?.frequency?.midday}), Evening(${dose?.frequency?.evening}), Night(${dose?.frequency?.night}) for ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
          statementArray.push(statement);
        }

        if (
          dose?.frequency?.frequency_type === "Recurrence" ||
          dose?.frequency?.frequency_type === "Alternate_Taking"
        ) {
          let statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Medicines(${dose?.frequency?.medicine_quantity}) for every ${dose?.frequency?.every_quantity} ${dose?.frequency?.type},  ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
          statementArray.push(statement);
        }
      }
    });

    return statementArray;
  }


  getDirection() {
    const lat = this.profile?.loc?.lat; // Replace with desired latitude
    const lng = this.profile?.loc?.long; // Replace with desired longitude

    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, "_blank");
  }


  // Import necessary modules and services





  getPortalTypeAndInsuranceId(insuranceId: any) {
    this.categoryList = [];
    let data = {
      insuranceId: insuranceId,
      portalType: 'Doctor'
    };
    if (this.insuranceId != null) {
      this.pharmacySerivice.getPortalTypeAndInsuranceId(data).subscribe({
        next: (res) => {

          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);
          console.log(result, "result__________");

          this.categoryData = result.body.result[0].categoryName;

          console.log(this.categoryData, "reslut");

          this.categoryData.map((curentval: any) => {
            let checkCategoryData = this.categoryList.filter(obj => obj.lebel == curentval && obj.value == curentval);
            console.log("working service value ")

            if (checkCategoryData.length === 0) {
              this.categoryList.push({
                label: curentval,
                value: curentval,
              });

              console.log("working service value 2", checkCategoryData.length)


            }


          });


        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    }

  }
  getCategoryId(event: any) {
    console.log("event_____", event);

    if (event.value != undefined) {
      this.serviceList = [];

      this.categoryObject = event.value

      if (this.planService.length > 0) {
        this.planService.forEach((data) => {
          console.log("data______", data);

          if ((data.has_category).toLowerCase() == (event.value).toLowerCase()) {

            this.serviceList.push({
              label: data.service,
              value: data._id,
            })


          }
        })
      }
    }
  }




  get4portalAppointmentDetails() {
    let reqData = {
      appointment_id: this.appointmentId,
      portal_type: this.portal_type
    }
    this.fourPortalService
      .fourPortal_appointment_deatils(reqData)
      .subscribe(
        async (res) => {
          let response = await this.coreService.decryptObjectData({
            data: res,
          });
          console.log("response________________", response);

          this.ansjson = response?.data?.otherinfo?.ANSJSON;
          this.profile = response?.data?.patinetDetails;
          this.patientAllDetails = response?.data?.patientAllDetails?.personalDetails

          this.appointmentDetails = response?.data?.appointmentDetails;
          this.appointment_type =
            response?.data?.appointmentDetails?.consultationType;
          this.formatted_appointment_type = response?.data?.appointmentDetails?.consultationType.replace(/_/g, ' ');

          this.location_id = this.location_id =
            this.appointmentDetails?.hospital_details?.hospital_id;
          this.appointmentPayment =
            response?.data?.appointmentDetails?.paymentStatus;
          this.patientProfile = response?.data?.patinetDetails?.patient_profle;
          this.consultationFee = await response?.data?.appointmentDetails
            ?.consultationFee;



          this.paymentType = await response?.data?.appointmentDetails
            ?.paymentType;
          const newPaymentDetails = response?.data?.appointmentDetails?.paymentdetails;
          if (newPaymentDetails == null) {

            this.paymentDetails.push(newPaymentDetails);
          } else {
            this.paymentDetails.pop(); // Remove the null value
            this.paymentDetails.push(newPaymentDetails); // Push the new value
          }
          // this.paymentDetails.push(
          //   response?.data?.appointmentDetails?.paymentdetails
          // );
          console.log("this.paymentDetails____________", this.paymentDetails);

          this.patient_id =
            response?.data?.patientAllDetails?.portalUserDetails?._id;
          this.portalId = response?.data?.appointmentDetails?.portalId;
          this.consultationDate = response?.data?.appointmentDetails?.date;
          this.assignedStaff = response?.data?.assignedStaff;
          this.appointmentStatus = response?.data?.appointmentDetails?.status;
          this.primarySubscriberId = await response?.data?.patientAllDetails
            ?.insuranceDetails?.primary_subscriber_id;
          this.consulatationData =
            response?.data?.appointmentDetails?.consultationData;

          const dateString = this.appointmentDetails?.date;
          const date = new Date(dateString);
          const formattedDate = date.toString();


          this.maxDate = new Date(formattedDate);
          this.value = new Date(formattedDate);
          this.dateForSlot = new Date(formattedDate);
          this.choose_slot = this.appointmentDetails?.time;

          this.subsciberId = await response?.data?.appointmentDetails
            ?.subscriberId;
          if (
            this.subsciberId != undefined &&
            this.subsciberId != "" &&
            this.subsciberId != null
          ) {
            this.getPlanDetails(this.subsciberId);
            this.findSubscriberDetails(this.subsciberId);
          }

          this.assignedStaff.forEach((staff) => {
            this.selectedStaff.push(staff?.staff_portal_id);
          });

          this.operatingDoctorDetails = response?.data?.doctor_basic_info;

          this.getCommonData();
          this.getPatientDetails();
          this.getStaffList();
          this.updatePaymentDetails();
          if (
            this.appointmentStatus === "Upcoming" ||
            this.appointmentStatus === "Today"
          ) {
            // this.fourportal_Details();
          }

          if (this.appointmentStatus === "Past") {
            this.getEprescription();
          }
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.message);
        }
      );
  }

}
