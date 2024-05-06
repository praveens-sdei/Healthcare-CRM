import { SuperAdminHospitalService } from './super-admin-hospital.service';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "../shared.module";

// import { InfiniteScrollModule } from "ngx-infinite-scroll";

// import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { SuperAdminRoutingModule } from "./super-admin-routing.module";
import { SuperAdminLoginComponent } from "./super-admin-login/super-admin-login.component";
import { SuperAdminSignupComponent } from "./super-admin-signup/super-admin-signup.component";
import { SuperAdminSidebarComponent } from "./super-admin-sidebar/super-admin-sidebar.component";
import { SuperAdminHeaderComponent } from "./super-admin-header/super-admin-header.component";
import { SuperAdminMainComponent } from "./super-admin-main/super-admin-main.component";
import { SuperAdminForgotpassComponent } from "./super-admin-forgotpass/super-admin-forgotpass.component";
import { SuperAdminCheckemailComponent } from "./super-admin-checkemail/super-admin-checkemail.component";
import { SuperAdminNewpasswordComponent } from "./super-admin-newpassword/super-admin-newpassword.component";
import { SuperAdminPasswordresetComponent } from "./super-admin-passwordreset/super-admin-passwordreset.component";
import { SuperAdminRolepermissionComponent } from "./super-admin-rolepermission/super-admin-rolepermission.component";
import { SuperAdminPatientmanagementComponent } from "./super-admin-patientmanagement/super-admin-patientmanagement.component";
import { ViewpatientComponent } from "./super-admin-patientmanagement/viewpatient/viewpatient.component";
import { PatientdetailsComponent } from "./super-admin-patientmanagement/patientdetails/patientdetails.component";
import { SuperAdminIndividualdoctorComponent } from "./super-admin-individualdoctor/super-admin-individualdoctor.component";
import { PendingbasicinfoComponent } from "./super-admin-individualdoctor/pendingbasicinfo/pendingbasicinfo.component";
import { AssignedpermissionComponent } from "./super-admin-individualdoctor/assignedpermission/assignedpermission.component";
import { ApprovedbasicinfoComponent } from "./super-admin-individualdoctor/approvedbasicinfo/approvedbasicinfo.component";
import { DoctorlistComponent } from "./super-admin-individualdoctor/doctorlist/doctorlist.component";
import { SuperAdminHospitalmanagementComponent } from "./super-admin-hospitalmanagement/super-admin-hospitalmanagement.component";
import { HospitallistComponent } from "./super-admin-hospitalmanagement/hospitallist/hospitallist.component";
import { PendingdetailsComponent } from "./super-admin-hospitalmanagement/pendingdetails/pendingdetails.component";
import { HospitalpermissionComponent } from "./super-admin-hospitalmanagement/hospitalpermission/hospitalpermission.component";
import { ApproveddetailsComponent } from "./super-admin-hospitalmanagement/approveddetails/approveddetails.component";
import { SuperAdminIndividualpharmacyComponent } from "./super-admin-individualpharmacy/super-admin-individualpharmacy.component";
import { PharmacylistComponent } from "./super-admin-individualpharmacy/pharmacylist/pharmacylist.component";
import { PendingpharmacydetailsComponent } from "./super-admin-individualpharmacy/pendingpharmacydetails/pendingpharmacydetails.component";
import { ApprovedpharmacydetailsComponent } from "./super-admin-individualpharmacy/approvedpharmacydetails/approvedpharmacydetails.component";
import { PharmacypermissionComponent } from "./super-admin-individualpharmacy/pharmacypermission/pharmacypermission.component";
import { SuperAdminFeedbackmanagementComponent } from "./super-admin-feedbackmanagement/super-admin-feedbackmanagement.component";
import { SuperAdminComplaintmanagementComponent } from "./super-admin-complaintmanagement/super-admin-complaintmanagement.component";
import { ComplaintlistComponent } from "./super-admin-complaintmanagement/complaintlist/complaintlist.component";
import { ComplaintviewComponent } from "./super-admin-complaintmanagement/complaintview/complaintview.component";
import { SuperAdminMasterComponent } from "./super-admin-master/super-admin-master.component";
import { SuperAdminNotificationmanagementComponent } from "./super-admin-notificationmanagement/super-admin-notificationmanagement.component";
import { SuperSubscriptionplanComponent } from "./super-subscriptionplan/super-subscriptionplan.component";
import { SuperAdminProfilemanagementComponent } from "./super-admin-profilemanagement/super-admin-profilemanagement.component";
import { ProfileviewComponent } from "./super-admin-profilemanagement/profileview/profileview.component";
import { ChangepasswordComponent } from "./super-admin-profilemanagement/changepassword/changepassword.component";
import { SuperAdminInsurancemanagementComponent } from "./super-admin-insurancemanagement/super-admin-insurancemanagement.component";
import { InsurancelistComponent } from "./super-admin-insurancemanagement/insurancelist/insurancelist.component";
import { PendinginsurancedetailsComponent } from "./super-admin-insurancemanagement/pendinginsurancedetails/pendinginsurancedetails.component";
import { ApprovedinsurancedetailsComponent } from "./super-admin-insurancemanagement/approvedinsurancedetails/approvedinsurancedetails.component";
import { InsurancepermissionComponent } from "./super-admin-insurancemanagement/insurancepermission/insurancepermission.component";
import { SuperAdminEntercodeComponent } from "./super-admin-entercode/super-admin-entercode.component";
import { SuperAdminPharmacyService } from "./super-admin-pharmacy.service";
import { PharmacyPlanService } from "./../pharmacy/pharmacy-plan.service"
import { SuperAdminService } from "./super-admin.service";
import { SuperAdminAssociationgroupComponent } from "./super-admin-associationgroup/super-admin-associationgroup.component";
import { AssociationgroupviewComponent } from "./super-admin-associationgroup/associationgroupview/associationgroupview.component";
import { AssociationgroupdetailComponent } from "./super-admin-associationgroup/associationgroupdetail/associationgroupdetail.component";
import { AssociationgroupaddComponent } from "./super-admin-associationgroup/associationgroupadd/associationgroupadd.component";
import { AssociationgroupeditComponent } from "./super-admin-associationgroup/associationgroupedit/associationgroupedit.component";
import { LabComponent } from "./super-admin-master/master-component/lab/lab.component";
import { ImagingComponent } from "./super-admin-master/master-component/imaging/imaging.component";
import { VaccinationsComponent } from "./super-admin-master/master-component/vaccinations/vaccinations.component";
import { EyeglassesComponent } from "./super-admin-master/master-component/eyeglasses/eyeglasses.component";
import { OthersComponent } from "./super-admin-master/master-component/others/others.component";
import { SpecialityComponent } from "./super-admin-master/master-component/speciality/speciality.component";
import { ServicesComponent } from "./super-admin-master/master-component/services/services.component";
import { ExpertiseComponent } from "./super-admin-master/master-component/expertise/expertise.component";
import { DepartmentComponent } from "./super-admin-master/master-component/department/department.component";
import { UnitComponent } from "./super-admin-master/master-component/unit/unit.component";
import { HealthcareNetworkComponent } from "./super-admin-master/master-component/healthcare-network/healthcare-network.component";
import { CategoryServicesComponent } from "./super-admin-master/master-component/category-services/category-services.component";
import { TypeOfServicesComponent } from "./super-admin-master/master-component/type-of-services/type-of-services.component";
import { CategoryOfExclusionComponent } from "./super-admin-master/master-component/category-of-exclusion/category-of-exclusion.component";
import { ExclusionComponent } from "./super-admin-master/master-component/exclusion/exclusion.component";
import { ManageClaimContentComponent } from "./super-admin-master/master-component/manage-claim-content/manage-claim-content.component";
import { MaximumRequestComponent } from "./super-admin-master/master-component/maximum-request/maximum-request.component";
import { SuperAdminStaffmanagementComponent } from "./super-admin-staffmanagement/super-admin-staffmanagement.component";
import { AddstaffComponent } from "./super-admin-staffmanagement/addstaff/addstaff.component";
import { ViewstaffComponent } from "./super-admin-staffmanagement/viewstaff/viewstaff.component";
import { SuperAdminDashboardComponent } from "./super-admin-dashboard/super-admin-dashboard.component";
import { SuperAdminTotaleclaimsComponent } from "./super-admin-totaleclaims/super-admin-totaleclaims.component";
import { SuperAdminAppointmentcommissionComponent } from "./super-admin-appointmentcommission/super-admin-appointmentcommission.component";
import { SuperAdminUserinvitationComponent } from "./super-admin-userinvitation/super-admin-userinvitation.component";
import { SuperAdminLogsComponent } from "./super-admin-logs/super-admin-logs.component";
import { SuperAdminPaymenthistoryComponent } from "./super-admin-paymenthistory/super-admin-paymenthistory.component";
import { SuperAdminMedicinecliamdashboardComponent } from "./super-admin-medicinecliamdashboard/super-admin-medicinecliamdashboard.component";
import { SuperAdminDashboardclaimComponent } from "./super-admin-medicinecliamdashboard/super-admin-dashboardclaim/super-admin-dashboardclaim.component";
import { SuperAdminMediclaimviewComponent } from "./super-admin-medicinecliamdashboard/super-admin-mediclaimview/super-admin-mediclaimview.component";
import { SuperAdminRevenuemanagementComponent } from "./super-admin-revenuemanagement/super-admin-revenuemanagement.component";
import { AssignplanComponent } from "./super-admin-master/master-component/assignplan/assignplan.component";
import { SuperAdminContentmanagementComponent } from "./super-admin-contentmanagement/super-admin-contentmanagement.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxEditorModule } from "ngx-editor";
import { appMatCheckbox } from "./super-admin-master/master-component/assignplan/checkbox";
import { EditstaffComponent } from "./super-admin-staffmanagement/editstaff/editstaff.component";
import { MatTimepickerModule } from "mat-timepicker";
import { SuperAdminOpeninghourmanagementComponent } from "./super-admin-openinghourmanagement/super-admin-openinghourmanagement.component";
import { PharmacyComponent } from "./super-admin-openinghourmanagement/pharmacy/pharmacy.component";
import { HospitalComponent } from "./super-admin-openinghourmanagement/hospital/hospital.component";
import { AddpharmacyComponent } from "./super-admin-openinghourmanagement/addpharmacy/addpharmacy.component";
import { DatePipe } from "@angular/common";
import { SelectroleComponent } from "./super-admin-rolepermission/selectrole/selectrole.component";
import { ViewroleComponent } from "./super-admin-rolepermission/viewrole/viewrole.component";
import { SuperAdminCommunicationComponent } from "./super-admin-communication/super-admin-communication.component";
import { AboutusComponent } from "./super-admin-contentmanagement/content-component/aboutus/aboutus.component";
import { ArticlesComponent } from "./super-admin-contentmanagement/content-component/articles/articles.component";
import { BlogComponent } from "./super-admin-contentmanagement/content-component/blog/blog.component";
import { ContactusComponent } from "./super-admin-contentmanagement/content-component/contactus/contactus.component";
import { FaqComponent } from "./super-admin-contentmanagement/content-component/faq/faq.component";
import { PrivacyandconditionComponent } from "./super-admin-contentmanagement/content-component/privacyandcondition/privacyandcondition.component";
import { TermandconditionComponent } from "./super-admin-contentmanagement/content-component/termandcondition/termandcondition.component";
import { VideocontentComponent } from "./super-admin-contentmanagement/content-component/videocontent/videocontent.component";
import { SuperAdminClaimDetailViewComponent } from "./super-admin-medicinecliamdashboard/super-admin-claim-detail-view/super-admin-claim-detail-view.component";
import { AddOndutyPharmacyComponent } from './super-admin-openinghourmanagement/add-onduty-pharmacy/add-onduty-pharmacy.component';
import { AddHospitalComponent } from './super-admin-openinghourmanagement/add-hospital/add-hospital.component';
import { AuthGuard } from "src/app/shared/auth-guard";
import { SlicePipe } from '@angular/common';
import { ClaimRoleComponent } from './super-admin-master/master-component/claim-role/claim-role.component';
import { AssignRoleTypeComponent } from './super-admin-master/master-component/assign-role-type/assign-role-type.component';
import { HealthPlansComponent } from './super-admin-master/master-component/health-plans/health-plans.component';
import { SubscribersComponent } from './super-admin-master/master-component/subscribers/subscribers.component';
import { SuperAdminManualmedicineclaimdashboardComponent } from './super-admin-manualmedicineclaim/super-admin-manualmedicineclaimdashboard/super-admin-manualmedicineclaimdashboard.component';
import { SuperAdminManualmedicineclaimlistComponent } from './super-admin-manualmedicineclaim/super-admin-manualmedicineclaimlist/super-admin-manualmedicineclaimlist.component';

