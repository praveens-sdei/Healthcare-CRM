import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { FourPortalService } from "src/app/modules/four-portal/four-portal.service";
import { HospitalService } from "../../../hospital.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-location-paramedical',
  templateUrl: './location-paramedical.component.html',
  styleUrls: ['./location-paramedical.component.scss']
})
export class LocationParamedicalComponent implements OnInit {

  @Output() fromChild = new EventEmitter<string>();
  @Input() public mstepper: MatStepper;
  hospitalId: any = "";
  hospitalName: any = "";
  locationForm: any = FormGroup;
  isSubmitted: any = false;

  countryList: any[] = [];
  cityList: any[] = [];

  iti: any;
  selectedCountryCode: any;
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  @ViewChild("address") address!: ElementRef;

  pageForAdd: any = true;
  doctorId: any = "";
  locationDetails: any;

  stepper: any;

  constructor(
    private toastr: ToastrService,
    private service: FourPortalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private hospitalService: HospitalService,
    private loader: NgxUiLoaderService
  ) {
    this.locationForm = this.fb.group({
      location: this.fb.array([]),
    });

    let loginData = JSON.parse(localStorage.getItem("loginData"));   
    
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    if (loginData?.role === "HOSPITAL_STAFF"){
      this.hospitalId = loginData?.in_hospital;
    }else{
      this.hospitalId = loginData?._id;
    this.hospitalName = adminData?.hospital_name;

    }
  }

  ngOnInit(): void {
    this.stepper = this.mstepper;
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    if (paramId === null) {
      this.pageForAdd = true;
      this.addNewLocation();
      this.getHospitalLocation();
      this.stepper = this.mstepper;
      this.doctorId = sessionStorage.getItem("doctorId")
    } else {
      this.pageForAdd = false;
      this.doctorId = paramId;
      // this.getDoctorDetails();
      this.getDoctorDetails(this.mstepper);

      this.getHospitalLocation();
    }
    this.getCountryList();
    this.getCityList();
  }

  // For Edit Doctor
  // getDoctorDetails() {
  //   this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
  //     let response = this.coreService.decryptObjectData({ data: res });
  //     this.locationDetails =
  //       response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
  //     this.patchValues(this.locationDetails);
  //   });
  // }

  getDoctorDetails(fromParent: any) {

    let response = fromParent?.response;
    this.stepper = fromParent?.mainStepper;
    this.locationDetails =
      response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
    this.patchValues(this.locationDetails);
  }

  patchValues(data: any) {
    this.addNewLocation();
    if (data) {
      this.locationForm.patchValue({
        location: data,
      });
    } else {
      this.getHospitalLocation();
    }
  }

  saveLocation() {
    this.isSubmitted = true;
    if (this.locationForm.invalid) {
      console.log("==============INVALID===========");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      hospital_or_clinic_location: this.locationForm.value.location,
      portal_user_id: this.doctorId,
      type:'Paramedical-Professions'
    };

    // console.log("REQUEST DATA==========>", reqData);

    this.service.locationDetails(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE========>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          if (this.pageForAdd) {
            this.fromChild.emit("location");
          } else {
            this.stepper.next();
          }
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  getHospitalLocation() {
    this.hospitalService.getHospitalLocationById(this.hospitalId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      let obj = {
        hospital_id: this.hospitalId,
        hospital_name: this.hospitalName,
        // location: response?.data?.body?.address,
        // city: response?.data?.body?.cityName?.name,
        // country: response?.data?.body?.countryName?.name,
        location: response?.data?.resLocationData?.body?.address,
        city: response?.data?.resLocationData?.body?.cityName?.name,
        country: response?.data?.resLocationData?.body?.countryName?.name,
        // loc:response?.data?.loc
        loc: response?.data?.resLocationData?.loc,
        neighborhood: response?.data?.resLocationData?.body?.neighborhood,
        village: response?.data?.resLocationData?.body?.villageName?.name
      };

      this.locationForm.patchValue({
        location: [obj],
      });
    });
  }

  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.countryList = result.body?.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList() {
    this.sadminService.getCityListByDepartmentId("").subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.cityList = result.body.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //----------------form array handling---------------
  get location() {
    return this.locationForm.controls["location"] as FormArray;
  }

  addNewLocation() {
    const form = this.fb.group({
      hospital_id: [""],
      hospital_name: ["", [Validators.required]],
      location: ["", [Validators.required]],
      loc: [""],
      city: [""],
      country: ["", [Validators.required]],
      locationFor: "hospital",
    });

    this.location.push(form);
  }

  removeLoc(index: number) {
    this.location.removeAt(index);
  }

  get f() {
    return this.locationForm.controls;
  }

  previousPage() {
    console.log("back");
    this.stepper.previous();
  }

}
