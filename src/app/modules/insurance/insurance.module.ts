import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { InsuranceHeaderComponent } from './insurance-header/insurance-header.component';
import { InsuranceLoginComponent } from './insurance-login/insurance-login.component';
import { InsuranceSignupComponent } from './insurance-signup/insurance-signup.component';
import { InsuranceDashboardComponent } from './insurance-dashboard/insurance-dashboard.component';
import { InsuranceSidebarComponent } from './insurance-sidebar/insurance-sidebar.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PolicyclaimComponent } from './insurance-dashboard/policyclaim/policyclaim.component';
import { InsuranceanalysisComponent } from './insurance-dashboard/insuranceanalysis/insuranceanalysis.component';
import { HealthplanviewComponent } from './insurance-healthplan/healthplanview/healthplanview.component';
import { InsuranceForgotpassComponent } from './insurance-forgotpass/insurance-forgotpass.component';
import { InsuranceCheckemailComponent } from './insurance-checkemail/insurance-checkemail.component';
import { InsuranceNewpasswordComponent } from './insurance-newpassword/insurance-newpassword.component';
import { InsurancePasswordresetComponent } from './insurance-passwordreset/insurance-passwordreset.component';
import { InsuranceCreateprofileComponent } from './insurance-createprofile/insurance-createprofile.component';
import { InsuranceCategoryserviceComponent } from './insurance-categoryservice/insurance-categoryservice.component';
import { HealthplanserviceComponent } from './insurance-healthplan/healthplanservice/healthplanservice.component';
import { InsuranceSubscribersComponent } from './insurance-subscribers/insurance-subscribers.component';
import { SubscribersviewComponent } from './insurance-subscribers/subscribersview/subscribersview.component';
import { InsuranceMainComponent } from './insurance-main/insurance-main.component';
import { InsuranceRoutingModule } from './insurance-routing.module';

