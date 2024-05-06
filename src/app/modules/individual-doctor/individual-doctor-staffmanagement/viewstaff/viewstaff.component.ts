import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { SuperAdminStaffResponse } from "../addstaff/addstaff.component.type";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, AbstractControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import intlTelInput from "intl-tel-input";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  staffname: string;
  username: string;
  role: string;
  phone: string;
  datejoined: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
// declare var intlTelInput: any;
@Component({
  selector: "app-viewstaff",
  templateUrl: "./viewstaff.component.html",
  styleUrls: ["./viewstaff.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewstaffComponent implements OnInit {
  displayedColumns: string[] = [
    "dateofcreation",
    "staffname",

    "role",
    "phone",
    "datejoined",
    "active",
    "lockuser",
    "action",
  ];
  dataSource: any = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  editStaff: any = FormGroup;
  searchText: any = "";
  staff_profile: any = "";
  staffID: any;
  action: any;
  actionObject: any = {};
  pageSize: number = 10;
  totalLength: number = 0;
  page: any = 1;
  filterByrole: any = "";
  loginUserId: any = "";
  isSubmitted: boolean = false;

  overlay: false;
  selectedLanguages:any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  staff_profile_file: any = "";
  viewStaffSubscription: Subscription;
  roleSelceted: any;
  specialitySelceted: any;
  iti: any;
  selectedCountryCode: any;
  // @ViewChild("mobile") mobile: ElementRef<HTMLInputElement>;
  // @ViewChild('mobile', { static: true }) mobile: ElementRef;
  autoComplete: google.maps.places.Autocomplete;
  // @ViewChild("address") address!: ElementRef;

  loc: any = {};
  countrycodedb: any = 'BF';

  sortColumn: string = 'profileinfos.name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  innerMenuPremission:any=[];
  locationDetails : any = {};
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
  selectedSpecialities: any=[];
    getCountrycodeintlTelInput() {
    var country_code = '';
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

    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private fb: FormBuilder,
    private _individualDoctorService: IndiviualDoctorService,
    private _coreService: CoreService,
    private modalService: NgbModal,
    private _superAdminService: SuperAdminService,
    private route: Router,
    private elementRef: ElementRef,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userRole = userData?.role;
    let adminData =  this._coreService.getLocalStorage("adminData");

    if(this.userRole === "HOSPITAL_STAFF"){
      this.loginUserId = adminData?.for_doctor;
    }else if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF"){
      this.loginUserId = adminData?.in_hospital;
    }else{
      this.loginUserId = userData?._id;

    }
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
      mobile: ["", [Validators.required]],
      email: ["", [Validators.required]],
      role: ["", [Validators.required]],
      about_staff: [""],
      unit: [""],
      services: [""],
      staffDepartment: [""],
      specialty: [""],
      doj:[new Date()]
    });
    // this.getAllStaffData();
  }

  onSortData(column:any) {
    console.log("column============",column);
    
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllStaffData(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getAllStaffData(`${this.sortColumn}:${this.sortOrder}`);
    this.getAllRole();
    this.getSpokenLanguage();
    this.getCountryList();
    this.getSpecialty();

    // this.viewStaffSubscription = this._coreService.SharingCategory.subscribe((res) => {
    //   if (res != 'default') {
    //     this.getAllStaffData();
    //     this.getAllRole();
    //     this.getSpokenLanguage();
    //     this.getCountryList();
    //     this.getSpecialty();
    //   }
    // })
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

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
        console.log("this.innerMenuPremission_______________-",this.innerMenuPremission);
        
      }      
    }  
    

  }
  giveInnerPermission(value){
    if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF" || this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }

  
  }
  // ======================================for modal popup  =================================
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }
  public submitAction() {
    console.log("this.actionObject", this.actionObject);
    this.loader.start();
    this._individualDoctorService
      .deleteActiveAndLockStaff(this.actionObject)
      .subscribe({
        next: (result) => {
          const decryptedData = this._coreService.decryptObjectData({data:result});
          console.log("decryptedDatadecryptedData", decryptedData);
          if(decryptedData.status){
            this.loader.stop();
          this.handleClose();
          this.getAllStaffData();
          this._coreService.showSuccess(
            "",
            `Successfully ${this.action} individual_Doctor staff`
          );
        }
        },
        error: (err: ErrorEvent) => {
          this.loader.stop();
          console.log(err, "err");
        },
      });
  }
  public handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.staffID = "";
  }

  public openActionPopup(
    actionPopup: any,
    id: any,
    action: string,
    event: any = null
  ) {
    let status: string;
    if (action === "delete") {
      this.actionObject = {
        action_name: action,
        action_value: true,
        staff_id: id,
      };
    } else {
      let child = event.target.firstChild;
      let checked: boolean;
      if (action === "active" || action === "inactive") {
        status = !child.checked ? "active" : "inactive";
        checked = !child.checked;
      } else if (action === "lock" || action === "unlock") {
        if (child) {
          status = !child.checked ? "lock" : "unlock";
          checked = !child.checked;
        } else {
          status = !event.target.parentElement.parentElement.children[0].checked
            ? "lock"
            : "unlock";
          checked =
            !event.target.parentElement.parentElement.children[0].checked;
        }
      }
      this.actionObject = {
        action_name:
          action === "active" || action === "inactive" ? "active" : action,
        action_value: checked,
        staff_id: id,
      };
    }
    this.staffID = id;
    this.action = status ? status : action;
    this.modalService.open(actionPopup, { centered: true, size: "lg" });
  }
  // ============================for pagination ================================
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaffData();
  }

  // =========================search and fiter function ==========================
  handleSearchCategory(event: any, filter: any) {
    if(event.value != undefined){
      if (filter === "role") {
        console.log("role", event.value);
  
        this.filterByrole = event.value;
      } else {
        this.searchText = event.target.value;
  
        console.log("search", this.searchText);
      }
      this.getAllStaffData();
    }
   
  }

  handleSearch(event: any){
    this.searchText = event.target.value;
    this.getAllStaffData();

  }
  clearFilter() {
    this.searchText = "";
    this.filterByrole = "";
    this.getAllStaffData();
  }
  // ===================================all get  apis call=======================================
  getAllStaffData(sort:any='') {
    console.log("this.filterByrole=============",this.filterByrole);
    
    if(this.filterByrole!= undefined){
      const params = {
        hospitalId: this.loginUserId,
        page: this.page,
        limit: this.pageSize,
        searchText: this.searchText,
        role: this.filterByrole,
        sort:sort
      };
      console.log(params, 'getAllstaffData Request');
  
      this._individualDoctorService.getAllStaff(params).subscribe({
        next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
          const decryptedData = await this._coreService.decryptObjectData({
            data: result,
          });
          console.log("getAllStaff", decryptedData);
  
          const data = [];
          for (const staff of decryptedData.body[0].paginatedResults) {
            console.log("getAllStaff", staff.profileinfos);
            data.push({
              staffname: staff.profileinfos.name,
              role: staff.role !== undefined ? staff.roles.name : "",
              phone: staff.portalusers?.mobile,
              datejoined: this._coreService.createDate(new Date(staff.createdAt)),
              id: staff.portalusers._id,
              is_locked: staff.portalusers.lock_user,
              is_active: staff.portalusers.isActive,
              doj:staff?.doj,
              createdAt: staff?.portalusers.createdAt,
            });
          }
  
          console.log("getAllStaff data", data);
          this.totalLength = decryptedData.body[0].totalCount[0]?.count;
          this.dataSource = data;
          // this._coreService.showSuccess("", "Staff loaded successfully");
        },
        error: (err: ErrorEvent) => {
          console.log(err, "err");
  
          // this._coreService.showError("", "Staff Load Failed");
        },
      });
    }else{
      const params = {
        hospitalId: this.loginUserId,
        page: this.page,
        limit: this.pageSize,
        searchText: this.searchText,
        role: '',
        sort:sort
      };
      console.log(params, 'getAllstaffData Request');
  
      this._individualDoctorService.getAllStaff(params).subscribe({
        next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
          const decryptedData = await this._coreService.decryptObjectData({
            data: result,
          });
          console.log("getAllStaff", decryptedData);
  
          const data = [];
          for (const staff of decryptedData.body[0].paginatedResults) {
            console.log("getAllStaff", staff.profileinfos);
            data.push({
              staffname: staff.profileinfos.name,
              role: staff.role !== undefined ? staff.roles.name : "",
              phone: staff.portalusers?.mobile,
              datejoined: this._coreService.createDate(new Date(staff.createdAt)),
              id: staff.portalusers._id,
              is_locked: staff.portalusers.lock_user,
              is_active: staff.portalusers.isActive,
              doj:staff?.doj,
              createdAt: staff?.portalusers?.createdAt
            });
          }
  
          console.log("getAllStaff data", data);
          this.totalLength = decryptedData.body[0].totalCount[0]?.count;
          this.dataSource = data;
          // this._coreService.showSuccess("", "Staff loaded successfully");
        },
        error: (err: ErrorEvent) => {
          console.log(err, "err");
  
          // this._coreService.showError("", "Staff Load Failed");
        },
      });
    }
   
  }
  staffRole: any[] = [];
  getAllRole() {
    let param = {
      userId: this.loginUserId,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this._individualDoctorService.getAllRole(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      // this.staffRole = result.body;

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
      console.log("staff role ", result?.body, this.staffRole);
    });
  }
  //-----Calling address API's---------------
  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];
  staffRoleList: any[] = [];
  unitList: any[] = [];
  staffDepartmentList: any[] = [];
  serviceList: any[] = [];
  specialtyList: any[] = [];

  getSpokenLanguage() {
    this._superAdminService.spokenLanguage().subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      // console.log("spokenlanguage", response);
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
      // console.log("spokenlanguage", this.spokenLanguages);
    });
  }

  getCountryList() {
    this.countryList = []
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
        // console.log(this.countryList, "this.countryList");
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    if(!countryID)
    {
      return
    }
    this.regionList = []
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        const regionList = result.body?.list;
        regionList.map((region)=>{
          this.regionList.push(
            {
              label :region.name,
              value :region._id
            }
          )
        })
        console.log(this.regionList, "this.regionList");
        this.editStaff.get("region").patchValue(this.locationDetails.region)
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
    if(!regionID)
    {
      return
    }
    this._superAdminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        const provienceList = result.body?.list;
        provienceList.map((province)=>{
          this.provienceList.push(
            {
              label :province.name,
              value :province._id
            }
          )
        })
        console.log(this.provienceList, "this.provienceList");
        this.editStaff.get("province").patchValue(this.locationDetails.province)
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
    if(!provinceID)
    {
      return
    }
    this._superAdminService
      .getDepartmentListByProvinceId(provinceID)
      .subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          console.log(result);
          const departmentList = result.body?.list;
          departmentList.map((department)=>{
            this.departmentList.push(
              {
                label :department.name,
                value :department._id
              }
            )
          })
          console.log(this.departmentList, "this.departmentList");
          this.editStaff.get("department").patchValue(this.locationDetails.department)
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
    this.villageList = []
    this.cityList = []
    if(!departmentID)
    {
      return
    }
    this._superAdminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        const cityList = result.body.list;
        cityList.map((city)=>{
          this.cityList.push(
            {
              label :city.name,
              value :city._id
            }
          )
        })
        this.editStaff.get("city").patchValue(this.locationDetails.city)
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._superAdminService
      .getVillageListByDepartmentId(departmentID)
      .subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          console.log(result);
          const villageList = result.body.list;
        villageList.map((village)=>{
          this.villageList.push(
            {
              label :village.name,
              value :village._id
            }
          )
        })
        this.editStaff.get("village").patchValue(this.locationDetails.village)
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getstaffdetails(id: any) {
    let pararm = {
      hospitalStaffId: id,
    };

    this._individualDoctorService.getStaffDetails(pararm).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        let in_profile = result.body.in_profile;
        let location = result.body.in_profile.in_location;
        this.locationDetails = {...location}
        this.staff_profile = in_profile.profile_picture;
        console.log(in_profile,"staff_profileeee_____",result);
        
        this.selectedLanguages = in_profile.language;
        console.log(this.selectedLanguages,"selectedLanguagessss___");

        // if (location?.country) {
        //   this.getRegionList(location?.country);
        // }
        // if (location?.region) {
        //   this.getProvienceList(location?.region);
        // }
        // if (location?.province) {
        //   this.getDepartmentList(location?.province);
        // }
        // if (location?.department) {
        //   this.getCityList(location?.department);
        // }
        console.log("getstaffdetails------------>", result);        
        this.editStaff.controls["first_name"].setValue(
        in_profile.first_name
        ); this.editStaff.controls["middle_name"].setValue(
        in_profile.middle_name
        );
        this.editStaff.controls["last_name"].setValue(
        in_profile.last_name
        );    
        this.editStaff.controls["dob"].setValue(in_profile.dob);
        this.editStaff.controls["language"].setValue(in_profile.language);
        this.editStaff.controls["address"].setValue(
          in_profile.in_location.address
        );
        this.editStaff.controls["neighbourhood"].setValue(
          in_profile.in_location.neighborhood
        );
        this.editStaff.controls["pincode"].setValue(
          in_profile.in_location.pincode
        );
        this.editStaff.controls["mobile"].setValue(
          in_profile.in_location.for_portal_user.mobile
        );
        this.editStaff.controls["email"].setValue(
          in_profile.in_location.for_portal_user.email
        );
        this.editStaff.controls["country"].setValue(
          in_profile.in_location.country
        );
        this.editStaff.controls["city"].setValue(in_profile.in_location.city);
        this.editStaff.controls["department"].setValue(
          in_profile.in_location.department
        );
        this.editStaff.controls["region"].setValue(location.region);
        this.editStaff.controls["province"].setValue(location.province);
        this.editStaff.controls["village"].setValue(location.village);
        // this.editStaff.controls["role"].setValue(result.body.role._id);
        this.roleSelceted = result?.body?.role?._id

        this.editStaff.controls["about_staff"].setValue(in_profile.about);
        this.editStaff.controls["doj"].setValue(result?.body?.doj);
        // this.editStaff.controls["specialty"].setValue(in_profile.specialty);
        this.specialitySelceted = result?.body?.specialty
        console.log("this.specialitySelceted>>>>>>",this.specialitySelceted)
        this.countrycodedb = in_profile?.in_location?.for_portal_user?.country_code;
        this.getCountrycodeintlTelInput();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getSpecialty() {
    let param = {
      searchText: "",
      limit: 50,
      page: 1,
    };
    this._superAdminService.listSpeciality(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // this.specialtyList = result.body?.data;

        result?.body?.data.map((curentval, index: any) => {
          this.specialtyList.push({
            label: curentval?.specilization,
            value: curentval?._id,
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  userId: any = "";
  // ===================================for edit function ==================================
  openVerticallyCenterededitstaff(editstaffcontent: any, _id: any) {
    this.userId = _id;
    console.log("userId",);
    this.getstaffdetails(_id);
    this.modalService.open(editstaffcontent, {
      centered: true,
      size: "xl",
      windowClass: "edit_staffnew",
    });
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  onGroupIconChange(event: any) {
    const formData: any = new FormData();
    formData.append("docName", event.target.files[0]);
    formData.append("userId", "");
    formData.append("docType", "individual_doctor_pic");
    formData.append("multiple", "false");

    this.staff_profile_file = formData;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.staff_profile = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.uploadDocument();
  }

  keyURL: any = "";
  uploadDocument() {
    this._individualDoctorService.uploadDoc(this.staff_profile_file).subscribe({
      next: async (res: any) => {
        let result = await this._coreService.decryptObjectData({ data: res });
        this.keyURL = result.data[0].key;

        console.log("result", result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  EditSraffDetails() {
    this.isSubmitted = true;

    if (this.editStaff.invalid) {
     
      this._coreService.showError("Please fill all required fields", '')    
      return;
      
    }

    this.isSubmitted = false;
    this.loader.start();
    let fields = this.editStaff.value;
    let row = {
      staffId: this.userId,
      staffName: fields.first_name+" "+ fields.middle_name+" "+ fields.last_name,
      first_name: fields.first_name,
      middle_name: fields.middle_name,
      last_name: fields.last_name,
      email:fields.email,
      dob: fields.dob,
      language: this.selectedLanguages,
      addressInfo: {
        loc: this.loc,
        address: fields.address,
        neighborhood: fields.neighbourhood,
        country: fields.country,
        region: fields.region,
        province: fields.province,
        department: fields.department,
        city: fields.city,
        village: fields.village,
        pincode: fields.pincode,
      },
      role: fields.role,
      assignToDoctor: [this.loginUserId],
      password: "",
      assignToStaff: [],
      aboutStaff: fields.about_staff,
      // specialty: fields.specialty,
      specialty:this.selectedSpecialities,
      services: [],
      department: [],
      unit: [],
      expertise: "",
      countryCode: this.selectedCountryCode,
      mobile: fields.mobile,
      profilePic: this.keyURL,
      creatorId: this.loginUserId,
      doj:fields.doj
    };

    console.log("row", row);
    this._individualDoctorService.editStaff(row).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        if(result.status){
        this.loader.stop();
        this.getAllStaffData();
        this.handleClose();
      }
    },
      error: (err) => {
        this.loader.stop();
        console.log(err);
      },
    });
    this.route.navigate(["individual-doctor/staffmanagement"]);
  }


  removeSelectpic() {
    this.staff_profile = "";
  }

  addStaff() {
    if (this.staffRole.length < 1) {
      // this._coreService.showError("please add Role first", '')
      if(this.userRole == "INDIVIDUAL_DOCTOR"){
        this._coreService.showError("please add Role first", '');
      }else{
        this._coreService.showError("Please ask admin to add Role first", '');
      }
    } else {

      this.route.navigate(['/individual-doctor/staffmanagement/add']);
    }
  }

  ngOnDestroy(): void {
    if (this.viewStaffSubscription) {
      this.viewStaffSubscription.unsubscribe();
    }
  }
  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
  }

  onSpecialityChange(event:any): void {
    this.selectedSpecialities = this.editStaff.value.specialty;
  }

  handleDOCChange() {
      new Date(this.editStaff.controls['doj'].value)
  }
}
