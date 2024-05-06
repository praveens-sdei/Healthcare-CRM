import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { FourPortalService } from "src/app/modules/four-portal/four-portal.service";
import { Subscription } from "rxjs";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-feemanagement-fourportal',
  templateUrl: './feemanagement-fourportal.component.html',
  styleUrls: ['./feemanagement-fourportal.component.scss']
})
export class FeemanagementFourportalComponent implements OnInit {

  @Output() fromChild = new EventEmitter<string>();
  @Input() public mstepper: MatStepper;
  feeManagement!: FormGroup;
  isSubmitted: any = false;

  pageForAdd: any = true;
  doctorId: any = ""
  feeDetails: any;

  stepper: any;
  selectedLocationName: any;
  getLoactionData: any;
  userType: any;
  menuSubscription: Subscription;

  seletectedLocation: any = "";
  selectedLocationId: any = "";
  feeDetailsData: any;

  constructor(
    private fb: FormBuilder,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private fourportal: FourPortalService,
    private loader: NgxUiLoaderService
  ) {
    this.feeManagement = this.fb.group({
      online: ["ONLINE", [Validators.required]],
      online_fee: ["", [Validators.required]],
      online_pre_payment: [false],
      online_post_payment: [false],
      online_noofhours: [""],
      online_noofmin: [""],
      online_noofdays: [""],
      online_comments: [""],
      homeVisit: ["HOME VISIT", [Validators.required]],
      travel_fee: ["", [Validators.required]],
      homeVisit_fee: ["", [Validators.required]],
      homevisit_pre_payment: [false],
      homevisit_post_payment: [false],
      homevisit_noofmin: [""],
      homevisit_noofhours: [""],
      homevisit_noofdays: [""],
      homevisit_comments: [""],
      f2f: ["F2F", [Validators.required]],
      f2f_fee: ["", [Validators.required]],
      f2f_pre_payment: [false],
      f2f_post_payment: [false],
      f2f_noofmin: [""],
      f2f_noofhours: [""],
      f2f_noofdays: [""],
      f2f_comments: [""]
    });
    this.menuSubscription = this._coreService.SharingLocation.subscribe((res) => {
      console.log("res===>",res);
        if (res != 'default') {
          this.getLocations('');
        }
      });

  }

  ngOnInit(): void {
    // let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userType = loginData?.type;
    this.doctorId = loginData?._id;
    this.getDoctorDetails(this.mstepper);
    console.log("paramId>>>>>", this.doctorId)
    if (this.doctorId === null) {
      this.pageForAdd = true;
      this.stepper = this.mstepper;

    } else {
      this.pageForAdd = false;
      this.doctorId = this.doctorId;
      // this.getDoctorDetails();
      this.getDoctorDetails(this.mstepper);
    }
  }
  fromParent: any;

  ngOnChanges() {
    this.fromParent = this.mstepper;

    if (this.mstepper) {
      console.log("this.mstepper>>>>>",this.mstepper)
      this.locationList = this.fromParent?.locationList;
      console.log("this.locationList------->>",this.locationList)
    }
  }

  //For Edit Doctor
  getDoctorDetails(fromParent: any) {
    console.log("fromParent==>", fromParent);

    let response = fromParent?.response;
    this.stepper = fromParent?.mainStepper;

    this.feeDetails = response?.data?.feeMAnagementArray;
    this.feeDetailsData = response?.data;

    console.log(this.feeDetails, 'feeDetails___');
    console.log(this.feeDetailsData, 'feeDetailsData');

    this.getLocations(this.feeDetails);

  }

