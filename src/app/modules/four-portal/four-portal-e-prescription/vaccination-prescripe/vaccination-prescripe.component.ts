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
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { Router } from "@angular/router";
import { FourPortalService } from "../../four-portal.service";

@Component({
  selector: 'app-vaccination-prescripe',
  templateUrl: './vaccination-prescripe.component.html',
  styleUrls: ['./vaccination-prescripe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VaccinationPrescripeComponent implements OnInit {
  filterForm: any = FormGroup;
  addVaccinationForm: any = FormGroup;
  vaccinationList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  portalId: any = "";
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

    this.addVaccinationForm = this.fb.group({
      _id: [""],
      dosage: ["", [Validators.required]],
      comment: [""],
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.portalId = loginData?._id;
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
    this.searchvaccination = this.myControl.value;
    this.getVaccinationList(this.searchvaccination);
  }

  openCommentPopup(vaccontent: any, data: any) {
    this.selectedVaccinationName = data?.name || data?.vaccination_name;

    this.modalService.open(vaccontent, {
      centered: true,

      size: "md",

      windowClass: "claim_successfully",
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
      doctorId: this.portalId,
    };
    this.indiviualDoctorService
      .listVaccinationForDoctor(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
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
      portal_type:this.userType
    };

    if (this.isEprescriptionExist) {
      this.fourPortalService.fourPortal_getEprescriptionVaccination(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
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
      portal_type:this.userType

    };

    this.fourPortalService.fourPortal_getEprescriptionVaccination(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.allVaccinationTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      this.handleAddVaccinationTest();
    } else {
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
      portalId: this.portalId,
      vaccination_name: this.selectedVaccinationName,
      ...this.addVaccinationForm.value,
      portal_type:this.userType

    };


    this.fourPortalService.fourPortal_addVaccination(reqData)
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

    let reqData = {
      VaccinationArray: [
        {
          name: name,
        },
      ],
      added_by: {
        user_id: this.portalId,
        user_type: this.userType,
      },
      is_new: true,
    };


    this.sadminService.addVaccinationApi(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }

  recentPrescribedMedicines() {
    let parameters = {
      recentItemsFor: "Vaccination",
      portalId: this.portalId,
      portal_type:this.userType
    };

    this.fourPortalService.fourPortal_RecentMedicine_prescribed(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

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

  routeToMore(){
    this.router.navigate([`/portals/eprescription/${this.userType}/details/${this.appointmentId}`])
  }
  routeToPreview(){
    this.router.navigate([`/portals/eprescription/${this.userType}/preview-ePrescription/${this.appointmentId}`])

  }
}

