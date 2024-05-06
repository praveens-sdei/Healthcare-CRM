import { CoreService } from "./../../../shared/core.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { SuperAdminService } from "../super-admin.service";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  _id: string;
  planname: string;
  features: string;
  price: string;
  timeinterval: string;
  plantype: string;
  status: string;
  action: string;
  createdAt:string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: "app-super-subscriptionplan",
  templateUrl: "./super-subscriptionplan.component.html",
  styleUrls: ["./super-subscriptionplan.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SuperSubscriptionplanComponent implements OnInit {
  loginID: any;
  innerMenuPremission: any=[];
  loginrole:any;
  @HostListener("document:keydown", ["$event"]) //On pressing Escape
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closePopup();
    }
  }

  displayedColumns: string[] = [
    "createdAt",
    "planname",
    "features",
    "price",
    "timeinterval",
    "planfor",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isSubmitted: any = false;
  editPlan!: FormGroup;
  addPlan!: FormGroup;
  plan_for_array: any = ["insurance", "hospital",'pharmacy','patient', 'individualdoctor', 'Paramedical-Professions', 'Dental', 'Optical', 'Laboratory-Imaging'];
  service_name_array: any;
  subscriptionPlanId = "";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  periodicList: any;
  search_with_plan_name: any = "";
  is_activated: any = "all";
  plan_for: any = "all";

  sortColumn: string = 'plan_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  portalName: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private toastr: ToastrService,
    private _coreService: CoreService,
    private loader: NgxUiLoaderService
  ) {

    const userData = this._coreService.getLocalStorage('loginData')
    this.loginrole = this._coreService.getLocalStorage("adminData").role;

    this.loginID = userData._id

    this.editPlan = this.fb.group({
      _id: [""],
      plan_for: ["", [Validators.required]],
      plan_name: ["", [Validators.required]],
      plan_price: ["", [Validators.required]],
      plan_duration: ["", [Validators.required]],
      is_activated: [true, [Validators.required]],
      services: this.fb.array([]),
    });

    this.addPlan = this.fb.group({
      plan_for: ["", [Validators.required]],
      plan_name: ["", [Validators.required]],
      plan_price: ["", [Validators.required]],
      plan_duration: ["", [Validators.required]],
      is_activated: [true, [Validators.required]],
      services: this.fb.array([]),
    });
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getPlans(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.addNewService();
    this.getPlans(`${this.sortColumn}:${this.sortOrder}`);
    this.getPeriodicList();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log("checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

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
  }

  giveInnerPermission(value) {
    if (this.loginrole == 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }
    else {
      return true;
    }
  }

  getPlans(sort:any ='') {
    this.service 
      .getPlan(
        this.page,
        this.pageSize,
        this.search_with_plan_name,
        this.plan_for,
        this.is_activated,sort
      )
      .subscribe((res) => {
        let response = this._coreService.decryptObjectData({data:res});
        console.log(response);
        this.dataSource = response.body?.allPlans;
        this.totalLength = response.body?.totalRecords;
      });
  }

  addNewPlan() {
    this.isSubmitted = true;
    if (this.addPlan.invalid) {
      console.log(this.addPlan.value,"this.addPlan.invalid",this.addPlan.invalid)
      return;
    }
    this.loader.start();
    const additionalKey = 'createdBy';
    const additionalValue =  this.loginID;

    const modifiedData = { ...this.addPlan.value };

    modifiedData[additionalKey] = additionalValue;
    
    this.isSubmitted = false;
    console.log("modifiedData----------",modifiedData);

    this.service.addPlan(modifiedData).subscribe((res: any) => {
      let response = this._coreService.decryptObjectData({data:res});
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getPlans();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  updatePlan() {
    this.isSubmitted = true;
    if (this.editPlan.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    this.service.updatePlan(this.editPlan.value).subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getPlans();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleToggelUpdate(data: any, event: any) {
    for (let i of data.services) {
      this.addEditService();
    }
    this.editPlan.patchValue({
      _id: data._id,
      plan_for: data.plan_for,
      plan_name: data.plan_name,
      plan_price: data.plan_price,
      plan_duration: data.plan_duration?._id,
      is_activated: event.checked,
      services: data.services,
    });
    this.loader.start();
    this.service.updatePlan(this.editPlan.value).subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getPlans();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleDeletePlan() {
    this.loader.start();
    this.service.deletePlan(this.subscriptionPlanId).subscribe((res: any) => {
      let response = this._coreService.decryptObjectData({data:res});
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getPlans();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  getPeriodicList() {
    this.service.getPeriodicList().subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});
      this.periodicList = response.body.allPeriodicalPlans;
    });
  }

  // getPlanDetails() {
  //   this.service.getPlanDetails().subscribe((res) => {
  //     let response = this._coreService.decryptObjectData(res);
  //   });
  // }

  handleChangePlanFor(event: any) {
    this.service.getPlanFor(event).subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});
      console.log(response, 'response');
      
      this.service_name_array = response.body;
      this.portalName = response?.body[0]?.plan_for;
      console.log("this.portalName>>",this.portalName)
    });
  }

  handleStatusFilter(event: any) {
    this.is_activated = event;
    this.getPlans();
  }

  handlePlanForFilter(event: any) {
    this.plan_for = event;
    this.getPlans();
  }

  handleSearchFilter(event: any) {
    this.search_with_plan_name = event.target.value;
    this.getPlans();
  }

  closePopup() {
    this.services.clear();
    this.addPlan.reset();
    this.editService.clear();
    this.editPlan.reset();
    this.modalService.dismissAll("close");
    this.addNewService();
    this.isSubmitted = false;
  }

  clearFilter() {
    this.search_with_plan_name = "";
    this.plan_for = "all";
    this.is_activated = "all";
    this.getPlans();
  }

  handleRadioChange(event: any, string: any, index: any) {
    if (event.value && string === "add") {
      this.services.at(index).patchValue({
        max_number: null,
      });
    }

    if (event.value && string === "edit") {
      this.editService.at(index).patchValue({
        max_number: null,
      });
    }
  }

  //---------------------FromArray handling------------------------

  get services() {
    return this.addPlan.controls["services"] as FormArray;
  }

  addNewService() {
    const serviceForm = this.fb.group({
      name: ["", [Validators.required]],
      is_unlimited: [false, [Validators.required]],
      max_number: [0],
    });

    console.log("Service-----------",serviceForm);
    
    this.services.push(serviceForm);
  }

  // Add a getter method for convenience
  get serviceControls() {
    return this.services.controls;
  }

  get editService() {
    return this.editPlan.controls["services"] as FormArray;
  }

  addEditService() {
      const serviceEditForm = this.fb.group({
      name: ["", [Validators.required]],
      is_unlimited: [false, [Validators.required]],
      max_number: [0],
    });
    this.editService.push(serviceEditForm);
  }
  
  deleteService(index: number) {
    this.services.removeAt(index);
    this.onChangeService();
  }

  deleteEditService(index: number) {
    this.editService.removeAt(index);
  }

  //------------------------------------------------------------------

  openVerticallyCenteredsecond(deleteModal: any, _id: any) {
    this.subscriptionPlanId = _id;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
  }

  openVerticallyCenteredadd(addmodal: any) {
    this.addPlan.get('is_activated').setValue(true);
    this.modalService.open(addmodal, { centered: true, size: "md" });
    this.onChangeService();
  }

  openEditPopup(editmodal: any, data: any) {
    for (let i of data.services) {
      this.addEditService();
    }

    this.editPlan.patchValue({
      _id: data._id,
      plan_for: data.plan_for,
      plan_name: data.plan_name,
      plan_price: data.plan_price,
      plan_duration: data.plan_duration?._id,
      is_activated: data.is_activated,
      services: data.services,
    });
    this.onChangeEditService();
    this.handleChangePlanFor(data.plan_for);
    this.modalService.open(editmodal, { centered: true, size: "" });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getPlans();
  }

  get addPlanControl(): { [key: string]: AbstractControl } {
    return this.addPlan.controls;
  }

  get editPlanControl(): { [key: string]: AbstractControl } {
    return this.editPlan.controls;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  selectedService1=[]
  onChangeService(){
   this.selectedService1= this.services.value.map(ele=>ele.name);

  }

  selectedEditService1=[]
  onChangeEditService(){
   this.selectedEditService1= this.editService.value.map(ele=>ele.name);
  console.log("this.editPlan.value",this.editService.value)

  }
}
