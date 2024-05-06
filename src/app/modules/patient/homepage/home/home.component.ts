import { CoreService } from "./../../../../shared/core.service";
import { SuperAdminService } from "./../../../super-admin/super-admin.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
declare let $: any;
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { PatientService } from "../../patient.service";
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  filteredOptions!: Observable<any[]>;

  findPharmacyForm: any = FormGroup;
  findHospitalOrClinic: any = FormGroup;
  findDoctor: any = FormGroup;
  imgOptDntlab:any = FormGroup;
  autoComplete: google.maps.places.Autocomplete;
  autoComplete_two: google.maps.places.Autocomplete;
  autoCompleteForHospital: google.maps.places.Autocomplete;
  autoCompleteForDoctor: google.maps.places.Autocomplete;
  autoCompleteForPharmacy: google.maps.places.Autocomplete;
  autoCompleteForParamedical: google.maps.places.Autocomplete;
  autoCompleteForDental: google.maps.places.Autocomplete;
  autoCompleteForImaging: google.maps.places.Autocomplete;
  autoCompleteForOptical: google.maps.places.Autocomplete;
  loc: any = {};
  @ViewChild("nearby") nearby!: ElementRef;
  @ViewChild("pharm_nearby") pharm_nearby ! :ElementRef;
  @ViewChild("fhc_nearby") fhc_nearby!: ElementRef;
  @ViewChild("fd_nearby") fd_nearby!: ElementRef;
  @ViewChild("parmedical_nearby") parmedical_nearby!: ElementRef;
  @ViewChild("dental_nearby") dental_nearby!: ElementRef;
  @ViewChild("imaging_nearby") imaging_nearby!: ElementRef;
  @ViewChild("optical_nearby") optical_nearby!: ElementRef;
  @ViewChild("nearby_two") nearby_two!: ElementRef;
  control = new FormControl('');
  provinceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  provinceID: any = "";
  departmentID: any = "";
  insuranceList: any[] = [];
  searchKey: any;
  searchResult: any=[];
  streets: string[];
  long: any = "";
  lat: any = "";
  clearIcon : boolean = false;
  nearByTabKey : string = ""
  staticFirstOption: {
    description: string; // Description you want to display
    place_id: string; // Unique identifier for the static option
    matched_substrings: any[]; // Empty array for the required property
    reference: string; // Empty string for the required property
    structured_formatting: { main_text: string; main_text_matched_substrings: any[]; secondary_text: string; }; // Empty object for the required property
    terms: any[]; // Empty array for the required property
    types: any[]; // Empty array for the required property
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private service: PatientService
  ) {
    this.findPharmacyForm = this.fb.group({
      pharmacy_name: [""],
      nearby: [""],
      province: [""],
      department: [""],
      city: [""],
      neighborhood: [""],
      insuranceAccept: [""],
      onDutyPharmacy: [""],
      openNow: [""],
      lng: [""],
      lat: [""],
    });

    this.findHospitalOrClinic = this.fb.group({
      hospitalName: [""],
      fhc_city: [""],
      fhc_neighborhood: [""],
      fhc_nearby: [""],
      fhc_province: [""],
      fhc_department: [""],
      fhc_insuranceAccept: [""],
      fhc_onDuty: [""],
      fhc_openNow: [""],
      lng: [""],
      lat: [""],
    });

    this.findDoctor = this.fb.group({
      doctor_name: [""],
      fd_city: [""],
      fd_neighborhood: [""],
      fd_nearby: [""],
      fd_province: [""],
      fd_department: [""],
      fd_insuranceAccept: [""],
      fd_onDuty: [""],
      fd_openNow: [""],
      lng: [""],
      lat: [""],
    });

    this.imgOptDntlab= this.fb.group({
      portal_name: [""],
      city: [""],
      neighborhood: [""],
      nearby: [""],
      province: [""],
      department: [""],
      insuranceAccept: [""],
      onDutyPortal: [""],
      openNow: [""],
      lng: [""],
      lat: [""],
    });
  }

  ngOnInit(): void {
    localStorage.setItem("status","false")
    this.getInsuranceList();
    this.getProvinceList();
    this.getDepartmentList();
    this.getCitytList();

    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')
      
      
      ),
    );
    console.log("this.filteredOptions_______________",this.filteredOptions);
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(this.searchResult, "dbbdmdd" + filterValue);

    if (this.searchResult.length > 0) {
      var result = this.searchResult.filter((option: any) => {
        return option.name.toLowerCase().includes(filterValue);
      });
      return result != "" ? result : ["No data"];
    }
    return ["No data"];
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  searchPharmacy() {
    console.log(this.findHospitalOrClinic.value , "hhhhhh");
    
    this.router.navigate(["/patient/homepage/retailpharmacy"], {
      queryParams: this.findPharmacyForm.value,
    });
  }
  get f() {
    return this.findPharmacyForm.controls;
  }
  searchHospitalOrClinic() {
    this.router.navigate(["/patient/homepage/retailhospital"], {
      queryParams: this.findHospitalOrClinic.value,
    });
  }
  searchDoctor() {
    this.router.navigate(["/patient/homepage/retaildoctor"], {
      queryParams: this.findDoctor.value,
    });
  }
  searchImgOptDntlLab(type:any) {
    console.log("searchImgOptDntlLabbb____", this.imgOptDntlab.value);
    this.router.navigate([`/patient/homepage/list/${type}`], {
      queryParams: this.imgOptDntlab.value,
    });
  }

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
      fields: [
        "address_components",
        "geometry.location",
        "icon",
        "name",
        "formatted_address",
      ],
      strictBounds: false,
    };


    const inputElement = this.nearby.nativeElement
    const otherElement = document.getElementById('near_by');
 
    otherElement.addEventListener('click', function() {
      // Focus on the input element to open the dropdown
      var event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
  });
  this.autoComplete = new google.maps.places.Autocomplete(
    this.nearby.nativeElement,
    options
  );
    const autocompleteService = new google.maps.places.AutocompleteService();


    this.autoComplete.addListener("place_changed", (record) => {
      const place = this.autoComplete.getPlace();
     const googleLocationList = document.querySelector('.pac-container.pac-logo') as HTMLElement;
     console.log(googleLocationList ,"kkkk");
     googleLocationList.style.setProperty('display', 'none', 'important');

     
       console.log("NEARBY pharmacy===============================>",place);
      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];
      
      this.long = place.geometry.location.lng(),
      this.lat = place.geometry.location.lat(),

      this.findPharmacyForm.patchValue({
        nearby: place.formatted_address,
        lng: this.loc.coordinates[0],
        lat: this.loc.coordinates[1],
      });

      this.searchbyPortaluserName();
      const element = document.getElementById("search_one") as HTMLInputElement
      element.click()

    });
 
    this.nearby.nativeElement.addEventListener('input', () => {
      const input = this.nearby.nativeElement.value;
      const id = this.nearby.nativeElement.id;
  
      autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
        console.log(status, "dsfsdf", google.maps.places.PlacesServiceStatus.OK);
        console.log(predictions, "uper");
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          console.log(predictions, "lower");

          // Add the static first option to the predictions array
          predictions.unshift(this.staticFirstOption);

          // Render the predictions
          this.renderPredictions(predictions , "search_one",id);
        } else {
          // Handle error or empty predictions
        }
      });
    });

    this.nearby.nativeElement.addEventListener('click', () => {


      
      var input = this.nearby.nativeElement.value;
      const id = this.nearby.nativeElement.id;
      console.log(input,"input");
      
  if(!input)
  {
    input='around me'
  }
  console.log("dghdhjgdjhk");
  
      autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
        console.log(status, "dsfsdf", google.maps.places.PlacesServiceStatus.OK);
        console.log(predictions, "uper");
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          console.log(predictions, "lower");

          // Add the static first option to the predictions array
          predictions.unshift(this.staticFirstOption);

          // Render the predictions
          this.renderPredictions(predictions , "search_one",id);
        } else {
          // Handle error or empty predictions
        }
      });
    });

    this.nearby_two.nativeElement.addEventListener('input', () => {
      console.log("near_by _two");

      // Get the user input
      const input = this.nearby_two.nativeElement.value;
      const id = this.nearby.nativeElement.id;
      
      // Request predictions from AutocompleteService
      autocompleteService.getPlacePredictions({ input }, (predictions, status) => {
        console.log(status, "dsfsdf", google.maps.places.PlacesServiceStatus.OK);
        console.log(predictions, "uper");
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          console.log(predictions, "lower");

          // Add the static first option to the predictions array
          predictions.unshift(this.staticFirstOption);

          // Render the predictions
          this.renderPredictions(predictions,"search_two",id);
        } else {
          // Handle error or empty predictions
        }
      });
    });


    this.autoComplete_two.addListener("place_changed", (record) => {
      const place = this.autoComplete_two.getPlace();
       console.log("NEARBY pharmacy===============================>",place);
      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];
      
      this.long = place.geometry.location.lng(),
      this.lat = place.geometry.location.lat(),

      this.findPharmacyForm.patchValue({
        nearby: place.formatted_address,
        lng: this.loc.coordinates[0],
        lat: this.loc.coordinates[1],
      });

      this.searchbyPortaluserName();
      const element = document.getElementById("search_two") as HTMLInputElement
      element.click()

    });
    this.nearby_two.nativeElement.addEventListener('click', () => {
      console.log("near_by _two");

      


      var element = document.querySelector('.pac-container.pac-logo');
      if (element) {
          element.remove();
      } else {
          console.log('Element not found.');
      }
      
      const near2 = this.nearby_two.nativeElement
      console.log(near2,"near2");
      
      const otherElement2 = document.getElementById('near_by_two');
   
      otherElement2.addEventListener('click', function() {
        // Focus on the input element to open the dropdown
        var event = new Event('input', { bubbles: true });
        near2.dispatchEvent(event);
    });
   this.autoComplete_two = new google.maps.places.Autocomplete(
        this.nearby_two.nativeElement,
        options
      );

      // Get the user input
      var input = this.nearby_two.nativeElement.value;
      const id = this.nearby.nativeElement.id;
      if(!input)
      {
        input="around";
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
          this.renderPredictions(predictions,"search_two",id);
        } else {
          // Handle error or empty predictions
        }
      });
    });

    $(".joinus_section .owl-carousel").owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      responsive: {
        0: {
          items: 1,
        },
      },
    });

    $(".owl-carousel").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      responsive: {
        0: {
          items: 1,
        },
      },
    });
  }

  getInsuranceList() {
    this.service.getInsuanceList().subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
       console.log(response);
      //  this.insuranceList = response.body.result;
      //  console.log(this.insuranceList , "llll");
       
      const arr = response?.body?.result;
      arr.unshift({ _id: '', name: 'Select Insurance' });
      arr.map((curentval: any) => {
      
        this.insuranceList.push({
          label: curentval?.company_name,
          value: curentval?.for_portal_user?._id,
        });
      
      });
      console.log("depart" , this.insuranceList);
    });
  }

  getProvinceList() {
    this.superAdminService.getProvinceListByRegionId("").subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log(response);
      if (response.status) {
        // this.provinceList = response.body?.list;
        // console.log("hghg" , this.provinceList);
        
        const arr = response?.body?.list;
        arr.unshift({ _id: '', name: 'Select Provinces' });
        arr.map((curentval: any) => {
         
          this.provinceList.push({
            label: curentval?.name,
            value: curentval?._id,
          });
        
        });
        console.log("jjj" , this.provinceList);
        
      }
    });
  }

  getDepartmentList() {
    this.departmentList = []
    this.superAdminService
      .getDepartmentListByProvinceId(this.provinceID)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        // console.log(response);
        if (response.status) {
          // this.departmentList = response.body?.list;
          // console.log(this.departmentList);
          
          const arr = response?.body?.list;
          arr.unshift({ _id: '', name: 'Select Department' });
          arr.map((curentval: any) => {
          
            this.departmentList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          
          });
          console.log("depart" , this.departmentList);
          
        }
      });
  }

  getCitytList() {
    this.cityList = []
    this.superAdminService
      .getCityListByDepartmentId(this.departmentID)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        // console.log(response);
        if (response.status) {
          // this.cityList = response.body?.list;

          const arr = response?.body?.list;
          arr.unshift({ _id: '', name: 'Select City' });
          arr.map((curentval: any) => {
          
            this.cityList.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          
          });
          console.log("city" , this.cityList);
          
        }
      });
  }

  handleSelectProvince(event: any) {
    // console.log(event.value);
    this.provinceID = event.value;
    if(this.provinceID!=undefined)
    {
      this.getDepartmentList();
    }
  }

  handleSelectDepartment(event: any) {
    // console.log(event.value);
    this.departmentID = event.value;
    if(this.departmentID!=undefined)
    {
      this.getCitytList();
    }
   
  }

  handleSelectCity(event: any) {
    // console.log(event.value);
  }
  handleSearch(event: any){
    // console.log("event_____________",event);
    
    this.searchKey = event.target.value;
    this.searchbyPortaluserName();

  }

  clear(){
    console.log("(click)");
    
    this.lat ="";
    this.long = "";
    this.searchbyPortaluserName();
  }
  searchbyPortaluserName() {
    console.log("this.loc.coordinates______________",this.loc.coordinates);

    let reqData = {
      searchKey : this.searchKey ? this.searchKey : "",
      lat:this.lat,
      long: this.long
    };
    

    this.service.searchbyPortaluserName(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({data:res});
      console.log(response?.data?.data?.result);
      if(response.status){

        const userArray = []
        console.log(response?.data?.data?.result);

        for (const user of response?.data?.data?.result) {
          userArray.push({
            name: user.name,
            id: user._id,
            type: user.portal_type
          });
        }
        this.searchResult = userArray;
        this.filteredOptions = this.control.valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value || ""))
        );
        
      }
    });
  }

  routeTo(id:any,type:any){
    console.log(id,"CHECK__________-", type);

    if(type=== 'Doctor'){
    this.router.navigate([`/patient/homepage/retaildoctordetail/${id}`])

    }else if(type === 'Hospital'){
    this.router.navigate([`/patient/homepage/retailhospitaldetail/${id}`])

    }else if(type === 'Pharmacy'){
    this.router.navigate([`/patient/homepage/retailpharmacydetail/${id}`])

    }else if(type === 'Dental' || type === 'Optical' || type === 'Laboratory-Imaging' || type === 'Paramedical-Professions'){
    this.router.navigate([`/patient/homepage/details/${type}/${id}`])

    }
    
  }
  getCurrentLocation(element ?: any , nearby ?: any) {
    if (navigator.geolocation) {
      this.clearIcon = true
      navigator.geolocation.getCurrentPosition(position => {
         this.lat = position.coords.latitude;
         this.long = position.coords.longitude;  
        // this.findPharmacyForm.patchValue({
        //   nearby: "Autour de moi!",
        //   lng: position.coords.longitude,
        //   lat: position.coords.latitude,
        // });
        this.searchbyPortaluserName();
        const inputElemet = document.getElementById(element) as HTMLInputElement
        const nearbyElemet = document.getElementById(nearby) as HTMLInputElement
        nearbyElemet.value = "Autour de moi!"
        inputElemet.click()
        
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  clearSearch(element : any){
    this.lat = ""
    this. long = "" 
    const inputElemet = document.getElementById(element) as HTMLInputElement
    inputElemet.value = ""
    this.clearIcon = false
  }
  clearSerachHelper (element : any) {
    const inputElemet = document.getElementById(element) as HTMLInputElement
    if(inputElemet.value != ""){
      this.clearIcon = true
    }
    else{
      this.clearIcon = false
    }

  }

   // Function to render predictions
   renderPredictions(predictions: google.maps.places.AutocompletePrediction[] ,searchEl :any, id:any) {
    // Render predictions in your UI, e.g., dropdown menu
   const inputId = id
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
      // pacLogoDiv11.style.setProperty('width', '100%');

console.log("dhdjgj",pacLogoDiv11);

      // Add click event listener to the "Around Me" option
      staticOptionElement.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default action
        event.stopPropagation(); // Stop event propagation
        this.getCurrentLocation(searchEl , inputId); // Call getCurrentLocation function
        // pacLogoDiv11.style.display = 'none !important';
console.log("dhdjgj",pacLogoDiv11);

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

      
    }, 100);
  
  }
  tabKey(tabKey ?: any){
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
    var element = document.querySelector('.pac-container.pac-logo');
    if (element) {
        element.remove();
    } else {
        console.log('Element not found.');
    }
    if(tabKey == "fd_nearby") 
    {
       
      this.autoCompleteForDoctor = new google.maps.places.Autocomplete(
        this.fd_nearby.nativeElement,
        options
      );   
      this.autoCompleteForDoctor.addListener("place_changed", (record) => {
        const place = this.autoCompleteForDoctor.getPlace();
        // console.log("NEARBY placeForHospital===============================>",place);
  
        this.loc.type = "Point";
        this.loc.coordinates = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];
  
        this.findDoctor.patchValue({
          fd_nearby: place.formatted_address,
          lng: this.loc.coordinates[0],
          lat: this.loc.coordinates[1],
        });
      });
    }
    else if(tabKey == "pharm_nearby") 
    {
      this.autoCompleteForPharmacy = new google.maps.places.Autocomplete(
        this.pharm_nearby.nativeElement,
        options
      ); 
      
      this.autoCompleteForPharmacy.addListener("place_changed", (record) => {
        const place = this.autoCompleteForPharmacy.getPlace();
         console.log("NEARBY placeForHospital===============================>",place);
  
        this.loc.type = "Point";
        this.loc.coordinates = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];
  
        this.findPharmacyForm.patchValue({
          nearby : place.formatted_address,
          lng: this.loc.coordinates[0],
          lat: this.loc.coordinates[1],
        });
      });
  
    }

    else if(tabKey == "fhc_nearby") 
    {
      this.autoCompleteForHospital = new google.maps.places.Autocomplete(
        this.fhc_nearby.nativeElement,
        options
      ); 
      
      this.autoCompleteForHospital.addListener("place_changed", (record) => {
        const place = this.autoCompleteForHospital.getPlace();
        // console.log("NEARBY placeForHospital===============================>",place);
  
        this.loc.type = "Point";
        this.loc.coordinates = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];
  
        this.findHospitalOrClinic.patchValue({
          fhc_nearby: place.formatted_address,
          lng: this.loc.coordinates[0],
          lat: this.loc.coordinates[1],
        });
      });
    }

    else if(tabKey == "parmedical_nearby") 
    {
      this.autoCompleteForParamedical = new google.maps.places.Autocomplete(
        this.parmedical_nearby.nativeElement,
        options
      ); 
       
    this.autoCompleteForParamedical.addListener("place_changed", (record) => {
      const place = this.autoCompleteForParamedical.getPlace();
       console.log("NEARBY placeForHospital===============================>",place);

      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];

      this.imgOptDntlab.patchValue({
        nearby : place.formatted_address,
        lng: this.loc.coordinates[0],
        lat: this.loc.coordinates[1],
      });
    });
    }
    else if(tabKey == "dental_nearby") 
    {
      this.autoCompleteForDental = new google.maps.places.Autocomplete(
        this.dental_nearby.nativeElement,
        options
      );


    this.autoCompleteForDental.addListener("place_changed", (record) => {
      const place = this.autoCompleteForDental.getPlace();
       console.log("NEARBY placeForHospital===============================>",place);

      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];

      this.imgOptDntlab.patchValue({
        nearby : place.formatted_address,
        lng: this.loc.coordinates[0],
        lat: this.loc.coordinates[1],
      });
    });

   
    }

    else if(tabKey == "imaging_nearby") 
    {
      this.autoCompleteForImaging = new google.maps.places.Autocomplete(
        this.imaging_nearby.nativeElement,
        options
      );

      this.autoCompleteForImaging.addListener("place_changed", (record) => {
        const place = this.autoCompleteForImaging.getPlace();
         console.log("NEARBY placeForHospital===============================>",place);
  
        this.loc.type = "Point";
        this.loc.coordinates = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];
  
        this.imgOptDntlab.patchValue({
          nearby : place.formatted_address,
          lng: this.loc.coordinates[0],
          lat: this.loc.coordinates[1],
        });
      });
      
    }

    else if(tabKey == "optical_nearby") 
    {
      this.autoCompleteForOptical = new google.maps.places.Autocomplete(
        this.optical_nearby.nativeElement,
        options
      );

        
    this.autoCompleteForOptical.addListener("place_changed", (record) => {
      const place = this.autoCompleteForOptical.getPlace();
      // console.log("NEARBY placeForHospital===============================>",place);

      this.loc.type = "Point";
      this.loc.coordinates = [
        place.geometry.location.lng(),
        place.geometry.location.lat(),
      ];

      this.imgOptDntlab.patchValue({
        nearby : place.formatted_address,
        lng: this.loc.coordinates[0],
        lat: this.loc.coordinates[1],
      });
    });



      
    }
 
 
  }

}

