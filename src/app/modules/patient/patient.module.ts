import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import {OverlayModule} from '@angular/cdk/overlay';
import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PatientRoutingModule } from "./patient-routing.module";
import { PatientHeaderComponent } from "./patient-header/patient-header.component";
import { PatientFooterComponent } from "./patient-footer/patient-footer.component";
import { PatientSidebarComponent } from "./patient-sidebar/patient-sidebar.component";
import { PatientMainComponent } from "./patient-main/patient-main.component";
import { PatientLoginComponent } from "./patient-login/patient-login.component";
import { PatientEntercodeComponent } from "./patient-entercode/patient-entercode.component";
import { PatientForgotpassComponent } from "./patient-forgotpass/patient-forgotpass.component";
import { PatientSetnewpassComponent } from "./patient-setnewpass/patient-setnewpass.component";
import { PatientEnterotpComponent } from "./patient-enterotp/patient-enterotp.component";
import { PatientResetpassComponent } from "./patient-resetpass/patient-resetpass.component";
import { PatientSignupComponent } from "./patient-signup/patient-signup.component";
import { PatientMyappointmentComponent } from "./patient-myappointment/patient-myappointment.component";
import { CalenderComponent } from "./patient-myappointment/calender/calender.component";
import { PatientProfilecreationComponent } from "./patient-profilecreation/patient-profilecreation.component";
// import {MatStepperModule} from '@angular/material/stepper';
// import {MatRadioModule} from '@angular/material/radio';
import { PatientUserinvitationComponent } from "./patient-userinvitation/patient-userinvitation.component";
import { PatientRatingandreviewComponent } from "./patient-ratingandreview/patient-ratingandreview.component";
import { PatientComplaintComponent } from "./patient-complaint/patient-complaint.component";
import { ComplaintlistComponent } from "./patient-complaint/complaintlist/complaintlist.component";
import { ComplaintviewComponent } from "./patient-complaint/complaintview/complaintview.component";
import { PatientPaymenthistoryComponent } from "./patient-paymenthistory/patient-paymenthistory.component";
import { PatientSubscriptionplanComponent } from "./patient-subscriptionplan/patient-subscriptionplan.component";
import { PlanComponent } from "./patient-subscriptionplan/plan/plan.component";
import { PaymentComponent } from "./patient-subscriptionplan/payment/payment.component";
import { CurrentplanComponent } from "./patient-subscriptionplan/currentplan/currentplan.component";
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { AppointmentlistComponent } from "./patient-myappointment/appointmentlist/appointmentlist.component";
import { AppointmentdetailsComponent } from "./patient-myappointment/appointmentdetails/appointmentdetails.component";
import { PastappointmentComponent } from "./patient-myappointment/pastappointment/pastappointment.component";
import { PatientMailboxComponent } from "./patient-mailbox/patient-mailbox.component";
import { PatientRolepermissionComponent } from "./patient-rolepermission/patient-rolepermission.component";
import { SharedModule } from "../shared.module";
import { PatientDashboardComponent } from "./patient-dashboard/patient-dashboard.component";
import { PatientMyaccountComponent } from "./patient-myaccount/patient-myaccount.component";
import { PatientPrescriptionorderComponent } from "./patient-prescriptionorder/patient-prescriptionorder.component";
import { NeworderComponent } from "./patient-prescriptionorder/neworder/neworder.component";
import { AcceptedorderComponent } from "./patient-prescriptionorder/acceptedorder/acceptedorder.component";
import { ScheduledorderComponent } from "./patient-prescriptionorder/scheduledorder/scheduledorder.component";
import { CompletedorderComponent } from "./patient-prescriptionorder/completedorder/completedorder.component";
import { PrescriptionorderComponent } from "./patient-prescriptionorder/prescriptionorder/prescriptionorder.component";
import { PrescriptionorderPaymentComponent } from "./patient-prescriptionorder/prescriptionorder-payment/prescriptionorder-payment.component";
import { PatientMedicinepricerequestComponent } from "./patient-medicinepricerequest/patient-medicinepricerequest.component";
import { MedicinepricerequestComponent } from "./patient-medicinepricerequest/medicinepricerequest/medicinepricerequest.component";
import { NewpriceComponent } from "./patient-medicinepricerequest/newprice/newprice.component";
import { CompletedComponent } from "./patient-medicinepricerequest/completed/completed.component";
import { CancelledComponent } from "./patient-medicinepricerequest/cancelled/cancelled.component";
import { RejectedComponent } from "./patient-medicinepricerequest/rejected/rejected.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { HeaderComponent } from "./homepage/header/header.component";
import { FooterComponent } from "./homepage/footer/footer.component";
import { HomeComponent } from "./homepage/home/home.component";
import { PatientAvailabilitymedicinerequestComponent } from "./patient-availabilitymedicinerequest/patient-availabilitymedicinerequest.component";
import { AvailabilitymedicinerequestComponent } from "./patient-availabilitymedicinerequest/availabilitymedicinerequest/availabilitymedicinerequest.component";
import { NewavailabilityComponent } from "./patient-availabilitymedicinerequest/newavailability/newavailability.component";
import { CompletedrequestComponent } from "./patient-availabilitymedicinerequest/completedrequest/completedrequest.component";
import { MatSortModule } from "@angular/material/sort";
import { RetailpharmacyComponent } from "./homepage/retailpharmacy/retailpharmacy.component";
import { PharmacyService } from "../pharmacy/pharmacy.service";
import { PatientService } from "./patient.service";
import { RetailpharmacydetailComponent } from "./homepage/retailpharmacydetail/retailpharmacydetail.component";
// import { SubscribersdetailComponent } from './modules/insurance/insurance-subscribers/subscribersdetail/subscribersdetail.component';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DatePipe } from "@angular/common";
import { CancelledorderComponent } from "./patient-prescriptionorder/cancelledorder/cancelledorder.component";
import { RejectedorderComponent } from "./patient-prescriptionorder/rejectedorder/rejectedorder.component";
import { RejectedmedicineorderComponent } from "./patient-availabilitymedicinerequest/rejectedmedicineorder/rejectedmedicineorder.component";
import { CancelledmedicineorderComponent } from "./patient-availabilitymedicinerequest/cancelledmedicineorder/cancelledmedicineorder.component";
import { PatientWaitingroomComponent } from "./patient-waitingroom/patient-waitingroom.component";
import { PatientUpcommingappointmentComponent } from "./patient-waitingroom/patient-upcommingappointment/patient-upcommingappointment.component";
import { PatientCalenderComponent } from "./patient-waitingroom/patient-calender/patient-calender.component";
import { RetailhospitalComponent } from "./homepage/retailhospital/retailhospital.component";
import { HospitalService } from "../hospital/hospital.service";
import { RetailHospitaldetailsComponent } from "./homepage/retail-hospitaldetails/retail-hospitaldetails.component";
import { RetaildoctorComponent } from "./homepage/retaildoctor/retaildoctor.component";
import { RetaildoctordetailsComponent } from "./homepage/retaildoctordetails/retaildoctordetails.component";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { RetailappointmentdetailsComponent } from "./homepage/retailappointmentdetails/retailappointmentdetails.component";
import { RetailreviewappointmentComponent } from "./homepage/retailreviewappointment/retailreviewappointment.component";
import { PaywithcardComponent } from "./homepage/paywithcard/paywithcard.component";
import { RetailhospitalinfoComponent } from "./homepage/retailhospitalinfo/retailhospitalinfo.component";
import {
  IgxCalendarModule,
  IgxDialogModule,
  IgxPrefixModule,
  IgxSelectModule,
} from "igniteui-angular";
import { HammerModule } from "@angular/platform-browser";
import { OverlayModule } from "@angular/cdk/overlay";
import { PatientCommunicationComponent } from "./patient-communication/patient-communication.component";
import { PatientMedicineclaimsComponent } from "./patient-medicineclaims/patient-medicineclaims.component";
import { ContextMenuModule } from "@perfectmemory/ngx-contextmenu";
import { MedicineclaimlistComponent } from "./patient-medicineclaims/medicineclaimlist/medicineclaimlist.component";
import { MedicineclaimdetailsComponent } from "./patient-medicineclaims/medicineclaimdetails/medicineclaimdetails.component";
import { MedicineclaimsComponent } from "./patient-medicineclaims/medicineclaims/medicineclaims.component";
import { CommoninformationComponent } from "./patient-medicineclaims/medicineclaims/commoninformation/commoninformation.component";
import { ServicetypeComponent } from "./patient-medicineclaims/medicineclaims/servicetype/servicetype.component";
import { DocumentuploadComponent } from "./patient-medicineclaims/medicineclaims/documentupload/documentupload.component";
import { EsignatureComponent } from "./patient-medicineclaims/medicineclaims/esignature/esignature.component";
import { TooltipModule } from "ng2-tooltip-directive";
import { PatientCreateprofileComponent } from "./patient-createprofile/patient-createprofile.component";
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";

