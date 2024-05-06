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
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Observable, map, startWith } from "rxjs";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-eyeglass-prescripe',
  templateUrl: './eyeglass-prescripe.component.html',
  styleUrls: ['./eyeglass-prescripe.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EyeglassPrescripeComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;

  filterForm: any = FormGroup;
  eyeGlassForm: any = FormGroup;
  eyeglassList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  portalId: any = "";
  eprescriptionDetails: any;
  isEprescriptionExist: boolean = false;
  ePrescriptionId: any = "";

  isSubmitted: boolean = false;

  selectedEyeglassId: any;
  selectedEyeglassName: any;
  allEyeglassTests: any[] = [];

  commonValues = [
    { name: "-2.50", value: -2.5 },
    { name: "-2.25", value: -2.25 },
    { name: "-2", value: -2 },
    { name: "-1.75", value: -1.75 },
    { name: "-1.50", value: -1.5 },
    { name: "-1.25", value: -1.25 },
    { name: "-1", value: -1 },
    { name: "-0.75", value: -0.75 },
    { name: "-0.50", value: -0.5 },
    { name: "-0.25 ", value: -0.25 },
    { name: "0", value: 0 },
    { name: "0.25", value: 0.25 },
    { name: "0.50", value: 0.5 },
    { name: "0.75", value: 0.75 },
    { name: "1", value: 1 },
    { name: "1.25", value: 1.25 },
  ];

  @ViewChild("addeyeglasstest") addeyeglasstest: ElementRef;
  @ViewChild("neweyeglassmodal") neweyeglassmodal: ElementRef;

  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  userCtrl = new FormControl("");
  user: any[] = [];
  selectedTreatment: any[] = [];
  selectedStaff: any[] = [];

  selectedeyeglassinfo: any;
  searcheyeglass: any = "";
  neweyeglass: any = "";
  recentPrescribedEyeglassList: any[] = [];
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

    this.eyeGlassForm = this.fb.group({
      _id: [""],
      left_eye: this.fb.group({
        sphere: [0, [Validators.required]],
        cylinder: [0, [Validators.required]],
        axis: [0, [Validators.required]],
        addition: [0, [Validators.required]],
      }),
      right_eye: this.fb.group({
        sphere: [0, [Validators.required]],
        cylinder: [0, [Validators.required]],
        axis: [0, [Validators.required]],
        addition: [0, [Validators.required]],
      }),
      treatments: [[], [Validators.required]],
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
    this.searcheyeglass = this.myControl.value;
    this.getEyeglassList(this.searcheyeglass);
  }

  openCommentPopup(eyeglasscontent: any, data: any) {
    this.selectedEyeglassName = data?.eyeglass_name;

    this.modalService.open(eyeglasscontent, {
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
    .fourPortal_get_ePrescription(reqData).subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.eprescriptionDetails = response?.body;
          this.isEprescriptionExist = true;
          this.ePrescriptionId = response?.body?._id;
          this.getAllEyeglassTest();
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
      liver_failure: data?.liverFailure,
      renal_failure: data?.renalFailure,
      accident_related: data?.accidentRelated,
      occupational_desease: data?.occupationalDesease,
      free_of_charge: data?.freeOfCharge,
    });
  }

  getEyeglassList(query: any = "") {
    let reqData = {
      searchText: query,
      page: 1,
      limit: 0,
      doctorId: this.portalId,
    };
    this.indiviualDoctorService
      .listEyeglassessForDoctor(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.eyeglassList = response?.data?.result;

          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),

            map((value) => this._filter(value || ""))
          );
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.eyeglassList.length > 0) {
      var result = this.eyeglassList.filter((option: any) => {
        return option.eyeglass_name.toLowerCase().includes(filterValue);
      });

      return result != "" ? result : ["No data"];
    }

    return ["No data"];
  }

  getEprescriptionEyeglassTest() {
    this.eyeGlassForm.reset();
    let reqData = {
      eyeglassId: this.selectedEyeglassId,
      ePrescriptionId: this.ePrescriptionId,
      portal_type:this.userType

    };

    if (this.isEprescriptionExist) {
      this.fourPortalService.fourPortal_getEprescriptionEyeglasses(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.eyeGlassForm.patchValue({
              ...response?.body,
            });
          }

          this.user = response?.body?.treatments;

        });
    }
  }

  getAllEyeglassTest() {
    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      portal_type:this.userType

    };

    this.fourPortalService.fourPortal_getEprescriptionEyeglasses(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.allEyeglassTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      this.handleAddEyeGalssTest();
    } else {
      await this.createEprescription().then((res: any) => {
        this.handleAddEyeGalssTest();
      });
    }
  }

  handleAddEyeGalssTest() {
    this.isSubmitted = true;
    if (this.eyeGlassForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      _id: this.eyeGlassForm.value._id,
      ePrescriptionId: this.ePrescriptionId,
      portalId: this.portalId,
      eyeglassId: this.selectedEyeglassId,
      eyeglass_name: this.selectedEyeglassName,
      left_eye: this.eyeGlassForm.value.left_eye,
      right_eye: this.eyeGlassForm.value.right_eye,
      visual_acuity: {
        left_eye: "5/10",
        right_eye: "5/10",
      },
      comment: this.eyeGlassForm.value.comment,
      treatments: this.eyeGlassForm.value.treatments,
      portal_type:this.userType

    };


    this.fourPortalService.fourPortal_addEyeglass(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.getAllEyeglassTest();
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
        }
      });
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

  async changeSelectedEyeglass(event: any, selectFor: string = "") {
    if (selectFor === "Edit") {
      this.selectedEyeglassName = event?.eyeglass_name;
      this.selectedEyeglassId = event?.eyeglassId;
    } else {
      this.selectedEyeglassName = event?.eyeglass_name;
      this.selectedEyeglassId = event?._id;
    }

    await this.getEprescriptionEyeglassTest();
    this.openVerticallyCenteredrabeprazole(this.addeyeglasstest);
  }

  showForm() {
  }

  // add vaccination test
  openVerticallyCenteredrabeprazole(addeyeglasstest: any) {
    this.modalService.open(addeyeglasstest, {
      centered: true,
      size: "lg",
      windowClass: "rabeprazole",
    });
  }

  get registerFormControl() {
    return this.eyeGlassForm.controls;
  }

  get f1() {
    return this.eyeGlassForm.controls.left_eye as FormGroup;
  }

  get f2() {
    return this.eyeGlassForm.controls.right_eye as FormGroup;
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleAddNewEyglass() {
    this.openVerticallyCenteredNewMedicine(this.neweyeglassmodal);
  }

  saveNewEyeglass(name) {

    let reqData = {
      eyeglassData: [
        {
          eyeglass_name: name,
        },
      ],
      added_by: {
        user_id: this.portalId,
        user_type: this.userType,
      },
      is_new: true,
    };


    this.sadminService.addEyeglassessApi(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }

  recentPrescribed() {
    let parameters = {
      recentItemsFor: "Eyeglass",
      portalId: this.portalId,
      portal_type:this.userType

    };

    this.fourPortalService
      .fourPortal_RecentMedicine_prescribed(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        response?.body.forEach(async (element) => {
          let obj = {
            _id: element?.eyeglassId,
            eyeglass_name: element?.eyeglass_name,
          };

          let result = this.recentPrescribedEyeglassList.filter((s) =>
            s?.eyeglass_name.includes(element.eyeglass_name)
          );
          if (result.length === 0) {
            this.recentPrescribedEyeglassList.push(obj);
          }
        });
      });
  }

  // Mew Medicine modal
  openVerticallyCenteredNewMedicine(neweyeglassmodal: any) {
    this.modalService.open(neweyeglassmodal, {
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
