import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InsuranceMainComponent } from "./insurance-main/insurance-main.component";
import { InsuranceDashboardComponent } from "./insurance-dashboard/insurance-dashboard.component";
import { InsuranceLoginComponent } from "./insurance-login/insurance-login.component";
import { InsuranceSignupComponent } from "./insurance-signup/insurance-signup.component";

import { PolicyclaimComponent } from "./insurance-dashboard/policyclaim/policyclaim.component";
import { InsuranceanalysisComponent } from "./insurance-dashboard/insuranceanalysis/insuranceanalysis.component";
import { InsuranceHealthplanComponent } from "./insurance-healthplan/insurance-healthplan.component";
import { HealthplanviewComponent } from "./insurance-healthplan/healthplanview/healthplanview.component";
import { InsuranceForgotpassComponent } from "./insurance-forgotpass/insurance-forgotpass.component";
import { InsuranceCheckemailComponent } from "./insurance-checkemail/insurance-checkemail.component";
import { InsuranceNewpasswordComponent } from "./insurance-newpassword/insurance-newpassword.component";
import { InsurancePasswordresetComponent } from "./insurance-passwordreset/insurance-passwordreset.component";
import { InsuranceCreateprofileComponent } from "./insurance-createprofile/insurance-createprofile.component";
import { InsuranceCategoryserviceComponent } from "./insurance-categoryservice/insurance-categoryservice.component";
import { HealthplanserviceComponent } from "./insurance-healthplan/healthplanservice/healthplanservice.component";
// import { SubscribersdetailComponent } from './insurance-subscribers/subscribersdetail/subscribersdetail.component';
import { SubscribersviewComponent } from "./insurance-subscribers/subscribersview/subscribersview.component";
import { InsuranceSubscribersComponent } from "./insurance-subscribers/insurance-subscribers.component";
import { HospitalLoginComponent } from "../hospital/hospital-login/hospital-login.component";
import { InsuranceProfilemanagementComponent } from "./insurance-profilemanagement/insurance-profilemanagement.component";
import { ViewComponent } from "./insurance-profilemanagement/view/view.component";
import { EditComponent } from "./insurance-profilemanagement/edit/edit.component";
import { ChangepasswordComponent } from "./insurance-profilemanagement/changepassword/changepassword.component";
import { InsuranceCommunicationComponent } from "./insurance-communication/insurance-communication.component";
import { InsuranceCategoryofexclusionComponent } from "./insurance-categoryofexclusion/insurance-categoryofexclusion.component";
import { InsuranceExclusionnameComponent } from "./insurance-exclusionname/insurance-exclusionname.component";
import { InsuranceHealthcarenetworkComponent } from "./insurance-healthcarenetwork/insurance-healthcarenetwork.component";
import { InsuranceNotificationComponent } from "./insurance-notification/insurance-notification.component";
import { InsurancePaymenthistoryComponent } from "./insurance-paymenthistory/insurance-paymenthistory.component";
import { InsuranceRolepermissionComponent } from "./insurance-rolepermission/insurance-rolepermission.component";
import { SelectroleComponent } from "./insurance-rolepermission/selectrole/selectrole.component";
import { ViewroleComponent } from "./insurance-rolepermission/viewrole/viewrole.component";
import { InsuranceSubscriptionplanComponent } from "./insurance-subscriptionplan/insurance-subscriptionplan.component";
import { HistoryComponent } from "./insurance-subscriptionplan/history/history.component";
import { PlanComponent } from "./insurance-subscriptionplan/plan/plan.component";
import { PaymentComponent } from "./insurance-subscriptionplan/payment/payment.component";
import { InsuranceTypeofserviceComponent } from "./insurance-typeofservice/insurance-typeofservice.component";
import { InsuranceStaffmanagementComponent } from "./insurance-staffmanagement/insurance-staffmanagement.component";
import { AddstaffComponent } from "./insurance-staffmanagement/addstaff/addstaff.component";
import { ViewstaffComponent } from "./insurance-staffmanagement/viewstaff/viewstaff.component";
import { InsuranceEntercodeComponent } from "./insurance-entercode/insurance-entercode.component";
import { InsuranceMedicinesComponent } from "./insurance-medicines/insurance-medicines.component";
import { MedicinesviewComponent } from "./insurance-medicines/medicinesview/medicinesview.component";
import { MedicinesdetailsComponent } from "./insurance-medicines/medicinesdetails/medicinesdetails.component";
import { AuthGuard } from "src/app/shared/auth-guard";
import { SubscribersdetailComponent } from "./insurance-subscribers/subscribersdetail/subscribersdetail.component";
import { InsurancePreauthorizationhospitalizationComponent } from "./insurance-preauthorizationhospitalization/insurance-preauthorizationhospitalization.component";
import { InsuranceMedicalconsultationComponent } from "./insurance-medicalconsultation/insurance-medicalconsultation.component";
import { InsuranceMedicalconsultationviewComponent } from "./insurance-medicalconsultation/insurance-medicalconsultationview/insurance-medicalconsultationview.component";
import { InsuranceMedicalconsultationdetailsComponent } from "./insurance-medicalconsultation/insurance-medicalconsultationdetails/insurance-medicalconsultationdetails.component";
import { InsuranceTemplatebuilderComponent } from "./insurance-templatebuilder/insurance-templatebuilder.component";
import { TemplatelistingComponent } from "./insurance-templatebuilder/templatelisting/templatelisting.component";
import { AddtemplateComponent } from "./insurance-templatebuilder/addtemplate/addtemplate.component";
import { InsuranceMedicalproducttestComponent } from "./insurance-medicalproducttest/insurance-medicalproducttest.component";
import { CheckGuard } from "src/app/shared/check.guard";
// import { NotFoundComponent } from "src/app/not-found/not-found.component";
import { NotFoundComponent } from "src/app/shared/not-found/not-found.component";
import { PortaltypecategoryComponent } from "./insurance-portaltypecategory/portaltypecategory/portaltypecategory.component";
import { InsuranceClaimProcessRoleComponent } from "./insurance-claim-process-role/insurance-claim-process-role.component";
import { InsuranceSuperadminpermissionComponent } from "./insurance-superadminpermission/insurance-superadminpermission.component";
import { InsuranceCardPreviewMasterComponent } from "./insurance-card-preview-master/insurance-card-preview-master.component";
import { SubscriberPreviewCardComponent } from "./insurance-subscribers/subscriber-preview-card/subscriber-preview-card.component";
// import { CommoninformationComponent } from "./insurance-medicines/medicineclaims/commoninformation/commoninformation.component";
import { InsuranceMedicineclaimsComponent } from "./insurance-medicines/insurance-medicineclaims/insurance-medicineclaims.component";
import { InsuranceMedicalconsultationClaimComponent } from "./insurance-medicalconsultation/insurance-medicalconsultation-claim/insurance-medicalconsultation-claim.component";
import { InsuranceHospitalizationdetailComponent } from "./insurance-hospitalization-claim/insurance-hospitalizationdetail/insurance-hospitalizationdetail.component";
import { InsuranceHospitalizationClaimComponent } from "./insurance-hospitalization-claim/insurance-hospitalization-claim.component";
import { InsurnaceHopitalizatinAllclaimViewComponent } from "./insurance-hospitalization-claim/insurnace-hopitalizatin-allclaim-view/insurnace-hopitalizatin-allclaim-view.component";
import { InsuranceLabImaginViewComponent } from "./insurance-laboratory-imagin-claim/insurance-lab-imagin-view/insurance-lab-imagin-view.component";
import { InsuranceLabImagindetailsComponent } from "./insurance-laboratory-imagin-claim/insurance-lab-imagindetails/insurance-lab-imagindetails.component";
import { InsuranceDentalViewComponent } from "./insurance-dental/insurance-dental-view/insurance-dental-view.component";
import { InsuranceDentalDetailsComponent } from "./insurance-dental/insurance-dental-details/insurance-dental-details.component";
import { InsuranceParamedicalViewComponent } from "./insurance-paramedical-profession/insurance-paramedical-view/insurance-paramedical-view.component";
import { InsuranceParamedicalDetailsComponent } from "./insurance-paramedical-profession/insurance-paramedical-details/insurance-paramedical-details.component";
import { InsurnaceOpticalViewComponent } from "./insurnace-optical/insurnace-optical-view/insurnace-optical-view.component";
import { InsurnaceOpticalDetailsComponent } from "./insurnace-optical/insurnace-optical-details/insurnace-optical-details.component";
import { InsurnaceMakeFourPortalClaimInsuranceComponent } from "./insurnace-make-four-portal-claim-insurance/insurnace-make-four-portal-claim-insurance.component";
import { MakeFourPortalClaimListComponent } from "./insurnace-make-four-portal-claim-insurance/make-four-portal-claim-list/make-four-portal-claim-list.component";
import { MakeFourPortalClaimDetailsComponent } from "./insurnace-make-four-portal-claim-insurance/make-four-portal-claim-details/make-four-portal-claim-details.component";
import { MakeFourPortalClaimComponent } from "./insurnace-make-four-portal-claim-insurance/make-four-portal-claim/make-four-portal-claim.component"
import { InsuranceLabImaginClaimsAdminAppointmentComponent } from "./insurance-laboratory-imagin-claim/insurance-lab-imagin-claims-admin-appointment/insurance-lab-imagin-claims-admin-appointment.component";
import { InsuranceLabImaginClaimsComponent } from "./insurance-laboratory-imagin-claim/insurance-lab-imagin-claims/insurance-lab-imagin-claims.component";
import { InsuranceAppointmentAllListComponent } from "./insurance-appointment-view-allclaim/insurance-appointment-all-list/insurance-appointment-all-list.component";
import { InsuranceAppointmentViewAllclaimComponent } from './insurance-appointment-view-allclaim/insurance-appointment-view-allclaim.component';
import { InsuranceDetailsAppointmentClaimComponent } from "./insurance-laboratory-imagin-claim/insurance-details-appointment-claim/insurance-details-appointment-claim.component";
import { InsuranceMakeMedicineClaimNewComponent } from "./insurance-make-medicine-claim-new/insurance-make-medicine-claim-new.component";
import { InsuranceMedicineClaimAdminComponent } from "./insurance-make-medicine-claim-new/insurance-medicine-claim-admin/insurance-medicine-claim-admin.component";
import { InsuranceMakeMedicalConsultationComponent } from "./insurance-make-medical-consultation/insurance-make-medical-consultation.component";
import { InsurnaceMedicalClaimAdminComponent } from "./insurance-make-medical-consultation/insurnace-medical-claim-admin/insurnace-medical-claim-admin.component";
import { InsuranceMakeHospitalizationClaimComponent } from "./insurance-make-hospitalization-claim/insurance-make-hospitalization-claim.component";
import { InsuranceHospitalizationClaimViewComponent } from "./insurance-make-hospitalization-claim/insurance-hospitalization-claim-view/insurance-hospitalization-claim-view.component";
import { InsuranceHospitalizatioclaimComponent } from "./insurance-make-hospitalization-claim/insurance-hospitalizatioclaim/insurance-hospitalizatioclaim.component";
import { InsuranceLaboratoryImaginClaimComponent } from "./insurance-laboratory-imagin-claim/insurance-laboratory-imagin-claim.component";
import { InsuranceLogsComponent } from "./insurance-logs/insurance-logs.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: InsuranceLoginComponent,
  },
  {
    path: "signup",
    component: InsuranceSignupComponent,
  },
  {
    path: "forgotpass",
    component: InsuranceForgotpassComponent,
  },
  {
    path: "entercode",
    component: InsuranceEntercodeComponent,
  },
  {
    path: "checkemail",
    component: InsuranceCheckemailComponent,
  },
  {
    path: "newpassword",
    component: InsuranceNewpasswordComponent,
  },
  {
    path: "passwordreset",
    component: InsurancePasswordresetComponent,
  },
  {
    path: "createprofile",
    component: InsuranceCreateprofileComponent,
  },

  {
    // path: '',canActivate:[AuthGuard] ,component: InsuranceMainComponent, children: [
    path: "",
    canActivate: [AuthGuard],
    component: InsuranceMainComponent,
    children: [
      {
        path: "",
        redirectTo: "policyclaim",
        canActivate: [CheckGuard],
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: PolicyclaimComponent,
        // component: InsuranceDashboardComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/policyclaim"] },
      },
      {
        path: "policyclaim",
        component: PolicyclaimComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/policyclaim"] },
      },
      {
        path: "insuranceanalysis",
        component: InsuranceanalysisComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/policyclaim"] },
      },
      {
        path: "insurance-healthplan",
        component: InsuranceHealthplanComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/insurance-healthplan"] },

        children: [
          {
            path: "",
            component: HealthplanviewComponent,
          },
          {
            path: "service/:id",
            component: HealthplanserviceComponent,
          },
        ],
      },
      {
        path: "claimProcessRole",
        component: InsuranceClaimProcessRoleComponent,
        data: { routing: ["/insurance/claimProcessRole"] },
      },
      {
        path: "superadminpermission",
        component: InsuranceSuperadminpermissionComponent,
        data: { routing: ["/insurance/superadminpermission"] },
      },
      {
        path: "insurance-subscribers",
        component: InsuranceSubscribersComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/insurance-subscribers"] },

        children: [
          {
            path: "",
            component: SubscribersviewComponent,
          },
          {
            path: "details/:id",
            component: SubscribersdetailComponent,
          },
          {
            path: "card-review/:id",
            component: SubscriberPreviewCardComponent
          }
        ],
      },
      {
        path: "card_preview_master",
        component: InsuranceCardPreviewMasterComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/card_preview_master"] },
      },

      {
        path: "categoryservice",
        component: InsuranceCategoryserviceComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/insurance/categoryservice"] },
      },
      {
        path: "typeofservice",
        component: InsuranceTypeofserviceComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/insurance/typeofservice"] },
      },
      {
        path: "exclusioncategory",
        component: InsuranceCategoryofexclusionComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/insurance/exclusioncategory"] },
      },
      {
        path: "serviesForHealthPlan",
        component: InsuranceExclusionnameComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/serviesForHealthPlan"] },
      },
      {
        path: "portaltypeCategory",
        component: PortaltypecategoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/portaltypeCategory"] },
      },
      {
        path: "templatebuilder",
        component: InsuranceTemplatebuilderComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/templatebuilder"] },

        children: [
          {
            path: "",
            component: TemplatelistingComponent,
          },
          {
            path: "add",
            component: AddtemplateComponent,
          },
        ],
      },
      {
        path: "healthcarenetwork",
        component: InsuranceHealthcarenetworkComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/healthcarenetwork"] },
      },
      {
        path: "notification",
        component: InsuranceNotificationComponent,
        // canActivate: [CheckGuard],
        data: { routing: ["/insurance/notification"] },
      },
      {
        path: "paymenthistory",
        component: InsurancePaymenthistoryComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/paymenthistory"] },
      },
      {
        path: "rolepermission",
        component: InsuranceRolepermissionComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/rolepermission"] },

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
        path: "staffmanagement",
        component: InsuranceStaffmanagementComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/staffmanagement"] },

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
        path: "subscriptionplan",
        component: InsuranceSubscriptionplanComponent,
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
        path: "profile",
        component: InsuranceProfilemanagementComponent,
        children: [
          {
            path: "",
            component: ViewComponent,
          },
          {
            path: "edit",
            component: EditComponent,
            // canActivate: [CheckGuard],
            data: { routing: ["/insurance/profile/edit"] },
          },
          {
            path: "changepassword",
            component: ChangepasswordComponent,
          },
        ],
      },
      {
        path: "communication",
        component: InsuranceCommunicationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/communication"] },
      },
      {
        path: "medicines",
        component: InsuranceMedicinesComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/medicines"] },

        children: [
          {
            path: "",
            component: MedicinesviewComponent,
          },
          {
            path: "details",
            component: MedicinesdetailsComponent,
          },

        ],
      },

      {
        path: "imaging-claim",
        component: InsuranceMedicinesComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/imaging-claim"] },

        children: [
          {
            path: "",
            component: InsuranceLabImaginViewComponent,
          },
          {
            path: "details",
            component: InsuranceLabImagindetailsComponent,
          },

        ],
      },


      {
        path: "dental-claim",
        component: InsuranceMedicinesComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/dental-claim"] },

        children: [
          {
            path: "",
            component: InsuranceDentalViewComponent,
          },
          {
            path: "details",
            component: InsuranceDentalDetailsComponent,
          },

        ],
      },

      {
        path: "paramedical-professions",
        component: InsuranceMedicinesComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/paramedical-professions"] },

        children: [
          {
            path: "",
            component: InsuranceParamedicalViewComponent,
          },
          {
            path: "details",
            component: InsuranceParamedicalDetailsComponent,
          },

        ],
      },

      {
        path: "appointment-claim",
        component: InsuranceAppointmentViewAllclaimComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/appointment-claim"] },

        children: [
          {
            path: "list/:path",
            component: InsuranceAppointmentAllListComponent,
          },
          {
            path: "details",
            component: InsuranceDetailsAppointmentClaimComponent,
          },

        ],
      },


      {
        path: "optical-claim",
        component: InsuranceMedicinesComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/optical-claim"] },

        children: [
          {
            path: "",
            component: InsurnaceOpticalViewComponent,
          },
          {
            path: "details",
            component: InsurnaceOpticalDetailsComponent,
          },

        ],
      },


      {
        path: "make-hospitalization-claim",
        component: InsuranceMakeHospitalizationClaimComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/make-hospitalization-claim"] },
        children: [
          {
            path: "",
            component: InsuranceHospitalizationClaimViewComponent,
          },
          {
            path: "details",
            component: InsuranceHospitalizationdetailComponent,
          },
          {
            path: "submitclaim",
            component: InsuranceHospitalizatioclaimComponent,
          }
        ],
      },
   
      {
        path: "preauthorization",
        component: InsurancePreauthorizationhospitalizationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/preauthorization"] },
      },
      {
        path: "medicalconsultation",
        component: InsuranceMedicalconsultationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/medicalconsultation"] },

        children: [
          {
            path: "",
            component: InsuranceMedicalconsultationviewComponent,
          },
          {
            path: "details",
            component: InsuranceMedicalconsultationdetailsComponent,
          }          
        ],
      },

      {
        path: "insurance-medical-claim",
        component:  InsuranceMakeMedicalConsultationComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/insurance-medical-claim"] },
        children: [
          {
            path: "",
            component: InsurnaceMedicalClaimAdminComponent,
          },
          {
            path: "details",
            component: InsuranceMedicalconsultationdetailsComponent,
          }, 
          {
            path: "submitclaim",
            component: InsuranceMedicalconsultationClaimComponent,
          }       
        ]
      },

      {
        path: "insurance-makemedicineclaim",
        component: InsuranceMakeMedicineClaimNewComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/insurance-makemedicineclaim"] },
        children: [
          {
            path: "",
            component: InsuranceMedicineClaimAdminComponent,
          },
          {
            path: "details",
            component: MedicinesdetailsComponent,
          },   
          {
            path: "submitclaim",
            component: InsuranceMedicineclaimsComponent,
          },       
        ]
      },


      // {
      //   path: "hospitalization",
      //   component: InsurnaceHopitalizatinAllclaimViewComponent,
      //   canActivate: [CheckGuard],
      //   data: { routing: ["/insurance/hospitalization"] },


      // },

      {
        path: "hospitalization",
        component: InsuranceHospitalizationClaimComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/hospitalization"] },

        children: [
          {
            path: "",
            component: InsurnaceHopitalizatinAllclaimViewComponent,
          },
          {
            path: "details",
            component: InsuranceHospitalizationdetailComponent,
          },

        ],
      },

      // {
      //   path: "appointment-dental-claim",
      //   component: InsuranceHospitalizationClaimComponent,
      //   canActivate: [CheckGuard],
      //   data: { routing: ["/insurance/appointment-dental-claim"] },

      //   children: [
      //     // {
      //     //   path: "",
      //     //   component: InsuranceAppointmentclaimlistComponent,
      //     // },
      //     {
      //       path: "details",
      //       component: InsuranceHospitalizationdetailComponent,
      //     },

      //   ],
      // },

      {
        path: "medicalproducttest",
        component: InsuranceMedicalproducttestComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/medicalproducttest"] },
      },
      {
        path: "make-order-claim",
        component: InsurnaceMakeFourPortalClaimInsuranceComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/make-order-claim"] },

        children: [
          {
            path: "list/:path",
            component: MakeFourPortalClaimListComponent,
          },
          {
            path: "details/:id/:path",
            component: MakeFourPortalClaimDetailsComponent,
          },
          {
            path: "submitclaim/:path",
            component: MakeFourPortalClaimComponent,
          }
        ],
      },

      {
        path: "make-appointment-claim",
        component: InsuranceLaboratoryImaginClaimComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/make-appointment-claim"] },

        children: [
          {
            path: "list/:path",
            component: InsuranceLabImaginClaimsAdminAppointmentComponent,
          },
          {
            path: "details/:id/:path",
            component: InsuranceDetailsAppointmentClaimComponent,
          },
          {
            path: "submitclaim/:path",
            component: InsuranceLabImaginClaimsComponent,
          }
        ],
      },

      {
        path: "logs",
        component: InsuranceLogsComponent,
        canActivate: [CheckGuard],
        data: { routing: ["/insurance/logs"] },
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
export class InsuranceRoutingModule { }
