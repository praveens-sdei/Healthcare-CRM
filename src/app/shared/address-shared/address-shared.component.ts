import {
  Component,
  ElementRef,
  Injectable,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { FormGroup } from "@angular/forms";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "../core.service";
import { invalid } from "moment";
@Injectable()
@Component({
  selector: "app-address-shared",
  templateUrl: "./address-shared.component.html",
  styleUrls: ["./address-shared.component.scss"],
})
export class AddressSharedComponent implements OnInit {
  // @Output() location = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() profileFields: FormGroup;
  countryList: any[] = [];
  regionlist: any[]= [];
  provincelist: any[] = [];
  departmentlist: any[] = [];
  citylist: any[]= [];
  villagelist: any[] = [];
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  @ViewChild("address") address!: ElementRef;
  patchCountry: any;
  @Input() isSubmit: boolean;
  regiondata : any  = "";
  provincedata : any = ""
  countrydata : any = ""
  departmentdata : any = ""
  constructor(
    private sadminService: SuperAdminService,
    private _coreService: CoreService
  ) {

   }

  ngOnInit(): void {
    this.regionlist= []
    this.countryList = [],
    this.departmentlist = [],
    this.provincelist = []
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        const countryList = result.body.list;
         countryList.map((country)=>{
          this.countryList.push({
            value : country._id,
            label : country.name,
          })
         })   

         console.log(this.profileFields);
         
         
         if (this.profileFields.value.location_info.nationality) {
          console.log("testtttttt");
         // this.getCountryData(this.profileFields.value.location_info.nationality);
          this.getRegionData(this.profileFields.value.location_info.region);
          this.getProvinceData(this.profileFields.value.location_info.province);
          this.getDepartmentData(this.profileFields.value.location_info.department);
          // this.regiondata = this.profileFields.value.location_info.region;
          // this.provincedata = this.profileFields.value.location_info.province;
          // this.countrydata = this.profileFields.value.location_info.nationality;
          // this.departmentdata = this.profileFields.value.location_info.department
          const locationInfoGroup = this.profileFields.get('location_info');
        locationInfoGroup.patchValue({
          nationality: this.profileFields.value.location_info.nationality,
        })
          
      }
        else
        {
          console.log("testtttttaaat");

          let data =   this.countryList.map((ele)=>{
            if(ele.label === "Burkina Faso"){
          console.log("testtttttaaat1");

              this.patchCountry = ele.value;
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
      },
    });
  }

  ngAfterViewInit() {
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
    this.autoComplete = new google.maps.places.Autocomplete(
      this.address.nativeElement,
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
      this.profileFields.patchValue({ loc: this.loc });
      console.log(this.loc + "sdhfghsdgdgsj");
      this.profileFields.patchValue({ address: place.formatted_address });
    });
  }
  getCountryData(countrydata: any) {
    this.regionlist = [];
    if (!countrydata) {
      return;
    }
    // console.log(countrydata + "sdfhdgsfhsdgjfgsj");
    this.sadminService.getRegionListByCountryId(countrydata).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        const regionlist = result.body.list;
        
        regionlist.map((region)=>{

          this.regionlist.push(
            {
              value : region._id,
              label : region.name
            }
          )
        })
        if(this.profileFields.get('location_info').valid){
          const locationInfoGroup = this.profileFields.get('location_info');
          locationInfoGroup.patchValue({
            region: this.profileFields.value.location_info.region,
          })
          if(!locationInfoGroup.get('region').value)
          {
            locationInfoGroup.patchValue({
              province: "",
              department : "",
              village : "",
              city : ""
            })
          }
        }
        
     
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionData(regiondata?: any) {
    this.provincelist = []
    if (!regiondata) {
      return;
    }
    this.sadminService.getProvinceListByRegionId(regiondata).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        const provincelist = result.body.list;

        provincelist.map((province)=>{

          this.provincelist.push(
            {
              value :province._id,
              label : province.name
            }
          )
        })
        const locationInfoGroup = this.profileFields.get('location_info');
        locationInfoGroup.patchValue({
          province: this.profileFields.value.location_info.province,
        })
        if(!locationInfoGroup.get('province').value)
        {
          locationInfoGroup.patchValue({
            department : "",
            village : "",
            city : ""
          })
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvinceData(provincedata?: any) {
    this.departmentlist = []
    if (!provincedata) {
      return;
    }
    this.sadminService.getDepartmentListByProvinceId(provincedata).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        const departmentlist = result.body.list;
        departmentlist.map((department)=>{
          this.departmentlist.push(
            {
              value  : department._id,
              label : department.name
            }
          )
        })
        const locationInfoGroup = this.profileFields.get('location_info');
        locationInfoGroup.patchValue({
          department: this.profileFields.value.location_info.department,
        })
        if(!locationInfoGroup.get('department').value)
        {
          locationInfoGroup.patchValue({
            village : "",
            city : ""
          })
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentData(departmentdata: any) {
    this.citylist = []
    this.villagelist = []
    console.log('getDepartmentData function called');
    if (!departmentdata) {
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentdata).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        const citylist = result.body.list;
        citylist.map((city)=>{
          this.citylist.push(
            {
              value  : city._id,
              label : city.name
            }
          )
        })
        const locationInfoGroup = this.profileFields.get('location_info');
        locationInfoGroup.patchValue({
          city: this.profileFields.value.location_info.city
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.sadminService.getVillageListByDepartmentId(departmentdata).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        const villagelist = result.body.list;
        villagelist.map((village)=>{
          this.villagelist.push(
            {
               value : village._id,
               label  : village.name
            }
          )
        })
        const locationInfoGroup = this.profileFields.get('location_info');
        locationInfoGroup.patchValue({
          village: this.profileFields.value.location_info.village
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
