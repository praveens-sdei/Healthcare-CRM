import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { IndiviualDoctorService } from "../../../individual-doctor/indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { PatientService } from "../../patient.service";
import { ToastrService } from "ngx-toastr";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormArray,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import {
  Calendar,
  DateRangeType,
  IgxCalendarComponent,
} from "igniteui-angular";
export enum Day {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}
@Component({
  selector: "app-retailappointmentdetails",
  templateUrl: "./retailappointmentdetails.component.html",
  styleUrls: ["./retailappointmentdetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RetailappointmentdetailsComponent implements OnInit {
  isSubmitted: boolean = false;
  isSubmittedDocs: boolean = false;
  @ViewChild("address") address!: ElementRef;
  autoComplete: google.maps.places.Autocomplete;
  doctor_portal_id: any = "";
  location_id: any = "";
  doctordetailsData: any = {};
  hospital_location: any[] = [];
  patient_details: FormGroup;
  loginuser_id: any = "";
  doctor_availability: any[] = [];
  dateForSlot: Date = new Date();
  appointment_type: any = "";
  doctorAvailableTimeSlot: any[] = [];
  notAvalible: any = 1;
  medical_document: any[] = [];
  resonForAppoinmentList: any[] = [];
  chooseSlot: any = "";
  chooseDoc: any[] = [];
  docDetails: any[] = [];
  SubscribersPatientList: any = [];
  hospital_details: any;
  consultationFee: any;
  medicalDocForm!: FormGroup;
  ReasonforAppointment: FormGroup;
  appointment_id: any = "";
  subscriber: any = "";
  AppointmentDetail_id = "";
  rating: any;
  AppointmentFor: any = "self";
  // AppointmentForPatch: any = "self";
  maxDate = new Date();

  overlay: false;
  reasonSelectedId: any = "";
  value = new Date();
  currentDate: Date = new Date();
  checkAppointmentFor: boolean = true;

  loginData: any;
  adminData: any;

  @ViewChild("calender", { read: IgxCalendarComponent, static: true })
  calendar: any;
  private _day = Day;
  familyMembersList: any = [];
  selectedFamilyMember: any;

  @ViewChild("confirmationModel") confirmationModel: any;

  issueMaxDate = new Date();
  issueMinDates: any[] = [];

  pageForEdit: boolean = false;
  nextAppointmentDate = new Date();
  todaysDate: number;
  pastDate: number;
  selectelocationId: any;
  fileName: any;

  constructor(
    private modalService: NgbModal,
    private _IndiviualDoctorService: IndiviualDoctorService,
    private _CoreService: CoreService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _PatientService: PatientService,
    private router: Router,
    private toster: ToastrService,
    private _cdr: ChangeDetectorRef,
    private el: ElementRef,
    private toastr: ToastrService,
  ) {
    this.ReasonforAppointment = this.fb.group({
      reson: ["", [Validators.required]],
    });
    this.patient_details = this.fb.group({
      patient_name: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      insurance_number: [""],
      email: ["", [Validators.required]],
      mobile2: [""],
      mobile: ["", [Validators.required]],
      subPatient_id: [""],
      patientDob: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      address: [""],
      loc:[""],
      familyMember: [""],
    });
    this.medicalDocForm = this.fb.group({
      medicalDocumnets: this.fb.array([]),
    });
    const userData = this._CoreService.getLocalStorage("loginData");
    const adminData = this._CoreService.getLocalStorage("profileData");
    this.loginData = userData;
    this.adminData = adminData;

    this.loginuser_id = userData._id;
    this.patient_details.controls["mobile2"].setValue(userData.mobile);
    this.patient_details.controls["email"].setValue(userData.email);

    // console.log("userdata", userData);
  }

  ngOnInit(): void {
    window.scroll({
      top: 0,
    });
    this.getParamsValue();
    this.doctorDetails();
    this.patientExistingDocs();
    this.addnewMedicalDoc();
    this.SubscribersList("yes");

    const dateObject = new Date(this.dateForSlot);
    dateObject.setHours(0, 0, 0, 0);
    const dateObject1 = new Date(this.currentDate);
    dateObject1.setHours(0, 0, 0, 0);

    this.dateForSlot = dateObject;
    this.currentDate = dateObject1;

  }

  ngAfterViewInit() {
    this.onViewChanged();
  }

  public onViewChanged() {
    let olddate = new Date("1970-01-01");
    let today = new Date(Date.now());

    let range = [
      new Date(olddate.getFullYear(), olddate.getMonth(), 1),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    ];

    // this.calendar.disabledDates = [
    //   { type: DateRangeType.Between, dateRange: range },
    // ];
    this._cdr.detectChanges();
  }

  get patientFormControl(): { [key: string]: AbstractControl } {
    return this.patient_details.controls;
  }
  get reasonValidationFormControl(): { [key: string]: AbstractControl } {
    return this.ReasonforAppointment.controls;
  }

  getParamsValue() {
    this.route.queryParams.subscribe((res) => {
      this.doctor_portal_id = res["doctorId"]
        ? res["doctorId"]
        : res["doctor_id"];
      this.appointment_type = res["appointment_type"];
      this.AppointmentDetail_id = res["appointmentId"]
        ? res["appointmentId"]
        : "";

      if (res["date"] != undefined) {
        let date = res["date"]

        let showData = this._CoreService.decryptObjectData({ data: date });

        this.value = new Date(showData);
        this.value.setHours(0, 0, 0, 0);
        console.log(this.value, "valueee_____", showData);
        this.dateForSlot = this.value

      }

      this.resonForAppoinment();
      this.getDependentFamilyMembers("yes");
      this.viweAppoinment();
    });
  }

  subscribersDetails(_id: any) {
    let param = {
      subscriber_id: _id,
    };

    this._PatientService.subscribersDetails(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        let patient = result.body[0];
        console.log("KKKKKKKKKKKKKKKKKKKKKKK", result.body[0]);

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
        // this.patient_details.controls["email"].setValue(
        //   patient?.email ? patient?.email : ""
        // );
        this.patient_details.controls["insurance_number"].setValue(
          patient?.policy_id
        );
        this.patient_details.controls["mobile"].setValue(patient?.mobile);
        this.patient_details.controls["patientDob"].setValue(
          patient?.date_of_birth
        );
        this.patient_details.controls["gender"].setValue(patient?.gender);
        this.geoAddress();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  doctorDetails() {
    let param = { doctor_portal_id: this.doctor_portal_id };

    this._IndiviualDoctorService.doctorDetails(param).subscribe({
      next: async (res) => {
        let result = await this._CoreService.decryptObjectData({ data: res });
        this.doctordetailsData = await JSON.parse(
          JSON.stringify(result?.body?.data)
        );
        console.log(this.doctordetailsData, "doctordetailsDataaa_____");

        this.doctor_availability = await JSON.parse(
          JSON.stringify(result?.body?.data.in_availability)
        );
        this.hospital_location = await JSON.parse(
          JSON.stringify(result?.body?.data?.hospital_location)
        );

        this.rating = await JSON.parse(
          JSON.stringify(result.body?.doctor_rating)
        );

        if (!this.pageForEdit) {
          if (this.hospital_location.length == 1) {
            this.location_id =
              result?.body?.data?.hospital_location[0]?.hospital_id;
          }

        }

        this.doctorAvailableSlot();
        this.handelFeeandhospital();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onlocationselect(id: any) {
    this.location_id = id;
  }

  public onSelection(data: any) {   
    
    console.log(this.dateForSlot,"data__________",data.date);
    
    if(this.AppointmentDetail_id){
      
      if(this.dateForSlot == data.date){

        this.chooseSlot = this.dateForSlot

      }else{

        this.chooseSlot = "";

      }


    }
 

    if (data.date) {
      const dateObject = new Date(data.date);

      // Set the time to 00:00:00
      dateObject.setHours(0, 0, 0, 0);

      this.dateForSlot = dateObject;
      
      if (this.dateForSlot.getTime() >= this.currentDate.getTime()) {
        console.log("IFF");
      } else {
        this.toastr.error('Unable to continue, Please select future date');
        return;
      }
    } else if (data.type) {
      this.appointment_type = data.type;
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
    const originalDateString = this.dateForSlot.toDateString();

    const originalDate = new Date(originalDateString);
    const timeZoneOffsetMinutes = originalDate.getTimezoneOffset();
    originalDate.setMinutes(originalDate.getMinutes() + 330 + 30);
    const formattedDate = originalDate.toISOString();


    let param = {
      locationId: this.location_id,
      appointmentType: this.appointment_type,
      timeStamp: formattedDate,
      // doctorId: this.doctor_availability[0].for_portal_user,
      doctorId: this.doctor_portal_id,
    };

    //  let param = { "locationId": "63d3cb116ef0c91c772e4627", "appointmentType": "ONLINE", "timeStamp": "2023-02-17T10:00:00.000Z", "doctorId": "63e0bc33f15a27adc67cc733" }
    this._IndiviualDoctorService.doctorAvailableSlot(param).subscribe({
      next: async (res) => {
        let result = await this._CoreService.decryptObjectData({ data: res });
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

  handelSlot(data: any) {
    this.chooseSlot = data;
    // console.log("slot",data)
    this.handleFamilyMember(this.familyMembersList[0]);
  }

  handelDoc(doc: any) {
    // console.log("Selected Doc-->", doc);

    if (this.chooseDoc.length == 0) {
      this.chooseDoc.push(doc);
    } else {
      let res = this.chooseDoc.filter((ele) => ele._id == doc._id);
      if (res.length == 0) {
        this.chooseDoc.push(doc);
      }
    }

    // console.log("Choosen Doc-->", this.chooseDoc);

    let docData = [];
    for (let data of this.chooseDoc) {
      docData.push({
        doc_id: data._id,
        date: data.expiration_date,
      });
    }
    this.docDetails = docData;

    // console.log("Choosen Doc Details-->", this.chooseDoc);
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
  onSubmit() { }
  handelFeeandhospital() {
    console.log("hospital_location", this.hospital_location);
    if (this.location_id) {
      let result = this.hospital_location.filter(
        (ele) => ele.hospital_id == this.location_id
      );

      this.hospital_details = {
        hospital_id: result[0].hospital_id,
        hospital_name: result[0].hospital_name,
        hospital_loc : result[0].loc
      };
      console.log("hospital detail", this.hospital_details)

    }

  }

  async doctorAppointment() {
    this.isSubmitted = true;

    if (this.dateForSlot.getTime() >= this.currentDate.getTime()) {
      console.log("IFF");
    } else {
      this.toastr.error('Unable to continue, Please select future date');
      return;
    }


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
      return;
    }

    let param = {
      loginId: this.loginuser_id,
      appointmentId: this.AppointmentDetail_id,
      doctorId: this.doctor_portal_id,
      hospital_details: this.hospital_details,
      madeBy: "patient",
      consultationFee: this.consultationFee,
      appointmentType: this.appointment_type,
      reasonForAppointment: this.ReasonforAppointment.value.reson,
      consultationDate: this.dateForSlot.toDateString(),
      consultationTime: this.chooseSlot,
      consultationUserType: this.patient_details.value.subPatient_id,
      consultationFor: this.AppointmentFor,
      patientId: this.loginuser_id,
      patientDetails: {
        patientId: this.patient_details.value.subPatient_id
          ? this.patient_details.value.subPatient_id
          : null,
        patientFullName: this.patient_details?.value?.first_name + " " + this.patient_details?.value?.middle_name + " " + this.patient_details?.value?.last_name,
        patientFirstName: this.patient_details?.value?.first_name,
        patientMiddleName: this.patient_details?.value?.middle_name ? this.patient_details?.value?.middle_name : "",
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
      docDetails: this.docDetails,
      type: "patient",
    };
    console.log("APPOINTMENT REQUEST DATA===>", param);
    if (this.consultationFee === undefined || this.consultationFee === null) {
      this.toster.error("Doctor don't have consultation fee. Consult with your doctor. ");
      return
    } else {



      this._PatientService
        .isPlanPurchesdByPatient(this.loginuser_id)
        .then((res) => {
          console.log("Is PLAN PPURCHASED==>", res);

          if (res === true) {
            this._IndiviualDoctorService.doctorAppoinment(param).subscribe({
              next: (res) => {
                let result = this._CoreService.decryptObjectData({ data: res });
                console.log("result", result);
                if (result.status) {
                  let appointmentdetails = { appointment_id: result.body._id };
                  console.log("appointmentdetails", appointmentdetails);
                  this.router.navigate(
                    ["/patient/homepage/retailreviewappointment"],
                    {
                      queryParams: appointmentdetails,
                    }
                  );
                } else {
                  this._CoreService.showError(result.message, "")
                }
              },
              error: (err) => {
                console.log(err);
              },
            });
          } else {
            this.modalService.open(this.confirmationModel);
          }
        });
    }
  }



  createMedicalDoc() {
    this.isSubmittedDocs = true;
    if (this.medicalDocForm.invalid) {
      return;
    }
    this.isSubmittedDocs = false;

    let param = {
      patient_id: this.loginuser_id,
      medical_document: this.medicalDocForm.value.medicalDocumnets,
    };

    console.log("UPLOAD DOC REQUEST ===>", param);
    // return;

    this._PatientService.createMedicalDoc(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData(res);
        console.log("UPLOAD RESULT===>", result);

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

  HandelAppointmentFor(data: any) {
    this.AppointmentFor = data;
    console.log("APPOINTMENT FOR===>", this.AppointmentFor);
    this.patient_details.reset();
    this.patient_details.controls["mobile2"].setValue(this.loginData.mobile);
    this.patient_details.controls["email"].setValue(this.loginData.email);



    if (data == "self") {
      this.checkAppointmentFor = true;
      console.log("this.patinetSubcriberID", this.patinetSubcriberID);

      if (this.patinetSubcriberID != "") {
        console.log("this.patinetSubcriberID", this.patinetSubcriberID);

        this.subscribersDetails(this.patinetSubcriberID);
        this.patient_details.controls["subPatient_id"].setValue(
          this.patinetSubcriberID
        );
        console.log("data", this.AppointmentFor);
      } else {
        //  console.log("EEEEEEEEEEEEEEEEEe",this.familyMembersList[0]);

        // this.handleFamilyMember(this.familyMembersList[0]);
        // this.selectedFamilyMember = this.familyMembersList[0];
      }
    } else {
      this.patient_details.reset();
      this.checkAppointmentFor = false;
    }
  }

  patinetSubcriberID: any = "";

  SubscribersList(isFirstTime: any = "") {
    let param = {
      patientId: this.loginuser_id,
      // patientId: "63d0f8213c4b44b6397794ff"
    };
    this._PatientService.SubscribersList(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });
        console.log("SUBCRIBER LIST===> ", result);

        if (result.data != null) {
          // this.SubscribersPatientList = result?.data?.all_subscriber_ids;
          result?.data?.all_subscriber_ids.map((curentval, index) => {
            this.SubscribersPatientList.push({
              label: curentval.name,
              value: curentval.subscriber_id,
            });
          });
          console.log("patientlist--->", this.SubscribersPatientList);

          for (let data of result?.data?.all_subscriber_ids) {
            if (data?.subscription_for == "Primary") {
              this.patinetSubcriberID = data.subscriber_id;
            }

            if (
              isFirstTime === "yes" &&
              this.patinetSubcriberID != "" &&
              !this.pageForEdit
            ) {
              // console.log("CALLED WHILE BOOKING ONLY NOT EDITING");
              this.subscribersDetails(this.patinetSubcriberID);
              this.patient_details.controls["subPatient_id"].setValue(
                this.patinetSubcriberID
              );
              // console.log("data", this.AppointmentFor);
            }
          }
          console.log("patinetSubcriberID", this.patinetSubcriberID);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  resonForAppoinment() {
    let param = {
      searchText: "",
      limit: 0,
      page: 1,
      // doctorId: this.doctordetailsData?.doctor_portal_id,
      doctorId: this.doctor_portal_id,
      selectedlocation: this.selectelocationId
    };

    this._IndiviualDoctorService.resonForAppoinment(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res });

        // console.log("APPOINTMENT REASON LIST===>", this.resonForAppoinmentList);
        this.resonForAppoinmentList = [];
        if (result.body.data.length > 0) {
          result.body.data.map((curentval, index) => {
            this.resonForAppoinmentList.push({
              label: curentval.name,
              value: curentval._id,
            });
          });  
        }else{
          this.resonForAppoinmentList=[];
        }
        
        this.filterOptions("");
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handelSubscribPatient(user: any) {
    console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKr", user.value);
    if (user.value === " ") {
      this.patient_details.reset();
    } else {
      this.subscriber = user.value;
      this.subscribersDetails(user.value);
    }
  }

  handleFamilyMember(data: any) {
    console.log("FAMILY MEMBER DATA===>", data);
    if (data.options) {

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
    } else {
      console.log("else_______");

      this.patient_details.controls["patient_name"].setValue(this.familyMembersList[0]?.label);
      this.patient_details.controls["first_name"].setValue(this.familyMembersList[0]?.first_name);
      this.patient_details.controls["middle_name"].setValue(this.familyMembersList[0]?.middle_name);
      this.patient_details.controls["last_name"].setValue(this.familyMembersList[0]?.last_name);
      this.patient_details.controls["email"].setValue(
        this.familyMembersList[0]?.email ? this.familyMembersList[0]?.email : ""
      );
      // this.patient_details.controls["insurance_number"].setValue(
      //   patient?.policy_id
      // );
      this.patient_details.controls["mobile"].setValue(this.familyMembersList[0]?.mobile);
      // this.patient_details.controls["mobile2"].setValue(this.familyMembersList[0]?.mobile);
      this.patient_details.controls["patientDob"].setValue(this.familyMembersList[0]?.dob);
      this.patient_details.controls["gender"].setValue(this.familyMembersList[0]?.gender);
    }
  }

  patientExistingDocs() {
    this._PatientService
      .patientExistingDocs({ patientId: this.loginuser_id })
      .subscribe({
        next: (res) => {
          let result = this._CoreService.decryptObjectData({ data: res });

          this.medical_document = result?.data;

          // console.log("exseting docmunet ", result);
        },

        error: (err) => {
          console.log(err);
        },
      });
  }
  //-------Form Array Handling----------------
  newMedicalDocForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      expiration_date: [""],
      issue_date: [""],
      image: ["", [Validators.required]],
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

  async onMedicalDocChange(event: any, index: any) {
    console.log("index", index);
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileName = file.name

      let formData: any = new FormData();
      formData.append("userId", this.loginuser_id);
      formData.append("docType", index);
      formData.append("multiple", "false");
      formData.append("docName", file);

      await this.uploadDocuments(formData).then((res: any) => {
        // console.log(res.data[0].Key);
        this.departments.at(index).patchValue({ image: res.data[0].Key });
      });
    }
  }
  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._PatientService.uploadFile(doc).subscribe(
        (res) => {
          let response = this._CoreService.decryptObjectData(res);
          if(response.status){
            this._CoreService.showSuccess("", response.message)
          }else{
            this._CoreService.showError("", response.message)

          }
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
  newDate = new Date();

  viweAppoinment() {
    let prama = {
      appointment_id: this.AppointmentDetail_id,
    };

    if (this.AppointmentDetail_id) {
      this.pageForEdit = true;
      this._IndiviualDoctorService.viewAppoinment(prama).subscribe({
        next: async (res) => {
          let result = await this._CoreService.decryptObjectData({ data: res });

          console.log("APPOINTMENT EDIT DETAILS===>", result);
          this.location_id = await result?.data?.result?.hospital_details
            ?.hospital_id;
          this.AppointmentFor = await result.data.result.consultationFor;
          this.value = new Date(result.data.result.consultationDate);
          
          this.dateForSlot = await new Date(result.data.result.consultationDate);
          console.log("abc------->", this.dateForSlot);
          let patientDetails = await result?.data?.result?.patientDetails;
          console.log(patientDetails, "patientDetailsss_____");

          this.chooseSlot = await result?.data?.result?.consultationTime;
          console.log("abc------->", this.chooseSlot);
          for await (let doc of result?.data?.patient_document) {
            this.chooseDoc.push({
              image_signed_url: doc?.image_url,
              name: doc?.doc_name,
              issue_date: doc?.issue_date,
            });
          }
          this.reasonSelectedId = await result.data.result?.reasonForAppointment
            ?._id;
          console.log("this.reasonSelectedId___________", this.reasonSelectedId);
          
          this.patient_details.controls["patient_name"].setValue(
            patientDetails?.patientFullName
          );
          this.patient_details.controls["first_name"].setValue(
            patientDetails?.patientFirstName
          );
          this.patient_details.controls["middle_name"].setValue(
            patientDetails?.patientMiddleName
          );
          this.patient_details.controls["last_name"].setValue(
            patientDetails?.patientLastName
          );
          this.patient_details.controls["email"].setValue(
            patientDetails?.patientEmail
          );
          this.patient_details.controls["insurance_number"].setValue(
            patientDetails?.insuranceNumber
          );
          this.patient_details.controls["mobile"].setValue(
            patientDetails?.patientMobile
          );
          this.patient_details.controls["gender"].setValue(
            patientDetails?.gender
          );
          this.patient_details.controls["patientDob"].setValue(
            patientDetails?.patientDob
          );
          this.patient_details.controls["subPatient_id"].setValue(
            patientDetails?.patientId
          );
          this.patient_details.controls["address"].setValue(
            patientDetails?.address
          );
          this.patient_details.controls["email"].setValue(
            patientDetails?.patientEmail
          );

          let obj = {
            name: patientDetails?.patientFullName,
            first_name: patientDetails?.patientFirstName,
            middle_name: patientDetails?.patientMiddleName,
            last_name: patientDetails?.patientLastName,
            dob: patientDetails?.patientDob,
            gender: patientDetails?.gender,
            mobile: patientDetails?.patientMobile,
          };

          this.patient_details.controls["familyMember"].setValue(
            obj
          );
          this.doctorAvailableSlot();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  //  Choose existing document modal
  openVerticallyCenteredexistingdoc(existingdoc: any) {
    this.modalService.open(existingdoc, {
      centered: true,
      size: "xl",
      windowClass: "existingdoc",
    });
    this.patientExistingDocs();
  }

  //  Add Medical document modal
  openVerticallyCenteredaddmedicaldoc(addmedicaldoc: any) {
    this.modalService.open(addmedicaldoc, {
      centered: true,
      size: "lg",
      windowClass: "medicaldoc",
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

  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  filteredOptions: any[];

  filterOptions(searchText: string) {
    // console.log("EVENT==>", searchText);
    if (!searchText) {
      this.filteredOptions = this.resonForAppoinmentList;
    } else {
      this.filteredOptions = this.resonForAppoinmentList.filter(
        (option) =>
          option.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
    }
  }

  getDependentFamilyMembers(isFirstTime: any = "") {
    // console.log("ADMIN DATA===>", this.adminData);
    this.familyMembersList.push({
      label: this.adminData?.first_name + " " + this.adminData?.last_name,
      name: this.adminData?.first_name + " " + this.adminData?.last_name,
      first_name: this.adminData?.first_name,
      middle_name: this.adminData?.middle_name,
      last_name: this.adminData?.last_name,
      dob: this.adminData?.dob,
      email: this.loginData?.email,
      gender: this.adminData?.gender,
      mobile: this.loginData?.mobile,
    });

    let reqData = {
      patientId: this.loginuser_id,
    };

    this._PatientService.getDependentFamilyMembers(reqData).subscribe((res) => {
      let response = this._CoreService.decryptObjectData({ data: res });

      console.log("DEPENDENT MEMBERS===>", response);
      if (response.status) {
        if (response?.body?.familyinfos?.family_members.length > 0) {
          for (const elem of response?.body?.familyinfos?.family_members) {
            this.familyMembersList.push({
              label: `${elem?.first_name} ${elem?.last_name}`,
              name: `${elem?.first_name} ${elem?.last_name}`,
              first_name: elem?.first_name,
              middle_name: elem?.middle_name,
              last_name: elem?.last_name,
              dob: elem?.dob,
              gender: elem?.gender,
              mobile: elem?.mobile_number,
              email: '',
            });
          }
        }

        // this.familyMembersList = response?.body?.familyinfos?.family_members;
      }
      console.log(isFirstTime, "anc", this.familyMembersList?.length, "family list", this.patinetSubcriberID, "abc", this.pageForEdit);

      if (
        isFirstTime === "yes" &&
        this.familyMembersList?.length != 0 &&
        this.patinetSubcriberID === "" &&
        !this.pageForEdit
      ) {
        console.log("AFTER FAMILY PATCH===>", this.familyMembersList[0]);

        this.patient_details.patchValue({
          familyMember: this.familyMembersList[0],
        });
        this.selectedFamilyMember = this.familyMembersList[0];

      }
    });
  }

  public handleClose() {
    this.modalService.dismissAll("close");
    this.router.navigate(["/patient/homepage/retaildoctor"]);
  }

  purchasePlan() {
    this.router.navigate(["/patient/subscriptionplan"]);
    this.modalService.dismissAll("close");
  }

  getDirection(direction : any) {
    if (!direction)
    {
      this.toastr.error("Location coordinates not found")
      return 
    }
    const lat = direction[1];
    const lng = direction[0];
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, "_blank");
    console.log(direction , "kkk");
    
  }

  medDocValidation(index) {
    let docs = this.medicalDocForm.get("medicalDocumnets") as FormArray;
    const formGroup = docs.controls[index] as FormGroup;
    return formGroup;
  }

  handleExpiryDateChange(date, index) {
    // console.log("EXPIRY DATE==>", date, index);

    const expiryDate = new Date(date);
    expiryDate.setDate(date.getDate() + 1);
    this.issueMinDates[index] = expiryDate;
  }

  closeDocPopup() {
    this.isSubmittedDocs = false;
    this.modalService.dismissAll("close");
    this.medicalDocForm.reset();
    this.departments.clear();
    this.addnewMedicalDoc();
  }

  isSelectedDocument(document: any): boolean {
    let flag = false;

    let res = this.chooseDoc.filter((ele) => ele._id == document._id);
    if (res.length != 0) {
      flag = true;
    }
    return flag;
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
