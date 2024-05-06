import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FourPortalLoginComponent } from './four-portal-login/four-portal-login.component';
import { FourPortalSignupComponent } from './four-portal-signup/four-portal-signup.component';
import { FourPortalForgotpassComponent } from './four-portal-forgotpass/four-portal-forgotpass.component';
import { FourPortalEntercodeComponent } from './four-portal-entercode/four-portal-entercode.component';
import { FourPortalNewpasswordComponent } from './four-portal-newpassword/four-portal-newpassword.component';
import { AuthGuard } from 'src/app/shared/auth-guard';
import { CheckGuard } from 'src/app/shared/check.guard';
import { FourPortalMainComponent } from './four-portal-main/four-portal-main.component';
import { FourPortalDashboardComponent } from './four-portal-dashboard/four-portal-dashboard.component';
import { FourPortalCreateprofileComponent } from './four-portal-createprofile/four-portal-createprofile.component';
import { FourPortalHeaderComponent } from './four-portal-header/four-portal-header.component';
import { FourPortalEditprofileComponent } from './four-portal-editprofile/four-portal-editprofile.component';
import { FourPortalViewProfileComponent } from './four-portal-view-profile/four-portal-view-profile.component';
import { FourPortalUserinvitationComponent } from './four-portal-userinvitation/four-portal-userinvitation.component';
import { FourPortalSubscriptionplanComponent } from './four-portal-subscriptionplan/four-portal-subscriptionplan.component';
import { HistoryComponent } from './four-portal-subscriptionplan/history/history.component';
import { PlanComponent } from './four-portal-subscriptionplan/plan/plan.component';
import { PaymentComponent } from './four-portal-subscriptionplan/payment/payment.component';
import { FourPortalRoleandpermissionComponent } from './four-portal-roleandpermission/four-portal-roleandpermission.component';
import { FourPortalSelectroleComponent } from './four-portal-roleandpermission/four-portal-selectrole/four-portal-selectrole.component';
import { FourPortalViewroleComponent } from './four-portal-roleandpermission/four-portal-viewrole/four-portal-viewrole.component';
import { FourPortalStaffManagementComponent } from './four-portal-staff-management/four-portal-staff-management.component';
import { FourPortalViewStaffComponent } from './four-portal-staff-management/four-portal-view-staff/four-portal-view-staff.component';
import { FourPortalAddStaffComponent } from './four-portal-staff-management/four-portal-add-staff/four-portal-add-staff.component';
import { FourPortalMasterComponent } from './four-portal-master/four-portal-master.component';
import { AppointmentReasonsComponent } from './four-portal-master/appointment-reasons/appointment-reasons.component';
import { AssesmentQuestionnaireComponent } from './four-portal-master/assesment-questionnaire/assesment-questionnaire.component';
import { FourPortalMedicalproductstestsComponent } from './four-portal-medicalproductstests/four-portal-medicalproductstests.component';
import { TemplatebuilderrComponent } from './four-portal-master/templatebuilderr/templatebuilderr.component';
import { AddTemplatebuilderrrComponent } from './four-portal-master/templatebuilderr/add-templatebuilderrr/add-templatebuilderrr.component';
import { FourPortalMedicineclaimsComponent } from './four-portal-medicineclaims/four-portal-medicineclaims.component';
import { FourPortalMedicineclaimListComponent } from './four-portal-medicineclaims/four-portal-medicineclaim-list/four-portal-medicineclaim-list.component';
import { FourPortalMedicineclaimDetailsComponent } from './four-portal-medicineclaims/four-portal-medicineclaim-details/four-portal-medicineclaim-details.component';
import { FourPortalClaimComponent } from './four-portal-medicineclaims/four-portal-claim/four-portal-claim.component';
import { FourPortalCommunicationComponent } from './four-portal-communication/four-portal-communication.component';
import { FourPortalOrderTestComponent } from './four-portal-order-test/four-portal-order-test.component';
import { FourPortalAllRequestListComponent } from './four-portal-order-test/four-portal-all-request-list/four-portal-all-request-list.component';
import { FourPortalPriceRequestComponent } from './four-portal-price-request/four-portal-price-request.component';
import { PriceDetailsComponent } from './four-portal-price-request/price-details/price-details.component';
import { PriceCompleteComponent } from './four-portal-price-request/price-complete/price-complete.component';
import { PriceAllListComponent } from './four-portal-price-request/price-all-list/price-all-list.component';
import { FourPortalAvailibilityRequestComponent } from './four-portal-availibility-request/four-portal-availibility-request.component';
import { AvailibilityAllListComponent } from './four-portal-availibility-request/availibility-all-list/availibility-all-list.component';
import { AvailibilityCompleteComponent } from './four-portal-availibility-request/availibility-complete/availibility-complete.component';
import { AvailibilityDetailsComponent } from './four-portal-availibility-request/availibility-details/availibility-details.component';
import { FourPortalPatientmanagementComponent } from './four-portal-patientmanagement/four-portal-patientmanagement.component';
import { ViewpatientComponent } from './four-portal-patientmanagement/viewpatient/viewpatient.component';
import { AddpatientComponent } from './four-portal-patientmanagement/addpatient/addpatient.component';
import { AcceptDetailsComponent } from './four-portal-order-test/accept-details/accept-details.component';
import { OrderDetailsComponent } from './four-portal-order-test/order-details/order-details.component';
import { ScheduleDetailsComponent } from './four-portal-order-test/schedule-details/schedule-details.component';
import { CompleteDetailsComponent } from './four-portal-order-test/complete-details/complete-details.component';
import { CancelDetailsComponent } from './four-portal-order-test/cancel-details/cancel-details.component';
import { RejectDetailsComponent } from './four-portal-order-test/reject-details/reject-details.component';
import { NewOrderDetailsComponent } from './four-portal-order-test/new-order-details/new-order-details.component';
import { AppopintmentListComponent } from './four-portal-appointment/appopintment-list/appopintment-list.component';
import { FourPortalAppointmentComponent } from './four-portal-appointment/four-portal-appointment.component';
import { AppointmentDetailsComponent } from './four-portal-appointment/appointment-details/appointment-details.component';
import { FourPortalRatingandreviewComponent } from './four-portal-ratingandreview/four-portal-ratingandreview.component';
import { FourPortalEPrescriptionComponent } from './four-portal-e-prescription/four-portal-e-prescription.component';
import { EPrescriptionListComponent } from './four-portal-e-prescription/e-prescription-list/e-prescription-list.component';
import { EPrescriptionDeatilsComponent } from './four-portal-e-prescription/e-prescription-deatils/e-prescription-deatils.component';
import { EPrescriptionPreviewComponent } from './four-portal-e-prescription/e-prescription-preview/e-prescription-preview.component';
import { LabPrescripeComponent } from './four-portal-e-prescription/lab-prescripe/lab-prescripe.component';
import { ImagingPrescripeComponent } from './four-portal-e-prescription/imaging-prescripe/imaging-prescripe.component';
import { VaccinationPrescripeComponent } from './four-portal-e-prescription/vaccination-prescripe/vaccination-prescripe.component';
import { EyeglassPrescripeComponent } from './four-portal-e-prescription/eyeglass-prescripe/eyeglass-prescripe.component';
import { OthersPrescripeComponent } from './four-portal-e-prescription/others-prescripe/others-prescripe.component';
import { FourPortalRevenuemanagementComponent } from './four-portal-revenuemanagement/four-portal-revenuemanagement.component';
import { EPrescriptionValidateComponent } from './four-portal-e-prescription/e-prescription-validate/e-prescription-validate.component';
import { EPrescriptionViewpdfComponent } from './four-portal-e-prescription/e-prescription-viewpdf/e-prescription-viewpdf.component';
import { AddMedicineComponent } from './four-portal-e-prescription/medicine-prescripe/add-medicine.component';
import { CreateAppointmentComponent } from './four-portal-appointment/create-appointment/create-appointment.component';
import { FourPortalPatientDetailsComponent } from './four-portal-patientmanagement/four-portal-patient-details/four-portal-patient-details.component';
import { FourPortalAppointmentClaimComponent } from './four-portal-appointment-claim/four-portal-appointment-claim.component';
import { FourPortalAppointmentListComponent } from './four-portal-appointment-claim/four-portal-appointment-list/four-portal-appointment-list.component';
import { FourPortalClaimAppointmentComponent } from './four-portal-appointment-claim/four-portal-claim-appointment/four-portal-claim-appointment.component';
import { FourPortalNotificationComponent } from './four-portal-notification/four-portal-notification.component';
import { LogsComponent } from './four-portal-master/logs/logs.component';
import { FourPortalMydocumentComponent } from './four-portal-mydocument/four-portal-mydocument.component';
import { FourPortalCompliantmanagementComponent } from './four-portal-compliantmanagement/four-portal-compliantmanagement.component';
import { CompliantViewComponent } from './four-portal-compliantmanagement/compliant-view/compliant-view.component';
import { ComplaintListComponent } from './four-portal-compliantmanagement/complaint-list/complaint-list.component';
import { FourPortalPaymenthistoryComponent } from './four-portal-paymenthistory/four-portal-paymenthistory.component';
import { FourPortalLeaveManagementComponent } from './four-portal-leave-management/four-portal-leave-management.component';
import { NotFoundComponent } from 'src/app/shared/not-found/not-found.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login/:path",
    component: FourPortalLoginComponent,
  },
  {
    path: "eprescription-viewpdf",
    component: EPrescriptionViewpdfComponent,
  },
  {
    path: "signup/:path",
    component: FourPortalSignupComponent,
  },
  {
    path: "forgotpass/:path",
    component: FourPortalForgotpassComponent,
  },
  {
    path: "entercode/:path",
    component: FourPortalEntercodeComponent,
  },
  {
    path: "newpassword/:path",
    component: FourPortalNewpasswordComponent,
  },
  {
    path: "header",
    component: FourPortalHeaderComponent,
  },
  {
    path: "createprofile/:path",
    component: FourPortalCreateprofileComponent,
  },
  {
    path: "",
    component: FourPortalMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard/:path",
        component: FourPortalDashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/dashboard"] },
      },
      {
        path: "viewProfile/:path",
        component: FourPortalViewProfileComponent
      },
      {
        path: "editProfile/:path",
        component: FourPortalEditprofileComponent
      },
      {
        path: "subscriptionplan/:path",
        component: FourPortalSubscriptionplanComponent,
        children: [
          {
            path: "",
            component: HistoryComponent,
          },
          {
            path: "plan",
            component: PlanComponent,
          },
          {
            path: "payment/:id",
            component: PaymentComponent,
          },
        ],
      },
      {
        path: "rolepermission/:path",
        component: FourPortalRoleandpermissionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/rolepermission"] },
        children: [
          {
            path: "",
            component: FourPortalSelectroleComponent,
          },
          {
            path: "view",
            component: FourPortalViewroleComponent,
          },
        ],
      },
      {
        path: "staffmanagement/:path",
        component: FourPortalStaffManagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/staffmanagement"] },

        children: [
          {
            path: "",
            component: FourPortalViewStaffComponent,
          },
          {
            path: "add",
            component: FourPortalAddStaffComponent,
          },
        ],
      },
      {
        path: "master/:path",
        component: FourPortalMasterComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/master"] },
        children: [
          {
            path: "appointmentreason",
            component: AppointmentReasonsComponent,
          },
          {
            path: "questionnaire",
            component: AssesmentQuestionnaireComponent,
          },
          {
            path: "templatebuilder",
            component: TemplatebuilderrComponent,
          },
          {
            path:"logs",
            component:LogsComponent
          }
        ],
      },
      {
        path: "addtemplate/:path",
        component: AddTemplatebuilderrrComponent,
      },
      {
        path: "userinvitation/:path",
        component: FourPortalUserinvitationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/userinvitation"] },
      },
      {
        path: "medicalproductstests/:path",
        component: FourPortalMedicalproductstestsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/medicalproductstests"] },
      },
      {
        path: "communication/:path",
        component: FourPortalCommunicationComponent,
      },

      {
        path: "claims/:path",
        component: FourPortalMedicineclaimsComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/portals/claims"] },
        children: [
          {
            path: "order-claim",
            component: FourPortalMedicineclaimListComponent,
          },
          {
            path: "details/:id",
            component: FourPortalMedicineclaimDetailsComponent,
          },
          {
            path: "submitclaim",
            component: FourPortalClaimComponent,
          },
        ],
      },

      {
        path: "claims/:path",
        component: FourPortalAppointmentClaimComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/portals/claims"] },
        children: [
          {
            path: "appointment-claim",
            component: FourPortalAppointmentListComponent,
          },
          // {
          //   path: "details/:id",
          //   component: FourPortalAppointmentDetailsComponent,
          // },
          {
            path: "submit",
            component: FourPortalClaimAppointmentComponent,
          },
        ],
      },


      {
        path: "order-request/:path",
        component: FourPortalOrderTestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/order-request"] },
        children: [
          {
            path: "",
            component: FourPortalAllRequestListComponent,
          },
          {
            path: "order-details",
            component: OrderDetailsComponent,
          },
          {
            path: "new-order-details",
            component: NewOrderDetailsComponent,
          },
          {
            path: "accepted-order",
            component: AcceptDetailsComponent,
          },
          {
            path: "schedule-order",
            component: ScheduleDetailsComponent,
          },      
          {
            path: "completed-order",
            component: CompleteDetailsComponent,
          },
          {
            path: "cancel-order",
            component: CancelDetailsComponent,
          },
          {
            path: "reject-order",
            component: RejectDetailsComponent,
          },
        ],
      },
      {
        path: "price-request/:path",
        component: FourPortalPriceRequestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/price-request"] },
        children: [
          {
            path: "",
            component: PriceAllListComponent,
          },
          {
            path: "test-details",
            component: PriceDetailsComponent,
          },
          {
            path: "complete-test",
            component: PriceCompleteComponent,
          },
        ],
      },
      {
        path: "availibility-request/:path",
        component: FourPortalAvailibilityRequestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/availibility-request"] },
        children: [
          {
            path: "",
            component: AvailibilityAllListComponent,
          },
          {
            path: "availibility-test-details",
            component: AvailibilityDetailsComponent,
          },
          {
            path: "complete-test-availibility",
            component: AvailibilityCompleteComponent,
          },
        ],
      },

      {
        path: "patientmanagement/:path",
        component: FourPortalPatientmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/patientmanagement"] },

        children: [
          {
            path: "",
            component: ViewpatientComponent,
          },
          {
            path: "add",
            component: AddpatientComponent,
          },
          {
            path: "edit/:id",
            component: AddpatientComponent,
          },
          {
            path: "details/:id",
            component: FourPortalPatientDetailsComponent,
          },
          {
            path: "counsultPatientDetails",
            component: FourPortalPatientDetailsComponent,
          },
        ],
      },
      {
        path: "appointment/:path",
        component: FourPortalAppointmentComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/appointment"] },

        children: [
          {
            path: "",
            component: AppopintmentListComponent,
          },
          {
            path: "appointment-details/:id",
            component: AppointmentDetailsComponent,
          },
         
          {
            path: "create-appointment-for-patient",
            component: CreateAppointmentComponent,
          },
      
        ],
      },
      {
        path: "eprescription/:path",
        component: FourPortalEPrescriptionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/eprescription"] },

        children: [
          {
            path: "",
            component: EPrescriptionListComponent,
          },
          {
            path: "details/:id",
            component: EPrescriptionDeatilsComponent,
          },
          {
            path: "preview-ePrescription/:id",
            component: EPrescriptionPreviewComponent,
          },
          {
            path: "medicine-prescribe",
            component: AddMedicineComponent,
          },
          {
            path: "validate-eprescription/:id",
            component: EPrescriptionValidateComponent,
          },

          {
            path: "lab-prescribe",
            component: LabPrescripeComponent,
          },

          {
            path: "imaging-prescribe",
            component: ImagingPrescripeComponent,
          },

          {
            path: "vaccination-prescribe",
            component: VaccinationPrescripeComponent,
          },

          {
            path: "eyeglasses-prescribe",
            component: EyeglassPrescripeComponent,
          },

          {
            path: "other-prescribe",
            component: OthersPrescripeComponent,
          },

        ],
      },

      {
        path: "ratingnreview/:path",
        component: FourPortalRatingandreviewComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/ratingnreview"] }
      },
      {
        path: "revenuemanagement/:path",
        component: FourPortalRevenuemanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/revenuemanagement"] },
      },

      {
        path: "notification/:path",
        component: FourPortalNotificationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/notification"] },
      },
      {
        path: "mydocument/:path",
        component: FourPortalMydocumentComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/mydocument"] },
      },
      {
        path: "leaves/:path",
        component: FourPortalLeaveManagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/leaves"] },
      },
      {
        path: "complaint/:path",
        component: FourPortalCompliantmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/complaint"] },

        children: [
          {
            path: "",
            component: ComplaintListComponent,
          },
          {
            path: "details/:id",
            component: CompliantViewComponent,
          },
        ],
      },
      {
        path: "paymenthistory/:path",
        component: FourPortalPaymenthistoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/portals/paymenthistory"] },
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FourPortalRoutingModule { }
