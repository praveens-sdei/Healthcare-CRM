import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { InsuranceService } from "src/app/modules/insurance/insurance.service";

import { CoreService } from "src/app/shared/core.service";
import { HospitalService } from "../../hospital.service";

export interface PeriodicElement {
  purchasedate: string;
  subscriptionplanname: string;
  invoiceno: number;
  planprice: string;
  plantype: string;
  expirydate: string;
  status: string;
  // action: string;
  id: string;
  services:string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { purchasedate: '11/18/2019',subscriptionplanname: 'Plan B',invoiceno: 54489165658414, planprice: '$299.00',plantype: 'Quaterly',expirydate: '02/18/2020',status: 'Active'},
//   { purchasedate: '11/18/2019',subscriptionplanname: 'Plan B',invoiceno: 54489165658414, planprice: '$299.00',plantype: 'Quaterly',expirydate: '02/18/2020',status: 'Canceled'},

// ];

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = [
    "purchasedate",
    "subscriptionplanname",
    "features",
    "invoiceno",
    "planprice",
    "plantype",
    "expirydate",
    "status",
    // "action",
  ];
  dataSource = ELEMENT_DATA;
  localStorageUserData: any;
  globalStatus: any = "expired";
  userID: any = "";
  userRole: any = "";
  isPlanActive:boolean=false;

  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  constructor(
    private hospitalService: HospitalService,
    private _coreService: CoreService
  ) {
    // this.localStorageUserData = this._coreService.getLocalStorage('loginData');

    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userRole = loginData?.role;

    if (loginData?.role === "HOSPITAL_ADMIN") this.userID = loginData?._id;
    if (loginData?.role === "HOSPITAL_STAFF") this.userID = adminData?.in_hospital;

    this.getSubscriptionPlan(`${this.sortColumn}:${this.sortOrder}`);
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getSubscriptionPlan(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {}

  getSubscriptionPlan(sort:any='') {
    let param = {
      page: 1,
      limit: 10,
      // user_id: this.localStorageUserData._id,
      user_id: this.userID,
      sort:sort
    };
    this.hospitalService.getPurchasedPlanOfUser(param).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        console.log(result);

        let purData: any = [];

        let getData = (expiry_date: any) => {
          let d = new Date();
          var g1 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          // (YYYY, MM, DD)
          let statusData;
          var g2 = new Date(expiry_date);
          if (g1.getTime() < g2.getTime()) statusData = "active";
          else if (g1.getTime() > g2.getTime()) statusData = "expired";

          // this.globalStatus = statusData;
          return statusData;
        };


        result.body.data.forEach((val: any) => {

          if (getData(val.expiry_date) === "active") this.isPlanActive = true;
         

          purData.push({
            purchasedate: val.createdAt,
            subscriptionplanname: val.subscription_plan_name,
            invoiceno: val.invoice_number,
            planprice: val.plan_price,
            plantype: val.plan_type,
            expirydate: val.expiry_date,
            status: getData(val.expiry_date),
            action: "",
            id: val._id,
            services:val?.services
          });


        });

        this.dataSource = purData;
      },
    });
  }
}
