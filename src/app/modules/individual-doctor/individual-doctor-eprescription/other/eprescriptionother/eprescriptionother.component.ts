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
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-eprescriptionother",
  templateUrl: "./eprescriptionother.component.html",
  styleUrls: ["./eprescriptionother.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionotherComponent implements OnInit {
  filterForm: any = FormGroup;
  addForm: any = FormGroup;
  addOtherForm: any = FormGroup;
  otherList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  doctorId: any = "";
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
    this.doctorId = loginData?._id;
    this.appointmentId = sessionStorage.getItem("appointmentId");
    this.patientName = sessionStorage.getItem("patientName");

    this.getEprescription();
    this.getAppointmentDetails();
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
    this.searchother = this.myControl.value;
    this.getOtherList(this.searchother);
  }

  openCommentPopup(othercontent: any, otherId: any) {
    console.log(othercontent, otherId);

    this.sadminService.otherInfoDetailsApi(otherId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      console.log("Selected Other data===>", response);
      this.selectedotherinfo = response?.data; //get lab by id response

      this.modalService.open(othercontent, {
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
      doctorId: this.doctorId,
    };
    this.indiviualDoctorService
      .listOthersForDoctor(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All Others Super List--->", response);
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
    };

    if (this.isEprescriptionExist) {
      this.indiviualDoctorService
        .getEprescriptionOtherTest(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Other tests--->", response);
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
    };

    this.indiviualDoctorService
      .getEprescriptionOtherTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All Other tests--->", response);

        if (response.status) {
          this.allOtherTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      console.log("Saving lab test");
      this.handleAddOtherTest();
    } else {
      console.log("Creating new prescription");
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
      doctorId: this.doctorId,
      otherId: this.selectedOtherId,
      other_name: this.selectedOtherName,
      ...this.addOtherForm.value,
    };

    console.log("Req Data===>", reqData);

    this.indiviualDoctorService
      .addEprescriptionOtherTest(reqData)
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
    console.log(event);
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
    console.log(name);

    let reqData = {
      OthersTestArray: [
        {
          others: name,
        },
      ],
      added_by: {
        user_id: this.doctorId,
        user_type: "doctor",
      },
      is_new: true,
    };

    console.log("ReqData-->", reqData);

    this.sadminService.addOthersApi(reqData).subscribe((res) => {
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

          let result = this.recentPrescribedOtherList.filter((s) =>
            s?.lab_name.includes(element.lab_name)
          );
          if (result.length === 0) {
            this.recentPrescribedOtherList.push(obj);
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
