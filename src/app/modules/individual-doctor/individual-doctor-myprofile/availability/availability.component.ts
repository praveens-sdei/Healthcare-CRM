import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { Component, Input, OnChanges, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { MatStepper } from "@angular/material/stepper";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { log } from "util";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-availability",
  templateUrl: "./availability.component.html",
  styleUrls: ["./availability.component.scss"],
})
export class AvailabilityComponent implements OnInit, OnChanges {
  @Input() public mstepper: MatStepper;

  timeInterval = [
    { label: '5 min', value: '5' },
    { label: '10 min', value: '10' },
    { label: '15 min', value: '15' },
    { label: '20 min', value: '20' },
    { label: '25 min', value: '25' },
    { label: '30 min', value: '30' },
    { label: '35 min', value: '35' },
    { label: '40 min', value: '40' },
    { label: '45 min', value: '45' },
    { label: '50 min', value: '50' },
    { label: '55 min', value: '55' },
    { label: '60 min', value: '60' },

  ]

  hospitalId: any = "";
  hospitalName: any = "";
  availabilityFormOnline: any = FormGroup;
  availabilityFormHomeVisit: any = FormGroup;
  availabilityFormClinic: any = FormGroup;
  isSubmitted: any = false;

  doctorRole: any = "";

  pageForAdd: any = true;
  availability: any;
  doctorId: any = "";
  seletectedLocation: any = "";
  selectedLocationId: any = "";
  menuSubscription: Subscription;
  getLoactionData: any;
  selectedLocation: any = '';
  onlineExitingIds: any = '';
  f2fExistingIds: any = '';
  homeVisitExistingIds: any = '';
  shouldContinue: boolean = true;
  constructor(
    private toastr: ToastrService,
    private service: HospitalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loader: NgxUiLoaderService
  ) {
    this.availabilityFormOnline = this.fb.group({
      weekDays: this.fb.array([]),
      availability: this.fb.array([]),
      unAvailability: this.fb.array([]),
      bookingSlot: ["", [Validators.required]],
    });

    this.availabilityFormHomeVisit = this.fb.group({
      weekDays: this.fb.array([]),
      availability: this.fb.array([]),
      unAvailability: this.fb.array([]),
      bookingSlot: ["", [Validators.required]],
    });

    this.availabilityFormClinic = this.fb.group({
      weekDays: this.fb.array([]),
      availability: this.fb.array([]),
      unAvailability: this.fb.array([]),
      bookingSlot: ["", [Validators.required]],
    });
    this.menuSubscription = this.coreService.SharingLocation.subscribe((res) => {

      if (res != 'default') {
        this.getLocations();
      }

    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorId = loginData?._id;
    this.doctorRole = loginData?.role;
    this.getDoctorDetails();

  }

  fromParent: any;

  ngOnChanges() {
    this.fromParent = this.mstepper;

    if (this.mstepper) {
      this.locationList = this.fromParent?.locationList;
      console.log("this.locationList------->>",this.locationList)
    }
  }

  //For Edit Doctor
  getDoctorDetails() {
    //console.log("avaliability call 2");

    this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.availability = response?.data?.availabilityArray;
      console.log("KANGARU AVAILABILITY===>", this.availability, response);

      this.getLocations();
      // this.patchValues(this.availability);
    });
  }



