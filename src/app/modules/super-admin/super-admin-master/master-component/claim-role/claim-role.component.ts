import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { InsuranceService } from 'src/app/modules/insurance/insurance.service';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { CoreService } from 'src/app/shared/core.service';



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

export interface SpecialityPeriodicElement {
  specialization: string;
  addedby: string;
}
const SPECIALITY_ELEMENT_DATA: SpecialityPeriodicElement[] = [
  { specialization: "Vincent Chase", addedby: "Hospital" },
  { specialization: "Vincent Chase", addedby: "Hospital" },
  { specialization: "Vincent Chase", addedby: "Hospital" },
  { specialization: "Vincent Chase", addedby: "Hospital" },
];



@Component({
  selector: 'app-claim-role',
  templateUrl: './claim-role.component.html',
  styleUrls: ['./claim-role.component.scss']
})
export class ClaimRoleComponent implements OnInit {

  userID: string = ''
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  staff_name: any = '';
  role: string = 'all';
  dataSource = ELEMENT_DATA;
  claimProcessRoleId: any;
  searchText: any = "";
  editRoleForm: FormGroup;
  insuranceList: any[] = [];
  sortColumn: string = 'InsuranceData.company_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  // dataSource1 = new MatTableDataSource<any[]>();
  specialityservicedisplayedColumns: string[] = [
    "createdAt",
    "insuranceCompanyName",
    "sequence",
    "role_name",
    // "isFirst",
    // "isLast",
    "action"
  ];
  specialityservicedataSource: any = [];
  claimRoleForm!: FormGroup;
  isSubmitted: boolean = false;
  staffRole: any[] = [];
  statusCheck: any;
  getClaimList: any = {};
  roleAddedd: string;
  overlay: false;
  displayedColumns: {
    "roleId",
    "sequence",
    // "isFirst"
    // "isLast",
    "action"

  };
  id: any;
  service_id: any;
  SelectedInsuranceId: any;
  adimID: any;
  innerMenuPremission:any=[];
  loginrole: any;
  roleId : string = ""
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private patientService: PatientService,
    private loader : NgxUiLoaderService
  ) {
    this.claimRoleForm = this.fb.group({
      claimRole: this.fb.array([]),
    });

    const userData = this._coreService.getLocalStorage('loginData')
    const adminData = this._coreService.getLocalStorage('adminData')

    this.userID = userData._id
    console.log(this.userID, "userid check");
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.role = userData.role;

    if(this.role === "STAFF_USER"){
      this.adimID = adminData?.for_staff
    }else{
      this.adimID = userData._id
    }
    console.log(this.role, "check role")
   

    // this.getAllStaff()


    this.editRoleForm = new FormGroup({
      roleId: new FormControl(""),
      isFirst: new FormControl(""),
      isLast: new FormControl(""),
      sequence: new FormControl(["", [Validators.required]])
    });
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.fetchClaimProcessBy_insuranceId(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.specialityservicedataSource = SPECIALITY_ELEMENT_DATA
    this.addclaimRole(0);
    this.fetchClaimProcessBy_insuranceId(`${this.sortColumn}:${this.sortOrder}`);
    this.getInsuranceList();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("claim_role")) {
          this.innerMenuPremission = checkSubmenu['claim_role'].inner_menu;
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
      }
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.fetchClaimProcessBy_insuranceId();
  }

  claimRoleForm1(): FormGroup {
    return this.fb.group({
      insurance_id: [this.SelectedInsuranceId, [Validators.required]],
      roleId: ["", [Validators.required]],
      isFirst: [false, [Validators.required]],
      isLast: [false, [Validators.required]],
      sequence: ["", [Validators.required]],

      // delete_status: [false, [Validators.required]],
    });

  }




  //  Edit plan modal
  async openVerticallyCenteredEditplan(
    claimProcess: any,
    claimProcessRoleId: any
  ) {
    this.claimProcessRoleId = claimProcessRoleId;


    // this.planExclusionId = "";

    // await this.subEditServiceForms.clear();
    // await this.subEditExclucionForms.clear();


    let filterData = this.getClaimList.filter((i) =>
      claimProcessRoleId.includes(i._id)
    );

    let patchValue = {
      roleId: filterData[0].roleId,
      isFirst: filterData[0].isFirst,
      isLast: filterData[0].isLast
    }
    // console.log(patchValue, "consle")

    // this.editRoleForm.patchValue(patchValue);

    await this._insuranceService.getClaimProcessById(claimProcessRoleId).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // let plan = response.body;
      console.log("Get plan by id", response);
      console.log(response.body[0].roleId, "response.body[0].roleData.name,");
      // this.editRoleForm.patchValue({
      //   roleId: response.body[0].roleId,
      //   isFirst: response.body[0].isFirst,

      // });


    });

    await this.modalService.open(claimProcess, {
      centered: true,
      size: "xl",
    });
  }




  get claimRole(): FormArray {
    return this.claimRoleForm.get("claimRole") as FormArray;
  }

  //  Add speciality service modal
  openVerticallyCenteredAddspecialityservicecontent(
    addspecialityservicecontent: any
  ) {
    this.modalService.open(addspecialityservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_lab",
    });
  }

  closePopup() {
    this.modalService.dismissAll("close");
    // this.isSubmitted = false;
    // this.claimRoleForm.reset();
    // this.claimRole.clear();
    // let modalDespose = this.getDismissReason(1);
    // this.modalService.dismissAll(modalDespose);
    // this.addclaimRole();
  }

  addclaimRole(i) {
    this.claimRole.push(this.claimRoleForm1());
    console.log(this.claimRole, "claimrole");
    if (i != 0) {
      const formArray = this.claimRoleForm.get('claimRole') as FormArray;
      const formGroup = formArray.at(i + 1) as FormGroup;
      formGroup.patchValue({ insurance_id: this.SelectedInsuranceId });
    }


  }

  removeclaimRole(i: number) {
    this.claimRole.removeAt(i);
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.fetchClaimProcessBy_insuranceId();
  }

  addClaimRoleSubmit() {
    this.isSubmitted = true;
    const isAnyFieldEmpty = this.claimRoleForm.value.claimRole.some(role => {
      return Object.values(role).some(value => value === "");
    });
  
    if (isAnyFieldEmpty) {
      this._coreService.showError("", "Please fill all the required fields.");
      return;
    }
    let reqData = {
      roleArray: this.claimRoleForm.value.claimRole,
      added_by: 'SuperAdmin',
      for_portal_user: this.adimID,
      createdBy:this.userID
    };
   this.loader.start();
    console.log(reqData, "reqDataceck");

    this._insuranceService.addClaimRole(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.fetchClaimProcessBy_insuranceId();
        this.closePopup();
      } else {
        this.loader.stop();
        this._coreService.showError(response.message, "");
      }
    });
  }

  private async fetchClaimProcessBy_insuranceId(sort:any=''     ) {
    let param = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      insurance_id: "",
      sort : sort
    };
    console.log(param, "paramslog");


    this._insuranceService.fetchClaimProcessBy_insuranceId(param).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this._coreService.decryptContext(encData);
        if (result.status) {
          this.getClaimList = result.body.data;
          console.log(this.getClaimList, "check data");

          // this.planExclusion = await result.body?.planExclusion;
          // this.extractExcludedMedicines();
          console.log(this.getClaimList, "getCalm list");
          this.specialityservicedataSource = new MatTableDataSource(this.getClaimList);
          this.totalLength = result.body.totalRecords;


        } else {
          // this.reimbursmentRate = 0;
        }
      },
    });
  }

  handletoggleChange(event: any, data: any) {
    let reqData = {
      claimId: data?._id,
      action_name: true,
      action_value: event.checked,
    };


  }



  handleRoleFilter(value: any) {
    this.role = value
    // this.getAllStaff()
  }

  private getAllRole(insuranceId: any) {
    this.staffRole = []
    this._insuranceService.allRoleInsurance(insuranceId).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      console.log(result,"result----->");
      
      if (result.status) {
        const staffRole = result?.body?.data
        staffRole.map((role)=>{
          this.staffRole.push(
            {
              label : role.name,
              value : role._id
            }
          )
        })
        console.log(this.staffRole, "staff role");
        console.log(this.roleId , this.editRoleForm);
        this.editRoleForm.get("roleId").patchValue(this.roleId)
        

      }
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
  handleClose() {
    this.isSubmitted = false;
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.modalService.dismissAll("close");
    // this.lab.clear();
    this.claimRoleForm.reset();
    // this.excleForm.reset();
    // this.addLabs();
  }

  updateClaimRoles() {
    this.isSubmitted = true
    if (!this.editRoleForm.value.roleId || !this.editRoleForm.value.sequence) {
      this._coreService.showError("", "Please fill all the required fields.");
      return;
    }
    let array = {
      roleId: this.editRoleForm.value.roleId,
      sequence: this.editRoleForm.value.sequence
    };
    this.loader.start();
    let reqData = {
      _id: this.id,
      ClaimProcessData: array,
      insurance_id: this.userID
    };

    this._insuranceService.editclaimprocessRole(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.handleClose();
        this.fetchClaimProcessBy_insuranceId();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  //  Edit speciality service modal
  openVerticallyCenterededitspecialityservice(
    editspecialityservicecontent: any,
    data: any
  ) {
    console.log(data, "data log isFirst");

    this.id = data._id;
    let isFirstBool = data.isFirst == "true" ? true : false;
    let isLastBool = data.isLast == "true" ? true : false;
    console.log(isFirstBool, "chchchc", typeof (isLastBool));
    this.getAllRole(data.insurance_id);
    this.editRoleForm.patchValue({
      roleId: data.roleId,
      sequence: data.sequence
    });
    this.roleId = data.roleId 
    this.modalService.open(editspecialityservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "edit_speciality_service",
    });
  }

  //delete Popup
  deletePoup(deletePoup: any, service_id: any) {
    this.service_id = service_id;
    console.log(this.service_id, "id check ");

    this.modalService.open(deletePoup, { centered: true, size: "sm" });
  }
  deleteService(action_value: boolean, action_name: any) {
    this.loader.start();
    let reqData = {
      action_name: action_name,
      action_value: action_value,
      _id: this.service_id,
    };
    this._insuranceService.deleteServiceApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.fetchClaimProcessBy_insuranceId();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }


  getInsuranceList() {
    this.patientService.getInsuanceList().subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      console.log("response===>",response);
      
      const arr = response?.body?.result;
      // arr.unshift({
      //   for_portal_user: { _id: "" },
      //   company_name: "All Insurance Company",
      // });
      arr.map((curentval: any) => {
        this.insuranceList.push({
          label: curentval?.company_name,
          value: curentval?.for_portal_user?._id,
        });
      });
      console.log(this.insuranceList, "insuranceList");
    });
  }


  getInsuranceClaim(event: any) {
    console.log(event, "event log")
    this.getAllRole(event.value)
    this.SelectedInsuranceId = event.value;

    const formArray = this.claimRoleForm.get('claimRole') as FormArray;
    const formGroup = formArray.at(0) as FormGroup;
    formGroup.patchValue({ insurance_id: event.value });

    // this..patchValue({ insurance_id: event.value });
  }
}
