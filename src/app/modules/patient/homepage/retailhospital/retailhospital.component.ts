import { SuperAdminService } from "./../../../super-admin/super-admin.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { CoreService } from "src/app/shared/core.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { filter } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { PatientService } from "../../patient.service";
import { doctor } from "@igniteui/material-icons-extended";
import { log } from "console";

@Component({
  selector: "app-retailhospital",
  templateUrl: "./retailhospital.component.html",
  styleUrls: ["./retailhospital.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RetailhospitalComponent implements OnInit {
  locCoordinates: { lat: number; lng: number; };
  staticFirstOption: {
    description: string; // Description you want to display
    place_id: string; // Unique identifier for the static option
    matched_substrings: any[]; // Empty array for the required property
    reference: string; // Empty string for the required property
    structured_formatting: { main_text: string; main_text_matched_substrings: any[]; secondary_text: string; }; // Empty object for the required property
    terms: any[]; // Empty array for the required property
    types: any[]; // Empty array for the required property
  };
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value) + "CFS";
    }

    return `${value}`;
  }

  formatLabelDistance(value: number): string {
   // console.log(value, "check funcvalue");
    if (value >= 0.1) {
      return Math.round(value) + "KM";
    }
    return `${value}`;
  }
  
  displayedColumns: string[] = [
    "name",
    "prescribed",
    "frequency",
    "duration",
    "action",
  ];
  // dataSource = ELEMENT_DATA;
  dataSource: MatTableDataSource<AbstractControl>;
  searchParams: any;
  hospital_list: any[] = [];
  searchBarForm: any = FormGroup;
  advanceSearchBarForm: any = FormGroup;
  loginUserID: string = "";
  provinceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  hospitalsData: any = {};
  provinceID: any = "";
  departmentID: any = "";
  insuranceList: any[] = [];
  selected: any = true;
  sliderValue: any;
  appointmentType: any[] = [];
  doctorGender: any[] = [];
  hospitalTypes: any = [];
  hospitalTypeFilter: any = [];
  overlay: false;
  currentPage:any = 1;

  isLoading:boolean = false;
  scrolled:boolean = false;
  scrollDebounceInterval = null;
  totalRecords:any = 0;
  noRecord: any = 0;
  invitationData : any;
  @ViewChild("fhc_nearby") fhc_nearby!: ElementRef;
  @ViewChild("loginRequiredWarningModal", { static: false }) loginRequiredWarningModal: any;
  @ViewChild("SendRequiredInviteModal", { static: false }) SendRequiredInviteModal: any;
  @ViewChild("sendInvitation", { static: false }) sendInvitation: any;

  constructor(
    private modalService: NgbModal,
    private coreService: CoreService,
    private hospitalService: HospitalService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private superAdminService: SuperAdminService,
    private router: Router,
    private patientService: PatientService,

    private toastr: ToastrService
  ) {
    this.searchBarForm = this.fb.group({
      hospitalName: [""],
      fhc_nearby: [""],
      fhc_province: [""],
      fhc_department: [""],
      fhc_city: [""],
      fhc_neighborhood: [""],
      fhc_insuranceAccept: [""],
      fhc_onDuty: [""],
      fhc_openNow: [""],
      lng: [""],
      lat: [""],
      sliderDistance: [5]
    });

    this.searchOnValueChange();

    this.advanceSearchBarForm = this.fb.group({
      rating: [""],
      currentTimeStamp: [""],
     /*  consultationFeeStart: [""],
      consultationFeeEnd: [""], */
      consultationFee: [""],
      silder: [""],
      appointmentType: [""],
      date: [""],
      isDateAvailable:[''],
      experience: [""],
      doctorGender: [""],
      hospitalType: [""],
      service: [""],
      unit: [""],
      hospitalDepartment: [""],
      healthcare-crmPartner: [""],
      spokenLanguage: [""],
    });

    let userData = this.coreService.getLocalStorage("loginData");
    this.loginUserID = userData?._id;

    this.formValueChanges();
  }

  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  ngAfterViewInit() {
    
    var element = document.querySelector('.pac-container.pac-logo');

    if (element) {
    
        element.remove();
    } else {
        console.log('Element not found.');
    }
    this.staticFirstOption= {
      description: 'Autour de moi!', // Description you want to display
      place_id: 'static_first_option', // Unique identifier for the static option
      matched_substrings: [], // Empty array for the required property
      reference: '', // Empty string for the required property
      structured_formatting: {
        main_text: '',
        main_text_matched_substrings: [],
        secondary_text: ''
      }, // Empty object for the required property
      terms: [], // Empty array for the required property
      types: [] // Empty array for the required property
    };

    const options = {
      // bounds: defaultBounds,
      // componentRestrictions: { country: "IN" },
      fields: [
        "address_components",
        "geometry.location",
        "icon",
        "name",
        "formatted_address",
      ],
      strictBounds: false,
      // types: ["establishment"],
    };

    const autocompleteService = new google.maps.places.AutocompleteService();

    const inputElement = this.fhc_nearby.nativeElement
    const otherElement = document.getElementById('otherElementhospital');
 
    otherElement.addEventListener('click', function() {
      // Focus on the input element to open the dropdown
      var event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
  });
 
    this.fhc_nearby.nativeElement.addEventListener('input', () => {
 
      // Get the user input
      const input = this.fhc_nearby.nativeElement.value;
 
      // Request predictions from AutocompleteService
      autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
 
          // Add the static first option to the predictions array
          predictions.unshift(this.staticFirstOption);
 
          // Render the predictions
          this.renderPredictions(predictions);
        } else {
          // Handle error or empty predictions
        }
      });
    });

    this.fhc_nearby.nativeElement.addEventListener('click', () => {
      console.log("sssss");
 
      // Get the user input
      var input = this.fhc_nearby.nativeElement.value;

      if(input === ''){
        input = 'aroundme'
      }
 
      // Request predictions from AutocompleteService
      autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
        console.log(status, "dsfsdf", google.maps.places.PlacesServiceStatus.OK);
        console.log(predictions, "uper");
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          console.log(predictions, "lower");
 
          // Add the static first option to the predictions array
          predictions.unshift(this.staticFirstOption);
 
          // Render the predictions
          this.renderPredictions(predictions);
        } else {
          // Handle error or empty predictions
        }
      });
    });

    this.autoComplete = new google.maps.places.Autocomplete(
      this.fhc_nearby.nativeElement,
      options
    );
    this.autoComplete.addListener("place_changed", (record) => {
      // const place = this.autoComplete?.getPlace()
      const place = this.autoComplete.getPlace();
      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];
      this.searchBarForm.patchValue({
        lng: this.loc.coordinates[0],
        lat: this.loc.coordinates[1],
      });
      const pacLogoDiv11 = document.querySelector('.pac-container.pac-logo') as HTMLElement;
      pacLogoDiv11.style.setProperty('display', 'none', 'important');
    });
  }

  ngOnInit(): void {
    //this.getHospitalList();
    this.getProvinceList();
    this.getDepartmentList();
    this.getCitytList();
    this.getParamsValue();
    this.getInsuranceList();
    this.getSpokenLanguage();
    this.getHospitalTypes();
    this.onScroll();
  }

  @HostListener("window:scroll", [])
 
  onScroll(): void {
    this.scrolled = true;

    if (!this.isLoading) {
      if (this.scrollDebounceInterval) {
        clearTimeout(this.scrollDebounceInterval);
      }

      this.scrollDebounceInterval = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.scrollHeight;
        const scrollThreshold = 1100;

        if (scrollPosition >= documentHeight - scrollThreshold) {
          console.log("Scroll threshold crossed. Loading more data.");
          if (this.noRecord == 0) {
            this.currentPage++;
            console.log(this.currentPage, "currentPageee______");

            this.isLoading = true;
            console.log("Current_page:", this.currentPage);

            this.getHospitalList();
          }
          else {
            this.currentPage = 1;
          }
          console.log(this.currentPage, 'currentPage___22');

        }
      }, 200);
    }
  }

  getHospitalTypes() {
    this.superAdminService.getHealthCenterTypes().subscribe((res: any) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.hospitalTypes = response.result;
      console.log(this.hospitalTypes, "hospitalTypes______");
    })
  }

  createAlert(hospitalId: string, action = '',hospitalData:any='') {
    console.log("hospitalData_________",hospitalData)
    this.invitationData = hospitalData;
    if (!this.loginUserID) {
      if(action === 'sendinvite'){
        this.modalService.open(this.SendRequiredInviteModal, {
          centered: true,
          size: "lg",
          windowClass: "order_medicine",
        });
        return
      }else{
        this.modalService.open(this.loginRequiredWarningModal, {
          centered: true,
          size: "lg",
          windowClass: "order_medicine",
        });
        return
      }
      
    } else {
      let route;
      if (action === 'book') {
        route = "/patient/homepage/retailhospitalinfo"
        this.router.navigate([
          route,
          hospitalId,
        ]);
      }else{
        this.modalService.open(this.sendInvitation, { centered: true, size: "lg" });
      }
      //  else {
      //   route = '/patient/homepage/retailhospitaldetail'
      // }
     
     
    }
  }

  // createAlert(hospitalId: string, action = '') {
  //   if (!this.loginUserID) {
  //     this.modalService.open(this.loginRequiredWarningModal, {
  //       centered: true,
  //       size: "lg",
  //       windowClass: "order_medicine",
  //     });
  //     return
  //   } else {
  //     let route;
  //     if (action) {
  //       route = "/patient/homepage/retailhospitalinfo"
  //     } else {
  //       route = '/patient/homepage/retailhospitaldetail'
  //     }
  //     this.router.navigate([
  //       route,
  //       hospitalId,
  //     ]);
  //   }
  // }
  formValueChanges() {

    this.advanceSearchBarForm.valueChanges.subscribe((selectedValue) => {
      console.log(selectedValue, "selectedValueeeeee");
      if (!selectedValue.doctorGender && !selectedValue.appointmentType) {
        this.currentPage = 1;
        this.getHospitalList("search");
      }

    });
  }
  getParamsValue() {
    this.route.queryParams.subscribe((res) => {
      this.searchParams = res;
    });

    // if (this.searchParams["fhc_onDuty"] === "true") {
    //   this.searchBarForm.patchValue({
    //     fhc_onDuty: true,
    //   });
    // }
    // if (this.searchParams["fhc_onDuty"] === "false") {
    //   this.searchBarForm.patchValue({
    //     fhc_onDuty: false,
    //   });
    // }
    // if (this.searchParams["fhc_openNow"] === "true") {
    //   this.searchBarForm.patchValue({
    //     fhc_openNow: true,
    //   });
    // }
    // if (this.searchParams["fhc_openNow"] === "false") {
    //   this.searchBarForm.patchValue({
    //     fhc_openNow: false,
    //   });
    // }
    if (Object.keys(this.searchParams).length != 0) {
      // console.log("Through Params------------->");
      if(this.searchParams["fhc_openNow"] == "true") {
        this.searchBarForm.patchValue({
              openNow: true,
             });
      }
      else if(this.searchParams["fhc_openNow"] == "false"){
        this.searchBarForm.patchValue({
          openNow: false,
         });
      }

      if(this.searchParams["fhc_onDuty"] == "true") {
        this.searchBarForm.patchValue({
          onDutyHospital: true,
             });
      }
      else if(this.searchParams["fhc_onDuty"] == "false"){
        this.searchBarForm.patchValue({
          onDutyHospital: false,
         });
      }

      this.searchBarForm.patchValue({
        hospitalName: this.searchParams["hospitalName"],
        fhc_nearby: this.searchParams["fhc_nearby"],
        //fhc_province: this.searchParams["fhc_province"],
        // fhc_department: this.searchParams["fhc_department"],
        // fhc_city: this.searchParams["fhc_city"],
        // fhc_insuranceAccept: this.searchParams["fhc_insuranceAccept"],
        //fhc_openNow: this.searchParams["fhc_openNow"] == "true" ? true : false,
        //fhc_onDuty: this.searchParams["fhc_onDuty"] == "true" ? true : false,
        fhc_neighborhood: this.searchParams["fhc_neighborhood"],
        lng: this.searchParams["lng"],
        lat: this.searchParams["lat"],
      });
    }
    // console.log("----------- this.searchBarForm>", this.searchBarForm);
  }
  getHospitalList(type: any = "") {
    let reqData = {
      searchText: this.searchBarForm.value.hospitalName,
      city: this.searchBarForm.value.fhc_city,
      neighborhood: this.searchBarForm.value.fhc_neighborhood,
      long: this.searchBarForm.value.lng,
      lat: this.searchBarForm.value.lat,
      province: this.searchBarForm.value.fhc_province,
      department: this.searchBarForm.value.fhc_department,
      insuranceAccpted: this.searchBarForm.value.fhc_insuranceAccept,
      openNow: this.searchBarForm.value.fhc_openNow,
      onDutyHospital: this.searchBarForm.value.fhc_onDuty,
      currentTimeStamp: this.advanceSearchBarForm.value.currentTimeStamp,
      /* consultationFeeStart: this.advanceSearchBarForm.value
        .consultationFeeStart,
      consultationFeeEnd: this.advanceSearchBarForm.value.consultationFeeEnd, */
      consultationFeeStart: 0,
      consultationFeeEnd: this.advanceSearchBarForm.value.silder,
      consultationFee: this.advanceSearchBarForm.value.consultationFee,
      appointmentType: this.appointmentType,

      isAvailableDate: this.advanceSearchBarForm.value.isDateAvailable ?
       this.advanceSearchBarForm.value.isDateAvailable : 
       this.advanceSearchBarForm.value.date,
      
      rating: this.advanceSearchBarForm.value.rating,
      experience: this.advanceSearchBarForm.value.experience,
      doctorGender: this.doctorGender,
      hospitalType: this.hospitalTypeFilter,
      service: this.advanceSearchBarForm.value.service,
      unit: this.advanceSearchBarForm.value.unit,
      hospitalDepartment: this.advanceSearchBarForm.value.hospitalDepartment,
      spokenLanguage: this.advanceSearchBarForm.value.spokenLanguage,
      healthcare-crmPartner: this.advanceSearchBarForm.value.healthcare-crmPartner,
      limit: 4,
      page: this.currentPage,
      maxDistance: this.searchBarForm.value.sliderDistance
    };

    this.hospitalService.adSearchHospital(reqData).subscribe(
      (res) => {
        console.log("Requesttttt_____________", reqData);
        let response = this.coreService.decryptObjectData({ data: res });
        //this.hospital_list = response?.data?.result;
          console.log(response , "dhfgurghrughrue");
          
        const result = response?.data.result;
        const formValues = Object.values(this.searchBarForm.value);
        const hasValue = formValues.some(value => !!value);

          const adformValues = Object.values(this.advanceSearchBarForm.value);
          let adhasValue = adformValues.some(value => !!value);

          if(this.hospitalTypeFilter.length>0){
            adhasValue = true
          }
          if(this.doctorGender.length>0){
            adhasValue = true
          }
          console.log(hasValue,"searchBarValuee____",adhasValue);


          if (hasValue || adhasValue) {
            this.noRecord = 0;
            if (type == "search") {
              this.hospital_list = []
              this.currentPage = 1;
  
            }
            console.log(this.hospital_list, "Updated_Pharmacy_List___", result);
  
            const uniqueResult = result.filter((newItem) => {
              const isDuplicate = this.hospital_list.some(existingItem => {
                const isMatching = existingItem._id === newItem._id;
                if (isMatching) {
                  //console.log(`Updated_Pharmacy_List: existingItem._id=${existingItem._id} | newItem._id=${newItem._id}`);
                }
                return isMatching;
              });
              return !isDuplicate;
            });
            console.log(uniqueResult, "Updated_Pharmacy_List");
  
            // If the result is not empty, update the hospital_list and isLoading
            this.hospital_list = [...this.hospital_list, ...uniqueResult];
            console.log("Updated_Pharmacy_List", this.hospital_list);
  
            this.isLoading = false;
            console.log(this.hospital_list, "hospital_list_basedon SearchValuess____");
          } else if (result.length === 0 && this.currentPage > 1) {
            this.toastr.error("No Any More List To Fetch!");
            this.isLoading = false;
            this.noRecord = 1;
            this.currentPage = 1;
          } else {
            const uniqueResult = result.filter((newItem) => {
              const isDuplicate = this.hospital_list.some(existingItem => {
                const isMatching = existingItem._id === newItem._id;
                if (isMatching) {
                  //console.log(`Matching: existingItem._id=${existingItem._id} | newItem._id=${newItem._id}`);
                }
                return isMatching;
              });
              return !isDuplicate;
            });
            console.log(uniqueResult, "uniqueResultttt");
  
            // If the result is not empty, update the hospital_list and isLoading
            this.hospital_list = [...this.hospital_list, ...uniqueResult];
            console.log("Updated_Pharmacy_List", this.hospital_list);
  
            this.isLoading = false;
            this.noRecord = 0;
  
          }
        this.totalRecords =  response?.data?.totalRecords;

        console.log("hospital_listtttt", response?.data);
      },
      (err) => {
        // console.log(err);
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        console.log(errorResponse);
      }
    );
  }
  searchOnValueChange() {
    this.searchBarForm.valueChanges.subscribe((val) => {
      const hasNonUndefinedValue = Object.values(val).some(value => value !== undefined && value !== '');
      if (hasNonUndefinedValue) {
        console.log(val, "searchCall_______", this.currentPage);
        this.currentPage = 1;
        this.getHospitalList("search");
      }else{
        console.log("emptyyyy________");
        this.currentPage = 1;
        this.hospital_list = [];
        this.getHospitalList();
      }
    });
  }

  onSliderChange(data: any) {
    this.sliderValue = data.value;
    console.log(data);
  }

  closeAllModal() {
    this.modalService.dismissAll();
  }
  getInsuranceList() {
    this.patientService.getInsuanceList().subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      const arr = response?.body?.result;
      arr.unshift({ for_portal_user: { _id: '' }, company_name: 'Select Insurance Company' });
      arr.map((curentval: any) => {
        this.insuranceList.push({
          label: curentval?.company_name,
          value: curentval?.for_portal_user?._id,
        });
      });
     
      console.log(this.insuranceList ,"jj");
      
      if(this.searchParams["fhc_insuranceAccept"]){
        console.log(this.insuranceList, 'insuranceList11');
  
            this.searchBarForm.patchValue({
              fhc_insuranceAccept: this.searchParams["fhc_insuranceAccept"],
            })
             }

    });
  }
  // province_list
  getProvinceList() {
    this.superAdminService.getProvinceListByRegionId("").subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        // this.provinceList = response.body?.list;
        const arr = response?.body?.list;
        arr.unshift({ _id: '', name: 'Select Provinces' });
        arr.map((curentval: any) => {
          this.provinceList.push({
            label: curentval?.name,
            value: curentval?._id,
          });
        });
        if(this.searchParams["fhc_province"]){
          this.searchBarForm.patchValue({
            fhc_province: this.searchParams["fhc_province"],
          })
           }
      }
    });
  }
  // department_list
  getDepartmentList() {
    
    this.superAdminService
      .getDepartmentListByProvinceId(this.provinceID || '')
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
         if (response.status) {
          // this.departmentList = response.body?.list;
          const arr = response?.body?.list;
          this.departmentList = []
          arr.unshift({ _id: '', name: 'Select Department' });
          arr.map((curentval: any) => {
            this.departmentList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });

          if(this.searchParams["fhc_department"]){
            this.searchBarForm.patchValue({
              fhc_department: this.searchParams["fhc_department"],
            })
             }
        }
        
      });
  }
  // city_list
  getCitytList() {
    if(this.departmentID == undefined ){
      return;
    }
    this.superAdminService
      .getCityListByDepartmentId(this.departmentID)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.cityList = []
          // this.cityList = response.body?.list;
          const arr = response?.body?.list;
          arr.unshift({ _id: '', name: 'Select City' });
          arr.map((curentval: any) => {
            this.cityList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          });
          if(this.searchParams["fhc_city"]){
            this.searchBarForm.patchValue({
              fhc_city: this.searchParams["fhc_city"]
            })
             }
        }
      });
  }

  getDirection(direction:any ) {
     if (direction.length == 0)
    {
      this.toastr.error("Location coordinates not found")
      return 
    }
    const[coordinates] = direction
    const lat = coordinates[1];
    const lng = coordinates[0];
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, "_blank");
  }
  spokenLanguagess: any[] = [];
  getSpokenLanguage() {
    this.patientService.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log(response);
      this.spokenLanguagess = response.body?.spokenLanguage;
    });
  }
  handleSelectProvince(event: any) {
    this.provinceID = event.value;
    console.log(event,"provienceId_____");
    
    this.getDepartmentList();
    this.getHospitalList();
  }
  handleSelectDepartment(event: any) {
    this.departmentID = event.value;
    this.getCitytList();
    this.getHospitalList();
  }
  handleSelectCity(event: any) {
    this.getHospitalList();
  }
  handleChangeGenderBox(event: any, changeFor: any) {
    // console.log(event.checked);
    if (changeFor === "male") {
      this.advanceSearchBarForm.patchValue({
        doctorGender: event.checked,
      });
    }
    if (changeFor === "female") {
      this.advanceSearchBarForm.patchValue({
        doctorGender: event.checked,
      });
    }
  }

  handlehospitalType(hospType: any) {
    const index = this.hospitalTypeFilter.indexOf(hospType);
    if (hospType === 'All') {
      this.hospitalTypeFilter = [];
      this.getHospitalList();
    } else if (hospType === 'others') {
      this.hospitalTypeFilter = [];
      this.getHospitalList();
    } else {
      if (index === -1) {
        this.hospitalTypeFilter.push(hospType);
        this.getHospitalList('search');
      } else {
        this.hospitalTypeFilter.splice(index, 1);
        this.getHospitalList('search');
      }
    }
  }

  // appointmentType
  handletypeofAppBox(event: any, changeFor: any) {
    if (event.checked) {
      this.appointmentType.push(changeFor);
    } else {
      let result = this.appointmentType.filter((ele) => ele !== changeFor);
      this.appointmentType = result;
    }
    //console.log(this.appointmentType,"AppointmnetTypee_____");
    this.getHospitalList();
  }

  // gender
  selectGender(event: any, changeFor: any) {

    if (event.checked) {
      this.doctorGender.push(changeFor);
    } else {
      let result = this.doctorGender.filter((ele) => ele !== changeFor);
      this.doctorGender = result;
    }
    console.log(this.doctorGender, "changeForrrr_____11");

    this.getHospitalList('search');
  }

  clearAdvanceFilter() {
    // console.log("reset");
    this.advanceSearchBarForm.reset();
  }

  handleRoute(_id: any,created_by:any='') {
    console.log(_id, "_iddddd")
    if(created_by=='self')
    {
      this.router.navigate([`/patient/homepage/retailhospitaldetail/${_id}`]);
 
    }
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  public handleBtnClick() {
    localStorage.setItem("status","true")
    this.modalService.dismissAll();
    this.router.navigate(["/patient/login"]);
  }

  clearSearch(controlName: string, event: Event) {
    event.stopPropagation();
    console.log(controlName, "valueeeeeee");
    this.searchBarForm.get(controlName)?.setValue('');
    if (controlName == 'fhc_nearby') {
      this.searchBarForm.get('lat')?.setValue('');
      this.searchBarForm.get('lng')?.setValue('');
      const pacLogoDiv11 = document.querySelector('.pac-container.pac-logo') as HTMLElement;
      pacLogoDiv11.style.setProperty('display', 'none', 'important');
    }
  }

  clearAdvSearch(controlName: string, event: Event) {
    if (controlName === "doctorGender") {
      this.doctorGender = [];
      event.stopPropagation();
      console.log(controlName, "advanceSearchBarForm_Valuee");
      this.advanceSearchBarForm.get(controlName)?.setValue('');
    } else if(controlName === 'date'){
      event.stopPropagation();
      this.advanceSearchBarForm.get('isDateAvailable')?.setValue('');
      this.advanceSearchBarForm.get(controlName)?.setValue('');
    } else{
      event.stopPropagation();
      console.log(controlName, "advanceSearchBarForm_Valuee");
      this.advanceSearchBarForm.get(controlName)?.setValue('');
    }
  }
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
           
        this.searchBarForm.patchValue({
          fhc_nearby: "Autour de moi!",
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      this.getHospitalList();
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }


  // Function to render predictions
  renderPredictions(predictions: google.maps.places.AutocompletePrediction[]) {
    // Render predictions in your UI, e.g., dropdown menu

    this.clearDropdown();

    const pacLogoDiv = document.querySelector('.pac-container.pac-logo');

    if (pacLogoDiv) {
      // Render the static option before the pac-container pac-logo div
      const staticOptionElement = document.createElement('div');
      staticOptionElement.className = 'pac-item around1'; // add a custom class for styling
  
      // Create and append the image element
      const imgElement = document.createElement('img');
      imgElement.src = '../../../../../assets/img/homepage/sidebar/nearby.svg';
      staticOptionElement.appendChild(imgElement);
  
      // Append the text content
      const textElement = document.createElement('span');
      textElement.textContent = this.staticFirstOption.description;
      staticOptionElement.appendChild(textElement);
  
      pacLogoDiv.appendChild(staticOptionElement);
      const pacLogoDiv11 = document.querySelector('.pac-container.pac-logo') as HTMLElement;
      pacLogoDiv11.style.setProperty('display', 'block', 'important');

      // Add click event listener to the "Around Me" option
      staticOptionElement.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Stop event propagation
        this.getCurrentLocation(); // Call getCurrentLocation function
        // pacLogoDiv11.style.display = 'none !important';
        pacLogoDiv11.style.setProperty('display', 'none', 'important');
      });
    }
  
    // // Render other predictions
    // predictions.forEach(prediction => {
    //   const predictionElement = document.createElement('div');
    //   predictionElement.className = 'pac-item';
    //   predictionElement.textContent = prediction.description;
    //   this.nearby.nativeElement.parentNode.appendChild(predictionElement);
    // });
  }

  clearDropdown() {
    const dropdownItems = document.querySelectorAll('.pac-item');
    dropdownItems.forEach(item => item.parentNode.removeChild(item));
  }

  hidesearch(controlName: string, event: Event)
  {
    event.stopPropagation();
    setTimeout(() => {
      const pacLogoDiv111 = document.querySelector('.pac-container.pac-logo') as HTMLElement;
      
      pacLogoDiv111.style.setProperty('display', 'none', 'important');
    }, 1000);
  
  }

  newInvitation() {
    let formData = {
      created_By: this.loginUserID,
      first_name: this.invitationData.hospitalName,
      middle_name: "",
      last_name: "",
      email: this.invitationData.email,
      phone: this.invitationData.phone_number,
      address: this.invitationData.address,
      portalmessage: "This is portal is very usefull to do claims and manage the orders.",
      portalname: "hospital"
    }
    this.patientService
      .inviteUser(formData)
      .subscribe((res: any) => {
        let result = this.coreService.decryptObjectData({ data: res });
        console.log("submit result=====>", result)
        if (result.status) {
          this.toastr.success(result.message);
          this.closePopup();
        } else {
          this.toastr.error(result.message);
        }
      });
  }
 
  closePopup() {
    // this.newInvitationForm.reset();
    this.modalService.dismissAll("close");
  }
}
