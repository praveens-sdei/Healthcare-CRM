import { SubscribersdetailComponent } from "./../../../insurance/insurance-subscribers/subscribersdetail/subscribersdetail.component";
import { PharmacyPlanService } from "./../../pharmacy-plan.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { map, Observable, startWith } from "rxjs";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { MatStepper } from "@angular/material/stepper";

export interface PeriodicElement {
  medicinename: string;
  quantityprescribed: string;
  quantitydelivered: string;
  frequency: string;
  duration: string;
  priceperunit: string;
  copayment: string;
  requestamount: string;
  totalcost: string;
  comment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    medicinename: "",
    quantityprescribed: "",
    quantitydelivered: "",
    frequency: "",
    duration: "",
    priceperunit: "",
    copayment: "",
    requestamount: "",
    totalcost: "",
    comment: "",
  },
];

// Prescription Table

export interface PrescriptionPeriodicElement {
  medicinename: string;
  quantityprescribed: string;
  quantitydelivered: string;
  frequency: string;
  duration: string;
  priceperunit: string;
  copayment: string;
  requestamount: string;
  totalcost: string;
  comment: string;
}

const PRESCRIPTION_ELEMENT_DATA: PrescriptionPeriodicElement[] = [
  {
    medicinename: "Vitamin C",
    quantityprescribed: "3 Pack",
    quantitydelivered: "3 Pack",
    frequency: "Morning 2, MidDay 2",
    duration: "3",
    priceperunit: "15,000 CFA",
    copayment: "12 000 CFA",
    requestamount: "12 000 CFA",
    totalcost: "15 000 CFA",
    comment: "test",
  },
];

