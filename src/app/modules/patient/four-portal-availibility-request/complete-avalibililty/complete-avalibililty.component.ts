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
  selector: 'app-complete-avalibililty',
  templateUrl: './complete-avalibililty.component.html',
  styleUrls: ['./complete-avalibililty.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CompleteAvalibililtyComponent implements OnInit {
  pharmacy_id: string = "";
  order_id: string = "";
  patient_details: any;
  insuranceDetails: any
  health_plan_details: any;
  orderDetails = null;
  displayedColumns: string[] = ['medicinename', 'packorunit', 'frequency', 'duration','available'];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderTest = {
    test_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  availableTestList: string[] = [];
  profileData: any;
  portalProfile: any;
  subscriber_id: any;
  portal_id: any;
  portal_type: any;

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
      this.portal_id = params["portal_id"];
      this.portal_type = params["portal_type"]
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
      }
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.portal_id,
      for_order_id: this.order_id,
      portal_type : this.portal_type
    };
    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..",result);
          this.profileData=result?.data?.portal_Details
          this.portalProfile=result?.data?.portal_Profile
          this.subscriber_id = result?.data?.orderData?.subscriber_id

          this.orderDetails = result.data;
          this.getPatientDetails()
          if (this.orderDetails.testBill.prescription_url) {
            // this.documentMetaDataURL();
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
      
      },
    });
  }

  medicineAvailabilityChange(e: { value: string }, i: number) {
    this.availableTestList[i] = e.value;
  }

 


  gotoOrderList() {
    if(this.portal_type === "Paramedical-Professions"){
      this.router.navigate(['/patient/paramedical-profession-availability']);
    } else if(this.portal_type === "Dental"){
      this.router.navigate(['/patient/dental-availability']);

    } else if(this.portal_type === "Optical"){
      this.router.navigate(['/patient/optical-availability']);

    } else if(this.portal_type === "Laboratory-Imaging"){
      this.router.navigate(['/patient/lab-imaging-availability']);

    }
  }



}