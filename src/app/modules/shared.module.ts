import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgChartsModule } from 'ng2-charts';
import { LanguageComponent } from '../language/language.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { MatTableExporterModule } from 'mat-table-exporter';
import { SuperAdminService } from './super-admin/super-admin.service';
import { AddressSharedComponent } from '../shared/address-shared/address-shared.component';
import { AddressSharedPatientComponent } from '../shared/address-shared-patient/address-shared-patient.component';
import { Select2Module } from 'ng-select2-component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { VideoCallingComponent } from '../shared/video-calling/video-calling.component';
import {ConsultationnotesComponent} from "../shared/consultationnotes/consultationnotes.component"
// import { ContextMenuModule } from 'ngx-contextmenu';
import { FormioModule } from 'angular-formio';
import { AuthGuard } from '../shared/auth-guard';
import { PharmacyService } from './pharmacy/pharmacy.service';
import { PharmacyPlanService } from './pharmacy/pharmacy-plan.service';

// import { ContextMenuModule } from 'ngx-contextmenu';
import { HospitalService } from './hospital/hospital.service';
import { PatientdetailsComponent } from "./individual-doctor/individual-doctor-patientmanagement/patientdetails/patientdetails.component";
import { RouterModule } from '@angular/router';
import { FourPortalPatientDetailsComponent } from './four-portal/four-portal-patientmanagement/four-portal-patient-details/four-portal-patient-details.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ExternalVideoCallComponent } from '../shared/external-video-call/external-video-call.component';
import {
    MatDialog,
    MatDialogModule,
    MatDialogRef,
  } from "@angular/material/dialog";
@NgModule({
    declarations: [
        LanguageComponent,
        AddressSharedComponent,
        AddressSharedPatientComponent,
        VideoCallingComponent,
        ConsultationnotesComponent,
        PatientdetailsComponent,
        FourPortalPatientDetailsComponent,
        ExternalVideoCallComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatSelectModule,
        MatTableModule,
        NgChartsModule,
        MatChipsModule,
        MatPaginatorModule,
        NgbModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatAutocompleteModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatStepperModule,
        MatRadioModule,
        ReactiveFormsModule,
        NgOtpInputModule,
        NgxStripeModule.forRoot(environment.STRIPE_PUB_KEY),
        ToastrModule.forRoot({
            timeOut: 15000, // 15 seconds
            closeButton: true,
            progressBar: true,
        }),
        MatTableExporterModule,
        FormioModule,
        Select2Module,
        NgxMaterialTimepickerModule,
        RouterModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        }),
    MatDialogModule
        // ContextMenuModule
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatChipsModule,
        MatSelectModule,
        MatTableModule,
        NgChartsModule,
        MatPaginatorModule,
        NgbModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatStepperModule,
        MatRadioModule,
        LanguageComponent,
        NgOtpInputModule,
        NgxStripeModule,
        ToastrModule,
        MatTableExporterModule,
        AddressSharedComponent,
        AddressSharedPatientComponent,
        Select2Module,
        NgxMaterialTimepickerModule,
        VideoCallingComponent,
        PatientdetailsComponent,
        FourPortalPatientDetailsComponent,
        ConsultationnotesComponent,
        // ContextMenuModule
    ],
    providers: [
        AuthGuard,
        HospitalService,
        PharmacyService,
        SuperAdminService,
        PharmacyPlanService
    ]

})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}