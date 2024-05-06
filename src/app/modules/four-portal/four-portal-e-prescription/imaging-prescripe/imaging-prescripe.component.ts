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
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-imaging-prescripe',
  templateUrl: './imaging-prescripe.component.html',
  styleUrls: ['./imaging-prescripe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImagingPrescripeComponent implements OnInit {
  filterForm: any = FormGroup;
  addImagingForm: any = FormGroup;
  imagingList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  portalId: any = "";
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
    this.searchimaging = this.myControl.value;
    this.getImagingList(this.searchimaging);
  }

  openCommentPopup(imagingcontent: any, imagingId: any) {

    this.sadminService.otherImagingDetailsApi(imagingId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      this.selectedimaginginfo = response?.data; //get image by id response

      this.modalService.open(imagingcontent, {
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
      doctorId: this.portalId,
    };
    this.indiviualDoctorService
      .listImagingForDoctor(params)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
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
      portal_type:this.userType

    };

    this.fourPortalService.fourPortal_getEprescriptionImaging(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.allImagingTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      this.handleAddImagingTest();
    } else {
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
      portalId: this.portalId,
      imagingId: this.selectedImagingId,
      imaging_name: this.selectedImagingName,
      ...this.addImagingForm.value,
      portal_type:this.userType

    };


    this.fourPortalService.fourPortal_addImaging(reqData)
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

  showForm() {
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

    let reqData = {
      ImagingTestArray: [
        {
          imaging: name,
        },
      ],
      added_by: {
        user_id: this.portalId,
        user_type: this.userType,
      },
      is_new: true,
    };


    this.sadminService.addImagingApi(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }

  recentPrescribed() {
    let parameters = {
      recentItemsFor: "Imaging",
      portalId: this.portalId,
      portal_type:this.userType
    };

    this.fourPortalService.fourPortal_RecentMedicine_prescribed(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

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
  routeToMore(){
    this.router.navigate([`/portals/eprescription/${this.userType}/details/${this.appointmentId}`])
  }
  routeToPreview(){
    this.router.navigate([`/portals/eprescription/${this.userType}/preview-ePrescription/${this.appointmentId}`])

  }
}
