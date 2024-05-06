import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HospitalCheckemailComponent } from "./hospital-checkemail/hospital-checkemail.component";
import { HospitalizationclaimsComponent } from "./hospital-claims/hospitalizationclaims/hospitalizationclaims.component";
import { MedicalconsultationComponent } from "./hospital-claims/medicalconsultation/medicalconsultation.component";
import { HospitalCommunicationComponent } from "./hospital-communication/hospital-communication.component";
import { ComplaintdetailsComponent } from "./hospital-complaints/complaintdetails/complaintdetails.component";
import { ComplaintviewComponent } from "./hospital-complaints/complaintview/complaintview.component";
import { HospitalComplaintsComponent } from "./hospital-complaints/hospital-complaints.component";
import { HospitalDashboardComponent } from "./hospital-dashboard/hospital-dashboard.component";
import { HospitalEntercodeComponent } from "./hospital-entercode/hospital-entercode.component";
import { HospitalForgotpassComponent } from "./hospital-forgotpass/hospital-forgotpass.component";
import { HospitalHeaderComponent } from "./hospital-header/hospital-header.component";
import { HospitalLoginComponent } from "./hospital-login/hospital-login.component";
import { HospitalMainComponent } from "./hospital-main/hospital-main.component";
import { AdddoctorComponent } from "./hospital-managedoctor/adddoctor/adddoctor.component";
import { DoctorprofileComponent } from "./hospital-managedoctor/doctorprofile/doctorprofile.component";
import { HospitalManagedoctorComponent } from "./hospital-managedoctor/hospital-managedoctor.component";
import { ViewdoctorComponent } from "./hospital-managedoctor/viewdoctor/viewdoctor.component";
import { AddtemplateComponent } from "./hospital-master/addtemplate/addtemplate.component";
import { CustomfieldsComponent } from "./hospital-master/customfields/customfields.component";
import { DepartmentComponent } from "./hospital-master/department/department.component";
import { EducationalcontentComponent } from "./hospital-master/educationalcontent/educationalcontent.component";
import { ExpertiseComponent } from "./hospital-master/expertise/expertise.component";
import { HospitalMasterComponent } from "./hospital-master/hospital-master.component";
import { LogsComponent } from "./hospital-master/logs/logs.component";
import { ServicesComponent } from "./hospital-master/services/services.component";
import { TemplatebuilderComponent } from "./hospital-master/templatebuilder/templatebuilder.component";
import { UnitComponent } from "./hospital-master/unit/unit.component";
import { HospitalNotificationComponent } from "./hospital-notification/hospital-notification.component";
import { HospitalPasswordresetComponent } from "./hospital-passwordreset/hospital-passwordreset.component";
import { HospitalPatientmanagementComponent } from "./hospital-patientmanagement/hospital-patientmanagement.component";
import { HospitalPaymenthistoryComponent } from "./hospital-paymenthistory/hospital-paymenthistory.component";
import { HospitalProfilecreatComponent } from "./hospital-profilecreat/hospital-profilecreat.component";
import { EditprofileComponent } from "./hospital-profilemanagement/editprofile/editprofile.component";
import { HospitalProfilemanagementComponent } from "./hospital-profilemanagement/hospital-profilemanagement.component";
import { ProfileComponent } from "./hospital-profilemanagement/profile/profile.component";
import { DoctortohospitalComponent } from "./hospital-ratingandreview/doctortohospital/doctortohospital.component";
import { HospitalRatingandreviewComponent } from "./hospital-ratingandreview/hospital-ratingandreview.component";
import { PatienttodoctorComponent } from "./hospital-ratingandreview/patienttodoctor/patienttodoctor.component";
import { PatienttohospitalComponent } from "./hospital-ratingandreview/patienttohospital/patienttohospital.component";
import { HospitalRevenuemanagementComponent } from "./hospital-revenuemanagement/hospital-revenuemanagement.component";
import { HospitalRolemanagmentComponent } from "./hospital-rolemanagment/hospital-rolemanagment.component";
import { SelectroleComponent } from "./hospital-rolemanagment/selectrole/selectrole.component";
import { ViewroleComponent } from "./hospital-rolemanagment/viewrole/viewrole.component";
import { HospitalSetpasswordComponent } from "./hospital-setpassword/hospital-setpassword.component";
import { HospitalSignupComponent } from "./hospital-signup/hospital-signup.component";
import { AddComponent } from "./hospital-staff-management/add/add.component";
import { HospitalStaffManagementComponent } from "./hospital-staff-management/hospital-staff-management.component";
import { ViewComponent } from "./hospital-staff-management/view/view.component";
import { HistoryComponent } from "./hospital-subscriptionplan/history/history.component";
import { HospitalSubscriptionplanComponent } from "./hospital-subscriptionplan/hospital-subscriptionplan.component";
import { PaymentComponent } from "./hospital-subscriptionplan/payment/payment.component";
import { PlanComponent } from "./hospital-subscriptionplan/plan/plan.component";
import { HospitalUserinvitationComponent } from "./hospital-userinvitation/hospital-userinvitation.component";
import { AuthGuard } from "src/app/shared/auth-guard";
import { CheckGuard } from "src/app/shared/check.guard";
// import { NotFoundComponent } from "src/app/not-found/not-found.component";
import { NotFoundComponent } from "src/app/shared/not-found/not-found.component";
import { HospitalMedicalproductTestComponent } from "./hospital-medicalproduct-test/hospital-medicalproduct-test.component";
import { LeaveManagementComponent } from "./leave-management/leave-management.component";
import { TeamComponent } from "./hospital-master/team/team.component";
import { AdddentalComponent } from "./hospital-managedental/adddental/adddental.component";
import { HospitalManagedentalComponent } from "./hospital-managedental/hospital-managedental.component";
import { ViewdentalComponent } from "./hospital-managedental/viewdental/viewdental.component";
import { DentalprofileComponent } from "./hospital-managedental/dentalprofile/dentalprofile.component";
import { HospitalManageopticalComponent } from "./hospital-manageoptical/hospital-manageoptical.component";
import { ViewopticalComponent } from "./hospital-manageoptical/viewoptical/viewoptical.component";
import { AddopticalComponent } from "./hospital-manageoptical/addoptical/addoptical.component";
import { OpticalprofileComponent } from "./hospital-manageoptical/opticalprofile/opticalprofile.component";
import { HospitalManagelabImagingComponent } from "./hospital-managelab-imaging/hospital-managelab-imaging.component";
import { ViewlabImagingComponent } from "./hospital-managelab-imaging/viewlab-imaging/viewlab-imaging.component";
import { AddlabImagingComponent } from "./hospital-managelab-imaging/addlab-imaging/addlab-imaging.component";
import { LabImagingprofileComponent } from "./hospital-managelab-imaging/lab-imagingprofile/lab-imagingprofile.component";
import { ViewparamedicalComponent } from "./hospital-manageparamedical-professions/viewparamedical/viewparamedical.component";
import { HospitalManageparamedicalProfessionsComponent } from "./hospital-manageparamedical-professions/hospital-manageparamedical-professions.component";
import { AddparamedicalComponent } from "./hospital-manageparamedical-professions/addparamedical/addparamedical.component";
import { ParamedicalprofileComponent } from "./hospital-manageparamedical-professions/paramedicalprofile/paramedicalprofile.component";
import { HopitalizationclaimViewComponent } from "./hospital-claims/hopitalizationclaim-view/hopitalizationclaim-view.component";
import { MedicalconsultaionViewComponent } from "./hospital-claims/medicalconsultaion-view/medicalconsultaion-view.component";
import { PatientDetailsPageComponent } from "./hospital-patientmanagement/patient-details-page/patient-details-page.component";
import { PatientListComponent } from "./hospital-patientmanagement/patient-list/patient-list.component";
import { PatientAppointmentDetailsComponent } from "./hospital-patientmanagement/patient-appointment-details/patient-appointment-details.component";
// import { SubscribersdetailComponent } from './insurance-subscribers/subscribersdetail/subscribersdetail.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: HospitalLoginComponent,
  },
  {
    path: "signup",
    component: HospitalSignupComponent,
  },
  {
    path: "forgotpass",
    component: HospitalForgotpassComponent,
  },
  {
    path: "checkemail",
    component: HospitalCheckemailComponent,
  },
  {
    path: "setpassword",
    component: HospitalSetpasswordComponent,
  },
  {
    path: "resetpassword",
    component: HospitalPasswordresetComponent,
  },
  {
    path: "header",
    component: HospitalHeaderComponent,
  },
  {
    path: "createprofile",
    component: HospitalProfilecreatComponent,
  },
  {
    path: "entercode",
    component: HospitalEntercodeComponent,
  },
  {
    path: "",
    component: HospitalMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: HospitalDashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/dashboard"] },
      },
      {
        path: "staffmanagement",
        component: HospitalStaffManagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/staffmanagement"] },
        children: [
          {
            path: "",
            component: ViewComponent,
          },
          {
            path: "add",
            component: AddComponent,
          },
        ],
      },
      {
        path: "rolemanagement",
        component: HospitalRolemanagmentComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/rolemanagement"] },
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
        path: "subscriptionplan",
        component: HospitalSubscriptionplanComponent,
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
        path: "ratingandreview",
        component: HospitalRatingandreviewComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/ratingandreview"] },
        children: [
          {
            path: "",
            component: PatienttodoctorComponent,
          },
          {
            path: "patienttohospital",
            component: PatienttohospitalComponent,
          },
          {
            path: "doctortohospital",
            component: DoctortohospitalComponent,
          },
        ],
      },
      {
        path: "complaints",
        component: HospitalComplaintsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/complaints"] },
        children: [
          {
            path: "",
            component: ComplaintviewComponent,
          },
          {
            path: "details/:id",
            component: ComplaintdetailsComponent,
          },
        ],
      },
      {
        path: "communication",
        component: HospitalCommunicationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/communication"] },
      },
      {
        path: "leave-management",
        component: LeaveManagementComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/hospital/leave-management"] },
      },
      {
        path: "managedoctor",
        component: HospitalManagedoctorComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/managedoctor"] },
        children: [
          {
            path: "",
            component: ViewdoctorComponent,
          },
          {
            path: "add",
            component: AdddoctorComponent,
          },
          {
            path: "doctorprofile/:id",
            component: DoctorprofileComponent,
          },

          {
            path: "edit/:id",
            component: AdddoctorComponent,
          },
        ],
      },
      {
        path: "paymenthistory",
        component: HospitalPaymenthistoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/paymenthistory"] },
      },
      {
        path: "master",
        component: HospitalMasterComponent,
       

        children: [
          {
            path: "",
            component: TemplatebuilderComponent,
            canActivate: [CheckGuard],
            data: { routing: ["/hospital/master"] },
          },
          {
            path: "add",
            component: AddtemplateComponent,
          },
          {
            path: "customfield",
            component: CustomfieldsComponent,
          },
          {
            path: "educationalcontent",
            component: EducationalcontentComponent,
          },
          {
            path: "logs",
            component: LogsComponent,
          },
          {
            path: "department",
            component: DepartmentComponent,
            canActivate: [CheckGuard],
            data: { routing: ["/hospital/master/department"] },
          },
          {
            path: "service",
            component: ServicesComponent,
            canActivate: [CheckGuard],
            data: { routing: ["/hospital/master/service"] },
          },
          {
            path: "team",
            component: TeamComponent,
            canActivate: [CheckGuard],
            data: { routing: ["/hospital/master/team"] },
          },
          {
            path: "unit",
            component: UnitComponent,
          },
          {
            path: "expertise",
            component: ExpertiseComponent,
          },
        ],
      },
      {
        path: "claims",
        component: HospitalMasterComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/claims"] },
        children: [
          {
            path: "",
            component: MedicalconsultationComponent,
          },
          {
            path: "hospitalizationclaims",
            component: HospitalizationclaimsComponent,
          },
          {
            path: "hospitalizationclaimsdetails",
            component: HopitalizationclaimViewComponent,
          },
          {
            path: "medicalconsultaionclaimsdetails",
            component: MedicalconsultaionViewComponent,
          },
        ],
      },
      {
        path: "userinvitation",
        component: HospitalUserinvitationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/userinvitation"] },
      },
      {
        path: "medicalproductstests",
        component: HospitalMedicalproductTestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/medicalproductstests"] },
      },
      {
        path: "notification",
        component: HospitalNotificationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/notification"] },
      },
      {
        path: "revenuemanagement",
        component: HospitalRevenuemanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/revenuemanagement"] },
      },
      {
        path: "patientmanagement",
        component: HospitalPatientmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/patientmanagement"] },
        children: [    
          {
            path: "",
            component: PatientListComponent,
          },    
          {
            path: "details",
            component: PatientDetailsPageComponent,
          },   
          {
            path: "appointment-details",
            component: PatientAppointmentDetailsComponent,
          },       
        ],
      },
      {
        path: "profile",
        component: HospitalProfilemanagementComponent,
        children: [
          {
            path: "",
            component: ProfileComponent,
          },
          {
            path: "edit",
            component: EditprofileComponent,
            // canActivate: [CheckGuard],
            data: { routing: ["/hospital/profile"] },
          },
        ],
      },

      {
        path: "managedental",
        component: HospitalManagedentalComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/managedental"] },
        children: [
          {
            path: "",
            component: ViewdentalComponent,
          },
          {
            path: "add",
            component: AdddentalComponent,
          },
          {
            path: "dentalprofile/:id",
            component: DentalprofileComponent,
          },

          {
            path: "edit/:id",
            component: AdddentalComponent,
          },
        ],
      },
      {
        path: "manageoptical",
        component: HospitalManageopticalComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/manageoptical"] },
        children: [
          {
            path: "",
            component: ViewopticalComponent,
          },
          {
            path: "add",
            component: AddopticalComponent,
          },
          {
            path: "opticalprofile/:id",
            component: OpticalprofileComponent,
          },

          {
            path: "edit/:id",
            component: AddopticalComponent,
          },
        ],
      },
      {
        path: "managelaboratoryimaging",
        component: HospitalManagelabImagingComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/managelaboratoryimaging"] },
        children: [
          {
            path: "",
            component: ViewlabImagingComponent,
          },
          {
            path: "add",
            component: AddlabImagingComponent,
          },
          {
            path: "labimagingprofile/:id",
            component: LabImagingprofileComponent,
          },

          {
            path: "edit/:id",
            component: AddlabImagingComponent,
          },
        ],
      },
      {
        path: "manage-paramedical-professions",
        component: HospitalManageparamedicalProfessionsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/hospital/manage-paramedical-professions"] },
        children: [
          {
            path: "",
            component: ViewparamedicalComponent,
          },
          {
            path: "add",
            component: AddparamedicalComponent,
          },
          {
            path: "paramedicalprofile/:id",
            component: ParamedicalprofileComponent,
          },

          {
            path: "edit/:id",
            component: AddparamedicalComponent,
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
export class HospitalRoutingModule {}
