import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { StripeService, StripePaymentElementComponent } from "ngx-stripe";
import { StripeElementsOptions, PaymentIntent } from "@stripe/stripe-js";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PharmacyPlanService } from "../../pharmacy-plan.service";
import { CoreService } from "src/app/shared/core.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: "app-subscriptionpaywithcard",
  templateUrl: "./subscriptionpaywithcard.component.html",
  styleUrls: ["./subscriptionpaywithcard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriptionpaywithcardComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;
  @ViewChild("paymentcontent", { static: false }) paymentcontent: any;
  currentId: any;
  planName: string;
  planCost: number;
  planDuration: string;
  paymentHandler: any = null;
  paying = false;
  // customStripeForm:FormGroup;
  localStorageUserData: any;
  localStorageAdminData: any;
  stripeTest: FormGroup;

  elementsOptions: StripeElementsOptions = {
    locale: "en",
  };

  constructor(
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private pharmacyPlanService: PharmacyPlanService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private http: HttpClient,
    private route: Router,   
private loader: NgxUiLoaderService
  ) {
    this.stripeTest = this.fb.group({
      name: ["Angular v12", [Validators.required]],
      amount: [1109, [Validators.required, Validators.pattern(/\d+/)]],
      email: ["", [Validators.email]],
    });
    this.localStorageUserData = this._coreService.getLocalStorage("loginData");
    this.localStorageAdminData = this._coreService.getLocalStorage("adminData");
    this.currentId = this.activeRoute.snapshot.params["id"];
    console.log("this.localStorageAdminData---->>>>>",this.localStorageAdminData)
    this.stripeTest.patchValue({
      name: this.localStorageUserData.user_name
        ? this.localStorageUserData.first_name+" "+this.localStorageUserData.last_name
        : "dsdsds",
      email: this.localStorageUserData.email,
      country: this.localStorageAdminData?.locationinfos[0].country
    });
  }

  ngOnInit(): void {
    const paramData = {
      id: this.currentId,
    };

    this.pharmacyPlanService
      .getPharmacySubscriptionPlanDetails(paramData)
      .subscribe({
        next: (res) => {
          let paymentReq = {};
          let result = this._coreService.decryptContext(res);
          console.log("plan Details", result);
          this.planName = result.body.plan_name;
          this.planCost = result.body.plan_price;
          this.planDuration = result.body.plan_duration.name;

          paymentReq = {
            payment_method_types: "card",
            description: "Insurance Plan Subscription",
            plan_name: this.planName,
            services: result.body.services,
            plan_price: Number(this.planCost),
            plan_type: result.body.plan_duration.value,
            for_user: this.localStorageUserData._id,
            subscriber_name: this.localStorageAdminData.first_name
              ? this.localStorageAdminData.first_name
              : "test name",
            subscriber_postal_code: this.localStorageAdminData?.locationinfos[0]
              ?.pincode
              ? this.localStorageAdminData?.locationinfos[0]?.pincode
              : "440030",
            subscriber_city: this.localStorageAdminData?.locationinfos[0]?.city
              ? this.localStorageAdminData?.locationinfos[0]?.city
              : "test city",
            subscriber_state: this.localStorageAdminData?.locationinfos[0]?.province
              ? this.localStorageAdminData?.locationinfos[0]?.province
              : "test city",
            // subscriber_country: "US",
            subscriber_country:this.localStorageAdminData?.locationinfos[0]?.country?.country_iso_code
            ? this.localStorageAdminData?.locationinfos[0]?.country?.country_iso_code
            : "BF",
            // subscriber_country: this.localStorageAdminData?.in_location?.country,
            subscriber_address: this.localStorageAdminData?.locationinfos[0]
              ?.neighborhood
              ? this.localStorageAdminData?.locationinfos[0]?.neighborhood
              : "test address",
              payment_mode: 'Stripe',
          payment_type: 'Card',
          order_type: 'subscription'
          };

          console.log("PAYMENT INTENT REQUEST==>", paymentReq);

          this.createPaymentIntent(paymentReq).subscribe((res) => {
            let pi = this._coreService.decryptContext(res);
            if (pi.status) {
              this.elementsOptions.clientSecret = pi.body.client_secret;
            }
          });
        },
        error: (error) => {
          console.log("error", error);
        },
        complete: () => {},
      });
  }

  getHeader(token: any, deviceId: any = "") {
    console.log(token);

    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      role: "pharmacy",
      Authorization: `Bearer ${token}`,
      uuid: deviceId,
    });
    return httpHeaders;
  }

  private createPaymentIntent(reqData: any): Observable<PaymentIntent> {
    console.log(reqData);

    return this.http.post<PaymentIntent>(
      environment.apiUrl + `/healthcare-crm-pharmacy/payment/create-payment-intent`,
      reqData,
      {
        headers: this.getHeader(localStorage.getItem("token")),
      }
    );
  }

  pay() {
    if (this.stripeTest.valid) {
      this.loader.start();
      this.paying = true;
      this.stripeService
        .confirmPayment({
          elements: this.paymentElement.elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                name: this.stripeTest.get("name").value,
                email: this.stripeTest.get('email').value,
                address: {
                  city: this.localStorageAdminData?.locationinfos[0]?.city,
                  country: this.localStorageAdminData?.locationinfos[0]?.country?.countryname,
                  line1: this.localStorageAdminData?.locationinfos[0]?.neighborhood,
                  line2: "",
                  postal_code: this.localStorageAdminData?.locationinfos[0]?.pincode,
                  state: this.localStorageAdminData?.locationinfos[0]?.province,
                },
              },
            },
          },
          redirect: "if_required",
        })
        .subscribe((result) => {
          this.paying = false;
          console.log("Result", result);
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            // alert({ success: false, error: result.error.message });
            this.loader.stop();
            this._coreService.showError(result.error.message,"")
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === "succeeded") {
            this.loader.stop();

              console.log("succeeded");
              
              // Show a success message to your customer
              // alert({ success: true });
              this.openVerticallyCenteredpaymentcontent(this.paymentcontent);
            }
          }
        });
    } else {
      this.loader.stop();

      console.log(this.stripeTest);
    }
  }

  //  Edit category service modal
  openVerticallyCenteredpaymentcontent(paymentcontent: any) {
    this.modalService.open(paymentcontent, {
      centered: true,
      size: "sm",
      windowClass: "payment_successfull",
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

  handleRouting() {
    this.modalService.dismissAll("close");
    this.route.navigate(['/pharmacy/dashboard']);
  }
}