  locationList: any = ([] = []);
  buttonHandler(isNext: any = "") {
    this.isSubmitted = true;
    if (this.feeManagement.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid'
      );
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this._coreService.showError("", "Please fill all required fields.")
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      online: {
        basic_fee: this.feeManagement.value.online_fee,
        post_payment: this.feeManagement.value.online_post_payment ? this.feeManagement.value.online_post_payment : false,
        pre_payment: this.feeManagement.value.online_pre_payment ? this.feeManagement.value.online_pre_payment : false,
        cancelPolicy: {
          noofHours: this.feeManagement.value.online_noofhours,
          noofmin: this.feeManagement.value.online_noofmin,
          noofDays: this.feeManagement.value.online_noofdays,
          comments: this.feeManagement.value.online_comments
        }
      },
      home_visit: {
        basic_fee: this.feeManagement.value.homeVisit_fee,
        travel_fee: this.feeManagement.value.travel_fee,
        post_payment: this.feeManagement.value.homevisit_post_payment ? this.feeManagement.value.homevisit_post_payment : false,
        pre_payment: this.feeManagement.value.homevisit_pre_payment ? this.feeManagement.value.homevisit_pre_payment : false,
        cancelPolicy: {
          noofHours: this.feeManagement.value.homevisit_noofhours,
          noofmin: this.feeManagement.value.homevisit_noofmin,
          noofDays: this.feeManagement.value.homevisit_noofdays,
          comments: this.feeManagement.value.homevisit_comments
        }
      },
      f2f: {
        basic_fee: this.feeManagement.value.f2f_fee,
        post_payment: this.feeManagement.value.f2f_post_payment ? this.feeManagement.value.f2f_post_payment : false,
        pre_payment: this.feeManagement.value.f2f_pre_payment ? this.feeManagement.value.f2f_pre_payment : false,
        cancelPolicy: {
          noofHours: this.feeManagement.value.f2f_noofhours,
          noofmin: this.feeManagement.value.f2f_noofmin,
          noofDays: this.feeManagement.value.f2f_noofdays,
          comments: this.feeManagement.value.f2f_comments
        }
      },
      portal_user_id: this.doctorId,
      location_id: this.selectedLocationId,
      type: this.userType
    };

    console.log("REQUEST DATA=======>", reqData);

    this.fourportal.feeManagement(reqData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("RESPONSE========>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          if (this.pageForAdd) {
            this.fromChild.emit('fee')
          } else {
            this.stepper.next();
          }
        }
      },
      (err) => {
        this.loader.stop();
        let errResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }


  getLocations(data: any) {
    let reqdata = {
      portal_user_id: this.doctorId,
      type: this.userType
    }

    this.fourportal.getLocations(reqdata).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("locationList===>", response);
      this.getLoactionData = response?.data
      console.log(" this.locationList", this.locationList);

      if (response.data.length != 0) {
        this.locationList = response?.data[0]?.hospital_or_clinic_location;
        this.selectedLocationName = this.locationList[0]?.hospital_name;
        this.selectedLocationId = this.locationList[0]?.hospital_id;
        this.patchValues(data);
      }

    });
  }

  findValue(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null; // Return null if value is not found
  }

  patchValues(data: any) {
    console.log("data---->", data);

    data = this.findValue(data, 'location_id', this.selectedLocationId);
    console.log("data", data, this.selectedLocationId);

    this.feeManagement.patchValue({
      online_fee: data?.online?.basic_fee,

      online_pre_payment: data?.online?.pre_payment,
      online_post_payment: data?.online?.post_payment,
      online_noofhours: data?.online?.cancelPolicy?.noofHours,
      online_noofmin: data?.online?.cancelPolicy?.noofmin,
      online_noofdays: data?.online?.cancelPolicy?.noofDays,
      online_comments: data?.online?.cancelPolicy?.comments,

      travel_fee: data?.home_visit?.travel_fee,
      homeVisit_fee: data?.home_visit?.basic_fee,

      homevisit_pre_payment: data?.home_visit?.pre_payment,
      homevisit_post_payment: data?.home_visit?.post_payment,
      homevisit_noofhours: data?.home_visit?.cancelPolicy?.noofHours,
      homevisit_noofmin: data?.home_visit?.cancelPolicy?.noofmin,
      homevisit_noofdays: data?.home_visit?.cancelPolicy?.noofDays,
      homevisit_comments: data?.home_visit?.cancelPolicy?.comments,

      f2f_fee: data?.f2f?.basic_fee,


      f2f_pre_payment: data?.f2f?.pre_payment,
      f2f_post_payment: data?.f2f?.post_payment,
      f2f_noofhours: data?.f2f?.cancelPolicy?.noofHours,
      f2f_noofmin: data?.f2f?.cancelPolicy?.noofmin,
      f2f_noofdays: data?.f2f?.cancelPolicy?.noofDays,
      f2f_comments: data?.f2f?.cancelPolicy?.comments
    });
  }


  handleLocationChange(location: any) {
    this.selectedLocationId = location?.hospital_id;
    console.log(" this.selectedLocationId ", this.selectedLocationId);

    this.seletectedLocation = location?.hospital_name;

    this.patchValues(this.feeDetails);
  }



  get f() {
    return this.feeManagement.controls;
  }

  previousPage() {
    this.stepper.previous();
  }
  ngOnDestroy(): void {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }

}
