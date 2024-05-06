import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";

@Component({
  selector: "app-pendinginsurancedetails",
  templateUrl: "./pendinginsurancedetails.component.html",
  styleUrls: ["./pendinginsurancedetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PendinginsurancedetailsComponent implements OnInit {
  insAdminId: any;
  templateRes: any;
  templateForm: FormGroup;
  isSubmitted: boolean = false;
  currentId: any;
  tabsId: number;
  email: any;
  dateOfBirth: any;
  phoneNumber: any;
  address: any;
  language: any;
  role: any;
  companyName: any;
  companySlogan: any;
  typeOfCompany: any;
  companyAddress: any;
  faxNumber: any;
  officePhone: any;
  lawsActivity: any;
  ifuNumber: any;
  headOfcAdd: any;
  rcmNumber: any;
  otherCompanyNumber: any;
  bankingReference: any;
  joinedDate: any;
  companyLogo: any = "";
  profile: any = "";
  fullName: any = "";
  insuranceDetails: any;
  adminId: any = "";
  verifyStatus:any;
  capital:any;
  innerMenuPremission:any=[];
  loginrole: any;
  @ViewChild("selectclaimscontent", { static: false }) selectclaimscontent: any;
  constructor(
    private modalService: NgbModal,
    private _superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.templateForm = fb.group({
      template_id: ["", [Validators.required]],
      _id: [""],
    });

    this.currentId = this.activeRoute.snapshot.params["id"];
    this.tabsId = this.activeRoute.snapshot.params["tabId"];
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  ngOnInit(): void {
    // this._coreService.SharingData.subscribe((result: any) => {
    //   this.insAdminId = result.insAdminId;
    // });
    this.getTemplate();
    const paramData = {
      id: this.currentId,
    };

    this._superAdminService.getInsuranceAdminDetails(paramData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData(res);
        console.log(response, "result");

        if (response.status) {
          this.insuranceDetails = response?.body;
          this.adminId = response?.body?._id;

          this.fullName = this.insuranceDetails?.full_name;
          this.email = this.insuranceDetails?.for_portal_user?.email;
          this.dateOfBirth = this.insuranceDetails?.dob;
          this.phoneNumber = this.insuranceDetails?.for_portal_user?.mobile;
          this.address = this.insuranceDetails?.in_location?.address;
          this.role =
            this.insuranceDetails?.role === "INSURANCE_ADMIN"
              ? "ADMIN"
              : "STAFF";
          this.companyName = this.insuranceDetails?.company_name;
          this.language = this.insuranceDetails?.language;
          this.companySlogan = this.insuranceDetails?.company_slogan;
          this.typeOfCompany = this.insuranceDetails?.company_type;
          this.companyAddress = this.insuranceDetails?.company_address;
          this.faxNumber = this.insuranceDetails?.fax;
          this.officePhone = this.insuranceDetails?.office_phone;
          this.lawsActivity = this.insuranceDetails?.laws_governing;
          this.ifuNumber = this.insuranceDetails?.ifu_number;
          this.headOfcAdd = this.insuranceDetails?.head_Office_address;
          this.rcmNumber = this.insuranceDetails?.rccm_number;
          this.otherCompanyNumber = this.insuranceDetails?.other_company_number;
          this.bankingReference = this.insuranceDetails?.banking_reference;
          this.joinedDate = this.insuranceDetails?.createdAt;
          this.companyLogo = this.insuranceDetails?.company_logo_signed_url;
          this.profile = this.insuranceDetails?.profile_pic_signed_url;
          this.capital = this.insuranceDetails?.capital;
          console.log("picccccc", this.profile)

          this.verifyStatus= this.insuranceDetails?.verify_status;
        }

        console.log(this.email);
      },
      (error) => {
        console.log("error in getPendingInsAdmin", error);
      }
    );
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

  getTemplate() {
    this._superAdminService.getTemplate().subscribe((res: any) => {
      let result = this._coreService.decryptObjectData(res);
      // console.log(result);
      if (result.status) {
        this.templateRes = result.body;
      }
    });
  }

  changeInsAdminStatus() {
    // this._superAdminService
  }

  closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  registerAdmin(act: any) {
    let data = {
      action: act,
      id: this.adminId,
      approved_or_rejected_by: this.adminId,
    };

    console.log("REQ DATA===>", data);
    this._superAdminService
      .updateInsAdminStatus(JSON.stringify(data))
      .subscribe(
        (res: any) => {
          console.log("AFTER APPROVE===>", res);
          let result = this._coreService.decryptObjectData(res);
          if (result.status) {
            this.closePopUp();
            if (act == 1) {
              this.openVerticallyCenteredselectclaims(this.selectclaimscontent);
            }

            this._coreService.showSuccess("", result.message);
          }
        },
        (error) => {
          console.log("error", error);
        }
      );
  }

  saveAdminTemplate() {
    console.log(this.templateForm.value);
    this.templateForm.value._id = this.adminId;
    console.log(this.templateForm.value);
    this._superAdminService
      .updateInsAdminStatusWithTemp(this.templateForm.value)
      .subscribe(
        (res) => {
          let result = this._coreService.decryptObjectData(res);
          console.log(result);
          if (result.status) {
            this._coreService.showSuccess("", result.message);
            this.closePopUp();
            this.route.navigate(["/super-admin/insurance/permission",this.currentId]);
          } else {
            this._coreService.showError("", result.message);
          }
        },
        (error) => {
          console.log("error in save admin template", error);
        }
      );
  }

  showPermission() {
    console.log("CURRENT ID==>",this.currentId)
    this.route.navigate(["/super-admin/insurance/permission",this.currentId]);
  }

  backpage() {
    this.route.navigate(["/super-admin/insurance"]);
  }

  get templateFormControl(): { [key: string]: AbstractControl } {
    return this.templateForm.controls;
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
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

  //  Reject modal
  openVerticallyCenteredreject(reject: any) {
    this.modalService.open(reject, {
      centered: true,
      size: "md",
      windowClass: "reject_data",
    });
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
}
