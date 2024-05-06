import { Component, OnInit, ViewEncapsulation,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
 
})
export class PlanComponent implements OnInit {
  profileData:any="";
  planMessage:string;
  planStatus:boolean=false;
  planDetails:any;
  planId: any='';
  PaymentMode: any;
  plandata: any;
  @ViewChild("mobilePaycontent", { static: false }) mobilePaycontent: any;
  loginData: any;
  patient_id: any;
  mobilePayDetails: any;
  mobilePaynumbers: any;
  mobilePayForm!: FormGroup;
  selectedProvider: any;
  selectedProviderNumber: string = '';
  countryCodes:any;
  isSubmitted: boolean = false;

  constructor(
    private modalService: NgbModal,
    private _patientService:PatientService,
    private _route:Router,
    private _coreService:CoreService,
    private fb: FormBuilder) {
      this.subsriptionPlan()
      this.profileData = this._coreService.getLocalStorage("profileData");
      this.loginData = this._coreService.getLocalStorage("loginData");
      this.patient_id = this.loginData?._id

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
    this.getProfileDetails();
  }
 
  subsriptionPlan(){
    let paramData={
      limit:50,
      page:1,
      is_deleted:false,
      is_activated:true,
      plan_name:'',
      plan_for:'patient'
    }
    this._patientService.getPatientSubscriptionPlan(paramData).subscribe({
      next:(res)=>{
        console.log(res);
        
        let result = this._coreService.decryptContext(res);
        console.log(result);
        if(result.status){
          this.planDetails = result.body.allPlans;
        }else{
          this.planMessage = 'Subsciption Plan Not exists will create shortly';
          this.planStatus = true;
        }
        
        
      },error:(err)=>{
          console.log(err);
          
      }
    })
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
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
    if (this.PaymentMode == 'stripe') {
      this.closePopup();
      this._route.navigate(['/patient/subscriptionplan/payment/', this.planId]);
    }
    else {
      console.log(this.plandata, "plandata", this.profileData);
      this.closePopup();
      this.openVerticallyCenteredmobilePaydetails(this.mobilePaycontent)
      this.getProfileDetails();
    }
  }
 
  //  Payment details modal
  openVerticallyCenteredpaymentdetails(paymentdetailscontent: any,data:any){
    this.planId=data._id;
    this.plandata=data;
    this.modalService.open(paymentdetailscontent, { centered: true,size: 'md' ,windowClass : "payment_details",backdrop:'static' });
  }

  openVerticallyCenteredmobilePaydetails(mobilePaycontent: any){
    // this.planId=data._id;
    // this.plandata=data;
    this.modalService.open(mobilePaycontent, { centered: true,size: 'md' ,windowClass : "payment_details",backdrop:'static' });
  }


  getProfileDetails() {
    let params = {
      patient_id: this.patient_id,
    };
    this._patientService.profileDetails(params).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      let profile = response.body;
      this.mobilePayDetails= response.body.mobilePayDetails.mobilePay;
      // for(let data of this.mobilePayDetails ){
      //   this.mobilePaynumbers = data;
      // }
    });
  }

  get f() {
    return this.mobilePayForm.controls;
  }

  proceedToMobilePay(){
    this.isSubmitted = true;
    if (this.mobilePayForm.invalid) {
      this._coreService.showError("All Fields are required.",'')

      console.log("=====INVALID=====");
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

    var payload = {
        "apikey": environment.cinetPayApiKey,
        "site_id": environment.siteId,
        "mode": 'SANDBOX',
        "transaction_id": `healthcare-crmINS${new Date().getTime()}`,
        "amount": this.plandata.plan_price,
        "currency": "XOF",
        "description": this.plandata.plan_name + " Plan Name purchase by " + this.profileData.full_name,
        // "notify_url": "https://mean.stagingsdei.com:9157/",
        "notify_url":"https://mean.stagingsdei.com:451/healthcare-crm-patient/payment/patient-mobile-pay-data",
        "return_url":`https://mean.stagingsdei.com:9157/patient/subscriptionplan`,
        // "return_url": "https://mean.stagingsdei.com:9157/",
        // "channels": "ALL",
        "channels": "MOBILE_MONEY",
        "customer_id": this.profileData.for_portal_user,
        "customer_name": this.profileData.first_name,
        "customer_surname": this.profileData.last_name,
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
          "for_user":this.profileData.for_portal_user,
          "order_type":"subscription",
          "mobile_pay_number":`${countryCode}${mobilepaynumber}`
          // "portal_type": this.usertype,
        }),
        "lock_phone_number": true,
        "customer_phone_number" :`${countryCode}${mobilepaynumber}`
      }
      console.log("payload>>>>>>>>>>>>",payload)
      this._patientService.getcinetpaylink(payload).subscribe({
        next:(res:any)=>{
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
              this._route.navigate([result?.data?.payment_url]);
            }
          } else {
            console.error('Payment URL not found');
          }
        }, error: (err) => {
          console.log(err);
          this._coreService.showError(err.error.description,'')
        }
      })
  }
}