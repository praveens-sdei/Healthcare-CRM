import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminService } from "../../super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  createdAt: string;
  typeofhealthcenter: string;
  hospitalname: string;
  phonenumber: string;
  address: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-hospital",
  templateUrl: "./hospital.component.html",
  styleUrls: ["./hospital.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "typeofhealthcenter",
    "hospitalname",
    "phonenumber",
    "address",
    "action",
  ];

  dataSource: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedCsv: any = null;
  searchText: any = "";
  hospitalId: any = "";

  selectfilename: any = "";

  sortColumn: string = 'type';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission: any = [];
  loginrole: any;
  selectedLabs: any = [];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  constructor(
    private modalService: NgbModal,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private router: Router,
    private loader : NgxUiLoaderService
  ) {
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
  }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getHospitaList(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
    this.getHospitaList(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {
    let userPermission = this.coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if (checkData) {
      if (checkData.isChildKey == true) {
        var checkSubmenu = checkData.submenu;
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
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
      console.log("this.innerMenuPremission----------", this.innerMenuPremission);

    }
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    } else {
      return true;
    }
  }

  addHospital(routeFor: any, hospitalId: any) {
    console.log(routeFor,"Check",hospitalId);
    
    if (routeFor === "add") {
      this.router.navigate(["super-admin/openhour/hospital/addHospital"]);
    } else {
      this.router.navigate(["super-admin/openhour/hospital/editHospital", hospitalId]);
    }
  }

  deleteHospital() {
    this.loader.start();
    let reqData = {
      hospitalId: this.hospitalId,
    };

    this.superAdminService
      .deleteHospitalBySuperadmin(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.loader.stop();
          this.coreService.showSuccess("", response.message);
          this.modalService.dismissAll("close");
          this.getHospitaList();
        }
      });
  }

  getHospitaList(sort: any = '') {
    let reqData = {
      searchText: this.searchText,
      page: this.page,
      limit: this.pageSize,
      sort: sort
    };

    this.superAdminService
      .listHospitalBySuperadmin(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Res--->", response);
        if (response.status) {
          this.dataSource = response?.data?.result;
          this.totalLength = response?.data?.totalRecords;
        }
      });
  }

  handleSearchChange(event) {
    console.log(event);
    this.searchText = event;
    this.getHospitaList();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getHospitaList();
  }

  // Add on duty group modal
  openVerticallyCenteredaddhospital(addhospital: any) {
    this.modalService.open(addhospital, {
      centered: true,
      size: "lg",
      windowClass: "add_hospital_content",
    });
  }

  // Edit Pharmacy modal
  openVerticallyCenterededithospital(edithospital: any) {
    this.modalService.open(edithospital, {
      centered: true,
      size: "lg",
      windowClass: "add_hospital_content",
    });
  }

  // View Pharmacy modal
  openVerticallyCenteredviewhospital(viewhospital: any) {
    this.modalService.open(viewhospital, {
      centered: true,
      size: "lg",
      windowClass: "add_hospital_content",
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

  selectFile(file: any) {
    this.selectedCsv = file.target.files[0];
    console.log("Selected file--->", file.target.files[0]);
    this.selectfilename = file.target.files[0].name;
  }

  uploadCsvHospital() {
    const formdata = new FormData();
    formdata.append("file", this.selectedCsv);
    this.loader.start();
    this.superAdminService.uploadBulkCsvHospital(formdata).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("response--->", response);
        if (response.status) {
          this.loader.stop();
          this.coreService.showSuccess("", response.message);
          this.closePopup();
          this.selectedCsv = null;
          this.getHospitaList();
          this.selectfilename = "";
        } else {
          this.loader.stop();
          if (response.errorCode == null) {
            this.coreService.showInfo("", response.message);
            this.closePopup();
            this.selectfilename = "";
            this.selectedCsv = null;
          } else {
            this.coreService.showError("", response.message);
            this.closePopup();
            this.selectfilename = "";
            this.selectedCsv = null;
          }
        }
      },
      (err) => {
        let errResponce = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.coreService.showError("", errResponce.message);
      }
    );
  }

  downloadSampleExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
 
      link.setAttribute("href", "assets/doc/sample-hospital.xlsx");
      link.setAttribute("download", `sample-hospital.xlsx`);
  
    document.body.appendChild(link);
    link.click();
    link.remove();

  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.selectfilename = "";
    this.selectedCsv = null;
  }

  openVerticallyCenteredEditplan(imporsubscriber: any) {
    this.modalService.open(imporsubscriber, {
      centered: true,
      windowClass: "import_subscribes",
    });
  }

  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, hospitalId: any) {
    this.hospitalId = hospitalId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }


  deletelab(isDeleteAll: any = "") {   
    let reqData = {
      ondutytId: "",
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.ondutytId = "";
    } else {
      reqData.ondutytId = this.selectedLabs;
    }

    console.log("REQUEST DATA LABS===>", reqData);
    this.loader.start();

    this.superAdminService.deleteHospitalMasterAction(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.getHospitaList();
        // this.toastr.success(response.message);
        this.closePopup();
        this.selectedLabs = []
      } else {
        this.loader.stop();
        // this.toastr.error(response.message);
      }
    });
  }

  handleCheckBoxChange(event, medicineId) {
    console.log(event, "sdfsdf", medicineId);

    if (event.checked == true) {
      this.selectedLabs.push(medicineId);
    } else {
      const index = this.selectedLabs.indexOf(medicineId);
      if (index > -1) {
        this.selectedLabs.splice(index, 1);
      }
    }
  }

  makeSelectAll(event: any) {
    console.log(event, "check event all");

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


  isAllSelected() {
    let allSelected = false;
    if (this.selectedLabs?.length === this.dataSource?.length && this.selectedLabs?.length != 0) {
      allSelected = true;
    }
    return allSelected;
  }
}