import { SlicePipe } from "@angular/common";
import { SignaturePadModule } from "angular2-signaturepad";
import { AboutusComponent } from './homepage/aboutus/aboutus.component';
import { BlogComponent } from './homepage/blog/blog.component';
import { ContactusComponent } from './homepage/contactus/contactus.component';
import { PrivacyconditionComponent } from './homepage/privacycondition/privacycondition.component';
import { TermsconditionComponent } from './homepage/termscondition/termscondition.component';
import { HealthArticleComponent } from './homepage/health-article/health-article.component';
import { FaqComponent } from './homepage/faq/faq.component';
import { VideosComponent } from './homepage/videos/videos.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HealthArticleShowContentComponent } from './homepage/health-article-show-content/health-article-show-content.component';
import { PatientMedicalconsultationComponent } from './patient-medicalconsultation/patient-medicalconsultation.component';
import { PatientMedicalconsultationDetailsComponent } from './patient-medicalconsultation/patient-medicalconsultation-details/patient-medicalconsultation-details.component';
import { PatientMedicalconsultationlistComponent } from './patient-medicalconsultation/patient-medicalconsultationlist/patient-medicalconsultationlist.component';
import { PatientMedicalconsultationclaimsComponent } from './patient-medicalconsultation/patient-medicalconsultationclaims/patient-medicalconsultationclaims.component';
import { CommoninformationconsultationComponent } from "./patient-medicalconsultation/patient-medicalconsultationclaims/commoninformationconsultation/commoninformationconsultation.component";
import { DocumentuploadConsultationComponent } from './patient-medicalconsultation/patient-medicalconsultationclaims/documentupload-consultation/documentupload-consultation.component';
import { EsignatureConsultationComponent } from './patient-medicalconsultation/patient-medicalconsultationclaims/esignature-consultation/esignature-consultation.component';
import { ServicetypeConsultationComponent } from './patient-medicalconsultation/patient-medicalconsultationclaims/servicetype-consultation/servicetype-consultation.component';
import { ListLabDentalImagingOpticalComponent } from './homepage/list-lab-dental-imaging-optical/list-lab-dental-imaging-optical.component';
import { PatientHospitalizationClaimComponent } from './patient-hospitalization-claim/patient-hospitalization-claim.component';
import { PatientHospitalclaimDetailsComponent } from './patient-hospitalization-claim/patient-hospitalclaim-details/patient-hospitalclaim-details.component';
import { PatientHospitalclaimComponent } from './patient-hospitalization-claim/patient-hospitalclaim/patient-hospitalclaim.component';
import { PatientHospitalclaimListComponent } from './patient-hospitalization-claim/patient-hospitalclaim-list/patient-hospitalclaim-list.component';
import { CommoninformationHospitalizationComponent } from './patient-hospitalization-claim/patient-hospitalclaim/commoninformation-hospitalization/commoninformation-hospitalization.component';
import { DocumentuploadHospitalizationComponent } from './patient-hospitalization-claim/patient-hospitalclaim/documentupload-hospitalization/documentupload-hospitalization.component';
import { EsignatureHospitalizationComponent } from './patient-hospitalization-claim/patient-hospitalclaim/esignature-hospitalization/esignature-hospitalization.component';
import { ServicetypeHospitalizationComponent } from './patient-hospitalization-claim/patient-hospitalclaim/servicetype-hospitalization/servicetype-hospitalization.component';
import { ParamedicalProfessionssComponent } from './four-portal-availibility-request/paramedical-professionss/paramedical-professionss.component';
import { DentalComponent } from './four-portal-availibility-request/dental/dental.component';
import { OpticalComponent } from './four-portal-availibility-request/optical/optical.component';
import { LabImagingComponent } from './four-portal-availibility-request/lab-imaging/lab-imaging.component';
import { DentalPriceRequestComponent } from './four-portal-price-request/dental-price-request/dental-price-request.component';
import { OpticalPriceRequestComponent } from './four-portal-price-request/optical-price-request/optical-price-request.component';
import { LabImagingPriceRequestComponent } from './four-portal-price-request/lab-imaging-price-request/lab-imaging-price-request.component';
import { ParamedicalProfessionPriceRequestComponent } from './four-portal-price-request/paramedical-profession-price-request/paramedical-profession-price-request.component';
import { MatInputModule } from '@angular/material/input';

