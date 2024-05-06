import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  TemplateRef
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabGroup } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

// Pending request table
export interface PendingPeriodicElement {
  companyname: string;
  ifunumber: string;
  licenceid: string;
  email: string;
  rccmnumber: string;
  phonenumber: string;
  typeofcompany: string;
  location: string;
  action: string;
  id: string;
  portal_user_id: string;
}
// const PENDING_ELEMENT_DATA: PendingPeriodicElement[] = [
//   { companyname: 'Berkshire Hathaway', ifunumber: "3131445", licenceid: "13245667", email: 'michael.mitc@example.com', rccmnumber: "5455454", phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Berkshire Hathaway', ifunumber: "3131445", licenceid: "13245667", email: 'michael.mitc@example.com', rccmnumber: "5455454", phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Berkshire Hathaway', ifunumber: "3131445", licenceid: "13245667", email: 'michael.mitc@example.com', rccmnumber: "5455454", phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Berkshire Hathaway', ifunumber: "3131445", licenceid: "13245667", email: 'michael.mitc@example.com', rccmnumber: "5455454", phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Berkshire Hathaway', ifunumber: "3131445", licenceid: "13245667", email: 'michael.mitc@example.com', rccmnumber: "5455454", phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Berkshire Hathaway', ifunumber: "3131445", licenceid: "13245667", email: 'michael.mitc@example.com', rccmnumber: "5455454", phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
// ];
const PENDING_ELEMENT_DATA: PendingPeriodicElement[] = [];

// const PENDING_ELEMENT_DATA = [
//   { companyname: '', ifunumber: '', licenceid: '', email: '', rccmnumber: '', phonenumber: '', typeofcompany: '', location: '', action: '' },
// ]

// Approved request table
export interface ApprovedPeriodicElement {
  companyname: string;
  ifunumber: number;
  licenceid: number;
  rccmnumber: number;
  email: string;
  phonenumber: string;
  typeofcompany: string;
  location: string;
  action: string;
  id: string;
}
// const APPROVED_ELEMENT_DATA: ApprovedPeriodicElement[] = [
//   { companyname: 'Ping An Insurance', ifunumber: 3131445, licenceid: 13245667, email: 'michael.mitc@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Ping An Insurance', ifunumber: 3131445, licenceid: 13245667, email: 'michael.mitc@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Ping An Insurance', ifunumber: 3131445, licenceid: 13245667, email: 'michael.mitc@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Ping An Insurance', ifunumber: 3131445, licenceid: 13245667, email: 'michael.mitc@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Ping An Insurance', ifunumber: 3131445, licenceid: 13245667, email: 'michael.mitc@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Ping An Insurance', ifunumber: 3131445, licenceid: 13245667, email: 'michael.mitc@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
// ];
const APPROVED_ELEMENT_DATA = [
  {
    companyname: "",
    ifunumber: "",
    licenceid: "",
    email: "",
    rccmnumber: "",
    phonenumber: "",
    typeofcompany: "",
    location: "",
    action: "",
  },
];
// Reject request table
export interface RejectPeriodicElement {
  companyname: string;
  ifunumber: number;
  licenceid: number;
  rccmnumber: number;
  email: string;
  phonenumber: string;
  typeofcompany: string;
  location: string;
  action: string;
  id: string;
}
// const REJECT_ELEMENT_DATA: RejectPeriodicElement[] = [
//   { companyname: 'Cigna', ifunumber: 13245667, licenceid: 13245667, email: 'sara.cruz@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Cigna', ifunumber: 13245667, licenceid: 13245667, email: 'sara.cruz@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Cigna', ifunumber: 13245667, licenceid: 13245667, email: 'sara.cruz@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Cigna', ifunumber: 13245667, licenceid: 13245667, email: 'sara.cruz@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Cigna', ifunumber: 13245667, licenceid: 13245667, email: 'sara.cruz@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
//   { companyname: 'Cigna', ifunumber: 13245667, licenceid: 13245667, email: 'sara.cruz@example.com', rccmnumber: 5455454, phonenumber: '(201) 555-0124', typeofcompany: 'Limited Company', location: 'Central West', },
// ];
const REJECT_ELEMENT_DATA = [
  {
    companyname: "",
    ifunumber: "",
    licenceid: "",
    email: "",
    rccmnumber: "",
    phonenumber: "",
    typeofcompany: "",
    location: "",
    action: "",
  },
];

