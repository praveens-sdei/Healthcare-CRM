import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import Validation from "src/app/utility/validation";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IEncryptedResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../../insurance.service';
import { IInsuranceStaffResponse } from '../addstaff/insurance-add-staff.type';
import intlTelInput from 'intl-tel-input';
import { threadId } from 'worker_threads';
import { Router } from '@angular/router';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';


export interface PeriodicElement {
  staffname: string;
  username: string;
  role: string;
  phone: string;
  datejoined: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { staffname: '', username: '', role: '', phone: '', datejoined: '' },
];

@Component({
  selector: 'app-viewstaff',
  templateUrl: './viewstaff.component.html',
  styleUrls: ['./viewstaff.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewstaffComponent implements OnInit {
  overlay: false;
  displayedColumns: string[] = ['datejoined', 'staffname', 'role', 'phone', 'active', 'lockuser', 'action'];
  dataSource = ELEMENT_DATA;
  editStaff: FormGroup;
  userID: string = ''
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  staffID: string = ''
  action: string = '';
  actionObject: object = null;
  staffRole: any[] = [];
  isSubmitted: boolean = false;
  selectedFiles: any = '';
  iti: any;
  selectedCountryCode: any;
  staff_name: any = '';
  role: string = 'all';
  countrycodedb: any = '';
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  locationData: any;
  spokenLanguages: any[] = [];
  country: any = "";
  region: any = "";
  province: any = "";
  department: any = "";
  city: any = "";
  village: any = "";
  specialitySelceted: any;
  loc: any = {};
  innerMenuPremission: any = [];
  staffLocationData : any = {}

  // @ViewChild("mobile") mobile: ElementRef<HTMLInputElement>;
  // @ViewChild('mobile', { static: true }) mobile: ElementRef;
  autoComplete: google.maps.places.Autocomplete;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  spokenlang: boolean;
  id: any;
  langId: any;
  selectedRole: any;
  searchText: any = '';
  selectedLanguage: any;
  profile_pic: any;
  filterForm: any = FormGroup;
  selectedLanguages: any = [];


  sortColumn: string = 'staff_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  selectedRoles: any;
  userRole: any;
  userPermission: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private route: Router,
    private _superAdminService: SuperAdminService,
    private loader: NgxUiLoaderService

  ) {
    this.filterForm = this.fb.group({
      searchtext: [""],
      role: [""]
    })
    this.editStaff = this.fb.group(
      {
        staff_profile: [""],
        staff_name: [""],
        first_name: ["", [Validators.required]],
        middle_name: [""],
        last_name: ["", [Validators.required]],
        dob: ["", [Validators.required]],
        // language: [""],
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
        mobile: ["", [Validators.required]],
        email: ["", [Validators.required]],
        role: ["", [Validators.required]],
        userName: [""],
        aboutStaff: [""],
        doj:[new Date()]
      },
      { validators: [Validation.match("password", "confirmPassword")] }
    );
    const userData = this._coreService.getLocalStorage('loginData')
    this.userPermission = this._coreService.getLocalStorage("loginData").permissions;
    this.userID = userData._id;
    this.userRole =userData?.role;

    this.getAllRole()
    this.getAllStaff(`${this.sortColumn}:${this.sortOrder}`)

  }
  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAllStaff(`${column}:${this.sortOrder}`);
  }


  getAllRole() {
    let reqData = {
      page: 1,
      limit: 0,
      searchText: "",
      userId: this.userID,
    }

    this._insuranceService.allRoles(reqData).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });

      if (result.status == true) {

        result?.body?.data.map((curentval, index: any) => {

          if (this.staffRole.indexOf({
            label: curentval?.name,
            value: curentval?._id,
          }) == -1) {
            this.staffRole.push({
              label: curentval?.name,
              value: curentval?._id,
            });
          }

        });


      }
    });
  }
  addroleMsg() {
    if (this.staffRole.length < 1) {
      if(this.userRole == "INSURANCE_ADMIN"){
        this._coreService.showError("please add Role first", '');
      }else{
        this._coreService.showError("Please ask admin to add Role first", '');
      }
    } else {

      this.route.navigate(['/insurance/staffmanagement/add']);
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
  private getSpecifiStaffDetails() {
    this._insuranceService.getStaffDetails(this.staffID).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {


        const staffDetailsResult = this._coreService.decryptObjectData(result)

        const staffDetails = staffDetailsResult?.body?.staffData
        this.staffLocationData = staffDetails?.in_location
        console.log(this.staffLocationData , "gggggggg");
        
        this.selectedRoles = staffDetails.role.map(role => role._id);


        // this.selectedLanguages = staffDetails.language;

        this.profile_pic = staffDetailsResult?.body?.documentURL;

        this.getCountryList(staffDetails?.in_location?.country);
        this.getRegionList(staffDetails?.in_location?.country, staffDetails?.in_location?.region);
        this.getProvienceList(staffDetails?.in_location?.region, staffDetails?.in_location?.province);
        this.getDepartmentList(staffDetails?.in_location?.province, staffDetails?.in_location?.department);
        this.getCityList(staffDetails?.in_location?.department, staffDetails?.in_location?.city, staffDetails?.in_location?.village);
        // this.getSpokenLanguage();
        this.getAllRole();
        let dateString = this.convertDate(staffDetails?.dob)
        this.editStaff.controls['first_name'].setValue(staffDetails?.first_name)
        this.editStaff.controls['middle_name'].setValue(staffDetails?.middle_name)
        this.editStaff.controls['last_name'].setValue(staffDetails?.last_name)
        this.editStaff.controls['dob'].setValue(dateString)
        // this.editStaff.controls['language'].setValue(staffDetails?.language)
        this.editStaff.controls['address'].setValue(staffDetails?.in_location?.address)
        this.editStaff.controls['neighbourhood'].setValue(staffDetails?.in_location?.neighborhood)
        this.editStaff.controls['country'].setValue(staffDetails?.in_location?.country)
        this.editStaff.controls['region'].setValue(staffDetails?.in_location?.region)
        this.editStaff.controls['province'].setValue(staffDetails?.in_location?.province)
        this.editStaff.controls['department'].setValue(staffDetails?.in_location?.department)
        this.editStaff.controls['city'].setValue(staffDetails?.in_location?.city)
        this.editStaff.controls['village'].setValue(staffDetails?.in_location?.village)
        this.editStaff.controls['pincode'].setValue(staffDetails?.in_location?.pincode)
        this.editStaff.controls['degree'].setValue(staffDetails?.degree)
        this.editStaff.controls['mobile'].setValue(staffDetails?.for_portal_user?.mobile)
        this.editStaff.controls['email'].setValue(staffDetails?.for_portal_user?.email)
        this.editStaff.controls['role'].setValue(this.selectedRoles)
        this.editStaff.controls['doj'].setValue(staffDetails?.doj)
        // this.selectedLanguage = staffDetails?.language;


        // this.selectedRoles = staffDetails?.role

        // this.editStaff.controls['userName'].setValue(staffDetails?.for_portal_user?.user_name)
        this.editStaff.controls['aboutStaff'].setValue(staffDetails?.about)
        this.countrycodedb = staffDetails?.for_portal_user?.country_code;
        this.getCountrycodeintlTelInput();
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');
      },
    });
  }
  staffIcon: any = null
  selectFile(event: any) {
    let file = event.target.files[0];
    console.log("file", file);

    const formData: FormData = new FormData();

    formData.append(
      "userId", this.userID

    );
    formData.append("docType", 'staff_profile');
    formData.append("multiple", "false");
    formData.append("docName", file);
    this.selectedFiles = formData;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profile_pic = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
    this.uploadDocuments(this.selectedFiles);
  }
  keyURL: any = "";
  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._insuranceService.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData({ data: res });
          resolve(response);
          console.log("response", response);

          this.keyURL = response.data[0].key;
          console.log("this.keyURL", this.keyURL);

        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this._coreService.showError(errResponse.messgae, "");
        }
      );
    });
  }
  handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.staffID = "";
    this.role = 'all'
    this.getAllStaff();
  }

  //  New Invitation modal
  openVerticallyCenterededitstaff(editstaffcontent: any, id: any) {
    this.staffID = id
    this.modalService.open(editstaffcontent, { centered: true, size: 'xl', windowClass: "edit_staffnew" });
    this.getSpecifiStaffDetails();
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

  ngOnInit(): void {
    this.handleSearchFilter()      

    setTimeout(() => {

      this.checkInnerPermission();
    }, 300);   

  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){   
console.log("Check");

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;        

        if (checkSubmenu.hasOwnProperty("health_plan")) {

          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;
          
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
      }      
      
    }   
    

  }

  giveInnerPermission(value){   
    if(this.userRole == "INSURANCE_ADMIN"){
      return true;
    }else{
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }     
 
  }

  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  }
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
  ngAfterViewInit() {


  }
  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaff()
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

  public submitAction() {
    this._insuranceService.deleteActiveAndLockStaff(this.actionObject).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
        const decryptedData = this._coreService.decryptObjectData(result)
        this.handleClose()
        // this.getAllStaff()
        this._coreService.showSuccess("", `Successfully ${this.action} insurance staff`);
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');

        // this._coreService.showError("", "Staff Load Failed");
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  getAllStaff(sort: any = '') {
    // this.isSubmitted = true
    const params = {
      admin_id: this.userID,
      page: this.page,
      limit: this.pageSize,
      role_id: this.filterForm.value.role ? this.filterForm.value.role : "",
      searchKey: this.filterForm.value.searchtext ? this.filterForm.value.searchtext : "",
      staff_name: this.staff_name,
      sort: sort
    }

    this._insuranceService.getAllStafforStaffmanagement(params).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
        // console.log("Vikas", result);

        const decryptedData = this._coreService.decryptObjectData({ data: result })

        const data = []
        for (const staff of decryptedData?.data?.data) {
          const roleNames = staff.roles.map(role => role.name).join(', ');

          data.push({
            staffname: staff.staff_name,
            username: staff.for_portal_user.user_name,
            role: roleNames,
            phone: staff.for_portal_user.phone_number,
            datejoined: this._coreService.createDate(new Date(staff.doj)),
            id: staff.for_portal_user._id,
            is_locked: staff?.for_portal_user?.lock_user,
            is_active: staff?.for_portal_user?.isActive
          })
        }
        this.totalLength = decryptedData?.data?.totalCount
        this.dataSource = data;

        // this._coreService.showSuccess("", "Staff loaded successfully");
      },
      error: (err: ErrorEvent) => {
        console.log(err, 'err');

        this._coreService.showError("", "Staff Load Failed");
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  handleRoleFilter(event: any) {
    console.log("Pranali-2", event.value);
    if (event.value != undefined) {

      this.role = event.value;
      console.log("handlePage-2", this.role);
      this.getAllStaff();
    }

  }

  handleRoleFilterstaff(event: any) {
    this.role = event.value;
    // this.getAllStaff();
  }

  handleSearchFilter() {
    this.filterForm.valueChanges.subscribe((ele) => {
      console.log("sdffsf", this.filterForm.value)
      this.getAllStaff()
    })
    // console.log("handlePage-3", event.target.value);
    // this.staff_name = event.target.value
    // this.getAllStaff();

  }


  public onSubmit() {
    this.isSubmitted = true;
    if (this.editStaff.invalid) {
      console.log("invalid")
      this._coreService.showError("", "Form Invalid")
      return;
    }
    this.loader.start();
    if (this.editStaff.valid) {
      const values = this.editStaff.value
      console.log("Editform", values.staff_profile);
      // return
      const formaData = new FormData();
      formaData.append("staff_profile", this.keyURL)
      formaData.append("staff_name", values.first_name + " " + values.middle_name + " " + values.last_name)
      formaData.append("first_name", values.first_name)
      formaData.append("middle_name", values.middle_name)
      formaData.append("last_name", values.last_name)
      formaData.append("dob", values.dob)
      // formaData.append("language", JSON.stringify(this.selectedLanguages))
      formaData.append("address", values.address),
        formaData.append("loc", this.loc)
      formaData.append("neighbourhood", values.neighbourhood)
      formaData.append("country", values.country ? values.country : "")
      formaData.append("region", values.region ? values.region : "")
      formaData.append("province", values.province ? values.province : "")
      formaData.append("department", values.department ? values.department : "")
      formaData.append("city", values.city ? values.city : "")
      formaData.append("village", values.village ? values.village : "")
      formaData.append("pincode", values.pincode)
      formaData.append("degree", values.degree)
      formaData.append("phone", values.mobile)
      formaData.append("email", values.email.toLowerCase())
      formaData.append("role", JSON.stringify(this.selectedRoles))
      formaData.append("userName", "XYZ")
      formaData.append("aboutStaff", values.aboutStaff)
      formaData.append("id", this.staffID)
      formaData.append("country_code", this.selectedCountryCode)
      formaData.forEach((key, value) => {
        console.log(key, "-->");
        console.log(value, "-->");


      })

      this._insuranceService.editStaff(formaData).subscribe({
        next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
          const decryptedResult = this._coreService.decryptObjectData(result)

          console.log(decryptedResult, 'decryptedResult');
          if(decryptedResult.status == true){
            this.loader.stop();
          this._coreService.showSuccess("",decryptedResult.message);

            this.getSpecifiStaffDetails()
            this.handleClose()
          } else{
            this.loader.stop();

          this._coreService.showError("",decryptedResult.message);

          }
    
        },
        error: (err: ErrorEvent) => {
          console.log(err, 'err');

          this._coreService.showError("", err.message);
          if (err.message === "INTERNAL_SERVER_ERROR") {
            this.loader.stop();
            this._coreService.showError("", err.message);
          }
        },
      });
    }
  }

  getCountryList(country_id = '') {
    this._superAdminService.getcountrylist().subscribe({
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
        this.editStaff.get("country").patchValue(this.staffLocationData.country)
        
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
    this.regionList = []
    if (!countryID) {
      return;
    }
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
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
        this.editStaff.get("region").patchValue(this.staffLocationData?.region)
        if(!this.editStaff.get("region").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          this.editStaff.get("province").patchValue("")
          }
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
    this.provienceList = []
    if (!regionID) {
      return;
    }
    this._superAdminService.getProvinceListByRegionId(regionID).subscribe({
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
        
        this.editStaff.get("province").patchValue(this.staffLocationData.province)
        if(!this.editStaff.get("province").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
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
    this.departmentList = []
    if (!provinceID) {
      return;
    }
    this._superAdminService.getDepartmentListByProvinceId(provinceID).subscribe({
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
        this.editStaff.get("department").patchValue(this.staffLocationData.department)
        if(!this.editStaff.get("department").value){
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
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
    this.cityList = []
    this.villageList = []
    if (!departmentID) {
      return;
    }
    this._superAdminService.getCityListByDepartmentId(departmentID).subscribe({
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
        this.editStaff.get("city").patchValue(this.staffLocationData.city)
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
        this.editStaff.get("village").patchValue(this.staffLocationData.village)
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

  getLangId(event: any) {
    console.log(event, "event");

    this.langId = event?.value;
    if (this.id) {
      this.spokenlang = true;
    }

  }
  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log(" this.spokenLanguages", response?.body);
      // this.spokenLanguages=response.body?.spokenLanguage;
      const arr = response.body?.spokenLanguage;

      arr.map((curentval: any) => {
        this.spokenLanguages.push({
          label: curentval?.label,
          value: curentval?.value,
        });
      });
      // console.log(" this.spokenLanguages", this.spokenLanguages);
    });
  }
  clearAll() {
    this.filterForm.reset()
    this.role = 'all'
    this.getAllStaff();
  }
  handleRemoveLogo() {
    this.profile_pic = ""
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
    console.log(this.selectedLanguages, 'selectedLanguages__');

  }

  onSelectionChangeRole(event: any): void {
    this.selectedRoles = this.editStaff.value.role;
    console.log(this.selectedRoles, "selectedRoles");

  }
  handleDOCChange() {
    new Date(this.editStaff.controls['doj'].value)
  }
}