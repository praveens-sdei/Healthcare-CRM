import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AvailabilitymedicinerequestComponent } from "./pharmacy-availabilitymedicinerequest/availabilitymedicinerequest/availabilitymedicinerequest.component";
import { CompletedrequestComponent } from "./pharmacy-availabilitymedicinerequest/completedrequest/completedrequest.component";
import { NewavailabilityComponent } from "./pharmacy-availabilitymedicinerequest/newavailability/newavailability.component";
import { PharmacyAvailabilitymedicinerequestComponent } from "./pharmacy-availabilitymedicinerequest/pharmacy-availabilitymedicinerequest.component";
import { PharmacyCheckemailComponent } from "./pharmacy-checkemail/pharmacy-checkemail.component";
import { PharmacyCreatprofileComponent } from "./pharmacy-creatprofile/pharmacy-creatprofile.component";
import { PharmacyDashboardComponent } from "./pharmacy-dashboard/pharmacy-dashboard.component";
import { PharmacyEntercodeComponent } from "./pharmacy-entercode/pharmacy-entercode.component";
import { PharmacyForgotpasswordComponent } from "./pharmacy-forgotpassword/pharmacy-forgotpassword.component";
import { PharmacyHeaderComponent } from "./pharmacy-header/pharmacy-header.component";
import { PharmacyLoginComponent } from "./pharmacy-login/pharmacy-login.component";
import { PharmacyMainComponent } from "./pharmacy-main/pharmacy-main.component";
import { CancelledComponent } from "./pharmacy-medicinepricerequest/cancelled/cancelled.component";
import { CompletedComponent } from "./pharmacy-medicinepricerequest/completed/completed.component";
import { MedicinepricerequestComponent } from "./pharmacy-medicinepricerequest/medicinepricerequest/medicinepricerequest.component";
import { NewpriceComponent } from "./pharmacy-medicinepricerequest/newprice/newprice.component";
import { NewpricerequestComponent } from "./pharmacy-medicinepricerequest/newpricerequest/newpricerequest.component";
import { PharmacyMedicinepricerequestComponent } from "./pharmacy-medicinepricerequest/pharmacy-medicinepricerequest.component";
import { RejectedComponent } from "./pharmacy-medicinepricerequest/rejected/rejected.component";
import { PharmacyNewpasswordComponent } from "./pharmacy-newpassword/pharmacy-newpassword.component";
import { PharmacyPasswordresetComponent } from "./pharmacy-passwordreset/pharmacy-passwordreset.component";
import { AcceptedorderComponent } from "./pharmacy-prescriptionorder/acceptedorder/acceptedorder.component";
import { CompletedorderComponent } from "./pharmacy-prescriptionorder/completedorder/completedorder.component";
import { NeworderComponent } from "./pharmacy-prescriptionorder/neworder/neworder.component";
import { NeworderrequestComponent } from "./pharmacy-prescriptionorder/neworderrequest/neworderrequest.component";
import { PharmacyPrescriptionorderComponent } from "./pharmacy-prescriptionorder/pharmacy-prescriptionorder.component";
import { PrescriptionorderPaymentComponent } from "./pharmacy-prescriptionorder/prescriptionorder-payment/prescriptionorder-payment.component";
import { PrescriptionorderComponent } from "./pharmacy-prescriptionorder/prescriptionorder/prescriptionorder.component";
import { ScheduledorderComponent } from "./pharmacy-prescriptionorder/scheduledorder/scheduledorder.component";
import { ScheduledorderrequestComponent } from "./pharmacy-prescriptionorder/scheduledorderrequest/scheduledorderrequest.component";
import { EditprofileComponent } from "./pharmacy-profilemanagement/editprofile/editprofile.component";
import { PharmacyProfilemanagementComponent } from "./pharmacy-profilemanagement/pharmacy-profilemanagement.component";
import { ProfileComponent } from "./pharmacy-profilemanagement/profile/profile.component";
import { PharmacySignupComponent } from "./pharmacy-signup/pharmacy-signup.component";
import { ViewstaffComponent } from "./pharmacy-staffmanagement/viewstaff/viewstaff.component";
import { AddstaffComponent } from "./pharmacy-staffmanagement/addstaff/addstaff.component";
import { PharmacyStaffmanagementComponent } from "./pharmacy-staffmanagement/pharmacy-staffmanagement.component";
import { PharmacySubscriptionplanComponent } from "./pharmacy-subscriptionplan/pharmacy-subscriptionplan.component";
import { SubscriptionpaywithcardComponent } from "./pharmacy-subscriptionplan/subscriptionpaywithcard/subscriptionpaywithcard.component";
import { SubscriptionplanComponent } from "./pharmacy-subscriptionplan/subscriptionplan/subscriptionplan.component";
import { SubscriptionplanhistoryComponent } from "./pharmacy-subscriptionplan/subscriptionplanhistory/subscriptionplanhistory.component";
import { PharmacyRatingandreviewComponent } from "./pharmacy-ratingandreview/pharmacy-ratingandreview.component";
import { PharmacyNotificationComponent } from "./pharmacy-notification/pharmacy-notification.component";
import { PharmacyRevenuemanagementComponent } from "./pharmacy-revenuemanagement/pharmacy-revenuemanagement.component";
import { PharmacyRoleandpermisionComponent } from "./pharmacy-roleandpermision/pharmacy-roleandpermision.component";
import { ComplaintdetailComponent } from "./pharmacy-complaints/complaintdetail/complaintdetail.component";
import { PharmacycompalintviewComponent } from "./pharmacy-complaints/pharmacycompalintview/pharmacycompalintview.component";
import { PharmacyComplaintsComponent } from "./pharmacy-complaints/pharmacy-complaints.component";
import { PharmacyMedicalproductstestsComponent } from "./pharmacy-medicalproductstests/pharmacy-medicalproductstests.component";
import { PharmacyLogsComponent } from "./pharmacy-logs/pharmacy-logs.component";
import { PharmacyMedicinecliamdashboardComponent } from "./pharmacy-medicinecliamdashboard/pharmacy-medicinecliamdashboard.component";
import { DashboardclaimComponent } from "./pharmacy-medicinecliamdashboard/dashboardclaim/dashboardclaim.component";
import { MediclaimviewComponent } from "./pharmacy-medicinecliamdashboard/mediclaimview/mediclaimview.component";
import { MediclaimdetailComponent } from "./pharmacy-medicinecliamdashboard/mediclaimdetail/mediclaimdetail.component";
import { PharmacyPaymenthistoryComponent } from "./pharmacy-paymenthistory/pharmacy-paymenthistory.component";
import { PharmacyUserinvitaionComponent } from "./pharmacy-userinvitaion/pharmacy-userinvitaion.component";
import { AuthGuard } from "src/app/shared/auth-guard";
import { PharmacyMedicinclaimsComponent } from "./pharmacy-medicinclaims/pharmacy-medicinclaims.component";
import { ViewroleComponent } from "./pharmacy-roleandpermision/viewrole/viewrole.component";
import { SelectroleComponent } from "./pharmacy-roleandpermision/selectrole/selectrole.component";
import { CancelledorderComponent } from "./pharmacy-prescriptionorder/cancelledorder/cancelledorder.component";
import { RejectedorderComponent } from "./pharmacy-prescriptionorder/rejectedorder/rejectedorder.component";
import { PharmacyMedicinclaimsPreauthorizationComponent } from "./pharmacy-medicinclaims-preauthorization/pharmacy-medicinclaims-preauthorization.component";
import { CancelledmedicineorderComponent } from "./pharmacy-availabilitymedicinerequest/cancelledmedicineorder/cancelledmedicineorder.component";
import { RejectedmedicineorderComponent } from "./pharmacy-availabilitymedicinerequest/rejectedmedicineorder/rejectedmedicineorder.component";
import { PharmacyCommunicationComponent } from "./pharmacy-communication/pharmacy-communication.component";
import { CheckGuard } from "src/app/shared/check.guard";
// import { NotFoundComponent } from "src/app/not-found/not-found.component";
import { NotFoundComponent } from "src/app/shared/not-found/not-found.component";

