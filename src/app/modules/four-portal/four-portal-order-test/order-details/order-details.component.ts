import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { PatientService } from "src/app/modules/patient/patient.service";
import { FourPortalService } from "../../four-portal.service";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailsComponent implements OnInit {
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
  userId: any;
  userRole: any;
  userType: any;
  innerMenuPremission:any=[];
  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private patientservice: PatientService,
    private fourPortalService: FourPortalService
  ) {

    let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.portal_user_id = adminData.creatorId;

    }else{
      this.portal_user_id = userData._id;

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
    let userPermission = this.coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log("checkData________",checkData);
    
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("order-request")) {
          this.innerMenuPremission = checkSubmenu['order-request'].inner_menu;
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
    }  
  }

  giveInnerPermission(value) {
    if (this.userRole === 'STAFF' || this.userRole === 'HOSPITAL_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  getOrderDetails() {
    console.log('getOrderDetails');
    
    let reqData = {
      for_order_id: this.order_id,
      for_portal_user: this.portal_user_id,
      portal_type:this.userType
    };
    this.patientservice.fetchOrderDetailsallPortal(reqData).subscribe((res) => {
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
      portal_type: this.userType,
      portal_user_id:this.portal_user_id
    };
    this.fourPortalService.verifyInsuaranceallPortal(reqData).subscribe((res) => {
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
    this.router.navigate([`/portals/order-request/${this.userType}/new-order-details`], {
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
    const orderRequest = {
      _id: this.order_id,
      status: "rejected",
      cancelled_by: this.userType,
      for_portal_user: this.portal_user_id,
      portal_type:this.userType
    };
    this.fourPortalService.cancelOrderFourPortal(orderRequest).subscribe({
      next: (result1) => {
        let encryptedData = { data: result1 };
        let result = this.coreService.decryptObjectData(encryptedData);
        
        if (result.status === true) {
          this.coreService.showSuccess("", result.message);
         this.goBack();
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


  goBack(){
    this.modalService.dismissAll();
    this.router.navigate([`/portals/order-request/${this.userType}`])
  }
}