export type IVerifyStatus = "APPROVED" | "PENDING" | "DECLINED";

@Component({
  selector: "app-insurancelist",
  templateUrl: "./insurancelist.component.html",
  styleUrls: ["./insurancelist.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsurancelistComponent implements OnInit {
  // PENDING_ELEMENT_DATA: PendingPeriodicElement[];
  // Pending request table
  pendingdisplayedColumns: string[] = [
    "companyname",
    "ifunumber",
    "licenceid",
    "email",
    "rccmnumber",
    "phonenumber",
    "typeofcompany",
    "location",
    // "lockuser",
    // "action",
  ];
  pendingdataSource = new MatTableDataSource();
  // pendingdataSource = new MatTableDataSource<PendingPeriodicElement>(PENDING_ELEMENT_DATA);
  // pendingdataSourceTwo = new MatTableDataSource<PendingPeriodicElement>;
  // Approved request table
  // approveddisplayedColumns: string[] = ['companyname', 'ifunumber', 'licenceid', 'email', 'rccmnumber', 'phonenumber', 'typeofcompany', 'location', 'lockuser', 'action'];
  // approveddataSource = new MatTableDataSource<ApprovedPeriodicElement>(APPROVED_ELEMENT_DATA);
  // approveddataSource : any;
  // Reject request table
  // rejectdisplayedColumns: string[] = ['companyname', 'ifunumber', 'licenceid', 'email', 'rccmnumber', 'phonenumber', 'typeofcompany', 'location', 'lockuser', 'action'];
  // rejectdataSource = new MatTableDataSource<RejectPeriodicElement>(REJECT_ELEMENT_DATA);
  // rejectdataSource : any;

  // @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("statusTab", { static: false }) tab: MatTabGroup;
  @ViewChild("searchName", { static: true }) input: ElementRef;
  @ViewChild("selectclaimscontent", { static: false }) selectclaimscontent: any;
  @ViewChild("lockOrUnloackmodal") lockOrUnloackmodal: TemplateRef<any>;
  @ViewChild("activeOrInactivemodal") activeOrInactivemodal: TemplateRef<any>;
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  currentId: any;
  superAdminId: any;
  templateRes: any;
  cardPreviews: any;
  templateForm: FormGroup;
  isSubmitted: boolean = false;
  verifyStatus: IVerifyStatus = "PENDING";
  statusList: IVerifyStatus[] = ["PENDING", "APPROVED", "DECLINED"];
  displayedColumns: string[];
  public selectedTabIndex = 0;
  public searchText = "";
  public indexId:number;
  abc: any = "Lock";
  def:any = "Active";

  sortColumn: string = 'company_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  tabFor: string;
  card_preview_id:any = '';
  template_id:any = '';
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private _superAdminService: SuperAdminService,
    private modalService: NgbModal,
    private _coreService: CoreService,
    private ref: ChangeDetectorRef,
    private route: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.templateForm = fb.group({
      template_id: ["", [Validators.required]],
      card_preview_id: ["", [Validators.required]],
      _id: [""],
    });
    let localStorageData = _coreService.getLocalStorage("loginData");
    this.superAdminId = localStorageData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }
  get templateFormControl(): { [key: string]: AbstractControl } {
    return this.templateForm.controls;
  }

  ngOnInit(): void {
    this.recentInsuranceList();
    this.getTemplate();
    this.getCardPreviewTemplates();
    
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
          console.log(`exist in the object.`);

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
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  onSortData(column: any) {
    
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';

    if (this.verifyStatus === "PENDING") {
      this.getPendingDetails(`${column}:${this.sortOrder}`);
    } else if (this.verifyStatus === "APPROVED") {
      this.getApprovedDetails(`${column}:${this.sortOrder}`);
    } else if (this.verifyStatus === "DECLINED"){
      this.getRejectDetails(`${column}:${this.sortOrder}`);
    } else {
      this.getPendingDetails(`${column}:${this.sortOrder}`);
    }



  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    if (this.verifyStatus === "PENDING") {
      this.getPendingDetails();
    } else if (this.verifyStatus === "APPROVED") {
      this.getApprovedDetails();
    } else {
      this.getRejectDetails();
    }
    // console.log(event.target.value);
  }

  private clearSearch(): void {
    this.searchText = "";
    this.input.nativeElement.value = "";
  }

  public clearAll(): void {
    // this.resetDate();
    this.searchText = "";
    this.clearSearch();
    this.recentInsuranceList();
  }
  getTemplate() {
    this._superAdminService.getTemplate().subscribe((res: any) => {
      let result = this._coreService.decryptObjectData(res);
      // console.log(result, "templates_Insurancee");
      if (result.status) {
        this.templateRes = result.body;
      }
    });
  }
  getCardPreviewTemplates() {
    this._superAdminService.getCardPreviewTemplate().subscribe((res: any) => {
      let result = this._coreService.decryptObjectData({ data: res });
      // console.log(result, "templates_cardPreviewwww");

      if (result.status) {
        this.cardPreviews = result.body
        console.log(this.cardPreviews, "templates_cardPreview_Insuranceeee");

      }
    });
  }

  ngAfterViewInit() {
    this.getPendingDetails();
  }
  saveAdminTemplate() {
    // console.log(this.templateForm.value, "template_Form_Value");
    this.templateForm.value._id = this.currentId;
    this._superAdminService
      .updateInsAdminStatusWithTemp(this.templateForm.value)
      .subscribe(
        (res) => {
          let result = this._coreService.decryptObjectData(res);
           console.log(result, "resultttttttt_______");
          if (result.status) {
            this._coreService.showSuccess("", result.message);
            this.closePopUp();
            this.route.navigate([
              "/super-admin/insurance/permission",
              this.for_portal_user,
            ]);
          } else {
            this._coreService.showError("", result.message);
          }
        },
        (error) => {
          console.log("error in save admin template", error);
        }
      );
  }

  saveAdminTemplate2() {
    // console.log(this.templateForm.value, "template_Form_Value");
    let data = {
      _id:this.currentId,
      card_preview_id:this.templateForm.value.card_preview_id?this.templateForm.value.card_preview_id:this.card_preview_id,
      template_id:this.templateForm.value.template_id?this.templateForm.value.template_id:this.template_id
    }
    this._superAdminService
      .updateInsAdminStatusWithTemp(data)
      .subscribe(
        (res) => {
          let result = this._coreService.decryptObjectData(res);
           console.log(result, "resultttttttt_______");
          if (result.status) {
            this._coreService.showSuccess("", result.message);
            this.closePopUp();
            this.templateForm.reset();
            this.getApprovedDetails();
           /*  this.route.navigate([
              "/super-admin/insurance/permission",
              this.for_portal_user,
            ]); */
          } else {
            this._coreService.showError("", result.message);
          }
        },
        (error) => {
          console.log("error in save admin template", error);
        }
      );
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  public handlePageEvent(data: { pageIndex: number; pageSize: number }): void {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.verifyStatus = this.statusList[this.selectedTabIndex];
    if (this.verifyStatus === "PENDING") {
      this.getPendingDetails();
    } else if (this.verifyStatus === "APPROVED") {
      this.getApprovedDetails();
    } else {
      this.getRejectDetails();
    }
  }

  public onTabChanged(data: { index: number }): void {
    this.verifyStatus = this.statusList[data.index];
    console.log(' this.verifyStatus ', this.verifyStatus );
    
    this.recentInsuranceList();
  }

  private recentInsuranceList(): void {
    this.pushColumns();
    this.resetPagination();
    this.pendingdataSource = null;
    console.log("recent insurance list", this.verifyStatus);

    if (this.verifyStatus === "PENDING") {
      this.getPendingDetails(`${this.sortColumn}:${this.sortOrder}`);
    } else if (this.verifyStatus === "APPROVED") {
      this.getApprovedDetails(`${this.sortColumn}:${this.sortOrder}`);
    } else {
      this.getRejectDetails();
    }
  }

  //  Reject modal
  openVerticallyCenteredreject(reject: any, id: any) {
    this.currentId = id;
    this.modalService.open(reject, {
      centered: true,
      size: "md",
      windowClass: "reject_data",
      keyboard: false,
      backdrop: false,
    });
  }
  //  Select Claim modal
  openVerticallyCenteredselectclaims(selectclaimscontent: any) {
    this.modalService.open(selectclaimscontent, {
      centered: true,
      size: "md",
      windowClass: "select_claim",
      backdrop: false,
    });
  }
  openVerticallyCenteredselectclaims2(selectclaimscontent1: any,element:any) {
    console.log(element,"elementtt_______");
    this.card_preview_id = element.card_preview_id;
    this.template_id = element.template_id;
    this.currentId = element.id;
    this.templateForm.get('template_id').setValue(this.template_id);
    this.templateForm.get('card_preview_id').setValue(this.card_preview_id);
    this.modalService.open(selectclaimscontent1, {
      centered: true,
      size: "md",
      windowClass: "select_claim",
      backdrop: false,
    });
  }

  closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
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

  registerAdmin(act: any) {
    let data = {
      action: act,
      id: this.currentId,
      approved_or_rejected_by: this.superAdminId,
    };
    this._superAdminService
      .updateInsAdminStatus(JSON.stringify(data))
      .subscribe(
        (res: any) => {
          let result = this._coreService.decryptObjectData(res);
          if (result.status) {
            this.closePopUp();
            if (act == 1) {
              this.openVerticallyCenteredselectclaims(this.selectclaimscontent);
            }

            this._coreService.showSuccess("", result.message);
            this.recentInsuranceList();
          }
        },
        (error) => {
          console.log("error", error);
        }
      );
  }

  for_portal_user: any = "";

  //  Approved modal
  openVerticallyCenteredapproved(approved: any, id: any, for_portal_user: any) {
    this.currentId = id;
    this.for_portal_user = for_portal_user;
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
      keyboard: false,
      backdrop: false,
    });
  }

   //  Delete modal
   openVerticallyCentereddetale(deletemodal: any, id: any) {
    this.indexId = id;
    this.modalService.open(deletemodal, { centered: true, size: "md" });
  }

  private resetPagination(): void {
    this.page = 1;
    this.totalLength = 0;
  }

  getPendingDetails(sort:any='') {
    const param = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      startDate: "",
      endDate: "",
      sort:sort
    };

    this._superAdminService.getPendingDataforSuperadmin(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({data:res});
       console.log(result,"<++++++result______");
      let pendingData: any = [];
      result.body.result.forEach(function (val: any) {
        pendingData.push({
          companyname: val.company_name,
          ifunumber: val.ifu_number,
          licenceid: val?.licence_id,
          email: val.for_portal_user?.email,
          rccmnumber: val.rccm_number,
          phonenumber: val.for_portal_user?.mobile,
          typeofcompany: val.company_type,
          location:  val.in_location?.address ? val.in_location?.address : "-", //val.in_location?.address
          action: "",
          id: val._id,
          for_portal_user: val?.for_portal_user?._id,
          createdAt: val?.for_portal_user?.createdAt,
        });
      });
      this.totalLength = result.body.totalRecords;
      console.log("this.totalLength",this.totalLength)

      console.log(" AFTER ARRANGED==>", pendingData);

      this.pendingdataSource = new MatTableDataSource(pendingData);
    });
  }

  getApprovedDetails(sort:any='') {
    const param = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      startDate: "",
      endDate: "",
      sort:sort 
    };
    this._superAdminService.getApprovedDataSuperadmin(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({data:res});
     console.log("insurance--->>>",result)
      this.totalLength = result.body.totalRecords;
      let approveData: any = [];
      result.body.result.forEach(function (val: any) {
        approveData.push({
          companyname: val.company_name,
          ifunumber: val.ifu_number,
          licenceid: val?.licence_id,
          email: val.for_portal_user?.email,
          rccmnumber: val.rccm_number,
          phonenumber: val.for_portal_user?.mobile,
          typeofcompany: val.company_type,
          location: val.in_location?.address ? val.in_location?.address : "-",
          action: "",
          id: val._id,
          for_portal_user: val?.for_portal_user?._id,
          isActive:val?.for_portal_user?.isActive,
          lock_user:val?.for_portal_user?.lock_user,
          template_id:val?.template_id,
          card_preview_id:val?.card_preview_id,
          updatedAt:val?.updatedAt
        });
      });
 
      this.pendingdataSource = new MatTableDataSource(approveData);
    });
  }

  getRejectDetails(sort:any='') {
    const param = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      startDate: "",
      endDate: "",
      sort:sort 
    };
    this._superAdminService.getRejectDataSuperadmin(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({data:res});
      // console.log("result+==>>>>>>>>",result)
      this.totalLength = result.body.totalRecords;
      let rejectData: any = [];
      result.body.result.forEach(function (val: any) {
        rejectData.push({
          companyname: val.company_name,
          ifunumber: val.ifu_number,
          licenceid: val?.licence_id,
          email: val.for_portal_user?.email,
          rccmnumber: val.rccm_number,
          phonenumber: val.for_portal_user?.mobile,
          typeofcompany: val.company_type,
          location: "",
          action: "",
          id: val._id,
          for_portal_user: val?.for_portal_user?._id,
          updatedAt:val?.updatedAt
        });
      });

      this.pendingdataSource = new MatTableDataSource(rejectData);

      // console.log('pendingData', pendingData);
    });
  }

  getPendingInsAdmin(rowid: any, tabs: number) {
    this.route.navigate([
      "/super-admin/insurance/details/",
      rowid,
      this.selectedTabIndex,
    ]);
  }

  DeleteInsurance(){
    // console.log(this.indexId,"<<<<<<<<<<this.indexId");
    const actionRequest: any = {
      id: this.indexId,
      action_name:'delete',
      action_value:true
    };
    // console.log('updateLock',actionRequest);return;
    this._superAdminService.deleteInsurance(actionRequest).subscribe({
      next: (res: any) => {
        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        // console.log("result>>>>>>>>>>><", result);
        this.closePopUp();
        this._coreService.showSuccess("","Profile Status has been Successfully deleted");
      },
      error: (err: ErrorEvent) => {

        this._coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
      complete: () => {
        this.recentInsuranceList();
      }
    });
  }

  pushColumns() {
    if (this.verifyStatus === 'PENDING') {
      this.displayedColumns = ['createdAt',...this.pendingdisplayedColumns,'action'];
    }
    if (this.verifyStatus === 'APPROVED') {
      this.displayedColumns = ['updatedAt',...this.pendingdisplayedColumns,'status', 'lockuser','action'];
    }
    if (this.verifyStatus === 'DECLINED') {
      this.displayedColumns = ['rejectedAt',...this.pendingdisplayedColumns,'action'];
    }
  }

  handleToggleChange(event: any, id: any) {
    console.log(event);
   this.currentId = id;
    if (event.checked === false) {
      this.abc = "Unlock";
    } else {
      this.abc = "Lock";
    }
    this.modalService.open(this.lockOrUnloackmodal);
  }

  public onChangestatus(event: any, id: any) {
    this.currentId = id;
    console.log("this.currentId",this.currentId)
     if (event.checked === false) {
       this.def = "InActive";
     } else {
       this.def = "Active";
     }
     this.modalService.open(this.activeOrInactivemodal);
   }

  activeLockDeleteInsurance(action: any, value: boolean) {
    let reqData = {
      id:this.currentId,
      action_name: action,
      action_value: value,
    };

    console.log("REQUEST DATA======>", reqData);

    this._superAdminService.deleteInsurance(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE=====>", response);
      if (response.status) {
        this.toastr.success(response.message);
        this.closePopUp();
      }
    });
  }

}
