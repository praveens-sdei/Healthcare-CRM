import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IndiviualDoctorService } from '../modules/individual-doctor/indiviual-doctor.service';
import { CoreService } from './core.service';
import { SuperAdminService } from '../modules/super-admin/super-admin.service';
import { PatientService } from '../modules/patient/patient.service';
import { InsuranceService } from '../modules/insurance/insurance.service';
import { PharmacyService } from '../modules/pharmacy/pharmacy.service';
import { HospitalService } from '../modules/hospital/hospital.service';
import { Location } from "@angular/common";
import { FourPortalService } from '../modules/four-portal/four-portal.service';


@Injectable({
  providedIn: 'root'
})
export class CheckGuard implements CanActivate {
  user: any;
  role: any;
  menuSelected: any = "";
  userID: any = ""
  portalUserId: any = ""
  type: string;
  loginRole: any;
  usertype: string;

  constructor(
    private router: Router,
    private location: Location,
    private fourPortalService: FourPortalService,
    private doctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private sadminServce: SuperAdminService,
    private patientService: PatientService,
    private insuranceService: InsuranceService,
    private pharmacyService: PharmacyService,
    private hospitalService: HospitalService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    const loginData = JSON.parse(localStorage.getItem("loginData"));

    const adminData = JSON.parse(localStorage.getItem("adminData"));

    this.portalUserId = loginData?._id
    this.loginRole = loginData?.role
    if (loginData?.role === 'INDIVIDUAL_DOCTOR') this.userID = loginData?._id;
    if (loginData?.role === 'HOSPITAL_DOCTOR') this.userID = adminData?.for_hospital;
    if (loginData?.role === 'INDIVIDUAL_DOCTOR_STAFF') this.userID = adminData?.in_hospital;

    if (loginData?.role === 'PATIENT') this.userID = loginData?._id;

    if (loginData?.role === 'PHARMACY_ADMIN') this.userID = loginData?._id;
    if (loginData?.role === 'PHARMACY_STAFF') this.userID = adminData?.for_staff;

    if (loginData?.role === 'HOSPITAL_ADMIN') this.userID = loginData?._id;
    if (loginData?.role === 'HOSPITAL_STAFF') this.userID = adminData?.in_hospital;

    if (loginData?.role === 'INSURANCE_ADMIN') this.userID = loginData?._id;
    if (loginData?.role === 'INSURANCE_STAFF') this.userID = adminData?.for_user;

    if (loginData?.role === 'INDIVIDUAL' && (loginData?.type === 'Dental' || loginData?.type === 'Optical' || loginData?.type === 'Laboratory-Imaging' || loginData?.type === 'Paramedical-Professions')) this.userID = loginData?._id;

    if (loginData?.role === 'HOSPITAL' && (loginData?.type === 'Dental' || loginData?.type === 'Optical' || loginData?.type === 'Laboratory-Imaging' || loginData?.type === 'Paramedical-Professions')) this.userID = adminData?.for_hospital;

    if (loginData?.role === 'STAFF' && (loginData?.type === 'Dental' || loginData?.type === 'Optical' || loginData?.type === 'Laboratory-Imaging' || loginData?.type === 'Paramedical-Professions')) this.userID = adminData?.creatorId;




    this.user = localStorage.getItem("token");
    this.role = localStorage.getItem("role");
    this.usertype = localStorage.getItem("type");

    this.type = loginData?.type


    let splitForPatient = this.location.path().split("/");
    let urlPath = this.location.path();


    if (splitForPatient[1] == this.role) {
      let routing = route.data['routing'] as Array<string>;


      if (routing === undefined) {
        // routing = ['/'+this.role + "/dashboard"];
        routing = [urlPath];
      }

      let isPurchased = false;

      this.checkForPlan(routing[0], this.role).then((res) => {

        let redirectURL = "";
        let redirectURL404 = "";

        if (this.role === "pharmacy") {
          redirectURL = "pharmacy/pharmacysubscriptionplan";
          redirectURL404 = "pharmacy/404";
        } else if (this.role === "portals") {
          
          redirectURL = `/portals/subscriptionplan/${this.type}`;
          redirectURL404 = "portals/404";
        } else if(this.role === 'super-admin'){
          redirectURL = `**`;
          redirectURL404 = "super-admin/404";
        }
        else {
          redirectURL = this.role + "/subscriptionplan";
          redirectURL404 = this.role + "/404";
        }

        isPurchased = Boolean(res[0]);

        if (!isPurchased) {
          if (res[1] === "subscription") {
            this.coreService.showError(
              "No plan purchased! Please purchase new plan",
              ""
            );

            this.router.navigateByUrl(redirectURL); //------
          } else {
            this.coreService.showError(
              "You cannot access this page without super admin permission",
              ""
            );

            this.router.navigateByUrl(redirectURL404); //---------
          }

        } else {

        }
      });


      return true;
    } else {
      return this.router.createUrlTree([""]);
    }
  }


