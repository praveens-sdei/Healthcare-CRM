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
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";

// Imaging table data
export interface ImagingPeriodicElement {
  imagingname: string;
  addedby: string;
}
const IMAGING_ELEMENT_DATA: ImagingPeriodicElement[] = [
  { imagingname: "Abdominal", addedby: "Hospital" },
  { imagingname: "Abdominal", addedby: "Hospital" },
  { imagingname: "Abdominal", addedby: "Hospital" },
  { imagingname: "Abdominal", addedby: "Hospital" },
];

@Component({
  selector: "app-imaging",
  templateUrl: "./imaging.component.html",
  styleUrls: ["./imaging.component.scss"],
})
export class ImagingComponent implements OnInit {
  // Imaging table data
  imagingdisplayedColumns: string[] = [
    "createdAt",
    "imagingname",
    "addedby",
    "status",
    "action",
  ];
  imagingdataSource: any = [];
  editImagingdataForm!: FormGroup;
  imagingdataForm!: FormGroup;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  userType: any;
  imagingdataId: any;
  searchText: any = "";
  selectedFiles: any;
  infoDetails: any;
  sortColumn: string = 'imaging';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  @ViewChild("imagingcontent", { static: false }) imagingcontent: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
    private _superAdminService: SuperAdminService,
    private loader : NgxUiLoaderService
  ) {
    this.editImagingdataForm = this.fb.group({
      imagingTestId: ["", [Validators.required]],
    
        imaging: ["", [Validators.required]],
      category: [""],     
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
      active: [true],
     
    });

    this.imagingdataForm = this.fb.group({
      imagingdatass: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllImagingList(`${column}:${this.sortOrder}`);
  }
  ngOnInit(): void {
    this.addNewimagingdata();
    this.getAllImagingList(`${this.sortColumn}:${this.sortOrder}`);

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
        if (checkSubmenu.hasOwnProperty("imaging")) {
          this.innerMenuPremission = checkSubmenu['imaging'].inner_menu;
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
  
  imagingExcleForm: FormGroup = new FormGroup({
    imaging_csv: new FormControl("", [Validators.required]),
  });

  excleSubmit() {
    this.isSubmitted = true;
    if (this.imagingExcleForm.invalid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this.service.uploadExcelImaging(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("formData======>", response);
        if (response.status) {
          this.loader.stop();
          this.selectedFiles='';
          this.getAllImagingList();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
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
    link.setAttribute("href", "assets/doc/imgingTest.xlsx");
    link.setAttribute("download", `imagingSampleExcel.xlsx`);
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
  // exportImaging() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-imaging-test-master";
  // }


  exportImaging() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this._superAdminService.imagingTestMasterListforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status == true){
          this.loader.stop();
          var array = ["category",
            "imaging",
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
            "link"];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'ImagingExcel.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }


  getAllImagingList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
      sort:sort
    };

    this.service.listImagingApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("IMAGING LIST===>", response)
      this.totalLength = response?.data?.count;
      this.imagingdataSource = response?.data?.result;
    });
  }

  addImaging() {
    this.isSubmitted = true;
    if (this.imagingdataForm.invalid) {
      this._coreService.showError("","Please Fill All the fields")
      return;
    } 
      this.isSubmitted = false;
      this.loader.start();
    let reqData = {
      ImagingTestArray: this.imagingdataForm.value.imagingdatass,
      added_by: this.userId,
    };
    // console.log("addImaging============>", reqData);

    this.service.addImagingApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllImagingList();
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updateImaging() {
    this.isSubmitted = true;
    if (this.editImagingdataForm.invalid) {
      this._coreService.showError("", "Pleas fill all the required fields.")
      return;
    }    
    this.loader.start();
    let reqdata ={
      imagingTestId: this.editImagingdataForm.value.imagingTestId,
      ImagingTestData :{
        imaging:this.editImagingdataForm.value.imaging,
        category:this.editImagingdataForm.value.category,     
        description:this.editImagingdataForm.value.description,
        clinical_consideration:this.editImagingdataForm.value.clinical_consideration,
        normal_values:this.editImagingdataForm.value.normal_values,
        abnormal_values:this.editImagingdataForm.value.abnormal_values,
        contributing_factors_to_abnormal:this.editImagingdataForm.value.contributing_factors_to_abnormal,
        procedure: {
          before:this.editImagingdataForm.value.procedure.before,
          during:this.editImagingdataForm.value.procedure.during,
          after:this.editImagingdataForm.value.procedure.after,
        },
        clinical_warning:this.editImagingdataForm.value.clinical_warning,
        contraindications:this.editImagingdataForm.value.contraindications,
        other:this.editImagingdataForm.value.other,
        link:this.editImagingdataForm.value.link,
        active: this.editImagingdataForm.value.active,
      }
    }
    this.service.updateImagingApi(reqdata).subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("editImagingdataForm=========>", response);

        if (response.status) {
          this.loader.stop();
          this.getAllImagingList();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  selectedImagings: any = [];

  deleteImaging(action_value: boolean, action_name: any, isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      imagingTestId: this.imagingdataId,
      action_name: action_name,
      action_value: action_value,
    };

    if (isDeleteAll === "all") {
      reqData.imagingTestId = "";
    }

    if (isDeleteAll === "selected") {
      reqData.imagingTestId = this.selectedImagings;
    }

    console.log("REQ DATA Delete --->", reqData);

    this.service.deleteImagingApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getAllImagingList();
        this.toastr.success(response.message);
        this.closePopup();
        this.selectedImagings = []
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  handledeleteChange(event: any, imagingdataId: any) {
    (this.imagingdataId = imagingdataId),
      this.deleteImaging(event.checked, "delete");
  }

  handletoggleChange(event: any, imagingdataId: any) {
    (this.imagingdataId = imagingdataId),
      this.deleteImaging(event.checked, "active");
  }

  handleSearchimagingdata(event: any) {
    this.searchText = event.target.value;
    this.getAllImagingList();
  }

  closePopup() {
    this.isSubmitted = false;
    this.imagingExcleForm.reset();
    this.imagingdataForm.reset();
    this.imagingdatass.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewimagingdata();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllImagingList();
  }

  //-------Form Array Handling----------------
  newimagingdataForm(): FormGroup {
    return this.fb.group({
      imaging: ["", [Validators.required]],
      category: [""],     
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
      active: [true],
    });
  }

  get imagingdatass(): FormArray {
    return this.imagingdataForm.get("imagingdatass") as FormArray;
  }

  addNewimagingdata() {
    this.imagingdatass.push(this.newimagingdataForm());
  }

  removeimagingdata(i: number) {
    this.imagingdatass.removeAt(i);
  }
  // info-Imaging-details
  getImagingDetails(id: any) {
    let imagingID = id;
    this.service.otherImagingDetailsApi(imagingID).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.infoDetails = response?.data;
    });
    this.openVerticallyCenteredimaging(this.imagingcontent);
  }

  //  Add Imaging modal
  openVerticallyCenteredAddimaging(addimagingcontent: any) {
    this.modalService.open(addimagingcontent, {
      centered: true,
      size: "xl",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit Imaging modal
  openVerticallyCenterededitimaging(editimagingcontent: any, data: any) {
      console.log("data==========>", data);

    this.editImagingdataForm.patchValue({
      imagingTestId: data?._id,
      imaging:  data?.imaging,
      category: data?.category,
      others: data?.others,
      description: data?.description,
      clinical_consideration: data?.clinical_consideration,
      normal_values: data?.normal_values,
      abnormal_values: data?.abnormal_values,
      contributing_factors_to_abnormal: data?.abnormal_values,
      procedure: {
        before: data?.procedure?.before,
        during:  data?.procedure?.during,
        after: data?.procedure?.after,
      },
      clinical_warning: data?.clinical_warning,
      contraindications: data?.contraindications,
      other: data?.other,
      link: data?.link,
      active: data?.active,    
     
    });

    this.modalService.open(editimagingcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }

  // Imaging modal
  openVerticallyCenteredimaging(imagingcontent: any) {
    this.modalService.open(imagingcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, imagingdataId: any) {
    this.imagingdataId = imagingdataId;
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
      this.imagingdataSource?.map((element) => {
        if (!this.selectedImagings.includes(element?._id)) {
          this.selectedImagings.push(element?._id);
        }
      });
    } else {
      this.selectedImagings = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedImagings.push(medicineId);
    } else {
      const index = this.selectedImagings.indexOf(medicineId);
      if (index > -1) {
        this.selectedImagings.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (this.selectedImagings?.length === this.imagingdataSource?.length && this.selectedImagings?.length != 0) {
      allSelected = true;
    }
    return allSelected;
  }
}
