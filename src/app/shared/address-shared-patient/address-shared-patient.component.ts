import { Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from '../core.service';

@Injectable()

@Component({
  selector: 'app-address-shared-patient',
  templateUrl: './address-shared-patient.component.html',
  styleUrls: ['./address-shared-patient.component.scss']
})
export class AddressSharedPatientComponent implements OnInit {

   // @Output() location = new EventEmitter<string>();
   @Input() personalDetails: FormGroup;
   countryList: any[] = [];
   regionlist: any[] = [];
   provincelist: any[] = [];
   departmentlist: any[] = [];
   citylist: any[] = [];
   villagelist: any[] = [];
   autoComplete: google.maps.places.Autocomplete
   loc: any = {};
   defaultCountry:any='';
   @ViewChild("address") address!: ElementRef
  patchCountry: any;
 
   constructor(private sadminService: SuperAdminService, private _coreService: CoreService) { }
 
   ngOnInit(): void {
     this.sadminService.getcountrylist().subscribe({
       next: (res) => {
         let result = this._coreService.decryptContext(res);
         const countryList = result.body.list;
         countryList.map((country)=>{
          this.countryList.push(
            {
              label : country.name,
              value : country._id
            }
          )
         })
         this.personalDetails.get("country").patchValue(this.personalDetails.get('country').value)

        // console.log(this.personalDetails.value);
   

        if (this.personalDetails.value.country) {
          // this.getCountryData(
          //   this.personalDetails.value.country
          // );
         // this.getRegionData(this.personalDetails.value.region);
          // this.getProvinceData(this.personalDetails.value.province);
          // this.getDepartmentData(
          //   this.personalDetails.value.department
          // );
        }
        else
        {
          let data =   this.countryList.map((ele)=>{
            console.log("naaaaaaaaaaaaaa", ele.name);
            if(ele.name === "Burkina Faso"){
              this.defaultCountry = ele._id;
              // console.log("this.patchCountry",this.patchCountry);            
            }
            
          })
          if(this.patchCountry!='')
          {
            this.getCountryData(this.patchCountry);
          }

        }

       },
       error: (err) => {
         console.log(err);
       }
     })
     
   }
   ngAfterViewInit() {
     const options = {
       // bounds: defaultBounds,
       // componentRestrictions: { country: "IN" },
       fields: ["address_components", "geometry.location", "icon", "name","formatted_address"],
       strictBounds: false,
       // types: ["establishment"],
     };
     this.autoComplete = new google.maps.places.Autocomplete(this.address.nativeElement, options)
     this.autoComplete.addListener("place_changed", (record) => {
       // const place = this.autoComplete?.getPlace()
       const place = this.autoComplete.getPlace();
       this.loc.type = "Point";
       this.loc.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()]
       this.personalDetails.patchValue({ loc: this.loc })
       console.log(this.loc.coordinates + "sdhfghsdgdgsj")
       this.personalDetails.patchValue({ address: place.formatted_address })
     })
   }
   getCountryData(countrydata: any) {
    this.regionlist = []
    if(countrydata === null || countrydata === undefined){
      return;
    }
    //  console.log(countrydata + "sdfhdgsfhsdgjfgsj");
     this.sadminService.getRegionListByCountryId(countrydata).subscribe({
       next: (res) => {
         let result = this._coreService.decryptContext(res);
         const regionlist = result.body.list;
        //  console.log("result" + JSON.stringify(this.regionlist))
        regionlist.map((region)=>{
          this.regionlist.push(
            {
              label : region.name,
              value : region._id
            }
          )
         })
         this.personalDetails.get("region").patchValue(this.personalDetails.get('region').value)
         if(!this.personalDetails.get("region").value)
         {
          this.personalDetails.get("department").patchValue("")
          this.personalDetails.get("city").patchValue("")
          this.personalDetails.get("village").patchValue("")
          this.personalDetails.get("province").patchValue("")
         }
       },
       error: (err) => {
         console.log(err);
 
       }
     })
   }
 
   getRegionData(regiondata: any) {
    this.provincelist = []
    if(regiondata === null || regiondata === undefined){
      return;
    }
     this.sadminService.getProvinceListByRegionId(regiondata).subscribe({
       next: (res) => {
         let result = this._coreService.decryptContext(res);
         const provincelist = result.body.list;
         provincelist.map((province)=>{
          this.provincelist.push(
            {
              label : province.name,
              value : province._id
            }
          )
         })
         this.personalDetails.get("province").patchValue(this.personalDetails.get('province').value)
         if(!this.personalDetails.get("province").value)
         {
          this.personalDetails.get("department").patchValue("")
          this.personalDetails.get("city").patchValue("")
          this.personalDetails.get("village").patchValue("")
         }
         
       },
       error: (err) => {
         console.log(err);
 
       }
     })
   }
 
   getProvinceData(provincedata: any) {
    this.departmentlist = []
    if(provincedata === null || provincedata === undefined){
      return;
    }
     this.sadminService.getDepartmentListByProvinceId(provincedata).subscribe({
       next: (res) => {
         let result = this._coreService.decryptContext(res);
         const departmentlist = result.body.list;
         departmentlist.map((department)=>{
          this.departmentlist.push(
            {
              label : department.name,
              value : department._id
            }
          )
         })
         this.personalDetails.get("department").patchValue(this.personalDetails.get('department').value)
         if(!this.personalDetails.get("province").value)
         {
          this.personalDetails.get("city").patchValue("")
          this.personalDetails.get("village").patchValue("")
         }
       },
       error: (err) => {
         console.log(err);
 
       }
     })
   }
 
   getDepartmentData(departmentdata: any) {
    this.citylist = []
    this.villagelist = []
    if(departmentdata === null || departmentdata === undefined){
      return;
    }
     this.sadminService.getCityListByDepartmentId(departmentdata).subscribe({
       next: (res) => {
         let result = this._coreService.decryptContext(res);
         const citylist = result.body.list;
         citylist.map((city)=>{
          this.citylist.push(
            {
              label : city.name,
              value : city._id
            }
          )
         })
         this.personalDetails.get("city").patchValue(this.personalDetails.get('city').value)
       },
       error: (err) => {
         console.log(err);
 
       }
     })
     this.sadminService.getVillageListByDepartmentId(departmentdata).subscribe({
       next: (res) => {
         let result = this._coreService.decryptContext(res);
         const villagelist = result.body.list;
         villagelist.map((village)=>{
          this.villagelist.push(
            {
              label : village.name,
              value : village._id
            }
          )
         })
         this.personalDetails.get("village").patchValue(this.personalDetails.get('village').value)
       },
       error: (err) => {
         console.log(err);
 
       }
     })
   }
 

}
