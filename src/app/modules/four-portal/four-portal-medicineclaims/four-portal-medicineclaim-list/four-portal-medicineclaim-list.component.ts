import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { PharmacyPlanService } from 'src/app/modules/pharmacy/pharmacy-plan.service';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../../patient/patient.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
export interface PeriodicElement {
  date: string;
  claimid: string;
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
  comments: string;
  status: string;
  detail: string;
}

const ELEMENT_DATA: PeriodicElement[] = []

@Component({
  selector: 'app-four-portal-medicineclaim-list',
  templateUrl: './four-portal-medicineclaim-list.component.html',
  styleUrls: ['./four-portal-medicineclaim-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customdropdown' },
    },
  ],
})
export class FourPortalMedicineclaimListComponent implements OnInit {

  displayedColumns: string[] = [
    "status",
    "date",
    "claimid",
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
  patientId: any;
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
  loggedType: any;
  constructor(
    private pharmacyPlanService: PharmacyPlanService,
    private coreService: CoreService,
    private loader : NgxUiLoaderService,
    private router: Router,
    private patientSerivice: PatientService,
  ) { }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.loggedType = this.coreService.getLocalStorage("loginData").type;

    console.log(user?._id, "userid check");

    this.patientId = user?._id;
    this.getClaimList();
    this.getStatusCount();
    this.getAllInsurance();
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

  getClaimList() {
    let reqData = {
      status: this.claimStatus,
      patientId: this.patientId,
      limit: this.pageSize,
      page: this.page,
      insuranceIds: this.selectedinsurance.join(","),
      claimType: this.loggedType + "-order"
    };
    this.patientSerivice.medicineClaimListLabImaging(reqData).subscribe((res) => {
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
    this.patientSerivice
      .medicineClaimCountByStatusLabImagin(this.patientId, this.loggedType + "-order")
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.statusCountData = response.data;
        console.log("COUNT CLAIMS BY STATUS==============>", response);
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
    console.log(this.selectedinsurance, "selectedinsurance");

  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  editclaim(claim_id, type = '') {
    // console.log("preauth", preAuthReclaimId)
    // if (preAuthReclaimId != '') {
    //   type = "pre-auth";
    //   claim_id = preAuthReclaimId
    // }
    this.router.navigate([`/portals/claims/${this.loggedType}/submitclaim`], {
      queryParams: { claim_id: claim_id, type: type },
    });


  }

  goToNew() {
    this.router.navigate([`/portals/claims/${this.loggedType}/submitclaim`])
  }

  goToNewEdit(claimId) {
    this.router.navigate([`/portals/claims/${this.loggedType}/details/${claimId}`])
  }


  exportLab() {
    
    
    this.loader.start();
    var data: any = [];   
    let reqData = {
      status: this.claimStatus,
      patientId: this.patientId,
      limit: 100000,
      page: this.page,
      insuranceIds: this.selectedinsurance.join(","),
      claimType: this.loggedType + "-order"
    };
    this.patientSerivice.medicineClaimListLabImaging(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });     
        if(response.status == true){
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
  
          var fileName = 'patientAppointmentExcel.xlsx';
  
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
