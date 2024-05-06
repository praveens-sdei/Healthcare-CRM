import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyService } from '../../pharmacy.service';
import { IDocumentMetaDataResponse, IMedicineUpdateResponse, IOrderCancelResponse, IOrderConfimRequest, IOrderDetailsRequest, IOrderDetailsResponse, IOrderUpdateRequest, ISignedUrlRequest } from '../../pharmacy-prescriptionorder/neworder/neworder.type';

@Component({
  selector: 'app-completedrequest',
  templateUrl: './completedrequest.component.html',
  styleUrls: ['./completedrequest.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CompletedrequestComponent implements OnInit {

  order_id: string = "";
  patient_details: any;
  orderDetails: IOrderDetailsResponse = null;
  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "available"
  ];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderMedicine = {
    medicine_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  availableMedicineList: string[] = [];
  userRole: any;
  userPermission: any;
  userId: any;

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let userData = this.coreService.getLocalStorage('loginData')
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = userData?.role;
    this.userPermission =userData.permissions;

    if(this.userRole === "PHARMACY_STAFF"){
      this.userId = adminData?.for_staff;
    }else{
      this.userId = userData?._id;
    }
  }

  ngOnInit(): void {
    console.log(this.userId,"userCheck________________",this.userRole);
    
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.getOrderDetails();
    });
  }

  getPatientDetails(patient_id: string) {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    this.pharmacyService.patientProfile(patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
      }
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user:  this.userId,
      for_order_id: this.order_id,
    };
    this.pharmacyService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IOrderDetailsResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          console.log(">>>>>>>>>>>77",result);
          
          this.orderDetails = result.data;
          this.getPatientDetails(result.data.orderData.patient_details.user_id)
          if (this.orderDetails.medicineBill.prescription_url.length !==0) {

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
    this.router.navigate(['/pharmacy/medicinerequest']);
  }

  cancelOrder() {
    const orderRequest: IOrderConfimRequest = {
      _id: this.orderDetails.orderData._id,
      status: "rejected",
      cancelled_by: "pharmacy",
      for_portal_user:  this.userId
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