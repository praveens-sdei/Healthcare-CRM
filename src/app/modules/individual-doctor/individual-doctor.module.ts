import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { IndividualDoctorRoutingModule } from "./individual-doctor-routing.module";
import { IndividualDoctorLoginComponent } from "./individual-doctor-login/individual-doctor-login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IndividualDoctorForgotpassComponent } from "./individual-doctor-forgotpass/individual-doctor-forgotpass.component";
import { MatIconModule } from "@angular/material/icon";
import { IndividualDoctorSignupComponent } from "./individual-doctor-signup/individual-doctor-signup.component";
import { IndividualDoctorEntercodeComponent } from "./individual-doctor-entercode/individual-doctor-entercode.component";
import { IndividualDoctorCheckemailComponent } from "./individual-doctor-checkemail/individual-doctor-checkemail.component";
import { IndividualDoctorNewpasswordComponent } from "./individual-doctor-newpassword/individual-doctor-newpassword.component";
import { IndividualDoctorPasswordresetComponent } from "./individual-doctor-passwordreset/individual-doctor-passwordreset.component";
import { IndividualDoctorHeaderComponent } from "./individual-doctor-header/individual-doctor-header.component";
import { IndividualDoctorMainComponent } from "./individual-doctor-main/individual-doctor-main.component";
import { IndividualDoctorSidebarComponent } from "./individual-doctor-sidebar/individual-doctor-sidebar.component";
import { IndividualDoctorSubscriptionplanComponent } from "./individual-doctor-subscriptionplan/individual-doctor-subscriptionplan.component";
import { PlanComponent } from "./individual-doctor-subscriptionplan/plan/plan.component";
import { HistoryComponent } from "./individual-doctor-subscriptionplan/history/history.component";
import { PaymentComponent } from "./individual-doctor-subscriptionplan/payment/payment.component";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { IndividualDoctorMyprofileComponent } from "./individual-doctor-myprofile/individual-doctor-myprofile.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTimepickerModule } from "mat-timepicker";
import { MatRadioModule } from "@angular/material/radio";
import { BasicinfoComponent } from "./individual-doctor-myprofile/basicinfo/basicinfo.component";
import { EducationalComponent } from "./individual-doctor-myprofile/educational/educational.component";
import { LocationComponent } from "./individual-doctor-myprofile/location/location.component";
import { AvailabilityComponent } from "./individual-doctor-myprofile/availability/availability.component";
import { FeemanagementComponent } from "./individual-doctor-myprofile/feemanagement/feemanagement.component";
import { ManagepermissionComponent } from "./individual-doctor-myprofile/managepermission/managepermission.component";
import { DocumentmanageComponent } from "./individual-doctor-myprofile/documentmanage/documentmanage.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { IndividualDoctorStaffmanagementComponent } from "./individual-doctor-staffmanagement/individual-doctor-staffmanagement.component";
import { AddstaffComponent } from "./individual-doctor-staffmanagement/addstaff/addstaff.component";
import { ViewstaffComponent } from "./individual-doctor-staffmanagement/viewstaff/viewstaff.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatPaginatorModule } from "@angular/material/paginator";
import { IndividualDoctorRoleandpermisionComponent } from "./individual-doctor-roleandpermision/individual-doctor-roleandpermision.component";
import { SelectroleComponent } from "./individual-doctor-roleandpermision/selectrole/selectrole.component";
import { ViewroleComponent } from "./individual-doctor-roleandpermision/viewrole/viewrole.component";
import { EditprofileComponent } from "./individual-doctor-myprofile/editprofile/editprofile.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { IndividualDoctorUserinvitaionComponent } from "./individual-doctor-userinvitaion/individual-doctor-userinvitaion.component";
import { IndividualDoctorMedicalproductstestsComponent } from "./individual-doctor-medicalproductstests/individual-doctor-medicalproductstests.component";
import { IndividualDoctorLeavesComponent } from "./individual-doctor-leaves/individual-doctor-leaves.component";
import { IndividualDoctorNotificationComponent } from "./individual-doctor-notification/individual-doctor-notification.component";
import { IndividualDoctorPaymenthistoryComponent } from "./individual-doctor-paymenthistory/individual-doctor-paymenthistory.component";
import { IndividualDoctorMasterComponent } from "./individual-doctor-master/individual-doctor-master.component";
import { IndividualDoctorMydocumentComponent } from "./individual-doctor-mydocument/individual-doctor-mydocument.component";
import { TemplatebuilderComponent } from "./individual-doctor-master/templatebuilder/templatebuilder.component";
import { AddtemplateComponent } from "./individual-doctor-master/addtemplate/addtemplate.component";
import { QuestionnaireComponent } from "./individual-doctor-master/questionnaire/questionnaire.component";
import { AppointmentreasonsComponent } from "./individual-doctor-master/appointmentreasons/appointmentreasons.component";
import { LogsComponent } from "./individual-doctor-master/logs/logs.component";
import { IndividualDoctorRevenuemanagementComponent } from "./individual-doctor-revenuemanagement/individual-doctor-revenuemanagement.component";
import { SharedModule } from "../shared.module";
import { IndividualDoctorRatingandreviewComponent } from "./individual-doctor-ratingandreview/individual-doctor-ratingandreview.component";
import { IndividualDoctorComplaintsComponent } from "./individual-doctor-complaints/individual-doctor-complaints.component";
import { ComplaintdetailComponent } from "./individual-doctor-complaints/complaintdetail/complaintdetail.component";
import { CompalintlistComponent } from "./individual-doctor-complaints/compalintlist/compalintlist.component";
import { IndividualDoctorPatientmanagementComponent } from "./individual-doctor-patientmanagement/individual-doctor-patientmanagement.component";
import { ViewpatientComponent } from "./individual-doctor-patientmanagement/viewpatient/viewpatient.component";

