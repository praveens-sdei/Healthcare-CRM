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
  selector: 'app-lab-prescripe',
  templateUrl: './lab-prescripe.component.html',
  styleUrls: ['./lab-prescripe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LabPrescripeComponent implements OnInit {
  filterForm: any = FormGroup;
  addLabForm: any = FormGroup;
  labList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  userID: any = "";
  eprescriptionDetails: any;
  isEprescriptionExist: boolean = false;
  ePrescriptionId: any = "";

  isSubmitted: boolean = false;

  selectedLab: any;
  selectedLabId: any;
  selectedLabName: any;
  allLabTests: any[] = [];

  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  selectedlabinfo: any;
  searchlab: any = "";
  newlab: any = "";
  recentPrescribedLabList: any[] = [];

  @ViewChild("addlabtest") addlabtest: ElementRef;
  @ViewChild("newlabmodal") newlabmodal: ElementRef;
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

    this.addLabForm = this.fb.group({
      _id: [""],
      reason_for_lab: [""],
      relevant_clinical_information: [""],
      specific_instruction: [""],
      comment: [""],
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userID = loginData?._id;
    this.userType = loginData?.type
    this.appointmentId = sessionStorage.getItem("appointmentId");
    this.patientName = sessionStorage.getItem("patientName");
    this.getEprescription();
    this.recentPrescribedMedicines();
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
    this.searchlab = this.myControl.value;
    this.getLabList(this.searchlab);
  }

  openCommentPopup(labtestcontent: any, labId: any) {

    this.sadminService.getLabDataId(labId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      this.selectedlabinfo = response?.data; //get lab by id response

      this.modalService.open(labtestcontent, {
        centered: true,

        size: "md",

        windowClass: "claim_successfully",
      });
    });

  }

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
      portal_type: this.userType
    };

    this.fourPortalService
      .fourPortal_get_ePrescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.eprescriptionDetails = response?.body;
          this.isEprescriptionExist = true;
          this.ePrescriptionId = response?.body?._id;
          this.getAllLabTest();
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

  getLabList(query = "") {
    let reqData = {
      searchText: query,
      page: 1,
      limit: 0,
      doctorId: this.userID,
    };
    this.indiviualDoctorService.getLabListData(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.labList = response?.data?.result;

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(""),

          map((value) => this._filter(value || ""))
        );
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.labList.length > 0) {
      var result = this.labList.filter((option: any) => {
        return option.lab_test.toLowerCase().includes(filterValue);
      });

      return result != "" ? result : ["No data"];
    }

    return ["No data"];
  }

  getEprescriptionLabTest() {
    this.addLabForm.reset();
    let reqData = {
      labId: this.selectedLabId,
      ePrescriptionId: this.ePrescriptionId,
      portal_type: this.userType
    };

    if (this.isEprescriptionExist) {
      this.fourPortalService.fourPortal_getEprescriptionLabTest(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.addLabForm.patchValue({
              ...response?.body,
            });
          }
        });
    }
  }

  getAllLabTest() {
    let reqData = {
      labId: "",
      ePrescriptionId: this.ePrescriptionId,
      portal_type: this.userType
    };

    this.fourPortalService
      .fourPortal_getEprescriptionLabTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.allLabTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      this.handleAddLabTest();
    } else {
      await this.createEprescription().then((res: any) => {
        this.handleAddLabTest();
      });
    }
  }

  handleAddLabTest() {
    this.isSubmitted = true;
    if (this.addLabForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      portalId: this.userID,
      portal_type: this.userType,
      labId: this.selectedLabId,
      lab_name: this.selectedLabName,
      ...this.addLabForm.value,
    };


    this.fourPortalService
      .fourPortal_addLABTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getAllLabTest();
        }
      });
  }

  async changeSelectedLab(event: any, selectFor: string = "") {
    if (selectFor === "Edit") {
      this.selectedLabName = event?.lab_name;
      this.selectedLabId = event?.labId;
    } else {
      this.selectedLabName = event?.lab_test;
      this.selectedLabId = event?._id;
    }

    await this.getEprescriptionLabTest();
    this.openVerticallyCenteredrabeprazole(this.addlabtest);
  }

  async createEprescription() {
    let data = this.filterForm.value;
    let reqData = {
      appointmentId: this.appointmentId,
      portalId: this.userID,
      ePrescriptionNumber: "",
      patientBiometric: {
        height: data?.height,
        weight: data?.weight,
        bmi: data?.bmi,
      },
      liverFailure: data?.liver_failure,
      renalFailure: data?.renal_failure,     
      accidentRelated: data?.accident_related,
      occupationalDesease: data?.occupational_desease,
      freeOfCharge: data?.free_of_charge,
      portal_type: this.userType
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

  // add lab test  modal
  openVerticallyCenteredlabtest(addlabtest: any) {
    this.modalService.open(addlabtest, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  // add lab test
  openVerticallyCenteredrabeprazole(rabeprazolecontent: any) {
    this.modalService.open(rabeprazolecontent, {
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
    return this.addLabForm.controls;
  }

  handleAddNewLab() {
    this.openVerticallyCenteredNewMedicine(this.newlabmodal);
  }

  saveNewLab(name) {

    let reqData = {
      labTestArray: [
        {
          lab_test: name,
        },
      ],
      added_by: {
        user_id: this.userID,
        user_type: this.userType,
      },
      is_new: true,
    };


    this.sadminService.labAddTest(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }

  recentPrescribedMedicines() {
    let parameters = {
      recentItemsFor: "Labs",
      portalId: this.userID,
      portal_type: this.userType
    };

    this.fourPortalService
      .fourPortal_RecentMedicine_prescribed(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        response?.body.forEach(async (element) => {
          let obj = {
            _id: element?.labId,
            lab_name: element?.lab_name,
          };

          let result = this.recentPrescribedLabList.filter((s) =>
            s?.lab_name.includes(element.lab_name)
          );
          if (result.length === 0) {
            this.recentPrescribedLabList.push(obj);
          }
        });
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

  routeToMore() {
    this.router.navigate([`/portals/eprescription/${this.userType}/details/${this.appointmentId}`])
  }
  routeToPreview() {
    this.router.navigate([`/portals/eprescription/${this.userType}/preview-ePrescription/${this.appointmentId}`])

  }
}
