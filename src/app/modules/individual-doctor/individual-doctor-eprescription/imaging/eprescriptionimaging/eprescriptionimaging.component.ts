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
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-eprescriptionimaging",
  templateUrl: "./eprescriptionimaging.component.html",
  styleUrls: ["./eprescriptionimaging.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionimagingComponent implements OnInit {
  filterForm: any = FormGroup;
  addImagingForm: any = FormGroup;
  imagingList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  doctorId: any = "";
  eprescriptionDetails: any;
  isEprescriptionExist: boolean = false;
  ePrescriptionId: any = "";

  isSubmitted: boolean = false;

  selectedImagingId: any;
  selectedImagingName: any;
  allImagingTests: any[] = [];

  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  selectedimaginginfo: any;
  searchimaging: any = "";
  newimaging: any = "";
  recentPrescribedImagingList: any[] = [];

  @ViewChild("addimagingtest") addimagingtest: ElementRef;
  @ViewChild("newimagingmodal") newimagingmodal: ElementRef;
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

    this.addImagingForm = this.fb.group({
      _id: [""],
      reason_for_imaging: [""],
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
    this.searchimaging = this.myControl.value;
    this.getImagingList(this.searchimaging);
  }

  openCommentPopup(imagingcontent: any, imagingId: any) {
    console.log(imagingcontent, imagingId);

    this.sadminService.otherImagingDetailsApi(imagingId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      console.log("Selected Imaging data===>", response);
      this.selectedimaginginfo = response?.data; //get image by id response

      this.modalService.open(imagingcontent, {
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
          this.getAllImagingTest();
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

  getImagingList(text: any = "") {
    let params = {
      searchText: text,
      page: 1,
      limit: 0,
      doctorId: this.doctorId,
    };
    this.indiviualDoctorService
      .listImagingForDoctor(params)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All Imaging List--->", response);
        if (response.status) {
          this.imagingList = response?.data?.result;

          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),

            map((value) => this._filter(value || ""))
          );
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.imagingList.length > 0) {
      var result = this.imagingList.filter((option: any) => {
        return option.imaging.toLowerCase().includes(filterValue);
      });

      return result != "" ? result : ["No data"];
    }

    return ["No data"];
  }

  getEprescriptionImagingTest() {
    this.addImagingForm.reset();
    let reqData = {
      imagingId: this.selectedImagingId,
      ePrescriptionId: this.ePrescriptionId,
    };

    if (this.isEprescriptionExist) {
      this.indiviualDoctorService
        .getEprescriptionImagingTest(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("LAb tests--->", response);
          if (response.status) {
            this.addImagingForm.patchValue({
              ...response?.body,
            });
          }
        });
    }
  }

  getAllImagingTest() {
    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
    };

    this.indiviualDoctorService
      .getEprescriptionImagingTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Imaging tests--->", response);

        if (response.status) {
          this.allImagingTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      console.log("Saving imaging test");
      this.handleAddImagingTest();
    } else {
      console.log("Creating new prescription");
      await this.createEprescription().then((res: any) => {
        this.handleAddImagingTest();
      });
    }
  }

  handleAddImagingTest() {
    this.isSubmitted = true;
    if (this.addImagingForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      doctorId: this.doctorId,
      imagingId: this.selectedImagingId,
      imaging_name: this.selectedImagingName,
      ...this.addImagingForm.value,
    };

    console.log("Req Data===>", reqData);

    this.indiviualDoctorService
      .addEprescriptionImagingTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getAllImagingTest();
        }
      });
  }

  async changeSelectedImaging(event: any, selectFor: string = "") {
    console.log(event);
    if (selectFor === "Edit") {
      this.selectedImagingName = event?.imaging_name;
      this.selectedImagingId = event?.imagingId;
    } else {
      this.selectedImagingName = event?.imaging;
      this.selectedImagingId = event?._id;
    }

    await this.getEprescriptionImagingTest();
    this.openVerticallyCenteredrabeprazole(this.addimagingtest);
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

  showForm() {
    console.log(this.filterForm.value);
  }
  // Imaging modal
  openVerticallyCenteredimaging(imagingcontent: any) {
    this.modalService.open(imagingcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  // add imaging test
  openVerticallyCenteredrabeprazole(addimagingtest: any) {
    this.modalService.open(addimagingtest, {
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
    return this.addImagingForm.controls;
  }

  handleAddNewImaging() {
    this.openVerticallyCenteredNewMedicine(this.newimagingmodal);
  }

  // Mew Medicine modal
  openVerticallyCenteredNewMedicine(newimagingmodal: any) {
    this.modalService.open(newimagingmodal, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  saveNewImaging(name) {
    console.log(name);

    let reqData = {
      ImagingTestArray: [
        {
          imaging: name,
        },
      ],
      added_by: {
        user_id: this.doctorId,
        user_type: "doctor",
      },
      is_new: true,
    };

    console.log("ReqData-->", reqData);

    this.sadminService.addImagingApi(reqData).subscribe((res) => {
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
      recentItemsFor: "Imaging",
      doctorId: this.doctorId,
    };

    this.indiviualDoctorService
      .getRecentPrescribedMedicinesList(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RECENT IMAGING PRESCRIBED-->", response);

        response?.body.forEach(async (element) => {
          let obj = {
            _id: element?.imagingId,
            imaging_name: element?.imaging_name,
          };

          let result = this.recentPrescribedImagingList.filter((s) =>
            s?.imaging_name.includes(element.imaging_name)
          );
          if (result.length === 0) {
            this.recentPrescribedImagingList.push(obj);
          }
        });
      });
  }
}
