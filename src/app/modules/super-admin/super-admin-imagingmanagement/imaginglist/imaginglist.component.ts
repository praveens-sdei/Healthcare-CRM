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
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatTabGroup } from "@angular/material/tabs";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { LabimagingdentalopticalService } from "../../labimagingdentaloptical.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

export type IVerifyStatus = "APPROVED" | "PENDING" | "DECLINED";
// Pending request table
export interface PendingPeriodicElement {
  doctorname: string;
  licenceid: number;
  specialty: string;
  licencevalidity: string;
  email: string;
  phonenumber: string;
  province: string;
  // department: string;
  // service: string;
  // unit: string;
  experience: string;
}
const PENDING_ELEMENT_DATA: PendingPeriodicElement[] = [];

@Component({
  selector: 'app-imaginglist',
  templateUrl: './imaginglist.component.html',
  styleUrls: ['./imaginglist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImaginglistComponent implements OnInit {

   // Pending request table
   pendingdisplayedColumns: string[] = [
    "doctorname",
    "licenceid",
    // "specialty",
    "licencevalidity",
    "email",
    "phonenumber",
    "province",
    // "department",
    // "service",
    // "unit",
    "experience",
    // "lockuser",
    // "action",
  ];
  pendingdataSource = new MatTableDataSource<PendingPeriodicElement>(
    PENDING_ELEMENT_DATA
  );

  // Approved request table
  

  // Reject request table
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.pendingdataSource.paginator = this.paginator;
     
  }

  superAdminId: any;
  imagingId: any = "";
  abc: any = "Lock";
  def:any = "Active";
 

  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  isSubmitted: boolean = false;
  verifyStatus: IVerifyStatus = "PENDING";
  statusList: IVerifyStatus[] = ["PENDING", "APPROVED", "DECLINED"];
  public selectedTabIndex = 0;

  searchText = "";
 
  startDate: string = null;
  endDate: string = null;
  displayedColumns: string[];


  sortColumn: string = 'full_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  @ViewChild("lockOrUnloackmodal") lockOrUnloackmodal: TemplateRef<any>;
  @ViewChild("activeOrInactivemodal") activeOrInactivemodal: TemplateRef<any>;
  @ViewChild("statusTab", { static: false }) tab: MatTabGroup;
  constructor(
    private modalService: NgbModal,
    private coreService: CoreService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private route :Router,
    private labimagingdentaloptical :LabimagingdentalopticalService,
    private loader: NgxUiLoaderService
  ) {
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getImagingList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    let adminData = JSON.parse(localStorage.getItem("loginData"));
    this.superAdminId = adminData?._id;
    this.resetDate();
    this.getImagingList(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this.coreService.getLocalStorage("adminData").permissions;
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

  private getImagingList(sort:any=''): void {
    this.pushColumns();
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      status: this.verifyStatus,
      searchText: this.searchText,
      from_date: this.startDate,
      to_date: this.endDate,
      sort:sort,
      type : "Laboratory-Imaging"
    };

    console.log("REQUEST DATA===>", reqData);

    this.labimagingdentaloptical.laboratoryList(reqData).subscribe(async (res) => {
      let response = await this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE LIST====>", response);
      this.totalLength = await response?.data?.totalCount;

      this.pendingdataSource = new MatTableDataSource<PendingPeriodicElement>(
        response?.data?.data
      );
    });
  }

  private lastYearDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString();
  }

  public onEndDateChange(data: MatDatepickerInputEvent<Date>): void {
    this.endDate= (data.value).toISOString();
    this.getImagingList()
  }

  public onStartDateChange(data: MatDatepickerInputEvent<Date>): void {
    this.startDate = (data.value).toISOString();
    this.getImagingList()  
  }

  private resetDate(): void {
    this.startDate = this.lastYearDate();
    this.endDate = new Date().toISOString();
  }

  approveOrRejectImaging(action: any) {
    let reqData = {
      verify_status: action,
      approved_or_rejected_by: this.superAdminId,
      doctor_portal_id: this.imagingId,
    };
    this.loader.start();
    console.log("REQUEST DATA FOR APPROVE OR REJECT===>", reqData);

    this.labimagingdentaloptical.approveOrRejectLabimagingdentaloptical(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE FOR REJECT OR APPROVED====>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getImagingList();
          if (action === "APPROVED") {
            this.route.navigate([
              "/super-admin/individuallaboratory-imaging/permission",
              this.imagingId,
            ]);
          }
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  activeLockDeleteImaging(action: string, value: boolean) {
    let reqData = {
      doctor_portal_id: this.imagingId,
      action_name: action,
      action_value: value,
      type: "Laboratory-Imaging"
    };
    this.loader.start();
    console.log("REQUEST DATA=========>", reqData);

    this.labimagingdentaloptical.activeLockDeleteLabimagingdentaloptical(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE================>", response);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getImagingList();
        
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  handleToggleChange(event: any, id: any) {
    console.log(event);
    this.imagingId = id;
    if (event.checked === false) {
      this.abc = "Unlock";
    } else {
      this.abc = "Lock";
    }
    this.modalService.open(this.lockOrUnloackmodal);
  }

  public onChangestatus(event: any, id: any) {
    this.imagingId = id;
    if (event.checked === false) {
      this.def = "InActive";
    } else {
      this.def = "Active";
    }
    this.modalService.open(this.activeOrInactivemodal);
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getImagingList()
  }

  

  clearFilter() {
    this.searchText = "";
    this.resetDate();
    this.getImagingList();
  }

  public onTabChanged(data: { index: number }): void {
    this.resetPagination();
    this.verifyStatus = this.statusList[data.index];
    this.getImagingList();
  }

  private resetPagination(): void {
    this.page = 1;
    this.pageSize = 5;
    this.totalLength = 0;
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any, id: any) {
    this.imagingId = id;
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
    this.imagingId = id;
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
    this.imagingId = id;
    this.modalService.open(deletemodal, { centered: true, size: "md" });
  }

  public handlePageEvent(data: { pageIndex: number; pageSize: number }): void {
    
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.verifyStatus = this.statusList[this.selectedTabIndex];
    this.getImagingList();
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