import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';


import { AddManualmedicineClaimComponent } from './super-admin-manualmedicineclaim/add-manualmedicine-claim/add-manualmedicine-claim.component';
import { EditManualmedicineClaimComponent } from './super-admin-manualmedicineclaim/edit-manualmedicine-claim/edit-manualmedicine-claim.component';
import { ViewManualmedicinClaimComponent } from './super-admin-manualmedicineclaim/view-manualmedicin-claim/view-manualmedicin-claim.component';
import { HealthPlanviewComponent } from './super-admin-master/master-component/health-planview/health-planview.component';
import { SubscriberDetailViewComponent } from './super-admin-master/master-component/subscriber-detail-view/subscriber-detail-view.component';
import { CountriesComponent } from './super-admin-master/master-component/countries/countries.component';
import { RegionsComponent } from './super-admin-master/master-component/regions/regions.component';
import { ProvinceComponent } from './super-admin-master/master-component/province/province.component';
import { CityComponent } from './super-admin-master/master-component/city/city.component';
import { VillageComponent } from './super-admin-master/master-component/village/village.component';
import { DesignationComponent } from './super-admin-master/master-component/designation/designation.component';
import { TitleComponent } from './super-admin-master/master-component/title/title.component';
import { HealthcentreComponent } from './super-admin-master/master-component/healthcentre/healthcentre.component';
import { LanguageMasterComponent } from './super-admin-master/master-component/language-master/language-master.component';
import { ImmunizationComponent } from './super-admin-master/master-component/immunization/immunization.component';
import { SubscriberPreviewCardAdminComponent } from './super-admin-master/master-component/subscriber-preview-card-admin/subscriber-preview-card-admin.component';
import { SuperAdminIndividuallaboratoryComponent } from './super-admin-individuallaboratory/super-admin-individuallaboratory.component';
import { SuperAdminDentalmanagementComponent } from './super-admin-dentalmanagement/super-admin-dentalmanagement.component';
import { SuperAdminImagingmanagementComponent } from './super-admin-imagingmanagement/super-admin-imagingmanagement.component';
import { SuperAdminOpticalmanagementComponent } from './super-admin-opticalmanagement/super-admin-opticalmanagement.component';
import { LaboratorylistComponent } from './super-admin-individuallaboratory/laboratorylist/laboratorylist.component';
import { OpticallistComponent } from './super-admin-opticalmanagement/opticallist/opticallist.component';
import { DentallistComponent } from './super-admin-dentalmanagement/dentallist/dentallist.component';
import { ImaginglistComponent } from './super-admin-imagingmanagement/imaginglist/imaginglist.component';
import { DentalpermissionComponent } from './super-admin-dentalmanagement/dentalpermission/dentalpermission.component';
import { ImagingpermissionComponent } from './super-admin-imagingmanagement/imagingpermission/imagingpermission.component';
import { LaboratorypermissionComponent } from './super-admin-individuallaboratory/laboratorypermission/laboratorypermission.component';
import { OpticalpermissionComponent } from './super-admin-opticalmanagement/opticalpermission/opticalpermission.component';
import { PendinglabbasicinfoComponent } from './super-admin-individuallaboratory/pendinglabbasicinfo/pendinglabbasicinfo.component';
import { PendingdentalbasicinfoComponent } from './super-admin-dentalmanagement/pendingdentalbasicinfo/pendingdentalbasicinfo.component';
import { PendingimagingbasicinfoComponent } from './super-admin-imagingmanagement/pendingimagingbasicinfo/pendingimagingbasicinfo.component';
import { PendingopticalbasicinfoComponent } from './super-admin-opticalmanagement/pendingopticalbasicinfo/pendingopticalbasicinfo.component';
import { EditAssociationGroupComponent } from './super-admin-profilemanagement/edit-association-group/edit-association-group.component';

