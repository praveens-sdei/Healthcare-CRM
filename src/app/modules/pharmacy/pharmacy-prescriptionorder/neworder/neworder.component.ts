import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../../pharmacy.service";
import { IPatientDetailsRequest } from "../prescriptionorder/prescriptionorder.type";
import { IOrderCancelResponse, IOrderConfimRequest } from "./neworder.type";

@Component({
  selector: "app-neworder",
  templateUrl: "./neworder.component.html",
  styleUrls: ["./neworder.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NeworderComponent implements OnInit {
  order_id: any;
  portal_user_id: any;
  patient_id: any;
  insurance_no: string;
  subscriber_id: string;
  patient_details: any;
  subscriberdetails: any;
  insuranceDetails: any;
  @ViewChild("approved") approved;
  @ViewChild("notVerifiedModal") notVerifiedModal;
  @ViewChild("approvedWithoutVerified") approvedWithoutVerified;
  userRole: any;
  userPermission: any;
  innerMenuPremission:any=[];
  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    let portalUser = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userPermission =portalUser.permissions;

    this.userRole = portalUser.role;
    if(this.userRole === "PHARMACY_STAFF"){
      this.portal_user_id = adminData?.for_staff;
    }else{
      this.portal_user_id = portalUser._id;

    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
    });
    
    this.getOrderDetails();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);  
  }

  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){     
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("order_request")) {
          this.innerMenuPremission = checkSubmenu['order_request'].inner_menu;  
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
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }

  giveInnerPermission(value){   
    if(this.userRole === "PHARMACY_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }

  getOrderDetails() {
    console.log('getOrderDetails');
    
    let reqData = {
      for_order_id: this.order_id,
      for_portal_user: this.portal_user_id,
    };
    this.pharmacyService.getOrderDetails(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response, 'response');
      
      if (response.status) {
        this.patient_id = response?.data?.orderData?.patient_details?.user_id;
        this.insurance_no = response?.data?.orderData?.insurance_no
        this.subscriber_id = response?.data?.orderData?.subscriber_id
        this.getPatientDetails();
      }
    });
  }

  getPatientDetails() {
    this.pharmacyService.patientProfile(this.patient_id,null,this.subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.patient_details = response?.body.profileData;
      console.log(" this.patient_details ------", this.patient_details );
      
      this.subscriberdetails = response?.body.health_plan_details?.resultData;
      console.log(this.subscriberdetails,"tghjhkh",response.body);
      
      if (response.status) {
        this.checkInsuranceExpiry();
      }
    });
  }

  checkInsuranceExpiry() {
    let reqData = {
      insurance_id:
        this.patient_details?.in_insurance?.primary_insured?.insurance_id,
      policy_id: this.patient_details?.in_insurance?.primary_insured?.policy_id,
      card_id: this.patient_details?.in_insurance?.primary_insured?.card_id,
      employee_id:
        this.patient_details?.in_insurance?.primary_insured?.employee_id,
        subscriber_id:this.subscriber_id
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.insuranceDetails = response.body;
    });
  }

  verifyInsurance() {
    let reqData = {
      orderId: this.order_id,
      insurance_no: this.insurance_no,
      subscriber_id:this.subscriber_id,
      portal_user_id: this.portal_user_id
    };
    this.pharmacyService.verifyInsuranceForOrder(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response);
      if (response.data?.insurance_verified) {
        this.openVerticallyCenteredapproved(this.approved);
      } else {
        this.modalService.open(this.notVerifiedModal, {
          centered: true,
          size: "md",
          windowClass: "approved_data",
        });
      }
    });
  }

  handleOkay(){
    this.modalService.dismissAll();
    this.router.navigate(["/pharmacy/presciptionorder/neworderrequest"], {
      queryParams: {orderId:this.order_id},
    });
  }

  handleNo() {
    this.openVerticallyCenteredapproved(this.approvedWithoutVerified);
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
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
  cancelOrder() {
    const orderRequest: IOrderConfimRequest = {
      _id: this.order_id,
      status: "rejected",
      cancelled_by: "pharmacy",
      for_portal_user: sessionStorage.getItem("portal-user-id"),
    };
    this.pharmacyService.cancelOrderDetails(orderRequest).subscribe({
      next: (result: IResponse<IOrderCancelResponse>) => {
        // this.coreService.showSuccess("", "order details confirmed successfully");
        if (result.status === true) {
          this.router.navigate(["/pharmacy/presciptionorder"]);
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }
}
