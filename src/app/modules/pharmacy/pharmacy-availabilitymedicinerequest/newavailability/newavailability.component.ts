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
import { PatientService } from 'src/app/modules/patient/patient.service';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { Select2UpdateEvent } from "ng-select2-component";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-newavailability',
  templateUrl: './newavailability.component.html',
  styleUrls: ['./newavailability.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class NewavailabilityComponent implements OnInit {
  order_id: string = "";
  orderDetails: IOrderDetailsResponse = null;
  patient_details: any;
  health_plan_details: any
  portal_user_id: any;
  patient_id: any;
  overlay: false;
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
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl('');
  medicineList: any = [];
  medicineName: string = "";
  medicineIDObject: any = []
  medicineNameObject: any = []
  exludeMedicineAmount: any = {}
  newMedicineArray: any = {}
  availableMedicineList: string[] = [];
  @ViewChild("approved") approved: any;
  subscriberdetails: any;
  checkexclutiondata: any;
  checkexclutionDescription: any;
  checkpreAuthService: any;
  serviceObject: any;
  categoryObject: any;
  userRole: any;
  userPermission: any;
  userId: any;
  innerMenuPremission:any =[];

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private _superAdminService: SuperAdminService,
    private patientService: PatientService,
    private loader: NgxUiLoaderService

  ) {
    let userData = this.coreService.getLocalStorage('loginData')
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = userData?.role;
    this.userPermission =userData.permissions;

    this.userRole = userData.role;
    if(this.userRole === "PHARMACY_STAFF"){
      this.userId = adminData?.for_staff;
    }else{
      this.userId = userData?._id;
    }
  }

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    this.pharmacyService.patientProfile(this.patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
        this.subscriberdetails = response?.body.health_plan_details?.resultData;

console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>",this.orderDetails.medicineDetails);



if(this.orderDetails.medicineDetails.length>0)
{
          this.orderDetails.medicineDetails.forEach((element, index) => {
            this.medicineList.push([]);
          
            this.medicineNameObject.push([]);
            this.medicineIDObject.push([]);
            const available = element.available ? "yes" : "no";
            const newRow: FormGroup = new FormGroup({
              medicineId: new FormControl("", []),
              categoryService: new FormControl("", []),
              serviceName: new FormControl("", []),
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
              request_amount: new FormControl(element.request_amount, []),
              co_payment: new FormControl(element.co_payment, []),
              available: new FormControl(available, []),
              action: new FormControl("", []),
            });
            this.availableMedicineList.push(available);
            (this.orderMedicine.get("medicine_details") as FormArray).push(
              newRow
            );
     
          this.getMedicineList(element?.name, (this.orderMedicine.get("medicine_details") as FormArray).length - 1, element?.medicine_id, element?.service, element?.category);

            // this.addNewMedicine();
          });
          this.orderMedicine
            .get("total_cost")
            .setValue(this.orderDetails.medicineBill.total_medicine_cost || "");
          this.orderMedicine
            .get("copay")
            .setValue(this.orderDetails.medicineBill.co_pay || "");
          this.orderMedicine
            .get("insurance_paid")
            .setValue(this.orderDetails.medicineBill.insurance_paid || "");
          if (this.orderDetails.medicineDetails.length === 0) {
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
      }
    });
  }

  private getOrderField(...field: string[]) {
    return this.orderMedicine.get(field).value;
  }

  get medicineData(): FormArray {
    return this.orderMedicine.get("medicine_details") as FormArray;
  }

  addNewMedicine(medicineName: string = "", medicineId: string = "", serviceName: string = "", categoryService: string = "") {

    this.medicineList.push([]);
   
    this.medicineNameObject.push([]);
    this.medicineIDObject.push([]);



    const newRow: FormGroup = new FormGroup({
      medicineId: new FormControl("", []),
      categoryService: new FormControl("", []),
      serviceName: new FormControl("", []),
      name: new FormControl("", []),
      prescribed: new FormControl("", []),
      delivered: new FormControl("", []),
      frequency: new FormControl("", []),
      duration: new FormControl("", []),
      priceperunit: new FormControl("", []),
      totalcost: new FormControl("", []),
      request_amount: new FormControl("", []),
      co_payment: new FormControl("", []),
      available: new FormControl("no", []),
      action: new FormControl("", []),
    });
    (this.orderMedicine.get("medicine_details") as FormArray).push(newRow);
    // this.availableMedicineList.push("no");
    this.dataSource = new MatTableDataSource(
      (this.orderMedicine.get("medicine_details") as FormArray).controls
    );
    console.log((this.orderMedicine.get("medicine_details") as FormArray).length);
    
    this.getMedicineList(medicineName, (this.orderMedicine.get("medicine_details") as FormArray).length - 1, medicineId, serviceName, categoryService);

  }
  removemedicine(index: number) {
    (this.orderMedicine.get("medicine_details") as FormArray).removeAt(index);
    this.availableMedicineList.splice(index, 1);
    this.dataSource = new MatTableDataSource(
      (this.orderMedicine.get("medicine_details") as FormArray).controls
    );
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
      // this.getMedicineList();
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
    console.log("JJJJJJJJJJJ");
    
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("medicine_availibility_request")) {
          this.innerMenuPremission = checkSubmenu['medicine_availibility_request'].inner_menu;  
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

  getMedicineList(query: any = "", index: any = 0, medicneId: string = "", serviceName: string = '', categoryService: string = '') {
    let param = {
      query: query,
    };
    this.patientService.getmedicineListWithParam(param).subscribe(
      (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        if(result.status)
        {
          
        const medicineArray = [];
        for (const medicine of result.body.medicneArray) {

          medicineArray.push({
            label: medicine.medicine_name,
            medicine_number: medicine.number,
            value: medicine._id,
          });
        }
        console.log(medicineArray,"medicineArray");

        if (medicineArray.length > 0) {
          this.medicineList[index] = medicineArray;
          if (medicneId != "") {
            this.medicineIDObject[index] = medicneId;
            this.medicineNameObject[index] = query;
          }
          if (serviceName != "") {
            this.serviceObject[index] = serviceName;
          }
          if (categoryService != "") {
            this.categoryObject[index] = categoryService;
          }
        } else {
        }
      }
      else
      {
        this.medicineList=[];
      }
      },
      (err: ErrorEvent) => {
        console.log(err.message, "error");
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
      this.orderMedicine.controls['copay'].setValue(excludedAmount + totalAmount - calculateInsuranceAmount)
      this.orderMedicine.controls['insurance_paid'].setValue(calculateInsuranceAmount)
    } else {
      this.orderMedicine.controls['copay'].setValue(taget.value)
      this.orderMedicine.controls['insurance_paid'].setValue(0)
    }
    this.orderMedicine.controls['copay'].disable();
    this.orderMedicine.controls['insurance_paid'].disable();
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

  downloadPrescription() {
    for (const url of this.prescriptionSignedUrl) {
      window.open(url, '_blank')
    }
  }

  public getOrderDetails(): void {
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
    };
    
    this.pharmacyService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IOrderDetailsResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
       

        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          console.log("result.status",result);
          
          this.orderDetails = result.data;
          if(this.orderDetails.medicineBill.prescription_url.length>0)
          {
            this.addNewMedicine()
          }
          this.patient_id = result?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails();
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>",this.orderDetails.medicineBill.prescription_url);
          
          if (this.orderDetails.medicineBill.prescription_url) {
            this.prescriptionSignedUrl=this.orderDetails.medicineBill.prescription_url;

            // this.documentMetaDataURL();
          }
        
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
            this.coreService.showError("","Somthing went wrong while adding medicine");
            resolve(false)
          }
        });
      }
      
    })
  }

  medicineAvailabilityChange(e: { value: string }, i: number) {
    this.availableMedicineList[i] = e.value;
  }

  async updateOrderData() {
    if (Object.values(this.newMedicineArray).length > 0) {
      const addmed = await this.addMedicineForSuperadmin()
    }
    if ( Object.values(this.medicineIDObject).length <= 0 || !this.getOrderField("medicine_details")[0].delivered || !this.getOrderField("medicine_details")[0].totalcost) {
      this.coreService.showError("", 'Please add at least one medicine');
      return
    }
console.log("this.medicineNameObject", this.medicineNameObject);
    this.loader.start();

    const orderDetailRequest: IOrderUpdateRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      in_medicine_bill: this.orderDetails.medicineBill._id,
      medicine_bill: {
        co_pay: this.getOrderField("copay"),
        total_medicine_cost: this.getOrderField("total_cost"),
        insurance_paid: this.getOrderField("insurance_paid"),
      },
      medicine_details: this.getOrderField("medicine_details").map((data, index) => (
        {
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
      }
      
      )),
      request_type: this.orderDetails.orderData.request_type,
      status: "accepted"
    };
    console.log("orderDetailRequest-------------",orderDetailRequest);
    
    
    this.pharmacyService.updateOrderDetails(orderDetailRequest).subscribe({
      next: (result1: IResponse<IMedicineUpdateResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Updated order details successfully");
        if (result.status === true) {
          this.loader.stop();
          console.log(result,"resultdatatatatatatatatt");
          
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
console.log("this.orderDetails.medicineBill", this.orderDetails.medicineBill);

    const docRequest: IUniqueId = {
      id: this.orderDetails.medicineBill.prescription_url,
    };
    console.log("docRequest>>>>>>>>>>>>>>>",docRequest);
    
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
    this.modalService.dismissAll('close');
    this.router.navigate(['/pharmacy/medicinerequest']);
  }

  cancelOrder() {
    const orderRequest: IOrderConfimRequest = {
      _id: this.orderDetails.orderData._id,
      status: "rejected",
      cancelled_by: "pharmacy",
      for_portal_user: this.userId
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



  update(key: string, event: Select2UpdateEvent<any>, index: any) {
    if (event.component.option != null) {
      this.medicineNameObject[index] = event.options[0].label;
      this.medicineIDObject[index] = event.options[0].value;

      let excReimburmentRate = 1;

      // this.health_plan_details.planExclusion.forEach((element, index1) => {
      //   const result =
      //     event.options[0].label.indexOf(element.in_exclusion.name) == -1
      //       ? false
      //       : true;

      //   if (result) {
      //     excReimburmentRate = 0;
      //     return;
      //   }
      // });
      // console.log(excReimburmentRate,"excReimburmentRate");
      
      // if (excReimburmentRate == 0) {
      //   this.checkexclutiondata[index] = "1";
      // } else {
      //   this.checkexclutiondata[index] = "";
      // }
    }
  }
  selectKeyPressValue: any = [];

  onKeypressEvent(event: any, index: number) {
    console.log("event------------ >0",event.key);
    
    if (event.key != "Backspace") {
      this.selectKeyPressValue[index] += event.key;


      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }
  onKeyDownEvent(event: any, index: number) {
    console.log("event", event);

    if (event.key == "Backspace") {
      this.selectKeyPressValue[index] = this.selectKeyPressValue[
        index
      ].substring(0, this.selectKeyPressValue[index].length - 1);
      console.log("onKeypressEvent", this.selectKeyPressValue[index]);

      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }
  reimbursmentRate: any = [];

  async calCulatePrice(event: any, i: number) {

    let excReimburmentRate = 1;
    let reqAmt = 0;

    // this.health_plan_details?.planExclusion.forEach((element) => {
    //   console.log(element.in_exclusion.name, "element.in_exclusion.name");
    //   console.log(this.medicineNameObject[i], "this.medicineNameObject[i]");

    //   const result =
    //     this.medicineNameObject[i]?.indexOf(element.in_exclusion.name) == -1
    //       ? false
    //       : true;

    //   if (result) {
    //     console.log("condition match", "swapppppp");
    //     excReimburmentRate = 0;
    //     return;
    //   }
    // });

    console.log(excReimburmentRate, "excReimburmentRate");

    let prcPerunit = this.getOrderField("medicine_details")[i].priceperunit;
    let qtyDeliver = this.getOrderField("medicine_details")[i].delivered;
    console.log("copay", prcPerunit,qtyDeliver);

    let totalCost = prcPerunit * qtyDeliver;
    console.log("copay",totalCost);

    if (excReimburmentRate == 1) {
      console.log(this.reimbursmentRate[i]);
if(this.reimbursmentRate[i]!=undefined)
{
  reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;
}
    } else {
      reqAmt = (excReimburmentRate / 100) * totalCost;
    }



    let copay = totalCost - reqAmt;

    console.log("totalCost", totalCost);
    console.log("copay", copay);
    console.log("reqAmt", reqAmt);

    await this.medicineData.controls[i].patchValue({
      totalcost: totalCost.toFixed(2),
      co_payment: copay.toFixed(2),
      request_amount: reqAmt.toFixed(2),
    });

    this.onValueChnage();
  }
  onValueChnage() {
    let total_co_payment: any = 0;
    let total_request_amount: any = 0;
    let total_cost: any = 0;

    this.orderMedicine.value.medicine_details.forEach((element) => 
  
    
    {
      total_co_payment =
        parseFloat(total_co_payment) + parseFloat(element?.co_payment);
      total_request_amount =
        parseFloat(total_request_amount) + parseFloat(element?.request_amount);
        
      total_cost = parseFloat(total_cost) + parseFloat(element?.totalcost);
    }
    );

    this.orderMedicine.patchValue({
      copay: total_co_payment.toFixed(2),
      insurance_paid: total_request_amount.toFixed(2),
      total_cost: total_cost.toFixed(2),
    });



  }

  search(key: string, event: any) {
    console.log(key, event);
  }

  confirmamount(Confirmmodel:any)
  {
    this.modalService.open(Confirmmodel, {
      centered: true,
      size: "md",
      windowClass: "Confirmmodel_data",
    });
  }

  handleClose() {
    this.modalService.dismissAll("close");
  }
}