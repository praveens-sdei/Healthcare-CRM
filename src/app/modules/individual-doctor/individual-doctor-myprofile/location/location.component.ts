import { HospitalService } from "src/app/modules/hospital/hospital.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  NgZone,
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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.scss"],
})
export class LocationComponent implements OnInit {
  @Input() public mstepper: MatStepper;
  @Output() locations = new EventEmitter<string>();
  locationForm: any = FormGroup;
  clinicLocationForm: any = FormGroup;
  isSubmitted: any = false;

  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];

  allRegionList: any[] = [];
  allProvienceList: any[] = [];
  allDepartmentList: any[] = [];
  allCityList: any[] = [];

  iti: any;
  selectedCountryCode: any;
  autoCompleteForAddress: google.maps.places.Autocomplete;
  loc: any = {};
  @ViewChild("locationAddress") locationAddress: ElementRef;

  // @ViewChild('address') address;

  pageForAdd: any = true;
  doctorId: any = "";
  locationDetails: any;

  hospitalList: any[] = [];
  allhospitallocationList:any[]=[];
  doctorRole: any = "";

  stepper: any;
  locationFor: any = "Hospital";
  // isHospital: boolean = true;
  // isClinic: boolean = true;
  overlay:false;
  selectedValue: any=[];
  constructor(
    private toastr: ToastrService,
    private service: HospitalService,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService
  ) {
    this.locationForm = this.fb.group({
      location: this.fb.array([]),
    });

    this.clinicLocationForm = this.fb.group({
      clinicLocation: this.fb.array([]),
    }); 
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorId = loginData?._id;
    this.doctorRole = loginData?.role;
    console.log("this.doctorRole>>>>>>>",this.doctorRole)
    this.getLocations();

    this.getCountryList();
    this.getRegionList("", "all");
    this.getProvienceList("", "all");
    this.getDepartmentList("", "all");
    this.getCityList("", "all");
    // this.getDoctorDetails(this.mstepper);

    this.getHospitalList();
    this.newObjectId();


  }



  newObjectId() {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const objectId =
      timestamp +
      "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => {
          return Math.floor(Math.random() * 16).toString(16);
        })
        .toLowerCase();

    return objectId;

    // console.log("GENRATED ID ====>",objectId)
  }

  ngAfterViewInit() {
    // this.handleSelectLocationFor('');
  //   const options = {
  //     fields: [
  //       "address_components",
  //       "geometry.location",
  //       "icon",
  //       "name",
  //       "formatted_address",
  //     ],
  //     strictBounds: false,
  //   };
  //   this.autoCompleteForAddress = new google.maps.places.Autocomplete(
  //     this.locationAddress.nativeElement.focus(),
  //     options
  //   );


  //   this.autoCompleteForAddress.addListener("place_changed", (record) => {
  //     const place = this.autoCompleteForAddress.getPlace();
  //     this.loc.type = "Point";
  //     this.loc.coordinates = [
  //       place.geometry.location.lng(),
  //       place.geometry.location.lat(),
  //     ];

  //     // this.address.nativeElement.focus();
  //     // this.basicInfo.patchValue({
  //     //   address: place.formatted_address,
  //     //   loc: this.loc,
  //     // });
  //   });
  }

  // For Edit Doctor

  getDoctorDetails(fromParent: any) {
    let response = fromParent?.response;
    console.log("getDoctorDetails----", response);

    this.stepper = fromParent?.mainStepper;
    // this.service.getDoctorProfileDetails(this.doctorId).subscribe((res) => {
    //   let response = this.coreService.decryptObjectData({ data: res });
    //   this.locationDetails =
    //     response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
    //   this.patchValues(this.locationDetails);
    // });

    this.locationDetails =
      response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
    console.log("getDoctorDetails----", this.locationDetails);


  }

  patchValues(data: any) {
    console.log("PATHCH VALUE DATA LOCATION===>", data);
    let hospitalLocations = [];
    let clinicLocation = [];

    if (data) {
      data.forEach((element) => {
        if (element.locationFor === "hospital") {
          hospitalLocations.push(element);
        } else if (element.locationFor === "clinic") {
          clinicLocation.push(element);
        } else {
          hospitalLocations.push(element);
        }
      });
    } 
    // else {
    //   this.addNewLocation();
    //   this.addNewClinicLocation();
    // }

    if (hospitalLocations.length != 0) {
      hospitalLocations.forEach((element,i) => {
        this.addNewLocation();
        this.selectedValue.push(i);
      });
          } else {
      this.addNewLocation();
    }

    if (clinicLocation.length != 0) {
      clinicLocation.forEach((element, index) => {
        this.addNewClinicLocation();
        this.regionList[index] = this.allRegionList;
        this.provienceList[index] = this.allProvienceList;
        this.departmentList[index] = this.allDepartmentList;
        this.cityList[index] = this.allCityList;
      });
    } else {
      this.addNewClinicLocation();
    }

    this.locationForm.patchValue({
      location: hospitalLocations,
    });

    this.clinicLocationForm.patchValue({
      clinicLocation: clinicLocation,
    });

    // hospitalLocations.forEach((element,index) => {
    //   this.handleSelectHospital(element?.hospital_id,index)
    // })
  }

  async saveLocation() {
    let locationsToBeSave = [];

    if (this.doctorRole === "INDIVIDUAL_DOCTOR") {
      this.isSubmitted = true;
      if (this.locationForm.invalid && this.clinicLocationForm.invalid) {      
        this.toastr.error("Form Invalid")
        console.log("==============INVALID===========");
        return;
      }
      this.isSubmitted = false;
      this.loader.start();
      if (this.locationForm.invalid) {
        locationsToBeSave = [...this.clinicLocationForm.value.clinicLocation];
      } else if (this.clinicLocationForm.invalid) {
        locationsToBeSave = [...this.locationForm.value.location];
      } else {
        locationsToBeSave = [
          ...this.locationForm.value.location,
          ...this.clinicLocationForm.value.clinicLocation,
        ];
      }
    } else {
      locationsToBeSave = [...this.locationForm.value.location];
    }

    await locationsToBeSave.forEach(async (element) => {
      if (element?.hospital_id == "") {
        element.hospital_id = await this.newObjectId();
      }
    });

    let reqData = {
      hospital_or_clinic_location: locationsToBeSave,
      portal_user_id: this.doctorId,
    };

    // console.log("REQUEST DATA==========>", reqData);

// return;

    this.service.locationDetails(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.getLocations();
          this.coreService.setLocationData(1);
          if (this.selectedLocationId == "") {
            this.stepper.next();

          }
        }
      },
      (err) => {
        this.loader.stop();
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  locationList: any;

  getLocations() {
    this.service.getLocations(this.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("LOCATIONS LIST===>", response);
      this.locationList = response?.data[0]?.hospital_or_clinic_location;
      this.locations.emit(response?.data[0]?.hospital_or_clinic_location);
    });
  }

  selectedLocationId: any = "";
  storedIndex: any = 0;
  deleteFor: any = "";

  async deleteLocationAndItsAvaliability() {
    let reqData = {
      portal_user_id: this.doctorId,
      location_id: this.selectedLocationId,
    };
    this.service
      .deleteAvailabiltiesOnDeletingLocation(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE===>", response);

        if (response.status) {
          if (this.deleteFor === "hospital") {
            this.removeLoc(this.storedIndex);
            this.coreService.showSuccess("", response.message)
          } else {
            this.removeClinicLoc(this.storedIndex);
          }
          this.modalService.dismissAll("close");
          await this.saveLocation();
          setTimeout(() => {
            this.selectedLocationId = "";
          }, 2000);
        }
      });
  }

  getHospitalList() {
    let reqData = {
      page: 1,
      limit: 0,
      status: "APPROVED",
    };
    this.service.getHospitalList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.hospitalList = response?.data?.data;

      this.hospitalList.map((curentval: any) => {
        this.allhospitallocationList.push({
          label: curentval?.hospital_name,
          value: curentval?.for_portal_user?._id,
        });
      });
      console.log(this.allhospitallocationList,"allhospitallocationList");
      this.patchValues(this.locationDetails);
    });
    
  }
  // selectedValue = []
 
  handleSelectHospital(event: any, index) {
   
    let hospital;
    // console.log("this.hospitalList", this.hospitalList, event, typeof index , 'd',index,"hjfg",this.selectedValue);
    if(event!=undefined){
   this.selectedValue.push(index)
    this.hospitalList.forEach((element) => {
      if (event === element?.for_portal_user?._id) {
        hospital = element;
      }
    });

    this.service.getHospitalLocationById(event).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        if (response.data === '') {
          this.toastr.error(" Hospital Not have locations. Please select another hospital")
          this.location.at(index).patchValue({
            hospital_name: "",    
          });
        }else{
          this.location.at(index).patchValue({
            // hospital_name: hospital?.hospital_name,
            hospital_name:response?.data?.hospitalData?.hospital_name,
            hospital_id:event,
            neighborhood: response?.data?.resLocationData?.body?.neighborhood,
            village: response?.data?.resLocationData?.body?.villageName?.name,
            location: response?.data?.resLocationData?.body?.address,
            city: response?.data?.resLocationData?.body?.cityName?.name,
            country: response?.data?.resLocationData?.body?.countryName?.name,
            loc: response?.data?.resLocationData?.loc,
          });
        }      
      }
    });
  }
  }

  //------------address component api's-------------
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

  getRegionList(countryID: any, index: any) {
    console.log("INDEX===>", index);
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // this.regionList[index] = result.body?.list;
        if (index === "all") {
          console.log("INDEX===>", result?.body?.list);
          this.allRegionList = result?.body?.list;
          this.regionList[0] = result.body?.list;
        } else {
          this.regionList[index] = result.body?.list;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any, index: any) {
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // this.provienceList[index] = result.body?.list;
        if (index === "all") {
          this.allProvienceList = result?.body?.list;
          this.provienceList[0] = result.body?.list;
        } else {
          this.provienceList[index] = result.body?.list;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any, index: any) {
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // this.departmentList[index] = result.body?.list;
        if (index === "all") {
          this.allDepartmentList = result?.body?.list;
          this.departmentList[0] = result.body?.list;
        } else {
          this.departmentList[index] = result.body?.list;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any, index: any) {
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        // this.cityList[index] = result.body.list;
        if (index === "all") {
          this.allCityList = result?.body?.list;
          this.cityList[0] = result.body?.list;
          this.getDoctorDetails(this.mstepper);
        } else {
          this.cityList[index] = result.body?.list;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //----------------form array handling for hospital location---------------
  get location() {
    return this.locationForm.controls["location"] as FormArray;
  }

  addNewLocation() {
   
    const form = this.fb.group({
      hospital_id: ["", [Validators.required]],
      hospital_name: ["" ,[Validators.required]],
      location: [""],
      loc: [""],
      city: [""],
      country: [""],
      village:[""],
      neighborhood:[""],
      locationFor: ["hospital"],
    });


    this.location.push(form);
  }

  removeLoc(index: number) {
    this.location.removeAt(index);
  }

  validation(index) {
    let abc = this.locationForm.get("location") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  //----------------form array handling for clinic location---------------
  get clinicLocation() {
    return this.clinicLocationForm.controls["clinicLocation"] as FormArray;
  }

  addNewClinicLocation() {
    const form = this.fb.group({
      hospital_id: [""],
      hospital_name: ["", [Validators.required]],
      location: ["", [Validators.required]],
      country: ["", [Validators.required]],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      loc: [""],
      locationFor: ["clinic"],
    });
    
    this.clinicLocation.push(form);

    setTimeout(() => {
      this.clinicLocationnew.controls.forEach((control, index) => {
        console.log("testttttttttttt",index);
        
        const adressinput = document.getElementById('address'+index) as HTMLInputElement;
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
  
        this.autoCompleteForAddress = new google.maps.places.Autocomplete(
          adressinput,
          options
        );
  
        this.autoCompleteForAddress.addListener("place_changed", () => {
          const place = this.autoCompleteForAddress.getPlace();
          // Handle the selected place as needed
          console.log("Selected Place:", place);
          // If you need to update the form control value with the selected place, you can do it here
          control.get('location').setValue(place.formatted_address);
          control.get('loc').setValue(this.loc);
          this.loc.type = "Point";
          this.loc.coordinates = [
            place.geometry.location.lng(),
            place.geometry.location.lat(),
          ];
        });
      });
     }, 100);
  }

  removeClinicLoc(index: number) {
    this.clinicLocation.removeAt(index);
  }

  validationClinic(index) {
    let abc = this.clinicLocationForm.get("clinicLocation") as FormArray;
    const formGroup = abc.controls[index] as FormGroup;
    return formGroup;
  }

  previousPage() {
    this.stepper.previous();
  }
  get clinicLocationnew() {
    return this.clinicLocationForm.get('clinicLocation') as FormArray;
  }
  handleSelectLocationFor(event: any) {
    console.log(event.value);
    this.locationFor = event.value;

    if (event.value == 'Clinic') {
      setTimeout(() => {
        this.clinicLocationnew.controls.forEach((control, index) => {
          console.log("testttttttttttt",index);
          
          const adressinput = document.getElementById('address'+index) as HTMLInputElement;
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
    
          this.autoCompleteForAddress = new google.maps.places.Autocomplete(
            adressinput,
            options
          );
    
          this.autoCompleteForAddress.addListener("place_changed", () => {
            const place = this.autoCompleteForAddress.getPlace();
            // Handle the selected place as needed
            console.log("Selected Place:", place);
            // If you need to update the form control value with the selected place, you can do it here
            control.get('location').setValue(place.formatted_address);
            control.get('loc').setValue(this.loc);
            this.loc.type = "Point";
            this.loc.coordinates = [
              place.geometry.location.lng(),
              place.geometry.location.lat(),
            ];
          });
        });
       }, 100);
      // const options = {
      //   fields: [
      //     "address_components",
      //     "geometry.location",
      //     "icon",
      //     "name",
      //     "formatted_address",
      //   ],
      //   strictBounds: false,
      // };
      // console.log("this.locationAddress", this.locationAddress);

      // this.autoCompleteForAddress = new google.maps.places.Autocomplete(

      //   this.locationAddress.nativeElement,
      //   options
      // );


      // this.autoCompleteForAddress.addListener("place_changed", (record) => {
      //   const place = this.autoCompleteForAddress.getPlace();
      //   this.loc.type = "Point";
      //   this.loc.coordinates = [
      //     place.geometry.location.lng(),
      //     place.geometry.location.lat(),
      //   ];
      // });

    }
  }


  //delete popup
  openVerticallyCenteredsecond(
    deletePopup: any,
    locationId: any,
    index,
    deleteFor
  ) {
    this.selectedLocationId = locationId;
    this.storedIndex = index;
    this.deleteFor = deleteFor;
    console.log(locationId, index);
    if (locationId == "") {
      if (deleteFor === "hospital") {
        this.removeLoc(index);
      } else {
        this.removeClinicLoc(index);
      }
      return;
    }
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }
}
