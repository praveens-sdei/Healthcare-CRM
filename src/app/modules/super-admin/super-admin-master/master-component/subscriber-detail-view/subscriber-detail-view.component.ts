
import { InsuranceSubscriber } from 'src/app/modules/insurance/insurance-subscriber.service';
// import { InsuranceSubscriber } from './../../insurance-subscriber.service';
import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';

export interface PeriodicElement {
  category: string;
  service: string;
  reimbursmentrate: string;
  servicelimit:string;
  servicecondition:string;
  categorylimit:string;
  categorycondition:string;
  preauthorization:string;
  waitingperiod:string;
  waitingperiodredeemed:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { category: '', service: '', reimbursmentrate: '',servicelimit:'',servicecondition:'',categorylimit:'',categorycondition:'',preauthorization:'',waitingperiod:'',waitingperiodredeemed:''},
  
]

export interface PaymentPeriodicElement {
  categoryofexclusion: string;
  exclusioninninternationalnonpropertynames: string;
  brandname: string;
  comment:string;
}

const EXPLORE_DATA: PaymentPeriodicElement[] = [
  { categoryofexclusion: '', exclusioninninternationalnonpropertynames: '', brandname: '',comment:''},
]


@Component({
  selector: 'app-subscriber-detail-view',
  templateUrl: './subscriber-detail-view.component.html',
  styleUrls: ['./subscriber-detail-view.component.scss']
})
export class SubscriberDetailViewComponent implements OnInit {

  panelOpenState = false;

  displayedColumns: string[] = ['category', 'primarySecondarycatLimit','service','primarySecondaryServcLimit' ,'reimbursmentrate', 'servicelimit', 'servicecondition', 'categorylimit', 'categorycondition', 'preauthorization', 'waitingperiod', 'waitingperiodredeemed'];
  dataSource = ELEMENT_DATA;

  displayedColumnss: string[] = ['categoryofexclusion', 'exclusioninninternationalnonpropertynames', 'brandname','comment',];
  dataSources = EXPLORE_DATA;
  subscriberID: any;
  subscriberDetails: any = {
    subscription_for: '',
    subscriber_first_name: '',
    subscriber_last_name: '',
    gender: '',
    date_of_birth: '',
    age: '',
    insurance_id: '',
    insurance_validity_from: '',
    insurance_validity_to: '',
    policy_id: '',
    card_id: '',
    employee_id: '',
    insurance_holder_name: '',
    reimbersement_rate: '',
    health_plan_for: {
      name: '',
      description: '',
      total_care_limit: {
        primary_care_limit: '',
        secondary_care_limit: '',
        grand_total: ''
      }
    }
  };

  constructor(private insuranceSubscriber: InsuranceSubscriber, private _coreService: CoreService) { 
    const splitArray = window.location.href.split('/')
    this.subscriberID = splitArray[splitArray.length - 1];
    this.viewSubscriberDetails()
  }

  ngOnInit(): void {
  }

  viewSubscriberDetails() {
    this.insuranceSubscriber.viewSubscriberDetails(this.subscriberID).subscribe((res: any) => {
      let data = []
      const decryptedData = this._coreService.decryptObjectData(JSON.parse(res))
      console.log(decryptedData, 'decryptedData');
      this.subscriberDetails = decryptedData.body.subscriber_details

      console.log(this.subscriberDetails,"subscriberDetailssss_____");
      

      // List all Plan service
      const plan_services = decryptedData.body.plan_services
      console.log(plan_services,"plan_servicesss____");
      
      for (const planservice of plan_services) {
        data.push({
          category: planservice.has_category ? planservice.has_category: '',
          service: planservice.service ? planservice.service : '',
          reimbursmentrate: planservice.reimbursment_rate,
          servicelimit: planservice.in_limit ? planservice.in_limit.service_limit : '',
          servicecondition: planservice.has_conditions ? planservice.has_conditions.repayment_condition.unit : '',
          categorylimit: planservice.in_limit ? planservice.in_limit.category_limit : '',
          categorycondition: planservice.has_conditions ? planservice.has_conditions.category_condition : '',
          preauthorization: planservice.pre_authorization,
          waitingperiod:planservice.waiting_period.duration.min_no +" "+planservice.waiting_period.duration.unit,
          waitingperiodredeemed: planservice.waiting_period.redeemed,
          primaryAndSecondaryCategoryLimit:planservice.primary_and_secondary_category_limit,
          primaryAndSecondaryServiceLimit:planservice.primary_and_secondary_service_limit,
        })
      }
      this.dataSource = data;

      //Make Array for plan exclusions
      const dataExclusionArray = []
      const plan_exclusion = decryptedData.body.plan_exclusion
      for (const planexclusion of plan_exclusion) {
        dataExclusionArray.push({
          categoryofexclusion: planexclusion.in_exclusion ? planexclusion.in_exclusion.category : '',
          exclusioninninternationalnonpropertynames: planexclusion.in_exclusion ? planexclusion.in_exclusion.name : '',
          brandname: planexclusion.in_exclusion ? planexclusion.in_exclusion.brand : '',
          comment: planexclusion.in_exclusion ? planexclusion.in_exclusion.comment : '',
        })
      }
      this.dataSources = dataExclusionArray;
      // console.log(this.dataSources, 'this.dataSources');
      
    });
  }

}
