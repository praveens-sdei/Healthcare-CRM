import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared.module';
import { PharmacyRoutingModule } from './pharmacy-routing.module';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { PharmacySidebarComponent } from './pharmacy-sidebar/pharmacy-sidebar.component';
import { PharmacyHeaderComponent } from './pharmacy-header/pharmacy-header.component';
import { PharmacyMainComponent } from './pharmacy-main/pharmacy-main.component';
import { PharmacyLoginComponent } from './pharmacy-login/pharmacy-login.component';
import { PharmacySignupComponent } from './pharmacy-signup/pharmacy-signup.component';
import { PharmacyCreatprofileComponent } from './pharmacy-creatprofile/pharmacy-creatprofile.component';
// import { SubscribersdetailComponent } from './modules/insurance/insurance-subscribers/subscribersdetail/subscribersdetail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PharmacyEntercodeComponent } from './pharmacy-entercode/pharmacy-entercode.component';
import { PharmacyService } from './pharmacy.service';
import { PharmacyForgotpasswordComponent } from './pharmacy-forgotpassword/pharmacy-forgotpassword.component';
import { PharmacyCheckemailComponent } from './pharmacy-checkemail/pharmacy-checkemail.component';
import { PharmacyNewpasswordComponent } from './pharmacy-newpassword/pharmacy-newpassword.component';
import { PharmacyPasswordresetComponent } from './pharmacy-passwordreset/pharmacy-passwordreset.component';
import { PharmacySubscriptionplanComponent } from './pharmacy-subscriptionplan/pharmacy-subscriptionplan.component';
import { SubscriptionplanhistoryComponent } from './pharmacy-subscriptionplan/subscriptionplanhistory/subscriptionplanhistory.component';
import { SubscriptionplanComponent } from './pharmacy-subscriptionplan/subscriptionplan/subscriptionplan.component';
import { SubscriptionpaywithcardComponent } from './pharmacy-subscriptionplan/subscriptionpaywithcard/subscriptionpaywithcard.component';
import { PharmacyPlanService } from './pharmacy-plan.service';
import { PharmacyPrescriptionorderComponent } from './pharmacy-prescriptionorder/pharmacy-prescriptionorder.component';
import { PrescriptionorderComponent } from './pharmacy-prescriptionorder/prescriptionorder/prescriptionorder.component';
import { NeworderComponent } from './pharmacy-prescriptionorder/neworder/neworder.component';
import { AcceptedorderComponent } from './pharmacy-prescriptionorder/acceptedorder/acceptedorder.component';
import { ScheduledorderComponent } from './pharmacy-prescriptionorder/scheduledorder/scheduledorder.component';
import { CompletedorderComponent } from './pharmacy-prescriptionorder/completedorder/completedorder.component';
import { PrescriptionorderPaymentComponent } from './pharmacy-prescriptionorder/prescriptionorder-payment/prescriptionorder-payment.component';
import { PharmacyMedicinepricerequestComponent } from './pharmacy-medicinepricerequest/pharmacy-medicinepricerequest.component';
import { MedicinepricerequestComponent } from './pharmacy-medicinepricerequest/medicinepricerequest/medicinepricerequest.component';
import { NewpriceComponent } from './pharmacy-medicinepricerequest/newprice/newprice.component';
import { CompletedComponent } from './pharmacy-medicinepricerequest/completed/completed.component';
import { CancelledComponent } from './pharmacy-medicinepricerequest/cancelled/cancelled.component';
import { RejectedComponent } from './pharmacy-medicinepricerequest/rejected/rejected.component';
import { PharmacyAvailabilitymedicinerequestComponent } from './pharmacy-availabilitymedicinerequest/pharmacy-availabilitymedicinerequest.component';
import { AvailabilitymedicinerequestComponent } from './pharmacy-availabilitymedicinerequest/availabilitymedicinerequest/availabilitymedicinerequest.component';
import { NewavailabilityComponent } from './pharmacy-availabilitymedicinerequest/newavailability/newavailability.component';
import { CompletedrequestComponent } from './pharmacy-availabilitymedicinerequest/completedrequest/completedrequest.component';
import { PharmacyProfilemanagementComponent } from './pharmacy-profilemanagement/pharmacy-profilemanagement.component';
import { ProfileComponent } from './pharmacy-profilemanagement/profile/profile.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from 'mat-timepicker';
import { EditprofileComponent } from './pharmacy-profilemanagement/editprofile/editprofile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NeworderrequestComponent } from './pharmacy-prescriptionorder/neworderrequest/neworderrequest.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ScheduledorderrequestComponent } from './pharmacy-prescriptionorder/scheduledorderrequest/scheduledorderrequest.component';
import { NewpricerequestComponent } from './pharmacy-medicinepricerequest/newpricerequest/newpricerequest.component';
import { PharmacyStaffmanagementComponent } from './pharmacy-staffmanagement/pharmacy-staffmanagement.component';
import { AddstaffComponent } from './pharmacy-staffmanagement/addstaff/addstaff.component';
import { ViewstaffComponent } from './pharmacy-staffmanagement/viewstaff/viewstaff.component';
import { PharmacyRatingandreviewComponent } from './pharmacy-ratingandreview/pharmacy-ratingandreview.component';
import { PharmacyNotificationComponent } from './pharmacy-notification/pharmacy-notification.component';
import { PharmacyPaymenthistoryComponent } from './pharmacy-paymenthistory/pharmacy-paymenthistory.component';
import { PharmacyRevenuemanagementComponent } from './pharmacy-revenuemanagement/pharmacy-revenuemanagement.component';
import { PharmacyRoleandpermisionComponent } from './pharmacy-roleandpermision/pharmacy-roleandpermision.component';
import { PharmacyComplaintsComponent } from './pharmacy-complaints/pharmacy-complaints.component';
import { PharmacycompalintviewComponent } from './pharmacy-complaints/pharmacycompalintview/pharmacycompalintview.component';
import { ComplaintdetailComponent } from './pharmacy-complaints/complaintdetail/complaintdetail.component';
import { PharmacyMedicalproductstestsComponent } from './pharmacy-medicalproductstests/pharmacy-medicalproductstests.component';
import { PharmacyLogsComponent } from './pharmacy-logs/pharmacy-logs.component';
import { PharmacyUserinvitaionComponent } from './pharmacy-userinvitaion/pharmacy-userinvitaion.component';
import { PharmacyMedicinecliamdashboardComponent } from './pharmacy-medicinecliamdashboard/pharmacy-medicinecliamdashboard.component';
import { DashboardclaimComponent } from './pharmacy-medicinecliamdashboard/dashboardclaim/dashboardclaim.component';
import { MediclaimviewComponent } from './pharmacy-medicinecliamdashboard/mediclaimview/mediclaimview.component';
import { MediclaimdetailComponent } from './pharmacy-medicinecliamdashboard/mediclaimdetail/mediclaimdetail.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PharmacyMedicinclaimsComponent } from './pharmacy-medicinclaims/pharmacy-medicinclaims.component';
import { CommoninformationComponent } from './pharmacy-medicinclaims/commoninformation/commoninformation.component';
import { ServicetypeComponent } from './pharmacy-medicinclaims/servicetype/servicetype.component';
import { DocumentuploadComponent } from './pharmacy-medicinclaims/documentupload/documentupload.component';
import { EsignatureComponent } from './pharmacy-medicinclaims/esignature/esignature.component';
import { ViewroleComponent } from './pharmacy-roleandpermision/viewrole/viewrole.component';
import { SelectroleComponent } from './pharmacy-roleandpermision/selectrole/selectrole.component';
import { RejectedorderComponent } from './pharmacy-prescriptionorder/rejectedorder/rejectedorder.component';
import { CancelledorderComponent } from './pharmacy-prescriptionorder/cancelledorder/cancelledorder.component';
import { PharmacyMedicinclaimsPreauthorizationComponent } from './pharmacy-medicinclaims-preauthorization/pharmacy-medicinclaims-preauthorization.component';
import { CommoninformationPreauthComponent } from './pharmacy-medicinclaims-preauthorization/commoninformation-preauth/commoninformation-preauth.component';
import { DocumentuploadPreauthComponent } from './pharmacy-medicinclaims-preauthorization/documentupload-preauth/documentupload-preauth.component';
import { EsignaturePreauthComponent } from './pharmacy-medicinclaims-preauthorization/esignature-preauth/esignature-preauth.component';
import { ServicetypePreauthComponent } from './pharmacy-medicinclaims-preauthorization/servicetype-preauth/servicetype-preauth.component';
import { CancelledmedicineorderComponent } from './pharmacy-availabilitymedicinerequest/cancelledmedicineorder/cancelledmedicineorder.component';
import { RejectedmedicineorderComponent } from './pharmacy-availabilitymedicinerequest/rejectedmedicineorder/rejectedmedicineorder.component';
import { PharmacyCommunicationComponent } from './pharmacy-communication/pharmacy-communication.component';
import { DatePipe } from '@angular/common';
// import { AuthGuard } from './auth.guard';
import { AuthGuard } from 'src/app/shared/auth-guard';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SlicePipe } from '@angular/common';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
  declarations: [
    PharmacyDashboardComponent,
    PharmacySidebarComponent,
    PharmacyHeaderComponent,
    PharmacyMainComponent,
    PharmacyLoginComponent,
    PharmacySignupComponent,
    PharmacyCreatprofileComponent,
    PharmacyEntercodeComponent,
    PharmacyForgotpasswordComponent,
    PharmacyCheckemailComponent,
    PharmacyNewpasswordComponent,
    PharmacyPasswordresetComponent,
    PharmacySubscriptionplanComponent,
    SubscriptionplanhistoryComponent,
    SubscriptionplanComponent,
    SubscriptionpaywithcardComponent,
    PharmacyPrescriptionorderComponent,
    PrescriptionorderComponent,
    NeworderComponent,
    AcceptedorderComponent,
    ScheduledorderComponent,
    CompletedorderComponent,
    PrescriptionorderPaymentComponent,
    PharmacyMedicinepricerequestComponent,
    MedicinepricerequestComponent,
    NewpriceComponent,
    CompletedComponent,
    CancelledComponent,
    RejectedComponent,
    PharmacyAvailabilitymedicinerequestComponent,
    AvailabilitymedicinerequestComponent,
    NewavailabilityComponent,
    CompletedrequestComponent,
    PharmacyProfilemanagementComponent,
    ProfileComponent,
    EditprofileComponent,
    NeworderrequestComponent,
    ScheduledorderrequestComponent,
    NewpricerequestComponent,
    PharmacyStaffmanagementComponent,
    AddstaffComponent,
    ViewstaffComponent,
    PharmacyRatingandreviewComponent,
    PharmacyNotificationComponent,
    PharmacyPaymenthistoryComponent,
    PharmacyRevenuemanagementComponent,
    PharmacyComplaintsComponent,
    PharmacycompalintviewComponent,
    ComplaintdetailComponent,
    PharmacyMedicalproductstestsComponent,
    PharmacyLogsComponent,
    PharmacyUserinvitaionComponent,
    PharmacyMedicinecliamdashboardComponent,
    DashboardclaimComponent,
    MediclaimviewComponent,
    MediclaimdetailComponent,
    PharmacyRoleandpermisionComponent,
    PharmacyMedicinclaimsComponent,
    CommoninformationComponent,
    ServicetypeComponent,
    DocumentuploadComponent,
    EsignatureComponent,
    ViewroleComponent,
    SelectroleComponent,
    RejectedorderComponent,
    CancelledorderComponent,
    PharmacyMedicinclaimsPreauthorizationComponent,
    CommoninformationPreauthComponent,
    DocumentuploadPreauthComponent,
    EsignaturePreauthComponent,
    ServicetypePreauthComponent,
    CancelledmedicineorderComponent,
    RejectedmedicineorderComponent,
    PharmacyCommunicationComponent,
  ],
  imports: [
    SharedModule,
    PdfViewerModule,
    MatButtonToggleModule,
    // HttpClientModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    SignaturePadModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    PharmacyRoutingModule,
    NgImageFullscreenViewModule
  ],
  providers: [
    AuthGuard,
    PharmacyService,
    PharmacyPlanService,
    DatePipe,
    SlicePipe
  ]
})
export class PharmacyModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}