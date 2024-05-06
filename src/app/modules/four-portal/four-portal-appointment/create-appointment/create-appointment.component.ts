import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { IgxCalendarComponent, } from "igniteui-angular";
import { IResponse } from "src/app/shared/classes/api-response";
import { DatePipe } from "@angular/common";
import { E } from "@angular/cdk/keycodes";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAppointmentComponent implements OnInit {
  @ViewChild("address") address!: ElementRef;
  autoComplete: google.maps.places.Autocomplete;
  doctor_portal_id: any = "";
  location_id: any = "";
  doctordetailsData: any = {};
  hospital_location: any[] = [];
  patient_details: FormGroup;
  loginuser_id: any = "";
  doctor_availability: any[] = [];
  dateForSlot: any = new Date();
  appointment_type: any;
  doctorAvailableTimeSlot: any[] = [];
  notAvalible: any = 1;
  medical_document: any[] = [];
  resonForAppoinmentList: any[] = [];
  chooseSlot: any;
  chooseDoc: any[] = [];
  docDetails: any[] = [];
  SubscribersPatientList: any[] = [];
  hospital_details: any;
  consultationFee: any;
  medicalDocForm!: FormGroup;
  // ReasonforAppointment: FormGroup
  appointment_id: any = "";
  ReasonforAppointment: FormGroup;
  subscriber: any = "";
  AppointmentDetail_id = "";
  rating: any;
  AppointmentFor: any = "porstal_Patient";
  patientId: any = "";
  isSubmitted: boolean = false;
  overlay: false;
  reasonSelectedId: any = "";
  userRole: any = "";
  value = new Date();
  @ViewChild("calender", { read: IgxCalendarComponent, static: true })
  currentDate: any = new Date();
  pageForEdit: boolean = false;
  doctor_name: any;
  assign_Doctor: any;
  selectedDoctorId: any;
  doctorId: any[];
  indi_doc_staffId: boolean;
  for_portal_user: any;
  listData: any;
  assign_doctor_depart: any;
  assign_doctor_services: any;
  assign_doctor_unit: any;
  doctor_id: any;
  selectedPatient: any;
  selectedFamilyMember: any;
  doctor_staff: any;
  userType: any;
  selectelocationId: any;
  constructor(
    private modalService: NgbModal,
    private _IndiviualDoctorService: IndiviualDoctorService,
    private _CoreService: CoreService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _PatientService: PatientService,
    private router: Router,
    private toster: ToastrService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private fourPortalService: FourPortalService,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._CoreService.getLocalStorage("loginData");
    console.log("userData--->", userData);

    this.loginuser_id = userData._id;
    this.userRole = userData?.role;
    this.userType = userData?.type

    this.medicalDocForm = this.fb.group({
      medicalDocumnets: this.fb.array([]),
    });
    this.patient_details = this.fb.group({
      patient_name: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      insurance_number: [""],
      email: [""],
      mobile2: [""],
      mobile: [""],
      subPatient_id: [""],
      patient_id: [""],
      address: [""],
      patientDob: [""],
      gender: ["", [Validators.required]],
      familyMember: [""],
      loc:[""]
    });
    this.ReasonforAppointment = this.fb.group({
      reson: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"))
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    this.assign_doctor_depart = adminData?.department;
    this.assign_doctor_services = adminData?.services;
    this.assign_doctor_unit = adminData?.unit;

    // hospital-doctor 

    // doctor-staff
    this.doctor_staff = adminData?.for_doctor;
    // hospital-staff
    this.doctor_id = adminData?.in_hospital;

    this.doctor_portal_id = [];


    // if (this.userRole === "INDIVIDUAL_DOCTOR" || this.userRole === "HOSPITAL_DOCTOR" || this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
      this.doctorDetails();
    // }
    // else if (this.userRole === "HOSPITAL_STAFF") {
    //   this.getDoctor(this.doctor_staff);
    // }

    var d = new Date();
    // d.setMonth(d.getMonth() - 3);
    this.currentDate = d;
    this.addnewMedicalDoc();
    // this.patientExistingDocs();

    this.allPatient();
    const dateObject = new Date(this.dateForSlot);
    dateObject.setHours(0, 0, 0, 0);
    const dateObject1 = new Date(this.currentDate);
    dateObject1.setHours(0, 0, 0, 0);

    this.currentDate = dateObject1;
  }


  get reasonValidationFormControl(): { [key: string]: AbstractControl } {
    return this.ReasonforAppointment.controls;
  }

  get patientFormControl(): { [key: string]: AbstractControl } {
    return this.patient_details.controls;
  }
  // get assigndoctor department,service and unit for hospital staff
  async getDoctor(doctor_list) {
    let reqData = {
      in_hospital: this.doctor_id,
      doctor_list: doctor_list,
      departmentArray: this.assign_doctor_depart,
      unitArray: this.assign_doctor_unit,
      serviceArray: this.assign_doctor_services
    }
    // console.log("reqData---->", reqData);

    this._IndiviualDoctorService.getdepartmentAsperDoctor(reqData).subscribe({

      next: async (result: IResponse<any>) => {
        let response = await this._CoreService.decryptObjectData({ data: result });
        // console.log("reqData---->", response);


        if (response.status == true) {
          this.listData = response?.body?.data.map((assDoc_is: any) => {
            if (this.doctor_portal_id.indexOf(assDoc_is.for_portal_user) == -1) {
              this.doctor_portal_id.push(assDoc_is.for_portal_user);
            }
          })
          // console.log("getdepartmentAsperDoctor==>", response?.body?.data, this.doctor_portal_id);
          // this.getAssignDoctorDetails()
          this.doctorDetails();
        }

      },
      error: (err: ErrorEvent) => {
        this._CoreService.showError("", err.message);
        if (err.message === "INTERNAL_SERVER_ERROR") {
          this._CoreService.showError("", err.message);
        }
      },

    })
  }

  getAssignDoctorDetails() {
    let reqData = {
      doctor_ids: this.doctor_portal_id
    }
    this._IndiviualDoctorService.postAssignDoctor(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._CoreService.decryptObjectData(encryptedData);
      if (response.status == true) {
        this.doctor_name = response?.body?.data
      }
    });
  }
  public onDoctorSelection(data: any) {
    this.selectedDoctorId = data?.doctorId
    this.doctorDetails();
    // this.resonForAppoinment();
  }
  onSubmit() { }

  async doctorAppointment() {
    // let adminData = JSON.parse(localStorage.getItem("adminData"));
    // this.indi_doc_staffId = adminData?.for_portal_user

    this.isSubmitted = true;

    if (
      this.ReasonforAppointment.invalid ||
      this.patient_details.invalid ||
      this.chooseSlot === "" || this.location_id === ""
    ) {
      this.ReasonforAppointment.markAllAsTouched();
      this.toster.error("Please fill all fields. ");
      const firstInvalidField = document.querySelector(
        'select2.ng-invalid, select.ng-invalid'
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this.loader.stop();

      return;
    }
    // this.doctorId = [];

    // if (this.userRole === "INDIVIDUAL_DOCTOR" || this.userRole === "HOSPITAL_DOCTOR") {
    //   this.doctorId.push(this.loginuser_id);
    // } else if (this.userRole === "HOSPITAL_STAFF") {
    //   this.doctorId.push(this.selectedDoctorId);
    // }else{
    //   this.doctorId.push(this.doctor_staff);
    // }
    this.loader.start();

    let param = {
      appointmentId: this.AppointmentDetail_id,
      loginId: this.loginuser_id,
      portalId: this.loginuser_id,
      hospital_details: this.hospital_details,
      madeBy: this.userRole,
      consultationFee: this.consultationFee,
      appointmentType: this.appointment_type,
      reasonForAppointment: this.ReasonforAppointment.value.reson,
      consultationDate: this.dateForSlot,
      consultationTime: this.chooseSlot,
      consultationUserType: this.patient_details.value.subPatient_id,
      patientId: this.patientId != "" ? this.patientId : null,
      patientDetails: {
        patientId: this.patient_details.value.subPatient_id
          ? this.patient_details.value.subPatient_id
          : null,
        // patientFullName: this.patient_details.value.patient_name,
        patientFullName: this.patient_details?.value?.first_name + " " + this.patient_details?.value?.middle_name + " " + this.patient_details?.value?.last_name,
        patientFirstName: this.patient_details?.value?.first_name,
        patientMiddleName: this.patient_details?.value?.middle_name,
        patientLastName: this.patient_details?.value?.last_name,
        patientMobile: this.patient_details.value.mobile,
        mobile: this.patient_details.value.mobile,
        patientEmail: this.patient_details.value.email,
        insuranceNumber: this.patient_details.value.insurance_number,
        patientDob: this.patient_details.value.patientDob,
        gender: this.patient_details.value.gender,
        address: this.patient_details.value.address,
        loc: this.patient_details.value.loc
      },
      portal_Details: this.docDetails,
      type: this.userRole,
      paymentType: "post-payment",
      status: "APPROVED",
      portal_type:this.userType

    };
 
    if (this.consultationFee === undefined || this.consultationFee === null) {
      this.toster.error("Don't have consultation fees. Please Check!");
      return
    } else {
      this._PatientService.fourPortal_bookAppointment(param).subscribe({
        next: (res) => {
          let result = this._CoreService.decryptObjectData({ data: res });
          if(result.status == true){
          let appointmentdetails = { appointment_id: result.body._id };
            this.loader.stop();
          // if (result.status) {
          //   this.router.navigate(["/patient/homepage/viwenewappointment"], {
          //     queryParams: appointmentdetails,
          //   });
          // }
          this._CoreService.showSuccess(result.message, "");
          this.router.navigate([`/portals/appointment/${this.userType}`]);
        }else{
          this.loader.stop();
          this._CoreService.showError(result.message, "");

        }
        },
        error: (err) => {
          console.log(err);
          this.loader.stop();
        },
      });
    }




  }
  handelFeeandhospital() {
    let result = this.hospital_location.filter(
      (ele) => ele.hospital_id == this.location_id
    );
    this.hospital_details = {
      hospital_id: result[0]?.hospital_id,
      hospital_name: result[0]?.hospital_name,
    };
     this.doctorAvailableSlot();
     this.resonForAppoinment();
    // console.log("hospital detail", this.hospital_details)
  }

  resonForAppoinment() {

    // this.doctor_portal_id = [];
    // if (this.userRole === "INDIVIDUAL_DOCTOR" || this.userRole === "HOSPITAL_DOCTOR") {
    //   this.doctor_portal_id.push(this.loginuser_id);

    // } else if (this.userRole === "HOSPITAL_STAFF") {
    //   this.doctor_portal_id.push(this.selectedDoctorId);
    // }
    // else if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
    //   this.doctor_portal_id.push(this.doctor_id);

    // }
    // else if(this.userRole === "HOSPITAL_DOCTOR" ){
    //   console.log("this.assign_Doctor",this.doctor_id); 

    //   this.doctor_portal_id.push(this.assign_Doctor);
    // }

    let param = {
      searchText: "",
      limit: 0,
      page: 1,      
      loginPortalId: this.loginuser_id,
      listFor:this.userType,
      selectedlocation:this.selectelocationId
    };


    this.fourPortalService.listAppointmentReason(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        // this.resonForAppoinmentList = result?.body?.data
        this.resonForAppoinmentList = [];
        if(result?.body?.data.length>0){
          result?.body?.data.map((curentval, index) => {
            this.resonForAppoinmentList.push({
              label: curentval.name,
              value: curentval._id,
            });
          });
        }else{
          this.resonForAppoinmentList=[];
        }
       
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  patientList: any[] = [];
  patient__Id: any;

  allPatient() {
    this._IndiviualDoctorService.AllPatient().subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        if (result?.status) {
          for (const data of result?.body) {
            this.patientList.push({
              label: data?.first_name + " " + data?.last_name,
              value: data?.for_portal_user?._id,

              full_name: data?.full_name,
              first_name: data?.first_name,
              middle_name: data?.middle_name,
              last_name: data?.last_name,
              dob: data?.dob,
              gender: data?.gender,
              mobile: data?.for_portal_user?.mobile,
              _id: data?.for_portal_user?._id,
              email: data?.for_portal_user?.email,
            });
          }
        }

        // this.patientList = result?.body;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  doctorDetails() {
    this.doctor_portal_id = [];

    // if (this.userRole === "INDIVIDUAL_DOCTOR" || this.userRole === "HOSPITAL_DOCTOR") {
    //   this.doctor_portal_id.push(this.loginuser_id);

    // } else if (this.userRole === "HOSPITAL_STAFF") {
    //   this.doctor_portal_id.push(this.selectedDoctorId);
    // }
    // else if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
    //   this.doctor_portal_id.push(this.doctor_id);
    // }

    let param = { portal_id: this.loginuser_id };

    this.fourPortalService.fourPortalDetails(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        this.doctordetailsData = JSON.parse(JSON.stringify(result?.body?.data));
        this.doctor_availability = JSON.parse(
          JSON.stringify(result?.body?.data.in_availability)
        );
        this.hospital_location = JSON.parse(
          JSON.stringify(result?.body?.data.hospital_location)
        );
        this.rating = JSON.parse(JSON.stringify(result?.body?.doctor_rating));
        this.appointment_type = JSON.parse(
          JSON.stringify(result?.body?.data?.in_availability[0].appointment_type)
        );
        // this.location_id = JSON.parse(
        //   JSON.stringify(result.body?.data?.hospital_location[0].hospital_id)
        // );

        if (!this.pageForEdit) {
          if (this.hospital_location.length == 1) {
            this.location_id =
              result?.body?.data?.hospital_location[0]?.hospital_id;
          }

        }

       
        this.handelFeeandhospital();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public onSelection(data: any) {
    this.selectelocationId = "";
    this.chooseSlot = "";
    if (data.date) {
      const date = new Date(data.date);
      date.setHours(date.getHours() + 5, date.getMinutes() + 30); //adding 5.30 hr extra to get proper date
      const isoString = date.toISOString();
      this.dateForSlot = isoString;

      const inputDate = new Date(this.currentDate);
      const formattedDate = this.datePipe.transform(inputDate, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
      console.log(formattedDate, "DATE===>", this.dateForSlot);

      if (this.dateForSlot >= formattedDate) {
      } else {
        this.toastr.error('Unable to continue, Please select future date');
        return;
      }

    } else if (data.type) {
      this.appointment_type = data.type;
      console.log(data);
    } else {
      this.location_id = data.locationid;
      this.handelFeeandhospital();
      console.log(data);
    }
    this.selectelocationId = data?.locationid;
    this.resonForAppoinment();
    this.doctorAvailableSlot();
  }

  doctorAvailableSlot() {
    // let adminData = JSON.parse(localStorage.getItem("adminData"));

    // this.doctor_portal_id = [];
    // this.for_portal_user = adminData?.in_hospital;

    // if (this.userRole === "INDIVIDUAL_DOCTOR" || this.userRole === "HOSPITAL_DOCTOR") {
    //   this.doctor_portal_id.push(this.loginuser_id);

    // } else if (this.userRole === "HOSPITAL_STAFF") {
    //   this.doctor_portal_id.push(this.selectedDoctorId);
    // }
    // else if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF") {
    //   this.doctor_portal_id.push(this.doctor_id);
    // }

    let param = {
      locationId: this.location_id,
      appointmentType: this.appointment_type,
      timeStamp: this.dateForSlot,
      portal_id: this.loginuser_id,
      portal_type: this.userType
    };
   

    //  let param = { "locationId": "63d3cb116ef0c91c772e4627", "appointmentType": "ONLINE", "timeStamp": "2023-02-17T10:00:00.000Z", "doctorId": "63e0bc33f15a27adc67cc733" }
    this.fourPortalService.portalAvailableSlot(param).subscribe({
      next: async (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        if (result.status) {
          this.doctorAvailableTimeSlot = await result?.body?.allGeneralSlot;

          this.consultationFee = await result?.body?.fee;
          if (this.consultationFee === undefined || this.consultationFee === null) {
            this.toster.error("Doctor don't have consultation fee. Consult with your doctor. ");
            return
          }


        } else {
          this.doctorAvailableTimeSlot = [];
          this.consultationFee = "";
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectedPatientDetails: any;

  SubscribersList(patient: any) {

    let patientdata: any;
    let param: any;
    if (patient?.options === null) {

      return;
    } else {
      patientdata = patient?.options[0];

      this.patientId = patientdata?._id;
      this.selectedPatientDetails = patientdata;
      //   if(patientdata?._id){
      //     console.log("insideeeee");

      //  this.patient_details.reset();
      //   }

      param = {
        patientId: patientdata?._id,
      };


      this.patient_details.controls["email"].setValue(patientdata?.email);
      this.patient_details.controls["mobile2"].setValue(patientdata?.mobile);
      //   if(patientdata?._id){
      //     console.log("insideeeee");

      //  this.patient_details.reset();
      //   }
      this.selectedPatient = patientdata?.label

      this._PatientService.SubscribersList(param).subscribe({
        next: (res) => {
          let result = this._CoreService.decryptObjectData({ data: res });

          if (result.status) {
            // this.SubscribersPatientList = result?.data?.all_subscriber_ids;
            result?.data?.all_subscriber_ids.map((curentval, index) => {
              this.SubscribersPatientList.push({
                label: curentval.name,
                value: curentval.subscriber_id,
              });
            });

            if (result?.data != null) {
              for (let data of result?.data?.all_subscriber_ids) {
                if (data?.subscription_for == "Primary") {
                  
                  this.subscribersDetails(data.subscriber_id);
                  this.patient_details.controls["subPatient_id"].setValue(
                    data.subscriber_id
                  );
                }
              }
            } else {

              this.SubscribersPatientList = [];
              this.getDependentFamilyMembers("yes");
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });

      this.chooseDoc = [];

      // this.patientExistingDocs();
    }
  }

  HandelAppointmentFor(data: any) {
    this.AppointmentFor = data;
    this.patient_details.reset();
    this.SubscribersPatientList = [];
    this.chooseDoc = [];
    this.geoAddress();

    if (data === "other") {
      this.patientId = "";
    }
  }

  handelSubscribPatient(user: any) {
    if (user.value === " ") {
      this.patient_details.reset();
    } else {
      this.subscriber = user.value;
      this.subscribersDetails(user.value);
    }
  }

  subscribersDetails(_id: any) {
    let param = {
      subscriber_id: _id,
    };
    
    this._PatientService.subscribersDetails(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        let patient = result.body[0];      
        
        this.patient_details.controls["patient_name"].setValue(
          patient?.subscriber_full_name
        );
        this.patient_details.controls["first_name"].setValue(
          patient?.subscriber_first_name
        );
        this.patient_details.controls["middle_name"].setValue(
          patient?.subscriber_middle_name
        );
        this.patient_details.controls["last_name"].setValue(
          patient?.subscriber_last_name
        );

        this.patient_details.controls["insurance_number"].setValue(
          patient?.policy_id
        );
        this.patient_details.controls["mobile"].setValue(patient?.mobile);
        this.patient_details.controls["patientDob"].setValue(
          patient?.date_of_birth
        );
        this.patient_details.controls["gender"].setValue(patient?.gender);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handelSlot(data: any) {
    this.chooseSlot = data;
  }

  newMedicalDocForm(): FormGroup {
    return this.fb.group({
      name: [""],
      expiration_date: [""],
      issue_date: [""],
      image: [""],
    });
  }

  get departments(): FormArray {
    return this.medicalDocForm.get("medicalDocumnets") as FormArray;
  }
  addnewMedicalDoc() {
    this.departments.push(this.newMedicalDocForm());
  }

  removeMedicalDoc(i: number) {
    this.departments.removeAt(i);
  }
  createMedicalDoc() {
    let param = {
      patient_id: this.patientId,     
      medical_document: this.medicalDocForm.value.medicalDocumnets,
    };
    
   
    this._PatientService.createMedicalDoc(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData(res);

        for (let p of result.body) {
          this.handelDoc(p);
        }
        this.medicalDocForm.reset();
        this.closePopup();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  async onMedicalDocChange(event: any, index: any) {  
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let formData: any = new FormData();
      formData.append("userId", this.loginuser_id);
      formData.append("docType", index);
      formData.append("multiple", "false");
      formData.append("docName", file);
      await this.uploadDocuments(formData).then((res: any) => {
        console.log(res.data[0].Key);
        this.departments.at(index).patchValue({ image: res.data[0].Key });
      });
    }
  }
  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._PatientService.uploadFile(doc).subscribe(
        (res) => {
          let response = this._CoreService.decryptObjectData(res);
          resolve(response);
        },
        (err) => {
          let errResponse = this._CoreService.decryptObjectData({
            data: err.error,
          });
        }
      );
    });
  }

  patientExistingDocs() {
    this._PatientService
      .patientExistingDocs({ patientId: this.patientId })
      .subscribe({
        next: (res) => {
          let result = this._CoreService.decryptObjectData({ data: res });
          this.medical_document = result?.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  unSelectDoc(_id: any) {
    let res = this.chooseDoc.filter((ele) => ele._id !== _id);
    this.chooseDoc = res;
    let docData = [];
    for (let data of this.chooseDoc) {
      console.log(data);
      docData.push({
        doc_id: data._id,
        date: data.expiration_date,
      });
    }
    this.docDetails = docData;

    // console.log("id", res)
  }

  handelDoc(doc: any) {
    if (this.chooseDoc.length == 0) {
      this.chooseDoc.push(doc);
    } else {
      let res = this.chooseDoc.filter((ele) => ele._id == doc._id);
      if (res.length == 0) {
        // console.log(res)
        this.chooseDoc.push(doc);
      }
    }
    let docData = [];
    for (let data of this.chooseDoc) {
      docData.push({
        doc_id: data._id,
        date: data.expiration_date,
      });
    }
    this.docDetails = docData;
  }

  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }
  openVerticallyCenteredaddmedicaldoc(addmedicaldoc: any) {
    this.modalService.open(addmedicaldoc, {
      centered: true,
      size: "lg",
      windowClass: "medicaldoc",
    });
  }

  //  Choose existing document modal
  openVerticallyCenteredexistingdoc(existingdoc: any) {
    this.modalService.open(existingdoc, {
      centered: true,
      size: "xl",
      windowClass: "existingdoc",
    });
    // this.patientExistingDocs();
  }
  //  Approved modal
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
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

  handleFamilyMember(data: any) {
    // this.patient_details.reset();

    if (data.options !== null && data.options !== undefined) {

      this.patient_details.controls["patient_name"].setValue(data?.options[0]?.label);
      this.patient_details.controls["first_name"].setValue(data?.options[0]?.first_name);
      this.patient_details.controls["middle_name"].setValue(data?.options[0]?.middle_name);
      this.patient_details.controls["last_name"].setValue(data?.options[0]?.last_name);
      this.patient_details.controls["email"].setValue(
        data?.options[0]?.email ? data?.options[0]?.email : ""
      );
      // this.patient_details.controls["insurance_number"].setValue(
      //   patient?.policy_id
      // );
      this.patient_details.controls["mobile"].setValue(data?.options[0]?.mobile);
      // this.patient_details.controls["mobile2"].setValue(data?.mobile);
      this.patient_details.controls["patientDob"].setValue(data?.options[0]?.dob);
      this.patient_details.controls["gender"].setValue(data?.options[0]?.gender);
    }

  }

  familyMembersList: any = [];

  getDependentFamilyMembers(isFirstTime: any = "") {

    this.familyMembersList = [];

    this.familyMembersList.push({
      label: this.selectedPatientDetails?.label,
      value: this.selectedPatientDetails?.value,

      name: this.selectedPatientDetails?.full_name,
      first_name: this.selectedPatientDetails?.first_name,
      middle_name: this.selectedPatientDetails?.middle_name,
      last_name: this.selectedPatientDetails?.last_name,
      dob: this.selectedPatientDetails?.dob,
      gender: this.selectedPatientDetails?.gender,
      mobile: this.selectedPatientDetails?.mobile,
      email: this.selectedPatientDetails?.email,
    });

    let reqData = {
      patientId: this.patientId,
    };

    this._PatientService.getDependentFamilyMembers(reqData).subscribe((res) => {
      let response = this._CoreService.decryptObjectData({ data: res });

      if (response?.status) {
        if (response?.body?.familyinfos) {
          for (const elem of response?.body?.familyinfos?.family_members) {
            this.familyMembersList.push({
              name: `${elem?.first_name} ${elem?.last_name}`,
              first_name: elem?.first_name,
              middle_name: "",
              last_name: elem?.last_name,
              dob: elem?.dob,
              gender: elem?.gender,
              mobile: elem?.mobile_number,
            });
          }
        }

        if (isFirstTime === "yes") {
          this.handleFamilyMember(this.familyMembersList[0]);
          this.selectedFamilyMember = this.familyMembersList[0];
          this.patient_details.patchValue({
            familyMember: this.familyMembersList[0],
          });
        }
      }
    });
  }

  isSelectedDocument(document: any): boolean {
    let flag = false;

    let res = this.chooseDoc.filter((ele) => ele._id == document._id);
    if (res.length != 0) {
      flag = true;
    }
    return flag;
  }

  navigateToPage(){
    this.router.navigate([`/portals/patientmanagement/${this.userType}/add`])
  }
  routeBack(){
    this.router.navigate([`/portals/appointment/${this.userType}`])
  }

  geoAddress(){
    const options = {
      fields: [
        "address_components",
        "geometry.location",
        "icon",
        "name",
        "formatted_address",
      ],
      strictBounds: false,
    };
    this.autoComplete = new google.maps.places.Autocomplete(
      this.address.nativeElement,
      options
    );
    this.autoComplete.addListener("place_changed", (record) => {
      const place = this.autoComplete.getPlace();    
      
      this.patient_details.patchValue({
        address: place.formatted_address,
        loc: {
          lat:place.geometry.location.lat(),
          long: place.geometry.location.lng(),
        },
      });
    });
  }
}
