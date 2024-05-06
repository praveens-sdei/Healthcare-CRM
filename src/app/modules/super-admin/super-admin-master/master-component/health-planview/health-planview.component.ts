import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "src/app/modules/insurance/insurance.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import * as XLSX from "xlsx";

export interface PeriodicElement {
  category: string;
  primarySecondaryCatLimit:string;
  primarySecondaryServcLimit:string;
  service: string;
  reimbursmentrate: string;
  servicelimit: string;
  repaymentcondition: string;
  categorylimit: string;
  categorycondition: string;
  preauthorization: string;
  waitingperiod: string;
  waitingperiodredeemed: string;
  comment:string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

export interface PaymentPeriodicElement {
  categoryofexclusion: string;
  medicinename: string;
  brandname: string;
  comment: string;
}

const EXPLORE_DATA: PaymentPeriodicElement[] = [];
@Component({
  selector: 'app-health-planview',
  templateUrl: './health-planview.component.html',
  styleUrls: ['./health-planview.component.scss']
})
export class HealthPlanviewComponent implements OnInit {

  @ViewChild("TABLE") table: ElementRef;
  @ViewChild("EXCLUSION") exclusion: ElementRef;
  // @ViewChild("EXCLUSION_TABLE") exclusion_table: ElementRef;
  panelOpenState = false;
  displayedColumns: string[] = [
    "category",
    "primarySecondaryCatLimit",
    "categorylimit",
    "categorycondition",
    "service",
    "primarySecondaryServcLimit",
    "servicelimit",
    "repaymentcondition",
    "reimbursmentrate",
    "preauthorization",
    "waitingperiod",
    "waitingperiodredeemed",
    "comment"
  ];

  dataSource = ELEMENT_DATA;

  displayedColumnss: string[] = [
    "categoryofexclusion",
    "medicinename",
    "brandname",
    "comment",
  ];
  dataSources = EXPLORE_DATA;
  planId: any;
  planData: any;
  planServicesData: any;
  planExclusionData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: InsuranceService,
    private _coreService: CoreService
  ) {}

  addServiceForm() {}

  ngOnInit(): void {
    let plan_id = this.activatedRoute.snapshot.params["id"];
    // this.currentId = this.activeRoute.snapshot.params['id'];
    this.planId = plan_id;
    this.getPlanById();
    this.getPlanServices();
    this.getPlanExclusions();
  }

  
  getPlanById() {
    this.service.getPlanById(this.planId).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.planData = response.body;
    });
  }

  getPlanServices() {
    let reqData = {
      page: 1,
      limit: 1000,
      planId: this.planId,
    };
    this.service.listPlanServices(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.planServicesData = response.body.result;
    });
  }

  getPlanExclusions() {
    let reqData = {
      page: 1,
      limit: 1000,
      planId: this.planId,
    };

    this.service.listPlanExclusions(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.planExclusionData = response.body.result;
    });
  }

  handleServiceExport() {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ServiceSheet.xlsx");
  }

  handleExclusionExport() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.exclusion.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ExclusionSheet.xlsx");
  }
}
