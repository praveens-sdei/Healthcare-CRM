import { Component, OnInit,ViewChild,ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { IUniqueId } from "src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { PatientService } from "../../patient.service";
import {
  IDocumentMetaDataResponse,
  IMedicineUpdateResponse,
  IOrderDetailsRequest,
  IOrderDetailsResponse,
  IOrderUpdateRequest,
  ISignedUrlRequest,
} from "../../patient-prescriptionorder/neworder/neworder.type";
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';

@Component({
  selector: 'app-newavailability',
  templateUrl: './newavailability.component.html',
  styleUrls: ['./newavailability.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class NewavailabilityComponent implements OnInit {
  pharmacy_id: string = "";
  order_id: string = "";
  orderDetails: IOrderDetailsResponse = null;
  displayedColumns: string[] = ['medicinename', 'packorunit', 'frequency', 'duration'];
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
  subscriber_id:any='';
  patient_details: any;
  health_plan_details: any;
  insuranceDetails: any
  subscriberdetails: any;
  profileData: any;
  pharmacyProfile: any;
  constructor(
    private modalService: NgbModal,
    private patientService: PatientService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private pharmacyService: PharmacyService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.pharmacy_id = params["pharmacyId"];
      this.getOrderDetails();
    });
  }

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const patientID = this.orderDetails.orderData.patient_details.user_id
    this.pharmacyService.patientProfile(patientID, null,this.subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        console.log(">.......", this.patient_details);
        
        this.subscriberdetails = response?.body.health_plan_details?.resultData;
        if(this.subscriber_id!=null)
        {
        this.checkInsuranceExpiry()
        }
      }
    });
  }

  downloadPrescription() {
    console.log(" this.prescriptionSignedUrl", this.prescriptionSignedUrl);
    
    for (const url of this.prescriptionSignedUrl) {
      window.open(url, '_blank')
    }
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

  public getOrderDetails(): void {
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user: this.pharmacy_id,
      for_order_id: this.order_id,
    };
    console.log(orderDetailRequest,"----------orderDetailRequest");
    
    this.patientService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IOrderDetailsResponse>) => {
        // this.coreService.showSuccess("", "Fetched order details successfully");
        let result = this.coreService.decryptObjectData({ data: result1 });

        if (result.status === true) {
          this.orderDetails = result.data;
          this.profileData=result?.data?.pharmacyDetails
          this.pharmacyProfile=result?.data

          this.subscriber_id = result?.data?.orderData?.subscriber_id
          this.getPatientDetails()

          if (this.orderDetails.medicineBill.prescription_url) {
            this.prescriptionSignedUrl=this.orderDetails.medicineBill.prescription_url;
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
            (this.orderMedicine["medicine_details"]).push(
              newRow
            );
          });
          this.orderMedicine
            ["total_cost"]
            = (result.data.medicineBill.total_medicine_cost || "");
          this.orderMedicine
            ["copay"]
            = (result.data.medicineBill.co_pay || "");
          this.orderMedicine
            ["insurance_paid"]
            = (result.data.medicineBill.insurance_paid || "");
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
      next: (result: IResponse<IDocumentMetaDataResponse>) => {
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
      next: (result: IResponse<string>) => {
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          console.log("result>>>>>>>>>>>>>",result);
          
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
}