import { AddpatientComponent } from "./individual-doctor-patientmanagement/addpatient/addpatient.component";
import { IndividualDoctorDashboardComponent } from "./individual-doctor-dashboard/individual-doctor-dashboard.component";
import { IndividualDoctorClaimsComponent } from "./individual-doctor-claims/individual-doctor-claims.component";
import { MedicalconsultationComponent } from "./individual-doctor-claims/medicalconsultation/medicalconsultation.component";
import { HospitalizationclaimsComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalizationclaims.component";
import { MedicalclaimdetailsComponent } from "./individual-doctor-claims/medicalconsultation/medicalclaimdetails/medicalclaimdetails.component";
import { MedicalclaimviewComponent } from "./individual-doctor-claims/medicalconsultation/medicalclaimview/medicalclaimview.component";
import { HospitalizationclaimsviewComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalizationclaimsview/hospitalizationclaimsview.component";
import { HospitalizationclaimsdetailsComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalizationclaimsdetails/hospitalizationclaimsdetails.component";
import { MatChipsModule } from "@angular/material/chips";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

import { MedicalsubmitclaimComponent } from "./individual-doctor-claims/medicalconsultation/medicalsubmitclaim/medicalsubmitclaim.component";
import { HospitalsubmitclaimComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalsubmitclaim/hospitalsubmitclaim.component";
import { IndividualDoctorAppointmentComponent } from "./individual-doctor-appointment/individual-doctor-appointment.component";
import { AppointmentlistComponent } from "./individual-doctor-appointment/appointmentlist/appointmentlist.component";
import { IndividualDoctorPreauthhospitalizationComponent } from "./individual-doctor-preauthhospitalization/individual-doctor-preauthhospitalization.component";
import { IndividualDoctorOtherpreauthComponent } from "./individual-doctor-otherpreauth/individual-doctor-otherpreauth.component";
import { AppointmentdetailsComponent } from "./individual-doctor-appointment/appointmentdetails/appointmentdetails.component";
import { UpcomingappointmentdetailsComponent } from "./individual-doctor-appointment/upcomingappointmentdetails/upcomingappointmentdetails.component";
import { VideocallComponent } from './individual-doctor-appointment/videocall/videocall.component';
import { SchedulerComponent } from './individual-doctor-appointment/scheduler/scheduler.component';
import { NewappointmentComponent } from './individual-doctor-appointment/newappointment/newappointment.component';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { VitalComponent } from './individual-doctor-appointment/upcomingappointmentdetails/vital/vital.component';
import { MedicineComponent } from './individual-doctor-appointment/upcomingappointmentdetails/medicine/medicine.component';
import { ImmunizationComponent } from './individual-doctor-appointment/upcomingappointmentdetails/immunization/immunization.component';
import { AppointmenthistoryComponent } from './individual-doctor-appointment/upcomingappointmentdetails/appointmenthistory/appointmenthistory.component';
import { MedicaldocumentComponent } from './individual-doctor-appointment/upcomingappointmentdetails/medicaldocument/medicaldocument.component';
import { AssessmentComponent } from './individual-doctor-appointment/upcomingappointmentdetails/assessment/assessment.component';
import { PastappointmentComponent } from './individual-doctor-appointment/upcomingappointmentdetails/pastappointment/pastappointment.component';
import { IgxCalendarModule, IgxDialogModule, IgxPrefixModule, IgxSelectModule } from 'igniteui-angular';
import { HammerModule } from '@angular/platform-browser';
import { IndividualDoctorEprescriptionComponent } from './individual-doctor-eprescription/individual-doctor-eprescription.component';
import { EprescriptionlistComponent } from './individual-doctor-eprescription/eprescriptionlist/eprescriptionlist.component';
import { EprescriptiondetailsComponent } from './individual-doctor-eprescription/eprescriptiondetails/eprescriptiondetails.component';

import { MedicinesComponent } from './individual-doctor-eprescription/medicines/medicines.component';
import { EprescriptionmedicineComponent } from './individual-doctor-eprescription/medicines/eprescriptionmedicine/eprescriptionmedicine.component';
import { PreviewmedicineprescriptionComponent } from './individual-doctor-eprescription/medicines/previewmedicineprescription/previewmedicineprescription.component';
import { DatePipe } from "@angular/common";
import { ValidatemedicineprescriptionComponent } from './individual-doctor-eprescription/medicines/validatemedicineprescription/validatemedicineprescription.component';
import { ValidatemedicinesignatureComponent } from './individual-doctor-eprescription/medicines/validatemedicinesignature/validatemedicinesignature.component';
import { LabComponent } from './individual-doctor-eprescription/lab/lab.component';
import { EprescriptionlabComponent } from './individual-doctor-eprescription/lab/eprescriptionlab/eprescriptionlab.component';
import { PreviewlabprescriptionComponent } from './individual-doctor-eprescription/lab/previewlabprescription/previewlabprescription.component';
import { ValidatelabprescriptionComponent } from './individual-doctor-eprescription/lab/validatelabprescription/validatelabprescription.component';
import { ValidatelabsignatureComponent } from './individual-doctor-eprescription/lab/validatelabsignature/validatelabsignature.component';
import { EprescriptionaddlabtestComponent } from './individual-doctor-eprescription/lab/eprescriptionaddlabtest/eprescriptionaddlabtest.component';
import { ImagingComponent } from './individual-doctor-eprescription/imaging/imaging.component';
import { EprescriptionimagingComponent } from './individual-doctor-eprescription/imaging/eprescriptionimaging/eprescriptionimaging.component';
import { EprescriptionaddimagingComponent } from './individual-doctor-eprescription/imaging/eprescriptionaddimaging/eprescriptionaddimaging.component';
import { PreviewimagingprescriptionComponent } from './individual-doctor-eprescription/imaging/previewimagingprescription/previewimagingprescription.component';
import { ValidateimagingprescriptionComponent } from './individual-doctor-eprescription/imaging/validateimagingprescription/validateimagingprescription.component';
import { ValidateimagingsignatureComponent } from './individual-doctor-eprescription/imaging/validateimagingsignature/validateimagingsignature.component';
import { VaccinationComponent } from './individual-doctor-eprescription/vaccination/vaccination.component';
import { EprescriptionaddvaccinationComponent } from './individual-doctor-eprescription/vaccination/eprescriptionaddvaccination/eprescriptionaddvaccination.component';
import { EprescriptionvaccinationComponent } from './individual-doctor-eprescription/vaccination/eprescriptionvaccination/eprescriptionvaccination.component';
import { PreviewvaccinationprescriptionComponent } from './individual-doctor-eprescription/vaccination/previewvaccinationprescription/previewvaccinationprescription.component';
import { ValidatevaccinationprescriptionComponent } from './individual-doctor-eprescription/vaccination/validatevaccinationprescription/validatevaccinationprescription.component';
import { ValidatevaccinationsignatureComponent } from './individual-doctor-eprescription/vaccination/validatevaccinationsignature/validatevaccinationsignature.component';
import { EyeglassesComponent } from './individual-doctor-eprescription/eyeglasses/eyeglasses.component';
import { EprescriptioneyeglassesComponent } from './individual-doctor-eprescription/eyeglasses/eprescriptioneyeglasses/eprescriptioneyeglasses.component';
import { EprescriptionaddeyeglassesComponent } from './individual-doctor-eprescription/eyeglasses/eprescriptionaddeyeglasses/eprescriptionaddeyeglasses.component';
import { PrevieweyeglassesprescriptionComponent } from './individual-doctor-eprescription/eyeglasses/previeweyeglassesprescription/previeweyeglassesprescription.component';
import { ValidateeyeglassesprescriptionComponent } from './individual-doctor-eprescription/eyeglasses/validateeyeglassesprescription/validateeyeglassesprescription.component';
import { ValidateeyeglassessignatureComponent } from './individual-doctor-eprescription/eyeglasses/validateeyeglassessignature/validateeyeglassessignature.component';
import { OtherComponent } from './individual-doctor-eprescription/other/other.component';
import { EprescriptionaddotherComponent } from './individual-doctor-eprescription/other/eprescriptionaddother/eprescriptionaddother.component';
import { EprescriptionotherComponent } from './individual-doctor-eprescription/other/eprescriptionother/eprescriptionother.component';
import { PreviewotherprescriptionComponent } from './individual-doctor-eprescription/other/previewotherprescription/previewotherprescription.component';
import { ValidateotherprescriptionComponent } from './individual-doctor-eprescription/other/validateotherprescription/validateotherprescription.component';
import { ValidateothersignatureComponent } from './individual-doctor-eprescription/other/validateothersignature/validateothersignature.component';
import { CdkStepper } from "@angular/cdk/stepper";
import { IndividualDoctorCommunicationComponent } from './individual-doctor-communication/individual-doctor-communication.component';
import { FormioModule } from 'angular-formio';

import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { CommoninformationComponent } from "./individual-doctor-claims/medicalconsultation/medicalsubmitclaim/commoninformation/commoninformation.component";
import { DocumentuploadComponent } from "./individual-doctor-claims/medicalconsultation/medicalsubmitclaim/documentupload/documentupload.component";
import { EsignatureComponent } from "./individual-doctor-claims/medicalconsultation/medicalsubmitclaim/esignature/esignature.component";
import { ServicetypeComponent } from "./individual-doctor-claims/medicalconsultation/medicalsubmitclaim/servicetype/servicetype.component";
import { CommoninformationHospitalComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalsubmitclaim/commoninformation-hospital/commoninformation-hospital.component";
import { DocumentuploadHospitalComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalsubmitclaim/documentupload-hospital/documentupload-hospital.component";
import { EsignatureHospitalComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalsubmitclaim/esignature-hospital/esignature-hospital.component";
import { ServicetypeHospitalComponent } from "./individual-doctor-claims/hospitalizationclaims/hospitalsubmitclaim/servicetype-hospital/servicetype-hospital.component";
import { ViweNewAppoinmentComponent } from "./individual-doctor-appointment/viwe-new-appoinment/viwe-new-appoinment.component";
import { PreviewepriscriptionComponent } from './individual-doctor-eprescription/previewepriscription/previewepriscription.component';
import { ValidateeprescriptionsComponent } from './individual-doctor-eprescription/validateeprescriptions/validateeprescriptions.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { IndividualDoctorCreateprofileComponent } from './individual-doctor-createprofile/individual-doctor-createprofile.component';
import { ContextMenuService } from "@perfectmemory/ngx-contextmenu";
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { TooltipModule } from 'ng2-tooltip-directive';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { SignaturePadModule } from 'angular2-signaturepad';
import { SlicePipe } from "@angular/common";
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';

import { PatienttodoctorComponent } from './individual-doctor-ratingandreview/patienttodoctor/patienttodoctor.component';
import { IndividualDoctorViewpdfComponent } from './individual-doctor-viewpdf/individual-doctor-viewpdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from "ngx-editor";
@NgModule({
  declarations: [
    IndividualDoctorLoginComponent,
    IndividualDoctorForgotpassComponent,
    IndividualDoctorSignupComponent,
    IndividualDoctorEntercodeComponent,
    IndividualDoctorCheckemailComponent,
    IndividualDoctorNewpasswordComponent,
    IndividualDoctorPasswordresetComponent,
    IndividualDoctorHeaderComponent,
    IndividualDoctorMainComponent,
    IndividualDoctorSidebarComponent,
    IndividualDoctorSubscriptionplanComponent,
    PlanComponent,
    HistoryComponent,
    PaymentComponent,
    IndividualDoctorMyprofileComponent,
    BasicinfoComponent,
    EducationalComponent,
    LocationComponent,
    AvailabilityComponent,
    FeemanagementComponent,
    DocumentmanageComponent,
    ManagepermissionComponent,
    IndividualDoctorStaffmanagementComponent,
    AddstaffComponent,
    ViewstaffComponent,
    IndividualDoctorRoleandpermisionComponent,
    SelectroleComponent,
    ViewroleComponent,
    EditprofileComponent,
    IndividualDoctorUserinvitaionComponent,
    IndividualDoctorMedicalproductstestsComponent,
    IndividualDoctorLeavesComponent,
    IndividualDoctorMydocumentComponent,
    IndividualDoctorNotificationComponent,
    IndividualDoctorPaymenthistoryComponent,
    IndividualDoctorMasterComponent,
    TemplatebuilderComponent,
    AddtemplateComponent,
    QuestionnaireComponent,
    AppointmentreasonsComponent,
    LogsComponent,
    IndividualDoctorRevenuemanagementComponent,
    IndividualDoctorRatingandreviewComponent,
    IndividualDoctorComplaintsComponent,
    ComplaintdetailComponent,
    CompalintlistComponent,
    IndividualDoctorPatientmanagementComponent,
    ViewpatientComponent,
    AddpatientComponent,
    IndividualDoctorDashboardComponent,
    IndividualDoctorClaimsComponent,
    MedicalconsultationComponent,
    MedicalclaimviewComponent,
    MedicalclaimdetailsComponent,
    HospitalizationclaimsComponent,
    HospitalizationclaimsviewComponent,
    HospitalizationclaimsdetailsComponent,
    MedicalsubmitclaimComponent,
    HospitalsubmitclaimComponent,
    IndividualDoctorAppointmentComponent,
    AppointmentlistComponent,
    IndividualDoctorPreauthhospitalizationComponent,
    IndividualDoctorOtherpreauthComponent,
    AppointmentdetailsComponent,
    UpcomingappointmentdetailsComponent,
    VideocallComponent,
    SchedulerComponent,
    NewappointmentComponent,
    VitalComponent,
    MedicineComponent,
    ImmunizationComponent,
    AppointmenthistoryComponent,
    MedicaldocumentComponent,
    AssessmentComponent,
    PastappointmentComponent,
    IndividualDoctorEprescriptionComponent,
    EprescriptionlistComponent,
    EprescriptiondetailsComponent,
    MedicinesComponent,
    EprescriptionmedicineComponent,
    PreviewmedicineprescriptionComponent,
    ValidatemedicineprescriptionComponent,
    ValidatemedicinesignatureComponent,
    LabComponent,
    EprescriptionlabComponent,
    PreviewlabprescriptionComponent,
    ValidatelabprescriptionComponent,
    ValidatelabsignatureComponent,
    EprescriptionaddlabtestComponent,
    ImagingComponent,
    EprescriptionimagingComponent,
    EprescriptionaddimagingComponent,
    PreviewimagingprescriptionComponent,
    ValidateimagingprescriptionComponent,
    ValidateimagingsignatureComponent,
    VaccinationComponent,
    EprescriptionaddvaccinationComponent,
    EprescriptionvaccinationComponent,
    PreviewvaccinationprescriptionComponent,
    ValidatevaccinationprescriptionComponent,
    ValidatevaccinationsignatureComponent,
    EyeglassesComponent,
    EprescriptioneyeglassesComponent,
    EprescriptionaddeyeglassesComponent,
    PrevieweyeglassesprescriptionComponent,
    ValidateeyeglassesprescriptionComponent,
    ValidateeyeglassessignatureComponent,
    OtherComponent,
    EprescriptionaddotherComponent,
    EprescriptionotherComponent,
    PreviewotherprescriptionComponent,
    ValidateotherprescriptionComponent,
    ValidateothersignatureComponent,
    IndividualDoctorCommunicationComponent,
    CommoninformationComponent,
    DocumentuploadComponent,
    EsignatureComponent,
    ServicetypeComponent,
    CommoninformationHospitalComponent,
    DocumentuploadHospitalComponent,
    EsignatureHospitalComponent,
    ServicetypeHospitalComponent,
    ViweNewAppoinmentComponent,
    PreviewepriscriptionComponent,
    ValidateeprescriptionsComponent,
    IndividualDoctorCreateprofileComponent,
    PatienttodoctorComponent,
    IndividualDoctorViewpdfComponent,
  ],
  imports: [

    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    PdfViewerModule,
    TooltipModule,
    NgxQRCodeModule,
    // HospitalService,
    FormioModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    IgxCalendarModule,
    IgxDialogModule,
    IgxPrefixModule,
    IgxSelectModule,
    HammerModule,
    SignaturePadModule,
    // HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatStepperModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatChipsModule,
    IndividualDoctorRoutingModule,
    MatButtonToggleModule,
    NgxMatDatetimePickerModule,
    NgxEditorModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaterialTimepickerModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgImageFullscreenViewModule
  ],
  providers: [HospitalService, DatePipe, CdkStepper, ContextMenuService, SlicePipe, DecimalPipe],
})
export class IndividualDoctorModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}