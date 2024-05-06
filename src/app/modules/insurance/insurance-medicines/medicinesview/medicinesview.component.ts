import { ViewroleComponent } from "./../../../hospital/hospital-rolemanagment/viewrole/viewrole.component";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "../../insurance.service";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
export interface PeriodicElement {
  date: string;
  claimid: string;
  prescribercentre: string;
  providingcentre: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  comments: string;
  status: string;
  detail: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-medicinesview",
  templateUrl: "./medicinesview.component.html",
  styleUrls: ["./medicinesview.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MedicinesviewComponent implements OnInit {
  displayedColumns: string[] = [
    "status",
    "date",
    "claimid",
    "makeClaim",
    "prescribercentre",
    "providingcentre",
    "insuranceholder",
    "insuranceid",
    "patient",
    "reimbursmentrate",
    "paidbypatient",
    "requestedamount",
    "totalamount",
    "approvedamount",
    "Resubmit Reason",
    // "comments",
    // "status",
    "detail",

  ];
  dataSource = ELEMENT_DATA;
  adminId: any = "";
  userID: any = "";
  staffId: any = ""
  userRole: any = "";
  staffRole: any = "INSURANCE_ADMIN";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  claimStatus: any = "pending";
  pending: any = 0;
  approved: any = 0;
  resubmit: any = 0;
  rejected: any = 0;
  classForStatus: any = "pending";
  statusCountData: any;

  sortColumn: string = 'roleData.name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];

  constructor(
    private service: InsuranceService,
    private coreService: CoreService,
    private router: Router,
    private loader: NgxUiLoaderService,
  ) { 
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
    // this.checkInnerPermission();
  }


  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getMedicineClaimList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    let role = loginData?.role;
    this.userRole = role;
    console.log("Role  of staff---->", adminData);
    if (role === "INSURANCE_ADMIN") {
      this.userID = loginData?._id;
    } else {
      this.userID = adminData?.for_user;
      if (adminData?.role) {
        console.log();
        let staffRole = adminData?.role;
        this.staffRole = staffRole?.name;
        this.staffId = loginData?._id;
      }
    }
    console.log("Role---->", role);
    console.log("User id =====>", this.userID);
    console.log("Role  of staff---->", this.staffRole);

    this.getMedicineClaimList(`${this.sortColumn}:${this.sortOrder}`);
    this.countClaims();
    // setTimeout(() => {
    //   this.checkInnerPermission();
    // }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");


    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log(userPermission,menuID,"checkData____________",checkData);
    

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;

        

        if (checkSubmenu.hasOwnProperty("medicine")) {

          this.innerMenuPremission = checkSubmenu['medicine'].inner_menu;


          console.log(` exists in the object.`);
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
    }

    
    

  }

  giveInnerPermission(value) {
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
        if (this.userRole === 'INSURANCE_STAFF') {
          const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
          // console.log("checkRequest__________", checkRequest)
          resolve(checkRequest ? checkRequest.status : false);
        } else {
          resolve(true);
        }
      // }, 2000);
    });
  }
  
  getMedicineClaimList(sort:any='') {
    let reqData = {
      insuranceId: this.userID,
      status: this.claimStatus,
      page: this.page,
      limit: this.pageSize,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
      sort:sort
    };
    console.log("Req data----->", reqData);
    this.service.medicineClaimList(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All CLaim List------>", response);
        this.dataSource = response?.data?.result;
        console.log(this.dataSource, "dataSource");

        // this.dataSource.mediclaimcommoninfosData.map((item) => {
        //   item.
        // })

        this.totalLength = response?.data?.totalRecords;
      },
      (err) => {
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        console.log("Error Response -->", errorResponse);
      }
    );
  }


  getValueResbmit(data) {
    console.log(data, "check log data")
  }
  countClaims() {
    let reqData = {
      insuranceId: this.userID,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId
    };
    console.log("COUNT REQUEST======>", reqData);
    this.service.countClaims(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Count Cliams---->", response);
      this.statusCountData = response?.data;
      // response.data.forEach((element) => {
      //   if (element?._id === "pending") {
      //     this.pending = element?.count;
      //   }
      //   if (element?._id === "approved") {
      //     this.approved = element?.count;
      //   }
      //   if (element?._id === "rejected") {
      //     this.rejected = element?.count;
      //   }
      //   if (element?._id === "resubmit") {
      //     this.resubmit = element?.count;
      //   }
      // });
    });
  }

  onTabChange(tab: string) {
    console.log(tab);
    this.claimStatus = tab;
    this.getMedicineClaimList();
    this.classForStatus = tab;
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getMedicineClaimList();
  }

  findvalue(fieldname: any, data: any) {
    let findobject = [];
    if (data) {
      findobject = data.filter((element: any) => {
        return element.fieldName == fieldname;
      });
    } else {
      findobject = [];
    }
    if (findobject.length > 0) {
      return findobject[0].fieldValue;
    } else {
      return "";
    }
  }

  async handleViewDetails(claimId) {
    console.log(claimId);
    this.router.navigate(["/insurance/medicines/details"], {
      queryParams: {
        claimId: claimId,
      },
    });
  }

  exportLab() {
    console.log(("check funvtiob"));

    /* generate worksheet */
    this.loader.start();
    var data: any = [];
    // this.pageSize = 10;
    let reqData = {
      insuranceId: this.userID,
      status: this.claimStatus,
      page: this.page,
      limit: 100000,
      insuranceStaffRole: this.staffRole,
      insuranceStaffId: this.staffId,
    };
    console.log(reqData, "check data ");

    this.service.medicineClaimList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.loader.stop();
        var array = [
          "status",
          "date",
          "make_claim", 
          "claim_id",
          "prescriber_center",
          "providing_centre",
          "insurance_holder",
          "insurance_id",
          "patient_name",
          "reimbursment_rate",          
          "paid_by_patient",
          "request_amount",
          "total_amount",
          "approved_amount",          
          "resubmit_reason"
        ];



        data = response?.data?.exportdata;
        
        data.unshift(array);

        var fileName = 'medicineclaim.xlsx';

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, fileName);
      }
    });
  }
}
