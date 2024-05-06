import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from "./shared/auth-guard";
import { ExternalVideoCallComponent } from './shared/external-video-call/external-video-call.component';
// import { SubscribersdetailComponent } from './modules/insurance/insurance-subscribers/subscribersdetail/subscribersdetail.component';


const routes: Routes = [
  { path: '', redirectTo: 'patient', pathMatch: 'full' },
  {
    path:"external-video",
    component: ExternalVideoCallComponent
  },
  {
    path: 'patient',
    loadChildren: () => import('./modules/patient/patient.module').then((m) => m.PatientModule)
  },
  {
    path: 'insurance',
    loadChildren: () => import('./modules/insurance/insurance.module').then((m) => m.InsuranceModule)
  },
  {
    path: 'hospital',
    loadChildren: () => import('./modules/hospital/hospital.module').then((m) => m.HospitalModule)
  },
  {
    path: 'pharmacy',
    loadChildren: () => import('./modules/pharmacy/pharmacy.module').then((m) => m.PharmacyModule)
  },
  {
    path:"super-admin",
    loadChildren:()=>import('./modules/super-admin/super-admin.module').then((m)=>m.SuperAdminModule)
  },
  {
    path:"individual-doctor",
    loadChildren:()=>import('./modules/individual-doctor/individual-doctor.module').then((m)=>m.IndividualDoctorModule)
  },
  {
    path:"portals",
    loadChildren:()=>import('./modules/four-portal/four-portal.module').then((m)=>m.FourPortalModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
