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
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-eprescriptioneyeglasses",
  templateUrl: "./eprescriptioneyeglasses.component.html",
  styleUrls: ["./eprescriptioneyeglasses.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptioneyeglassesComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  dropDownForm: FormGroup;

  filterForm: any = FormGroup;
  eyeGlassForm: any = FormGroup;
  eyeglassList: any = [];

  appointmentId: any = "";
  patientName: any = "";
  doctorId: any = "";
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
    this.searcheyeglass = this.myControl.value;
    this.getEyeglassList(this.searcheyeglass);
  }

  openCommentPopup(eyeglasscontent: any, data: any) {
    console.log(eyeglasscontent, data);
    this.selectedEyeglassName = data?.eyeglass_name;

    this.modalService.open(eyeglasscontent, {
      centered: true,

      size: "md",

      windowClass: "claim_successfully",
    });

    // this.sadminService.getLabDataId(labId).subscribe((res) => {
    //   let response = this.coreService.decryptObjectData({ data: res });

    //   console.log("Selected Lab data===>", response);
    //   this.selectedeyeglassinfo = response?.data; //get lab by id response

    //   this.modalService.open(labtestcontent, {
    //     centered: true,

    //     size: "md",

    //     windowClass: "claim_successfully",
    //   });
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
      bmi_inetpreter: data?.patientBiometric?.bmiInterpreter,
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
      doctorId: this.doctorId,
    };
    this.indiviualDoctorService
      .listEyeglassessForDoctor(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All Eyeglass Super List--->", response);
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
    };

    if (this.isEprescriptionExist) {
      this.indiviualDoctorService
        .getEprescriptionEyeglassTest(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("eyeglass tests--->", response);
          if (response.status) {
            this.eyeGlassForm.patchValue({
              ...response?.body,
            });
          }

          this.user = response?.body?.treatments;

          console.log("AFTER PATCH---->", this.eyeGlassForm.value);
        });
    }
  }

  getAllEyeglassTest() {
    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
    };

    this.indiviualDoctorService
      .getEprescriptionEyeglassTest(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All eyeglass tests--->", response);

        if (response.status) {
          this.allEyeglassTests = response?.body;
        }
      });
  }

  async checkForEprescriptionExist() {
    if (this.isEprescriptionExist) {
      console.log("Saving vaccination test");
      this.handleAddEyeGalssTest();
    } else {
      console.log("Creating new prescription");
      await this.createEprescription().then((res: any) => {
        this.handleAddEyeGalssTest();
      });
    }
  }

  handleAddEyeGalssTest() {
    console.log("AYE GLASS DATA====>", this.eyeGlassForm.value);

    this.isSubmitted = true;
    if (this.eyeGlassForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      _id: this.eyeGlassForm.value._id,
      ePrescriptionId: this.ePrescriptionId,
      doctorId: this.doctorId,
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
    };

    console.log("AYE GLASS DATA====>", reqData);

    this.indiviualDoctorService
      .addEprescriptionEyeglassTest(reqData)
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

  async changeSelectedEyeglass(event: any, selectFor: string = "") {
    console.log(event);
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
    console.log(this.filterForm.value);
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
    console.log(name);

    let reqData = {
      eyeglassData: [
        {
          eyeglass_name: name,
        },
      ],
      added_by: {
        user_id: this.doctorId,
        user_type: "doctor",
      },
      is_new: true,
    };

    console.log("ReqData-->", reqData);

    this.sadminService.addEyeglassessApi(reqData).subscribe((res) => {
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
      recentItemsFor: "Eyeglass",
      doctorId: this.doctorId,
    };

    this.indiviualDoctorService
      .getRecentPrescribedMedicinesList(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RECENT PRESCRIBED EYEGLASS-->", response);

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
}
