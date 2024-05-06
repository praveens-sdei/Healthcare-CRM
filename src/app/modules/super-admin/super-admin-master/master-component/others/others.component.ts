import { Component, OnInit, ViewChild } from "@angular/core";
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

export interface otherPeriodicElement {
  name: string;
  addedby: string;
}
const OTHER_ELEMENT_DATA: otherPeriodicElement[] = [
  { name: "Lorem Ipsum", addedby: "Hospital" },
  { name: "Lorem Ipsum", addedby: "Hospital" },
  { name: "Lorem Ipsum", addedby: "Hospital" },
  { name: "Lorem Ipsum", addedby: "Hospital" },
];

@Component({
  selector: "app-others",
  templateUrl: "./others.component.html",
  styleUrls: ["./others.component.scss"],
})
export class OthersComponent implements OnInit {
  // Other table data
  otherdisplayedColumns: string[] = ["createdAt","name", "addedby", "status", "action"];
  otherdataSource: any = [];
  editOthersForm!: FormGroup;
  othersForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  infoDetails: any;
  userId: any;
  othersId: any;
  // searchText: any[] = [];
  searchText: any = "";
  arraylist: any;
  selectedFiles: any;
  sortColumn: string = 'others';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  @ViewChild("othercontent", { static: false }) othercontent: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService
  ) {
    this.editOthersForm = this.fb.group({
      otherTestId: [""],
      category: [""],
      others: ["",[Validators.required]],
      description: [""],
      clinical_consideration: [""],
      normal_values: [""],
      abnormal_values: [""],
      contributing_factors_to_abnormal: [""],
      procedure: this.fb.group({
        before: [""],
        during: [""],
        after: [""],
      }),
      clinical_warning: [""],
      contraindications: [""],
      other: [""],
      link: [""],
      // name:["",[Validators.required]],
      active: [false],
    });

    this.othersForm = this.fb.group({
      othersss: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllOther(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.addNewOthers();
    this.getAllOther(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("others")) {
          this.innerMenuPremission = checkSubmenu['others'].inner_menu;
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

  othersExcleForm: FormGroup = new FormGroup({
    others_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.othersExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // uploadExcelMedicine
    this.service.uploadExcelOthers(formData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.selectedFiles = null
        this.getAllOther();
        this.toastr.success(response.message);
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.selectedFiles = null;
        this.toastr.error(response.message);
      }
    }, (error: any) => {
      this.loader.stop();
      let encryptedData = { data: error.error };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (!response.status) {
        this.toastr.error(response.message);
      }
    });
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/othersTest.xlsx");
    link.setAttribute("download", `othersSampleExcel.xlsx`);
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
  // exportOthers() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-others-test-master";
  // }

  exportOthers() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this.service.othersTestTestMasterListforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = [
            "category",
            "others",
            "description",
            "clinical_consideration",
            "normal_values",
            "abnormal_values",
            "contributing_factors_to_abnormal",
            "procedure_before",
            "procedure_during",
            "procedure_after",
            "clinical_warning",
            "contraindications",
            "other",
            "link"
  
  
          ];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'OtherFile.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }

  getAllOther(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      sort:sort
    };
    console.log("OTHER reqData============>", reqData);

    this.service.listOthersApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("OTHER LIST============>", response);
      this.totalLength = response?.data?.count;
      this.otherdataSource = response?.data?.result;
    });
  }

  addOthers() {
    // console.log("addOthers============>", this.othersForm.value);
    this.isSubmitted = true;
    if (this.othersForm.invalid) {
      this._coreService.showError("","Please Fill Required fields")
      return;
    }
    this.loader.start();
    let reqData = {
      OthersTestArray: this.othersForm.value.othersss,
      added_by: this.userId,
    };
    // console.log("addOthers============>", reqData);
    this.service.addOthersApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // console.log("addOthers============>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllOther();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updateOther() {
    this.isSubmitted = true;
    if (this.editOthersForm.invalid) {
      this._coreService.showError("", "Please fill all the required fields.")

      return;
    }
    this.loader.start();
    let reqdata = {
      otherTestId: this.editOthersForm.value.otherTestId,
      OthersTestData: {
        category: this.editOthersForm.value.category,
        others: this.editOthersForm.value.others,
        description: this.editOthersForm.value.description,
        clinical_consideration: this.editOthersForm.value.clinical_consideration,
        normal_values: this.editOthersForm.value.normal_values,
        abnormal_values: this.editOthersForm.value.abnormal_values,
        contributing_factors_to_abnormal: this.editOthersForm.value.contributing_factors_to_abnormal,
        procedure: {
          before: this.editOthersForm.value.procedure.before,
          during: this.editOthersForm.value.procedure.during,
          after: this.editOthersForm.value.procedure.after,
        },
        clinical_warning: this.editOthersForm.value.clinical_warning,
        contraindications: this.editOthersForm.value.contraindications,
        other: this.editOthersForm.value.other,
        link: this.editOthersForm.value.link,
        active: this.editOthersForm.value.active,
      }
    }
    this.service
      .updateOthersApi(reqdata)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);

        if (response.status) {
          this.loader.stop();
          this.getAllOther();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  selectedOthers: any = []

  deleteOther(action_value: boolean, action_name: any, isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      otherTestId: this.othersId,
      action_name: action_name,
      action_value: action_value,
    };

    if (isDeleteAll === "all") {
      reqData.otherTestId = "";
    }

    if (isDeleteAll === "selected") {
      reqData.otherTestId = this.selectedOthers;
    }

    console.log("REQUEST DATA DELETE==>", reqData);
    // return

    this.service.deleteOthersApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllOther();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedOthers = []
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  handledeleteChange(event: any, othersId: any) {
    (this.othersId = othersId), this.deleteOther(event.checked, "delete");
  }
  handletoggleChange(event: any, othersId: any) {
    (this.othersId = othersId), this.deleteOther(event.checked, "active");
  }

  handleSearchOthers(event: any) {
    this.searchText = event.target.value;
    this.getAllOther();
  }

  closePopup() {
    this.isSubmitted = false;
    this.othersForm.reset();
    this.othersss.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewOthers();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllOther();
  }

  //-------Form Array Handling----------------
  newOthersForm(): FormGroup {
    return this.fb.group({
      category: [""],
      others: ["", [Validators.required]],
      description: [""],
      clinical_consideration: [""],
      normal_values: [""],
      abnormal_values: [""],
      contributing_factors_to_abnormal: [""],
      procedure: this.fb.group({
        before: [""],
        during: [""],
        after: [""],
      }),
      clinical_warning: [""],
      contraindications: [""],
      other: [""],
      link: [""],
      // name:["",[Validators.required]],
      active: [true],
    });
  }

  get othersss(): FormArray {
    return this.othersForm.get("othersss") as FormArray;
  }

  addNewOthers() {
    this.othersss.push(this.newOthersForm());
  }

  removeOthers(i: number) {
    this.othersss.removeAt(i);
  }
  // info-Imaging-details
  getOthersDetails(id) {
    let otherID = id;
    // console.log("this.othersId==========>", otherID);
    this.service.otherInfoDetailsApi(otherID).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.infoDetails = response?.data;
    });
    this.openVerticallyCenteredother(this.othercontent);
  }
  //  Add Other modal
  openVerticallyCenteredAddother(addothercontent: any) {
    this.modalService.open(addothercontent, {
      centered: true,
      size: "xl",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit Other modal
  openVerticallyCenterededitother(editothercontent: any, data: any) {
    this.editOthersForm.patchValue({
      otherTestId: data?._id,
      category: data?.category,
      others: data?.others,
      description: data?.description,
      clinical_consideration: data?.clinical_consideration,
      normal_values: data?.normal_values,
      abnormal_values: data?.abnormal_values,
      contributing_factors_to_abnormal: data?.contributing_factors_to_abnormal,
      procedure: {
        before: data?.procedure?.before,
        during: data?.procedure?.during,
        after: data?.procedure?.after,
      },
      clinical_warning: data?.clinical_warning,
      contraindications: data?.contraindications,
      other: data?.other,
      link: data?.link,
      active: data?.active,

    });
    this.modalService.open(editothercontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }

  // Imaging modal
  openVerticallyCenteredother(othercontent: any) {
    this.modalService.open(othercontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, othersId: any) {
    this.othersId = othersId;
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
      this.otherdataSource?.map((element) => {
        if (!this.selectedOthers.includes(element?._id)) {
          this.selectedOthers.push(element?._id);
        }
      });
    } else {
      this.selectedOthers = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedOthers.push(medicineId);
    } else {
      const index = this.selectedOthers.indexOf(medicineId);
      if (index > -1) {
        this.selectedOthers.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedOthers?.length === this.otherdataSource?.length && this.selectedOthers?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }
}
