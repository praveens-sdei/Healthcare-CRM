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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-eprescriptionvaccination",
  templateUrl: "./eprescriptionvaccination.component.html",
  styleUrls: ["./eprescriptionvaccination.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionvaccinationComponent implements OnInit {
  filterForm: any = FormGroup;
  addVaccinationForm: any = FormGroup;
  vaccinationList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  doctorId: any = "";
  eprescriptionDetails: any;
  isEprescriptionExist: boolean = false;
  ePrescriptionId: any = "";

  isSubmitted: boolean = false;

  selectedVaccinationId: any;
  selectedVaccinationName: any;
  allVaccinationTests: any[] = [];

  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  selectedvacinfo: any;
  searchvaccination: any = "";
  newlab: any = "";
  recentPrescribedVaccinationList: any[] = [];

  @ViewChild("addvaccinationtest") addvaccinationtest: ElementRef;
  @ViewChild("newvacmodal") newvacmodal: ElementRef;
  medicineData: any;
  patientAllDetails: any;

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

    this.addVaccinationForm = this.fb.group({
      _id: [""],
      dosage: ["", [Validators.required]],
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
    this.searchvaccination = this.myControl.value;
    this.getVaccinationList(this.searchvaccination);
  }

  openCommentPopup(vaccontent: any, data: any) {
    console.log(vaccontent, data);
    this.selectedVaccinationName = data?.name || data?.vaccination_name;

    this.modalService.open(vaccontent, {
      centered: true,

      size: "md",

      windowClass: "claim_successfully",
    });

    // this.sadminService.getLabDataId(vaccinationId).subscribe((res) => {
    //   let response = this.coreService.decryptObjectData({ data: res });

    //   console.log("Selected Vac data===>", response);
    //   this.selectedvacinfo = response?.data; //get vac by id response

    // });

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
          this.getAllVaccinationTest();
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

  getVaccinationList(query: any = "") {
    let reqData = {
      searchText: query,
      page: 1,
      limit: 0,
      doctorId: this.doctorId,
    };
    this.indiviualDoctorService
      .listVaccinationForDoctor(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All Vaccination List--->", response);
        if (response.status) {
          this.vaccinationList = response?.data?.result;

          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),

            map((value) => this._filter(value || ""))
          );
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.vaccinationList.length > 0) {
      var result = this.vaccinationList.filter((option: any) => {
        return option.name.toLowerCase().includes(filterValue);
      });

      return result != "" ? result : ["No data"];
    }

    return ["No data"];
  }

  getEprescriptionVaccinationTest() {
    this.addVaccinationForm.reset();
    let reqData = {
      vaccinationId: this.selectedVaccinationId,
      ePrescriptionId: this.ePrescriptionId,
    };

    if (this.isEprescriptionExist) {
      this.indiviualDoctorService
        .getEprescriptionVaccinationTest(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Vaccination tests--->", response);
          if (response.status) {
            this.addVaccinationForm.patchValue({
              ...response?.body,
            });
          }
        });
    }
  }

  getAllVaccinationTest() {
    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
    };

    this.indiviualDoctorService
      .getEprescriptionVaccinationTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Vaccination tests--->", response);

        if (response.status) {
          this.allVaccinationTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      console.log("Saving vaccination test");
      this.handleAddVaccinationTest();
    } else {
      console.log("Creating new prescription");
      await this.createEprescription().then((res: any) => {
        this.handleAddVaccinationTest();
      });
    }
  }

  handleAddVaccinationTest() {
    this.isSubmitted = true;
    if (this.addVaccinationForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      vaccinationId: this.selectedVaccinationId,
      doctorId: this.doctorId,
      vaccination_name: this.selectedVaccinationName,
      ...this.addVaccinationForm.value,
    };

    console.log("Req Data===>", reqData);

    this.indiviualDoctorService
      .addEprescriptionVaccinationTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getAllVaccinationTest();
        }
      });
  }

  async changeSelectedVaccination(event: any, selectFor: string = "") {
    console.log(event);
    if (selectFor === "Edit") {
      this.selectedVaccinationName = event?.vaccination_name;
      this.selectedVaccinationId = event?.vaccinationId;
    } else {
      this.selectedVaccinationName = event?.name;
      this.selectedVaccinationId = event?._id;
    }

    await this.getEprescriptionVaccinationTest();
    this.openVerticallyCenteredrabeprazole(this.addvaccinationtest);
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

  get validate() {
    return this.addVaccinationForm.controls;
  }

  // add vaccination test
  openVerticallyCenteredrabeprazole(addvaccinationtest: any) {
    this.modalService.open(addvaccinationtest, {
      centered: true,
      size: "lg",
      windowClass: "rabeprazole",
    });
  }

  handleAddNewVac() {
    this.openVerticallyCenteredNewVaccination(this.newvacmodal);
  }

  saveNewVac(name) {
    console.log(name);

    let reqData = {
      VaccinationArray: [
        {
          name: name,
        },
      ],
      added_by: {
        user_id: this.doctorId,
        user_type: "doctor",
      },
      is_new: true,
    };

    console.log("ReqData-->", reqData);

    this.sadminService.addVaccinationApi(reqData).subscribe((res) => {
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
      recentItemsFor: "Vaccination",
      doctorId: this.doctorId,
    };

    this.indiviualDoctorService
      .getRecentPrescribedMedicinesList(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RECENT PRESCRIBED VACS-->", response);

        response?.body.forEach(async (element) => {
          let obj = {
            _id: element?.vaccinationId,
            vaccination_name: element?.vaccination_name,
          };

          let result = this.recentPrescribedVaccinationList.filter((s) =>
            s?.vaccination_name.includes(element.vaccination_name)
          );
          if (result.length === 0) {
            this.recentPrescribedVaccinationList.push(obj);
          }
        });
      });
  }

  // Mew Vaccination modal
  openVerticallyCenteredNewVaccination(newvacmodal: any) {
    this.modalService.open(newvacmodal, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }
}