@Component({
  selector: 'app-servicetype-preauth',
  templateUrl: './servicetype-preauth.component.html',
  styleUrls: ['./servicetype-preauth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicetypePreauthComponent implements OnInit {

  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "copayment",
    "requestamount",
    "totalcost",
    "comment",
    "action",
  ];
  dataSource: MatTableDataSource<AbstractControl>;

  // Prescription Table
  prescriptiondisplayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "copayment",
    "requestamount",
    "totalcost",
    "comment",
  ];
  prescriptiondataSource = PRESCRIPTION_ELEMENT_DATA;
  medicineForm: any = FormGroup;
  medicineList: any = [];
  medicineName: string = "";
  medicineIDObject: any = {};
  medicineNameObject: any = {};
  newMedicineArray: any = {};
  filteredOptions!: Observable<any>;
  myControl = new FormControl("");
  pharmacyId: any;
  stepper: MatStepper;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private patientService: PatientService,
    private coreService: CoreService,
    private pharmacyPlanService: PharmacyPlanService,
    private toastr: ToastrService
  ) {
    this.medicineForm = this.fb.group({
      medicines: this.fb.array([]),
      totalCoPayment: [0],
      totalRequestedAmount: [0],
      totalCostOfAllMedicine: [0],
    });

    this.onValueChnage();
  }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.pharmacyId = user?._id;
    this.addNewMedicine();
    this.getMedicineList();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );
  }

  onValueChnage() {
    this.medicineForm.valueChanges.subscribe((data) => {
      let total_co_payment: any = 0;
      let total_request_amount :any = 0 
      let total_cost :any = 0 

      this.medicineForm.value.medicines.forEach(element => {
        total_co_payment = total_co_payment + element?.co_payment
        total_request_amount = total_request_amount + element?.request_amount
        total_cost = total_cost + element?.total_cost
      });

      this.medicineForm.patchValue({
        totalCoPayment : total_co_payment,
        totalRequestedAmount: total_request_amount,
        totalCostOfAllMedicine: total_cost,
      })
    });
    
  }

  onSubmit() {
    console.log(this.medicineForm.value.medicines);
    let medicineArray = [];
    this.medicineForm.value.medicines.map((data, index) => {
      medicineArray.push({
        medicineId: this.medicineIDObject[index],
        medicineName: this.medicineNameObject[index],
        quantityPrescribed: data.quantity_prescribed,
        quantityDelivered: data.quantity_delivered,
        frequency: data.frequency,
        duration: data.duration,
        pricePerUnit: data.price_per_unit,
        coPayment: data.co_payment,
        requestAmount: data.request_amount,
        totalCost: data.total_cost,
        comment: data.comment,
      });
    });
    let reqData = {
      medicineDetails: medicineArray,
      totalCoPayment: this.medicineForm.value.totalCoPayment,
      totalRequestedAmount: this.medicineForm.value.totalRequestedAmount,
      totalCostOfAllMedicine: this.medicineForm.value.totalCostOfAllMedicine,
      pharmacyId: this.pharmacyId,
      claimObjectId: "63c1caba8b4284a268856d0c",
    };

    console.log("Request Data --->", reqData);
    this.pharmacyPlanService.medicineServiceType(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.toastr.success(response.message);
        }
      },
      (err) => {
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errorResponse.message);
      }
    );
  }

  getMedicineList() {
    this.patientService.getmedicineList().subscribe(
      (res) => {
        let result = this.coreService.decryptContext({data:res});
        const medicineArray = [];
        for (const medicine of result.body.medicneArray) {
          medicineArray.push({
            medicine_name: medicine.medicine_name,
            medicine_number: medicine.number,
            medicine_id: medicine._id,
          });
        }
        this.medicineList = medicineArray;
        console.log("get medicine list--->", medicineArray);
      },
      (err: ErrorEvent) => {
        console.log(err.message, "error");
      }
    );
  }

  handleMedicineChange(target: any): void {
    if (target.value) {
      this.medicineName = target.value;
    } else {
      this.newMedicineArray = [];
      this.medicineIDObject = {};
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.medicineList.length > 0) {
      var result = this.medicineList.filter((option: any) => {
        return option.medicine_name.toLowerCase().includes(filterValue);
      });
      return result != "" ? result : ["No data"];
    }
    return ["No data"];
  }

  // End medicine filter
  public updateMySelection(option: any, i: any) {
    this.medicineIDObject[i] = option.medicine_id;
    this.medicineNameObject[i] = option.medicine_name;
    console.log(this.medicineIDObject);

    console.log(this.medicineForm.value);
  }

  //Add new medcine for the superadmin
  public handleAddMedicineClick(idx: any) {
    this.newMedicineArray[idx] = this.medicineName;
    this.medicineList.push({ medicine_name: this.medicineName });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );
  }

  public clearText() {
    this.medicineName = "";
  }

  //------------Form Array Handling----------------
  // f(index) {
  //   let immunization = this.medicineForm.get("medicines") as FormArray;
  //   const formGroup = immunization.controls[index] as FormGroup;
  //   return formGroup;
  // }

  get medicines() {
    return this.medicineForm.controls["medicines"] as FormArray;
  }

  addNewMedicine() {
    const newForm = this.fb.group({
      medicineId: [""],
      medicine_name: ["", [Validators.required]],
      quantity_prescribed: [0, [Validators.required]],
      quantity_delivered: [0, [Validators.required]],
      frequency: [0, [Validators.required]],
      duration: [0, [Validators.required]],
      price_per_unit: [0, [Validators.required]],
      co_payment: [0, [Validators.required]],
      request_amount: [0, [Validators.required]],
      total_cost: [0, [Validators.required]],
      comment: ["", [Validators.required]],
    });

    this.medicines.push(newForm);
    this.dataSource = new MatTableDataSource(
      (this.medicineForm.get("medicines") as FormArray).controls
    );
  }

  removeMedicine(index: number) {
    (this.medicineForm.get("medicines") as FormArray).removeAt(index);
    this.dataSource = new MatTableDataSource(
      (this.medicineForm.get("medicines") as FormArray).controls
    );
  }

  // Prescription Details modal
  openVerticallyCenteredPrescription(prescriptioncontent: any) {
    this.modalService.open(prescriptioncontent, {
      centered: true,
      size: "xl",
      windowClass: "prescription_details",
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

}
