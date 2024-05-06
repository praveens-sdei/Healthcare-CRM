import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  FormControl,
  Validators,
} from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { HospitalService } from "../../hospital.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { SuperAdminStaffResponse } from "src/app/modules/super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import intlTelInput from "intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
export interface PeriodicElement {
  staffname: string;

  role: string;
  phone: string;
  datejoined: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent implements OnInit {
  displayedColumns: string[] = [
    "staffname",

    "role",
    "phone",
    "datejoined",
    "active",
    "lockuser",
    "action",
  ];
  editStaff: any = FormGroup;
  userID: any;
  dataSource: any = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  filterForm!: FormGroup;
  action: string = "";
  actionObject: object = null;
  pageSize: number = 10;
  totalLength: number = 0;
  page: any = 1;
  staffID: any;
  selectedCountryCode: any;
  iti: any;
  loc: any = {};
  searchText: any = "";
  filterByrole: any = "";
  staff_profile_file: any = "";
  staff_profile: any = "";
  isSubmitted: boolean = false;
  selectedLanguages :any = [];
  allStaffData :any = {};
  staffRoleList1 :any[]=[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild("countryPhone") countryPhone: ElementRef<HTMLInputElement>;
  // @ViewChild("address") address!: ElementRef<any>;
  teams = new FormControl("");
  overlay = false;
  autoComplete: google.maps.places.Autocomplete;
  countrycodedb: any = 'BF';


  sortColumn: string = 'profileinfos.name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
  };
  userRole: any;
  userPermission: any;
  selectedSpecialities: any=[];
  specialitySelceted: any;

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
    private modalService: NgbModal,
    private _coreService: CoreService,
    private _hospitalService: HospitalService,
    private _superAdminService: SuperAdminService,
    private toastr: ToastrService,
    private route: Router,
    private loader: NgxUiLoaderService
  ) {
    this.editStaff = this.fb.group({
      staff_profile: [""],
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
      email: ["",[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      role: ["", [Validators.required]],
      expertise: [""],
      specialty: [""],
      assingDoctor: [""],
      about_staff: [""],
      unit: [""],
      services: [""],
      staffDepartment: [""],
      doj:[new Date()]
    });
    this.filterForm = this.fb.group({
      search: [""],
      selectRole: [""],
    });

    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.userRole =userData?.role;
    this.userPermission = userData?.permissions;

  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllStaff(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getAllStaff(`${this.sortColumn}:${this.sortOrder}`);
    this.getCountryList();
    this.getSpokenLanguage();
    this.getStaffRoles();
    this.getUnits();
    this.getAllDepartment();
    this.getAllServiceList();
    this.getAllDoctors();
    this.getSpecialty();
    this.getExpertiseApi();
    this.getAllHospitalDoctor();
    // this.autocomplete()
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
    if(this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }

  get addStaffFormControl(): { [key: string]: AbstractControl } {
    return this.editStaff.controls;
  }

  onGroupIconChange(event: any) {
    const formData: any = new FormData();
    formData.append("docName", event.target.files[0]);
    formData.append("userId", this.userID);
    formData.append("docType", "Hospital-Pic");
    formData.append("multiple", "false");

    this.staff_profile_file = formData;
    //  this.uplodDocument();
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.staff_profile = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.uplodDocument();
  }

  keyURL: any = "";
  async uplodDocument() {
    this._hospitalService.uploadDoc(this.staff_profile_file).subscribe({
      next: async (res: any) => {
        let result = await this._coreService.decryptObjectData({ data: res });
        this.keyURL = result.data[0].key;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSpecificStaffDetails(id: any) {
    this.staffID = id;
    const params = {
      hospitalStaffId: id,
    };
    this._hospitalService.getStaffDetails(params).subscribe({
      next: (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const staffDetails = this._coreService.decryptObjectData({
          data: result,
        });

        let alldetails = JSON.parse(JSON.stringify(staffDetails.body));
        this.allStaffData = alldetails,
        console.log("staffDetailsstaffDetailsssssss_____", staffDetails.body);
         this.selectedLanguages = alldetails?.in_profile?.language;
        this.getRegionList(alldetails.in_profile?.in_location?.country);
        this.getProvienceList(alldetails.in_profile?.in_location?.region);
        this.getDepartmentList(alldetails.in_profile?.in_location?.province);
        this.getCityList(alldetails.in_profile?.in_location?.department);
        this.editStaff.controls["first_name"].setValue(
          alldetails.in_profile.first_name
        ); this.editStaff.controls["middle_name"].setValue(
          alldetails.in_profile.middle_name
        );
        this.editStaff.controls["last_name"].setValue(
          alldetails.in_profile.last_name
        );
        this.editStaff.controls["language"].setValue(
          alldetails.in_profile.language
        );

        this.editStaff.controls["role"].setValue(alldetails.role);
        this.editStaff.controls["services"].setValue(alldetails.services);
        this.editStaff.controls["unit"].setValue(alldetails.unit);
        this.editStaff.controls["address"].setValue(
          alldetails.in_profile?.in_location?.address
        );

        this.editStaff.controls["neighbourhood"].setValue(
          alldetails.in_profile?.in_location?.neighborhood
        );
        this.editStaff.controls["country"].setValue(
          alldetails.in_profile?.in_location?.country
        );
        this.editStaff.controls["region"].setValue(
          alldetails.in_profile?.in_location?.region
        );

        this.editStaff.controls["province"].setValue(
          alldetails.in_profile?.in_location?.province
        );
        this.editStaff.controls["department"].setValue(
          alldetails.in_profile?.in_location?.department
        );
        this.editStaff.controls["city"].setValue(
          alldetails.in_profile?.in_location?.city
        );

        this.editStaff.controls["village"].setValue(
          alldetails.in_profile?.in_location?.village
        );
        this.editStaff.controls["pincode"].setValue(
          alldetails.in_profile?.in_location?.pincode
        );
        this.editStaff.controls["mobile"].setValue(
          alldetails.in_profile?.in_location?.for_portal_user.mobile
        );
        this.editStaff.controls["email"].setValue(
          alldetails.in_profile?.in_location?.for_portal_user.email
        );
        this.editStaff.controls["about_staff"].setValue(
          alldetails.in_profile?.about
        );
        this.editStaff.controls["dob"].setValue(alldetails.in_profile?.dob);
        this.editStaff.controls["staffDepartment"].setValue(
          alldetails.department
        );

        this.editStaff.controls["expertise"].setValue(alldetails.expertise);
        // this.editStaff.controls["specialty"].setValue(alldetails.specialty);
        this.editStaff.controls["assingDoctor"].setValue(alldetails.for_doctor);
        this.editStaff.controls["doj"].setValue(
          staffDetails.body?.doj
        );
       this.specialitySelceted = alldetails?.specialty
        this.staff_profile = alldetails.in_profile.profile_picture;
        this.countrycodedb = alldetails?.in_profile?.in_location?.for_portal_user?.country_code;
        this.getCountrycodeintlTelInput();
        console.log("staff_profile", this.countrycodedb);
      },
    });
  }

  EditSraffDetails() {
    this.isSubmitted = true;
    this.loader.start();
    if (this.editStaff.invalid) {
      this._coreService.showError("Please fill all required fields", '')  
      this.loader.stop();
      return;
      
    }

    this.isSubmitted = false;
    let fields = this.editStaff.value;
    let row = {
      staffId: this.staffID,
      first_name: fields.first_name,
      middle_name: fields.middle_name,
      last_name: fields.last_name,
      dob: fields.dob,
      email:fields.email,
      language:this.selectedLanguages,
      addressInfo: {
        loc: {
          type: "Point",
          coordinates: [88.4, 26.8],
        },
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
      assignToDoctor: fields.assingDoctor,
      password: "",
      assignToStaff: [],
      aboutStaff: fields.about_staff,
      specialty: fields.specialty,
      services: fields.services,
      department: fields.staffDepartment,
      unit: fields.unit,
      expertise: fields.expertise,
      countryCode: this.selectedCountryCode,
      mobile: fields.mobile,
      profilePic: this.keyURL,
      doj:fields.doj

    };
    console.log("reqDataaaa________", row)
// return;
    this._hospitalService.editStaff(row).subscribe(
      (res: any) => {
        let response = this._coreService.decryptObjectData({ data: res });

        console.log("editresponse", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success("staff updated");
          this.route.navigate(['/hospital/staffmanagement']);
          this.getAllStaff();
          this.handleClose()
        } else {
          this.loader.stop();
          this.toastr.error(" staff update failed");
        }
      },
      (err) => {
        this.loader.stop();
        let response = this._coreService.decryptObjectData({ data: err.error });
        this.toastr.error(response.message);
      }
    );
  }

  clearFilter() {
    this.filterForm.reset();
    this.filterByrole = "",
      this.searchText = ""
    this.getAllStaff();

  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaff();
  }

  private getAllStaff(sort:any='') {
    const params = {
      hospitalId: this.userID,
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      role: this.filterByrole,
      sort:sort
    };

    this._hospitalService.getAllStaff(params).subscribe({
      next: (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const staffDetails = this._coreService.decryptObjectData({
          data: result,
        });
        console.log("staffDetails_____________",staffDetails);
        
        const data = [];
        if (staffDetails?.body[0].paginatedResults.length > 0) {
          for (const staff1 of staffDetails?.body[0].paginatedResults) {
            let staff = JSON.parse(JSON.stringify(staff1));
            data.push({
              staffname: staff.profileinfos.name,
              role: staff.role !== undefined ? staff.roles.name : "",
              phone: staff.portalusers?.mobile,
              datejoined: this._coreService.createDate(
                new Date(staff.createdAt)
              ),
              id: staff?.for_portal_user,
              is_locked: staff?.lock_user,
              is_active: staff?.isActive,
              doj:staff?.doj
            });
          }
        }

        this.dataSource = data;
        this.totalLength = staffDetails?.body[0]?.totalCount[0]?.count;

        // console.log(" this.totalLength",  this.totalLength);
        // console.log("staff all data====", staffDetails);
      },
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

  public handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    // this.staffID = "";
  }
  openVerticallyCenterededitstaff(editstaffcontent: any, _id: any) {
    this.getSpecificStaffDetails(_id);
    this.modalService.open(editstaffcontent, {
      centered: true,
      size: "xl",
      windowClass: "edit_staffnew",
    });

  }

  public submitAction() {
    this.loader.start();

    this._hospitalService
      .deleteActiveAndLockStaff(this.actionObject)
      .subscribe({
        next: (result) => {
          console.log("decryptedDatadecryptedData", result);

          const decryptedData = this._coreService.decryptObjectData({data:result});
          console.log("decryptedDatadecryptedData", decryptedData);
          if(decryptedData.status == true){
            this.loader.stop();
            this.handleClose();
            this.getAllStaff();
            this._coreService.showSuccess(
              "",
              `Successfully ${this.action} hosptal staff`
            );
          }else{
            this.loader.stop();
            this._coreService.showError(
              "",
              decryptedData.message
            );
          }
         
        },
        error: (err: ErrorEvent) => {
          this.loader.stop();
          console.log(err, "err");

        },
      });
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

  handleSearchCategory(event: any, filter: any) {
    if (event.value != undefined) {
      if (filter === "role") {
        // console.log("role", event.value);

        this.filterByrole = event.value;
      } else {
        this.searchText = event.target.value;

        // console.log("search", this.searchText);
      }

      this.getAllStaff();
    }

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
  doctorList: any[] = [];
  hospDoctorList: any[] = [];
  specialtyList: any[] = [];
  expertiseList: any[] = [];
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
    this.regionList = []
    if (!countryID) {
      return;
    }
    this._superAdminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("region").patchValue(this.allStaffData.in_profile.in_location.region)
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
    this._superAdminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
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
        this.editStaff.get("province").patchValue(this.allStaffData.in_profile.in_location.province)
        if(!this.editStaff.get("province").value){
          this.editStaff.get("department").patchValue("")
          this.editStaff.get("city").patchValue("")
          this.editStaff.get("village").patchValue("")
          }
        // console.log(this.provienceList, "this.provienceList");
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
    this._superAdminService
      .getDepartmentListByProvinceId(provinceID)
      .subscribe({
        next: (res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          // console.log(result);
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
          this.editStaff.get("department").patchValue(this.allStaffData.in_profile.in_location.department)
          if(!this.editStaff.get("department").value){
            this.editStaff.get("city").patchValue("")
            this.editStaff.get("village").patchValue("")
            }
          // console.log(this.departmentList, "this.departmentList");
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getCityList(departmentID: any) {
    this.cityList = []
    this.villageList = []
    if (!departmentID) {
      return;
    }
    this._superAdminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // console.log(result);
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
        this.editStaff.get("city").patchValue(this.allStaffData.in_profile.in_location.city)
        // console.log(this.cityList, "this.cityList");
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
          // console.log(result);
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
          this.editStaff.get("village").patchValue(this.allStaffData.in_profile.in_location.village)
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getStaffRoles() {
    let param = {
      userId: this.userID,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this._hospitalService.allRoles(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.staffRoleList = result?.body?.data;

        const arr = result?.body?.data;

        arr.map((curentval: any) => {
          this.staffRoleList1.push({
            label: curentval?.name,
            value: curentval?._id,
          });
        });
console.log(this.staffRoleList);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUnits() {
    let params = {
      added_by: this.userID,
      limit: 0,
      page: 0,
      searchText: "",
      for_service: "",
    };
    this._hospitalService.getUnits(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.unitList = result?.body.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllServiceList() {
    let params = {
      added_by: this.userID,
      limit: 0,
      page: 0,
      searchText: "",
      for_department: "",
    };
    this._hospitalService.getAllService(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.serviceList = result?.body.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllDepartment() {
    let params = {
      added_by: this.userID,
      limit: 0,
      page: 0,
      searchText: "",
    };
    this._hospitalService.getAllDepartment(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.staffDepartmentList = result?.body.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllDoctors() {
    let params = {
      // added_by: this.userID,
      limit: 10,
      page: 1,
      searchText: "",
      status: "PENDING",
    };
    this._hospitalService.getAllDoctor(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.doctorList = result?.data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllHospitalDoctor() {
    let params = {
      // added_by: this.userID,
      hospital_portal_id: this.userID,
      doctor_name: ""

    };
    this._hospitalService.getAllDoctorOfHospital(params).subscribe({
      next: async (res) => {

        let result = await this._coreService.decryptObjectData({ data: res });
        this.hospDoctorList = await result.body.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async onDepartmentSelect(data: any[]) {
    let params = {
      inputType: "department",
      added_by: this.userID,
      inputValue: data,
    };

    this._hospitalService.getDepartment_service_units(params).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });

        this.serviceList = result.body.serviceDetails;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onServiceSelect(data: any) {
    let params = {
      inputType: "service",
      added_by: this.userID,
      inputValue: data,
    };

    this._hospitalService.getDepartment_service_units(params).subscribe({
      next: (res) => {
        let dep = [];
        let result = this._coreService.decryptObjectData({ data: res });
        for (let id of result.body.departmentDetails) {
          dep.push(id._id);
        }
        this.unitList = result.body.unitDetails;
        this.editStaff.controls["staffDepartment"].setValue(dep);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onUnitSelect(data: any) {
    let params = {
      inputType: "unit",
      added_by: this.userID,
      inputValue: data,
    };

    this._hospitalService.getDepartment_service_units(params).subscribe({
      next: (res) => {
        let dep = [];
        let ser = [];
        let result = this._coreService.decryptObjectData({ data: res });
        for (let id of result.body.departmentDetails) {
          dep.push(id._id);
        }

        for (let id of result.body.serviceDetails) {
          ser.push(id._id);
        }
        this.editStaff.controls["staffDepartment"].setValue(dep);
        this.editStaff.controls["services"].setValue(ser);
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
  getExpertiseApi() {
    let param = {
      searchText: "",
      limit: 50,
      page: 1,
      added_by: this.userID,
    };
    this._hospitalService.getExpertiseApi(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        const expertiseList = result.body?.data;
        expertiseList.map((expertise)=>{
          this.expertiseList.push(
            {
              label : expertise?.expertise,
              value :expertise?._id
            }
          )
          })  
          this.editStaff.get("expertise").patchValue(this.allStaffData.in_profile?.in_location?.department)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addStaff() {
    if (this.staffRoleList.length < 1) {
      // this._coreService.showError("Please add role first.", '')
      if(this.userRole == "HOSPITAL_ADMIN"){
        this._coreService.showError("please add Role first", '');
      }else{
        this._coreService.showError("Please ask admin to add Role first", '');
      }
    } else {

      this.route.navigate(['/hospital/staffmanagement/add']);
    }
  }

  removeSelectpic() {
    this.staff_profile = "";
  }
  onSelectionChange(event: any): void {
    this.selectedLanguages = this.editStaff.value.language;
  }

  handleDOCChange() {
    new Date(this.editStaff.controls['doj'].value)
}

onSpecialityChange(event:any): void {
  this.selectedSpecialities = this.editStaff.value.specialty;
}
}
