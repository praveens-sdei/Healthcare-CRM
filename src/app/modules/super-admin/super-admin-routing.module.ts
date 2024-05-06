import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { AuthGuard } from 'src/app/shared/auth-guard';
import { SuperAdminAppointmentcommissionComponent } from './super-admin-appointmentcommission/super-admin-appointmentcommission.component';
import { AssociationgroupaddComponent } from './super-admin-associationgroup/associationgroupadd/associationgroupadd.component';
import { AssociationgroupdetailComponent } from './super-admin-associationgroup/associationgroupdetail/associationgroupdetail.component';
import { AssociationgroupeditComponent } from './super-admin-associationgroup/associationgroupedit/associationgroupedit.component';
import { AssociationgroupviewComponent } from './super-admin-associationgroup/associationgroupview/associationgroupview.component';
import { SuperAdminAssociationgroupComponent } from './super-admin-associationgroup/super-admin-associationgroup.component';
import { SuperAdminCheckemailComponent } from './super-admin-checkemail/super-admin-checkemail.component';
import { SuperAdminCommunicationComponent } from './super-admin-communication/super-admin-communication.component';
import { ComplaintlistComponent } from './super-admin-complaintmanagement/complaintlist/complaintlist.component';
import { ComplaintviewComponent } from './super-admin-complaintmanagement/complaintview/complaintview.component';
import { SuperAdminComplaintmanagementComponent } from './super-admin-complaintmanagement/super-admin-complaintmanagement.component';
import { SuperAdminContentmanagementComponent } from './super-admin-contentmanagement/super-admin-contentmanagement.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminEntercodeComponent } from './super-admin-entercode/super-admin-entercode.component';
import { SuperAdminFeedbackmanagementComponent } from './super-admin-feedbackmanagement/super-admin-feedbackmanagement.component';
import { SuperAdminForgotpassComponent } from './super-admin-forgotpass/super-admin-forgotpass.component';
import { SuperAdminHeaderComponent } from './super-admin-header/super-admin-header.component';
import { ApproveddetailsComponent } from './super-admin-hospitalmanagement/approveddetails/approveddetails.component';
import { HospitallistComponent } from './super-admin-hospitalmanagement/hospitallist/hospitallist.component';
import { HospitalpermissionComponent } from './super-admin-hospitalmanagement/hospitalpermission/hospitalpermission.component';
import { PendingdetailsComponent } from './super-admin-hospitalmanagement/pendingdetails/pendingdetails.component';
import { ApprovedbasicinfoComponent } from './super-admin-individualdoctor/approvedbasicinfo/approvedbasicinfo.component';
import { AssignedpermissionComponent } from './super-admin-individualdoctor/assignedpermission/assignedpermission.component';
import { DoctorlistComponent } from './super-admin-individualdoctor/doctorlist/doctorlist.component';
import { PendingbasicinfoComponent } from './super-admin-individualdoctor/pendingbasicinfo/pendingbasicinfo.component';
import { SuperAdminIndividualdoctorComponent } from './super-admin-individualdoctor/super-admin-individualdoctor.component';
import { ApprovedpharmacydetailsComponent } from './super-admin-individualpharmacy/approvedpharmacydetails/approvedpharmacydetails.component';
import { PendingpharmacydetailsComponent } from './super-admin-individualpharmacy/pendingpharmacydetails/pendingpharmacydetails.component';
import { PharmacylistComponent } from './super-admin-individualpharmacy/pharmacylist/pharmacylist.component';
import { PharmacypermissionComponent } from './super-admin-individualpharmacy/pharmacypermission/pharmacypermission.component';
import { SuperAdminIndividualpharmacyComponent } from './super-admin-individualpharmacy/super-admin-individualpharmacy.component';
import { ApprovedinsurancedetailsComponent } from './super-admin-insurancemanagement/approvedinsurancedetails/approvedinsurancedetails.component';
import { InsurancelistComponent } from './super-admin-insurancemanagement/insurancelist/insurancelist.component';
import { InsurancepermissionComponent } from './super-admin-insurancemanagement/insurancepermission/insurancepermission.component';
import { PendinginsurancedetailsComponent } from './super-admin-insurancemanagement/pendinginsurancedetails/pendinginsurancedetails.component';
import { SuperAdminInsurancemanagementComponent } from './super-admin-insurancemanagement/super-admin-insurancemanagement.component';
import { SuperAdminLoginComponent } from './super-admin-login/super-admin-login.component';
import { SuperAdminLogsComponent } from './super-admin-logs/super-admin-logs.component';
import { SuperAdminMainComponent } from './super-admin-main/super-admin-main.component';
import { SuperAdminMasterComponent } from './super-admin-master/super-admin-master.component';
import { SuperAdminDashboardclaimComponent } from './super-admin-medicinecliamdashboard/super-admin-dashboardclaim/super-admin-dashboardclaim.component';
import { SuperAdminMedicinecliamdashboardComponent } from './super-admin-medicinecliamdashboard/super-admin-medicinecliamdashboard.component';
import { SuperAdminMediclaimviewComponent } from './super-admin-medicinecliamdashboard/super-admin-mediclaimview/super-admin-mediclaimview.component';
import { SuperAdminNewpasswordComponent } from './super-admin-newpassword/super-admin-newpassword.component';
import { SuperAdminNotificationmanagementComponent } from './super-admin-notificationmanagement/super-admin-notificationmanagement.component';
import { AddpharmacyComponent } from './super-admin-openinghourmanagement/addpharmacy/addpharmacy.component';
import { HospitalComponent } from './super-admin-openinghourmanagement/hospital/hospital.component';
import { PharmacyComponent } from './super-admin-openinghourmanagement/pharmacy/pharmacy.component';
import { SuperAdminOpeninghourmanagementComponent } from './super-admin-openinghourmanagement/super-admin-openinghourmanagement.component';
import { SuperAdminPasswordresetComponent } from './super-admin-passwordreset/super-admin-passwordreset.component';
import { PatientdetailsComponent } from './super-admin-patientmanagement/patientdetails/patientdetails.component';
import { SuperAdminPatientmanagementComponent } from './super-admin-patientmanagement/super-admin-patientmanagement.component';
import { ViewpatientComponent } from './super-admin-patientmanagement/viewpatient/viewpatient.component';
import { SuperAdminPaymenthistoryComponent } from './super-admin-paymenthistory/super-admin-paymenthistory.component';
import { ChangepasswordComponent } from './super-admin-profilemanagement/changepassword/changepassword.component';
import { ProfileviewComponent } from './super-admin-profilemanagement/profileview/profileview.component';
import { SuperAdminProfilemanagementComponent } from './super-admin-profilemanagement/super-admin-profilemanagement.component';
import { SuperAdminRevenuemanagementComponent } from './super-admin-revenuemanagement/super-admin-revenuemanagement.component';
import { SelectroleComponent } from './super-admin-rolepermission/selectrole/selectrole.component';
import { SuperAdminRolepermissionComponent } from './super-admin-rolepermission/super-admin-rolepermission.component';
import { ViewroleComponent } from './super-admin-rolepermission/viewrole/viewrole.component';
import { SuperAdminSignupComponent } from './super-admin-signup/super-admin-signup.component';
import { AddstaffComponent } from './super-admin-staffmanagement/addstaff/addstaff.component';
import { EditstaffComponent } from './super-admin-staffmanagement/editstaff/editstaff.component';
import { SuperAdminStaffmanagementComponent } from './super-admin-staffmanagement/super-admin-staffmanagement.component';
import { ViewstaffComponent } from './super-admin-staffmanagement/viewstaff/viewstaff.component';
import { SuperAdminTotaleclaimsComponent } from './super-admin-totaleclaims/super-admin-totaleclaims.component';
import { SuperAdminUserinvitationComponent } from './super-admin-userinvitation/super-admin-userinvitation.component';
import { SuperSubscriptionplanComponent } from './super-subscriptionplan/super-subscriptionplan.component';
import { SuperAdminClaimDetailViewComponent } from './super-admin-medicinecliamdashboard/super-admin-claim-detail-view/super-admin-claim-detail-view.component';
import { AddOndutyPharmacyComponent } from './super-admin-openinghourmanagement/add-onduty-pharmacy/add-onduty-pharmacy.component';
import { AddHospitalComponent } from './super-admin-openinghourmanagement/add-hospital/add-hospital.component';
import { SuperAdminManualmedicineclaimdashboardComponent } from './super-admin-manualmedicineclaim/super-admin-manualmedicineclaimdashboard/super-admin-manualmedicineclaimdashboard.component';
import { SuperAdminManualmedicineclaimlistComponent } from './super-admin-manualmedicineclaim/super-admin-manualmedicineclaimlist/super-admin-manualmedicineclaimlist.component';
import { AddManualmedicineClaimComponent } from './super-admin-manualmedicineclaim/add-manualmedicine-claim/add-manualmedicine-claim.component';
import { EditManualmedicineClaimComponent } from './super-admin-manualmedicineclaim/edit-manualmedicine-claim/edit-manualmedicine-claim.component';
import { ViewManualmedicinClaimComponent } from './super-admin-manualmedicineclaim/view-manualmedicin-claim/view-manualmedicin-claim.component';
import { HealthPlanviewComponent } from './super-admin-master/master-component/health-planview/health-planview.component';
import { SubscriberDetailViewComponent } from './super-admin-master/master-component/subscriber-detail-view/subscriber-detail-view.component';
import { SubscriberPreviewCardAdminComponent } from './super-admin-master/master-component/subscriber-preview-card-admin/subscriber-preview-card-admin.component';
import { SuperAdminIndividuallaboratoryComponent } from './super-admin-individuallaboratory/super-admin-individuallaboratory.component';
import { LaboratorylistComponent } from './super-admin-individuallaboratory/laboratorylist/laboratorylist.component';
import { SuperAdminOpticalmanagementComponent } from './super-admin-opticalmanagement/super-admin-opticalmanagement.component';
import { OpticallistComponent } from './super-admin-opticalmanagement/opticallist/opticallist.component';
import { SuperAdminDentalmanagementComponent } from './super-admin-dentalmanagement/super-admin-dentalmanagement.component';
import { DentallistComponent } from './super-admin-dentalmanagement/dentallist/dentallist.component';
import { SuperAdminImagingmanagementComponent } from './super-admin-imagingmanagement/super-admin-imagingmanagement.component';
import { ImaginglistComponent } from './super-admin-imagingmanagement/imaginglist/imaginglist.component';
import { LaboratorypermissionComponent } from './super-admin-individuallaboratory/laboratorypermission/laboratorypermission.component';
import { PendinglabbasicinfoComponent } from './super-admin-individuallaboratory/pendinglabbasicinfo/pendinglabbasicinfo.component';
import { OpticalpermissionComponent } from './super-admin-opticalmanagement/opticalpermission/opticalpermission.component';
import { DentalpermissionComponent } from './super-admin-dentalmanagement/dentalpermission/dentalpermission.component';
import { ImagingpermissionComponent } from './super-admin-imagingmanagement/imagingpermission/imagingpermission.component';
import { PendingdentalbasicinfoComponent } from './super-admin-dentalmanagement/pendingdentalbasicinfo/pendingdentalbasicinfo.component';
import { PendingimagingbasicinfoComponent } from './super-admin-imagingmanagement/pendingimagingbasicinfo/pendingimagingbasicinfo.component';
import { PendingopticalbasicinfoComponent } from './super-admin-opticalmanagement/pendingopticalbasicinfo/pendingopticalbasicinfo.component';
import { CheckGuard } from 'src/app/shared/check.guard';
import { SuperAdminHospitalmanagementComponent } from './super-admin-hospitalmanagement/super-admin-hospitalmanagement.component';
import { EditAssociationGroupComponent } from './super-admin-profilemanagement/edit-association-group/edit-association-group.component';
// import { SubscribersdetailComponent } from './insurance-subscribers/subscribersdetail/subscribersdetail.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        component: SuperAdminLoginComponent
    },
    {
        path: 'entercode',
        component: SuperAdminEntercodeComponent
    },
    {
        path: 'signup',
        component: SuperAdminSignupComponent
    },
    {
        path: 'forgotpass',
        component: SuperAdminForgotpassComponent
    },
    {
        path: 'checkemail',
        component: SuperAdminCheckemailComponent
    },
    {
        path: 'newpassword',
        component: SuperAdminNewpasswordComponent
    },
    {
        path: 'passwordreset',
        component: SuperAdminPasswordresetComponent
    },
    {
        path: 'header',
        component: SuperAdminHeaderComponent
    },
   
    
    {
        path: '',canActivate:[AuthGuard] ,component: SuperAdminMainComponent,
        data: { routing: ["/super-admin/dashboard"] },
         children: [
            //path: '',component: SuperAdminMainComponent, children: [
            {
                path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
            {
                path: 'dashboard', component: SuperAdminDashboardComponent
            },
            {
                path: 'rolepermission', component: SuperAdminRolepermissionComponent,children:[
                    {
                      path: '', component: SelectroleComponent
                    },
                    {
                      path: 'view', component: ViewroleComponent
                    },
                  ]
            },
            {
                path: 'patient',canActivate: [CheckGuard], component: SuperAdminPatientmanagementComponent,
                data: { routing: ["/super-admin/patient"] },
                children: [
              
                  {
                    path: '',canActivate: [CheckGuard], component: ViewpatientComponent
                  },
                  {
                    path: 'details/:id', component: PatientdetailsComponent
                  },
                ]
            },
            {
            path: 'individualdoctor',canActivate: [CheckGuard], component: SuperAdminIndividualdoctorComponent,
            data: { routing: ["/super-admin/individualdoctor"] },
            children: [
                {
                    path: '',canActivate: [CheckGuard], component: DoctorlistComponent
                },
                {
                    path: 'basicinfo/:id', component: PendingbasicinfoComponent
                },
                {
                    path: 'permission/:id', component: AssignedpermissionComponent
                },
                {
                    path: 'approvedbasicinfo/:id', component: ApprovedbasicinfoComponent
                },
            ]
            },
            {
                path: 'hospital',canActivate: [CheckGuard], component: SuperAdminHospitalmanagementComponent,
                data: { routing: ["/super-admin/hospital"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: HospitallistComponent
                    }, 
                    {
                        path: 'details/:id', component: PendingdetailsComponent
                    }, 
                    {
                        path: 'permission/:id', component: HospitalpermissionComponent
                    }, 
                    {
                        path: 'approveddetails/:id', component: ApproveddetailsComponent
                    }, 
                ]
            },
            {
                path: 'individualpharmacy',canActivate: [CheckGuard], component: SuperAdminIndividualpharmacyComponent,
                data: { routing: ["/super-admin/individualpharmacy"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: PharmacylistComponent
                    }, 
                    {
                        path: 'details/:id/:tabId', component: PendingpharmacydetailsComponent
                    }, 
                    {
                        path: 'approveddetails', component: ApprovedpharmacydetailsComponent
                    }, 
                    {
                        path: 'permission/:id', component: PharmacypermissionComponent
                    }, 
                ]
            },
            {
                path: 'insurance',canActivate: [CheckGuard], component: SuperAdminInsurancemanagementComponent,
                data: { routing: ["/super-admin/insurance"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: InsurancelistComponent
                    }, 
                    
                    {
                        path: 'details/:id/:tabId', component: PendinginsurancedetailsComponent
                    }, 
                    {
                        path: 'approveddetails', component: ApprovedinsurancedetailsComponent
                    }, 
                    {
                        path: 'permission/:id', component: InsurancepermissionComponent
                    }, 
                ]
            },
            {
                path: 'subscriptionplan',
                canActivate: [CheckGuard],
                component: SuperSubscriptionplanComponent,
                data: { routing: ["/super-admin/subscriptionplan"] }
            },
            {
                path: 'feedback',
                canActivate: [CheckGuard],
                component: SuperAdminFeedbackmanagementComponent,
                data: { routing: ["/super-admin/feedback"] },
            },
            {
                path: 'complaint', canActivate: [CheckGuard],component: SuperAdminComplaintmanagementComponent,
                data: { routing: ["/super-admin/complaint"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: ComplaintlistComponent
                    }, 
                    {
                        path: 'view/:id', canActivate: [CheckGuard],component: ComplaintviewComponent
                    }, 
                ]
            },
            {
                path: 'profile', component: SuperAdminProfilemanagementComponent,children: [
                    {
                        path: '', component: ProfileviewComponent
                    }, 
                    {
                        path: 'changepassword', component: ChangepasswordComponent
                    }, 
                    {
                        path: 'edit-association/:id', component: EditAssociationGroupComponent
                    }, 
                ]
            },
            {
                path: 'master',
                canActivate: [CheckGuard],
                component: SuperAdminMasterComponent,
                data: { routing: ["/super-admin/master"] },
            },
            {
                path: 'subscriberView/:id',
                component: SubscriberDetailViewComponent
            },
            {
                path: 'healthPlanview/:id',
                component: HealthPlanviewComponent
            },
            {
                path: 'notification',
                canActivate: [CheckGuard],
                component: SuperAdminNotificationmanagementComponent,
                data: { routing: ["/super-admin/notification"] }
            },
            {
                path: 'subscriber/previewCard/:id/:userId',
                component: SubscriberPreviewCardAdminComponent
            },
            {
                path: 'associationgroup',canActivate: [CheckGuard], component: SuperAdminAssociationgroupComponent,
                data: { routing: ["/super-admin/associationgroup"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: AssociationgroupviewComponent
                    }, 
                    {
                        path: 'details/:groupID', component: AssociationgroupdetailComponent
                    },
                    {
                        path: 'add', component: AssociationgroupaddComponent
                    }, 
                    {
                        path: 'edit/:id', component: AssociationgroupeditComponent
                    }, 
                ]
            },
            {
               
                path: 'staffmanagement', 
                canActivate: [CheckGuard],
                component: SuperAdminStaffmanagementComponent, 
                data: { routing: ["/super-admin/staffmanagement"] },
                 children: [
                    {
                        path: '', component: ViewstaffComponent
                    },
                    {
                        path: 'add', component: AddstaffComponent
                    },
                    {
                        // path: 'edit/:id', component: EditstaffComponent
                    }, 
                ]
            },
            {
                path: 'totaleclaims',
                component: SuperAdminTotaleclaimsComponent
            },
            {
                path: 'appointmentcommission',
                component: SuperAdminAppointmentcommissionComponent
            },
            {
                path: 'paymenthistory',
                component: SuperAdminPaymenthistoryComponent
            },
            {
                path: 'userinvitation',
                canActivate: [CheckGuard],
                component: SuperAdminUserinvitationComponent,
                data: { routing: ["/super-admin/userinvitation"] },
            },
            {
                path: 'logs',
                component: SuperAdminLogsComponent
            },
            {
                path: 'medicineclaim', component: SuperAdminMedicinecliamdashboardComponent, children: [
                    {
                        path: '', component: SuperAdminDashboardclaimComponent
                    },
                    {
                        path: 'totalclaims', component: SuperAdminMediclaimviewComponent
                    },
                    {
                        path:'detailview/:id',component:SuperAdminClaimDetailViewComponent
                    }
                ]
            },
           
          
            {
                path: 'manualmedicineclaimdashboard',
                component: SuperAdminManualmedicineclaimdashboardComponent
            },
            {
                path: 'manualmedicineclaimlist',
                component: SuperAdminManualmedicineclaimlistComponent
            },
            {
                path: 'edit-manualmedicineclaim',
                component: EditManualmedicineClaimComponent
            },
            {
                path: 'add-manualmedicineclaim',
                component: AddManualmedicineClaimComponent
            },
            {
                path: 'view-manualmedicineclaim',
                component: ViewManualmedicinClaimComponent
            },
  
            {
                path: 'revenuemanagement',
                canActivate: [CheckGuard],
                component: SuperAdminRevenuemanagementComponent,
                data: { routing: ["/super-admin/revenuemanagement"] }
            },
            {
                path: 'contentmanagement',
                canActivate: [CheckGuard],
                component: SuperAdminContentmanagementComponent,
                data: { routing: ["/super-admin/contentmanagement"] }
            },
            {
                path: 'openhour',canActivate: [CheckGuard], component: SuperAdminOpeninghourmanagementComponent, 
                data: { routing: ["/super-admin/openhour"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: PharmacyComponent
                    },
                    {
                        path: 'addpharmacy/:id', component: AddpharmacyComponent
                    },
                    // {
                    //     path: 'hospital',canActivate: [CheckGuard], component: HospitalComponent
                    // },
                    {
                        path:'addOnDutyPharmacy/:id',component:AddOndutyPharmacyComponent
                    },
                    // {
                    //     path:'addHospital',component:AddHospitalComponent
                    // },
                    // {
                    //     path:'editHospital/:id',component:AddHospitalComponent
                    // }
                ]
            },
            {
                path: 'communication',
                canActivate: [CheckGuard],
                component: SuperAdminCommunicationComponent
            },
            {
                path: 'individualparamedical-professions',canActivate: [CheckGuard], component: SuperAdminIndividuallaboratoryComponent,
                data: { routing: ["/super-admin/individuallaboratory-imaging"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: LaboratorylistComponent
                    },
                    {
                        path: 'basicinfo/:id', component: PendinglabbasicinfoComponent
                    },
                    {
                        path: 'permission/:id', component: LaboratorypermissionComponent
                    },
                    // {
                    //     path: 'approvedbasicinfo/:id', component: ApprovedbasicinfoComponent
                    // },
                ]
            },
            {
                path: 'individualoptical',canActivate: [CheckGuard], component: SuperAdminOpticalmanagementComponent,
                data: { routing: ["/super-admin/individualoptical"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: OpticallistComponent
                    },
                    {
                        path: 'basicinfo/:id', component: PendingopticalbasicinfoComponent
                    },
                    {
                        path: 'permission/:id', component: OpticalpermissionComponent
                    },
                    // {
                    //     path: 'approvedbasicinfo/:id', component: ApprovedbasicinfoComponent
                    // },
                ]
            },
            {
                path: 'individualdental',canActivate: [CheckGuard], component: SuperAdminDentalmanagementComponent,
                data: { routing: ["/super-admin/individualdental"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: DentallistComponent
                    },
                    {
                        path: 'basicinfo/:id', component: PendingdentalbasicinfoComponent
                    },
                    {
                        path: 'permission/:id', component: DentalpermissionComponent
                    },
                    // {
                    //     path: 'approvedbasicinfo/:id', component: ApprovedbasicinfoComponent
                    // },
                ]
            },
            {
                path: 'individuallaboratory-imaging',canActivate: [CheckGuard], component: SuperAdminImagingmanagementComponent,
                data: { routing: ["/super-admin/individualparamedical-professions"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: ImaginglistComponent
                    },
                    {
                        path: 'basicinfo/:id', component: PendingimagingbasicinfoComponent
                    },
                    {
                        path: 'permission/:id', component: ImagingpermissionComponent
                    },
                    // {
                    //     path: 'approvedbasicinfo/:id', component: ApprovedbasicinfoComponent
                    // },
                ]
            },

            {
                path: 'openhour/hospital',canActivate: [CheckGuard], component: SuperAdminOpeninghourmanagementComponent, 
                data: { routing: ["/super-admin/openhour/hospital"] },
                children: [
                    {
                        path: '',canActivate: [CheckGuard], component: HospitalComponent
                    },                                 
                    
                    {
                        path:'addHospital',component:AddHospitalComponent
                    },
                    {
                        path:'editHospital/:id',component:AddHospitalComponent
                    }
                ]
            },
            
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminRoutingModule { }




