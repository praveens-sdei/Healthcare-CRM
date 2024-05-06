import { SuperAdminService } from "./../../super-admin.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import Validation from "src/app/utility/validation";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatCheckboxChange } from "@angular/material/checkbox";
import intlTelInput from "intl-tel-input";
import * as moment from "moment";
import { format } from "path";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-associationgroupedit",
  templateUrl: "./associationgroupedit.component.html",
  styleUrls: ["./associationgroupedit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssociationgroupeditComponent implements OnInit {
  groupID: any;
  groupData: any;
  associationForm: any = FormGroup;
  isSubmitted: any;
  groupIcon: any;
  adminId: any;
  searchText: any = "";
  pharmacyList: any[] = [];
  relatedPharmacy: any[] = [];
  selectedPharmacy: any[] = [];
  association_group_selected_pharmacy: any; //coma seperated
  iti: any;
  selectedCountryCode: any;
  selectedLanguages:any = [];
  overlay:false;
  locationData : any = {};
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private sadminService: SuperAdminService,
    private loader: NgxUiLoaderService
  ) {
    this.associationForm = this.fb.group({
      group_name: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      language: ["", [Validators.required]],
      mobile_phone: [
        "",
        [Validators.required,/*  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$") */],
      ],
      additional_phone: [""],
      address: ["", [Validators.required]],
      neighborhood: ["", [Validators.required]],
      country: ["", [Validators.required]],
      region: [""],
      province: [""],
      department: [""],
      city: [""],
      village: [""],
      pincode: [""],
      // password: [
      //   null,
      //   Validators.compose([
      //     // check whether the entered password has a number
      //     Validation.patternValidator(/\d/, {
      //       hasNumber: true,
      //     }),
      //     // check whether the entered password has upper case letter
      //     Validation.patternValidator(/[A-Z]/, {
      //       hasCapitalCase: true,
      //     }),
      //     // check whether the entered password has a lower case letter
      //     Validation.patternValidator(/[a-z]/, {
      //       hasSmallCase: true,
      //     }),
      //     // check whether the entered password has a special character
      //     Validation.patternValidator(
      //       /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      //       {
      //         hasSpecialCharacters: true,
      //       }
      //     ),
      //     Validators.minLength(8),
      //   ]),
      // ],
      // confirm_password: [""],
      association_group_type: ["", [Validators.required]],
      about_group: [""],
      group_slogan: [""],
      license_number: [""],
      license_expiry: new FormControl(""),
      license_card_id_proof: [""],
      association_group_icon: [""],
      bank_name: [""],
      bank_account_holder_name: [""],
      bank_account_number: [""],
      bank_ifsc_code: [""],
      bank_address: [""],
      mobilepay_provider_name: [""],
      mobilepay_number: [
        ""
      ],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.groupID = id;
    let loginUser = this._coreService.getLocalStorage("loginData");
    this.adminId = loginUser._id;
    this.viewAssociationGroup();
    this.listAllPharmacy();
    this.getCountryList();
    this.getSpokenLanguage();
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
  
  ngAfterViewInit() {
    const input = this.phone.nativeElement;
    this.iti = intlTelInput(input, {
      initialCountry: "in",
      separateDialCode: true,
    });
    this.selectedCountryCode = "+" + this.iti.getSelectedCountryData().dialCode;
  }

  listAllPharmacy() {
    this.service.listPharmacy(this.searchText).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
    //  console.log(response);
      
      this.pharmacyList = response?.body;
    });
  }

  
  viewAssociationGroup() {
    this.service.viewAssociationGroup(this.groupID).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      
      console.log(response,'viewAssociationGroup resposne');
      
      this.groupData = response.data[0];
      console.log('viewAssociationGroup__',this.groupData);
      this.locationData = response.data[0]?.location_id
      this.selectedLanguages = this.groupData.language;
      console.log('selectedLanguages__',this.selectedLanguages);

      this.relatedPharmacy = response.data[1]?.pharmacy_details;
      console.log('relatedPharmacy',response.data[1]);
      console.log(response.data[0]);
      this.groupIcon = response?.data[0]?.association_group_icon?.url;

      let expiryDate = moment(this.groupData?.license_expiry).format(
        "MM/DD/YYYY"
      );
      console.log(expiryDate);
      let address = response.data[0].location_id;
      console.log(address,"addressssss___");
      
      this.getRegionList(address?.country?._id);
      this.getProvienceList(address?.region?._id);
      this.getDepartmentList(address?.province?._id);
      this.getCityList(address?.department?._id);
      this.associationForm.controls["language"].setValue(this.groupData?.language);

      this.associationForm.patchValue({
        group_name: this.groupData?.superadmin_id?.fullName,
        mobile_phone: this.groupData?.superadmin_id?.mobile,
        email:this.groupData?.superadmin_id?.email,
        ...this.groupData,
        ...this.groupData?.association_id,
        ...this.groupData?.bank_details_id,
        address: address?.address,
        neighborhood: (address?.neighborhood)?address?.neighborhood:'',
        country:( address?.country?._id)? address?.country?._id:'',
        region: (address?.region?._id)?address?.region?._id:'',
        province: (address?.province?._id)?address?.province?._id:'',
        department: (address?.department?._id)?address?.department?._id:'',
        city: (address?.city?._id)?address?.city?._id:'',
        village: (address?.village?._id)?address?.village?._id:'',
        pincode: (address?.pincode)?address?.pincode:'',
        license_expiry: expiryDate?expiryDate:'',
      });
      console.log("------>", this.associationForm.value);

      this.selectedCountryCode = response.data[0].superadmin_id?.country_code;

      for (let pharmacy of this.relatedPharmacy) {
        console.log(pharmacy,'pharmacy');
        
        this.selectedPharmacy.push(pharmacy?.portal_user_id);
      }
      this.association_group_selected_pharmacy = this.selectedPharmacy.join(',')
    });
  }

  updateAssociationGroup() {
    if (this.selectedPharmacy.length < 1) {
      this.toastr.error("Please select pharmacy");
      return;
    }
    this.loader.start();
    let formData: any = new FormData();
    let data = this.associationForm.value;
    console.log("TCL: AssociationgroupeditComponent -> updateAssociationGroup -> data", data)
    // return;
    formData.append("group_name", data.group_name);
    formData.append("license_card_id_proof", data.license_card_id_proof);
    formData.append("old_license_card_id_proof", "");
    formData.append("association_group_icon", data.association_group_icon);
    formData.append("old_association_group_icon", "");
    formData.append("email", data.email);
    formData.append("language", JSON.stringify(this.selectedLanguages));
    formData.append("mobile_phone", data.mobile_phone);
    formData.append("additional_phone", data.additional_phone);
    formData.append("address", data.address);
    formData.append("neighborhood", data.neighborhood);
    formData.append("country", data.country);
    formData.append("region", data.region);
    formData.append("province", data.province);
    formData.append("department", data.department);
    formData.append("city", data.city);
    formData.append("village", data.village);
    formData.append("pincode", data.pincode);
    // formData.append("password", data.password);
    formData.append("association_group_type", data.association_group_type);
    formData.append(
      "association_group_data",
      this.association_group_selected_pharmacy
    );
    formData.append("about_group", data.about_group);
    formData.append("group_slogan", data.group_slogan);
    formData.append("license_number", data.license_number);
    formData.append("license_expiry", data.license_expiry);
    formData.append("bank_name", data.bank_name);
    formData.append("bank_account_holder_name", data.bank_account_holder_name);
    formData.append("bank_account_number", data.bank_account_number);
    formData.append("bank_ifsc_code", data.bank_ifsc_code);
    formData.append("bank_address", data.bank_address);
    formData.append("mobilepay_provider_name", data.mobilepay_provider_name);
    formData.append("mobilepay_number", data.mobilepay_number);
    formData.append("country_code", "+91");
    formData.append("id", this.groupID);
    formData.append("userId", this.adminId);

    console.log(this.association_group_selected_pharmacy,'association_group_selected_pharmacy');
    
    console.log(formData,'formData');
    // return;
    this.service.updateAsscociationGroup(formData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData(res);
        if (response.status) {
          this.loader.stop();
          this.toastr.success("updated");
          this.closePopup();
          this.router.navigate(["super-admin/associationgroup"]);
        } else {
          this.loader.stop();
          this.toastr.error("failed");
        }
      },
      (err) => {
        let response = this._coreService.decryptObjectData({ data: err.error });
        this.toastr.error(response.message);
        this.loader.stop();
      }
    );
  }

  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.associationForm.patchValue({
        association_group_icon: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.groupIcon = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFileChnage(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.associationForm.patchValue({
        license_card_id_proof: file,
      });
    }
  }

  get f() {
    return this.associationForm.controls;
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.listAllPharmacy();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    // this.selectedPharmacy.splice(0);

    // this.association_group_selected_pharmacy = null;

    // for (let pharmacy of this.relatedPharmacy) {
    //   this.selectedPharmacy.push(pharmacy?.for_portal_user);
    // }
  }

  openVerticallyCenteredaddpharmacy(editpharmacycontent: any) {
    // this.isSubmitted = true;
    // if (this.associationForm.invalid) {
    //   return;
    // }
    // this.isSubmitted = false;

    this.modalService.open(editpharmacycontent, {
      centered: true,
      windowClass: "edit_pharmacy",
    });
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  //-------------Pharmacy selection handling-------------
  toggle(item, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedPharmacy.push(item?.for_portal_user);
    } else {
      const index = this.selectedPharmacy.indexOf(item?.for_portal_user);
      if (index >= 0) {
        this.selectedPharmacy.splice(index, 1);
      }
    }
    this.association_group_selected_pharmacy = this.selectedPharmacy.join(",");
  }

  exists(id) {
    return this.selectedPharmacy.indexOf(id) > -1;
  }

  isIndeterminate() {
    return this.selectedPharmacy.length > 0 && !this.isChecked();
  }

  isChecked() {
    return this.selectedPharmacy.length === this.pharmacyList.length;
  }

  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      console.log(this.pharmacyList,'pharmacyList');
      
      this.pharmacyList.forEach((pharmacy) => {
        this.selectedPharmacy.push(pharmacy?.for_portal_user);
      });
    } else {
      this.selectedPharmacy.length = 0;
    }
    this.association_group_selected_pharmacy = this.selectedPharmacy.join(",");
  }

  //-----Calling address API's---------------
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];

  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // this.spokenLanguages = response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;
      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });  
      this.associationForm.patchValue({
        language: this.selectedLanguages
     });
    });
  }

  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        //this.countryList = result.body?.list;
        const countryList = result.body?.list;
        countryList.map((country)=>{
          this.countryList.push(
            {
              label :country.name,
              value :country._id
            }
          )
        })
        this.associationForm.get("country").patchValue(this.locationData.country._id)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    this.regionList = []
    if(countryID === undefined){
      return;
    }
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
       // this.regionList = result.body?.list;
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
        this.associationForm.get("region").patchValue(this.locationData?.region?._id)
        if(!this.associationForm.get("region").value){
          this.associationForm.get("department").patchValue("")
          this.associationForm.get("city").patchValue("")
          this.associationForm.get("village").patchValue("")
          this.associationForm.get("province").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    this.provienceList = []
    console.log("regionIDregionID",regionID);
    
    if(regionID === undefined){
      return;
    }
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        //this.provienceList = result.body?.list;
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
        this.associationForm.get("province").patchValue(this.locationData?.province?._id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if(provinceID === undefined){
      return;
    }
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        //this.departmentList = result.body?.list;
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
        this.associationForm.get("department").patchValue(this.locationData?.department?._id);
        if(!this.associationForm.get("department").value){
          this.associationForm.get("city").patchValue("")
          this.associationForm.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.cityList =[]
    this.villageList = []
    if(departmentID === undefined){
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
      //  this.cityList = result.body.list;
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
        this.associationForm.get("city").patchValue(this.locationData?.city?._id)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
       // this.villageList = result.body.list;
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
        this.associationForm.get("village").patchValue(this.locationData?.village?._id)

      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onSelectionChange(event: any): void {
    this.selectedLanguages = this.associationForm.value.language;
    console.log(this.selectedLanguages,"selectedLanguages_____");
  }

}
