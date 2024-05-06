import { SuperAdminService } from "./../../../super-admin/super-admin.service";
import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyPlanService } from "../../pharmacy-plan.service";
import { PharmacyService } from "../../pharmacy.service";
import Validation from "src/app/utility/validation";
import { ToastrService } from "ngx-toastr";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PharmacyStaffResponse } from "../../pharmacy-staffmanagement/addstaff/addstaff.component.type";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import intlTelInput from 'intl-tel-input';
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  @ViewChild("activateDeactivate") activateDeactivate: TemplateRef<any>;
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  profileIcon: any = '/assets/img/create_profile.png'
  country: any = "";
  region: any = "";
  province: any = "";
  department: any = "";
  city: any = "";
  village: any = "";
  @ViewChild('editstaffcontent') editstaffcontent: TemplateRef<any>;
  weekDaysForm: FormGroup;
  onDutyForm: FormGroup;
  editStaff: FormGroup;
  dataOne: any;
  onDuty: any;
  userId: any;
  profileDetails: any;
  profilePicture: any = "";
  locationData: any;
  loc: any = {};
  pharmacyPictures: any[] = [];
  changePasswordForm: any = FormGroup;
  isSubmitted: any = false;
  userRole: any;
  staffProfileUrl: any;
  selectedCountryCode: any = '+226';
  profileData: any;
  staffInfo: any;
  in_location: any;
  staff_ID: any;
  iti: any;
  license_Picture: any;
  countrycodedb: any;
  pharmacyAssociation: any;
  onDutyGroupNo: any;
  onDutyCity: any;
  associationGroupname: any;
  selectedLanguages: any = [];
  notificationData: any;
  notificationStatus: any = "want";
  constructor(
    private fb: FormBuilder,
    private coreService: CoreService,
    private pharService: PharmacyPlanService,
    private service: PharmacyService,
    private sadminService: SuperAdminService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private _pharmacyService: PharmacyService,

  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userRole = loginData?.role;
    this.userId = loginData?._id;



    this.getOnDutyDetails();
    this.getOpeningHoursDetails();
    this.weekDaysForm = this.fb.group({
      weekDays: this.fb.array([]),
      openDateTime: this.fb.array([]),
      closeDateTime: this.fb.array([]),
    });

    this.onDutyForm = this.fb.group({
      onDuty: this.fb.array([]),
    });

    this.changePasswordForm = this.fb.group(
      {
        old_password: ["", [Validators.required]],
        new_password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            Validation.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            Validation.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            Validation.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            Validation.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true,
              }
            ),
            Validators.minLength(8),
          ]),
        ],
        confirm_password: ["", [Validators.required]],
      },
      { validators: [Validation.match("new_password", "confirm_password")] }
    );

    this.editStaff = this.fb.group({
      staff_profile: [""],
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      language: [""],
      address: ["", [Validators.required]],
      neighbourhood: [""],
      country: ["", [Validators.required]],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      village: [""],
      pincode: [""],
      degree: [""],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required]],
      about: [""],
    })
  }

  ngOnInit(): void {


    // if (this.userRole === "PHARMACY_ADMIN" || this.userRole === "PHARMACY_STAFF" )
    //  {
    //   this.userId = loginData?._id;    
    //   console.log(" this.userRole", this.userRole);
    // } 
    if (this.userRole === "PHARMACY_ADMIN") {
      // console.log("admin");
      this.getProfileDetails(this.userId);
      // console.log(" this.userRole", this.userId);

    }
    else if (this.userRole === 'PHARMACY_STAFF') {
      console.log(" this.userRole", this.userId);
      this.getSpecificStaffDetails(this.userId);

    }

    this.addNewWeek();
    this.addNewOpenDate();
    this.addCloseOpenDate();
    this.addNewOnDuty();
  }

  autoComplete: google.maps.places.Autocomplete;
  getCountrycodeintlTelInput() {
    var country_code = '';
    console.log("PATCH DATA====>1", this.selectedCountryCode);
    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (countryData[i].dialCode === this.countrycodedb.split("+")[1]) {
        country_code = countryData[i].iso2;
        break; // Break the loop when the country code is found
      }
    }
    const input = document.getElementById('mobile') as HTMLInputElement;
    const adressinput = document.getElementById('address') as HTMLInputElement;
    if (input) {
      this.iti = intlTelInput(input, {
        initialCountry: country_code,
        separateDialCode: true,
      });
      this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
      const options = {
        fields: [
          "address_components",
          "geometry.location",
          "icon",
          "name",
          "formatted_address",
        ],
        strictBounds: false,
      };
      this.autoComplete = new google.maps.places.Autocomplete(
        adressinput,
        options
      );
      this.autoComplete.addListener("place_changed", (record) => {
        const place = this.autoComplete.getPlace();
        this.loc.type = "Point";
        this.loc.coordinates = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];
        this.editStaff.patchValue({
          address: place.formatted_address,
          loc: this.loc,
        });
      })
    }

  }

  handleChangePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let reqData = {
      id: this.userId,
      old_password: this.changePasswordForm.value.old_password,
      new_password: this.changePasswordForm.value.new_password,
    };

    console.log("Request Data====>", reqData);

    this.service.changePassword(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Password change response===>", response)
      if (response.status) {
        this.toastr.success(response.message)
        this.changePasswordForm.reset();
      } else {
        // this.toastr.error(response.message)
        this.toastr.error(response.message)
      }
    }, err => {
      let errResponse = this.coreService.decryptObjectData({ data: err.error });
      this.toastr.error(errResponse.message)
    })
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  //------------Profile Details----------
  getProfileDetails(id) {
    // console.log("id0000000000000000000000000000", this.userId);
    let reqdata = {
      userId: id
    }
    // console.log("id0000000000000000000000000000", reqdata);
    this.service.viewProfile(reqdata).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Profile Details----->", response);
      this.profileDetails = response?.data;
      this.profilePicture = response?.data?.adminData?.profile_picture_signed_url;
      this.locationData = response?.data?.locationData;
      // this.license_Picture = response?.data?.adminData?.licence_details?.licence_picture
      this.license_Picture = this.profileDetails?.licencePicSignedUrl;
      response?.data?.adminData?.pharmacy_picture_signed_urls.forEach((element) => {
        this.pharmacyPictures.push(element);
      });
      this.getAssociationdetails();
      this.getOnDutydata(this.profileDetails?.adminData?.duty_group)
      this.getCountryList(this.locationData?.nationality);
      this.getRegionList(this.locationData?.nationality, this.locationData?.region);
      this.getProvienceList(this.locationData?.region, this.locationData?.province);
      this.getDepartmentList(this.locationData?.province, this.locationData?.department);
      this.getCityList(this.locationData?.department, this.locationData?.city, this.locationData?.village);
    });
  }
  sethours(event: MatSlideToggleChange) {
    console.log("event" + event);
    var reqData = {
      "hoursset": event.checked,
      "for_portal_user": this.userId
    }
    this.service.sethours(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Profile created===>", response);
        if (response.status) {
          this.toastr.success(response.message);
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.messgae);
      }
    );
  }
  //Calling address api's

  getCountryList(country_id = '') {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const countryList = result.body?.list;
        countryList.map((country)=>{
          this.countryList.push(
            {
              label :country.name,
              value :country._id
            }
          )
        })
        // console.log(result, "element==>");

        result.body?.list.forEach((element) => {
          // console.log(element, "element==>");

          if (element?._id === country_id) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getRegionList(countryID: any, regionId = '') {
    this.regionList = []
    if (countryID === null) {
      return;
    }
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const regionList = result.body?.list;
        regionList.forEach(region => {
          const exists = this.regionList.findIndex(item => item.label === region?.name && item.value === region?._id) !== -1;
          if (!exists) {
            this.regionList.push({
              label: region?.name,
              value: region?._id,
            });
          }
        });
       
        this.editStaff.get("region").patchValue(this.in_location?.region)
        if(!this.editStaff.get("region").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          this.editStaff.get("province").patchValue("")
          }
        result.body?.list.forEach((element) => {
          if (element?._id === regionId) {
            this.region = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any, provinceId = '') {
    this.provienceList = []
    if (!regionID) {
      return;
    }
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const provienceList = result.body?.list;
        provienceList.forEach(province => {
          const exists = this.provienceList.findIndex(item => item.label === province?.name && item.value === province?._id) !== -1;
          if (!exists) {
            this.provienceList.push({
              label: province?.name,
              value: province?._id,
            });
          }
        });
        
        this.editStaff.get("province").patchValue(this.in_location?.province)
        result.body?.list.forEach((element) => {
          if (element?._id === provinceId) {
            this.province = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any, departmentId = '') {
    if (!provinceID) {
      return;
    }
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const departmentList = result.body?.list;
        departmentList.forEach(department => {
          const exists = this.departmentList.findIndex(item => item.label === department?.name && item.value === department?._id) !== -1;
          if (!exists) {
            this.departmentList.push({
              label: department?.name,
              value: department?._id,
            });
          }
        });   
        this.editStaff.get("department").patchValue(this.in_location?.department)
        result.body?.list.forEach((element) => {
          if (element?._id === departmentId) {
            this.department = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any, cityId = '', villageId = '') {
    this.cityList = [];
    this.villageList = []
    if (!departmentID) {
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const cityList = result.body.list;
        cityList.forEach(city => {
          const exists = this.cityList.findIndex(item => item.label === city?.name && item.value === city?._id) !== -1;
          if (!exists) {
            this.cityList.push({
              label: city?.name,
              value: city?._id,
            });
          }
        });
        this.editStaff.get("city").patchValue(this.in_location?.city)
        result.body?.list.forEach((element) => {
          if (element?._id === cityId) {
            this.city = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const villageList = result.body.list;
        villageList.forEach(village => {
          const exists = this.villageList.findIndex(item => item.label === village?.name && item.value === village?._id) !== -1;
          if (!exists) {
            this.villageList.push({
              label: village?.name,
              value: village?._id,
            });
          }
        });
        this.editStaff.get("village").patchValue(this.in_location?.village)
        result?.body?.list.forEach((element) => {
          if (element?._id === villageId) {            
            this.village = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  //---------------------------------------
  defaultValue: Date;
  public getOnDutyDetails() {
    let reqDutyData = {
      pharmacy_id: this.coreService.getLocalStorage("loginData")._id,
      getDetails: true,
    };
    this.pharService.saveOnDuty(reqDutyData).subscribe((res) => {
      let result = this.coreService.decryptContext(res);
      this.dataOne = result;
      let res_on_duty_arr = [];
      result?.data?.onDutyDetails?.on_duty.forEach((ele) => {
        let hnum = moment(ele.from_date_timestamp).format("HH");
        let Mnum = moment(ele.from_date_timestamp).format("mm");
        console.log("hoursnumber", Mnum);
        console.log("minutenumber", hnum);

        // const d = new Date();
        // d.setDate(1);
        // d.setMonth(2);
        // d.setHours(hnum);
        // d.setMinutes(Mnum);
        // d.setSeconds(1);
        // d.setMilliseconds(10);
        // this.defaultValue = d;

        // console.log(this.defaultValue);
        // console.log(moment(ele.from_date_timestamp).format('HH:mm'));
        // console.log(moment(ele.to_date_timestamp).format('HH:mm'));

        let cdT = {
          from_date: moment(ele.from_date_timestamp).format("YYYY-MM-DD"),
          from_date_tme: moment(ele.from_date_timestamp).format("hh:mm"),
          to_date: moment(ele.to_date_timestamp).format("YYYY-MM-DD"),
          to_date_tme: moment(ele.to_date_timestamp).format("hh:mm"),
        };

        res_on_duty_arr.push(cdT);
      });
      this.patchOnDutyInfo(res_on_duty_arr);
    });
  }

  public getOpeningHoursDetails() {
    let reqDutyData = {
      pharmacy_id: this.coreService.getLocalStorage("loginData")._id,
      getDetails: true,
    };
    this.pharService.saveOpeningHour(reqDutyData).subscribe((res) => {
      let result = this.coreService.decryptContext(res);
      // console.log("resultpradeep", result);
      let weekDays = [];
      let openDateArray = [];
      let closeDateArray = [];
      let wkD;
      let data = [];
      if (result.data.openingHoursDetails) {
        result.data.openingHoursDetails.week_days.map((el) => {
          wkD = {
            sun: {
              start_time:
                el.sun.start_time.slice(0, 2) +
                ":" +
                el.sun.start_time.slice(2, 4),
              end_time:
                el.sun.end_time.slice(0, 2) + ":" + el.sun.end_time.slice(2, 4),
            },
            mon: {
              start_time:
                el.mon.start_time.slice(0, 2) +
                ":" +
                el.mon.start_time.slice(2, 4),
              end_time:
                el.mon.end_time.slice(0, 2) + ":" + el.mon.end_time.slice(2, 4),
            },
            tue: {
              start_time:
                el.tue.start_time.slice(0, 2) +
                ":" +
                el.tue.start_time.slice(2, 4),
              end_time:
                el.tue.end_time.slice(0, 2) + ":" + el.tue.end_time.slice(2, 4),
            },
            wed: {
              start_time:
                el.wed.start_time.slice(0, 2) +
                ":" +
                el.wed.start_time.slice(2, 4),
              end_time:
                el.wed.end_time.slice(0, 2) + ":" + el.wed.end_time.slice(2, 4),
            },
            thu: {
              start_time:
                el.thu.start_time.slice(0, 2) +
                ":" +
                el.thu.start_time.slice(2, 4),
              end_time:
                el.thu.end_time.slice(0, 2) + ":" + el.thu.end_time.slice(2, 4),
            },
            fri: {
              start_time:
                el.fri.start_time.slice(0, 2) +
                ":" +
                el.fri.start_time.slice(2, 4),
              end_time:
                el.fri.end_time.slice(0, 2) + ":" + el.fri.end_time.slice(2, 4),
            },
            sat: {
              start_time:
                el.sat.start_time.slice(0, 2) +
                ":" +
                el.sat.start_time.slice(2, 4),
              end_time:
                el.sat.end_time.slice(0, 2) + ":" + el.sat.end_time.slice(2, 4),
            },
          };
          data.push(wkD);
        });

        let finalArray = [];

        data.forEach((ele) => {
          let obj = {
            sun_start_time: ele.sun.start_time,
            sun_end_time: ele.sun.end_time,
            mon_start_time: ele.mon.start_time,
            mon_end_time: ele.mon.end_time,
            tue_start_time: ele.tue.start_time,
            tue_end_time: ele.tue.end_time,
            wed_start_time: ele.wed.start_time,
            wed_end_time: ele.wed.end_time,
            thu_start_time: ele.thu.start_time,
            thu_end_time: ele.thu.end_time,
            fri_start_time: ele.fri.start_time,
            fri_end_time: ele.fri.end_time,
            sat_start_time: ele.sat.start_time,
            sat_end_time: ele.sat.end_time,
          };
          console.log(obj, "obj");
          finalArray.push(obj);
        });

        result.data.openingHoursDetails.open_date_and_time.map((ele) => {
          let openDateObj = {
            open_any_date: moment(ele.start_time_with_date).format(
              "YYYY-MM-DD"
            ),
            open_start_tme: moment(ele.start_time_with_date).format("hh:mm"),
            open_end_time: moment(ele.end_time_with_date).format("hh:mm"),
          };
          openDateArray.push(openDateObj);
        });
        result.data.openingHoursDetails.close_date_and_time.map((elem) => {
          let closeDateObj = {
            close_any_date: moment(elem.start_time_with_date).format(
              "YYYY-MM-DD"
            ),
            close_start_tme: moment(elem.start_time_with_date).format("hh:mm"),
            close_end_time: moment(elem.end_time_with_date).format("hh:mm"),
          };

          closeDateArray.push(closeDateObj);
        });

        this.weekDays(finalArray);
        this.patchClosingHours(closeDateArray);
        this.patchOpeningHours(openDateArray);
      }
    });
  }
  weekDays(data: any) {
    for (let i = 0; i < data.length - 1; i++) {
      this.addNewWeek();
    }
    this.weekDaysForm.patchValue({
      weekDays: data,
    });
  }
  patchOpeningHours(data1: any) {
    for (let i = 0; i < data1.length - 1; i++) {
      this.addNewOpenDate();
    }

    this.weekDaysForm.patchValue({
      openDateTime: data1,
    });
  }

  patchClosingHours(data2: any) {
    for (let i = 0; i < data2.length - 1; i++) {
      this.addCloseOpenDate();
    }
    this.weekDaysForm.patchValue({
      closeDateTime: data2,
    });
  }

  patchOnDutyInfo(profile: any) {
    for (let i = 0; i < profile.length - 1; i++) {
      this.addNewOnDuty();
    }
    this.onDutyForm.patchValue({
      onDuty: profile,
    });
  }

  public newWeekForm(): FormGroup {
    return this.fb.group({
      sun_start_time: ["10:00", [Validators.required]],
      sun_end_time: ["22:00", [Validators.required]],
      mon_start_time: ["10:00", [Validators.required]],
      mon_end_time: ["22:00", [Validators.required]],
      tue_start_time: ["10:00", [Validators.required]],
      tue_end_time: ["22:00", [Validators.required]],
      wed_start_time: ["10:00", [Validators.required]],
      wed_end_time: ["22:00", [Validators.required]],
      thu_start_time: ["10:00", [Validators.required]],
      thu_end_time: ["22:00", [Validators.required]],
      fri_start_time: ["10:00", [Validators.required]],
      fri_end_time: ["22:00", [Validators.required]],
      sat_start_time: ["10:00", [Validators.required]],
      sat_end_time: ["22:00", [Validators.required]],
    });
  }

  public newOpenDateForm(): FormGroup {
    return this.fb.group({
      open_any_date: ["", [Validators.required]],
      open_start_tme: ["", [Validators.required]],
      open_end_time: ["", [Validators.required]],
    });
  }

  public newCloseDateForm(): FormGroup {
    return this.fb.group({
      close_any_date: ["", [Validators.required]],
      close_start_tme: ["", [Validators.required]],
      close_end_time: ["", [Validators.required]],
    });
  }

  get weekForms(): FormArray {
    return this.weekDaysForm.get("weekDays") as FormArray;
  }

  get openDateForms(): FormArray {
    return this.weekDaysForm.get("openDateTime") as FormArray;
  }

  get closeDateForms(): FormArray {
    return this.weekDaysForm.get("closeDateTime") as FormArray;
  }

  addNewWeek() {
    this.weekForms.push(this.newWeekForm());
  }
  removeWeek(i: number) {
    // console.log("formindex", i);
    this.weekForms.removeAt(i);
  }

  addNewOpenDate() {
    this.openDateForms.push(this.newOpenDateForm());
  }
  removeOpendate(j: number) {
    this.openDateForms.removeAt(j);
  }

  addCloseOpenDate() {
    this.closeDateForms.push(this.newCloseDateForm());
  }
  removeClosedate(j: number) {
    this.closeDateForms.removeAt(j);
  }

  saveOpeningHours(formVal: any) {

    let isValid = true;

    console.log("enter functuoin");

    // console.log(formVal);

    // if (this.weekDaysForm.invalid) {
    //   console.log("enter asdasdd")
    //   return;
    // }

    let week_days = [];
    let open_date_and_time = [];
    let close_date_and_time = [];
    formVal.weekDays.forEach((el) => {
      console.log(
        this.coreService.convertTwentyFourToTwelve(el.sun_start_time),
        "weekDays"
      );



      const sunStart = this.convertToMinutes(el.sun_start_time);
      const sunEnd = this.convertToMinutes(el.sun_end_time);

      // Check if start time is greater than end time
      if (sunStart > sunEnd) {
        isValid = false;
      }

      const monStart = this.convertToMinutes(el.mon_start_time);
      const monEnd = this.convertToMinutes(el.mon_end_time);

      if (monStart > monEnd) {
        isValid = false;
      }

      const tueStart = this.convertToMinutes(el.tue_start_time);
      const tueEnd = this.convertToMinutes(el.tue_end_time);

      if (tueStart > tueEnd) {
        isValid = false;
      }

      const wedStart = this.convertToMinutes(el.wed_start_time);
      const wedEnd = this.convertToMinutes(el.wed_end_time);

      if (wedStart > wedEnd) {
        isValid = false;
      }

      const thuStart = this.convertToMinutes(el.thu_start_time);
      const thuEnd = this.convertToMinutes(el.thu_end_time);

      if (thuStart > thuEnd) {
        isValid = false;
      }

      const friStart = this.convertToMinutes(el.fri_start_time);
      const friEnd = this.convertToMinutes(el.fri_end_time);

      if (friStart > friEnd) {
        isValid = false;
      }

      const satStart = this.convertToMinutes(el.sat_start_time);
      const satEnd = this.convertToMinutes(el.sat_end_time);

      if (satStart > satEnd) {
        isValid = false;
      }

      let wkD = {
        sun: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.sun_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.sun_end_time),
        },
        mon: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.mon_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.mon_end_time),
        },
        tue: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.tue_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.tue_end_time),
        },
        wed: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.wed_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.wed_end_time),
        },
        thu: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.thu_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.thu_end_time),
        },
        fri: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.fri_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.fri_end_time),
        },
        sat: {
          start_time: this.coreService.convertTwentyFourToTwelve(
            el.sat_start_time
          ),
          end_time: this.coreService.convertTwentyFourToTwelve(el.sat_end_time),
        },
      };

      week_days.push(wkD);
      console.log(week_days, "Week Days");
    });

    if (!isValid) {
      this.toastr.error("Days Start time should not be greater than end time!")
      console.log("Start time should not be greater than end time");
      return;
    }

    formVal.openDateTime.forEach((el) => {
      if (moment(el.open_any_date).format("YYYY-MM-DD") !== "Invalid date") {
        let odT = {
          date: moment(el.open_any_date).format("YYYY-MM-DD"),
          start_time: el.open_start_tme,
          end_time: el.open_end_time,
        };

        open_date_and_time.push(odT);
      }

    });

    formVal.closeDateTime.forEach((el) => {
      console.log(el);
      if (moment(el.close_any_date).format("YYYY-MM-DD") !== "Invalid date") {
        let cdT = {
          date: moment(el.close_any_date).format("YYYY-MM-DD"),
          start_time: el.close_start_tme,
          end_time: el.close_end_time,
        };
        close_date_and_time.push(cdT);
      }
    });

    let reqData = {
      pharmacy_id: this.coreService.getLocalStorage("loginData")._id,
      getDetails: false,
      week_days: week_days,
      open_date_and_time: open_date_and_time,
      close_date_and_time: close_date_and_time,
    };

    console.log("REQ DATA=====>", reqData)

    this.pharService.saveOpeningHour(reqData).subscribe(
      (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log(result, "resultresultresult");
        if (result.status) {
          this.coreService.showSuccess(result.message, "");
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      (err: ErrorEvent) => {
        console.log(err.message);
      }
    );
    // let reqData = {

    // }
    // console.log(moment(this.weekDaysForm.value.weekDays[0].sun_start_time,"YYYY-mm-dd"));
    // console.log(moment(this.weekDaysForm.value.weekDays[0].sun_start_time).format("Hm"));
    // console.log(moment(this.weekDaysForm.value.weekDays[0].sun_start_time).format("YYYY-MM-DD"));
  }

  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  }

  public newOnDutyForm(): FormGroup {
    return this.fb.group({
      from_date: ["", [Validators.required]],
      from_date_tme: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      to_date_tme: ["", [Validators.required]],
    });
  }

  get DutyForms(): FormArray {
    return this.onDutyForm.get("onDuty") as FormArray;
  }

  addNewOnDuty() {
    this.DutyForms.push(this.newOnDutyForm());
  }
  removeOnDuty(i: number) {
    // console.log("formindex", i);
    this.DutyForms.removeAt(i);
  }

  saveOnDuty(dutyFormVal: any) {
    console.log(dutyFormVal, "dutyFormVal");

    if (this.onDutyForm.invalid) {
      return;
    }

    let on_duty_arr = [];
    let allDateRangesValid = true; // Flag to track overall date range validity

    dutyFormVal.onDuty.forEach((el) => {
      const fromDate = moment(el.from_date);
      const toDate = moment(el.to_date);
      const fromTime = moment(el.from_date_tme, 'HH:mm');
      const toTime = moment(el.to_date_tme, 'HH:mm');
      console.log(fromTime, "date log", toTime);



      if (fromDate.isBefore(toDate) ||
        (fromDate.isSame(toDate) && fromTime.isBefore(toTime))) {
        let cdT = {
          from_date: fromDate.format("YYYY-MM-DD"),
          from_time: el.from_date_tme,
          to_date: toDate.format("YYYY-MM-DD"),
          to_time: el.to_date_tme,
        };

        on_duty_arr.push(cdT);
      } else {
        allDateRangesValid = false; // Mark the flag as false if any range is invalid
        // this.toastr.error("Invalid date and time range!")

        console.log('Invalid date and time range:', el);
      }
    });

    if (!allDateRangesValid) {
      this.toastr.error("Check From date And Time Need To Be greater Than To Date And Time!")
      console.log('At least one date range is invalid. Aborting save.');
      return;
    }

    let reqDutyData = {
      pharmacy_id: this.coreService.getLocalStorage("loginData")._id,
      getDetails: false,
      on_duty: on_duty_arr,
    };
    console.log(reqDutyData, "reqDutyDataaaa");

    this.pharService.saveOnDuty(reqDutyData).subscribe(
      (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log(result);
        if (result.status) {
          console.log(result);
          this.coreService.showSuccess(result.message, "");
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      (err: ErrorEvent) => {
        console.log(err.message);
      }
    );
  }




  /* --------staffDetailsbyid------- */
  getSpecificStaffDetails(id) {
    console.log("staff", id);

    // throw new Error('Method not implemented.');
    try {
      // let userId = this.userId
      this.service.getStaffDetails(id).subscribe((result: any) => {
        // this.countryCode()
        const staffDetails = this.coreService.decryptObjectData(result);

        if (staffDetails.status == true) {
          console.log("staffDetailsstaffDetailsstaffDetails", staffDetails)
        }
        console.log("staffDetailsstaffDetailsstaffDetails", staffDetails)
        this.profileData = staffDetails?.data?.profileData[0]
        this.staffInfo = staffDetails?.data?.staffInfo[0]
        console.log("staffDetailsstaffDetailsstaffDetails__", this.staffInfo.language)
        this.selectedLanguages = this.staffInfo.language;
        this.in_location = staffDetails?.data?.staffInfo[0]?.in_location
        let details = staffDetails.data.staffInfo[0];
        const documentInfo = staffDetails?.data?.documentURL
        console.log("documentInfo", documentInfo)
        this.staffProfileUrl = documentInfo
        let address = details.in_location;
        let dateString = this.convertDate(details.dob)
        this.getCountryList(address?.nationality);
        this.getRegionList(address?.nationality, address?.region);
        this.getProvienceList(address?.region, address?.province);
        this.getDepartmentList(address?.province, address?.department);
        this.getCityList(address?.department, address?.city, address?.village);
        this.getSpokenLanguage();
        this.editStaff.controls["first_name"].setValue(details?.first_name);
        this.editStaff.controls["middle_name"].setValue(details.middle_name);
        this.editStaff.controls["last_name"].setValue(details?.last_name);
        this.editStaff.controls["dob"].setValue(dateString);
        this.editStaff.controls["language"].setValue(details?.language
        );
        this.editStaff.controls["address"].setValue(details?.in_location?.address);
        this.editStaff.controls["neighbourhood"].setValue(details?.in_location?.neighborhood);
        this.editStaff.controls["country"].setValue(address?.nationality);
        this.editStaff.controls["region"].setValue(address?.region);
        this.editStaff.controls["province"].setValue(address?.province);
        this.editStaff.controls["department"].setValue(address?.department);
        this.editStaff.controls["city"].setValue(address?.city);
        this.editStaff.controls["village"].setValue(address?.village);
        this.editStaff.controls["pincode"].setValue(details?.in_location?.pincode);
        this.editStaff.controls["degree"].setValue(details.degree);
        this.editStaff.controls["phone"].setValue(staffDetails?.data?.profileData[0]?.phone_number);
        this.editStaff.controls["email"].setValue(staffDetails?.data?.profileData[0]?.email);
        this.editStaff.controls["about"].setValue(details?.about);
        this.countrycodedb = staffDetails?.data?.profileData[0]?.country_code;
        console.log("this.countrycodedb", this.countrycodedb);
        this.getCountrycodeintlTelInput();
      })
    } catch (e) {
      throw e
    }
  }
  convertDate(date) {
    let dateString: any = new Date(date);
    let dd = String(dateString.getDate()).padStart(2, "0");
    let mm = String(dateString.getMonth() + 1).padStart(2, "0");
    let yyyy = dateString.getFullYear();
    dateString = yyyy + "-" + mm + "-" + dd;

    return dateString
  }
  handleEditProfile() {
    if (this.userRole == "PHARMACY_ADMIN") {
      this.router.navigate(['/pharmacy/profile/edit'])

    } else if (this.userRole == "PHARMACY_STAFF") {
      let loginData = JSON.parse(localStorage.getItem("loginData"));
      this.staff_ID = loginData?._id
      this.openVerticallyCenterededitstaff(this.editstaffcontent, this.staff_ID);
    }

  }
  openVerticallyCenterededitstaff(editstaffcontent: any, id: any) {
    console.log(id, "---->");

    this.getSpecificStaffDetails(id);
    this.modalService.open(editstaffcontent, {
      centered: true,
      size: "xl",
      windowClass: "edit_staffnew",
    });
  }
  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.editStaff.patchValue({
        staff_profile: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileIcon = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public onSubmit() {
    this.isSubmitted = true;
    if (this.editStaff.invalid) {
      console.log("invalid")
      return;
    }
    const values = this.editStaff.value
    console.log(values, "checking values");
    const formaData = new FormData();
    formaData.append("staff_profile", values.staff_profile)
    formaData.append("staff_name", values.first_name + " " + values.middle_name + " " + values.last_name)
    formaData.append("first_name", values.first_name)
    formaData.append("middle_name", values.middle_name)
    formaData.append("last_name", values.last_name)
    formaData.append("dob", values.dob)
    formaData.append("language", JSON.stringify(this.selectedLanguages))
    formaData.append("address", values.address)
    formaData.append("neighbourhood", values.neighbourhood)
    formaData.append("country", values.country ? values.country : "")
    formaData.append("region", values.region ? values.region : '')
    formaData.append("province", values.province ? values.province : '')
    formaData.append("department", values.department ? values.department : '')
    formaData.append("city", values.city ? values.city : '')
    formaData.append("village", values.village ? values.village : '')
    formaData.append("pincode", values.pincode)
    formaData.append("degree", values.degree)
    formaData.append("phone", values.phone)
    formaData.append("email", values.email)
    formaData.append("about", values.about)
    formaData.append("staff", values.staff)
    formaData.append("id", this.staff_ID)
    formaData.append("country_code", this.selectedCountryCode)

    this._pharmacyService.editStaff(formaData).subscribe({
      next: (result: IEncryptedResponse<PharmacyStaffResponse>) => {
        let decryptedResult = this.coreService.decryptObjectData(result);
        this.coreService.showSuccess("", "Staff updated successfully");
        this.getSpecificStaffDetails(this.staff_ID);
        this.handleClose()

      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');

        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }
  public handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.editStaff.reset()
    this.staff_ID = '';
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
  spokenLanguages: any[] = []
  overlay:false;

  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // this.spokenLanguages = response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;
      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });  
      this.editStaff.patchValue({
        language: this.selectedLanguages
     });
    });
  }
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  }

  // countryCode() {
  //   const input = this.countryPhone.nativeElement;
  //   this.iti = intlTelInput(input, {
  //     initialCountry: "fr",
  //     separateDialCode: true
  //   });
  //   this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
  // }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  removeSelectpic() {
    this.staffProfileUrl = ''
  }

  getAssociationdetails() {
    this._pharmacyService.pharmacyAssociationApi(this.userId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.pharmacyAssociation = response?.body;
      if (this.pharmacyAssociation?.association?.enabled) {
        this.associationGroupname = response?.body?.association?.name.map(nameItem => nameItem).join(', ');
        console.log("this.associationGroupname", this.associationGroupname)
      } else {
        this.associationGroupname = " "
      }
    });
  }

  getOnDutydata(data) {
    const param = {
      onDutyGroupId: data?.id_number,
    };
    this._pharmacyService.getOnDutyGroup(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptContext(res);
        // console.log(result, "getGroupDetails");
        if (this.profileDetails?.adminData?.duty_group?.enabled) {
          this.onDutyGroupNo = result?.data?.onDutyGroupNumber
          this.onDutyCity = result?.data?.city_name
        } else {
          this.onDutyGroupNo = " "
          this.onDutyCity = " "
        }
      },
    });
  }
  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
    console.log(this.selectedLanguages, "selectedLanguages_____");

  }

  handleToggleChangeForActive(notificationData: any, event: any) {
    this.notificationData = {
      id: notificationData?._id,
      notification: event,
    };
    if (event === false) {
      this.notificationStatus = "don't want";
    } else {
      this.notificationStatus = "want";
    }
    this.modalService.open(this.activateDeactivate);
  }

  updateNotificationStatus() {
    this.service.updateNotification(this.notificationData).subscribe((res: any) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("Closed");
      }
    });
  }
}
