import { CoreService } from "./../../../../shared/core.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { PharmacyPlanService } from "../../../pharmacy/pharmacy-plan.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { PendingPeriodicElement } from "src/app/modules/super-admin/super-admin-totaleclaims/super-admin-totaleclaims.component";
import { MatTableDataSource } from "@angular/material/table";
import { SuperAdminHospitalService } from "src/app/modules/super-admin/super-admin-hospital.service";
import { HospitalService } from "../../hospital.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";
export interface PeriodicElement {
  date: string;
  claimid: string;
  claimType: string;
  prescribercentre: string;
  insuranceprovider: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  rejectamount: string;
  // comments: string;
  status: string;
  detail: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-hospitalizationclaims',
  templateUrl: './hospitalizationclaims.component.html',
  styleUrls: ['./hospitalizationclaims.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customdropdown' },
    },
  ],
})
export class HospitalizationclaimsComponent implements OnInit {
  displayedColumns: string[] = [
    "status",
    "date",
    "claimid",
    // "makeClaim",
    "claimType",
    "prescribercentre",
    "doctorname",
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
  pharmacyId: any;
  claimStatus: any = "pending";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  @ViewChild("select") select: MatSelect;
  allSelected = false;
  foods: any[] = [
    // { value: "ASCOMA", viewValue: "ASCOMA" },
    // { value: "Coris", viewValue: "Coris" },
    // { value: "yelen", viewValue: "yelen" },
  ];
  selectedinsurance: any = [];
  statusCountData: any;
  pendingdataSource: MatTableDataSource<PendingPeriodicElement>;
  locationList12: any;
  hospitalIds: any;
  doctorList: any;
  hospitalName: any;
  userRole: any;
  userPermission: any;
  innerMenuPremission: any = [];

  constructor(
    private pharmacyPlanService: PharmacyPlanService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: NgxUiLoaderService,
    private hospitalservice: HospitalService,
  ) {
    let user = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.hospitalName = adminData.hospital_name;

    if (this.userRole === "HOSPITAL_STAFF") {
      this.pharmacyId = adminData?.in_hospital;

    } else {
      this.pharmacyId = user?._id;

    }
    this.userRole = user?.role;

    this.userPermission = user?.permissions;
  }

  ngOnInit(): void {

    //this.getClaimList();
    this.getAllInsurance();
    this.getDoctorList();
    // this.getStatusCount();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }

  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id", menuID)
    if (checkData) {
      if (checkData.isChildKey == true) {
        var checkSubmenu = checkData.submenu;
        if (checkSubmenu.hasOwnProperty("health_plan")) {
          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;
          console.log(`exist in the object.`);
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
        console.log("innerMenuPremission________", this.innerMenuPremission);

      }
    }
  }
  giveInnerPermission(value) {
    if (this.userRole === "HOSPITAL_STAFF") {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    } else {
      return true;

    }
  }
  private getAllInsurance() {
    const param = {
      page: 1,
      limit: 0,
      searchText: '',
      startDate: '',
      endDate: ''
    }
    this.pharmacyPlanService.getApprovedInsurance(param).subscribe({
      next: async (res) => {
        const encryptedData = await res;


        let result = this.coreService.decryptObjectData(encryptedData);
        console.log('insurance details', result);
        if (result.status) {

          // this.insuraneList = result.body.result;

          result.body.result.map((curentval, index) => {


            this.foods.push({
              viewValue: curentval.company_name,
              value: curentval.for_portal_user._id
            });
          })



        } else {
          this.coreService.showError(result.message, '');
        }

      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
  }

  getDoctorList() {
    let reqData = {
      page: this.page,
      limit: 1000,
      hospital_portal_id: this.pharmacyId,
      searchText: "",
    };
    console.log(reqData, "RESPONSE==========>12");

    this.hospitalservice.getDoctorsList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE==========>", response);
      this.doctorList = response?.data?.data;
      const data = this.doctorList
      const idArray = data.map(item => item.for_portal_user._id);
      this.hospitalIds = idArray.join(',');
      console.log(this.hospitalIds, "hospitalIdsss____");
      this.getClaimList();
      this.getStatusCount();

      // this.dataSourceRequests = response?.data?.data;
      this.totalLength = response?.data?.totalCount;
    });
  }

  getAllHospitalList(sort: any = '') {
  }

  getClaimList() {
    let reqData = {
      status: this.claimStatus,
      createdByIds: this.hospitalIds,
      limit: this.pageSize,
      page: this.page,
      hospitalName: this.hospitalName,
      insuranceIds: this.selectedinsurance.join(",")
    };
    console.log(reqData, "check data ");

    this.pharmacyPlanService.medicineClaimListDoctorHospitalization(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("All Medicine claims ---->", response);
      this.dataSource = response?.data?.result;
      this.totalLength = response?.data?.totalRecords;
    });
  }

  pendingCounts: any;
  approvedCounts: any;
  rejectedCounts: any;
  resubmitCounts: any;
  pre_authorizationCounts: any;

  getStatusCount() {

    let reqData = {
      pharmacyId: this.hospitalIds,
    };
    console.log(reqData, "reqdtasdfs");

    this.pharmacyPlanService.medicineClaimCountByStatusPharmacyDoctorHospital(reqData.pharmacyId, this.selectedinsurance.join(","))
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log(this.hospitalIds, "COUNT CLAIMS BY STATUS==============>", response);
        this.statusCountData = response?.data;
      });
  }

