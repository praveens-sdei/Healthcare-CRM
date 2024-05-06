import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FourPortalRoutingModule } from './four-portal-routing.module';
import { FourPortalLoginComponent } from './four-portal-login/four-portal-login.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FourPortalSignupComponent } from './four-portal-signup/four-portal-signup.component';
import { FourPortalForgotpassComponent } from './four-portal-forgotpass/four-portal-forgotpass.component';
import { MatIconModule } from "@angular/material/icon";
import { FourPortalEntercodeComponent } from './four-portal-entercode/four-portal-entercode.component';
import { SharedModule } from "../shared.module";
import { FourPortalNewpasswordComponent } from './four-portal-newpassword/four-portal-newpassword.component';
import { FourPortalMainComponent } from './four-portal-main/four-portal-main.component';
import { FourPortalDashboardComponent } from './four-portal-dashboard/four-portal-dashboard.component';
import { FourPortalCreateprofileComponent } from './four-portal-createprofile/four-portal-createprofile.component';
import { FourPortalHeaderComponent } from './four-portal-header/four-portal-header.component';
import { FourPortalSidebarComponent } from './four-portal-sidebar/four-portal-sidebar.component';
import { FourPortalEditprofileComponent } from './four-portal-editprofile/four-portal-editprofile.component';
import { FourPortalViewProfileComponent } from './four-portal-view-profile/four-portal-view-profile.component';
import { FourPortalUserinvitationComponent } from './four-portal-userinvitation/four-portal-userinvitation.component';
import { FourPortalSubscriptionplanComponent } from './four-portal-subscriptionplan/four-portal-subscriptionplan.component';
import { HistoryComponent } from './four-portal-subscriptionplan/history/history.component';
import { PaymentComponent } from './four-portal-subscriptionplan/payment/payment.component';
import { PlanComponent } from './four-portal-subscriptionplan/plan/plan.component';
import { FourPortalRoleandpermissionComponent } from './four-portal-roleandpermission/four-portal-roleandpermission.component';
import { FourPortalSelectroleComponent } from './four-portal-roleandpermission/four-portal-selectrole/four-portal-selectrole.component';
import { FourPortalViewroleComponent } from './four-portal-roleandpermission/four-portal-viewrole/four-portal-viewrole.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { FourPortalStaffManagementComponent } from './four-portal-staff-management/four-portal-staff-management.component';
import { FourPortalAddStaffComponent } from './four-portal-staff-management/four-portal-add-staff/four-portal-add-staff.component';
import { FourPortalViewStaffComponent } from './four-portal-staff-management/four-portal-view-staff/four-portal-view-staff.component';
import { FourPortalMasterComponent } from './four-portal-master/four-portal-master.component';
import { AppointmentReasonsComponent } from './four-portal-master/appointment-reasons/appointment-reasons.component';
import { AssesmentQuestionnaireComponent } from './four-portal-master/assesment-questionnaire/assesment-questionnaire.component';
import { FourPortalMedicalproductstestsComponent } from './four-portal-medicalproductstests/four-portal-medicalproductstests.component';
import { BasicinfoFourportalComponent } from './four-portal-editprofile/basicinfo-fourportal/basicinfo-fourportal.component';
import { AvailabilityFourportalComponent } from './four-portal-editprofile/availability-fourportal/availability-fourportal.component';
import { LocationFourportalComponent } from './four-portal-editprofile/location-fourportal/location-fourportal.component';
import { FeemanagementFourportalComponent } from './four-portal-editprofile/feemanagement-fourportal/feemanagement-fourportal.component';
import { DocumentmanageFourportalComponent } from './four-portal-editprofile/documentmanage-fourportal/documentmanage-fourportal.component';
import { EducationalFourportalComponent } from './four-portal-editprofile/educational-fourportal/educational-fourportal.component';
import { TemplatebuilderrComponent } from './four-portal-master/templatebuilderr/templatebuilderr.component';
import { AddTemplatebuilderrrComponent } from './four-portal-master/templatebuilderr/add-templatebuilderrr/add-templatebuilderrr.component';
import { FormioModule } from 'angular-formio';
import { FourPortalMedicineclaimsComponent } from './four-portal-medicineclaims/four-portal-medicineclaims.component';
import { FourPortalClaimComponent } from './four-portal-medicineclaims/four-portal-claim/four-portal-claim.component';
import { FourPortalMedicineclaimDetailsComponent } from './four-portal-medicineclaims/four-portal-medicineclaim-details/four-portal-medicineclaim-details.component';
import { FourPortalMedicineclaimListComponent } from './four-portal-medicineclaims/four-portal-medicineclaim-list/four-portal-medicineclaim-list.component';
import { CommoninformationComponent } from './four-portal-medicineclaims/four-portal-claim/commoninformation/commoninformation.component';
import { DocumentuploadComponent } from './four-portal-medicineclaims/four-portal-claim/documentupload/documentupload.component';
import { EsignatureComponent } from './four-portal-medicineclaims/four-portal-claim/esignature/esignature.component';
import { ServicetypeComponent } from './four-portal-medicineclaims/four-portal-claim/servicetype/servicetype.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FourPortalCommunicationComponent } from './four-portal-communication/four-portal-communication.component';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { FourPortalOrderTestComponent } from './four-portal-order-test/four-portal-order-test.component';
import { FourPortalAllRequestListComponent } from './four-portal-order-test/four-portal-all-request-list/four-portal-all-request-list.component';
import { FourPortalPriceRequestComponent } from './four-portal-price-request/four-portal-price-request.component';
import { FourPortalAvailibilityRequestComponent } from './four-portal-availibility-request/four-portal-availibility-request.component';
import { PriceDetailsComponent } from './four-portal-price-request/price-details/price-details.component';
import { PriceCompleteComponent } from './four-portal-price-request/price-complete/price-complete.component';
import { PriceAllListComponent } from './four-portal-price-request/price-all-list/price-all-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AvailibilityDetailsComponent } from './four-portal-availibility-request/availibility-details/availibility-details.component';
import { AvailibilityAllListComponent } from './four-portal-availibility-request/availibility-all-list/availibility-all-list.component';
import { AvailibilityCompleteComponent } from './four-portal-availibility-request/availibility-complete/availibility-complete.component';
import { FourPortalPatientmanagementComponent } from './four-portal-patientmanagement/four-portal-patientmanagement.component';
import { AddpatientComponent } from './four-portal-patientmanagement/addpatient/addpatient.component';
import { ViewpatientComponent } from './four-portal-patientmanagement/viewpatient/viewpatient.component';
import { OrderDetailsComponent } from './four-portal-order-test/order-details/order-details.component';
import { AcceptDetailsComponent } from './four-portal-order-test/accept-details/accept-details.component';
import { ScheduleDetailsComponent } from './four-portal-order-test/schedule-details/schedule-details.component';
import { CompleteDetailsComponent } from './four-portal-order-test/complete-details/complete-details.component';
import { CancelDetailsComponent } from './four-portal-order-test/cancel-details/cancel-details.component';
import { RejectDetailsComponent } from './four-portal-order-test/reject-details/reject-details.component';
import { NewOrderDetailsComponent } from './four-portal-order-test/new-order-details/new-order-details.component';
import { FourPortalAppointmentComponent } from './four-portal-appointment/four-portal-appointment.component';
import { AppopintmentListComponent } from './four-portal-appointment/appopintment-list/appopintment-list.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTimepickerModule } from "mat-timepicker";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule,NgxMatTimepickerModule,} from "@angular-material-components/datetime-picker";
import { IgxCalendarModule, IgxDialogModule, IgxPrefixModule, IgxSelectModule } from 'igniteui-angular';
import { AppointmentDetailsComponent } from './four-portal-appointment/appointment-details/appointment-details.component';
import { DecimalPipe,DatePipe, SlicePipe } from "@angular/common";
import { FourPortalRatingandreviewComponent } from './four-portal-ratingandreview/four-portal-ratingandreview.component';
import { PatientVitalsComponent } from './four-portal-appointment/appointment-details/patient-vitals/patient-vitals.component';
import { PatientMedicineComponent } from './four-portal-appointment/appointment-details/patient-medicine/patient-medicine.component';
import { PatientPastAppointmentComponent } from './four-portal-appointment/appointment-details/patient-past-appointment/patient-past-appointment.component';
import { PatientPastImmunizationComponent } from './four-portal-appointment/appointment-details/patient-past-immunization/patient-past-immunization.component';
import { PatientMedicalDocumentComponent } from './four-portal-appointment/appointment-details/patient-medical-document/patient-medical-document.component';
import { PatientAssessmentComponent } from './four-portal-appointment/appointment-details/patient-assessment/patient-assessment.component';
import { PatientAppointmentHistoryComponent } from './four-portal-appointment/appointment-details/patient-appointment-history/patient-appointment-history.component';
import { FourPortalEPrescriptionComponent } from './four-portal-e-prescription/four-portal-e-prescription.component';
import { EPrescriptionListComponent } from './four-portal-e-prescription/e-prescription-list/e-prescription-list.component';
import { EPrescriptionDeatilsComponent } from './four-portal-e-prescription/e-prescription-deatils/e-prescription-deatils.component';
import { EPrescriptionPreviewComponent } from './four-portal-e-prescription/e-prescription-preview/e-prescription-preview.component';
import { EPrescriptionValidateComponent } from './four-portal-e-prescription/e-prescription-validate/e-prescription-validate.component';
import { LabPrescripeComponent } from './four-portal-e-prescription/lab-prescripe/lab-prescripe.component';
import { ImagingPrescripeComponent } from './four-portal-e-prescription/imaging-prescripe/imaging-prescripe.component';
import { OthersPrescripeComponent } from './four-portal-e-prescription/others-prescripe/others-prescripe.component';
import { EyeglassPrescripeComponent } from './four-portal-e-prescription/eyeglass-prescripe/eyeglass-prescripe.component';
import { VaccinationPrescripeComponent } from './four-portal-e-prescription/vaccination-prescripe/vaccination-prescripe.component';
import { FourPortalRevenuemanagementComponent } from './four-portal-revenuemanagement/four-portal-revenuemanagement.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { EPrescriptionViewpdfComponent } from './four-portal-e-prescription/e-prescription-viewpdf/e-prescription-viewpdf.component';
import { AddMedicineComponent } from './four-portal-e-prescription/medicine-prescripe/add-medicine.component';
import { CreateAppointmentComponent } from './four-portal-appointment/create-appointment/create-appointment.component';
import { AppointmentCalenderComponent } from './four-portal-appointment/appointment-calender/appointment-calender.component';
import { ContextMenuService } from "@perfectmemory/ngx-contextmenu";
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { TooltipModule } from 'ng2-tooltip-directive';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FourPortalAppointmentClaimComponent } from './four-portal-appointment-claim/four-portal-appointment-claim.component';
import { FourPortalClaimAppointmentComponent } from './four-portal-appointment-claim/four-portal-claim-appointment/four-portal-claim-appointment.component';
import { CommoninformationAppointmentComponent } from './four-portal-appointment-claim/four-portal-claim-appointment/commoninformation-appointment/commoninformation-appointment.component';
import { DocumentuploadAppointmentComponent } from './four-portal-appointment-claim/four-portal-claim-appointment/documentupload-appointment/documentupload-appointment.component';
import { EsignatureAppointmentComponent } from './four-portal-appointment-claim/four-portal-claim-appointment/esignature-appointment/esignature-appointment.component';
import { ServicetypeAppointmentComponent } from './four-portal-appointment-claim/four-portal-claim-appointment/servicetype-appointment/servicetype-appointment.component';
import { FourPortalAppointmentListComponent } from './four-portal-appointment-claim/four-portal-appointment-list/four-portal-appointment-list.component';
import { FourPortalAppointmentDetailsComponent } from './four-portal-appointment-claim/four-portal-appointment-details/four-portal-appointment-details.component';
import { FourPortalNotificationComponent } from './four-portal-notification/four-portal-notification.component';
import { LogsComponent } from './four-portal-master/logs/logs.component';
import { FourPortalMydocumentComponent } from './four-portal-mydocument/four-portal-mydocument.component';
import { FourPortalCompliantmanagementComponent } from './four-portal-compliantmanagement/four-portal-compliantmanagement.component';
import { ComplaintListComponent } from './four-portal-compliantmanagement/complaint-list/complaint-list.component';
import { CompliantViewComponent } from './four-portal-compliantmanagement/compliant-view/compliant-view.component';
import { FourPortalPaymenthistoryComponent } from './four-portal-paymenthistory/four-portal-paymenthistory.component';
import { FourPortalLeaveManagementComponent } from './four-portal-leave-management/four-portal-leave-management.component';

