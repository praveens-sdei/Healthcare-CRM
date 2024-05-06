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
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-eprescriptionlab",
  templateUrl: "./eprescriptionlab.component.html",
  styleUrls: ["./eprescriptionlab.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionlabComponent implements OnInit {
  filterForm: any = FormGroup;
  addLabForm: any = FormGroup;
  labList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  doctorId: any = "";
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
  patientAllDetails: any;
  medicineData: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private indiviualDoctorService: IndiviualDoctorService,
    private toastr: ToastrService
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
    this.doctorId = loginData?._id;
    this.appointmentId = sessionStorage.getItem("appointmentId");
    this.patientName = sessionStorage.getItem("patientName");
    this.getEprescription();
    this.getAppointmentDetails();

    this.recentPrescribedMedicines();
  }

  async getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.patientAllDetails = response?.data?.patientAllDetails;
  
          console.log("DEtails====>", response);
  
          this.medicineData = this.patientAllDetails?.medicineDetails?.current_medicines[this.patientAllDetails?.medicineDetails?.current_medicines.length - 1];
        }
      });
  }

  handleLabChange(event) {
    this.searchlab = this.myControl.value;
    this.getLabList(this.searchlab);
  }

  openCommentPopup(labtestcontent: any, labId: any) {
    console.log(labtestcontent, labId);

    this.sadminService.getLabDataId(labId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      console.log("Selected Lab data===>", response);
      this.selectedlabinfo = response?.data; //get lab by id response

      this.modalService.open(labtestcontent, {
        centered: true,

        size: "md",

        windowClass: "claim_successfully",
      });
    });

    // console.log(this.selectedlabinfo);
  }

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
    };

    this.indiviualDoctorService
      .getEprescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        console.log("Eprescription Get====>", response);
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
      doctorId: this.doctorId,
    };
    this.indiviualDoctorService.getLabListData(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("All Lab List--->", response);
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
    };

    if (this.isEprescriptionExist) {
      this.indiviualDoctorService
        .getEprescriptionLabTest(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("LAb tests--->", response);
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
    };

    this.indiviualDoctorService
      .getEprescriptionLabTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("LAb tests--->", response);

        if (response.status) {
          this.allLabTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      console.log("Saving lab test");
      this.handleAddLabTest();
    } else {
      console.log("Creating new prescription");
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
      doctorId: this.doctorId,
      labId: this.selectedLabId,
      lab_name: this.selectedLabName,
      ...this.addLabForm.value,
    };

    console.log("Req Data===>", reqData);

    this.indiviualDoctorService
      .addEprescriptionLabTest(reqData)
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
    console.log(event);
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
      doctorId: this.doctorId,
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
    };

    return new Promise((resolve, reject) => {
      this.indiviualDoctorService.createEprescription(reqData).subscribe({
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
    console.log(name);

    let reqData = {
      labTestArray: [
        {
          lab_test: name,
        },
      ],
      added_by: {
        user_id: this.doctorId,
        user_type: "doctor",
      },
      is_new: true,
    };

    console.log("ReqData-->", reqData);

    this.sadminService.labAddTest(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response);
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }

  recentPrescribedMedicines() {
    let parameters = {
      recentItemsFor: "Labs",
      doctorId: this.doctorId,
    };

    this.indiviualDoctorService
      .getRecentPrescribedMedicinesList(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RECENT PRESCRIBED LABS-->", response);

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
}