// import { AuthGuard } from "./shared/auth-guard";
// import { SubscribersdetailComponent } from './insurance-subscribers/subscribersdetail/subscribersdetail.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: PharmacyLoginComponent,
  },
  {
    path: "signup",
    component: PharmacySignupComponent,
  },
  {
    path: "entercode",
    component: PharmacyEntercodeComponent,
  },
  {
    path: "forgotpassword",
    component: PharmacyForgotpasswordComponent,
  },
  {
    path: "checkemail",
    component: PharmacyCheckemailComponent,
  },
  {
    path: "newpassword",
    component: PharmacyNewpasswordComponent,
  },
  {
    path: "passwordreset",
    component: PharmacyPasswordresetComponent,
  },
  {
    path: "createprofile",
    component: PharmacyCreatprofileComponent,
  },
  {
    path: "pharmacyheader",
    component: PharmacyHeaderComponent,
  },
  {
    path: "",
    component: PharmacyMainComponent,
    canActivate: [AuthGuard],
    children: [
      //path: '', component: PharmacyMainComponent, children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: PharmacyDashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/dashboard"] },
      },
      {
        path: "pharmacysubscriptionplan",
        component: PharmacySubscriptionplanComponent,
        children: [
          {
            path: "",
            component: SubscriptionplanhistoryComponent,
          },
          {
            path: "subscriptionplan",
            component: SubscriptionplanComponent,
          },
          {
            path: "payment/:id",
            component: SubscriptionpaywithcardComponent,
          },
        ],
      },
      {
        path: "presciptionorder",
        component: PharmacyPrescriptionorderComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/presciptionorder"] },
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
            path: "neworderrequest",
            component: NeworderrequestComponent,
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
            path: "schedulerequest",
            component: ScheduledorderrequestComponent,
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
        component: PharmacyMedicinepricerequestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/medicinepricerequest"] },
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
            path: "newpricerequest",
            component: NewpricerequestComponent,
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
        component: PharmacyAvailabilitymedicinerequestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/medicinerequest"] },
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
        path: "profile",
        component: PharmacyProfilemanagementComponent,

        children: [
          {
            path: "",
            component: ProfileComponent,
          },
          {
            path: "edit",
            component: EditprofileComponent,
            // canActivate: [CheckGuard],
            data: { routing: ["/pharmacy/profile"] },
          },
        ],
      },
      {
        path: "staffmanagement",
        component: PharmacyStaffmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/staffmanagement"] },
        children: [
          {
            path: "",
            component: ViewstaffComponent,
          },
          {
            path: "add",
            component: AddstaffComponent,
          },
        ],
      },
      {
        path: "ratingandreview",
        component: PharmacyRatingandreviewComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/ratingandreview"] },
      },
      {
        path: "notification",
        component: PharmacyNotificationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/notification"] },
      },
      {
        path: "paymenthistory",
        component: PharmacyPaymenthistoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/paymenthistory"] },
      },
      {
        path: "complaint",
        component: PharmacyComplaintsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/complaint"] },
        children: [
          {
            path: "",
            component: PharmacycompalintviewComponent,
          },
          {
            path: "details/:id",
            component: ComplaintdetailComponent,
          },
        ],
      },
      {
        path: "medicalproductstests",
        canActivate: [CheckGuard],
        component: PharmacyMedicalproductstestsComponent,
        data: { routing: ["/pharmacy/medicalproductstests"] },
      },
      {
        path: "logs",
        component: PharmacyLogsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/logs"] },
      },
      {
        path: "userinvitation",
        component: PharmacyUserinvitaionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/userinvitation"] },
      },
      {
        path: "medicineclaimdashboard",
        component: PharmacyMedicinecliamdashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/medicineclaimdashboard"] },
        children: [
          {
            path: "",
            component: DashboardclaimComponent,
          },
          {
            path: "view",
            component: MediclaimviewComponent,
          },
          {
            path: "details/:id",
            component: MediclaimdetailComponent,
          },
        ],
      },
      {
        path: "revenuemanagement",
        component: PharmacyRevenuemanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/revenuemanagement"] },
      },
      // {
      //   path: 'roleandpermission', component: PharmacyRoleandpermisionComponent
      // },
      {
        path: "roleandpermission",
        component: PharmacyRoleandpermisionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/roleandpermission"] },
        children: [
          {
            path: "",
            component: SelectroleComponent,
          },
          {
            path: "view",
            component: ViewroleComponent,
          },
        ],
      },
      {
        path: "medicineclaims",
        component: PharmacyMedicinclaimsComponent,
        data: { routing: ["/pharmacy/medicineclaims"] },
      },
      {
        path: "medicineclaimspreauth",
        component: PharmacyMedicinclaimsPreauthorizationComponent,
        data: { routing: ["/pharmacy/medicineclaimspreauth"] },
      },
      {
        path: "communication",
        component: PharmacyCommunicationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/pharmacy/communication"] },
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
export class PharmacyRoutingModule {}