import { SharedModule } from '../shared.module';
import { InsuranceProfilemanagementComponent } from './insurance-profilemanagement/insurance-profilemanagement.component';
import { ViewComponent } from './insurance-profilemanagement/view/view.component';
import { EditComponent } from './insurance-profilemanagement/edit/edit.component';
import { ChangepasswordComponent } from './insurance-profilemanagement/changepassword/changepassword.component';
import { InsuranceCommunicationComponent } from './insurance-communication/insurance-communication.component';
import { InsuranceCategoryofexclusionComponent } from './insurance-categoryofexclusion/insurance-categoryofexclusion.component';
import { InsuranceExclusionnameComponent } from './insurance-exclusionname/insurance-exclusionname.component';
import { InsuranceHealthcarenetworkComponent } from './insurance-healthcarenetwork/insurance-healthcarenetwork.component';
import { InsuranceNotificationComponent } from './insurance-notification/insurance-notification.component';
import { InsurancePaymenthistoryComponent } from './insurance-paymenthistory/insurance-paymenthistory.component';
import { InsuranceRolepermissionComponent } from './insurance-rolepermission/insurance-rolepermission.component';
import { SelectroleComponent } from './insurance-rolepermission/selectrole/selectrole.component';
import { ViewroleComponent } from './insurance-rolepermission/viewrole/viewrole.component';
import { InsuranceSubscriptionplanComponent } from './insurance-subscriptionplan/insurance-subscriptionplan.component';
import { HistoryComponent } from './insurance-subscriptionplan/history/history.component';
import { PlanComponent } from './insurance-subscriptionplan/plan/plan.component';
import { PaymentComponent } from './insurance-subscriptionplan/payment/payment.component';
import { InsuranceTypeofserviceComponent } from './insurance-typeofservice/insurance-typeofservice.component';
import { ViewstaffComponent } from './insurance-staffmanagement/viewstaff/viewstaff.component';
import { AddstaffComponent } from './insurance-staffmanagement/addstaff/addstaff.component';
import { InsuranceStaffmanagementComponent } from './insurance-staffmanagement/insurance-staffmanagement.component';
import { InsuranceEntercodeComponent } from './insurance-entercode/insurance-entercode.component';
import { InsuranceMedicinesComponent } from './insurance-medicines/insurance-medicines.component';
import { MedicinesviewComponent } from './insurance-medicines/medicinesview/medicinesview.component';
import { MedicinesdetailsComponent } from './insurance-medicines/medicinesdetails/medicinesdetails.component';
import { SubscribersdetailComponent } from './insurance-subscribers/subscribersdetail/subscribersdetail.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { InsuranceService } from './insurance.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
// import { InsuranceHospitalizationdetailComponent } from './insurance-hospitalizationdetail/insurance-hospitalizationdetail.component';
import { InsurancePreauthorizationhospitalizationComponent } from './insurance-preauthorizationhospitalization/insurance-preauthorizationhospitalization.component';
import { InsuranceMedicalconsultationComponent } from './insurance-medicalconsultation/insurance-medicalconsultation.component';
import { InsuranceMedicalconsultationviewComponent } from './insurance-medicalconsultation/insurance-medicalconsultationview/insurance-medicalconsultationview.component';
import { InsuranceMedicalconsultationdetailsComponent } from './insurance-medicalconsultation/insurance-medicalconsultationdetails/insurance-medicalconsultationdetails.component';
import { InsuranceTemplatebuilderComponent } from './insurance-templatebuilder/insurance-templatebuilder.component';
import { TemplatelistingComponent } from './insurance-templatebuilder/templatelisting/templatelisting.component';
import { AddtemplateComponent } from './insurance-templatebuilder/addtemplate/addtemplate.component';
import { InsuranceMedicalproducttestComponent } from './insurance-medicalproducttest/insurance-medicalproducttest.component';
import { CommonService } from './common.service';
import { InsuranceHealthplanComponent } from './insurance-healthplan/insurance-healthplan.component';
import { PortaltypecategoryComponent } from './insurance-portaltypecategory/portaltypecategory/portaltypecategory.component';
import { InsuranceClaimProcessRoleComponent } from './insurance-claim-process-role/insurance-claim-process-role.component';
import { InsuranceSuperadminpermissionComponent } from './insurance-superadminpermission/insurance-superadminpermission.component';
import { CommoninformationComponent } from './insurance-medicines/insurance-medicineclaims/medicineclaims/commoninformation/commoninformation.component';
import { DocumentuploadComponent } from './insurance-medicines/insurance-medicineclaims/medicineclaims/documentupload/documentupload.component';
import { ServicetypeComponent } from './insurance-medicines/insurance-medicineclaims/medicineclaims/servicetype/servicetype.component';
import { InsuranceCardPreviewMasterComponent } from './insurance-card-preview-master/insurance-card-preview-master.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubscriberPreviewCardComponent } from './insurance-subscribers/subscriber-preview-card/subscriber-preview-card.component';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { InsuranceMedicineclaimsComponent } from './insurance-medicines/insurance-medicineclaims/insurance-medicineclaims.component';
import { EsignatureComponent } from './insurance-medicines/insurance-medicineclaims/medicineclaims/esignature/esignature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InsuranceMedicalconsultationClaimComponent } from './insurance-medicalconsultation/insurance-medicalconsultation-claim/insurance-medicalconsultation-claim.component';
import { CommoninformationconsultationComponent } from './insurance-medicalconsultation/insurance-medicalconsultation-claim/commoninformationconsultation/commoninformationconsultation.component';
import { DocumentuploadConsultationComponent } from './insurance-medicalconsultation/insurance-medicalconsultation-claim/documentupload-consultation/documentupload-consultation.component';
import { EsignatureConsultationComponent } from './insurance-medicalconsultation/insurance-medicalconsultation-claim/esignature-consultation/esignature-consultation.component';
import { ServicetypeConsultationComponent } from './insurance-medicalconsultation/insurance-medicalconsultation-claim/servicetype-consultation/servicetype-consultation.component';
import { InsuranceHospitalizationClaimComponent } from './insurance-hospitalization-claim/insurance-hospitalization-claim.component';
import { InsuranceHospitalizationdetailComponent } from './insurance-hospitalization-claim/insurance-hospitalizationdetail/insurance-hospitalizationdetail.component';
import { InsurnaceHopitalizatinAllclaimViewComponent } from './insurance-hospitalization-claim/insurnace-hopitalizatin-allclaim-view/insurnace-hopitalizatin-allclaim-view.component';
import { InsuranceLaboratoryImaginClaimComponent } from './insurance-laboratory-imagin-claim/insurance-laboratory-imagin-claim.component';
import { InsuranceLabImaginViewComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-view/insurance-lab-imagin-view.component';
import { InsuranceLabImagindetailsComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagindetails/insurance-lab-imagindetails.component';
import { InsuranceLabImaginClaimsComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-claims/insurance-lab-imagin-claims.component';
import { InsuranceDentalComponent } from './insurance-dental/insurance-dental.component';
import { InsuranceDentalclaimComponent } from './insurance-dental/insurance-dentalclaim/insurance-dentalclaim.component';
import { InsuranceDentalViewComponent } from './insurance-dental/insurance-dental-view/insurance-dental-view.component';
import { InsuranceDentalDetailsComponent } from './insurance-dental/insurance-dental-details/insurance-dental-details.component';
import { InsurnaceOpticalComponent } from './insurnace-optical/insurnace-optical.component';
// import { ParamedicalProfessionComponent } from './paramedical-profession/paramedical-profession.component';
import { InsuranceParamedicalProfessionComponent } from './insurance-paramedical-profession/insurance-paramedical-profession.component';
import { InsuranceParamedicalViewComponent } from './insurance-paramedical-profession/insurance-paramedical-view/insurance-paramedical-view.component';
import { InsuranceParamedicalDetailsComponent } from './insurance-paramedical-profession/insurance-paramedical-details/insurance-paramedical-details.component';
import { InsuranceParamedicalClaimsComponent } from './insurance-paramedical-profession/insurance-paramedical-claims/insurance-paramedical-claims.component';
import { InsurnaceOpticalViewComponent } from './insurnace-optical/insurnace-optical-view/insurnace-optical-view.component';
import { InsurnaceOpticalDetailsComponent } from './insurnace-optical/insurnace-optical-details/insurnace-optical-details.component';
import { InsurnaceOpticalClaimsComponent } from './insurnace-optical/insurnace-optical-claims/insurnace-optical-claims.component';
import { InsurnaceMakeFourPortalClaimInsuranceComponent } from './insurnace-make-four-portal-claim-insurance/insurnace-make-four-portal-claim-insurance.component';
import { MakeFourPortalClaimDetailsComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim-details/make-four-portal-claim-details.component';
import { MakeFourPortalClaimListComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim-list/make-four-portal-claim-list.component';
import { MakeFourPortalClaimComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim/make-four-portal-claim.component';
import { CommoninformationFourPortalMakeInsuranceComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim/commoninformation-four-portal-make-insurance/commoninformation-four-portal-make-insurance.component';
import { DocumentuploadFourPortalMakeInsuranceComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim/documentupload-four-portal-make-insurance/documentupload-four-portal-make-insurance.component';
import { EsignatureFourPortalMakeInsuranceComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim/esignature-four-portal-make-insurance/esignature-four-portal-make-insurance.component';
import { ServicetypeFourPortalMakeInsuranceComponent } from './insurnace-make-four-portal-claim-insurance/make-four-portal-claim/servicetype-four-portal-make-insurance/servicetype-four-portal-make-insurance.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommoninformationAppointmentFourportalComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-claims/commoninformation-appointment-fourportal/commoninformation-appointment-fourportal.component';
import { DocumentuploadAppointmentFourportalComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-claims/documentupload-appointment-fourportal/documentupload-appointment-fourportal.component';
import { EsignatureAppointmentFourportalComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-claims/esignature-appointment-fourportal/esignature-appointment-fourportal.component';
import { ServicetypeAppointmentFourportalComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-claims/servicetype-appointment-fourportal/servicetype-appointment-fourportal.component';
import { InsuranceLabImaginClaimsAdminAppointmentComponent } from './insurance-laboratory-imagin-claim/insurance-lab-imagin-claims-admin-appointment/insurance-lab-imagin-claims-admin-appointment.component';
import { InsuranceAppointmentViewAllclaimComponent } from './insurance-appointment-view-allclaim/insurance-appointment-view-allclaim.component';
import { InsuranceAppointmentAllListComponent } from './insurance-appointment-view-allclaim/insurance-appointment-all-list/insurance-appointment-all-list.component';
import { InsuranceDetailsAppointmentClaimComponent } from './insurance-laboratory-imagin-claim/insurance-details-appointment-claim/insurance-details-appointment-claim.component';
import { PiechartofclaimstatusComponent } from './insurance-dashboard/insuranceanalysis_charts/piechartofclaimstatus/piechartofclaimstatus.component';
import { StatusanalysisComponent } from './insurance-dashboard/insuranceanalysis_charts/statusanalysis/statusanalysis.component';
import { InsuranceMakeMedicineClaimNewComponent } from './insurance-make-medicine-claim-new/insurance-make-medicine-claim-new.component';
import { InsuranceMedicineClaimAdminComponent } from './insurance-make-medicine-claim-new/insurance-medicine-claim-admin/insurance-medicine-claim-admin.component';
import { InsuranceMakeMedicalConsultationComponent } from './insurance-make-medical-consultation/insurance-make-medical-consultation.component';
import { InsurnaceMedicalClaimAdminComponent } from './insurance-make-medical-consultation/insurnace-medical-claim-admin/insurnace-medical-claim-admin.component';
import { InsuranceMakeHospitalizationClaimComponent } from './insurance-make-hospitalization-claim/insurance-make-hospitalization-claim.component';
import { InsuranceHospitalizationClaimViewComponent } from './insurance-make-hospitalization-claim/insurance-hospitalization-claim-view/insurance-hospitalization-claim-view.component';
import { InsuranceHospitalizatioclaimComponent } from './insurance-make-hospitalization-claim/insurance-hospitalizatioclaim/insurance-hospitalizatioclaim.component';
import { HospitalizationDocumentuploadComponent } from './insurance-make-hospitalization-claim/insurance-hospitalizatioclaim/hospitalization-documentupload/hospitalization-documentupload.component';
import { HospitalizationCommoninformationComponent } from './insurance-make-hospitalization-claim/insurance-hospitalizatioclaim/hospitalization-commoninformation/hospitalization-commoninformation.component';
import { HospitalizationEsignatureComponent } from './insurance-make-hospitalization-claim/insurance-hospitalizatioclaim/hospitalization-esignature/hospitalization-esignature.component';
import { HospitalizationServicetypeComponent } from './insurance-make-hospitalization-claim/insurance-hospitalizatioclaim/hospitalization-servicetype/hospitalization-servicetype.component';
import { NgxEditorModule } from 'ngx-editor';
import { InsuranceLogsComponent } from './insurance-logs/insurance-logs.component';

@NgModule({
  declarations: [
    PolicyclaimComponent,
    InsuranceMainComponent,
    InsuranceHeaderComponent,
    InsuranceLoginComponent,
    InsuranceSignupComponent,
    InsuranceDashboardComponent,
    InsuranceSidebarComponent,
    InsuranceanalysisComponent,
    InsuranceHealthplanComponent,
    HealthplanviewComponent,
    InsuranceForgotpassComponent,
    InsuranceCheckemailComponent,
    InsuranceNewpasswordComponent,
    InsurancePasswordresetComponent,
    InsuranceCreateprofileComponent,
    InsuranceCategoryserviceComponent,
    HealthplanserviceComponent,
    InsuranceSubscribersComponent,
    InsuranceCategoryofexclusionComponent,
    InsuranceExclusionnameComponent,
    InsuranceHealthcarenetworkComponent,
    InsuranceNotificationComponent,
    InsurancePaymenthistoryComponent,
    InsuranceRolepermissionComponent,
    SelectroleComponent,
    ViewroleComponent,
    InsuranceSubscriptionplanComponent,
    HistoryComponent,
    PlanComponent,
    PaymentComponent,
    InsuranceTypeofserviceComponent,
    SubscribersdetailComponent,
    SubscribersviewComponent,
    InsuranceCommunicationComponent,
    InsuranceProfilemanagementComponent,
    ViewComponent,
    EditComponent,
    ChangepasswordComponent,
    InsuranceStaffmanagementComponent,
    ViewstaffComponent,
    AddstaffComponent,
    InsuranceEntercodeComponent,
    InsuranceMedicinesComponent,
    MedicinesviewComponent,
    MedicinesdetailsComponent,
    InsuranceHospitalizationdetailComponent,
    InsurancePreauthorizationhospitalizationComponent,
    InsuranceMedicalconsultationComponent,
    InsuranceMedicalconsultationviewComponent,
    InsuranceMedicalconsultationdetailsComponent,
    InsuranceTemplatebuilderComponent,
    TemplatelistingComponent,
    AddtemplateComponent,
    InsuranceMedicalproducttestComponent,
    PortaltypecategoryComponent,
    InsuranceClaimProcessRoleComponent,
    InsuranceSuperadminpermissionComponent,
    CommoninformationComponent,
    DocumentuploadComponent,
    EsignatureComponent,
    ServicetypeComponent,
    InsuranceCardPreviewMasterComponent,
    SubscriberPreviewCardComponent,
    InsuranceMedicineclaimsComponent,
    InsuranceMedicalconsultationClaimComponent,
    CommoninformationconsultationComponent,
    DocumentuploadConsultationComponent,
    EsignatureConsultationComponent,
    ServicetypeConsultationComponent,
    InsurnaceMedicalClaimAdminComponent,
    InsuranceMedicineClaimAdminComponent,
    InsuranceHospitalizationClaimComponent,
    InsuranceHospitalizationClaimViewComponent,
    InsuranceHospitalizatioclaimComponent,
    HospitalizationCommoninformationComponent,
    HospitalizationDocumentuploadComponent,
    HospitalizationEsignatureComponent,
    HospitalizationServicetypeComponent,
    InsurnaceHopitalizatinAllclaimViewComponent,
    InsuranceLaboratoryImaginClaimComponent,
    InsuranceLabImaginViewComponent,
    InsuranceLabImagindetailsComponent,
    InsuranceLabImaginClaimsComponent,
    InsuranceDentalComponent,
    InsuranceDentalclaimComponent,
    InsuranceDentalViewComponent,
    InsuranceDentalDetailsComponent,
    InsurnaceOpticalComponent,
    // ParamedicalProfessionComponent,
    InsuranceParamedicalProfessionComponent,
    InsuranceParamedicalViewComponent,
    InsuranceParamedicalDetailsComponent,
    InsuranceParamedicalClaimsComponent,
    InsurnaceOpticalViewComponent,
    InsurnaceOpticalDetailsComponent,
    InsurnaceOpticalClaimsComponent,
    InsurnaceMakeFourPortalClaimInsuranceComponent,
    MakeFourPortalClaimDetailsComponent,
    MakeFourPortalClaimListComponent,
    MakeFourPortalClaimComponent,
    CommoninformationFourPortalMakeInsuranceComponent,
    DocumentuploadFourPortalMakeInsuranceComponent,
    EsignatureFourPortalMakeInsuranceComponent,
    ServicetypeFourPortalMakeInsuranceComponent,
    CommoninformationAppointmentFourportalComponent,
    DocumentuploadAppointmentFourportalComponent,
    EsignatureAppointmentFourportalComponent,
    ServicetypeAppointmentFourportalComponent,
    InsuranceLabImaginClaimsAdminAppointmentComponent,
    InsuranceAppointmentViewAllclaimComponent,
    InsuranceAppointmentAllListComponent,
    InsuranceDetailsAppointmentClaimComponent,
    PiechartofclaimstatusComponent,
    StatusanalysisComponent,
    InsuranceMakeMedicineClaimNewComponent,
    InsuranceMakeMedicalConsultationComponent,
    InsuranceMakeHospitalizationClaimComponent,
    InsuranceLogsComponent,

  ],
  imports: [
    SharedModule,
    // HttpClientModule,
    PdfViewerModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSortModule,
    MatTableExporterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatTooltipModule,
    // BrowserAnimationsModule,
    SignaturePadModule,
    InsuranceRoutingModule,
    NgImageFullscreenViewModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NgxEditorModule,
  ],
  providers: [
    InsuranceService,
    CommonService
  ]
})
export class InsuranceModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}