import { doctor } from "@igniteui/material-icons-extended";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "../../hospital.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  name: string;
  licenceid: number;
  licencevalidity: string;
  speciality: string;
  phonenumber: string;
  joineddate: string;
  department: string;
  service: string;
  unite: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-viewdental',
  templateUrl: './viewdental.component.html',
  styleUrls: ['./viewdental.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewdentalComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "licenceid",
    "licencevalidity",
    // "speciality",
    "phonenumber",
    "joineddate",
    "department",
    "service",
    "unite",
    "active",
    "lockuser",
    "action",
  ];
  dataSource: any = [];

  displayedColumnsRequests: string[] = [
    "name",
    "licenceid",
    "licencevalidity",
    // "speciality",
    "phonenumber",
    "joineddate",
    "unite",
    "action",
  ];
  dataSourceRequests: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  userId: any = "";
  searchText: any = "";
  role: any = "ALL";
  doctorId: any = "";

  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  doctorIdToBeApprovedOrReject: any = "";

  sortColumn: string = 'full_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  userType: any;
  route_type: string;
  userPermission: any;
  innerMenuPremission:any=[];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private service: HospitalService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private loader: NgxUiLoaderService
  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;
    this.userType = loginData?.type
    this.userPermission = loginData?.permissions;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.userId = admindata?.in_hospital;

    }else{
      this.userId = loginData?._id; 

    }
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getDentalList(`${column}:${this.sortOrder}`);
    this.getRequestList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });

     
    this.getDentalList(`${this.sortColumn}:${this.sortOrder}`);
    // this.getRequestList();
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
        if (checkSubmenu.hasOwnProperty("health_plan")) {
          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;  
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

  getDentalList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      hospital_portal_id: this.userId,
      searchText: this.searchText,
      sort:sort,
      type:'Dental'
    };
    console.log(reqData, "RESPONSE==========>12");
    this.service.getAllPortalsList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE==========>", response);
      this.dataSource = response?.data?.data;
      console.log("this.dataSource==========>", this.dataSource);
      // this.dataSourceRequests = response?.data?.data;
      this.totalLength = response?.data?.totalCount;
    });
  }

  getRequestList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      hospital_portal_id: this.userId,
      searchKey: this.searchText,
      sort:sort,
      type: 'Dental'
    };
    this.service.getFourPortalsRequestList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE REQUEST LIST==========>", response);
      // this.dataSource = response?.data?.data;
      this.dataSourceRequests = response?.data?.data;
      console.log("this.dataSourceRequests>>>>>",this.dataSourceRequests)
      this.totalLength = response?.data?.totalCount;
    });
  }

  activeLockDeleteDoctor(value: boolean, action: any) {
    this.loader.start();
    let reqData = {
      doctor_portal_id: this.doctorId,
      action_name: action,
      action_value: value,
      type: "Dental"
    };

    // console.log("REQUEST DATA==========>", reqData);

    this.service.activeLockDeleteLabimagingdentaloptical(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE==========>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.closePopup();
        this.getDentalList();
      }else{
        this.loader.stop();
      }
    });
  }

  handleToggleChange(status: boolean, id: any, action_name: any) {
    this.doctorId = id;
    this.activeLockDeleteDoctor(status, action_name);
  }

  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getDentalList();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getDentalList();
  }

  handleSelectRole(role: any) {
  }

  clearFilter() {
    this.searchText = "";
    this.role = "ALL";
    this.getDentalList();
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  openVerticallyCenteredsecond(deleteModal: any, _id: any) {
    this.doctorId = _id;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
  }

  tabFor: any = "DOCTORS";

  onTabChange(tab: string) {
    console.log("TAB CHANGED===>", tab);
    this.tabFor = tab;
    if(this.tabFor === "DOCTORS"){
      this.getDentalList();
    }else{
      this.getRequestList(`${this.sortColumn}:${this.sortOrder}`);
    }
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any, doctorId: any) {
    this.doctorIdToBeApprovedOrReject = doctorId;
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }

  //  Reject Appointment modal
  openVerticallyCenteredrejectappointment(
    rejectappointment: any,
    doctorId: any
  ) {
    this.doctorIdToBeApprovedOrReject = doctorId;

    this.modalService.open(rejectappointment, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }

  handleApproveorReject(action: any) {
    console.log("Approve or reject");
    this.loader.start();
    let reqData = {
      action: action,
      doctor_portal_id: this.doctorIdToBeApprovedOrReject,
      hospital_id: this.userId,
      type:'Dental'
    };

    console.log("REQ DATA====>", reqData);
    this.service.acceptOrRejectFourPortalRequest(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE ACCEPT/REJECT===>", response);
      if (response.status) {
        this.loader.stop();
        this.coreService.showSuccess(response.message, "");
        this.modalService.dismissAll('close');
        this.getDentalList();
        this.getRequestList();
      }else{
        this.loader.stop();
      }
    });
  }

}