@NgModule({
  declarations: [
    SuperAdminDashboardComponent,
    SuperAdminLoginComponent,
    SuperAdminSignupComponent,
    SuperAdminSidebarComponent,
    SuperAdminHeaderComponent,
    SuperAdminMainComponent,
    SuperAdminForgotpassComponent,
    SuperAdminCheckemailComponent,
    SuperAdminNewpasswordComponent,
    SuperAdminPasswordresetComponent,
    SuperAdminRolepermissionComponent,
    SuperAdminPatientmanagementComponent,
    ViewpatientComponent,
    PatientdetailsComponent,
    SuperAdminIndividualdoctorComponent,
    PendingbasicinfoComponent,
    AssignedpermissionComponent,
    ApprovedbasicinfoComponent,
    DoctorlistComponent,
    SuperAdminHospitalmanagementComponent,
    HospitallistComponent,
    PendingdetailsComponent,
    HospitalpermissionComponent,
    ApproveddetailsComponent,
    SuperAdminIndividualpharmacyComponent,
    PharmacylistComponent,
    PendingpharmacydetailsComponent,
    ApprovedpharmacydetailsComponent,
    PharmacypermissionComponent,
    SuperAdminFeedbackmanagementComponent,
    SuperAdminComplaintmanagementComponent,
    ComplaintlistComponent,
    ComplaintviewComponent,
    SuperAdminMasterComponent,
    SuperAdminNotificationmanagementComponent,
    SuperSubscriptionplanComponent,
    SuperAdminProfilemanagementComponent,
    ProfileviewComponent,
    ChangepasswordComponent,
    SuperAdminInsurancemanagementComponent,
    InsurancelistComponent,
    PendinginsurancedetailsComponent,
    ApprovedinsurancedetailsComponent,
    InsurancepermissionComponent,
    SuperAdminEntercodeComponent,
    SuperAdminAssociationgroupComponent,
    AssociationgroupviewComponent,
    AssociationgroupdetailComponent,
    AssociationgroupaddComponent,
    AssociationgroupeditComponent,
    LabComponent,
    ImagingComponent,
    VaccinationsComponent,
    EyeglassesComponent,
    OthersComponent,
    SpecialityComponent,
    ServicesComponent,
    ExpertiseComponent,
    DepartmentComponent,
    UnitComponent,
    HealthcareNetworkComponent,
    CategoryServicesComponent,
    TypeOfServicesComponent,
    CategoryOfExclusionComponent,
    ExclusionComponent,
    ManageClaimContentComponent,
    MaximumRequestComponent,
    SuperAdminStaffmanagementComponent,
    AddstaffComponent,
    ViewstaffComponent,
    SuperAdminTotaleclaimsComponent,
    SuperAdminAppointmentcommissionComponent,
    SuperAdminUserinvitationComponent,
    SuperAdminLogsComponent,
    SuperAdminPaymenthistoryComponent,
    SuperAdminMedicinecliamdashboardComponent,
    SuperAdminDashboardclaimComponent,
    SuperAdminMediclaimviewComponent,
    SuperAdminRevenuemanagementComponent,
    AssignplanComponent,
    SuperAdminContentmanagementComponent,
    appMatCheckbox,
    EditstaffComponent,
    SuperAdminOpeninghourmanagementComponent,
    PharmacyComponent,
    HospitalComponent,
    AddpharmacyComponent,
    SelectroleComponent,
    ViewroleComponent,
    SuperAdminCommunicationComponent,
    AboutusComponent,
    ArticlesComponent,
    BlogComponent,
    ContactusComponent,
    FaqComponent,
    PrivacyandconditionComponent,
    TermandconditionComponent,
    VideocontentComponent,
    SuperAdminClaimDetailViewComponent,
    AddOndutyPharmacyComponent,
    AddHospitalComponent,
    ClaimRoleComponent,
    AssignRoleTypeComponent,
    HealthPlansComponent,
    SubscribersComponent,
    SuperAdminManualmedicineclaimdashboardComponent,
    SuperAdminManualmedicineclaimlistComponent,
    AddManualmedicineClaimComponent,
    EditManualmedicineClaimComponent,
    ViewManualmedicinClaimComponent,
    HealthPlanviewComponent,
    SubscriberDetailViewComponent,
    CountriesComponent,
    RegionsComponent,
    ProvinceComponent,
    CityComponent,
    VillageComponent,
    DesignationComponent,
    TitleComponent,
    HealthcentreComponent,
    LanguageMasterComponent,
    ImmunizationComponent,
    SubscriberPreviewCardAdminComponent,
    SuperAdminIndividuallaboratoryComponent,
    SuperAdminDentalmanagementComponent,
    SuperAdminImagingmanagementComponent,
    SuperAdminOpticalmanagementComponent,
    LaboratorylistComponent,
    OpticallistComponent,
    DentallistComponent,
    ImaginglistComponent,
    DentalpermissionComponent,
    ImagingpermissionComponent,
    LaboratorypermissionComponent,
    OpticalpermissionComponent,
    PendinglabbasicinfoComponent,
    PendingdentalbasicinfoComponent,
    PendingimagingbasicinfoComponent,
    PendingopticalbasicinfoComponent,
    EditAssociationGroupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    // HttpClientModule,
    NgxEditorModule,
    MatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SuperAdminRoutingModule,
    NgImageFullscreenViewModule,
    // InfiniteScrollModule
  ],
  providers: [AuthGuard, SuperAdminHospitalService, SuperAdminPharmacyService, PharmacyPlanService, SuperAdminService, DatePipe, SlicePipe],
})
export class SuperAdminModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

// platformBrowserDynamic().bootstrapModule(SuperAdminModule);