import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { catchError, Observable, tap, throwError, map } from "rxjs";
import { AuthService } from "./auth.service";
import { CoreService } from "./core.service";
import { HospitalService } from "../modules/hospital/hospital.service";
import { InsuranceService } from "../modules/insurance/insurance.service";
import { IndiviualDoctorService } from "../modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../modules/four-portal/four-portal.service";
import { SuperAdminService } from "../modules/super-admin/super-admin.service";
import { PharmacyService } from "../modules/pharmacy/pharmacy.service";
// import { EncryptionDecryption } from "./encryptionFile"

@Injectable()

export class loaderInterceptor implements HttpInterceptor{
    role: string;
    currentLogsID: any;

    constructor(private ngxService: NgxUiLoaderService,
        private authService: AuthService,
        private coreService: CoreService,
        private hospitalService : HospitalService,
        private pharmacyservice : PharmacyService,
        private superadminservice : SuperAdminService,
        private fourPortalService : FourPortalService,
        private doctorService : IndiviualDoctorService,
        private insuranceService : InsuranceService,) {
        this.role = localStorage.getItem("role");     
        this.currentLogsID = sessionStorage.getItem('currentLogId')                               

    }

    // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //     if (request && request.body) {
    //         let encryptedBody: any;
    //         let encryptedRequest;
    //         if (request.body instanceof FormData) {
    //             const formData = new FormData();
    //             let valuetest = {};
    //             request.body.forEach((value, key) => {
    //                 if (key === "filePath") {
    //                     formData.append(key, value);
    //                 } else {
    //                     valuetest[key] = value;
    //                 }
    //             });
    //             formData.append("data", this.coreService.encryptObjectData(valuetest));
    //             encryptedBody = formData;
    //             encryptedRequest = request.clone({ body: encryptedBody });
    //             console.log("encryptedRequest>>>>>>>>>>", encryptedRequest)
    //         } else {
    //             encryptedBody = this.coreService.encryptObjectData(request.body);
    //             console.log("tesghjjjdkfhs", encryptedBody);
    //             console.log(request.body, "=======================request.body");

    //             encryptedRequest = request.clone({ body: { data: encryptedBody } });
    //         }

    //         /*  return next.handle(encryptedRequest).pipe(
    //            catchError((error) => throwError(error)),
    //            map((event: HttpEvent<any>) => {
    //              return event;
    //            })
    //          ); */

    //         return next.handle(encryptedRequest).pipe(
    //             catchError((error) => throwError(error)),
    //             map((event: HttpEvent<any>) => {
    //                 return event;
    //             })
    //         );
    //     }
    //     return next.handle(request).pipe(
    //         catchError((err) => {
    //             if (err.status === 401 && err.statusText === "Unauthorized") {
    //                 this.authService.logout();
    //                 this.coreService.showWarning('Session Expired', '');
    //             }

    //             return throwError(err);
    //         })
    //     )
    // }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err)=>{
                if(err.status === 401 && err.statusText ==="Unauthorized"){
                   
                    // this.updateLogs(this.role);
                    this.authService.logout();
                    this.coreService.showWarning('Session Expired','');
                }
                
                return throwError(err);
            })
        )
    }


    updateLogs(portalrole: string) {
        console.log("currentLogsIDloader_____________", this.currentLogsID);
        const reqData = {
            currentLogID: this.currentLogsID
        };
    
        let service;
        switch (portalrole) {
            case 'hospital':
                service = this.hospitalService;
                break;
            case 'pharmacy':
                service = this.pharmacyservice;
                break;
            case 'super-admin':
                service = this.superadminservice;
                break;
            case 'portals':
                service = this.fourPortalService;
                break;
            case 'individual-doctor':
                service = this.doctorService;
                break;
            case 'insurance':
                service = this.insuranceService;
                break;
            default:
                console.error(`Invalid portal role: ${portalrole}`);
                return;
        }
    
        service.updateLogs(reqData).subscribe((res) => {
            const encryptedData = { data: res };
            const response = this.coreService.decryptObjectData(encryptedData);
            if (response.status == true) {
                console.log("response___________", response);
            } else {
                this.coreService.showError("", response.message);
            }
        });
    }
    
}