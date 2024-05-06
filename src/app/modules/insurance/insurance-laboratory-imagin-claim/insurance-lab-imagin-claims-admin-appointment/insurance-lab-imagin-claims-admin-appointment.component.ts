import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InsuranceService } from '../../insurance.service';
import { CoreService } from 'src/app/shared/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PharmacyPlanService } from 'src/app/modules/pharmacy/pharmacy-plan.service';
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
  selector: 'app-insurance-lab-imagin-claims-admin-appointment',
  templateUrl: './insurance-lab-imagin-claims-admin-appointment.component.html',
  styleUrls: ['./insurance-lab-imagin-claims-admin-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceLabImaginClaimsAdminAppointmentComponent implements OnInit {

  displayedColumns: string[] = [
    "status",
    "date",
    "claimid",
    // "makeClaim",
    "prescribercentre",
    "insuranceprovider",
    "insuranceholder",
    "insuranceid",
    "patient",
    "reimbursmentrate",
    "totalamount",
    "paidbypatient",
    "requestedamount",
    "approvedamount",
    "rejectamount",
    "Resubmit Reason",
    "Action",
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

  innerMenuPremission:any=[];
  sortColumn: string = 'mediclaimcommoninfosData.status';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  loggedType: string;
  loggedPortalType: string;
  constructor(
    private service: InsuranceService,
    private coreService: CoreService,
    private router: Router,
    private pharmacyPlanService: PharmacyPlanService,
    private route: ActivatedRoute,private loader: NgxUiLoaderService,
  ) {
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
   }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getMedicineClaimList(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.loggedPortalType = params.get('path');
      console.log("this.loggedPortalType", this.loggedPortalType);

    });
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.route.paramMap.subscribe(params => {
      this.loggedType = params.get('path');
      console.log("this.loggedType===", this.loggedType);

    });

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

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      
        console.log("checkSubmenu-------------1",checkSubmenu);
          
        if(this.loggedType === 'Dental'){
          if (checkSubmenu.hasOwnProperty("make-dental-claim")) {
            this.innerMenuPremission = checkSubmenu['make-dental-claim'].inner_menu;
            console.log(` exists in the object.`);
          } else {
            console.log(`does not exist in the object.`);
          }
        } 
        
        
        if(this.loggedType === 'Optical'){
          if (checkSubmenu.hasOwnProperty("make-optical-claim")) {
            this.innerMenuPremission = checkSubmenu['make-optical-claim'].inner_menu;
            console.log(` exists in the object.`);
          } else {
            console.log(`does not exist in the object.`);
          }
        }
        
        if(this.loggedType === 'Laboratory-Imaging'){
          if (checkSubmenu.hasOwnProperty("make-imaging-claim")) {
            this.innerMenuPremission = checkSubmenu['make-imaging-claim'].inner_menu;
            console.log(` exists in the object.`);
          } else {
            console.log(`does not exist in the object.`);
          }
        }

        if(this.loggedType === 'Paramedical-Professions'){
          if (checkSubmenu.hasOwnProperty("make-paramedical-professions-app-claim")) {
            this.innerMenuPremission = checkSubmenu['make-paramedical-professions-app-claim'].inner_menu;
            console.log(` exists in the object.`);
          } else {
            console.log(`does not exist in the object.`);
          }
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





  editclaim(claim_id, type = '') {
    this.router.navigate([`insurance/make-appointment-claim/submitclaim/${this.loggedType}`], {
      queryParams: { claim_id: claim_id, type: type },
    });
  }
  // insurance/medicalconsultation/submitclaim

  // getMedicineClaimList(sort: any = '') {
  //   let reqData = {
  //     insuranceId: this.userID,
  //     status: this.claimStatus,
  //     page: this.page,
  //     limit: this.pageSize,
  //     insuranceStaffRole: this.staffRole,
  //     insuranceStaffId: this.staffId,
  //     claimType: this.loggedPortalType,
  //     requestType: "medical-products",
  //     sort: sort
  //   };
  //   console.log("Req data----->", reqData);
  //   this.service.appointmentClaimListInsuranceAdmin(reqData).subscribe(
  //     (res) => {
  //       let response = this.coreService.decryptObjectData({ data: res });
  //       console.log("All CLaim List------>", response);
  //       this.dataSource = response?.data?.result;
  //       console.log(this.dataSource, "dataSource");

  //       // this.dataSource.mediclaimcommoninfosData.map((item) => {
  //       //   item.
  //       // })

  //       this.totalLength = response?.data?.totalRecords;
  //     },
  //     (err) => {
  //       let errorResponse = this.coreService.decryptObjectData({
  //         data: err.error,
  //       });
  //       console.log("Error Response -->", errorResponse);
  //     }
  //   );
  // }




  getMedicineClaimList(sort: any = '') {
    let reqData = {
      pharmacyIds: this.userID,
      status: this.claimStatus,
      page: this.page,
      limit: this.pageSize,
      insuranceStaffRole: this.staffRole,
      insuranceIds: "",
      claimType: this.loggedPortalType + "-appointment",
      requestType: "appointment-claim"
    };
    console.log("Req data----->", reqData);
    this.service.appointmentClaimListInsuranceAdmin(reqData).subscribe(
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
  // countClaims() {
  //   let reqData = {
  //     adminId: this.userID,
  //     role: this.staffRole,
  //     insuranceStaffId: this.staffId,
  //     claimType: "medicalConsultation",
  //     requestType: "medical-consultation"
  //   };
  //   console.log("COUNT REQUEST======>", reqData);
  //   this.service.medicineClaimCountByStatusInsuranceAdmin(reqData).subscribe((res) => {
  //     let response = this.coreService.decryptObjectData({ data: res });
  //     console.log("Count Cliams---->", response);
  //     this.statusCountData = response?.data;

  //   });
  // }

  countClaims() {
    let reqData = {
      pharmacyId: this.userID,
      // role: this.loggedType,
      fromDate: "",
      Todate: "",
      insuranceIds: this.staffId,
      claimType: this.loggedPortalType + "-appointment",
      // requestType: "medical-consultation"
    };
    console.log(reqData, "check request data");

    this.pharmacyPlanService.appointmentclaimInsuranceAdmin(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("COUNT CLAIMS BY STATUS==============>", response);
        this.statusCountData = response?.data;

      });
  }


  onTabChange(tab: string) {
    console.log("check log", tab);

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
    this.router.navigate(["/insurance/medicalconsultation/details"], {
      queryParams: {
        claimId: claimId,
      },
    });
  }


  goToNew() {
    this.router.navigate([`/insurance/make-appointment-claim/submitclaim/${this.loggedType}`])
  }


  handleViewDetailspage(claimId) {
    console.log(claimId);
    this.router.navigate(["/insurance/appointment-claim/details"], {
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
      pharmacyIds: this.userID,
      status: this.claimStatus,
      page: this.page,
      limit:100000,
      insuranceStaffRole: this.staffRole,
      insuranceIds: "",
      claimType: this.loggedPortalType + "-appointment",
      requestType: "appointment-claim"
    };
    console.log(reqData, "check data ");

    this.service.appointmentClaimListInsuranceAdmin(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.loader.stop();
        var array = [
          "status",
          "date",
          "claim_id",
          "prescriber_center",
          "insurance_provider",
          "insurance_holder",
          "insurance_id",
          "patient_name",
          "reimbursment_rate",
          "total_amount",
          "paid_by_patient",
          "request_amount",
          "approved_amount",
          "reject_amount",
          "resubmit_reason",
        ];



        data = response?.data?.exportdata;
        
        data.unshift(array);

        var fileName = 'pateintHospitalizationExcel.xlsx';

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
