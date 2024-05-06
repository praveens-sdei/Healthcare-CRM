import { SuperAdminHospitalService } from "./../../super-admin-hospital.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatTabGroup } from "@angular/material/tabs";
import { NgxUiLoaderService } from "ngx-ui-loader";

// Pending request table
export interface PendingPeriodicElement {
  hospitalname: string;
  ifunumber: number;
  licenceid: number;
  rccmnumber: number;
  email: string;
  phonenumber: string;
  // specialty: string;
  location: string;
}
const PENDING_ELEMENT_DATA: PendingPeriodicElement[] = [];

// Approved request table
export interface ApprovedPeriodicElement {
  hospitalname: string;
  ifunumber: number;
  licenceid: number;
  rccmnumber: number;
  email: string;
  phonenumber: string;
  // specialty: string;
  country: string;
  totaldoctors: number;
  joineddate: string;
}
const APPROVED_ELEMENT_DATA: ApprovedPeriodicElement[] = [];

// Reject request table
export interface RejectPeriodicElement {
  hospitalname: string;
  ifunumber: number;
  licenceid: number;
  rccmnumber: number;
  email: string;
  phonenumber: string;
  // specialty: string;
  country: string;
  totaldoctors: number;
  joineddate: string;
}
const REJECT_ELEMENT_DATA: RejectPeriodicElement[] = [];

