import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../../super-admin.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";
// lab table data
export interface LabPeriodicElement {
  labtest: string;
  addedby: string;
}
const LAB_ELEMENT_DATA: LabPeriodicElement[] = [
];

@Component({
  selector: "app-lab",
  templateUrl: "./lab.component.html",
  styleUrls: ["./lab.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LabComponent implements OnInit {
  dataSource: any = [];
  labForm: FormGroup;
  editLabForm: FormGroup;
  excleForm: FormGroup;
  // lab table data
  labdisplayedColumns: string[] = ["createdAt", "labtest", "addedby", "status", "action"];
  labdataSource = LAB_ELEMENT_DATA;
  @ViewChild("addlabcontent", { static: false }) addlabcontent: any;
  @ViewChild("imporMedicine", { static: false }) imporMedicine: any;
  isSubmitted: boolean = false;
  selectedFiles: File;
  useDefault: boolean;
  eventdata: any;
  userId: any;
  page: any = 1;
  pageSize: number = 5;
  searchText: any = "";
  allLabDetails: any[] = [];
  totalLength: any;
  labId: any;
  id: any;
  category: any;
  lab_test: any;
  contributing_factors_to_abnormal_values: any;
  description: any;
  blood: any;
  urine: any;
  clinical_warning: any;
  other: any;
  link: any;
  blood_low: any;
  blood_high: any;
  bloodprocess_before: any;
  blood_process_during: any;
  blood_process_after: any;
  urine_process_before: any;
  urine_process_during: any;
  urine_process_after: any;
  urine_high: any;
  urine_low: any;
  sortColumn: string = 'lab_test';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  selectedLabs: any = [];
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _superAdminService: SuperAdminService,
    private toastr: ToastrService,
    private _coreService: CoreService,
    private service: SuperAdminService,
    private loader : NgxUiLoaderService
  ) {
    let admin = this._coreService.getLocalStorage("loginData");
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.userId = admin._id;
    this.labForm = this.fb.group({
      lab: this.fb.array([]),
    });
    this.editLabForm = this.fb.group({
      category: [""],
      lab_test: ["", [Validators.required]],
      description: [""],
      contributing_factors_to_abnormal_values: [""],
      blood: [""],
      urine: [""],

      active: [""],

      blood_high: [""],
      blood_low: [""],

      urine_high: [""],
      urine_low: [""],

      bloodprocess_before: [""],
      blood_process_during: [""],
      blood_process_after: [""],

      urine_process_before: [""],
      urine_process_during: [""],
      urine_process_after: [""],

      clinical_warning: [""],
      other: [""],
      link: [""],
    });

    this.excleForm = this.fb.group({
      file: new FormControl("", [Validators.required]),
    });
  }
  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getlabList(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.addLabs();
    this.getlabList(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("lab")) {
          this.innerMenuPremission = checkSubmenu['lab'].inner_menu;
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

  labExcleForm: FormGroup = new FormGroup({
    lab_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.labExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("user_type", "superadmin");
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this._superAdminService.uploadExcelLab(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.selectedFiles = null;
          this.getlabList();
          this.toastr.success(response.message);
          this.handleClose();
        } else {
          this.loader.stop();
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
    link.setAttribute("href", "assets/doc/labTest.xlsx");
    link.setAttribute("download", `labSampleExcel.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  fileChange(event) {
    console.log("hjkkjkjk")
    let fileList: FileList = event.target.files;
    console.log(fileList, "fileList");

    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
    }
  }

  // exportLab() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-lab-test-master";
  // }

  exportLab() {
    /* generate worksheet */
    this.loader.start();
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService
      .getLabListDataexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = ["category",
            "lab_test", "description", "contributing_factors_to_abnormal_values",
            "normal_value_blood",
            "normal_value_urine",
            "possible_interpretation_of_abnormal_blood_value_high_levels",
            "possible_interpretation_of_abnormal_blood_value_low_levels",
            "possible_interpretation_of_abnormal_urine_value_high_levels",
            "possible_interpretation_of_abnormal_urine_value_low_levels",
            "blood_procedure_before",
            "blood_procedure_during",
            "blood_procedure_after",
            "urine_procedure_before",
            "urine_procedure_during",
            "urine_procedure_after",
            "clinical_warning",
            "other",
            "link"];
  
          data = result.data.array
          console.log("data1", data);
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'LabExcel.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }

  handletoggleChange(event: any, data: any) {
    this.loader.start();
    let reqData = {
      labTestId: data.id,
      action_name: "active",
      action_value: event.checked,
    };

    this._superAdminService.deleteLabs(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.getlabList();
        this.handleClose();
        this._coreService.showSuccess(response.message, "");
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  get lab() {
    return this.labForm.controls["lab"] as FormArray;
  }
  //  Add lab modal
  openVerticallyCenteredAddlab(addlabcontent: any) {
    this.modalService.open(addlabcontent, {
      centered: true,
      size: "xl",
      windowClass: "master_modal add_lab",
    });
  }
  updateLabs() {
    // console.log("working");
    this.isSubmitted = true;
    if (this.editLabForm.invalid) {
      this._coreService.showError("", "Please Fill All the fields")
      return;
    }
    this.isSubmitted = false;
    
    let data = {
      category: this.editLabForm.value.category,
      lab_test: this.editLabForm.value.lab_test,
      description: this.editLabForm.value.description,
      contributing_factors_to_abnormal_values:
        this.editLabForm.value.contributing_factors_to_abnormal_values,
      active: this.editLabForm.value.active,

      clinical_warning: this.editLabForm.value.clinical_warning,
      other: this.editLabForm.value.other,
      link: this.editLabForm.value.link,
    };

    let normal_value = {
      blood: this.editLabForm.value.blood,
      urine: this.editLabForm.value.urine,
    };
    let possible_interpretation_of_abnormal_blood_value = {
      high_levels: this.editLabForm.value.blood_high,
      low_levels: this.editLabForm.value.blood_low,
    };
    let possible_interpretation_of_abnormal_urine_value = {
      high_levels: this.editLabForm.value.urine_high,
      low_levels: this.editLabForm.value.urine_low,
    };
    let blood_procedure = {
      before: this.editLabForm.value.bloodprocess_before,
      during: this.editLabForm.value.blood_process_during,
      after: this.editLabForm.value.blood_process_after,
    };
    let urine_procedure = {
      before: this.editLabForm.value.urine_process_before,
      during: this.editLabForm.value.urine_process_during,
      after: this.editLabForm.value.urine_process_after,
    };

    let array = {
      category: data.category,
      lab_test: data.lab_test,
      description: data.description,
      contributing_factors_to_abnormal_values:
        data.contributing_factors_to_abnormal_values,
      active: data.active,

      urine_procedure: urine_procedure,
      blood_procedure: blood_procedure,
      possible_interpretation_of_abnormal_urine_value:
        possible_interpretation_of_abnormal_urine_value,
      possible_interpretation_of_abnormal_blood_value:
        possible_interpretation_of_abnormal_blood_value,
      normal_value: normal_value,

      clinical_warning: data.clinical_warning,
      other: data.other,
      link: data.link,
    };
    this.loader.start();
    let reqData = {
      labTestId: this.id,
      labTestData: array,
    };

    this._superAdminService.updateLabAddTest(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.getlabList();
        this.toastr.success(response.message);
        this.handleClose();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  //  Edit lab modal
  openVerticallyCenterededitlab(editlabcontent: any, data: any) {
    this.id = data.id;

    this.editLabForm.patchValue({
      category: data.category,
      lab_test: data.labTest,
      description: data.description,
      contributing_factors_to_abnormal_values:
        data.contributing_factors_to_abnormal_values,
      active: data.status,

      blood: data.normal_value.blood,
      urine: data.normal_value.urine,

      blood_high:
        data.possible_interpretation_of_abnormal_blood_value.high_levels,
      blood_low:
        data.possible_interpretation_of_abnormal_blood_value.low_levels,

      urine_high:
        data.possible_interpretation_of_abnormal_urine_value.high_levels,
      urine_low:
        data.possible_interpretation_of_abnormal_urine_value.low_levels,

      bloodprocess_before: data.blood_procedure.before,
      blood_process_during: data.blood_procedure.during,
      blood_process_after: data.blood_procedure.after,

      urine_process_before: data.urine_procedure.before,
      urine_process_during: data.urine_procedure.during,
      urine_process_after: data.urine_procedure.after,

      clinical_warning: data.clinical_warning_val,
      other: data.other,
      link: data.link,
    });

    this.modalService.open(editlabcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }

  openVerticallyCenteredsecond(deletePopup: any, labId: any) {
    this.labId = labId;

    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  // labtest  modal
  openVerticallyCenteredlabtest(labtestcontent: any, element: any) {
    this.category = element.category;
    this.lab_test = element.labTest;
    this.description = element.description;
    this.contributing_factors_to_abnormal_values =
      element.contributing_factors_to_abnormal_values;
    //this.active= element.status,

    this.blood = element.normal_value.blood;
    this.urine = element.normal_value.urine;

    this.blood_high =
      element.possible_interpretation_of_abnormal_blood_value.high_levels;
    this.blood_low =
      element.possible_interpretation_of_abnormal_blood_value.low_levels;

    this.urine_high =
      element.possible_interpretation_of_abnormal_urine_value.high_levels;
    this.urine_low =
      element.possible_interpretation_of_abnormal_urine_value.low_levels;

    this.bloodprocess_before = element.blood_procedure.before;
    this.blood_process_during = element.blood_procedure.during;
    this.blood_process_after = element.blood_procedure.after;

    this.urine_process_before = element.urine_procedure.before;
    this.urine_process_during = element.urine_procedure.during;
    this.urine_process_after = element.urine_procedure.after;

    this.clinical_warning = element.clinical_warning_val;
    this.other = element.other;
    this.link = element.link;

    this.modalService.open(labtestcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
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
  reset() {
    this.labForm.reset();
  }
  deleteLabs(index: number) {
    this.lab.removeAt(index);
  }
  addLabs() {
    const newLab = this.fb.group({
      category: [""],
      lab_test: ["", [Validators.required]],
      description: [""],
      contributing_factors_to_abnormal_values: [""],

      blood: [""],
      urine: [""],

      active: [true],

      blood_high: [""],
      blood_low: [""],

      urine_high: [""],
      urine_low: [""],

      bloodprocess_before: [""],
      blood_process_during: [""],
      blood_process_after: [""],

      urine_process_before: [""],
      urine_process_during: [""],
      urine_process_after: [""],

      clinical_warning: [""],
      other: [""],
      link: [""],
    });
    this.lab.push(newLab);
  }
  deletelab(isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      labTestId: "",
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.labTestId = "";
    } else {
      reqData.labTestId = this.selectedLabs;
    }

    console.log("REQUEST DATA LABS===>", reqData);

    this._superAdminService.deleteLabs(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.getlabList();
        this.toastr.success(response.message);
        this.handleClose();
        this.selectedLabs = []
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleSearchCategory(event: any) {
    this.searchText = event.target.value;
    this.getlabList();
  }

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    console.log("open");
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "md",
      windowClass: "master_modal import",
    });
  }

  addlabhere() {
    this.isSubmitted = true;
    if (this.labForm.invalid) {
      return;
    } else {
      this.isSubmitted = false;

      let array = [];

      this.labForm.value.lab.forEach((data) => {
        array.push({
          category: data.category,
          lab_test: data.lab_test,
          description: data.description,
          contributing_factors_to_abnormal_values:
            data.contributing_factors_to_abnormal_values,
          normal_value: {
            blood: data.blood,
            urine: data.urine,
          },
          possible_interpretation_of_abnormal_blood_value: {
            high_levels: data.blood_high,
            low_levels: data.blood_low,
          },
          possible_interpretation_of_abnormal_urine_value: {
            high_levels: data.urine_high,
            low_levels: data.urine_low,
          },
          blood_procedure: {
            before: data.bloodprocess_before,
            during: data.blood_process_during,
            after: data.blood_process_after,
          },
          urine_procedure: {
            before: data.urine_process_before,
            during: data.urine_process_during,
            after: data.urine_process_after,
          },

          clinical_warning: data.clinical_warning,
          other: data.other,
          link: data.link,
          active: data.active,
        });
      });
      let added_by = {
        user_id: this.userId,
        user_type: "superadmin",
      };
      this.loader.start();
      
      let reqdata = {
        labTestArray: array,
        added_by: added_by,
      };

      console.log("LAB REQ DATA===>", reqdata);

      this._superAdminService.labAddTest(reqdata).subscribe((res: any) => {
        let response = this._coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.handleClose();
          this.getlabList();
        } else if (response.status == false) {
          this.loader.stop();
          this.toastr.error(response.message);
          this.handleClose();

        }
      });
    }
  }

  handleClose() {
    this.isSubmitted = false;
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.modalService.dismissAll("close");
    this.lab.clear();
    this.labForm.reset();
    this.excleForm.reset();
    this.addLabs();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getlabList();
  }

  getlabList(sort: string = '') {
    // this.loading = true;
    this._superAdminService
      .getLabListData(this.page, this.pageSize, this.searchText, sort)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });

        this.allLabDetails = [];
        this.allLabDetails = result.data.result;

        let pendingData: any = [];

        result.data.result.forEach((val: any, index: number) => {
          let labData = {
            labTest: val.lab_test,
            addedby: "healthcare-crm",
            status: val?.active,
            action: "",
            id: val._id,
            urine_procedure: val.urine_procedure,
            possible_interpretation_of_abnormal_blood_value:
              val.possible_interpretation_of_abnormal_blood_value,
            possible_interpretation_of_abnormal_urine_value:
              val.possible_interpretation_of_abnormal_urine_value,
            other: val.other,
            normal_value: val.normal_value,
            link: val.link,
            is_deleted: val.is_deleted,
            description: val.description,
            contributing_factors_to_abnormal_values:
              val.contributing_factors_to_abnormal_values,
            clinical_warning_val: val.clinical_warning,
            category: val.category,
            blood_procedure: val.blood_procedure,
            added_by: val.added_by,
            createdAt: val?.createdAt
          };
          pendingData.push(labData);
          this.allLabDetails.push(val);
        });
        // this.loading = false;
        this.dataSource = pendingData;
        this.totalLength = result.data.count;
      });
  }

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.dataSource?.map((element) => {
        if (!this.selectedLabs.includes(element?.id)) {
          this.selectedLabs.push(element?.id);
          console.log(this.selectedLabs?.push(element?.id), "event check");
        }
      });
    } else {
      this.selectedLabs = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedLabs.push(medicineId);
    } else {
      const index = this.selectedLabs.indexOf(medicineId);
      if (index > -1) {
        this.selectedLabs.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (this.selectedLabs?.length === this.dataSource?.length && this.selectedLabs?.length != 0) {
      allSelected = true;
    }
    // console.log("check allselected", allSelected);
    return allSelected;
  }
}
