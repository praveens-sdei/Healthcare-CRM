import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { IEncryptedResponse } from 'src/app/shared/classes/api-response';
import { PharmacyStaffResponse } from '../addstaff/addstaff.component.type';
import { FormBuilder, FormGroup,Validators ,AbstractControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import intlTelInput from 'intl-tel-input';
import { NgxUiLoaderService } from 'ngx-ui-loader';
export interface PeriodicElement {
  staffname: string;
  role: string;
  phone: string;
  datejoined: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // { staffname: '', role: '', phone: '', datejoined: '' },
];

@Component({
  selector: 'app-viewstaff',
  templateUrl: './viewstaff.component.html',
  styleUrls: ['./viewstaff.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewstaffComponent implements OnInit {

  displayedColumns: string[] = ['staffname', 'role', 'phone', 'datejoined', 'active', 'lockuser', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('countryPhone') countryPhone: ElementRef<HTMLInputElement>;

  dataSource = ELEMENT_DATA;
  userID: string = ''
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  staffID: string = ''
  action: string = '';
  actionObject: object = null;
  staffRole: any[]= [];
  isSubmitted: boolean = false;
  selectedFiles: any = '';
  staff_name: any = '';
  role: string = 'all';
  editStaff: any;
  iti: any;
  selectedCountryCode: string;
  groupID: any;
  profileIcon: any = '/assets/img/create_profile.png'
  staffProfileUrl: any;
  teamInitial: any = ""
  filterForm: any = FormGroup
  searchText: any = '';
  countrycodedb: any;
  loc: any = {};
  selectedLanguages:any =[];

  sortColumn: string = 'staff_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  userPermission: any;
  innerMenuPremission: any = [];
  locationData : any = {};
  
  constructor(
    private modalService: NgbModal,
    private _pharmacyService: PharmacyService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _superAdminService: SuperAdminService,
    private loader: NgxUiLoaderService
  ) {

    this.filterForm = this.fb.group({
      searchtext: [""],
      role: [""]
    })
    this.editStaff = this.fb.group({
      staff_profile: [""],
      staff_name: [""],
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
      role: ["", [Validators.required]],
      about: [""],
      staff_createdby: [""],
      doj:[new Date()]
    })
    const userData = this._coreService.getLocalStorage('loginData')
    this.userPermission = this._coreService.getLocalStorage("loginData").permissions;

    this.userID = userData._id
    this.userRole = userData?.role
    this.getAllRole()
    // this.getAllStaff()
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllStaff(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.staffID = id;
    this.getAllStaff(`${this.sortColumn}:${this.sortOrder}`)
    this.getCountryList();
    this.getSpokenLanguage();
    this.handleSearchFilter()

    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);  
  }

  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){ 
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("health_plan")) {
          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;  
          console.log(`exist in the object.`);
        } else {
          console.log(`does not exist in the object.`);
        }
      }else{
        var checkSubmenu = checkData.submenu;
        let innerMenu = [];
        for (let key in checkSubmenu) {
          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }
        this.innerMenuPremission = innerMenu;
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }

  giveInnerPermission(value){   
    if(this.userRole === "PHARMACY_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }






  /*
code for country code starts
*/
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
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
  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }

  /*
    code for country code ends
    */

  public selectFile(file: any) {
    this.selectedFiles = file.target.files[0]
  }

  public handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.editStaff.reset()
    this.staffID = '';
  }

  private getAllRole() {
    let param = {
      userId: this.userID,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this._pharmacyService.allRoles(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      if (result?.status) {
        const staffRole = result?.body?.data
        staffRole.map((role)=>{
         this.staffRole.push(
          {
            label : role.name,
            value : role._id
          }
         )
        })
      }
    })
  }

  //  New Invitation modal
  openVerticallyCenterededitstaff(editstaffcontent: any, id: any) {
    this.staffID = id
    this.modalService.open(editstaffcontent, { centered: true, size: 'xl', windowClass: "edit_staffnew" });
    this.getSpecificStaffDetails(id);
  }

  getSpecificStaffDetails(id) {
    // throw new Error('Method not implemented.');
    try {
      let userId = id
      this._pharmacyService.getStaffDetails(id).subscribe((result: any) => {
        // this.countryCode()
        const staffDetails = this._coreService.decryptObjectData(result);
        console.log("staffDetailsstaffDetailsstaffDetails", staffDetails.data)
        this.selectedLanguages = staffDetails.data.staffInfo[0].language;
        let details = staffDetails.data.staffInfo[0];
        const documentInfo = staffDetails?.data?.documentURL
        console.log("documentInfo", documentInfo)
        this.staffProfileUrl = documentInfo
        let address = details.in_location;
        this.locationData = {...address}
        let dateString = this.convertDate(details.dob)

        this.getRegionList(address?.nationality);
        this.getProvienceList(address?.region);
        this.getDepartmentList(address?.province);
        this.getCityList(address?.department);


        this.editStaff.controls["first_name"].setValue(details.first_name);
        this.editStaff.controls["middle_name"].setValue(details.middle_name);
        this.editStaff.controls["last_name"].setValue(details.last_name);

        this.editStaff.controls["dob"].setValue(dateString);
        this.editStaff.controls["language"].setValue(details.language);
        this.editStaff.controls["address"].setValue(details.in_location.address);
        this.editStaff.controls["neighbourhood"].setValue(details.in_location.neighborhood);
        this.editStaff.controls["country"].setValue(address?.nationality);
        this.editStaff.controls["region"].setValue(address?.region);
        this.editStaff.controls["province"].setValue(address?.province);
        this.editStaff.controls["department"].setValue(address?.department);
        this.editStaff.controls["city"].setValue(address?.city);
        this.editStaff.controls["village"].setValue(address?.village);
        this.editStaff.controls["pincode"].setValue(details.in_location.pincode);
        this.editStaff.controls["degree"].setValue(details.degree);
        this.editStaff.controls["phone"].setValue(staffDetails.data.profileData[0].phone_number);
        this.editStaff.controls["email"].setValue(staffDetails.data.profileData[0].email);
        this.editStaff.controls["role"].setValue(details.role._id);
        this.editStaff.controls["about"].setValue(details.about);
        this.editStaff.controls["doj"].setValue(details?.doj);
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

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaff()
  }

  public submitAction() {
    this.loader.start();
    this._pharmacyService.deleteActiveAndLockStaff(this.actionObject).subscribe({
      next: (result: IEncryptedResponse<PharmacyStaffResponse>) => {
        const decryptedData = this._coreService.decryptObjectData(result)
        this.loader.stop();
        this.handleClose()
        this.getAllStaff()
        this._coreService.showSuccess("", `Successfully ${this.action} Pharmacy staff`);
        
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();
        console.log(err, 'err');
      },
    });
  }


  private getAllStaff(sort:any='') {
    this.isSubmitted = true
    const params = {
      admin_id: this.userID,
      page: this.page,
      limit: this.pageSize,
      role_id: this.filterForm.value.role ? this.filterForm.value.role : "",
      searchKey: this.filterForm.value.searchtext ? this.filterForm.value.searchtext : "",
      sort:sort
    }
    this._pharmacyService.getAllStaff(params).subscribe({
      next: (result: IEncryptedResponse<PharmacyStaffResponse>) => {
        const decryptedData = this._coreService.decryptObjectData(result)
        const data = []
        console.log(decryptedData, 'decryptedData');

        if (result) {
          for (const staff of decryptedData.data.data) {
            data.push({
              staffname: staff.staff_name,
              role: staff.role !== undefined ? staff.role.name : '',
              // phone: staff.for_portal_user.mobile, 
              phone: staff.for_portal_user.phone_number,

              datejoined: staff.doj,
              id: staff.for_portal_user._id,
              is_locked: staff.for_portal_user.lock_user,
              is_active: staff.for_portal_user.isActive,
              _id: staff.for_portal_user._id,
            })
          }
        }
        this.totalLength = decryptedData.data.totalCount
        this.dataSource = data;
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');

        this._coreService.showError("", "Staff Load Failed");

      },
    });
  }

  addStaff() {
    // [RouterLink]="['/pharmacy/staffmanagement/add']"
    // this.router
    if (this.staffRole.length < 1) {
      // this._coreService.showError("please add Role first", '')
      if(this.userRole == "PHARMACY_ADMIN"){
        this._coreService.showError("please add Role first", '');
      }else{
        this._coreService.showError("Please ask admin to add Role first", '');
      }
    } else {

      this.router.navigate(['/pharmacy/staffmanagement/add']);
    }

  }

  handleSearchFilter() {
    this.filterForm.valueChanges.subscribe((ele) => {
      console.log("sdffsf", this.filterForm.value)
      this.getAllStaff()
    })


    // this.staff_name = event.target.value
    // if (event.target.value) {
    //   this.getAllStaff()
    // }
  }

  handleFilter() {
    this.getAllStaff()
  }

  clearAll() {
    this.filterForm.reset()
    this.getAllStaff()
  }

  public onSubmit() {
    this.isSubmitted = true;
    if (this.editStaff.invalid) {
      const firstInvalidField = document.querySelector(
        'input.ng-invalid, input.ng-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth' });
      }
      this._coreService.showError("","Please fill all required fields." )
      const invalid = [];
      const controls = this.editStaff.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      return;      
    }
    this.loader.start();
    const values = this.editStaff.value
    console.log(values, "checking values");
    const formaData = new FormData();
    formaData.append("staff_profile", values.staff_profile)
    formaData.append("staff_name", values.first_name + " " + values.middle_name + " " + values.last_name)
    formaData.append("first_name", values.first_name)
    formaData.append("middle_name", values.middle_name)
    formaData.append("last_name", values.last_name)
    formaData.append("dob", values.dob)
    formaData.append("language", JSON.stringify(this.selectedLanguages));
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
    formaData.append("email", values.email.toLowerCase())
    formaData.append("role", values.role)
    formaData.append("about", values.about)
    formaData.append("staff", values.staff)
    formaData.append("id", this.staffID),
    formaData.append("userId", this.userID);
    formaData.append("country_code", this.selectedCountryCode);
    formaData.append("doj", values?.doj)

    formaData.forEach((key, value) => {
      console.log(key, "-->");
      console.log(value, "-->");


    })

    this._pharmacyService.editStaff(formaData).subscribe({
      next: (result: IEncryptedResponse<PharmacyStaffResponse>) => {
        let decryptedResult = this._coreService.decryptObjectData(result);
        this._coreService.showSuccess("", "Staff updated successfully");
        this.handleClose()
        this.getAllStaff()
        this.loader.stop();
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');
        this.loader.stop();

        this._coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
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
        console.log("Image", this.profileIcon);

      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
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

  //...............delete.............
  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleDeleteGroup(actionValue: boolean, action: any) {
    this.loader.start();

    let reqData = {
      action: action,
      actionValue: actionValue,
      id: this.groupID,
    };

    this._pharmacyService.deleteActiveAndLockStaff(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.toastr.success(response.message);
        this.loader.stop();
        this.getAllStaff();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleToggeleChange(event: any, groupID: any) {
    this.groupID = groupID;
    this.handleDeleteGroup(event.checked, "lock");
  }

  handleCheckBoxChange(event: any, groupID: any) {
    this.groupID = groupID;
    this.handleDeleteGroup(event.checked, "active");
  }

  public openActionPopup(actionPopup: any, id: any, action: string, event: any = null) {
    let status: string;
    if (action === 'delete') {
      this.actionObject = {
        action_name: action,
        action_value: true,
        staff_id: id
      }
    } else {
      let child = event.target.firstChild
      let checked: boolean
      if (action === 'active' || action === 'inactive') {
        status = !child.checked ? 'active' : 'inactive'
        checked = !child.checked
      } else if (action === 'lock' || action === 'unlock') {
        if (child) {
          status = !child.checked ? 'lock' : 'unlock'
          checked = !child.checked
        } else {
          status = !event.target.parentElement.parentElement.children[0].checked ? 'lock' : 'unlock'
          checked = !event.target.parentElement.parentElement.children[0].checked
        }
      }
      this.actionObject = {
        action_name: action === 'active' || action === 'inactive' ? 'active' : action,
        action_value: checked,
        staff_id: id
      }
    }
    this.staffID = id
    this.action = status ? status : action
    this.modalService.open(actionPopup, { centered: true, size: 'lg' });
  }

  //-----Calling address API's---------------
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = []
  overlay:false;

  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
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





  getCountryList() {

    this._pharmacyService.getcountrylist().subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
    if (countryID === null) {
      return;
    }
    this._pharmacyService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
        this.editStaff.get("region").patchValue(this.locationData?.region)
        if(!this.editStaff.get("region").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          this.editStaff.get("province").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    this.provienceList = []
    if (!regionID) {
      return;
    }
    this._pharmacyService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
        
        this.editStaff.get("province").patchValue(this.locationData.province)
        if(!this.editStaff.get("province").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.departmentList = []
    if (!provinceID) {
      return;
    }
    this._pharmacyService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
        this.editStaff.get("department").patchValue(this.locationData.department)
        if(!this.editStaff.get("department").value){
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.cityList = [];
    this.villageList = [];
      if (!departmentID) {
      return;
    }
    this._pharmacyService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
        this.editStaff.get("city").patchValue(this.locationData.city)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._pharmacyService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
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
        this.editStaff.get("village").patchValue(this.locationData.village)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removeSelectpic() {
    this.staffProfileUrl = ""
  }

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
    console.log(this.selectedLanguages,"selectedLanguages_____");
  }

  handleDOCChange() {
    new Date(this.editStaff.controls['doj'].value)
}
}