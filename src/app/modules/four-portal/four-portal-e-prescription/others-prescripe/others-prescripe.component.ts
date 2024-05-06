import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-others-prescripe',
  templateUrl: './others-prescripe.component.html',
  styleUrls: ['./others-prescripe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OthersPrescripeComponent implements OnInit {
  filterForm: any = FormGroup;
  addForm: any = FormGroup;
  addOtherForm: any = FormGroup;
  otherList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  portalId: any = "";
  eprescriptionDetails: any;
  isEprescriptionExist: boolean = false;
  ePrescriptionId: any = "";

  isSubmitted: boolean = false;

  selectedOtherId: any;
  selectedOtherName: any;
  allOtherTests: any[] = [];

  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  selectedotherinfo: any;
  searchother: any = "";
  newother: any = "";
  recentPrescribedOtherList: any[] = [];

  @ViewChild("addothertest") addothertest: ElementRef;
  @ViewChild("newothermodal") newothermodal: ElementRef;
  userType: any;
  patientAllDetails: any;
  medicineData: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private indiviualDoctorService: IndiviualDoctorService,
    private fourPortalService: FourPortalService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      height: [0],
      weight: [0],
      bmi: [0],
      bmi_inetpreter: [0],
      liver_failure: ["None"],
      renal_failure: ["None"],
      accident_related: [false],
      occupational_desease: [false],
      free_of_charge: [false],
    });

    this.addOtherForm = this.fb.group({
      _id: [""],
      reason_for_other: [""],
      relevant_clinical_information: [""],
      specific_instruction: [""],
      comment: [""],
    });

    this.addForm = this.fb.group({
      relevant_information: [""],
      specific_instruction: [""],
      additional_comments: [""],
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.portalId = loginData?._id;
    this.userType = loginData?.type
    this.appointmentId = sessionStorage.getItem("appointmentId");
    this.patientName = sessionStorage.getItem("patientName");

    this.getEprescription();
    this.recentPrescribed();
    this.getAppointmentDetails();
  }


  async getAppointmentDetails() {
    let reqData = {
      appointment_id: this.appointmentId,
      portal_type: this.userType
    }
    this.fourPortalService
      .fourPortal_appointment_deatils(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("response?.body______________", response?.body);

        if (response.status) {
          this.patientAllDetails = response?.data?.patientAllDetails;
          this.medicineData =  this.patientAllDetails?.medicineDetails?.current_medicines[ this.patientAllDetails?.medicineDetails?.current_medicines.length - 1];

        }
      });
  }

  handleLabChange(event) {
    this.searchother = this.myControl.value;
    this.getOtherList(this.searchother);
  }

  openCommentPopup(othercontent: any, otherId: any) {

    this.sadminService.otherInfoDetailsApi(otherId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      this.selectedotherinfo = response?.data; //get lab by id response

      this.modalService.open(othercontent, {
        centered: true,

        size: "md",

        windowClass: "claim_successfully",
      });
    });

  }

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
      portal_type:this.userType
    };

    this.fourPortalService
    .fourPortal_get_ePrescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.eprescriptionDetails = response?.body;
          this.isEprescriptionExist = true;
          this.ePrescriptionId = response?.body?._id;
          this.getAllOtherTest();
          this.patchPatientDetails(response?.body);
        } else {
          this.eprescriptionDetails = response?.body;
          this.isEprescriptionExist = false;
        }
      });
  }

  patchPatientDetails(data) {
    this.filterForm.patchValue({
      height: data?.patientBiometric?.height,
      weight: data?.patientBiometric?.weight,
      bmi: data?.patientBiometric?.bmi,
      bmi_inetpreter: data?.patientBiometric?.bmiInterpreter,
      liver_failure: data?.liverFailure,
      renal_failure: data?.renalFailure,
      accident_related: data?.accidentRelated,
      occupational_desease: data?.occupationalDesease,
      free_of_charge: data?.freeOfCharge,
    });
  }

  getOtherList(query: any = "") {
    let reqData = {
      searchText: query,
      page: 1,
      limit: 0,
      doctorId: this.portalId,
    };
    this.indiviualDoctorService
      .listOthersForDoctor(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.otherList = response?.data?.result;

          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),

            map((value) => this._filter(value || ""))
          );
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.otherList.length > 0) {
      var result = this.otherList.filter((option: any) => {
        return option.others.toLowerCase().includes(filterValue);
      });

      return result != "" ? result : ["No data"];
    }

    return ["No data"];
  }

  getEprescriptionOtherTest() {
    this.addOtherForm.reset();
    let reqData = {
      otherId: this.selectedOtherId,
      ePrescriptionId: this.ePrescriptionId,
      portal_type:this.userType

    };

    if (this.isEprescriptionExist) {
      this.fourPortalService
        .fourPortal_getEprescriptionOthers(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.addOtherForm.patchValue({
              ...response?.body,
            });
          }
        });
    }
  }

  getAllOtherTest() {
    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      portal_type:this.userType
    };

    this.fourPortalService.fourPortal_getEprescriptionOthers(reqData)
    .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.allOtherTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      this.handleAddOtherTest();
    } else {
      await this.createEprescription().then((res: any) => {
        this.handleAddOtherTest();
      });
    }
  }

  handleAddOtherTest() {
    this.isSubmitted = true;
    if (this.addOtherForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      portalId: this.portalId,
      otherId: this.selectedOtherId,
      other_name: this.selectedOtherName,
      ...this.addOtherForm.value,
      portal_type:this.userType

    };


    this.fourPortalService
      .fourPortal_addOthers(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getAllOtherTest();
        }
      });
  }

  async changeSelectedOther(event: any, selectFor: string = "") {
    if (selectFor === "Edit") {
      this.selectedOtherName = event?.other_name;
      this.selectedOtherId = event?.otherId;
    } else {
      this.selectedOtherName = event?.others;
      this.selectedOtherId = event?._id;
    }

    await this.getEprescriptionOtherTest();
    this.openVerticallyCenteredrabeprazole(this.addothertest);
  }

  async createEprescription() {
    let data = this.filterForm.value;
    let reqData = {
      appointmentId: this.appointmentId,
      portalId: this.portalId,
      ePrescriptionNumber: "",
      patientBiometric: {
        height: data?.height,
        weight: data?.weight,
        bmi: data?.bmi,
        bmiInterpreter: data?.bmi_inetpreter,
      },
      liverFailure: data?.liver_failure,
      renalFailure: data?.renal_failure,      
      accidentRelated: data?.accident_related,
      occupationalDesease: data?.occupational_desease,
      freeOfCharge: data?.free_of_charge,
      portal_type:this.userType

    };

    return new Promise((resolve, reject) => {
      this.fourPortalService.fourPortal_create_eprescription(reqData).subscribe({
        next: (res: any) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.ePrescriptionId = response?.body?._id;
            this.toastr.success(response.message);
            this.getEprescription();
          }
          resolve(response);
          reject(response);
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    });
  }

  // Other modal
  openVerticallyCenteredother(othercontent: any) {
    this.modalService.open(othercontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  // add lab test
  openVerticallyCenteredrabeprazole(addothertest: any) {
    this.modalService.open(addothertest, {
      centered: true,
      size: "lg",
      windowClass: "rabeprazole",
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

  get validate() {
    return this.addOtherForm.controls;
  }

  handleAddNewOther() {
    this.openVerticallyCenteredNewMedicine(this.newothermodal);
  }

  saveNewOther(name) {

    let reqData = {
      OthersTestArray: [
        {
          others: name,
        },
      ],
      added_by: {
        user_id: this.portalId,
        user_type: this.userType,
      },
      is_new: true,
    };


    this.sadminService.addOthersApi(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }

  // Mew Medicine modal
  openVerticallyCenteredNewMedicine(newlabmodal: any) {
    this.modalService.open(newlabmodal, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }
  recentPrescribed() {
    let parameters = {
      recentItemsFor: "Others",
      portalId: this.portalId,
      portal_type:this.userType
    };

    this.fourPortalService.fourPortal_RecentMedicine_prescribed(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        response?.body.forEach(async (element) => {
          let obj = {
            _id: element?.otherId,
            other_name: element?.other_name,
          };

          let result = this.recentPrescribedOtherList.filter((s) =>
            s?.other_name.includes(element.other_name)
          );
          if (result.length === 0) {
            this.recentPrescribedOtherList.push(obj);
          }
        });
      });
  }
  

  routeToMore(){
    this.router.navigate([`/portals/eprescription/${this.userType}/details/${this.appointmentId}`])
  }
  routeToPreview(){
    this.router.navigate([`/portals/eprescription/${this.userType}/preview-ePrescription/${this.appointmentId}`])

  }
}
