
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../../hospital.service';
import { IEncryptedResponse } from 'src/app/shared/classes/api-response';
import { SuperAdminStaffResponse } from 'src/app/modules/super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import intlTelInput from "intl-tel-input";
import * as moment from "moment";
import Validation from 'src/app/utility/validation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  @ViewChild("activateDeactivate") activateDeactivate: TemplateRef<any>;
  weekDaysForm: FormGroup;
  editStaff: any = FormGroup;
  profileFields: any;
  locationFields: any;
  bankDataFields: any;
  showAddressComponent: boolean;
  portalUserId: any;
  userId: any;
  userRole: any;
  staffID: any;
  portalDetails: any;
  userDetails: any;
  profileImage: any;
  @ViewChild('editstaffcontent') editstaffcontent: TemplateRef<any>;
  loc: any = {};
  iti: any;
  selectedCountryCode: any;
  autoComplete: google.maps.places.Autocomplete;
  healthCenterTypes: any;
  imagePreview: any;
  profile_picture: any = "";
  selectedCountryCodedb: any = '';
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  locationData: any;
  spokenLanguages: any[] = [];
  hospital_Picture: any[] = [];
  country: any = "";
  region: any = "";
  province: any = "";
  department: any = "";
  city: any = "";
  village: any = "";
  in_pathology_LabTest: any;
  in_pathology_medical_act: any;
  in_pathology_imaging: any;
  in_pathology_vaccination: any;
  in_pathology: any;
  in_pathology_other_test: any;
  alldetails: any;
  staffDetails: any;
  staff_ID: any;
  staff_profile: any;
  _in_profile_Data: any;
  staff_profile_file: any = "";
  countrycodedb: any = '';
  healthCenter: any;
  changePasswordForm: any = FormGroup;
  isSubmitted: any = false;
  associationList: any = [];
  hospitalDetails: any;
  associationGroupname: any;
  selectedLanguages: any = []
  pathologyTests: any = [];
  updatedPathologyTests: any = [];
  notificationData: any;
  notificationStatus: any = "want";
  overlay:false;

  hide = true;
  hide1 = true;
  hide2 = true;

  
  constructor(
    private coreService: CoreService,
    private _hospitalService: HospitalService,
    private _superAdminService: SuperAdminService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,

  ) {
    const loginData = this.coreService.getLocalStorage("loginData");
    this.userId = loginData?._id;
    this.userRole = loginData?.role;
    console.log("this.userId", this.userRole, this.userId);
    this.getOpeningHoursDetails();

    this.weekDaysForm = this.fb.group({
      weekDays: this.fb.array([]),
      openDateTime: this.fb.array([]),
      closeDateTime: this.fb.array([]),
    });

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
      mobile: ["", [Validators.required]],
      email: ["", [Validators.required]],
      about_staff: [""],
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

  }
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };

  getCountrycodeintlTelInput() {
    var country_code = '';
    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (countryData[i].dialCode === this.countrycodedb.split("+")[1]) {
        country_code = countryData[i].iso2;
        break; // Break the loop when the country code is found
      }
    }
    const input = document.getElementById('mobile') as HTMLInputElement;
    const adressinput = document.getElementById('address') as HTMLInputElement;
    console.log("check");
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
  ngOnInit(): void {

    if (this.userRole === "HOSPITAL_ADMIN") {
      console.log("this.userId", this.userRole);
      this.getProfile();
    }
    else {
      this.getSpecificStaffDetails(this.userId);

    }
    this.addNewWeek();
    this.addNewOpenDate();
    this.addCloseOpenDate();
    this.getAssociationdetails();
  }

  handleEditProfile() {
    if (this.userRole == "HOSPITAL_ADMIN") {
      this.router.navigate(['/hospital/profile/edit'])

    } else if (this.userRole == "HOSPITAL_STAFF") {
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


  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }
  handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    // this.staffID = "";
  }

  onGroupIconChange(event: any) {
    const formData: any = new FormData();
    formData.append("docName", event.target.files[0]);
    formData.append("userId", this.staffID);
    formData.append("docType", "Hospital-Pic");
    formData.append("multiple", "false");

    this.staff_profile_file = formData;
    //  this.uplodDocument();
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.staff_profile = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.uplodDocument();
  }

  keyURL: any = "";
  async uplodDocument() {
    this._hospitalService.uploadDoc(this.staff_profile_file).subscribe({
      next: async (res: any) => {
        let result = await this.coreService.decryptObjectData({ data: res });
        this.keyURL = result.data[0].key;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editStaffDetails() {
    // console.log("staffid", this.staffID);

    this.isSubmitted = true;
    if (this.editStaff.invalid) {
      this.toastr.error("Please filled required fields.")
      return;
    }
    this.isSubmitted = false;

    let fields = this.editStaff.value;
    let row = {
      staffId: this.staffID,
      first_name: fields.first_name,
      middle_name: fields.middle_name,
      last_name: fields.last_name,
      dob: fields.dob,
      language: this.selectedLanguages,
      addressInfo: {
        loc: {
          type: "Point",
          coordinates: [88.4, 26.8],
        },
        address: fields.address,
        neighborhood: fields.neighbourhood,
        country: fields.country,
        region: fields.region,
        province: fields.province,
        department: fields.department,
        city: fields.city,
        village: fields.village,
        pincode: fields.pincode,
      },
      role: fields.role,
      assignToDoctor: fields.assingDoctor,
      password: "",
      assignToStaff: [],
      aboutStaff: fields.about_staff,
      specialty: fields.specialty,
      services: fields.services,
      department: fields.staffDepartment,
      unit: fields.unit,
      expertise: fields.expertise,
      countryCode: this.selectedCountryCode,
      mobile: fields.mobile,
      profilePic: this.keyURL,

    };
    console.log("reqdata", row)
    this._hospitalService.editStaff(row).subscribe(
      (res: any) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("editresponse", response);
        if (response.status) {
          this.coreService.showSuccess("Staff updated", '');
          this.router.navigate(['/hospital/profile']);
          this.getSpecificStaffDetails(this.staffID);
          this.handleClose()
        } else {
          this.coreService.showError(" Staff update failed", '');
        }
      },
      (err) => {
        let response = this.coreService.decryptObjectData({ data: err.error });
        this.coreService.showError(response.message, '');
      }
    );
  }


  getProfile() {
    this._hospitalService.viewProfile(this.userId).subscribe({
      next: (result: any) => {
        let response = this.coreService.decryptObjectData({ data: result });

        this.pathologyTests = response.body.pathology_tests;

        const groupedTests = {};

        this.pathologyTests.forEach(test => {
          if (!groupedTests[test.typeOfTest]) {
            groupedTests[test.typeOfTest] = [];
          }
          groupedTests[test.typeOfTest].push(test.nameOfTest);
        });

        this.updatedPathologyTests = Object.keys(groupedTests).map(typeOfTest => {
          return {
            typeOfTest,
            nameOfTests: groupedTests[typeOfTest]
          };
        });
        console.log(this.pathologyTests, "updatedPathologyTests_____", this.updatedPathologyTests,);

        console.log("GET_PROFILE_DETAILSS____", response)


        this.userDetails = response.body.userDetails;
        this.portalDetails = response?.body?.portalDetails;
        this.profileImage = this.userDetails?.profile_picture;
        this.hospital_Picture = this.userDetails?.hospitalPictures
        this.locationData = this.userDetails?.in_location;
        this.healthCenter = response?.body?.type_of_health_center_Data?.body?.data?.healthcentre
        console.log("GET PROFILE DETAILS=====>", this.hospital_Picture)

        this.getCountryList(this.locationData?.country);
        this.getRegionList(this.locationData?.country, this.locationData?.region);
        this.getProvienceList(this.locationData?.region, this.locationData?.province);
        this.getDepartmentList(this.locationData?.province, this.locationData?.department);
        this.getCityList(this.locationData?.department, this.locationData?.city, this.locationData?.village);

        this.in_pathology_LabTest = this.userDetails?.in_pathology_test?.lab_test
        this.in_pathology_imaging = this.userDetails?.in_pathology_test?.imaging
        this.in_pathology_medical_act = this.userDetails?.in_pathology_test?.medical_act
        this.in_pathology_other_test = this.userDetails?.in_pathology_test?.other_test
        this.in_pathology_vaccination = this.userDetails?.in_pathology_test?.vaccination
        this.countrycodedb = this.portalDetails?.country_code

        console.log("country_code", this.countrycodedb);
        this.getCountrycodeintlTelInput();
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
      },
    });
  }
  getSpecificStaffDetails(id: any) {
    this.staffID = id;
    const params = {
      hospitalStaffId: id,
    };
    this._hospitalService.getStaffDetails(params).subscribe({
      next: (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const staffDetails = this.coreService.decryptObjectData({
          data: result,
        });

        let alldetails = JSON.parse(JSON.stringify(staffDetails.body));
        console.log("staffDetailsstaffDetailsssss", staffDetails.body);
        this.selectedLanguages = alldetails?.in_profile?.language;

        this._in_profile_Data = staffDetails?.body?.in_profile
        this.staffDetails = staffDetails?.body?.in_profile?.in_location
        this.getCountryList(this.staffDetails?.country);
        this.getRegionList(this.staffDetails?.country, this.staffDetails?.region);
        this.getProvienceList(this.staffDetails?.region, this.staffDetails?.province);
        this.getDepartmentList(this.staffDetails?.province, this.staffDetails?.department);
        this.getCityList(this.staffDetails?.department, this.staffDetails?.city, this.staffDetails?.village);
        this.getSpokenLanguage();
        this.editStaff.controls["first_name"].setValue(
          alldetails.in_profile.first_name
        ); this.editStaff.controls["middle_name"].setValue(
          alldetails.in_profile.middle_name
        );
        this.editStaff.controls["last_name"].setValue(
          alldetails.in_profile.last_name
        );
        this.editStaff.controls["language"].setValue(
          alldetails.in_profile.language
        );


        this.editStaff.controls["address"].setValue(
          alldetails.in_profile?.in_location?.address
        );

        this.editStaff.controls["neighbourhood"].setValue(
          alldetails.in_profile?.in_location?.neighborhood
        );
        this.editStaff.controls["country"].setValue(
          alldetails.in_profile?.in_location?.country
        );
        this.editStaff.controls["region"].setValue(
          alldetails.in_profile?.in_location?.region
        );

        this.editStaff.controls["province"].setValue(
          alldetails.in_profile?.in_location?.province
        );
        this.editStaff.controls["department"].setValue(
          alldetails.in_profile?.in_location?.department
        );
        this.editStaff.controls["city"].setValue(
          alldetails.in_profile?.in_location?.city
        );

        this.editStaff.controls["village"].setValue(
          alldetails.in_profile?.in_location?.village
        );
        this.editStaff.controls["pincode"].setValue(
          alldetails.in_profile?.in_location?.pincode
        );
        this.editStaff.controls["mobile"].setValue(
          alldetails.in_profile?.in_location?.for_portal_user.mobile
        );
        this.editStaff.controls["email"].setValue(
          alldetails.in_profile?.in_location?.for_portal_user.email
        );
        this.editStaff.controls["about_staff"].setValue(
          alldetails.in_profile?.about
        );
        this.editStaff.controls["dob"].setValue(alldetails.in_profile?.dob);

        this.staff_profile = alldetails.in_profile.profile_picture;

        console.log("staff_profile", this.staff_profile);
        this.countrycodedb = alldetails?.in_profile?.in_location
          ?.for_portal_user?.country_code

        console.log("country_code", this.countrycodedb);
        this.getCountrycodeintlTelInput();
      },
    });
  }

  getCountryList(country_id = '') {
    this._superAdminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.countryList = result?.body?.list;
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
    if (countryID === null) {
      return;
    }
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.regionList = result.body?.list;
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
    if (regionID === null) {
      return;
    }
    this._superAdminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.provienceList = result.body?.list;
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
    if (provinceID === null) {
      return;
    }
    this._superAdminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.departmentList = result.body?.list;
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
    if (departmentID === null) {
      return;
    }
    this._superAdminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.cityList = result.body.list;
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

    this._superAdminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.villageList = result.body.list;
        result.body?.list.forEach((element) => {
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

  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      // console.log("spokenlanguage", response);
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
      // console.log("spokenlanguage", this.spokenLanguages);
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
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  removeSelectpic() {
    this.staff_profile = ''
  }

  addNewWeek() {
    this.weekForms.push(this.newWeekForm());
  }
  removeWeek(i: number) {
    console.log("formindex", i);
    this.weekForms.removeAt(i);
  }


  public getOpeningHoursDetails() {
    let reqDutyData = {
      hospital_id: this.coreService.getLocalStorage("loginData")._id,
      getDetails: true,
    };
    this._hospitalService.saveOpeningHour(reqDutyData).subscribe((res) => {
      let result = this.coreService.decryptContext(res);
      console.log("resultpradeep", result);
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
      hospital_id: this.coreService.getLocalStorage("loginData")._id,
      getDetails: false,
      week_days: week_days,
      open_date_and_time: open_date_and_time,
      close_date_and_time: close_date_and_time,
    };

    console.log("REQ DATA=====>", reqData)

    this._hospitalService.saveOpeningHour(reqData).subscribe(
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

    this._hospitalService.changePassword(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Password change response===>", response);
        if (response.status) {
          this.coreService.showSuccess("", response.message);
          this.changePasswordForm.reset();
        } else {
          this.coreService.showError("", response.message);
          // this.toastr.error("Current Password is incorrect");
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.coreService.showError("", errResponse.message);
      }
    );
  }
  get f() {
    return this.changePasswordForm.controls;
  }
  getAssociationdetails() {
    this._hospitalService.hospitalDetailsApi(this.userId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("hospitaldetails", response);
      this.hospitalDetails = response?.body?.data;
      console.log("hospitaldetails", this.hospitalDetails?.association?.is_true);
      if (this.hospitalDetails?.association?.is_true) {
        this.associationGroupname = response?.body?.data?.association?.name.map(nameItem => nameItem).join(', ');
      } else {
        this.associationGroupname = " "
      }
    });
  }

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
    console.log(this.selectedLanguages, "selectedLanguages_____");

  }

  handleToggleChangeForActive(notificationData: any, event: any) {
    console.log(event,"notificationData--->>>>>",notificationData);
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
    console.log("notificationData DATA===>", this.notificationData);
    this._hospitalService.updateNotification(this.notificationData).subscribe((res: any) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(":response>>>>>>>>>>>",response)
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("Closed");
      }
    });
  }
}
