import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ComplaintlistComponent } from "./patient-complaint/complaintlist/complaintlist.component";
import { ComplaintviewComponent } from "./patient-complaint/complaintview/complaintview.component";
import { PatientComplaintComponent } from "./patient-complaint/patient-complaint.component";
import { PatientEntercodeComponent } from "./patient-entercode/patient-entercode.component";
import { PatientEnterotpComponent } from "./patient-enterotp/patient-enterotp.component";
import { PatientForgotpassComponent } from "./patient-forgotpass/patient-forgotpass.component";
import { PatientLoginComponent } from "./patient-login/patient-login.component";
import { PatientMailboxComponent } from "./patient-mailbox/patient-mailbox.component";
import { PatientMainComponent } from "./patient-main/patient-main.component";
import { AppointmentdetailsComponent } from "./patient-myappointment/appointmentdetails/appointmentdetails.component";
import { PastappointmentComponent } from "./patient-myappointment/pastappointment/pastappointment.component";
import { AppointmentlistComponent } from "./patient-myappointment/appointmentlist/appointmentlist.component";
import { CalenderComponent } from "./patient-myappointment/calender/calender.component";
import { PatientMyappointmentComponent } from "./patient-myappointment/patient-myappointment.component";
import { PatientNotificationComponent } from "./patient-notification/patient-notification.component";
import { PatientPaymenthistoryComponent } from "./patient-paymenthistory/patient-paymenthistory.component";
import { PatientProfilecreationComponent } from "./patient-profilecreation/patient-profilecreation.component";
import { PatientRatingandreviewComponent } from "./patient-ratingandreview/patient-ratingandreview.component";
import { PatientResetpassComponent } from "./patient-resetpass/patient-resetpass.component";
import { PatientSetnewpassComponent } from "./patient-setnewpass/patient-setnewpass.component";
import { PatientSignupComponent } from "./patient-signup/patient-signup.component";
import { CurrentplanComponent } from "./patient-subscriptionplan/currentplan/currentplan.component";
import { PatientSubscriptionplanComponent } from "./patient-subscriptionplan/patient-subscriptionplan.component";
import { PaymentComponent } from "./patient-subscriptionplan/payment/payment.component";
import { PlanComponent } from "./patient-subscriptionplan/plan/plan.component";
import { PatientUserinvitationComponent } from "./patient-userinvitation/patient-userinvitation.component";
import { PatientRolepermissionComponent } from "./patient-rolepermission/patient-rolepermission.component";
import { PatientDashboardComponent } from "./patient-dashboard/patient-dashboard.component";
import { PatientMyaccountComponent } from "./patient-myaccount/patient-myaccount.component";
import { PatientPrescriptionorderComponent } from "./patient-prescriptionorder/patient-prescriptionorder.component";
import { NeworderComponent } from "./patient-prescriptionorder/neworder/neworder.component";
import { AcceptedorderComponent } from "./patient-prescriptionorder/acceptedorder/acceptedorder.component";
import { ScheduledorderComponent } from "./patient-prescriptionorder/scheduledorder/scheduledorder.component";
import { CompletedorderComponent } from "./patient-prescriptionorder/completedorder/completedorder.component";
import { PrescriptionorderComponent } from "./patient-prescriptionorder/prescriptionorder/prescriptionorder.component";
import { PrescriptionorderPaymentComponent } from "./patient-prescriptionorder/prescriptionorder-payment/prescriptionorder-payment.component";
import { PatientMedicinepricerequestComponent } from "./patient-medicinepricerequest/patient-medicinepricerequest.component";
import { MedicinepricerequestComponent } from "./patient-medicinepricerequest/medicinepricerequest/medicinepricerequest.component";
import { NewpriceComponent } from "./patient-medicinepricerequest/newprice/newprice.component";
import { CompletedComponent } from "./patient-medicinepricerequest/completed/completed.component";
import { CancelledComponent } from "./patient-medicinepricerequest/cancelled/cancelled.component";
import { RejectedComponent } from "./patient-medicinepricerequest/rejected/rejected.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { HomeComponent } from "./homepage/home/home.component";
import { AvailabilitymedicinerequestComponent } from "./patient-availabilitymedicinerequest/availabilitymedicinerequest/availabilitymedicinerequest.component";
import { NewavailabilityComponent } from "./patient-availabilitymedicinerequest/newavailability/newavailability.component";
import { CompletedrequestComponent } from "./patient-availabilitymedicinerequest/completedrequest/completedrequest.component";
import { PatientAvailabilitymedicinerequestComponent } from "./patient-availabilitymedicinerequest/patient-availabilitymedicinerequest.component";
import { AuthGuard } from "src/app/shared/auth-guard";
import { RetailpharmacyComponent } from "./homepage/retailpharmacy/retailpharmacy.component";
import { RetailpharmacydetailComponent } from "./homepage/retailpharmacydetail/retailpharmacydetail.component";
import { CancelledorderComponent } from "./patient-prescriptionorder/cancelledorder/cancelledorder.component";
import { RejectedorderComponent } from "./patient-prescriptionorder/rejectedorder/rejectedorder.component";
import { RejectedmedicineorderComponent } from "./patient-availabilitymedicinerequest/rejectedmedicineorder/rejectedmedicineorder.component";
import { CancelledmedicineorderComponent } from "./patient-availabilitymedicinerequest/cancelledmedicineorder/cancelledmedicineorder.component";
import { PatientWaitingroomComponent } from "./patient-waitingroom/patient-waitingroom.component";
import { PatientUpcommingappointmentComponent } from "./patient-waitingroom/patient-upcommingappointment/patient-upcommingappointment.component";
import { PatientCalenderComponent } from "./patient-waitingroom/patient-calender/patient-calender.component";
import { RetaildoctorComponent } from "./homepage/retaildoctor/retaildoctor.component";
import { RetaildoctordetailsComponent } from "./homepage/retaildoctordetails/retaildoctordetails.component";
import { RetailhospitalComponent } from "./homepage/retailhospital/retailhospital.component";
import { RetailHospitaldetailsComponent } from "./homepage/retail-hospitaldetails/retail-hospitaldetails.component";
import { RetailappointmentdetailsComponent } from "./homepage/retailappointmentdetails/retailappointmentdetails.component";
import { RetailreviewappointmentComponent } from "./homepage/retailreviewappointment/retailreviewappointment.component";
import { PaywithcardComponent } from "./homepage/paywithcard/paywithcard.component";
import { RetailhospitalinfoComponent } from "./homepage/retailhospitalinfo/retailhospitalinfo.component";
import { PatientCommunicationComponent } from "./patient-communication/patient-communication.component";
import { PatientMedicineclaimsComponent } from "./patient-medicineclaims/patient-medicineclaims.component";
import { MedicineclaimlistComponent } from "./patient-medicineclaims/medicineclaimlist/medicineclaimlist.component";
import { MedicineclaimdetailsComponent } from "./patient-medicineclaims/medicineclaimdetails/medicineclaimdetails.component";
import { MedicineclaimsComponent } from "./patient-medicineclaims/medicineclaims/medicineclaims.component";
import { PatientCreateprofileComponent } from "./patient-createprofile/patient-createprofile.component";
// import { AuthGuard } from "./shared/auth-guard";
// import { SubscribersdetailComponent } from './insurance-subscribers/subscribersdetail/subscribersdetail.component';
// import { NotFoundComponent } from "src/app/not-found/not-found.component";
import { NotFoundComponent } from "src/app/shared/not-found/not-found.component";
import { CheckGuard } from "src/app/shared/check.guard";
import { AboutusComponent } from "./homepage/aboutus/aboutus.component";
import { BlogComponent } from "./homepage/blog/blog.component";
import { ContactusComponent } from "./homepage/contactus/contactus.component";
import { PrivacyconditionComponent } from "./homepage/privacycondition/privacycondition.component";
import { TermsconditionComponent } from "./homepage/termscondition/termscondition.component";
import { HealthArticleComponent } from "./homepage/health-article/health-article.component";
import { FaqComponent } from "./homepage/faq/faq.component";
import { VideosComponent } from "./homepage/videos/videos.component";
import { HealthArticleShowContentComponent } from "./homepage/health-article-show-content/health-article-show-content.component";
import { PatientMedicalconsultationComponent } from "./patient-medicalconsultation/patient-medicalconsultation.component";
import { PatientMedicalconsultationlistComponent } from "./patient-medicalconsultation/patient-medicalconsultationlist/patient-medicalconsultationlist.component";
import { PatientMedicalconsultationDetailsComponent } from "./patient-medicalconsultation/patient-medicalconsultation-details/patient-medicalconsultation-details.component";
import { PatientMedicalconsultationclaimsComponent } from "./patient-medicalconsultation/patient-medicalconsultationclaims/patient-medicalconsultationclaims.component";
import { ListLabDentalImagingOpticalComponent } from "./homepage/list-lab-dental-imaging-optical/list-lab-dental-imaging-optical.component";
import { PatientHospitalclaimListComponent } from "./patient-hospitalization-claim/patient-hospitalclaim-list/patient-hospitalclaim-list.component";
import { PatientHospitalclaimDetailsComponent } from "./patient-hospitalization-claim/patient-hospitalclaim-details/patient-hospitalclaim-details.component";
import { PatientHospitalclaimComponent } from "./patient-hospitalization-claim/patient-hospitalclaim/patient-hospitalclaim.component";
import { PatientHospitalizationClaimComponent } from "./patient-hospitalization-claim/patient-hospitalization-claim.component";
import { ParamedicalProfessionssComponent } from "./four-portal-availibility-request/paramedical-professionss/paramedical-professionss.component";
import { DentalComponent } from "./four-portal-availibility-request/dental/dental.component";
import { OpticalComponent } from "./four-portal-availibility-request/optical/optical.component";
import { LabImagingComponent } from "./four-portal-availibility-request/lab-imaging/lab-imaging.component";
import { DentalPriceRequestComponent } from "./four-portal-price-request/dental-price-request/dental-price-request.component";
import { OpticalPriceRequestComponent } from "./four-portal-price-request/optical-price-request/optical-price-request.component";
import { LabImagingPriceRequestComponent } from "./four-portal-price-request/lab-imaging-price-request/lab-imaging-price-request.component";
import { LabImgDentalOptDetailsComponent } from "./homepage/lab-img-dental-opt-details/lab-img-dental-opt-details.component";
import { ParamedicalProfessionPriceRequestComponent } from "./four-portal-price-request/paramedical-profession-price-request/paramedical-profession-price-request.component";
import { NewpricerequestComponent } from "./four-portal-price-request/newpricerequest/newpricerequest.component";
import { DetailAvalibililtyComponent } from "./four-portal-availibility-request/detail-avalibililty/detail-avalibililty.component";
import { CompleteAvalibililtyComponent } from "./four-portal-availibility-request/complete-avalibililty/complete-avalibililty.component";
import { CompletepricerequestComponent } from "./four-portal-price-request/completepricerequest/completepricerequest.component";
import { OrderDetailsComponent } from "./four-portal-order/order-details/order-details.component";
import { ParamedicalProfessionOrderRequestComponent } from "./four-portal-order/paramedical-profession-order-request/paramedical-profession-order-request.component";
import { ImagingOrderRequestComponent } from "./four-portal-order/imaging-order-request/imaging-order-request.component";
import { OpticalOrderRequestComponent } from "./four-portal-order/optical-order-request/optical-order-request.component";
import { DentalOrderRequestComponent } from "./four-portal-order/dental-order-request/dental-order-request.component";
import { AcceptOrderDetailsComponent } from "./four-portal-order/accept-order-details/accept-order-details.component";
import { CancelOrderDetailsComponent } from "./four-portal-order/cancel-order-details/cancel-order-details.component";
import { CompleteOrderDetailsComponent } from "./four-portal-order/complete-order-details/complete-order-details.component";
import { OrderPaymentOrderDetailsComponent } from "./four-portal-order/order-payment-order-details/order-payment-order-details.component";
import { ScheduleOrderDetailsComponent } from "./four-portal-order/schedule-order-details/schedule-order-details.component";
import { RejectOrderDetailsComponent } from "./four-portal-order/reject-order-details/reject-order-details.component";
import { FourPortalBookAppointmentComponent } from "./homepage/four-portal-book-appointment/four-portal-book-appointment.component";
import { FourPortalViewAppointmentComponent } from "./homepage/four-portal-view-appointment/four-portal-view-appointment.component";
import { PatientFourPortalClaimComponent } from "./patient-four-portal-claim/patient-four-portal-claim.component";
import { PatientFourPortalClaimListComponent } from "./patient-four-portal-claim/patient-four-portal-claim-list/patient-four-portal-claim-list.component";
import { PatientFourportalClaimComponent } from "./patient-four-portal-claim/patient-fourportal-claim/patient-fourportal-claim.component";
import { PatientFourPortalClaimDetailsComponent } from "./patient-four-portal-claim/patient-four-portal-claim-details/patient-four-portal-claim-details.component";
import { PatientFourtPortalAppointmentListComponent } from "./patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-list/patient-fourt-portal-appointment-list.component";
import { PatientFourtPortalAppointmentDetailsComponent } from "./patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-details/patient-fourt-portal-appointment-details.component";
import { PatientFourtPortalAppointmentClaimComponent } from "./patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-claim/patient-fourt-portal-appointment-claim.component";
import { PatientVaccinationCardComponent } from "./patient-vaccination-card/patient-vaccination-card.component";
const routes: Routes = [
  { path: "", redirectTo: "homepage", pathMatch: "full" },
  {
    path: "vaccination-card/:id",
    component: PatientVaccinationCardComponent,
  },
  {
    path: "login",
    component: PatientLoginComponent,
  },
  {
    path: "entercode",
    component: PatientEntercodeComponent,
  },
  {
    path: "forgotpass",
    component: PatientForgotpassComponent,
  },
  {
    path: "enterotp",
    component: PatientEnterotpComponent,
  },
  {
    path: "setnewpass",
    component: PatientSetnewpassComponent,
  },
  {
    path: "resetpass",
    component: PatientResetpassComponent,
  },

  {
    path: "createprofile",
    component: PatientCreateprofileComponent,
  },
  {
    path: "signup",
    component: PatientSignupComponent,
  },
  {
    path: "homepage",
    component: HomepageComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "retailpharmacy",
        component: RetailpharmacyComponent,
      },
      {
        path: "retailpharmacydetail/:id",
        component: RetailpharmacydetailComponent,
      },
      {
        path: "retaildoctor",
        component: RetaildoctorComponent,
      },
      {
        path: "retailappointmentdetail",
        component: RetailappointmentdetailsComponent,
      },
      {
        path: "retailreviewappointment",
        component: RetailreviewappointmentComponent,
      },
      {
        path: "paywithcard",
        component: PaywithcardComponent,
      },
      {
        path: "retaildoctordetail/:id",
        component: RetaildoctordetailsComponent,
      },
      {
        path: "retailhospital",
        component: RetailhospitalComponent,
      },
      {
        path: "retailhospitaldetail/:id",
        component: RetailHospitaldetailsComponent,
      },
      {
        path: "retailhospitalinfo/:id",
        component: RetailhospitalinfoComponent,
      },
      {
        path: "aboutus",
        component: AboutusComponent,
      },
      {
        path: "blog",
        component: BlogComponent,
      },
      {
        path: "contactus",
        component: ContactusComponent,
      },
      {
        path: "privacycondition",
        component: PrivacyconditionComponent,
      },
      {
        path: "terms&condition",
        component: TermsconditionComponent,
      },
      {
        path: "articles",
        component: HealthArticleComponent,
      },
      {
        path: "articles-show-content",
        component: HealthArticleShowContentComponent,
      },
      {
        path: "faqs",
        component: FaqComponent,
      },
      {
        path: "videos",
        component: VideosComponent,
      },
      {
        path: "list/:path",
        component: ListLabDentalImagingOpticalComponent,
      },
      {
        path: "details/:path/:id",
        component: LabImgDentalOptDetailsComponent,
      },
      {
        path: "portal-book-appointment",
        component: FourPortalBookAppointmentComponent,
      },
      {
        path: "portal-view-appointment",
        component: FourPortalViewAppointmentComponent,
      },
    ],
  },
  {
    path: "",
    component: PatientMainComponent,
    canActivate: [AuthGuard],
    children: [
      //path: '', component: PatientMainComponent, children: [
      {
        path: "myappointment",
        component: PatientMyappointmentComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/dashboard"] },
        children: [
          {
            path: "",
            component: CalenderComponent,
          },
          {
            path: "list",
            component: AppointmentlistComponent,
          },
          {
            path: "newappointment",
            component: AppointmentdetailsComponent,
          },
          {
            path: "pastappointment",
            component: PastappointmentComponent,
          },
        ],
      },
      {
        path: "dashboard",
        component: PatientDashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/dashboard"] },
      },
      {
        path: "profilecreation",
        component: PatientProfilecreationComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/patient/profilecreation"] },
      },
      {
        path: "userinvite",
        component: PatientUserinvitationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/userinvite"] },
      },
      {
        path: "ratingandreview",
        component: PatientRatingandreviewComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/ratingandreview"] },
      },
      {
        path: "complaint",
        component: PatientComplaintComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/complaint"] },
        children: [
          {
            path: "",
            component: ComplaintlistComponent,
          },
          {
            path: "view/:id",
            component: ComplaintviewComponent,
          },
        ],
      },
      {
        path: "paymenthistory",
        component: PatientPaymenthistoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/paymenthistory"] },
      },
      {
        path: "subscriptionplan",
        component: PatientSubscriptionplanComponent,
        children: [
          {
            path: "",
            component: CurrentplanComponent,
          },
          {
            path: "payment/:id",
            component: PaymentComponent,
          },
          {
            path: "plan",
            component: PlanComponent,
          },
        ],
      },
      {
        path: "notification",
        component: PatientNotificationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/notification"] },
      },
      {
        path: "mailbox",
        component: PatientMailboxComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/mailbox"] },
      },
      {
        path: "rolepermission",
        component: PatientRolepermissionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/rolepermission"] },
      },
      {
        path: "myaccount",
        component: PatientMyaccountComponent,
      },
      {
        path: "presciptionorder",
        component: PatientPrescriptionorderComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/presciptionorder"] },
        children: [
          {
            path: "",
            component: PrescriptionorderComponent,
          },
          {
            path: "neworder",
            component: NeworderComponent,
          },
          {
            path: "accepted",
            component: AcceptedorderComponent,
          },
          {
            path: "schedule",
            component: ScheduledorderComponent,
          },
          {
            path: "completed",
            component: CompletedorderComponent,
          },
          {
            path: "cancelledorder",
            component: CancelledorderComponent,
          },
          {
            path: "rejectedorder",
            component: RejectedorderComponent,
          },
          {
            path: "payment",
            component: PrescriptionorderPaymentComponent,
          },
        ],
      },
      {
        path: "medicinepricerequest",
        component: PatientMedicinepricerequestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/medicinepricerequest"] },
        children: [
          {
            path: "",
            component: MedicinepricerequestComponent,
          },
          {
            path: "newprice",
            component: NewpriceComponent,
          },
          {
            path: "completed",
            component: CompletedComponent,
          },
          {
            path: "cancelled",
            component: CancelledComponent,
          },
          {
            path: "rejected",
            component: RejectedComponent,
          },
        ],
      },
      {
        path: "medicinerequest",
        component: PatientAvailabilitymedicinerequestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/medicinerequest"] },
        children: [
          {
            path: "",
            component: AvailabilitymedicinerequestComponent,
          },
          {
            path: "newavailability",
            component: NewavailabilityComponent,
          },
          {
            path: "completed",
            component: CompletedrequestComponent,
          },
          {
            path: "cancelled",
            component: CancelledmedicineorderComponent,
          },
          {
            path: "rejected",
            component: RejectedmedicineorderComponent,
          },
        ],
      },
      {
        path: "waitingroom",
        component: PatientWaitingroomComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/waitingroom"] },
        children: [
          {
            path: "",
            component: PatientUpcommingappointmentComponent,
          },
          {
            path: "calender",
            component: PatientCalenderComponent,
          },
        ],
      },
      {
        path: "communication",
        component: PatientCommunicationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/communication"] },
      },
      {
        path: "medicineclaims",
        component: PatientMedicineclaimsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/medicineclaims"] },
        children: [
          {
            path: "",
            component: MedicineclaimlistComponent,
          },
          {
            path: "details/:id",
            component: MedicineclaimdetailsComponent,
          },
          {
            path: "submitclaim",
            component: MedicineclaimsComponent,
          },
        ],
      },
      {
        path: "medicalconsultation",
        component: PatientMedicalconsultationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/medicalconsultation"] },
        children: [
          {
            path: "",
            component: PatientMedicalconsultationlistComponent,
          },
          {
            path: "details/:id",
            component: PatientMedicalconsultationDetailsComponent,
          },
          {
            path: "submitclaim",
            component: PatientMedicalconsultationclaimsComponent,
          },
          // {
          //   path: "submitclaim",
          //   component: PatientMedicalconsultationclaimsComponent,
          // },
        ],
      },


      {
        path: "hospitalization",
        component: PatientHospitalizationClaimComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/patient/hospitalization"] },
        children: [
          {
            path: "",
            component: PatientHospitalclaimListComponent,
          },
          {
            path: "details/:id",
            component: PatientHospitalclaimDetailsComponent,
          },
          {
            path: "submitclaim",
            component: PatientHospitalclaimComponent,
          },
          // {
          //   path: "submitclaim",
          //   component: PatientMedicalconsultationclaimsComponent,
          // },        
        ],
      },
      {
        path: "paramedical-profession-availability",
        component: ParamedicalProfessionssComponent,

      },
      {
        path: "dental-availability",
        component: DentalComponent,

      },
      {
        path: "optical-availability",
        component: OpticalComponent,

      },
      {
        path: "lab-imaging-availability",
        component: LabImagingComponent,

      },
      {
        path: "dental-price-request",
        component: DentalPriceRequestComponent,

      },
      {
        path: "optical-price-request",
        component: OpticalPriceRequestComponent,

      },
      {
        path: "lab-imaging-price-request",
        component: LabImagingPriceRequestComponent,

      },
      {
        path: "paramedical-profession-price-request",
        component: ParamedicalProfessionPriceRequestComponent,

      },
      {
        path: "neworder-price-request",
        component: NewpricerequestComponent,

      },
      {
        path: "complete-price-request",
        component: CompletepricerequestComponent,

      },

      {
        path: "details-availibility",
        component: DetailAvalibililtyComponent,

      },
      {
        path: "complete-availibility",
        component: CompleteAvalibililtyComponent,
      },


      {
        path: "dental-order-request",
        component: DentalOrderRequestComponent,
      }, {
        path: "optical-order-request",
        component: OpticalOrderRequestComponent,
      }, {
        path: "imaging-order-request",
        component: ImagingOrderRequestComponent,
      }, {
        path: "paramedical-profession-order-request",
        component: ParamedicalProfessionOrderRequestComponent,
      },
      {
        path: "details-order-request",
        component: OrderDetailsComponent,
      },
      {
        path: "accept-order-request",
        component: AcceptOrderDetailsComponent,
      },
      {
        path: "cancel-order-request",
        component: CancelOrderDetailsComponent,
      },
      {
        path: "complete-order-request",
        component: CompleteOrderDetailsComponent,
      },
      {
        path: "order-payment-order-request",
        component: OrderPaymentOrderDetailsComponent,
      },
      {
        path: "reject-order-request",
        component: RejectOrderDetailsComponent,
      },
      {
        path: "schedule-order-request",
        component: ScheduleOrderDetailsComponent,
      },
      {
        path: "order-claim",
        component: PatientFourPortalClaimComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/patient/order-claim"] },
        children: [
          {
            path: "list/:path",
            component: PatientFourPortalClaimListComponent,
          },
          {
            path: "details/:id/:path",
            component: PatientFourPortalClaimDetailsComponent,
          },
          {
            path: "submitclaim/:path",
            component: PatientFourportalClaimComponent,
          },
        ],
      },


      {
        path: "appointment-claim",
        component: PatientFourPortalClaimComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/patient/appointment-claim"] },
        children: [
          {
            path: "list/:path",
            component: PatientFourtPortalAppointmentListComponent,
          },
          {
            path: "details/:id/:path",
            component: PatientFourtPortalAppointmentDetailsComponent,
          },
          {
            path: "submitclaim/:path",
            component: PatientFourtPortalAppointmentClaimComponent,
          },
        ],
      },
      



      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },

  // {
  //   path: "**",
  //   component: NotFoundComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule { }
