import { IndividualDoctorCreateprofileComponent } from "./individual-doctor-createprofile/individual-doctor-createprofile.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppointmentdetailsComponent } from "./individual-doctor-appointment/appointmentdetails/appointmentdetails.component";
import { AppointmentlistComponent } from "./individual-doctor-appointment/appointmentlist/appointmentlist.component";
import { IndividualDoctorAppointmentComponent } from "./individual-doctor-appointment/individual-doctor-appointment.component";
import { NewappointmentComponent } from "./individual-doctor-appointment/newappointment/newappointment.component";
import { UpcomingappointmentdetailsComponent } from "./individual-doctor-appointment/upcomingappointmentdetails/upcomingappointmentdetails.component";
import { VideocallComponent } from "./individual-doctor-appointment/videocall/videocall.component";
import { ViweNewAppoinmentComponent } from "./individual-doctor-appointment/viwe-new-appoinment/viwe-new-appoinment.component";
import { IndividualDoctorCheckemailComponent } from "./individual-doctor-checkemail/individual-doctor-checkemail.component";
import { HospitalizationclaimsdetailsComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalizationclaimsdetails/hospitalizationclaimsdetails.component";
import { HospitalizationclaimsviewComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalizationclaimsview/hospitalizationclaimsview.component";
import { HospitalsubmitclaimComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalsubmitclaim/hospitalsubmitclaim.component";
import { IndividualDoctorClaimsComponent } from "./individual-doctor-claims/individual-doctor-claims.component";
import { MedicalclaimdetailsComponent } from "./individual-doctor-claims/medicalconsultation/medicalclaimdetails/medicalclaimdetails.component";
import { MedicalclaimviewComponent } from "./individual-doctor-claims/medicalconsultation/medicalclaimview/medicalclaimview.component";
import { MedicalsubmitclaimComponent } from "./individual-doctor-claims/medicalconsultation/medicalsubmitclaim/medicalsubmitclaim.component";
import { IndividualDoctorCommunicationComponent } from "./individual-doctor-communication/individual-doctor-communication.component";
import { CompalintlistComponent } from "./individual-doctor-complaints/compalintlist/compalintlist.component";
import { ComplaintdetailComponent } from "./individual-doctor-complaints/complaintdetail/complaintdetail.component";
import { IndividualDoctorComplaintsComponent } from "./individual-doctor-complaints/individual-doctor-complaints.component";
import { IndividualDoctorDashboardComponent } from "./individual-doctor-dashboard/individual-doctor-dashboard.component";
import { IndividualDoctorEntercodeComponent } from "./individual-doctor-entercode/individual-doctor-entercode.component";
import { EprescriptiondetailsComponent } from "./individual-doctor-eprescription/eprescriptiondetails/eprescriptiondetails.component";
import { EprescriptionlistComponent } from "./individual-doctor-eprescription/eprescriptionlist/eprescriptionlist.component";
import { EprescriptionaddeyeglassesComponent } from "./individual-doctor-eprescription/eyeglasses/eprescriptionaddeyeglasses/eprescriptionaddeyeglasses.component";
import { EprescriptioneyeglassesComponent } from "./individual-doctor-eprescription/eyeglasses/eprescriptioneyeglasses/eprescriptioneyeglasses.component";
import { PrevieweyeglassesprescriptionComponent } from "./individual-doctor-eprescription/eyeglasses/previeweyeglassesprescription/previeweyeglassesprescription.component";
import { ValidateeyeglassesprescriptionComponent } from "./individual-doctor-eprescription/eyeglasses/validateeyeglassesprescription/validateeyeglassesprescription.component";
import { ValidateeyeglassessignatureComponent } from "./individual-doctor-eprescription/eyeglasses/validateeyeglassessignature/validateeyeglassessignature.component";
import { EprescriptionaddimagingComponent } from "./individual-doctor-eprescription/imaging/eprescriptionaddimaging/eprescriptionaddimaging.component";
import { EprescriptionimagingComponent } from "./individual-doctor-eprescription/imaging/eprescriptionimaging/eprescriptionimaging.component";
import { PreviewimagingprescriptionComponent } from "./individual-doctor-eprescription/imaging/previewimagingprescription/previewimagingprescription.component";
import { ValidateimagingprescriptionComponent } from "./individual-doctor-eprescription/imaging/validateimagingprescription/validateimagingprescription.component";
import { ValidateimagingsignatureComponent } from "./individual-doctor-eprescription/imaging/validateimagingsignature/validateimagingsignature.component";
import { IndividualDoctorEprescriptionComponent } from "./individual-doctor-eprescription/individual-doctor-eprescription.component";
import { EprescriptionaddlabtestComponent } from "./individual-doctor-eprescription/lab/eprescriptionaddlabtest/eprescriptionaddlabtest.component";
import { EprescriptionlabComponent } from "./individual-doctor-eprescription/lab/eprescriptionlab/eprescriptionlab.component";
import { PreviewlabprescriptionComponent } from "./individual-doctor-eprescription/lab/previewlabprescription/previewlabprescription.component";
import { ValidatelabprescriptionComponent } from "./individual-doctor-eprescription/lab/validatelabprescription/validatelabprescription.component";
import { ValidatelabsignatureComponent } from "./individual-doctor-eprescription/lab/validatelabsignature/validatelabsignature.component";
import { EprescriptionmedicineComponent } from "./individual-doctor-eprescription/medicines/eprescriptionmedicine/eprescriptionmedicine.component";
import { PreviewmedicineprescriptionComponent } from "./individual-doctor-eprescription/medicines/previewmedicineprescription/previewmedicineprescription.component";
import { ValidatemedicineprescriptionComponent } from "./individual-doctor-eprescription/medicines/validatemedicineprescription/validatemedicineprescription.component";
import { ValidatemedicinesignatureComponent } from "./individual-doctor-eprescription/medicines/validatemedicinesignature/validatemedicinesignature.component";
import { EprescriptionaddotherComponent } from "./individual-doctor-eprescription/other/eprescriptionaddother/eprescriptionaddother.component";
import { EprescriptionotherComponent } from "./individual-doctor-eprescription/other/eprescriptionother/eprescriptionother.component";
import { PreviewotherprescriptionComponent } from "./individual-doctor-eprescription/other/previewotherprescription/previewotherprescription.component";
import { ValidateotherprescriptionComponent } from "./individual-doctor-eprescription/other/validateotherprescription/validateotherprescription.component";
import { ValidateothersignatureComponent } from "./individual-doctor-eprescription/other/validateothersignature/validateothersignature.component";
import { EprescriptionaddvaccinationComponent } from "./individual-doctor-eprescription/vaccination/eprescriptionaddvaccination/eprescriptionaddvaccination.component";
import { EprescriptionvaccinationComponent } from "./individual-doctor-eprescription/vaccination/eprescriptionvaccination/eprescriptionvaccination.component";
import { PreviewvaccinationprescriptionComponent } from "./individual-doctor-eprescription/vaccination/previewvaccinationprescription/previewvaccinationprescription.component";
import { ValidatevaccinationprescriptionComponent } from "./individual-doctor-eprescription/vaccination/validatevaccinationprescription/validatevaccinationprescription.component";
import { ValidatevaccinationsignatureComponent } from "./individual-doctor-eprescription/vaccination/validatevaccinationsignature/validatevaccinationsignature.component";
import { IndividualDoctorForgotpassComponent } from "./individual-doctor-forgotpass/individual-doctor-forgotpass.component";
import { IndividualDoctorHeaderComponent } from "./individual-doctor-header/individual-doctor-header.component";
import { IndividualDoctorLeavesComponent } from "./individual-doctor-leaves/individual-doctor-leaves.component";
import { IndividualDoctorLoginComponent } from "./individual-doctor-login/individual-doctor-login.component";
import { IndividualDoctorMainComponent } from "./individual-doctor-main/individual-doctor-main.component";
import { AddtemplateComponent } from "./individual-doctor-master/addtemplate/addtemplate.component";
import { AppointmentreasonsComponent } from "./individual-doctor-master/appointmentreasons/appointmentreasons.component";
import { IndividualDoctorMasterComponent } from "./individual-doctor-master/individual-doctor-master.component";
import { LogsComponent } from "./individual-doctor-master/logs/logs.component";
import { QuestionnaireComponent } from "./individual-doctor-master/questionnaire/questionnaire.component";
import { TemplatebuilderComponent } from "./individual-doctor-master/templatebuilder/templatebuilder.component";
import { IndividualDoctorMedicalproductstestsComponent } from "./individual-doctor-medicalproductstests/individual-doctor-medicalproductstests.component";
import { IndividualDoctorMydocumentComponent } from "./individual-doctor-mydocument/individual-doctor-mydocument.component";
import { EditprofileComponent } from "./individual-doctor-myprofile/editprofile/editprofile.component";
import { IndividualDoctorMyprofileComponent } from "./individual-doctor-myprofile/individual-doctor-myprofile.component";
import { IndividualDoctorNewpasswordComponent } from "./individual-doctor-newpassword/individual-doctor-newpassword.component";
import { IndividualDoctorNotificationComponent } from "./individual-doctor-notification/individual-doctor-notification.component";
import { IndividualDoctorOtherpreauthComponent } from "./individual-doctor-otherpreauth/individual-doctor-otherpreauth.component";
import { IndividualDoctorPasswordresetComponent } from "./individual-doctor-passwordreset/individual-doctor-passwordreset.component";
import { AddpatientComponent } from "./individual-doctor-patientmanagement/addpatient/addpatient.component";
import { IndividualDoctorPatientmanagementComponent } from "./individual-doctor-patientmanagement/individual-doctor-patientmanagement.component";
import { PatientdetailsComponent } from "./individual-doctor-patientmanagement/patientdetails/patientdetails.component";
import { ViewpatientComponent } from "./individual-doctor-patientmanagement/viewpatient/viewpatient.component";
import { IndividualDoctorPaymenthistoryComponent } from "./individual-doctor-paymenthistory/individual-doctor-paymenthistory.component";
import { IndividualDoctorPreauthhospitalizationComponent } from "./individual-doctor-preauthhospitalization/individual-doctor-preauthhospitalization.component";
import { IndividualDoctorRatingandreviewComponent } from "./individual-doctor-ratingandreview/individual-doctor-ratingandreview.component";
import { IndividualDoctorRevenuemanagementComponent } from "./individual-doctor-revenuemanagement/individual-doctor-revenuemanagement.component";
import { IndividualDoctorRoleandpermisionComponent } from "./individual-doctor-roleandpermision/individual-doctor-roleandpermision.component";
import { SelectroleComponent } from "./individual-doctor-roleandpermision/selectrole/selectrole.component";
import { ViewroleComponent } from "./individual-doctor-roleandpermision/viewrole/viewrole.component";
import { IndividualDoctorSignupComponent } from "./individual-doctor-signup/individual-doctor-signup.component";
import { AddstaffComponent } from "./individual-doctor-staffmanagement/addstaff/addstaff.component";
import { IndividualDoctorStaffmanagementComponent } from "./individual-doctor-staffmanagement/individual-doctor-staffmanagement.component";
import { ViewstaffComponent } from "./individual-doctor-staffmanagement/viewstaff/viewstaff.component";
import { HistoryComponent } from "./individual-doctor-subscriptionplan/history/history.component";
import { IndividualDoctorSubscriptionplanComponent } from "./individual-doctor-subscriptionplan/individual-doctor-subscriptionplan.component";
import { PaymentComponent } from "./individual-doctor-subscriptionplan/payment/payment.component";
import { PlanComponent } from "./individual-doctor-subscriptionplan/plan/plan.component";
import { IndividualDoctorUserinvitaionComponent } from "./individual-doctor-userinvitaion/individual-doctor-userinvitaion.component";
import { PreviewepriscriptionComponent } from "./individual-doctor-eprescription/previewepriscription/previewepriscription.component";
import { ValidateeprescriptionsComponent } from "./individual-doctor-eprescription/validateeprescriptions/validateeprescriptions.component";
// import { NotFoundComponent } from "src/app/not-found/not-found.component";
import { NotFoundComponent } from "src/app/shared/not-found/not-found.component";
import { AuthGuard } from "src/app/shared/auth-guard";
import { CheckGuard } from "src/app/shared/check.guard";
import { IndividualDoctorViewpdfComponent } from "./individual-doctor-viewpdf/individual-doctor-viewpdf.component";
const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: IndividualDoctorLoginComponent,
  },
  {
    path: "eprescription-viewpdf",
    component: IndividualDoctorViewpdfComponent,
  },
  {
    path: "forgotpass",
    component: IndividualDoctorForgotpassComponent,
  },
  {
    path: "signup",
    component: IndividualDoctorSignupComponent,
  },
  {
    path: "entercode",
    component: IndividualDoctorEntercodeComponent,
  },
  {
    path: "checkemail",
    component: IndividualDoctorCheckemailComponent,
  },
  {
    path: "newpassword",
    component: IndividualDoctorNewpasswordComponent,
  },
  {
    path: "passwordreset",
    component: IndividualDoctorPasswordresetComponent,
  },

  {
    path: "createprofile",
    component: IndividualDoctorCreateprofileComponent,
  },
  {
    path: "header",
    component: IndividualDoctorHeaderComponent,
  },
  {
    path: "",
    component: IndividualDoctorMainComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //     path: '', redirectTo: 'dashboard', pathMatch: 'full'
      // },
      {
        path: "dashboard",
        component: IndividualDoctorDashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/dashboard"] },
      },
      {
        path: "subscriptionplan",
        component: IndividualDoctorSubscriptionplanComponent,
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
        path: "myprofile/:id",
        component: IndividualDoctorMyprofileComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/myprofile"] },
      },
      {
        path: "editprofile",
        component: EditprofileComponent,
      },
      {
        path: "staffmanagement",
        component: IndividualDoctorStaffmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/staffmanagement"] },

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
        path: "roleandpermission",
        component: IndividualDoctorRoleandpermisionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/roleandpermission"] },
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
        path: "userinvitaion",
        component: IndividualDoctorUserinvitaionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/userinvitaion"] },
      },
      {
        path: "medicalproductstests",
        component: IndividualDoctorMedicalproductstestsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/medicalproductstests"] },
      },
      {
        path: "leaves",
        component: IndividualDoctorLeavesComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/leaves"] },
      },
      {
        path: "mydocument",
        component: IndividualDoctorMydocumentComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/mydocument"] },
      },
      {
        path: "notification",
        component: IndividualDoctorNotificationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/notification"] },
      },
      {
        path: "paymenthistory",
        component: IndividualDoctorPaymenthistoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/paymenthistory"] },
      },
      {
        path: "templatebuilder",
        component: IndividualDoctorMasterComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/templatebuilder"] },


        children: [
          {
            path: "",
            component: TemplatebuilderComponent,
          },
          {
            path: "add",
            component: AddtemplateComponent,
          },
          {
            path: "questionnaire",
            component: QuestionnaireComponent,
          },
          {
            path: "appointmentreason",
            component: AppointmentreasonsComponent,
          },
          {
            path: "logs",
            component: LogsComponent,
          },
        ],
      },
      {
        path: "revenuemanagement",
        component: IndividualDoctorRevenuemanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/revenuemanagement"] },
      },
      {
        path: "ratingandreview",
        component: IndividualDoctorRatingandreviewComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/ratingandreview"] },
      },
      {
        path: "complaint",
        component: IndividualDoctorComplaintsComponent,


        children: [
          {

            path: "",
            component: CompalintlistComponent,
            canActivate: [CheckGuard],
            data: { routing: ["/individual-doctor/complaint"] },
          },
          {
            path: "details/:id",
            component: ComplaintdetailComponent,
          },
        ],
      },
      {
        path: "patientmanagement",
        component: IndividualDoctorPatientmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/patientmanagement"] },

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
            component: PatientdetailsComponent,
          },
          {
            path: "counsultPatientDetails",
            component: PatientdetailsComponent,
          },
        ],
      },
      {
        path: "claims",
        component: IndividualDoctorClaimsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/claims"] },

        children: [
          {
            path: "",
            component: MedicalclaimviewComponent,
          },
          {
            path: "medicalclaimdetails/:id",
            component: MedicalclaimdetailsComponent,
          },
          {
            path: "medicalsubmitclaim",
            component: MedicalsubmitclaimComponent,
          },
          {
            path: "hospitalizationclaims",
            component: HospitalizationclaimsviewComponent,
          },
          {
            path: "hospitalizationclaimsdetails/:id",
            component: HospitalizationclaimsdetailsComponent,
          },
          {
            path: "hospitalsubmitclaim",
            component: HospitalsubmitclaimComponent,
          },
        ],
      },
      {
        path: "preauthhospitalization",
        component: IndividualDoctorPreauthhospitalizationComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/preauthhospitalization"] },
      },
      {
        path: "otherpreauthrization",
        component: IndividualDoctorOtherpreauthComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/otherpreauthrization"] },
      },
      {
        path: "appointment",
        component: IndividualDoctorAppointmentComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/appointment"] },

        children: [
          {
            path: "",
            component: AppointmentlistComponent,
          },
          {
            path: "details/:id",
            component: AppointmentdetailsComponent,
          },
          {
            path: "appointmentdetails/:id",
            component: UpcomingappointmentdetailsComponent,
          },
          {
            path: "videocall",
            component: VideocallComponent,
          },
          {
            path: "newappointment",
            component: NewappointmentComponent,
          },
          {
            path: "viwenewappointment",
            component: ViweNewAppoinmentComponent,
          },
        ],
      },
      {
        path: "eprescription",
        component: IndividualDoctorEprescriptionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/eprescription"] },

        children: [
          {
            path: "",
            component: EprescriptionlistComponent,
          },
          {
            path: "details/:id",
            component: EprescriptiondetailsComponent,
          },
          {
            path: "eprescriptionmedicine",
            component: EprescriptionmedicineComponent,
          },
          {
            path: "previewmedicine",
            component: PreviewmedicineprescriptionComponent,
          },
          {
            path: "validatemedicineprescription/:id",
            component: ValidatemedicineprescriptionComponent,
          },
          {
            path: "validatemedicinesignature",
            component: ValidatemedicinesignatureComponent,
          },
          {
            path: "eprescriptionlab",
            component: EprescriptionlabComponent,
          },
          {
            path: "eprescriptionaddlabtest",
            component: EprescriptionaddlabtestComponent,
          },
          {
            path: "previewlab",
            component: PreviewlabprescriptionComponent,
          },
          {
            path: "validatelabprescription",
            component: ValidatelabprescriptionComponent,
          },
          {
            path: "validatelabsignature",
            component: ValidatelabsignatureComponent,
          },
          {
            path: "eprescriptionaddimaging",
            component: EprescriptionaddimagingComponent,
          },
          {
            path: "eprescriptionimaging",
            component: EprescriptionimagingComponent,
          },
          {
            path: "previewimaging",
            component: PreviewimagingprescriptionComponent,
          },
          {
            path: "validateimagingprescription",
            component: ValidateimagingprescriptionComponent,
          },
          {
            path: "validateimagingsignature",
            component: ValidateimagingsignatureComponent,
          },
          {
            path: "eprescriptionaddvaccination",
            component: EprescriptionaddvaccinationComponent,
          },
          {
            path: "eprescriptionvaccination",
            component: EprescriptionvaccinationComponent,
          },
          {
            path: "previewvaccination",
            component: PreviewvaccinationprescriptionComponent,
          },
          {
            path: "validatevaccinationprescription",
            component: ValidatevaccinationprescriptionComponent,
          },
          {
            path: "validatevaccinationsignature",
            component: ValidatevaccinationsignatureComponent,
          },
          {
            path: "eprescriptionaddeyeglasses",
            component: EprescriptionaddeyeglassesComponent,
          },
          {
            path: "eprescriptioneyeglasses",
            component: EprescriptioneyeglassesComponent,
          },
          {
            path: "previeweyeglasses",
            component: PrevieweyeglassesprescriptionComponent,
          },
          {
            path: "validateeyeglassesprescription",
            component: ValidateeyeglassesprescriptionComponent,
          },
          {
            path: "validateeyeglassessignature",
            component: ValidateeyeglassessignatureComponent,
          },
          {
            path: "eprescriptionaddother",
            component: EprescriptionaddotherComponent,
          },
          {
            path: "eprescriptionother",
            component: EprescriptionotherComponent,
          },
          {
            path: "previewother",
            component: PreviewotherprescriptionComponent,
          },
          {
            path: "validateotherprescription",
            component: ValidateotherprescriptionComponent,
          },
          {
            path: "validateothersignature",
            component: ValidateothersignatureComponent,
          },
          {
            path: "previeweprescription/:id",
            component: PreviewepriscriptionComponent,
          },
          {
            path: "validateprescription/:id",
            component: ValidateeprescriptionsComponent,
          },
        ],
      },
      {
        path: "communication",
        component: IndividualDoctorCommunicationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/individual-doctor/communication"] },
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
export class IndividualDoctorRoutingModule { }