import { LabImgDentalOptDetailsComponent } from './homepage/lab-img-dental-opt-details/lab-img-dental-opt-details.component';
import { NewpricerequestComponent } from './four-portal-price-request/newpricerequest/newpricerequest.component';
import { CompletepricerequestComponent } from './four-portal-price-request/completepricerequest/completepricerequest.component';
import { DetailAvalibililtyComponent } from './four-portal-availibility-request/detail-avalibililty/detail-avalibililty.component';
import { CompleteAvalibililtyComponent } from './four-portal-availibility-request/complete-avalibililty/complete-avalibililty.component';
import { DentalOrderRequestComponent } from './four-portal-order/dental-order-request/dental-order-request.component';
import { OpticalOrderRequestComponent } from './four-portal-order/optical-order-request/optical-order-request.component';
import { ImagingOrderRequestComponent } from './four-portal-order/imaging-order-request/imaging-order-request.component';
import { ParamedicalProfessionOrderRequestComponent } from './four-portal-order/paramedical-profession-order-request/paramedical-profession-order-request.component';
import { OrderDetailsComponent } from './four-portal-order/order-details/order-details.component';
import { AcceptOrderDetailsComponent } from './four-portal-order/accept-order-details/accept-order-details.component';
import { CancelOrderDetailsComponent } from './four-portal-order/cancel-order-details/cancel-order-details.component';
import { CompleteOrderDetailsComponent } from './four-portal-order/complete-order-details/complete-order-details.component';
import { RejectOrderDetailsComponent } from './four-portal-order/reject-order-details/reject-order-details.component';
import { ScheduleOrderDetailsComponent } from './four-portal-order/schedule-order-details/schedule-order-details.component';
import { OrderPaymentOrderDetailsComponent } from './four-portal-order/order-payment-order-details/order-payment-order-details.component';
import { FourPortalBookAppointmentComponent } from './homepage/four-portal-book-appointment/four-portal-book-appointment.component';
import { FourPortalViewAppointmentComponent } from './homepage/four-portal-view-appointment/four-portal-view-appointment.component';
import { PatientFourPortalClaimComponent } from './patient-four-portal-claim/patient-four-portal-claim.component';
import { PatientFourportalClaimComponent } from './patient-four-portal-claim/patient-fourportal-claim/patient-fourportal-claim.component';
import { PatientFourPortalClaimListComponent } from './patient-four-portal-claim/patient-four-portal-claim-list/patient-four-portal-claim-list.component';
import { PatientFourPortalClaimDetailsComponent } from './patient-four-portal-claim/patient-four-portal-claim-details/patient-four-portal-claim-details.component';
import { CommoninformationFourPortalComponent } from './patient-four-portal-claim/patient-fourportal-claim/commoninformation-four-portal/commoninformation-four-portal.component';
import { DocumentuploadFourPortalComponent } from './patient-four-portal-claim/patient-fourportal-claim/documentupload-four-portal/documentupload-four-portal.component';
import { EsignatureFourPortalComponent } from './patient-four-portal-claim/patient-fourportal-claim/esignature-four-portal/esignature-four-portal.component';
import { ServicetypeFourPortalComponent } from './patient-four-portal-claim/patient-fourportal-claim/servicetype-four-portal/servicetype-four-portal.component';
import { PatientFourPortalAppointmentComponent } from './patient-four-portal-appointment/patient-four-portal-appointment.component';
import { PatientFourPortalAppointmentListComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-list/patient-four-portal-appointment-list.component';
import { PatientFourPortalAppointmentDetailsComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-details/patient-four-portal-appointment-details.component';
import { PatientFourPortalAppointmentClaimComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-claim/patient-four-portal-appointment-claim.component';
import { CommoninformationAppointmentFourPortalComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-claim/commoninformation-appointment-four-portal/commoninformation-appointment-four-portal.component';
import { DocumentuploadAppointmentFourPortalComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-claim/documentupload-appointment-four-portal/documentupload-appointment-four-portal.component';
import { EsignatureAppointmentFourPortalComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-claim/esignature-appointment-four-portal/esignature-appointment-four-portal.component';
import { ServicetypeAppointmentFourPortalComponent } from './patient-four-portal-appointment/patient-four-portal-appointment-claim/servicetype-appointment-four-portal/servicetype-appointment-four-portal.component';
import { PatientNotificationComponent } from "./patient-notification/patient-notification.component";
import { PatientFourtPortalAppointmentclaimComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointmentclaim.component';
import { PatientFourtPortalAppointmentClaimComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-claim/patient-fourt-portal-appointment-claim.component';
import { PatientFourtPortalAppointmentListComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-list/patient-fourt-portal-appointment-list.component';
import { PatientFourtPortalAppointmentDetailsComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-details/patient-fourt-portal-appointment-details.component';
import { PatientCommonAppointmentComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-claim/patient-common-appointment/patient-common-appointment.component';
import { PatientDocumentuploadAppointmentComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-claim/patient-documentupload-appointment/patient-documentupload-appointment.component';
import { PatientEsignatureAppointmentComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-claim/patient-esignature-appointment/patient-esignature-appointment.component';
import { PatientServicetypeAppointmentComponent } from './patient-fourt-portal-appointmentclaim/patient-fourt-portal-appointment-claim/patient-servicetype-appointment/patient-servicetype-appointment.component';
import { PatientVaccinationCardComponent } from './patient-vaccination-card/patient-vaccination-card.component';
import { NgxEditorModule } from "ngx-editor";
@NgModule({
  declarations: [
    PatientHeaderComponent,
    PatientFooterComponent,
    PatientSidebarComponent,
    PatientMainComponent,
    PatientLoginComponent,
    PatientEntercodeComponent,
    PatientForgotpassComponent,
    PatientEnterotpComponent,
    PatientSetnewpassComponent,
    PatientResetpassComponent,
    PatientSignupComponent,
    PatientMyappointmentComponent,
    CalenderComponent,
    PatientProfilecreationComponent,
    PatientUserinvitationComponent,
    PatientRatingandreviewComponent,
    PatientComplaintComponent,
    ComplaintlistComponent,
    ComplaintviewComponent,
    PatientPaymenthistoryComponent,
    PatientSubscriptionplanComponent,
    PlanComponent,
    PaymentComponent,
    CurrentplanComponent,
    AppointmentlistComponent,
    AppointmentdetailsComponent,
    PastappointmentComponent,
    PatientMailboxComponent,
    PatientRolepermissionComponent,
    PatientDashboardComponent,
    PatientMyaccountComponent,
    PatientPrescriptionorderComponent,
    NeworderComponent,
    AcceptedorderComponent,
    ScheduledorderComponent,
    CompletedorderComponent,
    PrescriptionorderComponent,
    PrescriptionorderPaymentComponent,
    PatientMedicinepricerequestComponent,
    MedicinepricerequestComponent,
    NewpriceComponent,
    CompletedComponent,
    CancelledComponent,
    RejectedComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PatientAvailabilitymedicinerequestComponent,
    AvailabilitymedicinerequestComponent,
    NewavailabilityComponent,
    CompletedrequestComponent,
    RetailpharmacyComponent,
    RetailpharmacydetailComponent,
    CancelledorderComponent,
    RejectedorderComponent,
    RejectedmedicineorderComponent,
    CancelledmedicineorderComponent,
    PatientWaitingroomComponent,
    PatientUpcommingappointmentComponent,
    PatientCalenderComponent,
    RetailhospitalComponent,
    RetailHospitaldetailsComponent,
    RetaildoctorComponent,
    RetaildoctordetailsComponent,
    RetailappointmentdetailsComponent,
    RetailreviewappointmentComponent,
    PaywithcardComponent,
    RetailhospitalinfoComponent,
    PatientCommunicationComponent,
    PatientMedicineclaimsComponent,
    MedicineclaimlistComponent,
    MedicineclaimdetailsComponent,
    MedicineclaimsComponent,
    CommoninformationComponent,
    ServicetypeComponent,
    DocumentuploadComponent,
    EsignatureComponent,
    PatientCreateprofileComponent,
    AboutusComponent,
    BlogComponent,
    ContactusComponent,
    PrivacyconditionComponent,
    TermsconditionComponent,
    HealthArticleComponent,
    FaqComponent,
    VideosComponent,
    HealthArticleShowContentComponent,
    PatientMedicalconsultationComponent,
    PatientMedicalconsultationDetailsComponent,
    PatientMedicalconsultationlistComponent,
    PatientMedicalconsultationclaimsComponent,
    CommoninformationconsultationComponent,
    DocumentuploadConsultationComponent,
    EsignatureConsultationComponent,
    ServicetypeConsultationComponent,
    ListLabDentalImagingOpticalComponent,
    PatientHospitalizationClaimComponent,
    PatientHospitalclaimDetailsComponent,
    PatientHospitalclaimComponent,
    PatientHospitalclaimListComponent,
    CommoninformationHospitalizationComponent,
    DocumentuploadHospitalizationComponent,
    EsignatureHospitalizationComponent,
    ServicetypeHospitalizationComponent,
    PatientNotificationComponent,
    ParamedicalProfessionssComponent, DentalComponent, OpticalComponent, LabImagingComponent, DentalPriceRequestComponent, OpticalPriceRequestComponent, LabImagingPriceRequestComponent, ParamedicalProfessionPriceRequestComponent, LabImgDentalOptDetailsComponent, NewpricerequestComponent, CompletepricerequestComponent, DetailAvalibililtyComponent, CompleteAvalibililtyComponent, DentalOrderRequestComponent, OpticalOrderRequestComponent, ImagingOrderRequestComponent, ParamedicalProfessionOrderRequestComponent, OrderDetailsComponent, AcceptOrderDetailsComponent, CancelOrderDetailsComponent, CompleteOrderDetailsComponent, RejectOrderDetailsComponent, ScheduleOrderDetailsComponent, OrderPaymentOrderDetailsComponent, FourPortalBookAppointmentComponent, FourPortalViewAppointmentComponent, PatientFourPortalClaimComponent, PatientFourportalClaimComponent, PatientFourPortalClaimListComponent, PatientFourPortalClaimDetailsComponent, CommoninformationFourPortalComponent, DocumentuploadFourPortalComponent, EsignatureFourPortalComponent, ServicetypeFourPortalComponent, PatientFourPortalAppointmentComponent, PatientFourPortalAppointmentListComponent, PatientFourPortalAppointmentDetailsComponent, PatientFourPortalAppointmentClaimComponent, CommoninformationAppointmentFourPortalComponent, DocumentuploadAppointmentFourPortalComponent, EsignatureAppointmentFourPortalComponent, ServicetypeAppointmentFourPortalComponent, PatientFourtPortalAppointmentclaimComponent, PatientFourtPortalAppointmentClaimComponent, PatientFourtPortalAppointmentListComponent, PatientFourtPortalAppointmentDetailsComponent, PatientCommonAppointmentComponent, PatientDocumentuploadAppointmentComponent, PatientEsignatureAppointmentComponent, PatientServicetypeAppointmentComponent, PatientVaccinationCardComponent, 
  ],
  imports: [
    NgxQRCodeModule,
    CommonModule,
    OverlayModule,
    MatSortModule,
    MatProgressBarModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatInputModule,
    IgxCalendarModule,
    IgxDialogModule,
    IgxPrefixModule,
    IgxSelectModule,
    HammerModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    OverlayModule,
    SignaturePadModule,
    PdfViewerModule,
    NgxEditorModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    TooltipModule,
    // HttpClientModule,
    // MatStepperModule,
    // MatRadioModule,
    // MatFormFieldModule,
    // MatCheckboxModule,
    MatDialogModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    PatientRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,

  ],
  providers: [PharmacyService, PatientService, DatePipe, HospitalService, SlicePipe],
})
export class PatientModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
