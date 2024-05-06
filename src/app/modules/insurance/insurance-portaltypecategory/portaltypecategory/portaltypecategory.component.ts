import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InsuranceService } from 'src/app/modules/insurance/insurance.service';
import { CoreService } from 'src/app/shared/core.service';
// import { SuperAdminService } from '../../super-admin/super-admin.service';
import { SuperAdminService } from '../../../super-admin/super-admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-portaltypecategory',
  templateUrl: './portaltypecategory.component.html',
  styleUrls: ['./portaltypecategory.component.scss']
})
export class PortaltypecategoryComponent implements OnInit {
  mylist: Array<string> = [];
  page: any = 1;
  pageSize: number = 1000;
  totalLength: number = 0;
  userId: any;
  service_id: any;
  isSubmitted: any = false;
  searchText: string = '';
  insAdminList: any = [];
  serviceList: any = [];
  exclusionList: any = [];
  assignPlanForm: FormGroup;
  exclusionForm: FormGroup;
  insuranceSelectedValue: string = '';
  serviceFormArray: any;
  catFormArray: any;
  exFormArray: any;
  exCatFormArray: any;
  responseCategory: any = [];
  responseExclusion: any = [];
  selectedServices: any = [];
  selectedExclusion: any = [];
  conditionCheck: boolean = true;
  secondConditionCheck: boolean = true;
  loggedUserId: string;
  planserviceList: any;
  portalType: string;
  portalValue: any = '';
  portaltypeData: any = [];
  userRole: any;
  InsuranceID: any;
  innerMenuPremission:any=[];
  constructor(
    private sAdminServices: SuperAdminService,
    private service: InsuranceService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private loader: NgxUiLoaderService
  ) {
    // this.getApprovedDetails();
    const userData = this._coreService.getLocalStorage('loginData');
    const adminData = this._coreService.getLocalStorage('adminData');

    this.loggedUserId = userData._id
    this.userRole = userData.role
    this.InsuranceID = adminData.for_user

    // this.loggedUserId = this._coreService.getLocalStorage('loginData')._id;



    this.assignPlanForm = this.fb.group({
      services: this.fb.array([]),
      categories: this.fb.array([])
    });
    this.exclusionForm = this.fb.group({
      exclusionId: this.fb.array([]),
      exclusionCatId: this.fb.array([])
    });

  }
  portalTypeSeclect(event: any) {
    this.portaltypeData = []
    this.mylist = []
    this.portalValue = event.value
    console.log(this.portalValue, "<<<<<<");
    this.getportaltypeandinsuranceId()

  }
  getportaltypeandinsuranceId() {

    let insuranceId;

    if(this.userRole === 'INSURANCE_STAFF'){
      insuranceId = this.InsuranceID
    }else{
      insuranceId = this.loggedUserId
    }

    let mydata = {
      insuranceId: insuranceId,
      portalType: this.portalValue
    }
    this.sAdminServices.getportaltypeandinsuranceId(mydata).subscribe(async (res) => {

      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response,"<<<<<<<");

      if (response.status) {
        if (response.body.result.length > 0) {
          this.portaltypeData = response.body.result[0].categoryName;
          this.portaltypeData.map((name: any) => {
            this.mylist.push(name)
          })
        }
        console.log("Dhoble", this.portaltypeData);
      }


      //this.onSelected(this.loggedUserId);
      // this.totalLength = response.body.totalRecords;
    });
  }
  ngOnInit(): void {
    console.log(this.portalType, "portalType");

    // this.getApprovedDetails();
    this.listAllServices();
    this.getExclusionDetails();
    this.getplanserviceneByForUser()
    setTimeout(() => {
      console.log('called');
      this.getInsuranceDetails(this.loggedUserId);
      this.checkInnerPermission();

    }, 300);
   

  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      
        console.log("innerMenuPremission-------------",checkData.submenu);

        if (checkSubmenu.hasOwnProperty("portal-type")) {
          this.innerMenuPremission = checkSubmenu['portal-type'].inner_menu;

        } else {
          console.log(`does not exist in the object.`);
        }

      }else{
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }

        this.innerMenuPremission = innerMenu;
      }      
    }  
    console.log("innerMenuPremission-------------",this.innerMenuPremission);
    

  }

  giveInnerPermission(value){
    if(this.userRole === 'INSURANCE_STAFF'){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }
  
  }


  portaltypeandinsuranceId() {

    let insuranceId;

    this.loader.start();

    if(this.userRole === 'INSURANCE_STAFF'){
      insuranceId = this.InsuranceID
    }else{
      insuranceId = this.loggedUserId
    }


    let myjson = {
      categoryName: this.mylist,
      insuranceId: insuranceId,
      forportaluserId: this.loggedUserId,
      portalType: this.portalValue,
      addedBy: "Insurance",
      created_by:this.loggedUserId
    }
    this.sAdminServices.portaltypeandinsuranceId(myjson).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        console.log(result, "YYYYYYYYYYYYYYY");
        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, '');
        } else {
          this.loader.stop();
          this._coreService.showError(result.message, '');
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();
        console.log(err.message);
      }
    })
  }
  checkboxCheck(name: any, ischecked: any) {
    console.log(ischecked, "check value");

    if (this.portalValue != '') {
      if (name && ischecked.target.checked) {
        if (!this.mylist.includes(name)) {
          this.mylist.push(name)
          console.log(this.mylist, "Into");

        }

      }
      else {
        let index = this.mylist.indexOf(name)
        this.mylist.splice(index, 1)
        console.log(this.mylist, "IIIIIII");


      }

    } else {
      this._coreService.showError("Need to select role type", "")
    }
    console.log(this.mylist, "this.mylist");
  }

  getplanserviceneByForUser() {

    this.sAdminServices.getplanserviceneByForUser(this.loggedUserId).subscribe(async (res) => {
      // console.log(res,"<<<<<<<");

      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log('tanay', response);

      this.planserviceList = await response.body;
      console.log("Dhoble", this.planserviceList);

      // this.onSelected(this.loggedUserId);
      // this.totalLength = response.body.totalRecords;
    });
  }


  onSelected(value: string) {

    this.selectedServices = [];
    this.selectedExclusion = [];
    // this.assignPlanForm.reset();
    console.log('insuranceselectedvalue', value);
    this.insuranceSelectedValue = value;

    // this.ngAfterViewInit(value);
  }

  onChange(service: string, category: string, event: any, eventChecked: any = '') {

    this.serviceFormArray = <FormArray>this.assignPlanForm.controls['services'];
    this.catFormArray = <FormArray>this.assignPlanForm.controls['categories'];
    console.log(this.serviceFormArray);

    if (eventChecked) {
      console.log('eventChecked');

      this.serviceFormArray.push(new FormControl(service));
      this.catFormArray.push(new FormControl(category));
    } else {

      if (event.checked) {
        console.log('in else event.checked true');

        this.serviceFormArray.push(new FormControl(service));
        this.catFormArray.push(new FormControl(category));
      } else {
        console.log('in else event.checked false');
        let index = this.serviceFormArray.controls.findIndex(x => x.value == service)
        this.serviceFormArray.removeAt(index);
        this.catFormArray.removeAt(index);
      }
    }


    console.log('assignformarray', this.assignPlanForm.value);

  }

  exclusionOnChange(exclusion: string, category: string, event: any, eventChecked: any = '') {
    console.log(exclusion);
    console.log(event);

    this.exFormArray = <FormArray>this.exclusionForm.controls['exclusionId'];
    this.exCatFormArray = <FormArray>this.exclusionForm.controls['exclusionCatId'];
    console.log(this.exFormArray);
    if (eventChecked) {
      this.exFormArray.push(new FormControl(exclusion));
      this.exCatFormArray.push(new FormControl(category));
    } else {
      if (event.checked) {
        this.exFormArray.push(new FormControl(exclusion));
        this.exCatFormArray.push(new FormControl(category));
      } else {
        let index = this.exFormArray.controls.findIndex(x => x.value == exclusion)
        this.exFormArray.removeAt(index);
        this.exCatFormArray.removeAt(index);
      }
    }



    console.log('exclusionformarray', this.exclusionForm.value);

  }



  listAllServices() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      in_category: "",
      status: null,
      searchText: this.searchText,

    };
    this.sAdminServices.listCategoryServices(reqData).subscribe(async (res) => {
      console.log(res);

      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log('listAllServices', response);

      this.serviceList = await response.body.result;
      this.onSelected(this.loggedUserId);
      this.totalLength = response.body.totalRecords;
    });
  }

  getExclusionDetails() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
      in_exclusion: '',
    };
    this.sAdminServices.listExclusionDetails(reqData).subscribe(async (res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log('getExclusionDetails', response);
      this.onSelected(this.loggedUserId);
      // this.totalLength = response.body.totalRecords;
      this.exclusionList = await response.body.result;
    });
  }

  getApprovedDetails() {
    const param = {
      page: 1,
      limit: 1000,
      searchText: '',
      startDate: '',
      endDate: ''
    }
    this.sAdminServices.getApprovedData(param).subscribe((res) => {

      let result = this._coreService.decryptObjectData(res);
      console.log('approvedInsurancelist', result.body.result);
      result.body.result.forEach(element => {
        if (element?.for_portal_user?._id != undefined && element?.company_name != null && element?.company_name != '') {
          let insJson = {
            id: element?.for_portal_user?._id,
            name: element?.company_name,
          }
          this.insAdminList.push(insJson);
        }
      });

      console.log('insuranceAdminList', this.insAdminList);



    });
  }



  public saveAssignInsurance() {

    console.log(this.assignPlanForm.value);

    let categoryData = [];
    this.assignPlanForm.value.categories.forEach((element: any, i: number) => {
      let catJson = {
        categoryId: element,
        categoryServiceId: this.assignPlanForm.value.services[i]
      }
      categoryData.push(catJson);
    });

    console.log('categoryData', categoryData);


    let exclusionData = [];
    this.exclusionForm.value.exclusionCatId.forEach((element: any, index: number) => {
      let excJson = {
        "exclusionId": element,
        "exclusionDataId": this.exclusionForm.value.exclusionId[index],
      }
      exclusionData.push(excJson);
    });

    console.log('exclusionData', exclusionData);


    if (exclusionData != null || categoryData != null) {

      let requestData = {
        "insuranceId": this.loggedUserId,
        "getDetails": "",
        "categories": categoryData,
        "exclusions": exclusionData
      }

      this.sAdminServices.saveAssignPlanInsurance(requestData).subscribe({
        next: (res) => {
          console.log(res);
          let result = this._coreService.decryptContext(res);
          console.log(result);
          if (result.status) {
            this._coreService.showSuccess(result.message, '');
          } else {
            this._coreService.showError(result.message, '');
          }
        },
        error: (err: ErrorEvent) => {
          console.log(err.message);
        }
      })

      console.log('requestedData', requestData);
    }

  }


  getInsuranceDetails(val: string) {
    let requestData = {
      "insuranceId": this.loggedUserId,
      "getDetails": true
    }

    this.sAdminServices.saveAssignPlanInsurance(requestData).subscribe({
      next: async (res) => {
        console.log(res);
        let result = this._coreService.decryptContext(res);
        console.log('getInsurancePlanDetails', result);
        if (result.status && result.body != null) {
          this.responseCategory = await result.body?.categories;
          this.responseExclusion = await result.body?.exclusions;
          this.conditionCheck = false;
          console.log('getInsuranceDetailsServiceList', this.serviceList);

          if (this.loggedUserId != undefined) {
            await this.serviceList.forEach(element => {
              let reee = this.checkCat(element._id, element.in_category._id, element.status);
              console.log('serviceList', reee);
            });

            // this.exclusionList.
            await this.exclusionList.forEach(element => {
              // checkExclu(excluId:string,excluCatId:string,chkStats:boolean)
              let excllll = this.checkExclu(element._id, element.in_exclusion._id, element.status);
              console.log('exclusionList', excllll);
            });

          }

          // this._coreService.showSuccess(result.message,'');
        } else {
          this.responseCategory = null;
          this.responseExclusion = null;
          this.conditionCheck = true;

          // this._coreService.showError(result.message,'');
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    })
  }


  public checkCat(serviceId: string, catId: string, chkStats: boolean) {
    console.log('serviceId', serviceId);
    console.log('catId', catId);
    console.log('responseCategory', JSON.stringify(this.responseCategory));

    this.selectedServices.push(false);
    let status = false;
    if (this.responseCategory != null) {

      this.responseCategory.forEach(element => {
        if (element.categoryId == catId && element.categoryServiceId == serviceId) {
          status = true;
          this.selectedServices[this.selectedServices.length - 1] = true;
          console.log('11111');
          if (chkStats) {
            this.onChange(serviceId, catId, '', true);
          }

        }
      });
      console.log('checkCatselectedService', this.selectedServices);


    }
    return status;
  }

  public checkExclu(excluId: string, excluCatId: string, chkStats: boolean) {
    let status = false;
    this.selectedExclusion.push(false);
    if (this.responseExclusion != null) {

      this.responseExclusion.forEach(element => {
        if (element.exclusionId == excluId && element.exclusionDataId == excluCatId) {
          status = true;
          this.selectedExclusion[this.selectedExclusion.length - 1] = true;
          if (chkStats) {
            this.exclusionOnChange(excluId, excluCatId, '', true)
            // this.onChange(serviceId, catId, '',true);
          }
        }
      });


    }
    return status;
  }


  makeSelectAll(event: any) {
    if (event.target.checked) {

      this.planserviceList.forEach(element => {
        this.checkboxCheck(element.has_category, event)
        // if (this.portaltypeData.indexOf(element.has_category) == -1) {
        //   this.portaltypeData.push(element.has_category)
        // }
        if (this.mylist.indexOf(element.has_category) == -1) {
          this.mylist.push(element.has_category)
        }
      });
    } else {
      this.planserviceList.forEach(element => {
        this.checkboxCheck(element.has_category, event)
        // if (this.portaltypeData.indexOf(element.has_category) != -1) {
        //   this.portaltypeData.splice(this.portaltypeData.indexOf(element.has_category), 1)
        // }
        if (this.mylist.indexOf(element.has_category) != -1) {
          this.mylist.splice(this.mylist.indexOf(element.has_category), 1)
        }
      });
    }

  }

}