@NgModule({
  declarations: [
    FourPortalLoginComponent,
    FourPortalSignupComponent,
    FourPortalForgotpassComponent,
    FourPortalEntercodeComponent,
    FourPortalNewpasswordComponent,
    FourPortalMainComponent,
    FourPortalDashboardComponent,
    FourPortalCreateprofileComponent,
    FourPortalHeaderComponent,
    FourPortalSidebarComponent,
    FourPortalEditprofileComponent,
    FourPortalViewProfileComponent,
    FourPortalUserinvitationComponent,
    FourPortalSubscriptionplanComponent,
    HistoryComponent,
    PaymentComponent,
    PlanComponent,
    FourPortalRoleandpermissionComponent,
    FourPortalSelectroleComponent,
    FourPortalViewroleComponent,
    FourPortalStaffManagementComponent,
    FourPortalAddStaffComponent,
    FourPortalViewStaffComponent,
    FourPortalMasterComponent,
    AppointmentReasonsComponent,
    AssesmentQuestionnaireComponent,
    FourPortalMedicalproductstestsComponent,
    BasicinfoFourportalComponent,
    AvailabilityFourportalComponent,
    LocationFourportalComponent,
    FeemanagementFourportalComponent,
    DocumentmanageFourportalComponent,
    EducationalFourportalComponent,
    TemplatebuilderrComponent,
    AddTemplatebuilderrrComponent,
    FourPortalMedicineclaimsComponent,
    CommoninformationComponent,
    DocumentuploadComponent,
    EsignatureComponent,
    ServicetypeComponent,
    FourPortalClaimComponent,
    FourPortalMedicineclaimDetailsComponent,
    FourPortalMedicineclaimListComponent,
    FourPortalCommunicationComponent,
    FourPortalOrderTestComponent,
    FourPortalAllRequestListComponent,
    FourPortalPriceRequestComponent,
    FourPortalAvailibilityRequestComponent,
    PriceDetailsComponent,
    PriceCompleteComponent,
    PriceAllListComponent,
    AvailibilityDetailsComponent,
    AvailibilityAllListComponent,
    AvailibilityCompleteComponent,
    FourPortalPatientmanagementComponent,
    AddpatientComponent,
    ViewpatientComponent,
    OrderDetailsComponent,
    AcceptDetailsComponent,
    ScheduleDetailsComponent,
    CompleteDetailsComponent,
    CancelDetailsComponent,
    RejectDetailsComponent,
    NewOrderDetailsComponent,
    FourPortalAppointmentComponent,
    AppopintmentListComponent,
    AppointmentDetailsComponent,
    FourPortalRatingandreviewComponent,
    PatientVitalsComponent,
    PatientMedicineComponent,
    PatientPastAppointmentComponent,
    PatientPastImmunizationComponent,
    PatientMedicalDocumentComponent,
    PatientAssessmentComponent,
    PatientAppointmentHistoryComponent,
    FourPortalEPrescriptionComponent,
    EPrescriptionListComponent,
    EPrescriptionDeatilsComponent,
    EPrescriptionPreviewComponent,
    EPrescriptionValidateComponent,
    LabPrescripeComponent,
    ImagingPrescripeComponent,
    OthersPrescripeComponent,
    EyeglassPrescripeComponent,
    VaccinationPrescripeComponent,
    AddMedicineComponent,
    FourPortalRevenuemanagementComponent,
    EPrescriptionViewpdfComponent,
    CreateAppointmentComponent,
    AppointmentCalenderComponent,
    FourPortalAppointmentClaimComponent,
    FourPortalClaimAppointmentComponent,
    CommoninformationAppointmentComponent,
    DocumentuploadAppointmentComponent,
    EsignatureAppointmentComponent,
    ServicetypeAppointmentComponent,
    FourPortalAppointmentListComponent,
    FourPortalAppointmentDetailsComponent,
    FourPortalNotificationComponent,
    LogsComponent,
    FourPortalMydocumentComponent,
    FourPortalCompliantmanagementComponent,
    ComplaintListComponent,
    CompliantViewComponent,
    FourPortalPaymenthistoryComponent,
    FourPortalLeaveManagementComponent,


  ],
  imports: [
    CommonModule,
    FourPortalRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule,
    MatButtonToggleModule,
    FormioModule,
    SignaturePadModule,
    PdfViewerModule,
    MatDatepickerModule,
    MatStepperModule,
    MatTimepickerModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    IgxCalendarModule, 
    IgxDialogModule, 
    IgxPrefixModule, 
    IgxSelectModule,
    NgxQRCodeModule,
    TooltipModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ContextMenuModule.forRoot({
      useBootstrap4:true
    }),
    // ContextMenuModule,
    // ContextMenuService,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgImageFullscreenViewModule
  ],
  providers: [DatePipe,SlicePipe,DecimalPipe,ContextMenuService],

})
export class FourPortalModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
