import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../../insurance.service';
import { environment } from "src/environments/environment";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlanComponent implements OnInit {
  planDetails:any;
  adminData:any="";
  planMessage:string;
  planStatus:boolean=false;
  planId: any='';
  PaymentMode: any;
  plandata: any;

  @ViewChild("mobilePaycontent", { static: false }) mobilePaycontent: any;

  mobilePayDetails: any;
  mobilePaynumbers: any;
  mobilePayForm!: FormGroup;
  selectedProvider: any;
  selectedProviderNumber: string = '';
  countryCodes:any;
  isSubmitted: boolean = false;
  loginData: any;
  insurance_id: any;
  constructor(private insuranceService:InsuranceService,
    private modalService: NgbModal,
    private _coresService:CoreService,private fb: FormBuilder,
    private route:Router) {
    this.subsriptionPlan();
    this.adminData = this._coresService.getLocalStorage("adminData");
    this.loginData = this._coresService.getLocalStorage("loginData");
    this.insurance_id = this.loginData?._id
    
     // Define the country codes array in your component
     this.countryCodes = ["+226(BF)","+229(BJ)", "+225(CI)", "+223(ML)", "+221(SN)", "+228(TG)"];
     this.mobilePayForm = this.fb.group({
       selectedProvider: [''], 
       mobilepaynumber: ['',[Validators.required]],
       countryCode: [this.countryCodes[0],[Validators.required]]
     });
 
     // Subscribe to changes in the selected provider dropdown
     this.mobilePayForm.get('selectedProvider').valueChanges.subscribe(selectedProviderId => {
       // Find the selected provider based on the ID
       const selectedProvider = this.mobilePayDetails.find(provider => provider._id === selectedProviderId);

       // Update the mobile pay number field with the selected provider's number
       this.mobilePayForm.get('mobilepaynumber').setValue(selectedProvider ? selectedProvider.pay_number : '');

       this.mobilePayForm.get('countryCode').setValue(selectedProvider ? selectedProvider.mobile_country_code : '');
     });
   }

  ngOnInit(): void {
    
    // this.getInsuranceDetails();
  }
  subsriptionPlan(){
    let paramData={
      limit:50,
      page:1,
      is_deleted:false,
      is_activated:true,
      plan_name:'',
      plan_for:'insurance'
    }
    this.insuranceService.getInsuranceSubscriptionPlan(paramData).subscribe({
      next:(res)=>{
        let result = this._coresService.decryptContext(res);
        console.log(result);
        this.planDetails = result.body.allPlans;
        
      },error:(err)=>{
          console.log(err);
          
      }
    })
  }

  // public findPlanDetails(id:any){
  //   this.route.navigate(['/insurance/subscriptionplan/payment/',id]);
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }
 
  selectPaymetTypeAndMode(data: any) {
    console.log(data, "selectPaymetTypeAndMode");
      this.PaymentMode = data.mode;
  }
  
  public findPlanDetails() {
    if (this.PaymentMode == 'stripe') {
      // this.closePopup();
      //   this.route.navigate(['/insurance/subscriptionplan/payment/',this.planId]);
      if (this.adminData?.locationinfos && this.adminData.locationinfos.length > 0) {
        this.closePopup();
        this.route.navigate(['/insurance/subscriptionplan/payment/', this.planId]);
      } else {
        this._coresService.showError("Please Complete Your Profile First and Login Again to Purchase Plan", "");
        this.closePopup();
        this.route.navigate(['/insurance/profile/edit'])
      }
    } else {
      console.log(this.plandata, "plandata", this.adminData);
      this.closePopup();
      this.openVerticallyCenteredmobilePaydetails(this.mobilePaycontent)
      this.getInsuranceDetails();
      
    }
  }
 
  //  Payment details modal
  openVerticallyCenteredpaymentdetails(paymentdetailscontent: any,data:any) {
    this.planId=data._id;
    this.plandata=data;
    this.modalService.open(paymentdetailscontent, { centered: true,size: 'md' ,windowClass : "payment_details" });
  }

  openVerticallyCenteredmobilePaydetails(mobilePaycontent: any){
    this.modalService.open(mobilePaycontent, { centered: true,size: 'md' ,windowClass : "payment_details",backdrop:'static' });
  }

  getInsuranceDetails() {
    let reqData = {
      id: this.insurance_id,
    };

    this.insuranceService.getProfileDetails(reqData).subscribe((res) => {
      let response = this._coresService.decryptObjectData({ data: res });
      console.log("PROFILE DETAILS===>", response);

      if (response.status) {
        this.mobilePayDetails= response?.body?.in_mobile_pay?.mobilePay;
        // if (response?.body?.in_mobile_pay?.mobilePay?.length != 0) {
        //   response?.body?.in_mobile_pay?.mobilePay.forEach((element) => {
        //     this.addMobPay();
        //   });
        // } else {
        //   this.addMobPay();
        // }
      }
    });
  }

  get f() {
    return this.mobilePayForm.controls;
  }

  proceedToMobilePay(){
    this.isSubmitted = true;
    if (this.mobilePayForm.invalid) {
      this._coresService.showError("All Fields are required.",'')

      console.log("=====INVALID=====");
      return;
    }
    this.isSubmitted = false;

    // Get values from the form
    const countryCode = this.mobilePayForm.get('countryCode').value;
    const mobilepaynumber = this.mobilePayForm.get('mobilepaynumber').value;

    // Construct the dynamic phone number
    const customer_phone_number = countryCode + mobilepaynumber;
    console.log("customer_phone_number>>>>>>>>>",`${countryCode}${mobilepaynumber}`)

    var payload = {
      "apikey": environment.cinetPayApiKey,
      "site_id": environment.siteId,
      "mode": 'SANDBOX',
      "transaction_id": `healthcare-crmINS${new Date().getTime()}`,
      "amount": this.plandata.plan_price,
      "currency": "XOF",
      "description": this.plandata.plan_name + " Plan Name purchase by " + this.adminData.full_name,
      "notify_url":"https://mean.stagingsdei.com:451/healthcare-crm-insurance/payment/insurance-mobile-pay-data",
      "return_url":`https://mean.stagingsdei.com:9157/insurance/subscriptionplan`,
      // "notify_url": "https://mean.stagingsdei.com:9157/",
      // "return_url": "https://mean.stagingsdei.com:9157/",
      // "channels": "ALL",
      "channels": "MOBILE_MONEY",
      "customer_id": this.adminData.for_portal_user,
      "customer_name": this.adminData.first_name,
      "customer_surname": this.adminData.last_name,
      "metadata":JSON.stringify({
        "subscription_plan_name":this.plandata.plan_name,
        "invoice_number":`healthcare-crmINS${new Date().getTime()}`,
        "plan_price":this.plandata.plan_price,
        "services":JSON.stringify(this.plandata.services),
        "currency_code":"XOF",
        "plan_type":this.plandata?.plan_duration?.value,
        "payment_mode":this.PaymentMode,
        "payment_type":this.PaymentMode,
        "order_id":"",
        "for_user":this.adminData.for_portal_user,
        "order_type":"subscription",
        "mobile_pay_number":`${countryCode}${mobilepaynumber}`
        // "portal_type": this.usertype,
      }),
      "lock_phone_number": true,
      "customer_phone_number" :`${countryCode}${mobilepaynumber}`
    }
    console.log("payload>>>>>>>>>>>>",payload)
    this.insuranceService.getcinetpaylink(payload).subscribe({
      next: (res: any) => {
        let result = res;
        console.log("result>>>>>>>>>>>>",result)
        if (result?.data?.payment_url) {
          // Navigate to the payment_url
          // this.route.navigate([result.data.payment_url]);

          const isAbsoluteUrl = result?.data?.payment_url.startsWith('http');
          if (isAbsoluteUrl) {
            // If absolute URL, open in a new tab/window
            window.open(result?.data?.payment_url, '_self');
          } else {
            // If relative URL, navigate using Angular Router
            this.route.navigate([result?.data?.payment_url]);
          }
        } else {
          console.error('Payment URL not found');
        }
      }, error: (err) => {
        console.log(err);
        this._coresService.showError(err.error.description,'')
      }
    })
  }
}