import { CoreService } from "./../../../../shared/core.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { PharmacyPlanService } from "../../../pharmacy/pharmacy-plan.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { HospitalService } from "src/app/modules/hospital/hospital.service";
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
  // comments: string;
  status: string;
  detail: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-patient-hospitalclaim-list',
  templateUrl: './patient-hospitalclaim-list.component.html',
  styleUrls: ['./patient-hospitalclaim-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customdropdown' },
    },
  ],
})
export class PatientHospitalclaimListComponent implements OnInit {

  displayedColumns: string[] = [
    "status",
    "date",
    "claimid",
    "claimType",
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

  sortColumn: string = 'mediclaimcommoninfosData.status';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  constructor(
    private pharmacyPlanService: PharmacyPlanService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private _hospitalService: HospitalService,
    private loader: NgxUiLoaderService,
  ) { }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getClaimList(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.pharmacyId = user?._id;
    this.getClaimList(`${this.sortColumn}:${this.sortOrder}`);
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

  getClaimList(sort: any = '') {
    let reqData = {
      status: this.claimStatus,
      createdByIds: [this.pharmacyId],
      limit: this.pageSize,
      page: this.page,
      insuranceIds: this.selectedinsurance.join(","),
      sort: sort
    };
    console.log(reqData, "check data ");

    this.pharmacyPlanService.medicineClaimListHospitalclaimExtensionFinal(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("All Medicine claims ---->", response);
      this.dataSource = response?.data?.result;
      console.log("All Medicine claims ---->", this.dataSource);
      this.totalLength = response?.data?.totalRecords;
    });
  }

  pendingCounts: any;
  approvedCounts: any;
  rejectedCounts: any;
  resubmitCounts: any;
  pre_authorizationCounts: any;

  getStatusCount() {
    this.pharmacyPlanService
      .medicineClaimCountByStatusHospitalClaimExtensionFinal(this.pharmacyId, this.selectedinsurance.join(","))
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("COUNT CLAIMS BY STATUS==============>", response);
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
  editclaim(claim_id, claimtype = '') {
    this.router.navigate(["/patient/hospitalization/submitclaim"], {
      queryParams: { claim_id: claim_id, claimtype: claimtype },
    });
  }


  exportLab() {
    console.log(("check funvtiob"));

    /* generate worksheet */
    this.loader.start();
    var data: any = [];
    // this.pageSize = 10;
    let reqData = {
      status: this.claimStatus,
      createdByIds: [this.pharmacyId],
      limit: 100000,
      // page: this.page,
      insuranceIds: this.selectedinsurance.join(","),
      // sort: sort
    };
    console.log(reqData, "check data ");

    this.pharmacyPlanService.medicineClaimListHospitalclaimExtensionFinal(reqData).subscribe((res) => {
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