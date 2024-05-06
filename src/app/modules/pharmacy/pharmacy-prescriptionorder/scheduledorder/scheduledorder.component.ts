import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyService } from '../../pharmacy.service';
import { IDocumentMetaDataResponse, IMedicineUpdateResponse, IOrderCancelResponse, IOrderConfimRequest, IOrderDetailsRequest, IOrderDetailsResponse, IOrderUpdateRequest, ISignedUrlRequest } from '../neworder/neworder.type';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-scheduledorder',
  templateUrl: './scheduledorder.component.html',
  styleUrls: ['./scheduledorder.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ScheduledorderComponent implements OnInit {
  @ViewChild("approved") approved: any;

  order_id: string = "";
  orderDetails: IOrderDetailsResponse = null;
  health_plan_details: any;
  patient_details: any;
  patient_id: any;
  insuranceDetails: any;
  medicineIDObject: any = {}
  medicineNameObject: any = {}
  exludeMedicineAmount: any = {}
  newMedicineArray: any = {}
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
  public orderMedicine = {
    medicine_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: any = [];
  prescriptionSignedUrl: string = "";
  availableMedicineList: string[] = [];
  subscriberdetails: any;
  subscriber_id: any;
  confirmOrder: any;
  userPermission: any;
  userRole: string;
  portal_user_id: any;
  innerMenuPremission: any =[];

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: NgxUiLoaderService

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
        // this.setData()
        this.checkInsuranceExpiry();
        // this.getPortalTypeAndInsuranceId();

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
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user:  this.portal_user_id,
      for_order_id: this.order_id,
    };
    
    this.pharmacyService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IOrderDetailsResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.orderDetails = result.data;
    console.log("------------------------------------",this.orderDetails);
this.confirmOrder= result?.data?.orderData?.order_schedule_confirm


          this.patient_id = result?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails(result.data.orderData.patient_details.user_id)
          this.subscriber_id = result?.data?.orderData?.subscriber_id
          if (this.orderDetails.medicineBill.prescription_url) {
            // this.documentMetaDataURL();
            this.prescriptionSignedUrl=this.orderDetails.medicineBill.prescription_url;

          }
          result.data.medicineDetails.forEach((element) => {
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
            this.availableMedicineList.push(available);
            (this.orderMedicine.medicine_details).push(
              newRow
            );
          });
          this.orderMedicine["total_cost"] = result.data.medicineBill.total_medicine_cost || "";
          this.orderMedicine["copay"] = result.data.medicineBill.co_pay || "";
          this.orderMedicine["insurance_paid"] = result.data.medicineBill.insurance_paid || "";
          this.dataSource = new MatTableDataSource(
            (this.orderMedicine["medicine_details"])
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
  medicineAvailabilityChange(e: { value: string }, i: number) {
    this.availableMedicineList[i] = e.value;
  }

  public updateOrderData(): void {
    this.loader.start();
    const orderDetailRequest: IOrderUpdateRequest = {
      for_portal_user:  this.portal_user_id,
      for_order_id: this.order_id,
      in_medicine_bill: this.orderDetails.medicineBill._id,
      medicine_bill: {
        co_pay: this.orderMedicine["copay"],
        total_medicine_cost: this.orderMedicine["total_cost"],
        insurance_paid: this.orderMedicine["insurance_paid"],
      },
      medicine_details: this.orderMedicine["medicine_details"].map((data) => ({
        name: data.name,
        medicine_id: null,
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
      status: "completed"
    };
    this.pharmacyService.updateOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IMedicineUpdateResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Updated order details successfully");
        if (result.status === true) {
          this.loader.stop();

          console.log("result",result);
          
          this.gotoOrderList();
          this.openVerticallyCenteredapproved(this.approved);
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();

        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  documentMetaDataURL(): void {
    const docRequest: IUniqueId = {
      id: this.orderDetails.medicineBill.prescription_url,
    };
    this.pharmacyService.getDocumentMetadata(docRequest).subscribe({
      next: (result1: IResponse<IDocumentMetaDataResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.prescriptionUrl = result.data.url;
          this.generateSignedUrl();
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

  generateSignedUrl() {
    const docRequest: ISignedUrlRequest = {
      url: this.prescriptionUrl,
    };
    this.pharmacyService.signedUrl(docRequest).subscribe({
      next: (result1: IResponse<string>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.prescriptionSignedUrl = result.data;
        }
      },
      error: (err: ErrorEvent) => {
        // this.coreService.showError("", err.message);
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
      if (Object.values(this.exludeMedicineAmount).length > 0) {
        const array = Object.values(this.exludeMedicineAmount)
        const sum: any = array.reduce((acc: any, cur: any) => acc + Number(cur), 0);
        excludedAmount = sum
        totalAmount = taget.value - sum;
      } else {
        totalAmount = taget.value
      }
      const calculateInsuranceAmount =  totalAmount * reimbusment_rate / 100
      this.orderMedicine['copay'] = (excludedAmount + totalAmount - calculateInsuranceAmount).toString()
      this.orderMedicine['insurance_paid'] = calculateInsuranceAmount.toString()
    } else {
      this.orderMedicine['copay'] = taget.value
      this.orderMedicine['insurance_paid'] = "0"
    }
  }

  gotoOrderList() {
    this.router.navigate(['/pharmacy/presciptionorder']);
  }

  cancelOrder() {
    this.loader.start();
    const orderRequest: IOrderConfimRequest = {
      _id: this.orderDetails.orderData._id,
      status: "rejected",
      cancelled_by: "pharmacy",
      for_portal_user:  this.portal_user_id
    };
    this.pharmacyService.cancelOrderDetails(orderRequest).subscribe({
      next: (result1: IResponse<IOrderCancelResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "order details confirmed successfully");
        if (result.status === true) {
          this.loader.stop();

          this.gotoOrderList();
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();

        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

}