@Component({
  selector: "app-hospitallist",
  templateUrl: "./hospitallist.component.html",
  styleUrls: ["./hospitallist.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HospitallistComponent implements OnInit {
  // Pending request table
  pendingdisplayedColumns: string[] = [
    "hospitalname",
    "ifunumber",
    "licenceid",
    "rccmnumber",
    "email",
    "phonenumber",
    // "specialty",
    "location",
    // "lockuser",
    // "action",
  ];
  pendingdataSource = new MatTableDataSource<PendingPeriodicElement>(
    PENDING_ELEMENT_DATA
  );

  // Approved request table
  approveddisplayedColumns: string[] = [
    "hospitalname",
    "ifunumber",
    "licenceid",
    "rccmnumber",
    "email",
    "phonenumber",
    // "specialty",
    "country",
    "totaldoctors",
    "joineddate",
    "lockuser",
    "action",
  ];
  approveddataSource = new MatTableDataSource<ApprovedPeriodicElement>(
    APPROVED_ELEMENT_DATA
  );

  // Reject request table
  rejectdisplayedColumns: string[] = [
    "hospitalname",
    "ifunumber",
    "licenceid",
    "rccmnumber",
    "email",
    "phonenumber",
    // "specialty",
    "country",
    "totaldoctors",
    "joineddate",
    "lockuser",
    "action",
  ];
  rejectdataSource = new MatTableDataSource<RejectPeriodicElement>(
    REJECT_ELEMENT_DATA
  );

  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  verifyStatus: any = "PENDING";
  statusList: any[] = ["PENDING", "APPROVED", "DECLINED"];
  public selectedTabIndex = 0;

  abc: any = "Lock";
  def:any = "Active";
  superAdminId: any;
  hospitalId: any = "";

  searchText: any = "";
  start_date: any = "";
  end_date: any = "";
  displayedColumns: string[];

  sortColumn: string = 'hospital_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  @ViewChild("statusTab", { static: false }) tab: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("lockOrUnloackmodal") lockOrUnloackmodal: TemplateRef<any>;
  @ViewChild("activeOrInactivemodal") activeOrInactivemodal: TemplateRef<any>;
  ngAfterViewInit() {
    // this.getAllHospitalList("pending");
  }

  constructor(
    private modalService: NgbModal,
    private _superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private datePipe: DatePipe,
    private hospitalService: SuperAdminHospitalService,
    private toastr: ToastrService,
    private route: Router,
    private loader: NgxUiLoaderService
  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllHospitalList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    let superAdminData = JSON.parse(localStorage.getItem("adminData"));
    this.superAdminId = superAdminData?._id;
    this.getAllHospitalList(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
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

  getAllHospitalList(sort:any='') {
    this.pushColumns();
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      status: this.verifyStatus,
      searchKey:this.searchText,
      sort:sort
    };

    console.log("REQUEST DATA===>", reqData);

    this.hospitalService.hospitalList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE LIST====>", response);
      this.totalLength = response?.data?.totalCount;

      this.pendingdataSource = new MatTableDataSource<PendingPeriodicElement>(
        response?.data?.data
      );
      // if (this.verifyStatus === "PENDING") {
        
      // } else if (this.verifyStatus === "APPROVED") {
      //   this.pendingdataSource =
      //     new MatTableDataSource<ApprovedPeriodicElement>(response?.data?.data);
      // } else {
      //   this.pendingdataSource = new MatTableDataSource<RejectPeriodicElement>(
      //     response?.data?.data
      //   );
      // }
    });
  }

  approveOrRejectHospital(action: any) {
    let reqData = {
      action: action,
      approved_or_rejected_by: this.superAdminId,
      id: this.hospitalId,
    };
    this.loader.start();
    console.log("REQUEST DATA FOR APPROVE OR REJECT===>", reqData);

    this.hospitalService.approveOrRejectHospital(reqData).subscribe(
      (res) => {
        console.log("RESPONSE FOR REJECT OR APPROVED====>", res);
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("RESPONSE FOR REJECT OR APPROVED====>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getAllHospitalList();
          if (action === "APPROVED") {
            this.route.navigate([
              "/super-admin/hospital/permission",
              this.hospitalId,
            ]);
          }
        }
      },
      (err) => {
        let errResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  // public handlePageEvent(data: { pageIndex: number; pageSize: number }): void {
  //   this.page = data.pageIndex + 1;
  //   this.pageSize = data.pageSize;
  //   this.getAllHospitalList();
  // }

  public handlePageEvent(data: { pageIndex: number; pageSize: number }): void {

    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.verifyStatus = this.statusList[this.selectedTabIndex];
    this.getAllHospitalList();
  }


  handleData(event: any, type: string) {}

  public onTabChanged(data: { index: number }): void {
    //this.resetPagination();
    this.verifyStatus = this.statusList[data.index];
    this.getAllHospitalList();
  }
  

  private resetPagination(): void {
    this.page = 1;
    this.pageSize = 5;
    this.totalLength = 0;
  }

  handleToggleChange(event: any, id: any) {
    console.log(event);
    this.hospitalId = id;
    if (event.checked === false) {
      this.abc = "Unlock";
    } else {
      this.abc = "Lock";
    }
    this.modalService.open(this.lockOrUnloackmodal);
  }

  activeLockDeleteHospital(action: any, value: boolean) {
    console.log(action,"-----------",value);
    let reqData = {
      hospital_portal_id: this.hospitalId,
      action_name: action,
      action_value: value,
    };
    this.loader.start();
    console.log("REQUEST DATA======>", reqData);

    this.hospitalService.activeLockDeleteHospital(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE=====>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllHospitalList();
        this.closePopup();
      }
    });
  }

  public onChangestatus(event: any, id: any) {
    this.hospitalId = id;
    if (event.checked === false) {
      this.def = "InActive";
    } else {
      this.def = "Active";
    }
    this.modalService.open(this.activeOrInactivemodal);
  }

  updateHospitalstatus(action: any, value: boolean) {
    let reqData = {
      hospital_portal_id: this.hospitalId,
      action_name: action,
      action_value: value,
    };
    console.log("REQUEST DATA==>>>>====>", reqData);

    this.hospitalService.activeLockDeleteHospital(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.closePopup();
      }
    });
  }

  openVerticallyCenteredsecond(deleteModal: any, _id: any) {
    this.hospitalId = _id;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getAllHospitalList()
  }

  handleSearchDateChange(date: any, text: any) {
    let formattedDate = this.datePipe.transform(date, "MM/dd/YYYY");
    console.log("DATE====>", formattedDate);

    if (text === "start_date") {
      this.start_date = date;
    } else {
      this.end_date = date;
    }
  }

  clearFilter() {
    this.searchText = "";
    this.start_date = "";
    this.end_date = "";
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any, id: any) {
    this.hospitalId = id;
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
      keyboard: false,
      backdrop: false,
    });
  }

  //  Reject modal
  openVerticallyCenteredreject(reject: any, id: any) {
    this.hospitalId = id;
    this.modalService.open(reject, {
      centered: true,
      size: "md",
      windowClass: "reject_data",
      keyboard: false,
      backdrop: false,
    });
  }

  //  Delete modal
  openVerticallyCentereddetale(deletemodal: any, id: any) {
    this.hospitalId = id;
    this.modalService.open(deletemodal, { centered: true, size: "md" });
  }

  //  Reasone for block modal
  openVerticallyCenteredreasoneforblockblock(reasoneforblock: any) {
    this.modalService.open(reasoneforblock, { centered: true, size: "md" });
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  pushColumns() {
    if (this.verifyStatus === 'PENDING') {
      this.displayedColumns = ['createdAt',...this.pendingdisplayedColumns,'action'];
    }
    if (this.verifyStatus === 'APPROVED') {
      this.displayedColumns = ['updatedAt',...this.pendingdisplayedColumns,'status', 'lockuser','action'];
    }
    if (this.verifyStatus === 'DECLINED') {
      this.displayedColumns = ['rejectedAt',...this.pendingdisplayedColumns,'action'];
    }
  }
}
