import { Injectable } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';

@Injectable()
export class CommonService {

  constructor(private _coreService:CoreService) { }

  getLoggeduserId():any{
    const userData = this._coreService.getLocalStorage("loginData");
    return userData._id;
  }
  getInsuranceCompanyID(){
    const userData = this._coreService.getLocalStorage("loginData");
    if(userData.role === "INSURANCE_STAFF"){
      const adminData = this._coreService.getLocalStorage("adminData");
      return adminData.for_user
    }
    if(userData.role === "INSURANCE_ADMIN"){
      return userData._id;
    }
  }
}
