import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { CoreService } from "./core.service";
import { IndiviualDoctorService } from "../modules/individual-doctor/indiviual-doctor.service";
import { SuperAdminService } from "../modules/super-admin/super-admin.service";
import { PatientService } from "../modules/patient/patient.service";
import { InsuranceService } from "../modules/insurance/insurance.service";
import { Subscription } from "rxjs";
import { PharmacyService } from "../modules/pharmacy/pharmacy.service";
import { HospitalService } from "src/app/modules/hospital/hospital.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  user: any;
  role: any;
  menuSubscription: Subscription;
  menuSelected: any = "";
  userID :any=""
  portalUserId:any=""
  type: string;


  constructor(
    private router: Router,
    private location: Location,
    private doctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private sadminServce: SuperAdminService,
    private patientService: PatientService,
    private insuranceService: InsuranceService,
    private pharmacyService: PharmacyService,
    private hospitalService: HospitalService
  ) {

  
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.user = localStorage.getItem("token");
    this.role = localStorage.getItem("role");
    this.type = localStorage.getItem("type");


    let splitForPatient = this.location.path().split('/');

    if(splitForPatient[1] == this.role){
        return true;
    }else{
        return this.router.createUrlTree([""]);
    }
  }


}
