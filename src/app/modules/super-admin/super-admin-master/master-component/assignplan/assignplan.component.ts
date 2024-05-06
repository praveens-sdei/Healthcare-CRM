import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InsuranceService } from 'src/app/modules/insurance/insurance.service';
import { CoreService } from 'src/app/shared/core.service';

import { SuperAdminService } from '../../../super-admin.service';

@Component({
  selector: 'app-assignplan',
  templateUrl: './assignplan.component.html',
  styleUrls: ['./assignplan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// @ViewChild("insAdmin",{static:false,read:ElementRef})

export class AssignplanComponent implements OnInit {
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
  insuranceSelectedValue: string='';
  serviceFormArray: any;
  catFormArray: any;
  exFormArray: any;
  exCatFormArray: any;
  responseCategory: any = [];
  responseExclusion: any = [];
  selectedServices: any = [];
  conditionCheck: boolean = true;
  secondConditionCheck: boolean = true;

  constructor(
    private sAdminServices: SuperAdminService,
    private service: InsuranceService,
    private _coreService: CoreService,
    private fb: FormBuilder
  ) {
    this.getApprovedDetails();

    this.assignPlanForm = this.fb.group({
      services: this.fb.array([]),
      categories: this.fb.array([])
    });
    this.exclusionForm = this.fb.group({
      exclusionId: this.fb.array([]),
      exclusionCatId: this.fb.array([])
    });
  }

  ngOnInit(): void {
    
    this.getApprovedDetails();
    this.listAllServices();
    this.getExclusionDetails();
    setTimeout(() => {
      console.log('called');
      // this.onSelected("63b996ef92457563fdc0574b");
    }, 5000);
    
  }



  onSelected(value: string) {
    
    this.selectedServices = [];
    // this.assignPlanForm.reset();
    console.log('insuranceselectedvalue', value);
    this.insuranceSelectedValue = value;

    this.ngAfterViewInit(value);
  }

  onChange(service: string, category: string, event: any,eventChecked:any='') {

    this.serviceFormArray = <FormArray>this.assignPlanForm.controls['services'];
    this.catFormArray = <FormArray>this.assignPlanForm.controls['categories'];
    console.log(this.serviceFormArray);

    if(eventChecked){
      console.log('eventChecked');
      
      this.serviceFormArray.push(new FormControl(service));
      this.catFormArray.push(new FormControl(category));
    }else{

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

  exclusionOnChange(exclusion: string, category: string, event: any) {
    console.log(exclusion);
    console.log(event);

    this.exFormArray = <FormArray>this.exclusionForm.controls['exclusionId'];
    this.exCatFormArray = <FormArray>this.exclusionForm.controls['exclusionCatId'];
    console.log(this.exFormArray);

    if (event.checked) {
      this.exFormArray.push(new FormControl(exclusion));
      this.exCatFormArray.push(new FormControl(category));
    } else {
      let index = this.exFormArray.controls.findIndex(x => x.value == exclusion)
      this.exFormArray.removeAt(index);
      this.exCatFormArray.removeAt(index);
    }

    console.log('exclusionformarray', this.exclusionForm.value);

  }



  listAllServices() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      in_category: "",
      searchText: this.searchText,
      status: null,
    };
    this.sAdminServices.listCategoryServices(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);

      this.serviceList = response.body.result;
      this.onSelected("63b996ef92457563fdc0574b");
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
    this.sAdminServices.listExclusionDetails(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.totalLength = response.body.totalRecords;
      this.exclusionList = response.body.result;
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
        "exclusionId": this.exclusionForm.value.exclusionId[index],
        "exclusionDataId": element
      }
      exclusionData.push(excJson);
    });

    console.log('exclusionData', exclusionData);


    if (exclusionData != null || categoryData != null) {

      let requestData = {
        "insuranceId": this.insuranceSelectedValue,
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


  ngAfterViewInit(val: string) {
    let requestData = {
      "insuranceId": val,
      "getDetails": true
    }

    this.sAdminServices.saveAssignPlanInsurance(requestData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this._coreService.decryptContext(res);
        console.log('getInsurancePlanDetails', result);
        if (result.status && result.body != null) {
          this.responseCategory = result.body?.categories;
          this.responseExclusion = result.body?.exclusions;
          this.conditionCheck = false;
          if(this.insuranceSelectedValue!= ''){
            this.serviceList.forEach(element => {
               
                let reee = this.checkCat(element._id,element.in_category._id,element.status);
                console.log('serviceList',reee);
             
              
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


  public checkCat(serviceId: string, catId: string,chkStats:boolean) {
    console.log('serviceId',serviceId);
    console.log('catId',catId);
    console.log('responseCategory',JSON.stringify(this.responseCategory));
    
    this.selectedServices.push(false);
    let status = false;
    if (this.responseCategory != null) {

      this.responseCategory.forEach(element => {
        if (element.categoryId == catId && element.categoryServiceId == serviceId) {
          status = true;
          this.selectedServices[this.selectedServices.length-1]=true;
          console.log('11111');
          if(chkStats){
            this.onChange(serviceId, catId, '',true);
          }
          
        }
      });
console.log('checkCatselectedService',this.selectedServices);


    }
    return status;
  }

  public checkExclu(excluId:string,excluCatId:string){
    let status = false;
    if (this.responseExclusion != null) {

      this.responseExclusion.forEach(element => {
        if (element.exclusionId == excluId && element.exclusionDataId == excluCatId) {
          status = true
        }
      });


    }
    return status;
  }



}
