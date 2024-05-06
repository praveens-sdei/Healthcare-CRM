import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyPlanService } from '../../pharmacy-plan.service';

export interface PeriodicElement {
  purchasedate: string;
  subscriptionplanname: string;
  invoiceno: string;
  planprice: string;
  plantype:string;
  expirydate: string;
  status:string;
  // action:string;
  id:string;
  services:string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { purchasedate: '11/18/2019' ,subscriptionplanname: 'Plan B', invoiceno: '54489165658414',planprice:'$299.00', plantype: 'Quaterly',expirydate:'02/18/2020',status:''},
//   { purchasedate: '11/18/2019' ,subscriptionplanname: 'Plan B', invoiceno: '54489165658414',planprice:'$299.00', plantype: 'Quaterly',expirydate:'02/18/2020',status:''},
//   { purchasedate: '11/18/2019' ,subscriptionplanname: 'Plan B', invoiceno: '54489165658414',planprice:'$299.00', plantype: 'Quaterly',expirydate:'02/18/2020',status:''},
//   { purchasedate: '11/18/2019' ,subscriptionplanname: 'Plan B', invoiceno: '54489165658414',planprice:'$299.00', plantype: 'Quaterly',expirydate:'02/18/2020',status:''},
//   { purchasedate: '11/18/2019' ,subscriptionplanname: 'Plan B', invoiceno: '54489165658414',planprice:'$299.00', plantype: 'Quaterly',expirydate:'02/18/2020',status:''},
//   { purchasedate: '11/18/2019' ,subscriptionplanname: 'Plan B', invoiceno: '54489165658414',planprice:'$299.00', plantype: 'Quaterly',expirydate:'02/18/2020',status:''},
// ];

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
  selector: 'app-subscriptionplanhistory',
  templateUrl: './subscriptionplanhistory.component.html',
  styleUrls: ['./subscriptionplanhistory.component.scss']
})
export class SubscriptionplanhistoryComponent implements OnInit {

  displayedColumns: string[] = ['purchasedate', 'subscriptionplanname','features', 'invoiceno', 'planprice','plantype','expirydate','status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  localStorageUserData:any;
  // globalStatus:any='expired';
  isPlanActive:boolean=false;

  userID:any=""
  userRole:any=""

  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  

  constructor(private pharmacyService:PharmacyPlanService,private _coreService:CoreService) {
    // this.localStorageUserData = this._coreService.getLocalStorage('loginData');

    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role

    if(loginData?.role === 'PHARMACY_ADMIN') this.userID = loginData?._id;
    if(loginData?.role === 'PHARMACY_STAFF')  this.userID = adminData?.for_staff;


  }


  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getSubscriptionPlan(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getSubscriptionPlan(`${this.sortColumn}:${this.sortOrder}`);

  }

  getSubscriptionPlan(sort:any='')
  {
    let param = {
      page:1,
      limit:100,
      // user_id:this.localStorageUserData._id
      user_id:this.userID,
      sort:sort
    }
    this.pharmacyService.getPurchasedPlanOfUser(param).subscribe({
      next:(res)=>{
        let result = this._coreService.decryptContext(res);
        console.log("result............",result);

        let getData = (expiry_date:any)=>{
          let d = new Date();
          var g1 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          // (YYYY, MM, DD) 
          let statusData;
          var g2 = new Date(expiry_date);
          if (g1.getTime() < g2.getTime())
          statusData = 'active';
          else if (g1.getTime() > g2.getTime())
          statusData = 'expired';
      
          // this.globalStatus = statusData;
          return statusData;
        };

      let purData: any = [];
      result.body.data.forEach((val: any)=>{



        if (getData(val.expiry_date) === "active") this.isPlanActive = true;

        purData.push({
          purchasedate: val.createdAt,
          subscriptionplanname: val.subscription_plan_name,
          invoiceno: val.invoice_number,
          planprice: val.plan_price,
          plantype: val.plan_type,
          expirydate: val.expiry_date,
          status: getData(val.expiry_date),
          // action: "",
          id: val._id,
          services:val?.services
        })
      });

      this.dataSource = purData;
        
      }
    })
    
  }

}
