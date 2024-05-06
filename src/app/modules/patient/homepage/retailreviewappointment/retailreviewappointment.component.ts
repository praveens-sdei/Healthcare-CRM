import { Component, OnInit, ViewEncapsulation,ViewChild } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { PatientService } from "../../patient.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormArray,
  FormGroup,
  Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-retailreviewappointment",
  templateUrl: "./retailreviewappointment.component.html",
  styleUrls: ["./retailreviewappointment.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RetailreviewappointmentComponent implements OnInit {
  doctor_basic_info: any;
  appointmentDetails: any;
  appointmentType: any = "";
  patientDetails: any;
  paymentDetailsForm: FormGroup;
  appointment_id: any;
  doctor_id: any;
  patient_document: any[];
  paymentType: any = "pre-payment";
  PaymentMode: any;
  totalReview: number = 0;
  averagerate: number = 0;
  rating: any;
  isDisable:boolean=true;
  profileData: any;

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
    private _indiviualDoctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private _PatientService: PatientService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toster: ToastrService,
  ) {
    this.profileData = this.coreService.getLocalStorage('profileData');
    this.loginData = this.coreService.getLocalStorage("loginData");
    this.patient_id =   this.loginData?._id;

    this.route.queryParams.subscribe((res) => {
      this.appointment_id = res["appointment_id"];
      console.log("res", this.appointment_id);
    });

    this.paymentDetailsForm = this.fb.group({
      payment_mode: [""],
      payment_type: [""],
    });

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
    window.scroll({
      top: 0,
    });
    this.viweAppoinment();
  }

  viweAppoinment() {
    let prama = {
      appointment_id: this.appointment_id,
    };
    this._indiviualDoctorService.viewAppoinment(prama).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptObjectData({ data: res });
        console.log("APPOINTMENT DETAILS===>", result);

        this.doctor_basic_info = await result?.data?.doctor_basic_info[0];
        (this.appointmentDetails = await result?.data?.result),
          (this.appointmentType = await result?.data?.result?.appointmentType);
        this.doctor_id = await result?.data?.result?.doctorId?._id;
        this.patientDetails = await result?.data?.result?.patientDetails;
        this.patient_document = await result?.data.patient_document;
        this.averagerate = parseInt(result?.data.doctor_rating.average_rating);
        this.rating = result?.data.doctor_rating;
        this.counter(this.averagerate);
        // console.log("this.patientDetails", this.patientDetails)
      },
      error: (err) => {
        console.log(err, "error in viewAppointment");
      },
    });
  }

  addpaymentTypeMode() {
    let param: any;

    console.log(this.appointment_id,this.paymentType,this.PaymentMode,'paymentClick');
    
    // return;
    if (this.paymentType === "pre-payment") {
      param = {
        appointmentId: this.appointment_id,
        paymentType: this.paymentType,
        paymentMode: this.PaymentMode,
      };
    }

    if (this.paymentType === "post-payment") {
      param = {
        appointmentId: this.appointment_id,
        paymentType: this.paymentType,
      };
    }

    if (
      this.paymentType === "pre-payment" && this.PaymentMode === undefined
        ? true
        : false
    ) {
      this.toster.error("please select PaymentMode");
    } else {
      console.log("appointment_id", this.appointmentDetails);
      // return;
      this._indiviualDoctorService.doctorAppoinment(param).subscribe({
        next: (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
          this.closePopup();
          console.log(result, "addpaymentTypeMode");
          // return;
          if (result.status) {
            if (result.body?.paymentType == "pre-payment") {
              // this.router.navigate(["/patient/homepage/paywithcard"], {
              //   queryParams: { appointment_id: this.appointmentDetails?.order_id, consultationFee: this.appointmentDetails?.consultationFee }
              // });
              if(this.PaymentMode === 'stripe'){
                this.router.navigate(["/patient/homepage/paywithcard"], {
                  state: {
                    appointmentID:this.appointment_id,
                    order_id: this.appointmentDetails?.order_id,
                    consultationFees: this.appointmentDetails?.consultationFee,
                    order_type: 'appointment'
                    
                  },
                });
              }else {
               
                this.openVerticallyCenteredmobilePaydetails(this.mobilePaycontent);
                this.getProfileDetails();
              }
              
            }
            if (result.body?.paymentType == "post-payment") {
              this.router.navigate(["/patient/myappointment/list"]);
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  selectPaymetTypeAndMode(data: any) {
    console.log(data, "selectPaymetTypeAndMode");

    if (data.type) {
      this.paymentType = data.type;
      if(data.type == 'post-payment'){
        this.isDisable=false
      }else{
        this.isDisable=true
      }
    } else {
      this.PaymentMode = data.mode;
    }


  }

  createPayment() {
    console.log(this.paymentDetailsForm.value,'createPaymentcreatePayment');
    this.addpaymentTypeMode();
  }

  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  editAppointment() {
    this.router.navigate(["/patient/homepage/retailappointmentdetail"], {
      queryParams: {
        appointmentId: this.appointment_id,
        doctorId: this.doctor_id,
        appointment_type: this.appointmentDetails.appointmentType,
      },
    });
  }

  //  Cancel Appointment modal
  openVerticallyCenteredcancelappointment(cancel_appointment: any) {
    this.modalService.open(cancel_appointment, {
      centered: true,
      size: "md",
      windowClass: "cancel_appointments",
    });
  }

  //  Payment details modal
  openVerticallyCenteredpayment(payment: any) {
    this.modalService.open(payment, {
      centered: true,
      size: "md",
      windowClass: "payment_details",
    });
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

  isPrePayment: boolean = false;
  isPostPayment: boolean = false;

  cancelationNote() {
    let note = "";
    if (this.appointmentType === "ONLINE") {
      if (
        this.doctor_basic_info?.in_fee_management?.online?.cancelPolicy
          ?.comments
      ) {
        note =
          this.doctor_basic_info?.in_fee_management?.online?.cancelPolicy
            ?.comments;
      }

      this.isPrePayment =
        this.doctor_basic_info?.in_fee_management?.online?.pre_payment;
      this.isPostPayment =
        this.doctor_basic_info?.in_fee_management?.online?.post_payment;
    } else if (this.appointmentType === "HOME_VISIT") {
      if (
        this.doctor_basic_info?.in_fee_management?.home_visit?.cancelPolicy
          ?.comments
      ) {
        note =
          this.doctor_basic_info?.in_fee_management?.home_visit?.cancelPolicy
            ?.comments;
      }

      this.isPrePayment =
        this.doctor_basic_info?.in_fee_management?.home_visit?.pre_payment;
      this.isPostPayment =
        this.doctor_basic_info?.in_fee_management?.home_visit?.post_payment;
    } else {
      if (
        this.doctor_basic_info?.in_fee_management?.f2f?.cancelPolicy?.comments
      ) {
        note =
          this.doctor_basic_info?.in_fee_management?.f2f?.cancelPolicy
            ?.comments;
      }

      this.isPrePayment =
        this.doctor_basic_info?.in_fee_management?.f2f?.pre_payment;
      this.isPostPayment =
        this.doctor_basic_info?.in_fee_management?.f2f?.post_payment;
    }
    return note;
  }
  getDirection(direction : any) {
    if (!direction)
    {
      this.coreService.showError("", "Location coordinates not found")
      return 
    }
    const lat = direction[1];
    const lng = direction[0];
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, "_blank");
    console.log(direction , "kkk");
    
  }

  returnFormatedType(type: any) {
    let formatedString = "";

    if (type === "ONLINE") {
      formatedString = "Online";
    } else if (type === "HOME_VISIT") {
      formatedString = "Home Visit";
    } else {
      formatedString = "Hospital Visit";
    }

    return formatedString;
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
    this._PatientService.profileDetails(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("response>>>>>>>",response)
      if(response){
        let profile = response.body;
        this.mobilePayDetails= response?.body?.mobilePayDetails?.mobilePay;
      }
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
      this.coreService.showError("All Fields are required.",'')

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

    var payload = {
      "apikey": environment.cinetPayApiKey,
      "site_id": environment.siteId,
      "mode": 'SANDBOX',
      "transaction_id": `healthcare-crmINS${new Date().getTime()}`,
      "amount":this.appointmentDetails?.consultationFee,
      "currency": "XOF",
      "description": "PAYMENT APPOINTMENT",
      // "description": this.plandata.plan_name + " Plan Name purchase by " + this.profileData.full_name,
      "notify_url":"https://mean.stagingsdei.com:451/healthcare-crm-patient/payment/patient-mobile-pay-data",
      "return_url":`https://mean.stagingsdei.com:9157/patient/myappointment/list`,
      // "channels": "ALL",
      "channels": "MOBILE_MONEY",
      "customer_id": this.profileData.for_portal_user,
      "customer_name": this.profileData.first_name,
      "customer_surname": this.profileData.last_name,
      "metadata":JSON.stringify({
        "subscription_plan_name":"APPOINTMENT",
        "invoice_number":`healthcare-crmINS${new Date().getTime()}`,
        "plan_price":this.appointmentDetails?.consultationFee,
        // "services":JSON.stringify(this.plandata.services),
        "currency_code":"XOF",
        // "plan_type":this.plandata?.plan_duration?.value,
        "payment_mode":this.PaymentMode,
        "payment_type":this.PaymentMode,
        "order_id": this.appointmentDetails?.order_id,
        "for_user":this.profileData.for_portal_user,
        "order_type": 'appointment',
        "mobile_pay_number":`${countryCode}${mobilepaynumber}`
        // "portal_type": this.usertype,
      }),
      "lock_phone_number": true,
      "customer_phone_number" :`${countryCode}${mobilepaynumber}`
    }
    console.log("payload>>>>>>>>>>>>",payload)

    this._PatientService.getcinetpaylink(payload).subscribe({
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
  }
}
