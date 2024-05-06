import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../insurance.service';

export interface PeriodicElement {
  purchasedate: string;
  subscriptionplanname: string;
  transactionid: string;
  planamount: string;
  action:string;
  id:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  ];


@Component({
  selector: 'app-insurance-paymenthistory',
  templateUrl: './insurance-paymenthistory.component.html',
  styleUrls: ['./insurance-paymenthistory.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class InsurancePaymenthistoryComponent implements OnInit {

  displayedColumns: string[] = ['purchasedate', 'subscriptionplanname', 'transactionid', 'planamount', 'action'];
  dataSource = ELEMENT_DATA;
  localStorageUserData:any;

  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';


  constructor(private _coreService:CoreService,private insuranceService:InsuranceService) {
    this.localStorageUserData = this._coreService.getLocalStorage('loginData');

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

  getSubscriptionPlan(sort:any='') {
    let param = {
      page: 1,
      limit: 1000,
      user_id: this.localStorageUserData._id,
      sort:sort
    }
    this.insuranceService.getPurchasedPlanOfUser(param).subscribe({
      next: (res) => {

        let result = this._coreService.decryptContext(res);

        console.log("------------------------DTA",  result);

        let purData: any = [];
        result?.body?.data.forEach((val: any) => {

          purData.push({
            purchasedate: val.createdAt,
            subscriptionplanname: val.subscription_plan_name,
            transactionid: val.invoice_number,
            planamount: val.plan_price,
            action: "",
            id: val._id
          })
        });

        this.dataSource = purData;

      }
    })

  }

}