  onTabChange(tab: any) {
    console.log("Tab ---->", tab);
    this.claimStatus = tab;
    this.getClaimList();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getClaimList();
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  findvalue(fieldname: any, data: any) {
    let findobject = [];
    if (data) {
      findobject = data.filter((element: any) => {
        return (element.fieldName == fieldname)
      })
    }
    else {
      findobject = [];
    }
    if (findobject.length > 0) {
      return findobject[0].fieldValue
    } else {
      return '';
    }

  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {


      if (!item.selected) {

        newStatus = false;
        if (this.selectedinsurance.indexOf(item.value) != -1) {
          this.selectedinsurance.splice(this.selectedinsurance.indexOf(item.value), 1);
        }
      }
      else {
        console.log("tejhgjdksfksd" + item.value, this.selectedinsurance.indexOf(item.value));
        if (this.selectedinsurance.indexOf(item.value) == -1) {
          this.selectedinsurance.push(item.value);
        }
      }
    });
    this.allSelected = newStatus;
    this.getClaimList();
    this.getStatusCount();
    console.log(this.selectedinsurance, "selectedinsurance");

  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  editclaim(claim_id, type = '') {
    // this.router.navigate(["/individual-doctor/claims/medicalsubmitclaim"], {
    //   queryParams: { claim_id: claim_id, type: type },
    // });
  }

  // goToNewEdit(claimId) {
  //   this.router.navigate([`/hospital/claims/hospitalizationclaimsdetails/${claimId}`],
  //   queryParams: { claim_id: claim_id, type: type }
  //   )
  // }

  async goToNewEdit(claimId) {
    
    console.log(claimId, "check full element");
    this.router.navigate(["/hospital/claims/hospitalizationclaimsdetails"], {
      queryParams: {
        claimId: claimId,
      },
    });
  }


  exportLab() {
    this.loader.start();
    var data: any = [];   
    let reqData = {
      status: this.claimStatus,
      createdByIds: this.hospitalIds,
      limit: 100000,
      page: this.page,
      hospitalName: this.hospitalName,
      insuranceIds: this.selectedinsurance.join(",")      
    };
    this.pharmacyPlanService.medicineClaimListDoctorHospitalization(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.loader.stop();
        var array = [
          "status",
          "date",
          "claim_id",
          "claim_type",
          "prescriber_center",
          "doctor_name",
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

        var fileName = 'medicalconsultationExcel.xlsx';

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
      }
    });
  }
}
