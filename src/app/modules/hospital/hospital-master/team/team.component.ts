import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SuperAdminService } from "../../../../modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import * as XLSX from 'xlsx';
import { HospitalService } from '../../hospital.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface SpecialityPeriodicElement {
  specialization: string;
 
}
const SPECIALITY_ELEMENT_DATA: SpecialityPeriodicElement[] = [
  { specialization: "Vincent Chase" },
  { specialization: "Vincent Chase" },
  { specialization: "Vincent Chase" },
  { specialization: "Vincent Chase" },
];


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  specialityservicedisplayedColumns: string[] = [
    "team",    
    "status",
    "action",
  ];
  specialityservicedataSource: any = [];
  teamForm!: FormGroup;
  isSubmitted: boolean = false;
  editTeamForm!: FormGroup;
  teamId: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  selectedFiles: any;
  innerMenuPremission:any=[];

  sortColumn: string = 'team';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  userPermission: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: HospitalService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
    // private service: SuperAdminService

  ) {
    this.teamForm = this.fb.group({
      teams: this.fb.array([]),
    });

    
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.userId = admindata?.in_hospital;

    }else{
      this.userId = loginData?._id;
    }
    this.userPermission = loginData?.permissions;

    this.editTeamForm = this.fb.group({
      teamId: ["", [Validators.required]],
      team: ["", [Validators.required]],
      active_status: ["", [Validators.required]],
    });
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllTeamList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.addnewSpeciality();
    this.getAllTeamList(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("department")) {
          this.innerMenuPremission = checkSubmenu['department'].inner_menu;  
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

  teamExcelForm: FormGroup = new FormGroup({
    specialization_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.loader.start();
    this.isSubmitted = true;
    if (this.teamExcelForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("added_by", this.userId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this.service.uploadExcelTeamList(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("uploadExcelHealthcareNetwork", response);
        if (response.status) {
          this.loader.stop();
          this.getAllTeamList();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
          this.closePopup();
        }
        this.selectedFiles=null

      },
      (error: any) => {
        this.loader.stop();
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.toastr.error(response.message);
          this.closePopup();
        }
      }
    );
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/TeamList.xlsx");
    link.setAttribute("download", `TeamList.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
    }
  }
  // exportSpeciality() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-specialty";
  // }



  exportSpeciality() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this.service.allTeamListforexport(this.page, this.pageSize, this.searchText, this.userId)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = [
            "team",
          ];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'TeamFile.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }




  getAllTeamList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      sort:sort
    };

    this.service.TeamLists(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.totalCount;
      this.specialityservicedataSource = response?.body?.data;
      console.log("specialityservicedataSource",this.specialityservicedataSource);
      
    });
  }
  addTeams() {
    this.isSubmitted = true;
    if (this.teamForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return; 
    }
    this.isSubmitted = false;
    let reqData = {
      teamArray: this.teamForm.value.teams,
      added_by: this.userId,
    };
    this.loader.start();

    this.service.addTeam(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };

      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("----",response);
      
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllTeamList();
        this.closePopup();
      } else if(response.status === false){
        this.loader.stop();
        this._coreService.showError(response.message, "");
        this.modalService.dismissAll();
        this.closePopup();

      }
    });
  }
  updateTeam() {
    this.isSubmitted = true;
    if (this.editTeamForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.loader.start();
    this.service
      .updateTeamApi(this.editTeamForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.getAllTeamList();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }
  selectedSpecialities: any = [];
  deleteTeam(isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      teamId: this.teamId,
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.teamId = "";
    } else {
      reqData.teamId = this.selectedSpecialities;
    }

    console.log("REQ DATA Delete --->", reqData);

    this.service.deleteTeam(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllTeamList();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedSpecialities = [];
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handletoggleChange(event: any, data: any) {
    this.loader.start();
    let reqData = {
      teamId: data?._id,
      action_name: "active",
      action_value: event.checked,
    };

    this.service.deleteTeam(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllTeamList();
        this.toastr.success(response.message);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getAllTeamList();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllTeamList();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.teamForm.reset();
    this.teams.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addnewSpeciality();
  }

  //-------Form Array Handling----------------
  newSpecialityForm(): FormGroup {
    return this.fb.group({
      team: ["", [Validators.required]],
      active_status: [true, [Validators.required]],
      delete_status: [false, [Validators.required]],
    });
  }

  get teams(): FormArray {
    return this.teamForm.get("teams") as FormArray;
  }

  addnewSpeciality() {
    this.teams.push(this.newSpecialityForm());
    this.isSubmitted = false
  }

  removeSpeciality(i: number) {
    this.teams.removeAt(i);
  }
  //  Add speciality service modal
  openVerticallyCenteredAddspecialityservicecontent(
    addspecialityservicecontent: any
  ) {
    this.modalService.open(addspecialityservicecontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit speciality service modal
  openVerticallyCenterededitspecialityservice(
    editspecialityservicecontent: any,
    data: any
  ) {
    this.editTeamForm.patchValue({
      teamId: data._id,
      team: data.team,
      active_status: data.active_status,
    });
    this.modalService.open(editspecialityservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_speciality_service",
    });
  }

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, teamId: any) {
    this.teamId = teamId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
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

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.specialityservicedataSource?.map((element) => {
        if (!this.selectedSpecialities.includes(element?._id)) {
          this.selectedSpecialities.push(element?._id);
        }
      });
    } else {
      this.selectedSpecialities = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedSpecialities.push(medicineId);
    } else {
      const index = this.selectedSpecialities.indexOf(medicineId);
      if (index > -1) {
        this.selectedSpecialities.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedSpecialities?.length ===
      this.specialityservicedataSource?.length && this.selectedSpecialities?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }

}
