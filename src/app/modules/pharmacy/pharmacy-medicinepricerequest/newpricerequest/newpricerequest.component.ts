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
import { PharmacyService } from "../../pharmacy.service";
import {
  IDocumentMetaDataResponse,
  IMedicineUpdateResponse,
  IOrderCancelResponse,
  IOrderConfimRequest,
  IOrderDetailsRequest,
  IOrderDetailsResponse,
  IOrderUpdateRequest,
  ISignedUrlRequest,
} from "../../pharmacy-prescriptionorder/neworder/neworder.type";
import { map, Observable, startWith } from 'rxjs';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from 'src/app/modules/patient/patient.service';

@Component({
  selector: 'app-newpricerequest',
  templateUrl: './newpricerequest.component.html',
  styleUrls: ['./newpricerequest.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class NewpricerequestComponent implements OnInit {
  order_id: string = "";
  orderDetails: IOrderDetailsResponse = null;
  patient_details: any;
  health_plan_details: any
  portal_user_id: any;
  patient_id: any;

  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "totalcost",
    "available",
    "action",
  ];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderMedicine: FormGroup = new FormGroup({
    medicine_details: new FormArray([], []),
    total_cost: new FormControl("", []),
    copay: new FormControl("", []),
    insurance_paid: new FormControl("", []),
  });
  prescriptionUrl: Array<string> = [];
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl('');
  medicineList: any = [];
  medicineName: string = "";
  prescriptionSignedUrl: string = "";
  medicineIDObject: any = {}
  medicineNameObject: any = {}
  exludeMedicineAmount: any = {}
  newMedicineArray: any = {}
  availableMedicineList: string[] = [];
  @ViewChild("approved") approved: any;
  insuranceDetails: any;

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private patientService: PatientService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _superAdminService: SuperAdminService
  ) {
    
  }

  ngOnInit(): void {
    // this.addNewMedicine()
    //Start medicine filter
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    //end medicine filter
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
    });
    let portalUser = this.coreService.getLocalStorage("loginData");
    this.portal_user_id = portalUser._id;
    this.getMedicineList();
    this.getOrderDetails();
  }

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    this.pharmacyService.patientProfile(this.patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
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
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response, 'response');
      
      this.insuranceDetails = response.body;
    });
  }
  // patient_id(patient_id: any) {
  //   throw new Error("Method not implemented.");
  // }

  private getOrderField(...field: string[]) {
    return this.orderMedicine.get(field).value;
  }

  get medicineData(): FormArray {
    return this.orderMedicine.get("medicine_details") as FormArray;
  }

  private getMedicineList() {
    this.patientService.getmedicineList().subscribe(
      (res) => {
        console.log("res-----------------------------------------",res);
        let result = this.coreService.decryptObjectData({ data: res });

        // let result = this.coreService.decryptContext({data:res});
        console.log("152",result);
        
        const medicineArray = []
        for (const medicine of result.body.medicneArray) {
          
          medicineArray.push({
            medicine_name: medicine.medicine_name,
            medicine_number: medicine.number,
            medicine_id: medicine._id
          })
        }
        this.medicineList = medicineArray;
      },
      (err: ErrorEvent) => {
        console.log(err.message, 'error');
      }
    );
  }

  //Start medicine filter
  private  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    if(this.medicineList.length>0) {
      var result=this.medicineList
        .filter((option:any) => { 
          return (
            option.medicine_name.toLowerCase().includes(filterValue)
          )
        })
        return (result!='') ? result: ['No data'];
    }
    return ['No data'];

  }
  // End medicine filter
  public updateMySelection(option: any, i: any) {
    this.medicineIDObject[i] = option.medicine_id
    this.medicineNameObject[i] = option.medicine_name
  }
  //Add new medcine for the superadmin
  public handleAddMedicineClick(idx: any) {
    this.newMedicineArray[idx] = this.medicineName
    this.medicineNameObject[idx] = this.medicineName
    this.medicineList.push({medicine_name: this.medicineName})
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    const value = this.getOrderField("medicine_details")[idx].totalcost
    if (this.health_plan_details) {
      if (value) {
        this.handleMedicineExclusionCost({value}, idx)
      } else {
        this.handleMedicineExclusionCost({value: 0}, idx)
      }
    }
    if (this.orderMedicine.get("total_cost").value) {
      this.calculateCost({value: this.orderMedicine.get("total_cost").value})
    }
  }

  public clearText(){
    this.medicineName = ''
  }

  public handleMedicineChange(target: any, index: any): void {
    if (target.value) {
      this.medicineName = target.value
      const value = this.getOrderField("medicine_details")[index].totalcost
      if (value && this.health_plan_details) {
        this.handleMedicineExclusionCost({value}, index)
      }
    } else {
      this.newMedicineArray = []
      this.medicineIDObject = {}
    }
  }

  addNewMedicine() {
    const newRow: FormGroup = new FormGroup({
      name: new FormControl("", []),
      prescribed: new FormControl("", []),
      delivered: new FormControl("", []),
      frequency: new FormControl("", []),
      duration: new FormControl("", []),
      priceperunit: new FormControl("", []),
      totalcost: new FormControl("", []),
      available: new FormControl("no", []),
      action: new FormControl("", []),
    });
    (this.orderMedicine.get("medicine_details") as FormArray).push(newRow);
    this.availableMedicineList.push("no");
    this.dataSource = new MatTableDataSource(
      (this.orderMedicine.get("medicine_details") as FormArray).controls
    );
  }

  removemedicine(index: number) {
    (this.orderMedicine.get("medicine_details") as FormArray).removeAt(index);
    this.availableMedicineList.splice(index, 1);
    this.dataSource = new MatTableDataSource(
      (this.orderMedicine.get("medicine_details") as FormArray).controls
    );
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

  public getOrderDetails(): void {
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user: this.portal_user_id,
      for_order_id: this.order_id,
    };
    this.pharmacyService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result: IResponse<IOrderDetailsResponse>) => {
        let response = this.coreService.decryptObjectData({ data: result });
console.log(">>>>response286",response);

        if (response.status === true) {
          this.orderDetails = response.data;
          this.patient_id = response?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails();
          if (this.orderDetails.medicineBill.prescription_url) {
            this.documentMetaDataURL();
          }
          console.log(response.data.medicineDetails, 'response.data.medicineDetails');
          if (response.data.medicineDetails.length > 0) {
            response.data.medicineDetails.forEach((element) => {
              const available = element.available ? "yes" : "no";
              const newRow: FormGroup = new FormGroup({
                name: new FormControl(element.name, []),
                prescribed: new FormControl(element.quantity_data.prescribed, []),
                delivered: new FormControl(
                  element.quantity_data.delivered || "",
                  []
                ),
                frequency: new FormControl(element.frequency, []),
                duration: new FormControl(element.duration, []),
                priceperunit: new FormControl(element.price_per_unit || "", []),
                totalcost: new FormControl(element.total_cost || "", []),
                available: new FormControl(available, []),
                action: new FormControl("", []),
              });
              this.availableMedicineList.push(available);
              (this.orderMedicine.get("medicine_details") as FormArray).push(
                newRow
              );
            });
          } else {
            this.addNewMedicine()
          }
          this.orderMedicine
            .get("total_cost")
            .setValue(response.data.medicineBill.total_medicine_cost || "");
          this.orderMedicine
            .get("copay")
            .setValue(response.data.medicineBill.co_pay || "");
          this.orderMedicine
            .get("insurance_paid")
            .setValue(response.data.medicineBill.insurance_paid || "");
          if (response.data.medicineDetails.length === 0) {
            this.addNewMedicine();
          }
          this.dataSource = new MatTableDataSource(
            (this.orderMedicine.get("medicine_details") as FormArray).controls
          );
          this.dataSource.filterPredicate = (
            data: FormGroup,
            filter: string
          ) => {
            return Object.values(data.controls).some((x) => x.value == filter);
          };
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

  private addMedicineForSuperadmin() {
    return new Promise((resolve, reject) => {
      const medicineArray = []
      for (const medicine of Object.values(this.newMedicineArray)) {
        medicineArray.push({
          medicine: {
            number:"",
            medicine_name:medicine,
            inn: "",
            dosage:"",
            pharmaceutical_formulation:"",
            administration_route:"",
            therapeutic_class:"",
            manufacturer:"",
            condition_of_prescription:"",
            other:"",
            link:"",
            status: false
          }
        })
      }
      if (medicineArray.length > 0) {
        const reqData = {
          medicines: medicineArray,
          isNew: true,
          userId: this.portal_user_id
        }
        this._superAdminService.addMedicine(reqData).subscribe((res: any) => {
          let response = this.coreService.decryptObjectData({data:res});
          if (response.status) {
            for (const med of response.body.result) {
              let index = this.coreService.getKeyByValue(this.newMedicineArray, med.medicine.medicine_name)
              this.medicineIDObject[index] = med._id
            }
            resolve(true)
          } else {
            this.toastr.error("Somthing went wrong while adding medicine");
            resolve(false)
          }
        });
      }
      
    })
  }

  async updateOrderData() {
    if (Object.values(this.newMedicineArray).length > 0) {
      const addmed = await this.addMedicineForSuperadmin()
    }
    if ( Object.values(this.medicineIDObject).length <= 0 || !this.getOrderField("medicine_details")[0].delivered || !this.getOrderField("medicine_details")[0].totalcost) {
      this.coreService.showError("", 'Please add at least one medicine');
      return
    }
    const orderDetailRequest: IOrderUpdateRequest = {
      for_portal_user: sessionStorage.getItem("portal-user-id"),
      for_order_id: this.order_id,
      in_medicine_bill: this.orderDetails.medicineBill._id,
      medicine_bill: {
        co_pay: this.getOrderField("copay"),
        total_medicine_cost: this.getOrderField("total_cost"),
        insurance_paid: this.getOrderField("insurance_paid"),
      },
      medicine_details: this.getOrderField("medicine_details").map((data, index) => ({
       
        
        name: this.medicineNameObject[index],
        medicine_id: this.medicineIDObject[index],
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
    };
    console.log(orderDetailRequest, 'orderDetailRequest');
    

    this.pharmacyService.updateOrderDetails(orderDetailRequest).subscribe({
      next: (result: IResponse<IMedicineUpdateResponse>) => {
        let encryptedData = { data: result };
        let result1 = this.coreService.decryptObjectData(encryptedData);
        // this.coreService.showSuccess("", "Updated order details successfully");
        if (result1.status === true) {
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

  downloadPrescription() {
    for (const url of this.prescriptionSignedUrl) {
      window.open(url, '_blank')
    }
  }

  documentMetaDataURL(): void {
    const docRequest: IUniqueId = {
      id: this.orderDetails.medicineBill.prescription_url,
    };
    this.pharmacyService.getDocumentMetadata(docRequest).subscribe({
      next: (result1: IResponse<IDocumentMetaDataResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        console.log(result, 'result');
        // this.coreService.showSuccess("", "Fetched order details successfully");
        const urlArray = []
        if (result.status === true) {
          for (const url of result.data) {
            urlArray.push(url.url);
          }
          this.prescriptionUrl = urlArray;
          this.generateSignedUrl();
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

  handleMedicineExclusionCost(target: any, index: number): void {
    const medicineName = this.medicineNameObject[index]
    if (this.health_plan_details) {
      for (const exclusion of this.health_plan_details.planExclusion) {
        if (medicineName == exclusion.in_exclusion.exclusion_inn) {
          this.exludeMedicineAmount[index] = target.value
        } else {
          delete this.exludeMedicineAmount[index]
        }
      }
    }
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
      console.log("CALCULATEINSURANCE",calculateInsuranceAmount);
      
      this.orderMedicine.controls['copay'].setValue(excludedAmount + totalAmount - calculateInsuranceAmount)
      this.orderMedicine.controls['insurance_paid'].setValue(calculateInsuranceAmount)
    } else {
      this.orderMedicine.controls['copay'].setValue(taget.value)
      this.orderMedicine.controls['insurance_paid'].setValue(0)
    }
    this.orderMedicine.controls['copay'].disable();
    this.orderMedicine.controls['insurance_paid'].disable();
  }

  gotoOrderList() {
    this.modalService.dismissAll("close");
    this.router.navigate(["/pharmacy/medicinepricerequest"]);
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