import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";

@Component({
  selector: "app-pendingpharmacydetails",
  templateUrl: "./pendingpharmacydetails.component.html",
  styleUrls: ["./pendingpharmacydetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PendingpharmacydetailsComponent implements OnInit {
  profileDetails: any;
  pharmacyProfile: any = "";
  pharmacyPictures: any = [];

  pharmacyName: string;
  pharmacyEmail: string;
  pharmacyPhone: string;
  pharmacyAdd: string;
  pharmacyJoinDate: string;
  pharmacyBankDetails: string;
  pharmacymobilePay: string;
  pharCountryCode: string;
  address: string;
  about: string;
  licenseDetails: any;
  payDetails: any;
  bankDetails: any;

  currentId: string;
  tabsId: number;
  verifyStatus:any;
  onDutyCity: any;
  onDutyGroupNo: any;
  profileData: any;
  forPortalUserId: void;
  pharmacyAssociation: any;
  associationGroupname: any;
  sessionID: any;
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private _sadminService: SuperAdminService,
    private _coreService: CoreService,
    private route: Router,
    private _pharmacyService:PharmacyService
  ) {
    this.currentId = this.activeRoute.snapshot.params["id"];
    this.tabsId = this.activeRoute.snapshot.params["tabId"];
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  ngOnInit(): void {
    this.sessionID = this._coreService.getSessionStorage("pharmacyAdminId");
    // console.log(this.sessionID,"yyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    const paramData = {
      id: this.currentId,
    };
    this._sadminService.getPharmacyDetails(paramData).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        this.profileDetails = result?.data?.adminData;
         this.getAssociationdetails();
        this.getOnDutydetails(this.profileDetails?.duty_group)
        console.log("this.profileDetails>>>>",this.profileDetails)
        this.pharmacyProfile =
          result?.data?.adminData?.profile_picture_signed_url;
        this.forPortalUserId=this.profileDetails?.for_portal_user;
        this._coreService.setSessionStorage(
          result.data.portalUserData._id,
          "pharmacyAdminId"
        );
        this.pharmacyName = this.profileDetails?.pharmacy_name;
        this.pharmacyEmail = result?.data?.portalUserData?.email;
        this.pharmacyPhone = this.profileDetails?.main_phone_number ? this.profileDetails?.main_phone_number : result?.data?.portalUserData?.phone_number;
        this.pharmacyJoinDate = this.profileDetails?.createdAt;
        this.pharCountryCode = result?.data?.portalUserData?.country_code;

        this.address = this.profileDetails?.address;
        this.verifyStatus = result?.data?.adminData?.verify_status;
        this.about = this.profileDetails?.about_pharmacy;
        this.pharmacyPictures =
          this.profileDetails?.pharmacy_picture_signed_urls;

        this.licenseDetails = this.profileDetails?.licence_details;
console.log("licenseDetails",this.licenseDetails);

        this.payDetails = result?.data?.mobilePayData;
        this.bankDetails = result?.data?.bankDetails;
      },
      error: (err) => {
        console.log(err);
      },
    });

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

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  showPermission() {
    this.route.navigate(["/super-admin/individualpharmacy/permission",this.forPortalUserId],{
      queryParams :{
        forPortalId :this.currentId
      }
    });
  }

  backpage() {
    this.route.navigate(["/super-admin/individualpharmacy"]);
  }

  approveRejectPharmacy(status: string) {
    let reqData = {
      verify_status: status,
      id: this.currentId,
      approved_or_rejected_by:
        this._coreService.getLocalStorage("loginData")._id,
    };
console.log("Checkk---paream-->", reqData);

    this._sadminService.approveRejectPharmacy(reqData).subscribe((res) => {
      console.log(res);
      let encryptedData = { data: res };
      let result = this._coreService.decryptObjectData(encryptedData);
      console.log("------>CHeck",result);

      if (result.status) {
        this.closePopUp();
        if (status === "APPROVED") {
          this.showPermission();
          this._coreService.showSuccess(result.message, "");
        } else {
          this.backpage();
          this._coreService.showSuccess(result.message, "");
        }
      }
    });

    console.log(reqData);
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
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

  closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  getOnDutydetails(data){
    const param = {
      onDutyGroupId:data?.id_number,
    };
    this._pharmacyService.getOnDutyGroup(param).subscribe({
      next: async (res) => {
        let result = await this._coreService.decryptContext(res);
        // console.log(result, "getGroupDetails");
        if(this.profileDetails?.duty_group?.enabled){
          this.onDutyGroupNo= result?.data?.onDutyGroupNumber;
          this.onDutyCity = result?.data?.city_name;
        }else{
          this.onDutyGroupNo= " "
          this.onDutyCity = " "
        }
      },
    });
  }

  getAssociationdetails() {
    if(this.sessionID === null || this.sessionID=== undefined){
      return;
    }
    this._pharmacyService.pharmacyAssociationApi(this.sessionID).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.pharmacyAssociation = response?.body;
      if(this.pharmacyAssociation?.association?.enabled){
        this.associationGroupname = response?.body?.association?.name.map(nameItem => nameItem).join(', ');
        // console.log("this.associationGroupname",this.associationGroupname)
      }else{
        this.associationGroupname = "-"
      }
    });
  }
}
