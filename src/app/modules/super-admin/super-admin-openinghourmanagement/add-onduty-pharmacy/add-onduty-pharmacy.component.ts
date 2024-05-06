import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";
import intlTelInput from "intl-tel-input";
import { Location } from "@angular/common";
export interface ILocationData {
  onDutypharmacyId: any;
}
@Component({
  selector: "app-add-onduty-pharmacy",
  templateUrl: "./add-onduty-pharmacy.component.html",
  styleUrls: ["./add-onduty-pharmacy.component.scss"],
})
export class AddOndutyPharmacyComponent implements OnInit {
  startDate: any = "";

  end_date: any = "";

  groupData: any;

  iti: any;
  selectedCountryCode: any;
  selectedCountryCodeFromAPi: any;
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  paramId: any;
  ondutyPharmacyId: any;
  minDateOfCreation = new Date();
  isSubmited :boolean = false;
  locationData :any = {};
  pageFor: any = 'Edit Pharmacy'
  selectedcountrycodedb: any = "";
  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private sadminService: SuperAdminService,
    private location: Location,
    private route: Router
  ) {
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");

    //this.getGroupDetails(this.paramId);
  }

  ngOnInit(): void {
    this.getCountryList();
    // this.openCountryCodeData();
    const locationInfo = this.location.getState() as ILocationData;

    console.log("LOCATION DATA I=====>", locationInfo?.onDutypharmacyId)
    if (locationInfo?.onDutypharmacyId === undefined) {
      this.pageFor = 'Add Pharmacy'

    }
    this.ondutyPharmacyId = locationInfo.onDutypharmacyId;

    if (this.ondutyPharmacyId != "" && this.ondutyPharmacyId != undefined) {
      this.getPerPharmacyDetails();
    }

  }

  public addPharForm: FormGroup = new FormGroup(
    {
      pharmacyId: new FormControl(""),
      pharmacy_name: new FormControl("", [Validators.required]),
      mobile_phone_number: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+?\d+$/),
      ]),
      email: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      loc: new FormControl(""),
      neighborhood: new FormControl("", [Validators.required]),
      nationality: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      province: new FormControl("", [Validators.required]),
      department: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      village: new FormControl("", [Validators.required]),
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
      close_any_date: new FormControl("", [Validators.required]),
      close_start_time: new FormControl("", [Validators.required]),
      close_end_time: new FormControl("", [Validators.required]),

      date_of_creation: new FormControl(new Date(), [Validators.required]),
    },
    { validators: [] }
  );

  // navigateBack() {
  //   this.route.navigate(['/addpharmacy/']);
  // }

  public onSubmit() {
    this.isSubmited = true;
    if (this.addPharForm.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, select.ng-invalid'

      );
      this.coreService.showError("","Please fill all the required fields!")     
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    
    }
    const reqData = {
      addressInfo: {
        loc: this.addPharForm.value.loc,
        address: this.addPharForm.value.address,
        neighborhood: this.addPharForm.value.neighborhood,
        nationality: this.addPharForm.value.nationality,
        region: this.addPharForm.value.region,
        province: this.addPharForm.value.province,
        department: this.addPharForm.value.department,
        city: this.addPharForm.value.city,
        village: this.addPharForm.value.village,
        pincode: "",
      },
      pharmacyName: this.addPharForm.value.pharmacy_name,
      countryCode: this.selectedCountryCode,
      phoneNumber: this.addPharForm.value.mobile_phone_number,
      email: this.addPharForm.value.email,
      openingHour: [
        {
          sun: {
            start_time: moment(this.addPharForm.value.sun_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.sun_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          mon: {
            start_time: moment(this.addPharForm.value.mon_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.mon_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          tue: {
            start_time: moment(this.addPharForm.value.tue_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.tue_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          wed: {
            start_time: moment(this.addPharForm.value.wed_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.wed_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          thu: {
            start_time: moment(this.addPharForm.value.thu_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.thu_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          fri: {
            start_time: moment(this.addPharForm.value.fri_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.fri_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
          sat: {
            start_time: moment(this.addPharForm.value.sat_start_time, [
              "h:mm A",
            ]).format("HH:mm"),
            end_time: moment(this.addPharForm.value.sat_end_time, [
              "h:mm A",
            ]).format("HH:mm"),
          },
        },
      ],
      nonOpeningDateAndTime: [
        {
          date: moment(this.addPharForm.value.close_any_date).format(
            "YYYY-MM-DD"
          ),
          start_time: moment(this.addPharForm.value.close_start_time, [
            "h:mm A",
          ]).format("HH:mm"),
          end_time: moment(this.addPharForm.value.close_end_time, [
            "h:mm A",
          ]).format("HH:mm"),
        },
      ],
      ondutyGroupId: this.paramId,
      date_of_creation: moment(this.addPharForm.value.date_of_creation).format(
        "YYYY-MM-DD"
      ),
    };

    console.log("REQ DATA PHARMACY GROUP====>", reqData);

    // return;

    if (this.addPharForm.value.pharmacyId) {
      reqData["pharmacyId"] = this.addPharForm.value.pharmacyId;

      this.superAdminService.editPharmacyInOnDuty(reqData).subscribe({
        next: async (res) => {
          let result = await this.coreService.decryptContext(res);
          console.log("result", result);
          if (result.status) {
            this.coreService.showSuccess(result.message, "");
            this.route.navigate([
              "super-admin/openhour/addpharmacy/",
              this.paramId,
            ]);
          } else {
            this.coreService.showError(result.message, "");
          }
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError(err.message, "");
        },
      });
    } else {
      this.superAdminService.addPharmacyInOnDuty(reqData).subscribe({
        next: async (res) => {
          let result = await this.coreService.decryptContext(res);
          console.log("result", result);
          if (result.status) {
            this.coreService.showSuccess(result.message, "");
            this.route.navigate([
              "super-admin/openhour/addpharmacy/",
              this.paramId,
            ]);
          } else {
            this.coreService.showError(result.message, "");
          }
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError(err.message, "");
        },
      });
    }

    console.log(reqData, "request format");
  }

  private getPerPharmacyDetails() {
    const param = {
      onDutyGroupId: this.paramId,
      pharmacyId: this.ondutyPharmacyId,
    };

    this.superAdminService.getOnDutyPhmarmacyDetails(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptContext(res);
        console.log("GET PHARMACY DETAILS===>", result);
        if (result.status) {
          const patchData = result.data.result[0];
          this.locationData = patchData?.locationinfos
          this.patchValues(patchData);
        } else {
          this.coreService.showError(result.message, "");
        }
      },
    });
  }

  patchValues(data: any) {
    console.log(data, "patchData");

    // let address = response.data[0].location_id;
    this.getRegionList(data.locationinfos.nationality);
    this.getProvienceList(data.locationinfos.region);
    this.getDepartmentList(data.locationinfos.province);
    // this.getCityList(data.locationinfos.department);




    this.addPharForm.patchValue({
      pharmacyId: data.for_portal_user,
      pharmacy_name: data.pharmacy_name,
      mobile_phone_number: data.portalusers.phone_number,
      email: data.portalusers.email,
      address: data.locationinfos.address,
      loc: data.locationinfos.loc,
      neighborhood: data.locationinfos.neighborhood,
      nationality: data.locationinfos.nationality,
      // region: data.locationinfos.region,
      // province: data.locationinfos.province,
      // department: data.locationinfos.department,
      // city: data.locationinfos.city,
      // village: data.locationinfos.village,

      // opening: new FormArray({}),
      sun_start_time: data.openinghoursinfos.week_days[0].sun.start_time,
      sun_end_time: data.openinghoursinfos.week_days[0].sun.end_time,
      mon_start_time: data.openinghoursinfos.week_days[0].mon.start_time,
      mon_end_time: data.openinghoursinfos.week_days[0].mon.end_time,
      tue_start_time: data.openinghoursinfos.week_days[0].tue.start_time,
      tue_end_time: data.openinghoursinfos.week_days[0].tue.end_time,
      wed_start_time: data.openinghoursinfos.week_days[0].wed.start_time,
      wed_end_time: data.openinghoursinfos.week_days[0].wed.end_time,
      thu_start_time: data.openinghoursinfos.week_days[0].thu.start_time,
      thu_end_time: data.openinghoursinfos.week_days[0].thu.end_time,
      fri_start_time: data.openinghoursinfos.week_days[0].fri.start_time,
      fri_end_time: data.openinghoursinfos.week_days[0].fri.end_time,
      sat_start_time: data.openinghoursinfos.week_days[0].sat.start_time,
      sat_end_time: data.openinghoursinfos.week_days[0].sat.end_time,

      close_any_date:
        data.openinghoursinfos.close_date_and_time[0].start_time_with_date,
      close_start_time: moment(
        data.openinghoursinfos.close_date_and_time[0].start_time_with_date,
        ["h:mm A"]
      ).format("HH:mm"),
      close_end_time: moment(
        data.openinghoursinfos.close_date_and_time[0].end_time_with_date,
        ["h:mm A"]
      ).format("HH:mm"),
      date_of_creation: data?.portalusers?.date_of_creation,
    });
    this.selectedcountrycodedb = data.portalusers.country_code;
    console.log(this.selectedcountrycodedb, "check cuntry code", data.portalusers.country_code);
    this.codecountry();
  }

  codecountry() {
    var country_code = 'BF';
    // this.selectedcountrycodedb = 
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
    console.log(this.ondutyPharmacyId, "this.ondutyPharmacyId");

    if (this.ondutyPharmacyId == "" || this.ondutyPharmacyId == undefined) {
      console.log("else code ")
      const input = this.phone.nativeElement;
      this.iti = intlTelInput(input, {
        initialCountry: 'BF',
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
      this.addPharForm.patchValue({
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

  public getGroupDetails(id: any) {
    const param = {
      onDutyGroupId: id,
    };
    this.superAdminService.getOnDutyGroupDetails(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptContext(res);

        console.log(result, "getGroupDetails");

        if (result.status) {
          // const momentSTime = moment(result.data.startTime, ["HH:mm"]).toDate();
          // const momentETime = moment(result.data.endTime, ["HH:mm"]).toDate();
          // this.groupData =  result.data
          // // this.onDutyGroupNumber = result.data.onDutyGroupNumber;
          // // this.city_name = result.data.city.name;
          // this.startDate = moment(result.data.startDate).format('MMMM Do YYYY');
          // // this.start_time = result.data.startTime;
          // this.end_date = moment(result.data.endDate).format('MMMM Do YYYY');
          // // this.end_time = result.data.endTime;
        } else {
          this.coreService.showError(result.message, "");
        }
      },
    });
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    this.regionList = []
    if(!countryID) return;
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
        
        this.addPharForm.get("region").patchValue(this.locationData?.region)
        if(!this.addPharForm.get("region").value){
          this.addPharForm.get("department").patchValue("")
          this.addPharForm.get("city").patchValue("")
          this.addPharForm.get("village").patchValue("")
          this.addPharForm.get("province").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    this.provienceList = []
    if(!regionID) return;
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
        this.addPharForm.get("province").patchValue(this.locationData?.province)
        if(!this.addPharForm.get("region").value){
          this.addPharForm.get("department").patchValue("")
          this.addPharForm.get("city").patchValue("")
          this.addPharForm.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(!provinceID) return;
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
        this.addPharForm.get("department").patchValue(this.locationData?.department)
        if(!this.addPharForm.get("region").value){
          this.addPharForm.get("city").patchValue("")
          this.addPharForm.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.villageList = [];
    this.cityList = [];
    if(!departmentID) return;
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
        if(this.locationData)
        {
          this.addPharForm.get("city").patchValue(this.locationData?.city)
        }
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
        if(this.locationData)
        {
          this.addPharForm.get("village").patchValue(this.locationData?.village)
        }

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Add Pharmacy modal
  openVerticallyCenteredaddpharmacy(addpharmacy: any) {
    // openCountryCodeData
    this.modalService.open(addpharmacy, {
      centered: true,
      size: "lg",
      windowClass: "add_pharmacy_content",
    });
    // this.openCountryCodeData();
  }

  // Edit Pharmacy modal
  openVerticallyCenterededitpharmacy(editpharmacy: any) {
    this.modalService.open(editpharmacy, {
      centered: true,
      size: "lg",
      windowClass: "add_pharmacy_content",
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
}