  async checkForPlan(routing: any, checkForRole: any) {
    return new Promise((resolve, reject) => {
      let isPurchased = false;

      console.log("SUPRADMIN__________",checkForRole);

      let userID = this.userID;
      let portal_type = this.type;     

      switch (checkForRole) {
        case "portals":

          if (this.loginRole === 'INDIVIDUAL' || this.loginRole === 'STAFF'){
            this.fourPortalService.isPlanPurchesdByfourPortal(userID, portal_type).then((res) => {

              isPurchased = res;

              if (isPurchased) {
                const params = {
                  module_name: "superadmin",
                  user_id: this.portalUserId,
                };

                this.sadminServce.getUserMenus(params).subscribe(
                  (res: any) => {
                    const decryptedData = this.coreService.decryptObjectData(res);
                    let isPermission = false;

                    for (const data of decryptedData.body) {

                      if (data.menu_id.route_path === routing + '/' + this.type) {
                        if(data.menu_id.parent_id == '0'){

                          sessionStorage.setItem('currentPageMenuID', data.menu_id._id)
  
                        }else{
                          sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)
  
                        }

                        isPermission = true;
                      }
                    }

                    resolve([isPermission, "permission"]);

                    // this.userMenu = menuArray;
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              } else {
                resolve([false, "subscription"]);
              }
            });
          }else if (this.loginRole === 'HOSPITAL'){
            this.hospitalService.isPlanPurchesdByHospital(userID).then((res) => {
              // console.log("IN AUTH GUARD ISPURCHSED==>", res);
              isPurchased = res;
  
              if (isPurchased) {
                const params = {
                  module_name: "superadmin",
                  user_id: this.portalUserId,
                };
  
                this.sadminServce.getUserMenus(params).subscribe(
                  (res: any) => {
                    const decryptedData = this.coreService.decryptObjectData(res);
                    let isPermission = false;

                    for (const data of decryptedData.body) {

                      if (data.menu_id.route_path === routing + '/' + this.type) {

                        if(data.menu_id.parent_id == '0'){

                          sessionStorage.setItem('currentPageMenuID', data.menu_id._id)
  
                        }else{
                          sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)
  
                        }
                        
                        isPermission = true;
                      }
                    }

                    resolve([isPermission, "permission"]);

                    // this.userMenu = menuArray;
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              } else {
                resolve([false, "subscription"]);
              }
            });
          }
           
          break;
        case "individual-doctor":
          this.doctorService.isPlanPurchesdByDoctor(userID).then((res) => {

            isPurchased = res;

            if (isPurchased) {
              const params = {
                module_name: "superadmin",
                user_id: this.portalUserId,
              };

              this.sadminServce.getUserMenus(params).subscribe(
                (res: any) => {
                  const decryptedData = this.coreService.decryptObjectData(res);

                  let isPermission = false;

                  for (const data of decryptedData.body) {

                    if (data.menu_id.route_path === routing) {

                      if(data.menu_id.parent_id == '0'){

                        sessionStorage.setItem('currentPageMenuID', data.menu_id._id)

                      }else{
                        sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)

                      }
                      isPermission = true;
                    }
                  }

                  resolve([isPermission, "permission"]);

                  // this.userMenu = menuArray;
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              resolve([false, "subscription"]);
            }
          });
          break;

        case "insurance":
          this.insuranceService
            .isPlanPurchesdByInsurance(userID)
            .then((res) => {

              isPurchased = res;

              if (isPurchased) {
                const params = {
                  module_name: "superadmin",
                  user_id: this.portalUserId,
                };

                this.sadminServce.getUserMenus(params).subscribe(
                  (res: any) => {
                    const decryptedData =
                      this.coreService.decryptObjectData(res);

                    let isPermission = false;

                    for (const data of decryptedData.body) {
                      // mainArray.push(data.menu_id.route_path);

                      
                      if (data.menu_id.route_path === routing || data.menu_id.route_path.includes(routing)) {

                        sessionStorage.setItem('previousRouting', JSON.stringify(routing))

                        if(data.menu_id.parent_id == '0'){

                          sessionStorage.setItem('currentPageMenuID', data.menu_id._id)

                        }else{
                          sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)

                        }


                        isPermission = true;
                      }
                    }

                    resolve([isPermission, "permission"]);

                    // this.userMenu = menuArray;
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              } else {
                resolve([false, "subscription"]);
              }
            });
          break;

        case "pharmacy":
          this.pharmacyService.isPlanPurchasedByPharmacy(userID).then((res) => {
            isPurchased = res;

            if (isPurchased) {
              const params = {
                module_name: "superadmin",
                user_id: this.portalUserId,
              };

              this.sadminServce.getUserMenus(params).subscribe(
                (res: any) => {
                  const decryptedData = this.coreService.decryptObjectData(res);

                  let isPermission = false;

                  for (const data of decryptedData.body) {

                    if (data.menu_id.route_path === routing) {

                      if(data.menu_id.parent_id == '0'){

                        sessionStorage.setItem('currentPageMenuID', data.menu_id._id)

                      }else{
                        sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)

                      }

                      isPermission = true;
                    }
                  }

                  resolve([isPermission, "permission"]);

                  // this.userMenu = menuArray;
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              resolve([false, "subscription"]);
            }
          });
          break;

        case "patient":
          this.patientService.isPlanPurchesdByPatient(userID).then((res) => {
            isPurchased = res;

            if (isPurchased) {
              resolve([isPurchased, "subscription"]);
            } else {
              resolve([false, "subscription"]);
            }
          });
          break;

        case "hospital":
          this.hospitalService.isPlanPurchesdByHospital(userID).then((res) => {
            isPurchased = res;

            if (isPurchased) {
              const params = {
                module_name: "superadmin",
                user_id: this.portalUserId,
              };

              this.sadminServce.getUserMenus(params).subscribe(
                (res: any) => {
                  const decryptedData = this.coreService.decryptObjectData(res);

                  let isPermission = false;

                  for (const data of decryptedData.body) {
                    // mainArray.push(data.menu_id.route_path);
                    if (data.menu_id.route_path === routing) {
                      
                      if(data.menu_id.parent_id == '0'){

                        sessionStorage.setItem('currentPageMenuID', data.menu_id._id)

                      }else{
                        sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)

                      }
                      isPermission = true;
                    }
                  }

                  resolve([isPermission, "permission"]);

                  // this.userMenu = menuArray;
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              resolve([false, "subscription"]);
            }
          });
          break;

        case "super-admin":
                  const params = {
                    module_name: "superadmin",
                    user_id: this.portalUserId,
                  };
  
                  this.sadminServce.getUserMenus(params).subscribe(
                    (res: any) => {
                      const decryptedData =
                        this.coreService.decryptObjectData(res);
  
                      let isPermission = false;
  
                      for (const data of decryptedData.body) {
                        // mainArray.push(data.menu_id.route_path);
                        // console.log(data,"---routing------",routing); 
  
                        
                        if (data.menu_id.route_path === routing || data.menu_id.route_path.includes(routing)) {
  
                          // sessionStorage.setItem('previousRouting', JSON.stringify(routing))
  
                          if(data.menu_id.parent_id == '0' ){
  
                            sessionStorage.setItem('currentPageMenuID', data.menu_id._id)
  
                          }else{
                            sessionStorage.setItem('currentPageMenuID', data.menu_id.parent_id)
  
                          }
  
  
                          isPermission = true;
                        }
                      }
  
                      resolve([isPermission, "permission"]);
  
                      // this.userMenu = menuArray;
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                
           
            break;
        
        default:
          // code block
          break;
          
          
      }
    });
  }

}