  saveAvailability(isNext: any = "") {
    this.isSubmitted = true;
    if (
      this.availabilityFormOnline.invalid ||
      this.availabilityFormHomeVisit.invalid ||
      this.availabilityFormClinic.invalid
    ) {
      window.scroll({
        top: 0,
      });   
      this.coreService.showError("","Please fill all required fields." )
      console.log("==========INVALID============", this.availabilityFormOnline.value);
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    //ONLINE
    if (this.locationList === undefined) {
      this.getLocations();
    }

    let weekArrayOnline: any = [];
    let weekArrayHomeVisit: any = [];
    let weekArrayClinic: any = [];

      this.availabilityFormOnline.value.weekDays.forEach((element) => {
      let obj = this.arrangeWeekDaysForRequest(element);
      if(this.shouldContinue){
        weekArrayOnline.push(obj);
      }else{
        return
      }

    });

    this.availabilityFormHomeVisit.value.weekDays.forEach((element) => {
      let obj = this.arrangeWeekDaysForRequest(element);
      if (this.shouldContinue) {
        weekArrayHomeVisit.push(obj);
      } else {
        return        
      }
    });

    this.availabilityFormClinic.value.weekDays.forEach((element) => {
      let obj = this.arrangeWeekDaysForRequest(element);
      if (this.shouldContinue) {
        weekArrayClinic.push(obj);
      } else {
        return;
      }
    });

    //------------una & avl------------------
    let avlOnline = [];
    let avlHomeVisit = [];
    let avlClinic = [];

    this.availabilityFormOnline.value.availability.forEach((element) => {
      let time = this.arranageUnavAndAvlForRequest({
        start_time: element.start_time,
        end_time: element.end_time,
      });

      avlOnline.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    this.availabilityFormHomeVisit.value.availability.forEach((element) => {
      let time = this.arranageUnavAndAvlForRequest({
        start_time: element.start_time,
        end_time: element.end_time,
      });

      avlHomeVisit.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    this.availabilityFormClinic.value.availability.forEach((element) => {
      let time = this.arranageUnavAndAvlForRequest({
        start_time: element.start_time,
        end_time: element.end_time,
      });

      avlClinic.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    //----------unAvl------------
    let unAvlOnline = [];
    let unAvlHomeVisit = [];
    let unAvlClinic = [];

    this.availabilityFormOnline.value.unAvailability.forEach((element) => {
      let time = this.arranageUnavAndAvlForRequest({
        start_time: element.start_time,
        end_time: element.end_time,
      });

      unAvlOnline.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    this.availabilityFormHomeVisit.value.unAvailability.forEach((element) => {
      let time = this.arranageUnavAndAvlForRequest({
        start_time: element.start_time,
        end_time: element.end_time,
      });

      unAvlHomeVisit.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    this.availabilityFormClinic.value.unAvailability.forEach((element) => {
      let time = this.arranageUnavAndAvlForRequest({
        start_time: element.start_time,
        end_time: element.end_time,
      });

      unAvlClinic.push({
        date: element.date,
        start_time: time.start_time,
        end_time: time.end_time,
      });
    });

    //---------------------------------------

    //-------------Online Type--------------------------
    let appointmenTypeOnline = {
      // location_id: this.locationList[0]?._id,
      location_id: this.selectedLocationId,
      appointment_type: "ONLINE",
      week_days: weekArrayOnline,
      availability_slot: avlOnline,
      unavailability_slot: unAvlOnline,
      slot_interval: this.availabilityFormOnline.value.bookingSlot,
      existingIds: this.onlineExitingIds
    };

    //----------------------Home Visit Type-------------------
    let appointmenTypeHomeVisit = {
      // location_id: this.locationList[0]?._id,
      location_id: this.selectedLocationId,
      appointment_type: "HOME_VISIT",
      week_days: weekArrayHomeVisit,
      availability_slot: avlHomeVisit,
      unavailability_slot: unAvlHomeVisit,
      slot_interval: this.availabilityFormHomeVisit.value.bookingSlot,
      existingIds: this.homeVisitExistingIds
    };

    //---------------------Clinic/Hospital Type-------------------------
    let appointmenTypeClinic = {
      // location_id: this.locationList[0]?._id,
      location_id: this.selectedLocationId,
      appointment_type: "FACE_TO_FACE",
      week_days: weekArrayClinic,
      availability_slot: avlClinic,
      unavailability_slot: unAvlClinic,
      slot_interval: this.availabilityFormClinic.value.bookingSlot,
      existingIds: this.f2fExistingIds
    };
    //------------------------------------------

    let doctorAvailabilityArray = [
      appointmenTypeOnline,
      appointmenTypeHomeVisit,
      appointmenTypeClinic,
    ];

    let reqData = {
      doctor_availability: doctorAvailabilityArray,
      portal_user_id: this.doctorId,
      location_id: this.selectedLocationId,
    };

    console.log("REQUEST DATA=======>", reqData);
    if (this.shouldContinue === true) {
      console.log(this.shouldContinue,"shouldContinue_____");
      
      this.service.doctorAvailability(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.loader.stop();
            this.toastr.success(response.message);
            // window.location.reload()
            // this.mstepper.next();
            this.getDoctorDetails();

            // if (this.doctorRole === "HOSPITAL_DOCTOR") {
            //   // this.mstepper.next();
            //   this.fromParent.mainStepper.next();
            // }

            if (isNext === 'yes') {
              this.next()
            }
          }
        },
        (err) => {

          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.loader.stop();
          this.toastr.error(errResponse.body._message);
        }
      );
    } else {
      this.toastr.error("Week Days Start time should not be greater than end time!")
      console.log("startDateGreater_________",this.shouldContinue);
      this.shouldContinue = true
    }

  }

  //--------------Form Array Handling------------------------
  //-------week days--------------1)
  weekDaysValidation(index) {
    let abc = this.availabilityFormOnline.get("weekDays") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get weekDaysOnline() {
    return this.availabilityFormOnline.controls["weekDays"] as FormArray;
  }

  get weekDaysHomeVisit() {
    return this.availabilityFormHomeVisit.controls["weekDays"] as FormArray;
  }

  get weekDaysClinic() {
    return this.availabilityFormClinic.controls["weekDays"] as FormArray;
  }

  /*  addNewWeek(add_for: any) {
      if (add_for === "all") {
        this.weekDaysOnline.push(this.form());
        this.weekDaysHomeVisit.push(this.form());
        this.weekDaysClinic.push(this.form());
      } else if (add_for === "online") {
        this.weekDaysOnline.push(this.form());
      } else if (add_for === "home_visit") {
        this.weekDaysHomeVisit.push(this.form());
      } else {
        this.weekDaysClinic.push(this.form());
      }
    } */

  form() {
    let defaultTime: any = ["10:00", "22:00"]

    return this.fb.group({
      sun_start_time: [defaultTime[0], [Validators.required]],
      sun_end_time: [defaultTime[1], [Validators.required]],
      mon_start_time: [defaultTime[0], [Validators.required]],
      mon_end_time: [defaultTime[1], [Validators.required]],
      tue_start_time: [defaultTime[0], [Validators.required]],
      tue_end_time: [defaultTime[1], [Validators.required]],
      wed_start_time: [defaultTime[0], [Validators.required]],
      wed_end_time: [defaultTime[1], [Validators.required]],
      thu_start_time: [defaultTime[0], [Validators.required]],
      thu_end_time: [defaultTime[1], [Validators.required]],
      fri_start_time: [defaultTime[0], [Validators.required]],
      fri_end_time: [defaultTime[1], [Validators.required]],
      sat_start_time: [defaultTime[0], [Validators.required]],
      sat_end_time: [defaultTime[1], [Validators.required]],
    });
  }

  addNewWeek(add_for: any) {
    if (add_for === "all") {
      this.weekDaysOnline.push(this.form());
      this.weekDaysHomeVisit.push(this.form());
      this.weekDaysClinic.push(this.form());
    } else if (add_for === "online") {
      this.weekDaysOnline.push(this.copyFormValues(this.weekDaysOnline.controls));
    } else if (add_for === "home_visit") {
      this.weekDaysHomeVisit.push(this.copyFormValues(this.weekDaysHomeVisit.controls));
    } else {
      this.weekDaysClinic.push(this.copyFormValues(this.weekDaysClinic.controls));
    }
  }

  copyFormValues(previousWeek: AbstractControl[]): FormGroup {
    const previousWeekForm = previousWeek[previousWeek.length - 1];

    // Check if previousWeekForm exists and is a FormGroup
    if (previousWeekForm instanceof FormGroup) {
      const newWeek = this.fb.group({});

      // Loop through the days and copy values
      for (const day of Object.keys(previousWeekForm.value)) {
        newWeek.addControl(day, new FormControl(previousWeekForm.get(day).value));
      }

      return newWeek;
    } else {
      // If previous week doesn't exist or is not a FormGroup, create a new form with default values
      return this.form();
    }
  }


  removeWeek(index: number, remove_for: any) {
    if (remove_for === "online") {
      this.weekDaysOnline.removeAt(index);
    } else if (remove_for === "home_visit") {
      this.weekDaysHomeVisit.removeAt(index);
    } else {
      this.weekDaysClinic.removeAt(index);
    }
  }
  //---------Availability--------------2)
  availabilityValidation(index) {
    let abc = this.availabilityFormOnline.get("availability") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get availabilityOnline() {
    return this.availabilityFormOnline.controls["availability"] as FormArray;
  }
  get availabilityHomeVisit() {
    return this.availabilityFormHomeVisit.controls["availability"] as FormArray;
  }
  get availabilityClinic() {
    return this.availabilityFormClinic.controls["availability"] as FormArray;
  }

  availForm() {
    return this.fb.group({
      date: [""],
      start_time: [""],
      end_time: [""],
    });
  }

  addNewAvailabilty(add_for: any) {
    if (add_for === "all") {
      this.availabilityOnline.push(this.availForm());
      this.availabilityHomeVisit.push(this.availForm());
      this.availabilityClinic.push(this.availForm());
    } else if (add_for === "online") {
      this.availabilityOnline.push(this.availForm());
    } else if (add_for === "home_visit") {
      this.availabilityHomeVisit.push(this.availForm());
    } else {
      this.availabilityClinic.push(this.availForm());
    }
  }

  removeAvailability(index: number, remove_for: string) {
    if (remove_for === "online") {
      this.availabilityOnline.removeAt(index);
    } else if (remove_for === "home_visit") {
      this.availabilityHomeVisit.removeAt(index);
    } else {
      this.availabilityClinic.removeAt(index);
    }
  }
  //---------Un--Availability--------------3)
  unavailabilityValidation(index) {
    let abc = this.availabilityFormOnline.get("unAvailability") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  get unAvailabilityOnline() {
    return this.availabilityFormOnline.controls["unAvailability"] as FormArray;
  }
  get unAvailabilityHomeVisit() {
    return this.availabilityFormHomeVisit.controls[
      "unAvailability"
    ] as FormArray;
  }
  get unAvailabilityClinic() {
    return this.availabilityFormClinic.controls["unAvailability"] as FormArray;
  }

  unAvailForm() {
    return this.fb.group({
      date: [""],
      start_time: [""],
      end_time: [""],
    });
  }

  addNewUnAvailabilty(add_for: string) {
    if (add_for === "all") {
      this.unAvailabilityOnline.push(this.unAvailForm());
      this.unAvailabilityHomeVisit.push(this.unAvailForm());
      this.unAvailabilityClinic.push(this.unAvailForm());
    } else if (add_for === "online") {
      this.unAvailabilityOnline.push(this.unAvailForm());
    } else if (add_for === "home_visit") {
      this.unAvailabilityHomeVisit.push(this.unAvailForm());
    } else {
      this.unAvailabilityClinic.push(this.unAvailForm());
    }
  }

  removeUnAvailability(index: number, remove_for: string) {
    if (remove_for === "online") {
      this.unAvailabilityOnline.removeAt(index);
    } else if (remove_for === "home_visit") {
      this.unAvailabilityHomeVisit.removeAt(index);
    } else {
      this.unAvailabilityClinic.removeAt(index);
    }
  }

  get f() {
    return this.availabilityFormOnline.controls;
  }

  get f2() {
    return this.availabilityFormHomeVisit.controls;
  }

  get f3() {
    return this.availabilityFormClinic.controls;
  }


  // myFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // };

  previousPage() {
    // this.mstepper.previous();
    this.fromParent.mainStepper.previous();
  }

  locationList: any = ([] = []);

  // getLocations() {
  //   console.log("this.doctorId===>", this.doctorId);

  //   this.service.getLocations(this.doctorId).subscribe((res) => {
  //     let response = this.coreService.decryptObjectData({ data: res });
  //     console.log("MATHING ID===>", response);

  //     if (response.data.length != 0) {
  //       this.locationList = response?.data[0]?.hospital_or_clinic_location;
  //       console.log("locationList===>",  response);
  //       if(this.locationList.length > 0){
  //         this.coreService.showError("Hospital Not Approved.",'')
  //       }
  //       this.seletectedLocation = this.locationList[0]?.hospital_name;
  //         this.selectedLocationId = this.locationList[0]?.hospital_id;
  //     }

  //     let patchArray = [];
  //     this.availability.forEach((element) => {
  //       console.log("MATHING ID ITERATION===>", element);
  //       if (element?.location_id === this.locationList[0]?.hospital_id) {
  //         patchArray.push(element);
  //       }
  //     });
  //     this.patchValuesAsPerLocation(patchArray);
  //   });
  // }

  getLocations() {
    console.log("this.doctorId===>", this.doctorId);
    this.doctorId = JSON.parse(localStorage.getItem("loginData"))?._id;
    this.service.getLocations(this.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("locationList===>", response);
      this.getLoactionData = response?.data
      if (response.data.length !== 0) {

        this.locationList = response.data[0].hospital_or_clinic_location;

        if (this.locationList.length !== undefined) {
          this.seletectedLocation = this.locationList[0]?.hospital_name;
          this.selectedLocation = this.locationList[0]?.hospital_name;
          this.selectedLocationId = this.locationList[0]?.hospital_id;
          let patchArray = [];
          this.availability.forEach((element) => {
            // console.log("MATHING ID ITERATION===>", element);
            if (element?.location_id === this.locationList[0]?.hospital_id) {
              patchArray.push(element);
            }
          });
          this.patchValuesAsPerLocation(patchArray);

          const elementsNotInAvailability = this.locationList.filter(location => {
            return !this.availability.some(available => available.location_id === location.hospital_id);
          });

          if (elementsNotInAvailability.length !== 0) {
            this.handleLocationChange(elementsNotInAvailability[0]);
          }
        }
      }

    });
  }


  handleLocationChange(location: any) {
    console.log(location, "location______");

    this.selectedLocationId = location?.hospital_id;
    this.seletectedLocation = location?.hospital_name;
    this.selectedLocation = location?.hospital_name;

    let patchArray = [];

    console.log("availability______", this.availability);

    this.availability.forEach((element) => {
      if (element?.location_id === location?.hospital_id) {
        patchArray.push(element);
      }
    });

    this.patchValuesAsPerLocation(patchArray);
  }

  patchValuesAsPerLocation(data: any) {
    console.log("PATCHING AVL===> called");
    console.log("PATCHING AVL===>", data);


    if (data.length === 0) {
    }
    let onlineMode: any = {};
    let homeVistMode: any = {};
    let clinicMode: any = {};

    this.onlineExitingIds = '';
    this.homeVisitExistingIds = '';
    this.f2fExistingIds = '';

    if (data.length != 0) {
      this.clearHnadler();

      data.forEach((element) => {
        if (element?.appointment_type === "ONLINE") {
          onlineMode = element;
          this.onlineExitingIds = element._id;
        }
        if (element?.appointment_type === "HOME_VISIT") {
          homeVistMode = element;
          this.homeVisitExistingIds = element._id;
        }
        if (element?.appointment_type === "FACE_TO_FACE") {
          clinicMode = element;
          this.f2fExistingIds = element._id;
        }
      });

      if (Object.keys(onlineMode).length != 0) {
        onlineMode?.week_days.forEach((element) => {
          this.addNewWeek("online");
        });
        onlineMode?.availability_slot.forEach((element) => {
          this.addNewAvailabilty("online");
        });
        onlineMode?.unavailability_slot.forEach((element) => {
          this.addNewUnAvailabilty("online");
        });

        let arrangedWeekDaysOnline = [];
        let arrangedAvlOnline = [];
        let arrangedUnAvlOnline = [];

        onlineMode.week_days.forEach((element) => {
          let obj = this.arrangeWeekDaysForPatch(element);
          arrangedWeekDaysOnline.push(obj);
        });

        onlineMode.availability_slot.forEach((element) => {
          let obj = this.arrangeUnavlAndAvlForPatch({
            start_time: element.start_time,
            end_time: element.end_time,
          });
          arrangedAvlOnline.push({
            date: element.date,
            start_time: obj.start_time,
            end_time: obj.end_time,
          });
        });

        onlineMode.unavailability_slot.forEach((element) => {
          let obj = this.arrangeUnavlAndAvlForPatch({
            start_time: element.start_time,
            end_time: element.end_time,
          });
          arrangedUnAvlOnline.push({
            date: element.date,
            start_time: obj.start_time,
            end_time: obj.end_time,
          });
        });

        this.availabilityFormOnline.patchValue({
          // weekDays: onlineMode?.week_days,
          weekDays: arrangedWeekDaysOnline,
          availability: arrangedAvlOnline,
          unAvailability: arrangedUnAvlOnline,
          bookingSlot: onlineMode?.slot_interval,
        });
      } else {
        this.addNewWeek("online");
        this.addNewAvailabilty("online");
        this.addNewUnAvailabilty("online");
      }

      //home_visit
      if (Object.keys(homeVistMode).length != 0) {
        homeVistMode?.week_days.forEach((element) => {
          this.addNewWeek("home_visit");
        });
        homeVistMode?.availability_slot.forEach((element) => {
          this.addNewAvailabilty("home_visit");
        });
        homeVistMode?.unavailability_slot.forEach((element) => {
          this.addNewUnAvailabilty("home_visit");
        });

        let arrangedWeekDaysHomeVisit = [];
        let arrangedAvlHomeVisit = [];
        let arrangedUnAvlHomeVisit = [];

        homeVistMode.week_days.forEach((element) => {
          let obj = this.arrangeWeekDaysForPatch(element);
          arrangedWeekDaysHomeVisit.push(obj);
        });

        homeVistMode.availability_slot.forEach((element) => {
          let obj = this.arrangeUnavlAndAvlForPatch({
            start_time: element.start_time,
            end_time: element.end_time,
          });
          arrangedAvlHomeVisit.push({
            date: element.date,
            start_time: obj.start_time,
            end_time: obj.end_time,
          });
        });

        homeVistMode.unavailability_slot.forEach((element) => {
          let obj = this.arrangeUnavlAndAvlForPatch({
            start_time: element.start_time,
            end_time: element.end_time,
          });
          arrangedUnAvlHomeVisit.push({
            date: element.date,
            start_time: obj.start_time,
            end_time: obj.end_time,
          });
        });

        this.availabilityFormHomeVisit.patchValue({
          // weekDays: homeVistMode?.week_days,
          weekDays: arrangedWeekDaysHomeVisit,
          availability: arrangedAvlHomeVisit,
          unAvailability: arrangedUnAvlHomeVisit,
          bookingSlot: homeVistMode?.slot_interval,
        });
      } else {
        this.addNewWeek("home_visit");
        this.addNewAvailabilty("home_visit");
        this.addNewUnAvailabilty("home_visit");
      }

      //clinic
      if (Object.keys(clinicMode).length != 0) {
        clinicMode?.week_days.forEach((element) => {
          this.addNewWeek("clinic");
        });
        clinicMode?.availability_slot.forEach((element) => {
          this.addNewAvailabilty("clinic");
        });
        clinicMode?.unavailability_slot.forEach((element) => {
          this.addNewUnAvailabilty("clinic");
        });

        let arrangedWeekDaysClinic = [];
        let arrangedAvlClinic = [];
        let arrangedUnAvlClinic = [];

        clinicMode.week_days.forEach((element) => {
          let obj = this.arrangeWeekDaysForPatch(element);
          arrangedWeekDaysClinic.push(obj);
        });

        clinicMode.availability_slot.forEach((element) => {
          let obj = this.arrangeUnavlAndAvlForPatch({
            start_time: element.start_time,
            end_time: element.end_time,
          });
          arrangedAvlClinic.push({
            date: element.date,
            start_time: obj.start_time,
            end_time: obj.end_time,
          });
        });

        clinicMode.unavailability_slot.forEach((element) => {
          let obj = this.arrangeUnavlAndAvlForPatch({
            start_time: element.start_time,
            end_time: element.end_time,
          });
          arrangedUnAvlClinic.push({
            date: element.date,
            start_time: obj.start_time,
            end_time: obj.end_time,
          });
        });

        this.availabilityFormClinic.patchValue({
          // weekDays: clinicMode?.week_days,
          weekDays: arrangedWeekDaysClinic,
          availability: arrangedAvlClinic,
          unAvailability: arrangedUnAvlClinic,
          bookingSlot: clinicMode?.slot_interval,
        });
      } else {
        this.addNewWeek("clinic");
        this.addNewAvailabilty("clinic");
        this.addNewUnAvailabilty("clinic");
      }
    } else {
      this.availabilityFormOnline.reset();
      this.availabilityFormHomeVisit.reset();
      this.availabilityFormClinic.reset();

      this.clearHnadler();

      this.addNewWeek("all");
      this.addNewAvailabilty("all");
      this.addNewUnAvailabilty("all");
    }
  }

  clearHnadler() {
    this.weekDaysOnline.clear();
    this.weekDaysHomeVisit.clear();
    this.weekDaysClinic.clear();

    this.availabilityOnline.clear();
    this.availabilityHomeVisit.clear();
    this.availabilityClinic.clear();

    this.unAvailabilityOnline.clear();
    this.unAvailabilityHomeVisit.clear();
    this.unAvailabilityClinic.clear();
  }

  next() {
    this.fromParent.mainStepper.next();
  }

  arrangeWeekDaysForPatch(element: any) {
    let wkD = {
      sun_start_time:
        element.sun_start_time.slice(0, 2) +
        ":" +
        element.sun_start_time.slice(2, 4),

      sun_end_time:
        element.sun_end_time.slice(0, 2) +
        ":" +
        element.sun_end_time.slice(2, 4),

      mon_start_time:
        element.mon_start_time.slice(0, 2) +
        ":" +
        element.mon_start_time.slice(2, 4),

      mon_end_time:
        element.mon_end_time.slice(0, 2) +
        ":" +
        element.mon_end_time.slice(2, 4),

      tue_start_time:
        element.tue_start_time.slice(0, 2) +
        ":" +
        element.tue_start_time.slice(2, 4),

      tue_end_time:
        element.tue_end_time.slice(0, 2) +
        ":" +
        element.tue_end_time.slice(2, 4),

      wed_start_time:
        element.wed_start_time.slice(0, 2) +
        ":" +
        element.wed_start_time.slice(2, 4),

      wed_end_time:
        element.wed_end_time.slice(0, 2) +
        ":" +
        element.wed_end_time.slice(2, 4),

      thu_start_time:
        element.thu_start_time.slice(0, 2) +
        ":" +
        element.thu_start_time.slice(2, 4),

      thu_end_time:
        element.thu_end_time.slice(0, 2) +
        ":" +
        element.thu_end_time.slice(2, 4),

      fri_start_time:
        element.fri_start_time.slice(0, 2) +
        ":" +
        element.fri_start_time.slice(2, 4),

      fri_end_time:
        element.fri_end_time.slice(0, 2) +
        ":" +
        element.fri_end_time.slice(2, 4),

      sat_start_time:
        element.sat_start_time.slice(0, 2) +
        ":" +
        element.sat_start_time.slice(2, 4),

      sat_end_time:
        element.sat_end_time.slice(0, 2) +
        ":" +
        element.sat_end_time.slice(2, 4),
    };

    return wkD;
  }

  arrangeWeekDaysForRequest(element: any) {

    let isValid = true;


    const sunStart = this.convertToMinutes(element.sun_start_time);
    const sunEnd = this.convertToMinutes(element.sun_end_time);

    // Check if start time is greater than end time
    if (sunStart > sunEnd) {
      isValid = false;
    }

    const monStart = this.convertToMinutes(element.mon_start_time);
    const monEnd = this.convertToMinutes(element.mon_end_time);

    if (monStart > monEnd) {
      isValid = false;
    }

    const tueStart = this.convertToMinutes(element.tue_start_time);
    const tueEnd = this.convertToMinutes(element.tue_end_time);

    if (tueStart > tueEnd) {
      isValid = false;
    }

    const wedStart = this.convertToMinutes(element.wed_start_time);
    const wedEnd = this.convertToMinutes(element.wed_end_time);

    if (wedStart > wedEnd) {
      isValid = false;
    }

    const thuStart = this.convertToMinutes(element.thu_start_time);
    const thuEnd = this.convertToMinutes(element.thu_end_time);

    if (thuStart > thuEnd) {
      isValid = false;
    }

    const friStart = this.convertToMinutes(element.fri_start_time);
    const friEnd = this.convertToMinutes(element.fri_end_time);

    if (friStart > friEnd) {
      isValid = false;
    }

    const satStart = this.convertToMinutes(element.sat_start_time);
    const satEnd = this.convertToMinutes(element.sat_end_time);

    if (satStart > satEnd) {
      isValid = false;
    }

    let obj = {
      sun_start_time: this.coreService.convertTwentyFourToTwelve(
        element.sun_start_time
      ),
      sun_end_time: this.coreService.convertTwentyFourToTwelve(
        element.sun_end_time
      ),
      mon_start_time: this.coreService.convertTwentyFourToTwelve(
        element.mon_start_time
      ),
      mon_end_time: this.coreService.convertTwentyFourToTwelve(
        element.mon_end_time
      ),
      tue_start_time: this.coreService.convertTwentyFourToTwelve(
        element.tue_start_time
      ),
      tue_end_time: this.coreService.convertTwentyFourToTwelve(
        element.tue_end_time
      ),
      wed_start_time: this.coreService.convertTwentyFourToTwelve(
        element.wed_start_time
      ),
      wed_end_time: this.coreService.convertTwentyFourToTwelve(
        element.wed_end_time
      ),
      thu_start_time: this.coreService.convertTwentyFourToTwelve(
        element.thu_start_time
      ),
      thu_end_time: this.coreService.convertTwentyFourToTwelve(
        element.thu_end_time
      ),
      fri_start_time: this.coreService.convertTwentyFourToTwelve(
        element.fri_start_time
      ),
      fri_end_time: this.coreService.convertTwentyFourToTwelve(
        element.fri_end_time
      ),
      sat_start_time: this.coreService.convertTwentyFourToTwelve(
        element.sat_start_time
      ),
      sat_end_time: this.coreService.convertTwentyFourToTwelve(
        element.sat_end_time
      ),
    };

    if (!isValid) {
      this.shouldContinue = false;
      console.log("Start time should not be greater than end time");
      return 0;
    } else {
      return obj;
    }
  }
  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  }

  arranageUnavAndAvlForRequest(element: any) {
    let start_time = this.coreService.convertTwentyFourToTwelve(
      element.start_time
    );
    let end_time = this.coreService.convertTwentyFourToTwelve(element.end_time);
    let obj = { start_time, end_time };
    return obj;
  }

  arrangeUnavlAndAvlForPatch(element: any) {
    let start_time =
      element.start_time.slice(0, 2) + ":" + element.start_time.slice(2, 4);
    let end_time =
      element.end_time.slice(0, 2) + ":" + element.end_time.slice(2, 4);
    let obj = { start_time, end_time };
    return obj;
  }

  ngOnDestroy(): void {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }
}
