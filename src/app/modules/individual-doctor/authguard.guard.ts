import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { IndiviualDoctorService } from "./indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../super-admin/super-admin.service";

@Injectable({
  providedIn: "root",
})
export class AuthguardGuard implements CanActivate {
  constructor(
    private doctorService: IndiviualDoctorService,
    private router: Router,
    private coreService: CoreService,
    private sadminServce: SuperAdminService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {


    let roles = route.data["roles"] as Array<string>;


    console.log("CURRENT ROUTING====>",this.router.url);

    if(roles === undefined){
      roles = [""]
    }

    console.log("FROM ROUTING===>", roles);
    console.log("IN AUTH GUARD");

    let isPurchased = false;

    console.log("IN AUTH GUARD ISPURCHSED 2==>", isPurchased);

    // this.checkForPlan(roles).then((res) => {
    //   console.log("PROMISE RESPONSE ====>", res);
    //   isPurchased = Boolean(res[0]);

    //   if (!isPurchased) {
    //     if(res[1] === 'subscription' ){
    //       this.coreService.showError(
    //         "No plan purchsed! Please purches new plan",
    //         ""
    //       );
    //       this.router.navigateByUrl("/individual-doctor/subscriptionplan");
    //     }else{
    //       this.coreService.showError(
    //         "You cannot access this page without super admin permission",
    //         ""
    //       );

    //       this.router.navigateByUrl("/individual-doctor/404");
    //     }

    //     // return false;
    //   } else {
    //     // this.router.navigateByUrl('/individual-doctor/'+roles[0]);
    //     // return isPurchased;
    //   }
    // });

    console.log("PROMISE RESPONSE after promise ====>", isPurchased);

    return true;
  }

  async checkForPlan(roles: any) {
    return new Promise((resolve, reject) => {
      let isPurchased = false;

      const userData = JSON.parse(localStorage.getItem("loginData"));
      let userID = userData._id;
      this.doctorService.isPlanPurchesdByDoctor(userID).then((res) => {
        console.log("IN AUTH GUARD ISPURCHSED==>", res);
        isPurchased = res;

        if (isPurchased) {
          const params = {
            module_name: "superadmin",
            user_id: userID,
          };

          this.sadminServce.getUserMenus(params).subscribe(
            (res: any) => {
              const decryptedData = this.coreService.decryptObjectData(res);
              console.log("SIDE BAR RESPONSE===>", decryptedData);

              let isPermission = false

              for (const data of decryptedData.body) {
                // mainArray.push(data.menu_id.route_path);
                if (data.menu_id.route_path === roles[0]) {
                  console.log("IS PATH FOUND===>", data.menu_id.route_path);
                  isPermission=true
                }
              }

              resolve([isPermission,'permission']);


              // this.userMenu = menuArray;
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          resolve([false,'subscription']);
        }
      });
    });
  }

}
