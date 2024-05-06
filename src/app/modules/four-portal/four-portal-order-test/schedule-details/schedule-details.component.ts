import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { FourPortalService } from '../../four-portal.service';
import { PatientService } from 'src/app/modules/patient/patient.service';

@Component({
  selector: 'app-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ScheduleDetailsComponent implements OnInit {
  @ViewChild("approved") approved: any;

  order_id: string = "";
  orderDetails = null;
  health_plan_details: any;
  patient_details: any;
  patient_id: any;
  insuranceDetails: any; 
  exludeTestAmount: any = {}
  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "totalcost",
    "available"
  ];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderTest = {
    test_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: any = [];
  prescriptionSignedUrl: string = "";
  availableTestList: string[] = [];
  subscriberdetails: any;
  subscriber_id: any;
  confirmOrder: any;
  userId: any;
  userRole: any;
  userType: any;
  innerMenuPremission:any=[];

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private patientService: PatientService
  ) {

    let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.userId = adminData.creatorId;

    }else{
      this.userId = userData._id;

    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.getOrderDetails();
    });
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

  getPatientDetails(patient_id: string) {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const subscriber_id = this.orderDetails.orderData.subscriber_id

    this.pharmacyService.patientProfile(patient_id, insuranceNo,subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
        this.subscriberdetails = response?.body.health_plan_details?.resultData;
        console.log(this.subscriberdetails,"subscriberdetails");
        console.log(this.health_plan_details,"health_plan_details");
        console.log(this.patient_details,"patient_details");
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
        subscriber_id:
        this.orderDetails?.orderData?.subscriber_id
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.insuranceDetails = response.body;
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      portal_type: this.userType
    };
    
    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.orderDetails = result.data;
    console.log("------------------------------------",this.orderDetails);
this.confirmOrder= result?.data?.orderData?.order_schedule_confirm


          this.patient_id = result?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails(result.data.orderData.patient_details.user_id)
          this.subscriber_id = result?.data?.orderData?.subscriber_id
          if (this.orderDetails.testBill.prescription_url) {
            // this.documentMetaDataURL();
            this.prescriptionSignedUrl=this.orderDetails.testBill.prescription_url;

          }
          result.data.testDetails.forEach((element) => {
            const available = element.available ? "yes" : "no";
            const newRow = {
              name: element.name,
              prescribed: element.quantity_data.prescribed,
              delivered: 
                element.quantity_data.delivered || "",
              frequency: element.frequency,
              duration: element.duration,
              priceperunit: element.price_per_unit || "",
              totalcost: element.total_cost || "",
              available
            };
            this.availableTestList.push(available);
            (this.orderTest.test_details).push(
              newRow
            );
          });
          this.orderTest["total_cost"] = result.data.testBill.total_test_cost || "";
          this.orderTest["copay"] = result.data.testBill.co_pay || "";
          this.orderTest["insurance_paid"] = result.data.testBill.insurance_paid || "";
          this.dataSource = new MatTableDataSource(
            (this.orderTest["test_details"])
          );
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
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }
  testAvailabilityChange(e: { value: string }, i: number) {
    this.availableTestList[i] = e.value;
  }

  public updateOrderData(): void {
    const orderDetailRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      in_ordertest_bill: this.orderDetails.testBill._id,
      test_bill: {
        co_pay: this.orderTest["copay"],
        total_test_cost: this.orderTest["total_cost"],
        insurance_paid: this.orderTest["insurance_paid"],
      },
      test_details: this.orderTest["test_details"].map((data) => ({
        name: data.name,
        test_id: null,
        quantity_data: {
          prescribed: data.prescribed,
          delivered: data.delivered,
        },
        frequency: data.frequency,
        duration: data.duration,
        price_per_unit: data.priceperunit,
        total_cost: data.totalcost,
        available: data.available === "yes",
      })),
      request_type: this.orderDetails.orderData.request_type,
      status: "completed",
      portal_type:this.userType
    };
    this.fourPortalService.updateOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Updated order details successfully");
        if (result.status === true) {
          console.log("result",result);
          
          this.gotoOrderList();
          this.openVerticallyCenteredapproved(this.approved);
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
  

   //Calculate medicine cost based on medicines and insurance
   calculateCost(taget: any) {
    if (this.health_plan_details) {
      let reimbusment_rate = 0
      for (const planService of this.health_plan_details.planService) {
        if(planService?.has_category?.in_category.name ==="Medical Product" && (planService?.has_category.name ==="Classical Medicine" || planService?.has_category.name ==="Medicine")){
          reimbusment_rate = planService.reimbursment_rate;
        }
      }
      let totalAmount = 0
      let excludedAmount = 0
      if (Object.values(this.exludeTestAmount).length > 0) {
        const array = Object.values(this.exludeTestAmount)
        const sum: any = array.reduce((acc: any, cur: any) => acc + Number(cur), 0);
        excludedAmount = sum
        totalAmount = taget.value - sum;
      } else {
        totalAmount = taget.value
      }
      const calculateInsuranceAmount =  totalAmount * reimbusment_rate / 100
      this.orderTest['copay'] = (excludedAmount + totalAmount - calculateInsuranceAmount).toString()
      this.orderTest['insurance_paid'] = calculateInsuranceAmount.toString()
    } else {
      this.orderTest['copay'] = taget.value
      this.orderTest['insurance_paid'] = "0"
    }
  }

  gotoOrderList() {
    this.router.navigate([`/portals/order-request/${this.userType}`]);
  }

  cancelOrder() {
    const orderRequest = {
      _id: this.orderDetails.orderData._id,
      status: "rejected",
      cancelled_by: this.userType,
      for_portal_user: this.userId,
      portal_type:this.userType
    };
    this.fourPortalService.cancelOrderFourPortal(orderRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "order details confirmed successfully");
        if (result.status === true) {
          this.gotoOrderList();
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

