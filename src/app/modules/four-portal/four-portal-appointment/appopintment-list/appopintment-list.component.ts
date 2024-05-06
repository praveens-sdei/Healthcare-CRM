import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { PatientService } from "src/app/modules/patient/patient.service";
import { DatePipe } from "@angular/common";
import { ThemePalette } from "@angular/material/core";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";

export interface PeriodicElement {
  dateofcreations: string;
  patientname: string;
  assigndoctorname: string;
  orderid: string;
  dateandtime: string;
  location: string;
  appointmentstype: string;
  reasonforappt: string;
  fee: string;
  status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-appopintment-list',
  templateUrl: './appopintment-list.component.html',
  styleUrls: ['./appopintment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppopintmentListComponent implements OnInit {
  showscheduler: any = false;

  appointments = new FormControl("");
  appointmentList: string[] = ["ONLINE", "FACE_TO_FACE", "HOME_VISIT"];

  displayedColumns: string[] = [
    "dateofcreations",
    "patientname",
    "assigndoctorname",
    "dateandtime",
    "location",
    "appointmentstype",
    "reasonforappt",
    "fee",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isSubmitted: boolean = false;
  appointmentId: any = "";
  allAppointmentList: any[] = [];
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  selectedStatus: any = "ALL";
  dateFilter: any = "";
  manageStatus: any = "";
  Fromdate: any;
  ToDate: any;
  dateCancelAppointmentForm: any = FormGroup;
  scheduleForm: any = FormGroup;
  remainderForm: any = FormGroup;
  portal_id: any = "";
  userRole: any = "";
  for_portal_user: any = "";
  patient_id: any = "";

  dateForSlot: any = new Date();
  appointment_type: any = "";
  location_id: any = "";
  doctor_availability: any[] = [];
  doctorAvailableTimeSlot: any[] = [];
  hospital_location: any[] = [];
  doctordetailsData: any = {};
  doctorRating: any;
  nearestAvailableSlot: any;
  nextAvailableDate: any;
  consultationDate: any;

  isOpen = false;
  seletectedLocation: any = "";
  selectedLocationId: any = "";

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = -1;
  sortIconClass: string = 'arrow_upward';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("canceldaterangeappointment")
  canceldaterangeappointment: ElementRef;
  @ViewChild("rejectappointment") rejectappointment: ElementRef;

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
  public dateControl = new FormControl();
  public dateControlMinMax = new FormControl(new Date());

  public options = [
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];

  public listColors = ["primary", "accent", "warn"];

  public stepHours = [];
  public stepMinutes = [];
  public stepSeconds = [];

  timeHourValue: any = [
    { name: "0 Hour", value: 0 },
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
    { name: "59  Minute", value: 59 }
  ];
  assign_doctor_depart: any;
  listData: any;
  login_portal_id: any = [];
  assign_doctor_services: any;
  assign_doctor_unit: any;

  showAssignDoctorColumn: boolean = false;
  doctor_name: any;
  assign_Doctor: any;
  selectedDoctorId: any;
  portalId: any[];
  indi_doc_staffId: any;
  doctor__Id: any[];
  private _doctor_Id: any[];
  new_doctor_id: any;
  get_doctorId: any;
  user_id: any;
  currentDate: any = new Date();
  doctor_staff: any;
  userType: any;
  speciality: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  userID: any = "";
  choose_slot: any;
  value = new Date();
  innerMenuPremission:any=[];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private doctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
    private _patientService: PatientService,
    private datePipe: DatePipe,
    private fourPortalService: FourPortalService,
  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.user_id = loginData?._id
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    
    this.userType = loginData?.type
    this.userRole = loginData?.role;


    this.assign_doctor_depart = adminData?.department;
    this.assign_doctor_services = adminData?.services;
    this.assign_doctor_unit = adminData?.unit;
    this.assign_Doctor = adminData?.for_doctor;


    if (this.userRole === "INDIVIDUAL" || this.userRole === "HOSPITAL") {
      this.portal_id = loginData?._id;
    } else if (this.userRole === "STAFF"){
      this.portal_id = adminData?.creatorId;
    }

    this.for_portal_user = adminData?.in_hospital;

    this.login_portal_id = [];

    if (this.userRole === "INDIVIDUAL" || this.userRole === "HOSPITAL") {
      this.login_portal_id.push(this.portal_id);
      this.getAppointmentlist(`${this.sortColumn}:${this.sortOrder}`);
    } else if (this.userRole === "STAFF"){
      this.login_portal_id = adminData?.creatorId;
      this.getAppointmentlist(`${this.sortColumn}:${this.sortOrder}`);

    }
    // else {
    //   this.login_portal_id.push(this.portal_id);
    //   this.getAppointmentlist(`${this.sortColumn}:${this.sortOrder}`);
    // }


    this.dateCancelAppointmentForm = this.fb.group({
      appoint: [""],
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]],
    });

