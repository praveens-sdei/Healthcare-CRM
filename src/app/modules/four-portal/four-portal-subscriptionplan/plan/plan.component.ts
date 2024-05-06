import { Component, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { FourPortalService } from '../../four-portal.service';
// import { IndiviualDoctorService } from '../../indiviual-doctor.service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlanComponent implements OnInit {
  planDetails: any;
  usertype: any;
  planStatus:boolean=false;
  planMessage:string;
  adminData:any="";
  planId: any='';
  PaymentMode: any;
  plandata: any;
  @ViewChild("mobilePaycontent", { static: false }) mobilePaycontent: any;
  loginData: any;
  portal_id: any;
  mobilePayDetails: any;
  mobilePaynumbers: any;
  mobilePayForm!: FormGroup;
  selectedProvider: any;
  selectedProviderNumber: string = '';
  countryCodes:any;
  isSubmitted: boolean = false;
  constructor(private fourPortalService: FourPortalService,
    private _coresService: CoreService,private modalService: NgbModal,
    private activateRoute: ActivatedRoute,private fb:FormBuilder,
    private route: Router) {
      this.adminData = this._coresService.getLocalStorage("adminData");
      this.loginData =this._coresService.getLocalStorage("loginData");
      this.portal_id = this.loginData?._id;
      this.usertype = this.loginData?.type;


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
    // let loginData = JSON.parse(localStorage.getItem("loginData"));
    // this.usertype = loginData?.type
    this.subsriptionPlan();

    // this.getProfileDetails();
  }

  subsriptionPlan() {
    let paramData = {
      limit: 50,
      page: 1,
      is_deleted: false,
      is_activated: true,
      plan_name: '',
      plan_for: this.usertype,
      type: this.usertype
    }
    this.fourPortalService.getSubscriptionPlan(paramData).subscribe({
      next: (res) => {
        let result = this._coresService.decryptContext(res);
        console.log("DOCTOR PLAN FROM SUPERADMIN===>", result);
        this.planDetails = result.body.allPlans;

      }, error: (err) => {
        console.log(err);

      }
    })
  }

  // public findPlanDetails(id: any) {
  //   this.route.navigate([`/portals/subscriptionplan/${this.usertype}/payment/`, id]);
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

  public findPlanDetails(){
    if(this.PaymentMode=='stripe'){
      // this.closePopup();
      // this.route.navigate(['/portals/subscriptionplan/${this.usertype}/payment/',this.planId]);
      if (this.adminData?.locationinfos && this.adminData.locationinfos.length > 0) {
        this.closePopup();
        this.route.navigate([`/portals/subscriptionplan/${this.usertype}/payment/`, this.planId]);
      } else {
        this.closePopup();
        this._coresService.showError("Please Complete Your Profile First and Login Again to Purchase Plan", "");
      }
    }
    else{
         console.log(this.plandata,"plandata",this.adminData);
         this.closePopup();
         this.getProfileDetails();
         this.openVerticallyCenteredmobilePaydetails(this.mobilePaycontent)
    }
  }
 
  //  Payment details modal
  openVerticallyCenteredpaymentdetails(paymentdetailscontent: any,data:any) {
    // console.log("data>>>>>>>>>",data)
    this.planId=data?._id;
    this.plandata=data;
    this.modalService.open(paymentdetailscontent, { centered: true,size: 'md' ,windowClass : "payment_details" });
  }

  openVerticallyCenteredmobilePaydetails(mobilePaycontent: any){
    // this.planId=data._id;
    // this.plandata=data;
    this.modalService.open(mobilePaycontent, { centered: true,size: 'md' ,windowClass : "payment_details",backdrop:'static' });
  }


  getProfileDetails() {
    let reqData = {
      portal_user_id: this.portal_id,
      type:this.usertype
    }
    this.fourPortalService.getProfileDetailsById(reqData ).subscribe(
      (res) => {
        let response = this._coresService.decryptObjectData({ data: res });
        console.log("RESPONSE FROM PARENT============>", response);
        if(response){
          this.mobilePayDetails= response?.data?.result[0].in_mobile_pay?.mobilePay;
        }
      },
      // (err) => {
      //   let errResponse = this._coresService.decryptObjectData({
      //     data: err.error,
      //   });
      //   this._coresService.showError("", errResponse.message);
      // }
    );
  }

  get f() {
    return this.mobilePayForm.controls;
  }

  proceedToMobilePay(){
    this.isSubmitted = true;
    if (this.mobilePayForm.invalid) {
      this._coresService.showError("All Fields are required.",'')

      console.log("====================INVALID=========================");
      return;
    }
    this.isSubmitted = false;

     // Get values from the form
    const countryCode = this.mobilePayForm.get('countryCode').value;
    const mobilepaynumber = this.mobilePayForm.get('mobilepaynumber').value;
    // const mobilepaynumber = 76664096;

    // Construct the dynamic phone number
    const customer_phone_number = countryCode + mobilepaynumber;
    console.log("customer_phone_number>>>>>>>>>",`${countryCode}${mobilepaynumber}`)

    var payload={
      "apikey": environment.cinetPayApiKey,
      "site_id": environment.siteId,
      "mode": 'SANDBOX',
      "transaction_id": `healthcare-crmINS${new Date().getTime()}`,
      "amount": this.plandata.plan_price,
      "currency": "XOF",
      "description":this.plandata.plan_name+" Plan Name purchase by "+this.adminData.full_name,
      // "notify_url": "https://mean.stagingsdei.com:9157/",
      "notify_url":"https://mean.stagingsdei.com:451/healthcare-crm-labimagingdentaloptical/payment/fourPortal-mobile-pay-data",
      "return_url":`https://mean.stagingsdei.com:9157/portals/subscriptionplan/${this.usertype}`,
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
        "portal_type": this.usertype,
        "mobile_pay_number":`${countryCode}${mobilepaynumber}`
      }),
      "lock_phone_number": true,
      "customer_phone_number" :`${countryCode}${mobilepaynumber}`
    }
    console.log("payload>>>>>>>>>>>>",payload)
    this.fourPortalService.getcinetpaylink(payload).subscribe({
      next:(res:any)=>{
        let result = res;
        console.log("result>>>>>>>>>>>>",result)
        if (result?.data?.payment_url) {

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
      },error:(err)=>{
        console.log(err);  
        this._coresService.showError(err.error.description,'') 
      }
    })
  }
}
