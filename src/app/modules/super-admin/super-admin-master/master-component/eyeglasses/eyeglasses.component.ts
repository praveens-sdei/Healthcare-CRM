import { Component, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SuperAdminService } from "../../../super-admin.service";
import * as XLSX from "xlsx";
import { NgxUiLoaderService } from "ngx-ui-loader";
// Eyeglasses table data
export interface EyeglassesPeriodicElement {
  eyeglassesname: string;
  addedby: string;
}
const EYEGLASSES_ELEMENT_DATA: EyeglassesPeriodicElement[] = [
  { eyeglassesname: "Vincent Chase", addedby: "Hospital" },
  { eyeglassesname: "Vincent Chase", addedby: "Hospital" },
  { eyeglassesname: "Vincent Chase", addedby: "Hospital" },
  { eyeglassesname: "Vincent Chase", addedby: "Hospital" },
];

@Component({
  selector: "app-eyeglasses",
  templateUrl: "./eyeglasses.component.html",
  styleUrls: ["./eyeglasses.component.scss"],
})
export class EyeglassesComponent implements OnInit {
  // Eyeglasses table data
  eyeglassesdisplayedColumns: string[] = [
    "createdAt",
    "eyeglassesname",
    "addedby",
    "status",
    "action",
  ];
  eyeglassesdataSource: any = [];
  editEyeGlassesForm!: FormGroup;
  eyeGlassesForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  eyeGlassesId: any;
  searchText: any = "";
  eyeglass_name: any;
  selectedFiles: any;
  sortColumn: string = 'eyeglass_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService
  ) {
    this.editEyeGlassesForm = this.fb.group({
      id: [""],
      eyeglass_name: ["", [Validators.required]],
      status: [""],
    });

    this.eyeGlassesForm = this.fb.group({
      eyeglassesss: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllEyeGlassess(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.addNewEyeGlasses();
    this.getAllEyeGlassess(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("eyeglasses")) {
          this.innerMenuPremission = checkSubmenu['eyeglasses'].inner_menu;
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

  eyeGlassesExcleForm: FormGroup = new FormGroup({
    eyeGlasses_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.eyeGlassesExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this.superAdminService.uploadExcelEyeGlasses(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("formData======>", response);
        if (response.status) {
          this.loader.stop();
          this.selectedFiles=null;
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.selectedFiles=null;

          this.toastr.error(response.message);
        }
      },
      (error: any) => {
        this.loader.stop();
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.toastr.error(response.message);
        }
      }
    );
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/eyeGlassMaster.xlsx");
    link.setAttribute("download", `eyeGlassSampleFile.xlsx`);
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

  // exportEyeGlasses() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-eyeglass-master";
  // }

  exportEyeGlasses() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this.superAdminService.listEyeglassMasterforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = [
            "eyeglass_name",
          ];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'EyeglassesFile.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }
  
  getAllEyeGlassess(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
      sort:sort
    };
    this.superAdminService.listEyeglassessApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.data?.totalRecords;
      this.eyeglassesdataSource = response?.data?.result;
      console.log(this.eyeglassesdataSource, "eyeglassesdataSource");
    });
  }

  addEyeGlassess() {
    this.isSubmitted = true;
    if (this.eyeGlassesForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.loader.start();
    let reqData = {
      eyeglassData: this.eyeGlassesForm.value.eyeglassesss,
      added_by: this.userId,
    };

    this.superAdminService.addEyeglassessApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllEyeGlassess();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updateEyeGlassess() {
    this.isSubmitted = true
    if (this.editEyeGlassesForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.isSubmitted = false
    this.loader.start();
    this.superAdminService
      .updateEyeglassessApi(this.editEyeGlassesForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("eyeglassess======>", response);
        if (response.status) {
          this.loader.stop();
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  selectedEyeglasses: any = [];

  deleteEyeglassess(isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      id: this.eyeGlassesId,
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.id = "";
    } else {
      reqData.id = this.selectedEyeglasses;
    }

    console.log("REQ DATA Delete --->", reqData);

    this.superAdminService
      .deleteEyeglassessApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
          this.closePopup();
          this.selectedEyeglasses = [];
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  handleSearchEyeGlasses(event: any) {
    this.searchText = event.target.value;
    this.getAllEyeGlassess();
  }

  closePopup() {
    this.isSubmitted = false;
    this.eyeGlassesForm.reset();
    this.eyeGlassesExcleForm.reset();
    this.eyeglassesss.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewEyeGlasses();
  }

  handlePageEvent(data: any) {
    console.log(data);
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllEyeGlassess();
  }

  handletoggleChange(event: any, data: any) {
    this.loader.start();
    let reqData = {
      id: data?._id,
      action_name: "active",
      action_value: event.checked,
    };

    this.superAdminService
      .deleteEyeglassessApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
        } else {
          this.loader.stop();

          this.toastr.error(response.message);
        }
      });
  }

  //-------Form Array Handling----------------
  newEyeGlassesForm(): FormGroup {
    return this.fb.group({
      eyeglass_name: ["", [Validators.required]],
      status: [true],
    });
  }

  get eyeglassesss(): FormArray {
    return this.eyeGlassesForm.get("eyeglassesss") as FormArray;
  }

  addNewEyeGlasses() {
    this.eyeglassesss.push(this.newEyeGlassesForm());
  }

  removeEyeGlasses(i: number) {
    this.eyeglassesss.removeAt(i);
  }
  //  Add Eyeglasses modal
  openVerticallyCenteredAddeyeglasses(addeyeglassescontent: any) {
    this.modalService.open(addeyeglassescontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit Eyeglasses modal

  openVerticallyCenteredediteyeglasses(editeyeglassescontent: any, data: any) {
    this.editEyeGlassesForm.patchValue({
      id: data?._id,
      eyeglass_name: data?.eyeglass_name,
      status: data?.status,
    });
    this.modalService.open(editeyeglassescontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, eyeGlassesId: any) {
    this.eyeGlassesId = eyeGlassesId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal import",
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

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.eyeglassesdataSource?.map((element) => {
        if (!this.selectedEyeglasses.includes(element?._id)) {
          this.selectedEyeglasses.push(element?._id);
        }
      });
    } else {
      this.selectedEyeglasses = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedEyeglasses.push(medicineId);
    } else {
      const index = this.selectedEyeglasses.indexOf(medicineId);
      if (index > -1) {
        this.selectedEyeglasses.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedEyeglasses?.length === this.eyeglassesdataSource?.length &&
      this.selectedEyeglasses?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }
}
