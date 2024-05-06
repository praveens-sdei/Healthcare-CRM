import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyService } from '../../pharmacy.service';
import { IDocumentMetaDataResponse, IMedicineUpdateResponse, IOrderCancelResponse, IOrderConfimRequest, IOrderDetailsRequest, IOrderDetailsResponse, IOrderUpdateRequest, ISignedUrlRequest } from '../neworder/neworder.type';

@Component({
  selector: 'app-scheduledorderrequest',
  templateUrl: './scheduledorderrequest.component.html',
  styleUrls: ['./scheduledorderrequest.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ScheduledorderrequestComponent implements OnInit {

  order_id: string = "";
  patient_details: any;
  length: number = 0;
  patient_id: any
  paymentDetails: any = {}
  orderDetails: IOrderDetailsResponse = null;
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
  prescriptionUrl: Array<string> = [];
  prescriptionSignedUrl: string = "";
  availableMedicineList: string[] = [];
  userPermission: any;
  userRole: string;
  portal_user_id: any;
  innerMenuPremission: any =[];
  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute
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

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    this.pharmacyService.patientProfile(this.patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        console.log(response.body, 'response');
        this.patient_details = response?.body.profileData;
        // this.health_plan_details = response?.body.health_plan_details;
        // this.checkInsuranceExpiry();
      }
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user: sessionStorage.getItem("portal-user-id"),
      for_order_id: this.order_id,
    };
    this.pharmacyService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IOrderDetailsResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.orderDetails = result.data;
          this.patient_id = result?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails();
          if (result.data.orderData.payment_type === 'pre') {
            this.getPaymentDetails(this.order_id, result.data.orderData.patient_details.user_id)
          }
          if (this.orderDetails.medicineBill.prescription_url) {
            this.documentMetaDataURL();
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

  medicineAvailabilityChange(e: { value: string }, i: number) {
    this.availableMedicineList[i] = e.value;
  }

  public updateOrderData(): void {
    const orderDetailRequest: IOrderUpdateRequest = {
      for_portal_user: sessionStorage.getItem("portal-user-id"),
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
        if (result.status === true) {
          this.coreService.showSuccess("", "Order completed successfully");
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

  public getDateAndTime(date:any){
    console.log(date);
    date = new Date(date)
    const newDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} | ${date.getHours()}:${date.getMinutes()}`
    return newDate
    
  }

  private getPaymentDetails(order_id: string, patient_id:string) {
    this.pharmacyService.getPaymentDetails(patient_id, order_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response, 'payment details');
      if (response.status) {
        this.paymentDetails = response?.body[0];
        this.length = 1
      }
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

  gotoOrderList() {
    this.router.navigate(['/pharmacy/presciptionorder']);
  }

  cancelOrder() {
    const orderRequest: IOrderConfimRequest = {
      _id: this.orderDetails.orderData._id,
      status: "rejected",
      cancelled_by: "pharmacy",
      for_portal_user: sessionStorage.getItem("portal-user-id")
    };
    this.pharmacyService.cancelOrderDetails(orderRequest).subscribe({
      next: (result1: IResponse<IOrderCancelResponse>) => {
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
