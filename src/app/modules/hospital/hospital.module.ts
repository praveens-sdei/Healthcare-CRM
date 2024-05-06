import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared.module';
import { HospitalMainComponent } from './hospital-main/hospital-main.component';
import { HospitalHeaderComponent } from './hospital-header/hospital-header.component';
import { HospitalSidebarComponent } from './hospital-sidebar/hospital-sidebar.component';
import { HospitalDashboardComponent } from './hospital-dashboard/hospital-dashboard.component';
import { HospitalLoginComponent } from './hospital-login/hospital-login.component';
import { HospitalSignupComponent } from './hospital-signup/hospital-signup.component';
import { HospitalRoutingModule } from './hospital-routing.module';
import { HospitalStaffManagementComponent } from './hospital-staff-management/hospital-staff-management.component';
import { HospitalForgotpassComponent } from './hospital-forgotpass/hospital-forgotpass.component';
import { HospitalCheckemailComponent } from './hospital-checkemail/hospital-checkemail.component';
import { HospitalSetpasswordComponent } from './hospital-setpassword/hospital-setpassword.component';
import { HospitalPasswordresetComponent } from './hospital-passwordreset/hospital-passwordreset.component';
import { HospitalProfilecreatComponent } from './hospital-profilecreat/hospital-profilecreat.component';
// import { SubscribersdetailComponent } from './modules/insurance/insurance-subscribers/subscribersdetail/subscribersdetail.component';
import {MatRadioModule} from '@angular/material/radio';
import { HospitalEntercodeComponent } from './hospital-entercode/hospital-entercode.component';
import { ViewComponent } from './hospital-staff-management/view/view.component';
import { AddComponent } from './hospital-staff-management/add/add.component';
import { HospitalRolemanagmentComponent } from './hospital-rolemanagment/hospital-rolemanagment.component';
import { SelectroleComponent } from './hospital-rolemanagment/selectrole/selectrole.component';
import { HospitalSubscriptionplanComponent } from './hospital-subscriptionplan/hospital-subscriptionplan.component';
import { PlanComponent } from './hospital-subscriptionplan/plan/plan.component';
import { HistoryComponent } from './hospital-subscriptionplan/history/history.component';
import { PaymentComponent } from './hospital-subscriptionplan/payment/payment.component';
import { HospitalRatingandreviewComponent } from './hospital-ratingandreview/hospital-ratingandreview.component';
import { PatienttodoctorComponent } from './hospital-ratingandreview/patienttodoctor/patienttodoctor.component';
import { PatienttohospitalComponent } from './hospital-ratingandreview/patienttohospital/patienttohospital.component';
import { DoctortohospitalComponent } from './hospital-ratingandreview/doctortohospital/doctortohospital.component';
import { HospitalComplaintsComponent } from './hospital-complaints/hospital-complaints.component';
import { ComplaintviewComponent } from './hospital-complaints/complaintview/complaintview.component';
import { ComplaintdetailsComponent } from './hospital-complaints/complaintdetails/complaintdetails.component';
import { HospitalManagedoctorComponent } from './hospital-managedoctor/hospital-managedoctor.component';
import { ViewdoctorComponent } from './hospital-managedoctor/viewdoctor/viewdoctor.component';
import { AdddoctorComponent } from './hospital-managedoctor/adddoctor/adddoctor.component';
import {MatStepperModule} from '@angular/material/stepper';
import { HospitalService } from './hospital.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTimepickerModule } from 'mat-timepicker';
import { HospitalMasterComponent } from './hospital-master/hospital-master.component';
import { TemplatebuilderComponent } from './hospital-master/templatebuilder/templatebuilder.component';
import { AddtemplateComponent } from './hospital-master/addtemplate/addtemplate.component';
import { CustomfieldsComponent } from './hospital-master/customfields/customfields.component';
import { EducationalcontentComponent } from './hospital-master/educationalcontent/educationalcontent.component';
import { LogsComponent } from './hospital-master/logs/logs.component';
import { HospitalPaymenthistoryComponent } from './hospital-paymenthistory/hospital-paymenthistory.component';
import { HospitalClaimsComponent } from './hospital-claims/hospital-claims.component';
import { MedicalconsultationComponent } from './hospital-claims/medicalconsultation/medicalconsultation.component';
import { HospitalizationclaimsComponent } from './hospital-claims/hospitalizationclaims/hospitalizationclaims.component';
import { HospitalUserinvitationComponent } from './hospital-userinvitation/hospital-userinvitation.component';
import { HospitalNotificationComponent } from './hospital-notification/hospital-notification.component';
import { HospitalRevenuemanagementComponent } from './hospital-revenuemanagement/hospital-revenuemanagement.component';
import { HospitalPatientmanagementComponent } from './hospital-patientmanagement/hospital-patientmanagement.component';
import { BasicinfoComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/basicinfo/basicinfo.component';
import { EducationalComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/educational/educational.component';
import { LocationComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/location/location.component';
import { AvailabilityComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/availability/availability.component';
import { FeemanagementComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/feemanagement/feemanagement.component';
import { DocumentmanageComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/documentmanage/documentmanage.component';
import { ManagepermissionComponent } from './hospital-managedoctor/adddoctor/managedoctorcomponent/managepermission/managepermission.component';
import { DepartmentComponent } from './hospital-master/department/department.component';
import { ServicesComponent } from './hospital-master/services/services.component';
import { ExpertiseComponent } from './hospital-master/expertise/expertise.component';
import { UnitComponent } from './hospital-master/unit/unit.component';
import { DoctorprofileComponent } from './hospital-managedoctor/doctorprofile/doctorprofile.component';
import { ViewroleComponent } from './hospital-rolemanagment/viewrole/viewrole.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HospitalCommunicationComponent } from './hospital-communication/hospital-communication.component';
import { HospitalProfilemanagementComponent } from './hospital-profilemanagement/hospital-profilemanagement.component';
import { ProfileComponent } from './hospital-profilemanagement/profile/profile.component';
import { EditprofileComponent } from './hospital-profilemanagement/editprofile/editprofile.component';
import { AuthGuard } from 'src/app/shared/auth-guard';
import { SlicePipe } from '@angular/common';
import { HospitalMedicalproductTestComponent } from './hospital-medicalproduct-test/hospital-medicalproduct-test.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { DatePipe } from '@angular/common';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { TeamComponent } from './hospital-master/team/team.component';
import { HospitalManagedentalComponent } from './hospital-managedental/hospital-managedental.component';
import { AdddentalComponent } from './hospital-managedental/adddental/adddental.component';
import { ViewdentalComponent } from './hospital-managedental/viewdental/viewdental.component';
import { DentalprofileComponent } from './hospital-managedental/dentalprofile/dentalprofile.component';
import { HospitalManageopticalComponent } from './hospital-manageoptical/hospital-manageoptical.component';
import { BasicinfoDentalComponent } from './hospital-managedental/adddental/basicinfo-dental/basicinfo-dental.component';
import { EducationalDentalComponent } from './hospital-managedental/adddental/educational-dental/educational-dental.component';
import { LocationDentalComponent } from './hospital-managedental/adddental/location-dental/location-dental.component';
import { AvailabilityDentalComponent } from './hospital-managedental/adddental/availability-dental/availability-dental.component';
import { FeemanagementDentalComponent } from './hospital-managedental/adddental/feemanagement-dental/feemanagement-dental.component';
import { DocumentmanageDentalComponent } from './hospital-managedental/adddental/documentmanage-dental/documentmanage-dental.component';
import { AddopticalComponent } from './hospital-manageoptical/addoptical/addoptical.component';
import { OpticalprofileComponent } from './hospital-manageoptical/opticalprofile/opticalprofile.component';
import { ViewopticalComponent } from './hospital-manageoptical/viewoptical/viewoptical.component';
import { BasicinfoOpticalComponent } from './hospital-manageoptical/addoptical/basicinfo-optical/basicinfo-optical.component';
import { AvailabilityOpticalComponent } from './hospital-manageoptical/addoptical/availability-optical/availability-optical.component';
import { EducationalOpticalComponent } from './hospital-manageoptical/addoptical/educational-optical/educational-optical.component';
import { FeemanagementOpticalComponent } from './hospital-manageoptical/addoptical/feemanagement-optical/feemanagement-optical.component';
import { LocationOpticalComponent } from './hospital-manageoptical/addoptical/location-optical/location-optical.component';
import { DocumentmanageOpticalComponent } from './hospital-manageoptical/addoptical/documentmanage-optical/documentmanage-optical.component';
import { HospitalManagelabImagingComponent } from './hospital-managelab-imaging/hospital-managelab-imaging.component';
import { AddlabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/addlab-imaging.component';
import { LabImagingprofileComponent } from './hospital-managelab-imaging/lab-imagingprofile/lab-imagingprofile.component';
import { ViewlabImagingComponent } from './hospital-managelab-imaging/viewlab-imaging/viewlab-imaging.component';
import { BasicinfoLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/basicinfo-lab-imaging/basicinfo-lab-imaging.component';
import { FeemanagementLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/feemanagement-lab-imaging/feemanagement-lab-imaging.component';
import { AvailabilityLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/availability-lab-imaging/availability-lab-imaging.component';
import { LocationLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/location-lab-imaging/location-lab-imaging.component';
import { EducationalLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/educational-lab-imaging/educational-lab-imaging.component';
import { DocumentmanageLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/documentmanage-lab-imaging/documentmanage-lab-imaging.component';
import { HospitalManageparamedicalProfessionsComponent } from './hospital-manageparamedical-professions/hospital-manageparamedical-professions.component';
import { AddparamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/addparamedical.component';
import { ViewparamedicalComponent } from './hospital-manageparamedical-professions/viewparamedical/viewparamedical.component';
import { ParamedicalprofileComponent } from './hospital-manageparamedical-professions/paramedicalprofile/paramedicalprofile.component';
import { DocumentmanageParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/documentmanage-paramedical/documentmanage-paramedical.component';
import { BasicinfoParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/basicinfo-paramedical/basicinfo-paramedical.component';
import { FeemanagementParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/feemanagement-paramedical/feemanagement-paramedical.component';
import { EducationalParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/educational-paramedical/educational-paramedical.component';
import { LocationParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/location-paramedical/location-paramedical.component';
import { AvailabilityParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/availability-paramedical/availability-paramedical.component';
import { ManagepermissionDentalComponent } from './hospital-managedental/adddental/managepermission-dental/managepermission-dental.component';
import { ManagepermissionLabImagingComponent } from './hospital-managelab-imaging/addlab-imaging/managepermission-lab-imaging/managepermission-lab-imaging.component';
import { ManagepermissionParamedicalComponent } from './hospital-manageparamedical-professions/addparamedical/managepermission-paramedical/managepermission-paramedical.component';
import { ManagepermissionOpticalComponent } from './hospital-manageoptical/addoptical/managepermission-optical/managepermission-optical.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HopitalizationclaimViewComponent } from './hospital-claims/hopitalizationclaim-view/hopitalizationclaim-view.component';
import { MedicalconsultaionViewComponent } from './hospital-claims/medicalconsultaion-view/medicalconsultaion-view.component';
import { PatientDetailsPageComponent } from './hospital-patientmanagement/patient-details-page/patient-details-page.component';
import { PatientListComponent } from './hospital-patientmanagement/patient-list/patient-list.component';
import { PatientAppointmentDetailsComponent } from './hospital-patientmanagement/patient-appointment-details/patient-appointment-details.component';
import { DecimalPipe} from "@angular/common";
@NgModule({
  declarations: [
    HospitalMainComponent,
    HospitalHeaderComponent,
    HospitalSidebarComponent,
    HospitalDashboardComponent,
    HospitalLoginComponent,
    HospitalSignupComponent,
    HospitalStaffManagementComponent,
    HospitalForgotpassComponent,
    HospitalCheckemailComponent,
    HospitalSetpasswordComponent,
    HospitalPasswordresetComponent,
    HospitalProfilecreatComponent,
    HospitalEntercodeComponent,
    ViewComponent,
    AddComponent,
    HospitalRolemanagmentComponent,
    SelectroleComponent,
    HospitalSubscriptionplanComponent,
    PlanComponent,
    HistoryComponent,
    PaymentComponent,
    HospitalRatingandreviewComponent,
    PatienttodoctorComponent,
    PatienttohospitalComponent,
    DoctortohospitalComponent,
    HospitalComplaintsComponent,
    ComplaintviewComponent,
    ComplaintdetailsComponent,
    HospitalManagedoctorComponent,
    ViewdoctorComponent,
    AdddoctorComponent,
    HospitalMasterComponent,
    TemplatebuilderComponent,
    AddtemplateComponent,
    CustomfieldsComponent,
    EducationalcontentComponent,
    LogsComponent,
    HospitalPaymenthistoryComponent,
    HospitalClaimsComponent,
    MedicalconsultationComponent,
    HospitalizationclaimsComponent,
    HospitalUserinvitationComponent,
    HospitalNotificationComponent,
    HospitalRevenuemanagementComponent,
    HospitalPatientmanagementComponent,
    BasicinfoComponent,
    EducationalComponent,
    LocationComponent,
    AvailabilityComponent,
    FeemanagementComponent,
    DocumentmanageComponent,
    ManagepermissionComponent,
    DoctorprofileComponent,
    DepartmentComponent,
    ServicesComponent,
    ExpertiseComponent,
    UnitComponent,
    ViewroleComponent,
    HospitalCommunicationComponent,
    HospitalProfilemanagementComponent,
    ProfileComponent,
    EditprofileComponent,
    HospitalMedicalproductTestComponent,
    LeaveManagementComponent,
    TeamComponent,
    HospitalManagedentalComponent,
    AdddentalComponent,
    ViewdentalComponent,
    DentalprofileComponent,
    HospitalManageopticalComponent,
    BasicinfoDentalComponent,
    EducationalDentalComponent,
    LocationDentalComponent,
    AvailabilityDentalComponent,
    FeemanagementDentalComponent,
    DocumentmanageDentalComponent,
    AddopticalComponent,
    OpticalprofileComponent,
    ViewopticalComponent,
    BasicinfoOpticalComponent,
    AvailabilityOpticalComponent,
    EducationalOpticalComponent,
    FeemanagementOpticalComponent,
    LocationOpticalComponent,
    DocumentmanageOpticalComponent,
    HospitalManagelabImagingComponent,
    AddlabImagingComponent,
    LabImagingprofileComponent,
    ViewlabImagingComponent,
    BasicinfoLabImagingComponent,
    FeemanagementLabImagingComponent,
    AvailabilityLabImagingComponent,
    LocationLabImagingComponent,
    EducationalLabImagingComponent,
    DocumentmanageLabImagingComponent,
    HospitalManageparamedicalProfessionsComponent,
    AddparamedicalComponent,
    ViewparamedicalComponent,
    ParamedicalprofileComponent,
    DocumentmanageParamedicalComponent,
    BasicinfoParamedicalComponent,
    FeemanagementParamedicalComponent,
    EducationalParamedicalComponent,
    LocationParamedicalComponent,
    AvailabilityParamedicalComponent,
    ManagepermissionDentalComponent,
    ManagepermissionLabImagingComponent,
    ManagepermissionParamedicalComponent,
    ManagepermissionOpticalComponent,
    HopitalizationclaimViewComponent,
    MedicalconsultaionViewComponent,
    PatientDetailsPageComponent,
    PatientListComponent,
    PatientAppointmentDetailsComponent,
  ],
  imports: [
    SharedModule,
    // HttpClientModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatInputModule,
    MatStepperModule,
    MatTimepickerModule,
    TranslateModule.forRoot({
      loader: {
           provide: TranslateLoader,
           useFactory: HttpLoaderFactory,
           deps: [HttpClient]
      }
      
}),
NgMultiSelectDropDownModule.forRoot(),
    // BrowserAnimationsModule,
    HospitalRoutingModule,
    NgxMaterialTimepickerModule,
    NgImageFullscreenViewModule

  ],
  providers: [
    AuthGuard,
    HospitalService,
    SlicePipe,
    DecimalPipe
  ]
})
export class HospitalModule { }

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}