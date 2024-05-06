import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';
import { FourPortalService } from 'src/app/modules/four-portal/four-portal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accept-order-details',
  templateUrl: './accept-order-details.component.html',
  styleUrls: ['./accept-order-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AcceptOrderDetailsComponent implements OnInit {

  order_id: string = "";  
  patient_details: any;
  health_plan_details: any;
  orderDetails = null;
  insuranceDetails: any;
  selectedPaymentMode: string = "pre";
  displayedColumns: string[] = ['medicinename', 'packorunit', 'frequency', 'duration', 'medicineunitcost', 'totalcost', 'available'];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderTest = {
    test_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  isPrePayment: Boolean = true;
  availableTestList: string[] = [];
  @ViewChild("paymentdetailscontent") paymentdetailscontent: any;
  subscriberdetails: any; 
  subscriber_id: any;
  profileData: any;
  portal_id: any;
  portal_type: any;
  portal_Profile: any;
  paymentType: any;
  isDisable:boolean=true;
  PaymentMode: any;
  isPostPayment: boolean = true;
  loggedInprofileData: any;
  totalAmount: any = 0
  orderNo: any = ''
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
    private patientService: PatientService,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private fb: FormBuilder
  ) {
    this.loggedInprofileData = this.coreService.getLocalStorage('profileData');

    this.loginData = this.coreService.getLocalStorage("loginData");
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

  //  Payment details modal
  openVerticallyCenteredpaymentdetails(paymentdetailscontent: any) {
    this.modalService.open(paymentdetailscontent, { centered: true, size: 'md', windowClass: "payment_details",backdrop:'static' });
  }

  handlePaymentType(value: any) {
    if (value === 'pre') this.isPrePayment = true
    if (value === 'post') this.isPrePayment = false

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.portal_id = params["portal_id"];
      this.portal_type = params["portal_type"]
      this.getOrderDetails();
    });
  }

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const patientID = this.orderDetails.orderData.patient_details.user_id
    const subscriber_id = this.orderDetails.orderData.subscriber_id

    this.pharmacyService.patientProfile(patientID, insuranceNo, subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
        this.subscriberdetails = response?.body.health_plan_details?.resultData;
        this.checkInsuranceExpiry()
      }
    });
  }

  checkInsuranceExpiry() {
    let reqData = {
      insurance_id:
        this.patient_details?.in_insurance?.primary_insured?.insurance_id,
      policy_id: this.patient_details?.in_insurance?.primary_insured?.policy_id,
      card_id: this.patient_details?.in_insurance?.primary_insured?.card_id,
      employee_id:
        this.patient_details?.in_insurance?.primary_insured?.employee_id,
      subscriber_id:
        this.orderDetails?.orderData?.subscriber_id
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if(response.status == true){

        this.insuranceDetails = response.body;
      }
    });
  }


  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.portal_id,
      for_order_id: this.order_id,
      portal_type: this.portal_type
    };
    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let encryptedData = { data: result1 };
        let result = this.coreService.decryptObjectData(encryptedData);
        if (result.status === true) {
          this.orderDetails = result.data;
            // this.documentMetaDataURL();
          console.log("this.orderDetails=====",this.orderDetails);
          
          this.profileData = result?.data?.portal_Details
          this.portal_Profile = result?.data?.portal_Profile
          this.totalAmount = result.data.testBill.co_pay
          this.orderNo = result.data.orderData.order_id
          this.subscriber_id = result?.data?.orderData?.subscriber_id

          this.getPatientDetails()
          if (this.orderDetails.testBill.prescription_url) {
            this.prescriptionSignedUrl = this.orderDetails.testBill.prescription_url;

          }
          result.data.testDetails.forEach((element) => {
            const available = element.available ? "yes" : "no";
            const newRow = {
              name: element.name,
              prescribed: element.quantity_data.prescribed,
              frequency: element.frequency,
              duration: element.duration,
              priceperunit: element.price_per_unit || "",
              totalcost: element.total_cost || "",
              available
            };
            this.availableTestList.push(available);
            this.orderTest.test_details.push(
              newRow
            );
          });
          this.orderTest
          ["total_cost"]
            = (result.data.testBill.total_test_cost || "");
          this.orderTest
          ["copay"]
            = (result.data.testBill.co_pay || "");
          this.orderTest
          ["insurance_paid"]
            = (result.data.testBill.insurance_paid || "");
          this.dataSource = new MatTableDataSource(
            this.orderTest["test_details"]
          );
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  testAvailabilityChange(e: { value: string }, i: number) {
    this.availableTestList[i] = e.value;
  }
 

  patientOrderConfirm() {
    const orderRequest = {
      _id: this.orderDetails.orderData._id,
      patient_details: {
        ...this.orderDetails.orderData.patient_details,
        order_confirmation: true
      },
      payment_type: this.paymentType,
      for_portal_user: this.portal_id,
      portal_type:this.portal_type
    };
    if (this.paymentType === 'post') {
      this.fourPortalService.confirmOrderFourPortal(orderRequest).subscribe({
        next: (result1) => {
          let encryptedData = { data: result1 };
          let result = this.coreService.decryptObjectData(encryptedData);
          if (result.status === true) {
            this.gotoOrderList();
          }
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    } else {
      this.modalService.dismissAll();
      this.coreService.setSessionStorage(orderRequest, 'OrderDetails')
      // this.router.navigate(['/patient/order-payment-order-request'],{
      //   queryParams: { portal_type: this.portal_type },
      // });
      if(this.PaymentMode === 'stripe'){
        this.router.navigate(['/patient/order-payment-order-request'],{
          queryParams: { portal_type: this.portal_type },
        });
        }else{
          this.openVerticallyCenteredmobilePaydetails(this.mobilePaycontent)
          this.getProfileDetails();
         
        }
    }
  }

  gotoOrderList() {
    this.modalService.dismissAll();
    if (this.portal_type === "Paramedical-Professions") {
      this.router.navigate(['/patient/paramedical-profession-order-request']);
    } else if (this.portal_type === "Dental") {
      this.router.navigate(['/patient/dental-order-request']);
    } else if (this.portal_type === "Optical") {
      this.router.navigate(['/patient/optical-order-request']);
    } else if (this.portal_type === "Laboratory-Imaging") {
      this.router.navigate(['/patient/imaging-order-request']);
    }
  }

  cancelOrder() {
    const orderRequest = {
      _id: this.orderDetails.orderData._id,
      status: "cancelled",
      cancelled_by: "patient",
      for_portal_user: this.portal_id,
      portal_type:this.portal_type
    };
    this.fourPortalService.cancelOrderFourPortal(orderRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });

        if (result.status === true) {
          this.gotoOrderList();
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  selectPaymetTypeAndMode(data: any) {
    console.log(data, "selectPaymetTypeAndMode");

    if (data.type) {
      this.paymentType = data.type;
      if(data.type == 'post'){
        this.isDisable=false
      }else{
        this.isDisable=true
      }
    } else {
      this.PaymentMode = data.mode;
    }
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
    this.patientService.profileDetails(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("response>>>>>>>",response)
      if(response){
        let profile = response.body;
        this.mobilePayDetails= response?.body?.mobilePayDetails?.mobilePay;
      }
    });
  }

  get f() {
    return this.mobilePayForm.controls;
  }

  proceedToMobilePay(){
    this.isSubmitted = true;
    if (this.mobilePayForm.invalid) {
      this.coreService.showError("All Fields are required.",'')

      console.log("=====INVALID=====");
      return;
    }
    this.isSubmitted = false;

     // Get values from the form
    const countryCode = this.mobilePayForm.get('countryCode').value;
    const mobilepaynumber = this.mobilePayForm.get('mobilepaynumber').value;
    // const mobilepaynumber = 76664096;

    
      var payload = {
        "apikey": environment.cinetPayApiKey,
        "site_id": environment.siteId,
        "mode": 'SANDBOX',
        "transaction_id": `healthcare-crmINS${new Date().getTime()}`,
        "amount": Number(this.totalAmount),
        "currency": "XOF",
        "description": 'Test Order Payment',
        "notify_url":"https://mean.stagingsdei.com:451/healthcare-crm-patient/payment/patient-mobile-pay-data",
        "return_url":`https://mean.stagingsdei.com:9157/patient/presciptionorder`,
        // "channels": "ALL",
        "channels": "MOBILE_MONEY",
        "customer_id": this.loggedInprofileData.for_portal_user,
        "customer_name": this.loggedInprofileData.first_name,
        "customer_surname": this.loggedInprofileData.last_name,
        "metadata":JSON.stringify({
          "subscription_plan_name":`Test Order - ${this.orderNo}`,
          "invoice_number":`healthcare-crmINS${new Date().getTime()}`,
          "plan_price":  Number(this.totalAmount),
          "currency_code":"XOF",
          "payment_mode":this.PaymentMode,
          "payment_type":this.PaymentMode,
          "order_id":this.orderDetails?.orderData?._id,
          "for_user":this.loggedInprofileData?.for_portal_user,
          "order_type": 'test_order',
          "portal_type": this.portal_type,
          "mobile_pay_number":`${countryCode}${mobilepaynumber}`,

          "_id": this.orderDetails?.orderData?._id,
          "patient_details": {
          ...this.orderDetails.orderData.patient_details,
          order_confirmation: true
          },
          "for_portal_user": this.portal_id
        }),
        "lock_phone_number": true,
        "customer_phone_number" :`${countryCode}${mobilepaynumber}`
      }
      console.log("payload>>>>>>>>>>>>",payload)

      this.patientService.getcinetpaylink(payload).subscribe({
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
              this.router.navigate([result?.data?.payment_url]);
            }
          } else {
            console.error('Payment URL not found');
          }
        }, error: (err) => {
          console.log(err);
          this.coreService.showError(err.error.description,'')
        }
      })
      this.modalService.dismissAll();
  
  }
}

