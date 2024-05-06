import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";
import intlTelInput from "intl-tel-input";
import * as moment from "moment";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-add-hospital",
  templateUrl: "./add-hospital.component.html",
  styleUrls: ["./add-hospital.component.scss"],
})
export class AddHospitalComponent implements OnInit {
  iti: any;
  selectedCountryCode: any;
  selectedCountryCodeFromAPi: any;
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  healthCenterTypes: any[] = [];
  hospitalId: any = "";
  isEditing: boolean = false;
  overlay = false
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  selectedcountrycodedb: any;
  selectedHealthCentre: any;
  isSubmitted: boolean = false;
  locationData :any = {}
  constructor(
    private sadminService: SuperAdminService,
    private router: Router,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private loader : NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    let param = this.activatedRoute.snapshot.paramMap.get("id");
    if (param) {
      console.log(param);

      this.hospitalId = param;
      this.isEditing = true;
      this.getHospitalDetails();
      this.getRegionList("");
      this.getProvienceList("");
      this.getDepartmentList("");
      this.getCityList("");
    }

    this.getCountryList();
    this.getHealthCenterTypes();
  }

  public addHospitalForm: FormGroup = new FormGroup(
    {
      healthCenter: new FormControl("", [Validators.required]),
      hospitalId: new FormControl(""),
      hospital_name: new FormControl("", [Validators.required]),
      mobile_phone_number: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+?\d+$/),
      ]),
      email: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      loc: new FormControl(""),
      neighborhood: new FormControl(""),
      nationality: new FormControl("", [Validators.required]),
      region: new FormControl(""),
      province: new FormControl(""),
      department: new FormControl(""),
      city: new FormControl(""),
      village: new FormControl(""),
      // opening: new FormArray({}),
      sun_start_time: new FormControl("", [Validators.required]),
      sun_end_time: new FormControl("", [Validators.required]),
      mon_start_time: new FormControl("", [Validators.required]),
      mon_end_time: new FormControl("", [Validators.required]),
      tue_start_time: new FormControl("", [Validators.required]),
      tue_end_time: new FormControl("", [Validators.required]),
      wed_start_time: new FormControl("", [Validators.required]),
      wed_end_time: new FormControl("", [Validators.required]),
      thu_start_time: new FormControl("", [Validators.required]),
      thu_end_time: new FormControl("", [Validators.required]),
      fri_start_time: new FormControl("", [Validators.required]),
      fri_end_time: new FormControl("", [Validators.required]),
      sat_start_time: new FormControl("", [Validators.required]),
      sat_end_time: new FormControl("", [Validators.required]),
    },
    { validators: [] }
  );





  getHealthCenterTypes() {
    this.sadminService.getHealthCenterTypes().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status == true) {


          response?.result.map((curentval, index:any) => { 
              if(this.healthCenterTypes.indexOf({
                label:curentval?.name,
                value: curentval?._id,
              })== -1) {
                this.healthCenterTypes.push({
                  label:curentval?.name,
                  value: curentval?._id,
                });
              } 
            });

            this.addHospitalForm.patchValue({
              healthCenter: this.selectedHealthCentre
            })
        }
      
    });
  }

  getHospitalDetails() {
    let params = {
      hospitalId: this.hospitalId,
    };

    this.sadminService.getHospitalDetails(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      let data = response?.data[0];
      console.log(response, "IDDDddddd->", data)
      if (response.status) {
        this.locationData = {...data?.addressInfo}
        console.log(this.locationData , "ooooooooooooo");
        
        this.addHospitalForm.patchValue({
          hospitalId: data?._id,
          healthCenter: data?.type?._id,
          hospital_name: data?.hospital_name,
          mobile_phone_number: data?.mobile,
          email: data?.email,

          address: data?.addressInfo?.address,
          loc: data?.addressInfo?.loc,
          neighborhood: data?.addressInfo?.neighborhood,
          nationality: data?.addressInfo?.country,
          region: data?.addressInfo?.region,
          province: data?.addressInfo?.province,
          department: data?.addressInfo?.department,
          city: data?.addressInfo?.city,
          village: data?.addressInfo?.village,

          sun_start_time: data?.openingHour?.week_days[0]?.sun.start_time,
          sun_end_time: data?.openingHour?.week_days[0]?.sun.end_time,
          mon_start_time: data?.openingHour?.week_days[0]?.mon.start_time,
          mon_end_time: data?.openingHour?.week_days[0]?.mon.end_time,
          tue_start_time: data?.openingHour?.week_days[0]?.tue.start_time,
          tue_end_time: data?.openingHour?.week_days[0]?.tue.end_time,
          wed_start_time: data?.openingHour?.week_days[0]?.wed.start_time,
          wed_end_time: data?.openingHour?.week_days[0]?.wed.end_time,
          thu_start_time: data?.openingHour?.week_days[0]?.thu.start_time,
          thu_end_time: data?.openingHour?.week_days[0]?.thu.end_time,
          fri_start_time: data?.openingHour?.week_days[0]?.fri.start_time,
          fri_end_time: data?.openingHour?.week_days[0]?.fri.end_time,
          sat_start_time: data?.openingHour?.week_days[0]?.sat.start_time,
          sat_end_time: data?.openingHour?.week_days[0]?.sat.end_time,
        });
        this.selectedcountrycodedb = data?.country_code;
        console.log(this.selectedcountrycodedb, "check cuntry code", data?.country_code);
        this.selectedHealthCentre = data?.type?._id
        this.codecountry();
        console.log("Form-->", this.addHospitalForm.value)
      }
    });
  }

  codecountry() {
    var country_code = 'BF';
    console.log("PATCH DATA====>1", this.selectedcountrycodedb);
    const countryData = (window as any).intlTelInputGlobals.getCountryData();
    for (let i = 0; i < countryData.length; i++) {
      if (countryData[i].dialCode === this.selectedcountrycodedb.split("+")[1]) {
        country_code = countryData[i].iso2;
        break; // Break the loop when the country code is found
      }
    }

    const input = this.phone.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: country_code,
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
    console.log(this.selectedCountryCode, "selectedCountryCode");
  }


  ngAfterViewInit() {
    console.log(this.hospitalId, "this.hospitalId");

    if (this.hospitalId == "" || this.hospitalId == undefined) {
      console.log("else code ")
      const input = this.phone.nativeElement;
      this.iti = intlTelInput(input, {
        initialCountry: 'Bf',
        separateDialCode: true,
      });
      this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
    }

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
      this.address.nativeElement,
      options
    );
    this.autoComplete.addListener("place_changed", (record) => {
      const place = this.autoComplete.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];
      this.addHospitalForm.patchValue({
        address: place.formatted_address,
        loc: this.loc,
      });
    });
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
    console.log(this.selectedCountryCode, "vvvvv");
  };

  onSubmit() {
    // if (!this.addHospitalForm.valid) {
    //   console.log("invalid form")
    //   return;
    // }
    this.isSubmitted = true
    if (this.addHospitalForm.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, select.ng-invalid'

      );

      this.coreService.showError("","Please Fill Required Fields")
      // console.log("==========INVALID=========");
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      return;

    }
    this.isSubmitted = false
    let reqData = {
      hospitalId: this.addHospitalForm.value.hospitalId,
      healthCenter: this.addHospitalForm.value.healthCenter,
      email: this.addHospitalForm.value.email,
      hospital_name: this.addHospitalForm.value.hospital_name,
      mobile: this.addHospitalForm.value.mobile_phone_number,
      countryCode: this.selectedCountryCode,
      addressInfo: {
        loc: this.addHospitalForm.value.loc,
        address: this.addHospitalForm.value.address,
        neighborhood: this.addHospitalForm.value.neighborhood,
        country: this.addHospitalForm.value.nationality,
        region: this.addHospitalForm.value.region,
        province: this.addHospitalForm.value.province,
        department: this.addHospitalForm.value.department,
        city: this.addHospitalForm.value.city,
        village: this.addHospitalForm.value.village,
        pincode: "",
      },
      openingHour: [
        {
          sun: {
            start_time: this.returnFormattedTime(
              this.addHospitalForm.value.sun_start_time
            ),
            end_time: this.returnFormattedTime(
              this.addHospitalForm.value.sun_end_time
            ),
          },
          mon: {
            start_time: this.returnFormattedTime(
              this.addHospitalForm.value.mon_start_time
            ),
            end_time: this.returnFormattedTime(
              this.addHospitalForm.value.mon_end_time
            ),
          },
          tue: {
            start_time: moment(this.addHospitalForm.value.tue_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addHospitalForm.value.tue_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          wed: {
            start_time: moment(this.addHospitalForm.value.wed_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addHospitalForm.value.wed_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          thu: {
            start_time: moment(this.addHospitalForm.value.thu_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addHospitalForm.value.thu_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          fri: {
            start_time: moment(this.addHospitalForm.value.fri_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addHospitalForm.value.fri_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          sat: {
            start_time: moment(this.addHospitalForm.value.sat_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addHospitalForm.value.sat_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
        },
      ],
    };

    console.log("Req Data--->", reqData);

    if (this.isEditing) {
      this.loader.start();
      
      this.sadminService.editHospitalBySuperadmin(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("Update Response--->", response);
        if (response.status) {
          this.loader.stop();
          this.coreService.showSuccess("", response.message);
          this.router.navigate(["/super-admin/openhour/hospital"]);
        }
      });
    } else {
      this.loader.start();
      this.sadminService.addHospitalBySuperadmin(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("Response--->", response);
        if (response.status) {
          this.loader.stop();
          this.coreService.showSuccess("", response.message);
          this.router.navigate(["/super-admin/openhour/hospital"]);
        }
      });
    }
  }

  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];

  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.spokenLanguages = response.body?.spokenLanguage;
    });
  }

  getCountryList() {
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
        this.addHospitalForm.get("nationality").patchValue(this.locationData?.country)
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    this.regionList = []
    if(countryID == null)
    {
      return
    }
    console.log("getregion list checking");

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
        this.addHospitalForm.get("region").patchValue(this.locationData?.region)
        if(!this.addHospitalForm.get("region").value){
          this.addHospitalForm.get("department").patchValue("")
          this.addHospitalForm.get("city").patchValue("")
          this.addHospitalForm.get("village").patchValue("")
          this.addHospitalForm.get("province").patchValue("")
          }
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    if(!regionID)
    {
      return
    }
    this.provienceList = []
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
        this.addHospitalForm.get("province").patchValue(this.locationData?.province)
        if(!this.addHospitalForm.get("region").value){
          this.addHospitalForm.get("department").patchValue("")
          this.addHospitalForm.get("city").patchValue("")
          this.addHospitalForm.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(!provinceID)
    {
      return
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
        this.addHospitalForm.get("department").patchValue(this.locationData?.department)
        if(!this.addHospitalForm.get("department").value){
          this.addHospitalForm.get("city").patchValue("")
          this.addHospitalForm.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.cityList = []
    this.villageList = []
    if(!departmentID)
    {
      return
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
        this.addHospitalForm.get("city").patchValue(this.locationData?.city)
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
        this.addHospitalForm.get("village").patchValue(this.locationData?.village)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  returnFormattedTime(time: any) {
    return moment(time, ["h:mm A"]).format("HH:mm");
  }
  routeBack(){
    console.log("1212321");

    this.router.navigate([`/super-admin/openhour/hospital`])
  }
}
