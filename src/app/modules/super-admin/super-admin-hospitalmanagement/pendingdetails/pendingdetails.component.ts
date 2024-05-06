import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { SuperAdminHospitalService } from "../../super-admin-hospital.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { HospitalService } from "src/app/modules/hospital/hospital.service";

@Component({
  selector: "app-pendingdetails",
  templateUrl: "./pendingdetails.component.html",
  styleUrls: ["./pendingdetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PendingdetailsComponent implements OnInit {
  superAdminId: any;
  hospitalId: any = "";
  hospitalDetails: any;
  for_portal_userId: any = "";
  approvalStatus: any = "";
  subscriptionPlans: any = [];

  countryName: any = "";
  provinceName: any = "";
  departmentName: any = "";
  cityName: any = "";
  pincode: any = "";
  addressName: any = "";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  searchText: any="";
  doctorCount : any;
  verifyStatus: any;
  licensepicture: any;
  innerMenuPremission:any=[];
  loginrole: any;
  forportalId: any;
  routeBackID: any;
  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private hospitalService: SuperAdminHospitalService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private route: Router,
    private service: SuperAdminService,
    private hospitalportsalService: HospitalService,
  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.hospitalId = paramId;
   
    let superAdminData = JSON.parse(localStorage.getItem("adminData"));
    this.superAdminId = superAdminData?._id;
    
    this.getHospitalDetails();

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

  getHospitalDetails() {
    this.hospitalService
      .getHospitalDetails(this.hospitalId)
      .subscribe((res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("GET HOSPITAL DETAILS=======>", response);
        this.routeBackID = response?.body?._id
        this.hospitalDetails = response?.body;
        this.licensepicture = this.hospitalDetails?.license?.image
        console.log("his.licensepicture",this.licensepicture)
        this.for_portal_userId = response?.body?.for_portal_user?._id;
        this.approvalStatus = response?.body?.verify_status;
        this.subscriptionPlans = response?.body?.subscriptionPlans;
        this.verifyStatus = response?.body?.verify_status;
        this.getLocationsDataWithName(response?.body?.in_location);
        this.getDoctorList();
      });
  }

  getDoctorList() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      // hospital_portal_id: this.hospitalId,
      hospital_portal_id: this.for_portal_userId,
      searchText: this.searchText,
    };
    console.log("reqData->>>>>>>>>>>",reqData)
    this.hospitalportsalService.getDoctorsList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      // this.dataSource = response?.data?.data;
      // this.dataSourceRequests = response?.data?.data;
      this.doctorCount = response?.data?.totalCount;
      // console.log("this.doctorCount",this.doctorCount)
    });
  }

  approveOrRejectHospital(action: any) {
    let reqData = {
      action: action,
      approved_or_rejected_by: this.superAdminId,
      id: this.for_portal_userId,
    };

    console.log("REQUEST DATA FOR APPROVE OR REJECT===>", reqData);

    this.hospitalService.approveOrRejectHospital(reqData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("RESPONSE FOR REJECT OR APPROVED====>", response);
        if (response.status) {
          this.toastr.success(response.message);
          this.closePopup();
          if (action === "APPROVED") {
            this.route.navigate([
              "/super-admin/hospital/permission",
              this.for_portal_userId,
            ]);
          } else {
            this.route.navigate(["/super-admin/hospital"]);
          }
        }
      },
      (err) => {
        let errResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  closePopup() {
    this.modalService.dismissAll("close");
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

  //  Delete modal
  openVerticallyCentereddetale(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, { centered: true, size: "md" });
  }

  activeLockDeleteHospital(action: any) {
    let reqData = {
      hospital_portal_id: this.for_portal_userId,
      action_name: "delete",
      action_value: true,
    };

    console.log("REQUEST DATA======>", reqData);

    this.hospitalService.activeLockDeleteHospital(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("RESPONSE=====>", response);
      if (response.status) {
        this.toastr.success(response.messgae);
        this.closePopup();
      }
    });
  }

  getLocationsDataWithName(data: any) {
    let reqData = {
      location: { ...data },
    };
    this.service.getLocationInfoWithNames(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      console.log("Location response ===>", response);
      if (response.status) {
        this.countryName = response?.body?.countryName?.name;
        this.addressName= response?.body?.address;
        this.provinceName = response?.body?.provinceName?.name;
        this.departmentName = response?.body?.departmentName?.name;
        this.cityName = response?.body?.cityName?.name;
        this.pincode = response?.body?.pincode;
      }
    });
  }

  checkForExpiry = (expiry_date: any) => {
    let d = new Date();
    var g1 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // (YYYY, MM, DD)
    let statusData;
    var g2 = new Date(expiry_date);
    if (g1.getTime() < g2.getTime()) statusData = "active";
    else if (g1.getTime() > g2.getTime()) statusData = "expired";

    // this.globalStatus = statusData;
    return statusData;
  };


  planServiceStatement(services: any) {
    let statements = [];
    for (let service of services) {
      let statement = "";
      if (!service?.is_unlimited) {
        statement = `Manage ${service?.max_number} ${service?.name}`;
      } else {
        statement = `Manage Unlimited Staff`;
      }

      statements.push(statement);
    }

    return statements;
  }

  backpage(){
    this.route.navigate(["/super-admin/hospital"]);
  }
  routeNext(){
    this.route.navigate([`/super-admin/hospital/permission/${this.for_portal_userId}`],{
      queryParams : {
        forPortalId: this.routeBackID
      }
    });

  }
}
