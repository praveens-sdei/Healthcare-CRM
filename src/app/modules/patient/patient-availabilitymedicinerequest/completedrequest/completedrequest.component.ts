import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';
import { IDocumentMetaDataResponse, IMedicineUpdateResponse, IOrderCancelResponse, IOrderConfimRequest, IOrderDetailsRequest, IOrderDetailsResponse, IOrderUpdateRequest, ISignedUrlRequest } from '../../patient-prescriptionorder/neworder/neworder.type';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';

@Component({
  selector: 'app-completedrequest',
  templateUrl: './completedrequest.component.html',
  styleUrls: ['./completedrequest.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CompletedrequestComponent implements OnInit {
  pharmacy_id: string = "";
  order_id: string = "";
  patient_details: any;
  insuranceDetails: any
  health_plan_details: any;
  orderDetails: IOrderDetailsResponse = null;
  displayedColumns: string[] = ['medicinename', 'packorunit', 'frequency', 'duration','available'];
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
  profileData: any;
  pharmacyProfile: any;
  subscriber_id: any;

  constructor(
    private modalService: NgbModal,
    private patientService: PatientService,
    private coreService: CoreService,
    private pharmacyService: PharmacyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.pharmacy_id = params["pharmacyId"];
      this.getOrderDetails();
    });
  }
// 
  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const patientID = this.orderDetails.orderData.patient_details.user_id
    this.pharmacyService.patientProfile(patientID, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
        // this.checkInsuranceExpiry()
      }
    });
  }

  // checkInsuranceExpiry() {
  //   let reqData = {
  //     insurance_id:
  //       this.patient_details?.in_insurance?.primary_insured?.insurance_id,
  //     policy_id: this.patient_details?.in_insurance?.primary_insured?.policy_id,
  //     card_id: this.patient_details?.in_insurance?.primary_insured?.card_id,
  //     employee_id:
  //       this.patient_details?.in_insurance?.primary_insured?.employee_id,
  //   };
  //   this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
  //     let response = this.coreService.decryptObjectData({ data: res });
  //     this.insuranceDetails = response.body;
  //   });
  // }
  public getOrderDetails(): void {
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user: this.pharmacy_id,
      for_order_id: this.order_id,
    };
    this.patientService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IOrderDetailsResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..",result);
          this.profileData=result?.data?.pharmacyDetails
          this.pharmacyProfile=result?.data
          this.subscriber_id = result?.data?.orderData?.subscriber_id

          this.orderDetails = result.data;
          this.getPatientDetails()
          if (this.orderDetails.medicineBill.prescription_url) {
            // this.documentMetaDataURL();
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

  documentMetaDataURL(): void {
    const docRequest: IUniqueId = {
      id: this.orderDetails.medicineBill.prescription_url,
    };
    this.patientService.getDocumentMetadata(docRequest).subscribe({
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
    this.patientService.signedUrl(docRequest).subscribe({
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
    this.router.navigate(['/patient/medicinerequest']);
  }

  cancelOrder() {
    const orderRequest: IOrderConfimRequest = {
      _id: this.orderDetails.orderData._id,
      status: "cancelled",
      cancelled_by: "patient",
      for_portal_user: this.pharmacy_id
    };
    this.patientService.cancelOrderDetails(orderRequest).subscribe({
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