    this.remainderForm = this.fb.group({
      remainderrr: this.fb.array([]),
      remainderDT: this.fb.array([]),
    });

    this.scheduleForm = this.fb.group({
      hospital_location: [""],
      appointment_typed: [""],
    });

    // public scheduleForm: FormGroup = new FormGroup({
    //   hospital_location: new FormControl(""),
    //   appointment_typed: new FormControl(),
    // });
  }
  showschedule(type) {
    this.showscheduler = type;
    if (type == false) {
      this.getAppointmentlist();
    }
  }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAppointmentlist(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((val: any) => {
      if (val.id || val.type) {
        this.selectedStatus = val.id;
        this.consultationType = val.type;
      }
    });

    
    const dateObject1 = new Date(this.currentDate);
    dateObject1.setHours(0, 0, 0, 0);

    this.currentDate = dateObject1;
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

        } else {
          console.log(`does not exist in the object.`);
        }

      }else{
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }

        this.innerMenuPremission = innerMenu;
        console.log("this.innerMenuPremission_______________-",this.innerMenuPremission);
        
      }      
    }  
    

  }
  giveInnerPermission(value){
    if(this.userRole === "STAFF" || this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }

  
  }



  async checkForPlan() {

    let isPurchased = await this.fourPortalService.isPlanPurchesdByfourPortal(
      this.userID, this.userType
    ); //check fot purchased plan


    if (!isPurchased) {
      // this.modalService.open(this.confirmationModel);
      this.coreService.showError(
        "No plan purchsed! Please purches new plan",
        ""
      );
      this.router.navigate([`/portals/subscriptionplan/${this.userType}`]);
      return;
    }
  }

  get f() {
    return this.dateCancelAppointmentForm.controls;
  }


  // allapointmentlist
  async getAppointmentlist(sort: any = '') {

    let reqData = {
      portal_id: this.login_portal_id,
      limit: this.pageSize,
      page: this.page,
      status: this.selectedStatus,
      consultation_type: this.consultationType,
      date: this.dateFilter,
      sort: sort,
      portal_type: this.userType
    };

    this.fourPortalService.fourPortal_appointment_list(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);
      this.dataSource = response?.data?.data;
      console.log(this.dataSource, "check dataSource");

      this.allAppointmentList = response?.data?.data;
      this.new_doctor_id = response?.data?.data.map((ele) => {
        return ele.portalId;
      })

      this.totalLength = response?.data?.totalCount;

    });
  }

  // get assigndoctor department,service and unit for hospital staff
  async getDoctor(doctor_list) {

    let reqData = {
      in_hospital: this.portal_id,
      doctor_list: doctor_list,
      departmentArray: this.assign_doctor_depart,
      unitArray: this.assign_doctor_unit,
      serviceArray: this.assign_doctor_services
    }

    this.doctorService.getdepartmentAsperDoctor(reqData).subscribe({

      next: async (result: IResponse<any>) => {
        let response = await this.coreService.decryptObjectData({ data: result });

        if (response.status == true) {
          this.listData = response?.body?.data.map((assDoc_is: any) => {
            if (this.login_portal_id.indexOf(assDoc_is.for_portal_user) == -1) {
              this.login_portal_id.push(assDoc_is.for_portal_user);
            }

          })
          // this.getAssignDoctorDetails();
          this.getAppointmentlist();

        }

      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        if (err.message === "INTERNAL_SERVER_ERROR") {
          this.coreService.showError("", err.message);
        }
      },

    })
  }

  // get assigndoctor details for hospital staff

  getAssignDoctorDetails() {
    let reqData = {
      doctor_ids: this.login_portal_id
    }

    this.doctorService.postAssignDoctor(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);

      if (response.status == true) {
        this.doctor_name = response?.body?.data

      }

    });
  }


  // multiple-Cancel-appointment
  handleCancelMultipleAppointment(status: any, reason: any) {


    const inputDate_Fromdate = new Date(this.dateCancelAppointmentForm.value.fromDate);
    const formattedDate_Fromdate = this.datePipe.transform(inputDate_Fromdate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');

    const inputDate_Todate = new Date(this.dateCancelAppointmentForm.value.toDate);
    const formattedDate_todate = this.datePipe.transform(inputDate_Todate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');

    let reqData = {
      cancelReason: reason,
      status: status,
      cancelledOrAcceptedBy: this.portal_id,
      loginId: this.userID,
      fromDate: formattedDate_Fromdate.split("T")[0],
      toDate: formattedDate_todate.split("T")[0],
      consultationType: this.appointments.value,
     
    };


    this.fourPortalService
      .fourPortal_cancel_approved_appointment(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this.coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.toastr.success(response.message);
          this.getAppointmentlist();
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
  }
  // single-Cancel-appointment
  handleCancelSingleAppointment(reason: any) {
    // this.doctor__Id = []; 

    // if (this.userRole === "INDIVIDUAL_DOCTOR" || this.userRole === "HOSPITAL_DOCTOR") {
    //   this.doctor__Id.push(this.portal_id);

    // } else if (this.userRole === "HOSPITAL_STAFF") {
    //   this.doctor__Id.push(this.get_doctorId);
    // }
    // else if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
    //   this.doctor__Id.push(this.portal_id);
    // }
    let reqData = {
      appointment_id: this.appointmentId,
      cancelReason: reason,
      status: this.manageStatus,
      cancelledOrAcceptedBy: this.portal_id,
      loginId: this.userID,
      cancel_by: this.userType
    };
    this.fourPortalService.fourPortal_cancel_approved_appointment(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this.coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.toastr.success(response.message);
          this.getAppointmentlist();
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
  }
  // cancel-appointment-handler
  apiHandler(reason: any, status: any) {
    if (this.appointments.value) {
      this.handleCancelMultipleAppointment(status, reason);
    } else {
      this.approveOrRejectedAppointment(status, reason);
    }
  }

  approveOrRejectedAppointment(status: any, reason: any) {

    let reqData = {
      appointment_id: this.appointmentId,
      cancelReason: reason,
      status: status,
      cancelledOrAcceptedBy: this.user_id,
      loginID: this.portal_id,
      cancel_by:this.userRole
    };
    this.fourPortalService.fourPortal_cancel_approved_appointment(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.closePopup();
          this.toastr.success(response.message);
          this.getAppointmentlist();
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.closePopup();
        this.toastr.error(errResponse.message);
      }
    );
  }

  handleSelectFliterList(event: any) {
    this.selectedStatus = event.value;
    this.getAppointmentlist();
  }

  handleSelectDoctorList(event: any) {

    if (event.value === "ALL") {
      this.getAppointmentlist();

    } else {
      let filterData;
      filterData = this.allAppointmentList.filter((ele) => {
        return ele.doctor_name === event.value
      })
      this.dataSource = filterData
    }


  }
  public onDoctorSelection(data: any) {
    this.selectedDoctorId = data?.value

  }
  consultationType: any = "ALL";

  handleSelectFliterTypeList(event: any) {
    this.consultationType = event.value;
    this.getAppointmentlist();
  }

  handleSelectDateFilter(event: any) {
    let date = this.datePipe.transform(event.value, "YYYY-MM-dd");
    this.dateFilter = date;
    this.getAppointmentlist();
  }

  clearDateFilter() {
    this.dateFilter = "";
    this.getAppointmentlist();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAppointmentlist();
  }
  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.remainderForm.reset();
    this.remainderrr1.clear();
    this.remainderDT.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }



  dateRangeModal: any;

  // Date Range modal modal
  openVerticallyCenteredselectdaterange(select_daterangecontent: any) {
    this.dateCancelAppointmentForm.reset();
    this.dateRangeModal = this.modalService.open(select_daterangecontent, {
      centered: true,
      size: "md",
      windowClass: "date_range",
    });
  }
  handerdaterangeappointment() {
    this.isSubmitted = true;

    if (this.dateCancelAppointmentForm.invalid) {
      this.coreService.showError("", "Please filled all required fields.")
      return;
    }

    this.dateRangeModal.close();

    if (this.dateCancelAppointmentForm.value) {

      this.openVerticallyCenteredcancelDateRange(
        this.canceldaterangeappointment
      );

    } else {
      this.openVerticallyCenteredrejectappointment(this.rejectappointment, "", '');
    }
  }

  //  Cancel Appoinment modal
  openVerticallyCenteredcancelappointment(cancelappintmentcontent: any) {
    if (
      this.dateCancelAppointmentForm.value.fromDate ||
      this.dateCancelAppointmentForm.value.toDate
    ) {
      this.showDateModal.close();
    } else {
      this.rejectModal.close();
    }

    this.modalService.open(cancelappintmentcontent, {
      centered: true,
      size: "lg",
      windowClass: "cancel_appointment",
    });
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any, appointmentId: any, portalId: any) {
    this.appointmentId = appointmentId;
    this.get_doctorId = portalId
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }

  showDateModal: any;
  //  cancel date range appointment modal
  openVerticallyCenteredcancelDateRange(canceldaterangeappointment: any) {
    this.showDateModal = this.modalService.open(canceldaterangeappointment, {
      centered: true,
      size: "md",
      windowClass: "canceldaterangeappointment",
    });
  }

  rejectModal: any;

  //  Reject Appointment modal
  openVerticallyCenteredrejectappointment(
    rejectappointment: any,
    appointment_id: any,
    portalId: any
  ) {
    this.appointmentId = appointment_id;
    this.get_doctorId = portalId

    this.rejectModal = this.modalService.open(rejectappointment, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //-------Form Array Handling--------------->
  newRemainderForm(): FormGroup {
    return this.fb.group({
      minutes: ["", [Validators.required]],
      hours: [""],
    });
  }

  newRemainderDTForm(): FormGroup {
    return this.fb.group({
      dateTime: [""],
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

  openVerticallyCenteredremainder(remaindermodal: any, appointmentData: any) {
    this.appointmentId = appointmentData?.appointment_id;
    const dateString = appointmentData?.consultation_date;
    const date = new Date(dateString);
    const formattedDate = date.toString();

    this.maxDate = new Date(formattedDate);
    this.getReminders(this.appointmentId);
    this.remainderForm.reset();
    this.remainderrr1.clear();
    this.remainderDT.clear();

    this.addnewRemainder();
    this.addnewRemainderDT();
    this.isOpen = false;
    this.modalService.open(remaindermodal, { centered: true, size: "lg" });
  }

  setReminderSave() {
    this.isSubmitted = true;
    if (this.remainderForm.invalid) {
      this.coreService.showError("","Please Fill the required Fields")
      return;
    }
    let reminderData = [];
    let reminderData2 = [];

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

        reminderData2.push({
          datetime: el.dateTime,
        });
      });

    let reqData = {
      appointment_id: this.appointmentId,
      portalId: this.portal_id,
      patientId: this.patient_id,
      format: "hours",
      time_reminder_data: reminderData,
      datetime_reminder_data: reminderData2,
      portal_type: this.userType
    };


    this.fourPortalService.fourPortal_setReminder_Appointment(reqData).subscribe((res: any) => {
      let data = this.coreService.decryptObjectData({ data: res });
      this.remainderForm.reset();
      this.modalService.dismissAll();
      this.toastr.success(data.message);
    });
  }

  getReminders(appointmentId: any) {
    let data = {
      appointment_id: appointmentId,
      portalId: this.portal_id
    };
    this.fourPortalService.fourPortal_getReminder_Appointment(data).subscribe((res: any) => {
      let data = this.coreService.decryptObjectData({ data: res });
      console.log("data_____________",data)
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

    });
  }
  fourPortalDetails(portalId: any = "") {

    let param = { portal_user_id: portalId, type: this.userType };

    // let param = { login_portal_id: "63e2493509a65d0de48c70c8" };

    this.fourPortalService.getProfileDetailsById(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptObjectData({ data: res });

        this.doctordetailsData = result?.data?.result[0];
        this.doctorRating = result?.data?.portal_rating;
        this.doctor_availability = result.data.availabilityArray;
        this.hospital_location = this.doctordetailsData?.in_hospital_location?.hospital_or_clinic_location
        this.speciality = this.doctordetailsData?.specialities?.[0]?.specilization
          ;

        // this.location_id = result.body?.data.hospital_location[0].hospital_id;
        // this.location_id = result.body?.data?.in_availability[0]?.location_id;
        this.portal_AvailableSlot();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //------------Reschedule work--------------------------------

  async openVerticallyCenteredrechedule(choosedate: any, appointmentData: any) {

    this.appointmentId = appointmentData?.appointment_id;
    this.location_id = appointmentData?.hospital_details?.hospital_id;
    this.consultationDate = appointmentData?.consultation_date;
    this.appointment_type = appointmentData?.consultation_type;
    this.choose_slot = appointmentData?.consultation_time;

    const dateString = appointmentData?.consultation_date;
    const date = new Date(dateString);
    const formattedDate = date.toString();

    this.value = new Date(formattedDate);
    this.dateForSlot = new Date(formattedDate);

    this.get_doctorId = appointmentData?.portalId;


    this.fourPortalDetails(appointmentData?.portalId);

    this.getNextAvailablleSlot(this.appointmentId);

    this.modalService.open(choosedate, {
      centered: true,
      size: "lg",
      windowClass: "choose_date",
    });
  }

  getNextAvailablleSlot(id: any) {
    let req = {
      appointmentId: id
    }
    this.fourPortalService.fourPortal_nextAvaiable_slot(req).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.nearestAvailableSlot = response?.body?.slot?.slot;
        this.nextAvailableDate = response?.body?.timeStamp;
      }
    });
  }

  openVerticallyCenteredChooseDateTime(chooseCalender: any) {
    this.nearestAvailableSlot = "";
    this.modalService.dismissAll();
    this.modalService.open(chooseCalender, {
      centered: true,
      size: "xl",
      windowClass: "select_datetime",
    });
  }

  public onSelection(data: any) {
    this.nearestAvailableSlot = "";
    if (data.date) {
      const date = new Date(data.date);
      date.setHours(date.getHours() + 5, date.getMinutes() + 30); //adding 5.30 hr extra to get proper date
      const isoString = date.toISOString();
      this.dateForSlot = isoString;

      const inputDate = new Date(this.currentDate);
      const formattedDate = this.datePipe.transform(inputDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');

      if (this.dateForSlot >= formattedDate) {
      } else {
        this.toastr.error('Unable to continue, Please select future date');
        return;
      }

    } else if (data.type) {
      this.appointment_type = data.type;
    } else {
      this.location_id = data.locationid;
    }

    this.portal_AvailableSlot();
  }

  portal_AvailableSlot() {
    let param = {
      locationId: this.location_id,
      appointmentType:
        this.appointment_type === "Online"
          ? "ONLINE"
          : this.appointment_type === "Home Visit"
            ? "HOME_VISIT"
            : "FACE_TO_FACE",
      timeStamp: this.dateForSlot,
      portal_id: this.portal_id,
      portal_type: this.userType

    };


    this.fourPortalService.portalAvailableSlot(param).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.doctorAvailableTimeSlot = result.body.allGeneralSlot;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleSelectSlot(slot: any) {
    this.choose_slot = slot;
  }

  handleRescheduleAppointment(isNextAvailable: any) {
    let reqData = {
      appointmentId: this.appointmentId,
      rescheduleConsultationDate:
        isNextAvailable === "no"
          ? new DatePipe("en-US").transform(this.dateForSlot, "yyyy-MM-dd")
          : new DatePipe("en-US").transform(
            this.nextAvailableDate,
            "yyyy-MM-dd"
          ),

      rescheduleConsultationTime:
        isNextAvailable === "no" ? this.choose_slot : this.nearestAvailableSlot,
      rescheduled_by: this.userRole,
      rescheduled_by_id: this.portal_id,
    };


    // return;

    this.fourPortalService.fourPortal_reschedule_Appointment(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.modalService.dismissAll("close");
        this.toastr.success(response.message);
        this.getAppointmentlist();
      }
    });
  }


  navigateToAppointmentDetails(appointmentId: any) {
    const navigationExtras = {
      queryParams: {
        type: 'consultationModal',
      },
    };


    this.router.navigate([`/portals/appointment/${this.userType}/appointment-details/${appointmentId}`], navigationExtras);

  }

  goTo_details(id: any) {
    this.router.navigate([`/portals/appointment/${this.userType}/appointment-details/${id}`]);

  }
  routeTOePesrciption(id: any) {
    this.router.navigate([`/portals/eprescription/${this.userType}/details/${id}`],);

  }

  routeTONewApp() {
    this.router.navigate([`/portals/appointment/${this.userType}/create-appointment-for-patient`],);
  }


  submitclaimAppointment(orderId: any, logginId: any) {
    this.router.navigate([`/portals/claims/${this.userType}/submit`], {
      queryParams: { appointment: orderId, logginId: logginId },
    });
  }
}
