import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from 'ngx-editor';
import { InsuranceService } from '../insurance.service';
import { IInsuranceStaffResponse } from '../insurance-staffmanagement/addstaff/insurance-add-staff.type';
import { IEncryptedResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'jszip';
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

export interface SpecialityPeriodicElement {
  specialization: string;
  addedby: string;
}
const SPECIALITY_ELEMENT_DATA: SpecialityPeriodicElement[] = [];

@Component({
  selector: 'app-insurance-claim-process-role',
  templateUrl: './insurance-claim-process-role.component.html',
  styleUrls: ['./insurance-claim-process-role.component.scss']
})
export class InsuranceClaimProcessRoleComponent implements OnInit {
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

  // dataSource1 = new MatTableDataSource<any[]>();
  specialityservicedisplayedColumns: string[] = [
    "sequence",
    "role_name",
    "action"
  ];
  specialityservicedataSource: any = [];
  claimRoleForm!: FormGroup;
  isSubmitted: boolean = false;
  staffRole: any[]= [];
  statusCheck: any;
  getClaimList: any = {};
  roleAddedd: string;
  displayedColumns: {
    "roleId"
    "sequence",
    "action"

  };
  id: any;
  service_id: any;
  sortColumn: string = 'sequence';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  staffInsuranceId: any;
  innerMenuPremission: any = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);

    this.claimRoleForm = this.fb.group({
      claimRole: this.fb.array([]),
    });

    const userData = this._coreService.getLocalStorage('loginData')
    const admindata = this._coreService.getLocalStorage('adminData')

    this.userID = userData._id
    console.log(this.userID, "userid check");
    this.staffInsuranceId = admindata?.for_user
    this.role = userData.role;
    console.log(this.role, "check role")
    if (this.role == "INSURANCE_ADMIN" || this.role == "INSURANCE_STAFF") {
      this.roleAddedd = "Insurance";
    }

    if (this.role == "superadmin") {
      this.roleAddedd = "SuperAdmin";
    }

    this.getAllRole()
    // this.getAllStaff()


    this.editRoleForm = new FormGroup({
      roleId: new FormControl(""),
      isFirst: new FormControl(""),
      isLast: new FormControl(""),
      sequence: new FormControl(["", [Validators.required]])
    });
  }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.fetchClaimProcessBy_insuranceId(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.specialityservicedataSource = SPECIALITY_ELEMENT_DATA
    // console.log(this.specialityservicedataSource,"specialityservicedataSourceee");

    this.addclaimRole();
    this.fetchClaimProcessBy_insuranceId(`${this.sortColumn}:${this.sortOrder}`);
    // setTimeout(() => {
    //   this.checkInnerPermission();
    // }, 300);
  }



  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        if (checkSubmenu.hasOwnProperty("claim-process-role")) {
          this.innerMenuPremission = checkSubmenu['claim-process-role'].inner_menu;

        } else {
          console.log(`does not exist in the object.`);
        }

      } else {
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({ name: checkSubmenu[key].name, slug: key, status: true });
        }

        this.innerMenuPremission = innerMenu;
      }
    }

  }

   giveInnerPermission(value) {
    return new Promise((resolve, reject) => {
    //   setTimeout(() => {
        if (this.role === 'INSURANCE_STAFF') {
          const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
          // console.log("checkRequest__________", checkRequest)
          resolve(checkRequest ? checkRequest.status : false);
        } else {
          resolve(true);
        }
      // }, 2000);
    });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.fetchClaimProcessBy_insuranceId();
  }

  claimRoleForm1(): FormGroup {
    if (this.role == 'INSURANCE_ADMIN' || this.role == 'superadmin') {
      return this.fb.group({
        insurance_id: [this.userID, [Validators.required]],
        roleId: ["", [Validators.required]],
        sequence: ["", [Validators.required]],
        isFirst: [false],
        isLast: [false],

        // delete_status: [false, [Validators.required]],
      });

    } else {
      return this.fb.group({
        insurance_id: [this.staffInsuranceId, [Validators.required]],
        roleId: ["", [Validators.required]],
        sequence: ["", [Validators.required]],
        isFirst: [false],
        isLast: [false],

        // delete_status: [false, [Validators.required]],
      });

    }

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
    console.log(patchValue, "consle")

    this.editRoleForm.patchValue(patchValue);

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
    console.log(this.claimRole.value, "=================================>12345555");
    this.modalService.open(addspecialityservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_lab",
    });
  }

  closePopup() {
    this.modalService.dismissAll("close");
    // this.isSubmitted = false;  

    /*  this.claimRole.patchValue([{
       roleId: "",
       sequence:""
     }]); */
    let data = this.claimRole;

    for (let index = 0; index <= data.length; index++) {
      this.removeclaimRole(index);
    }
    this.claimRole.reset();
    if (this.claimRole.length === 0) {
      this.addclaimRole()
    }
    //this.addclaimRole();
    // let modalDespose = this.getDismissReason(1);
    // this.modalService.dismissAll(modalDespose);
    // this.addclaimRole();
  }

  addclaimRole() {
    this.claimRole.push(this.claimRoleForm1());
    console.log(this.claimRole, "claimrole");

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
    console.log("submit");

    if (this.claimRoleForm.invalid) {
      return;
    }
    this.loader.start();
    let reqData = {
      roleArray: this.claimRoleForm.value.claimRole,
      added_by: this.roleAddedd,
      for_portal_user: this.userID,
      createdBy: this.userID
    };


    console.log(reqData, "reqDataceck");

    this._insuranceService.addClaimRole(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.fetchClaimProcessBy_insuranceId(`${this.sortColumn}:${this.sortOrder}`);
        this.closePopup();
        this.claimRole.clear();
        this.claimRoleForm.reset();
        this.addclaimRole();
      } else {
        this.loader.stop();
        this._coreService.showError(response.message, "");
        this.closePopup();
        this.claimRole.clear();
        this.claimRoleForm.reset();
        this.addclaimRole();
      }
    });
  }

  private async fetchClaimProcessBy_insuranceId(sort: any = '') {
    let param = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      insurance_id: this.userID,
      sort: sort
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
          // console.log(this.dataSource1, "dataSource1dataSource1");


          // this.dataSource1.sort = this.sort;

          // this.dataSource.paginator = this.paginator;

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

    // this.service.deleteSpeciality(reqData).subscribe((res: any) => {
    //   let encryptedData = { data: res };
    //   let response = this._coreService.decryptObjectData(encryptedData);
    //   if (response.status) {
    //     this.getAllSpeciality();
    //     this.toastr.success(response.message);
    //   } else {
    //     this.toastr.error(response.message);
    //   }
    // });
  }


  // private getAllStaff() {
  //   this.isSubmitted = true
  //   const params = {
  //     admin_id: this.userID,
  //     page: this.page,
  //     limit: this.pageSize,
  //     role_id: this.role,
  //     staff_name: this.staff_name
  //   }
  //   this._insuranceService.getAllStaff(params).subscribe({
  //     next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
  //       const decryptedData = this._coreService.decryptObjectData(result)
  //       console.log(decryptedData, 'decryptedData');

  //       const data = []
  //       for (const staff of decryptedData.body.result) {
  //         data.push({
  //           staffname: staff.staff_name,
  //           username: staff.for_portal_user.user_name,
  //           role: staff.role !== undefined ? staff.role.name : '',
  //           phone: staff.for_portal_user.mobile,
  //           datejoined: this._coreService.createDate(new Date(staff.createdAt)),
  //           id: staff.for_portal_user._id,
  //           is_locked: staff.is_locked,
  //           is_active: staff.is_active
  //         })
  //       }
  //       this.totalLength = decryptedData.body.totalRecords
  //       this.dataSource = data;
  //       // this._coreService.showSuccess("", "Staff loaded successfully");
  //     },
  //     error: (err: ErrorEvent) => {
  //       console.log(err, 'err');

  //       this._coreService.showError("", "Staff Load Failed");
  //       // if (err.message === "INTERNAL_SERVER_ERROR") {
  //       //   this.coreService.showError("", err.message);
  //       // }
  //     },
  //   });
  // }

  handleRoleFilter(value: any) {
    this.role = value
    // this.getAllStaff()
  }

  private getAllRole() {
    this._insuranceService.allRole(this.userID).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      if (result.status) {
        const staffRole = result.body.data
        staffRole.map((staff)=>{
          this.staffRole.push(
            {
              label  : staff.name,
              value : staff._id
            }
          )
        })
        console.log(this.staffRole, "staff role"); 
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
    console.log("working");
    this.loader.start();
    let array = {
      roleId: this.editRoleForm.value.roleId,
      sequence: this.editRoleForm.value.sequence
    };

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
        this.fetchClaimProcessBy_insuranceId(`${this.sortColumn}:${this.sortOrder}`);
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

    this.editRoleForm.patchValue({
      roleId: data.roleId,
      sequence: data.sequence
      // isFirst: isFirstBool,
      // isLast: isLastBool,
    });
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
}




