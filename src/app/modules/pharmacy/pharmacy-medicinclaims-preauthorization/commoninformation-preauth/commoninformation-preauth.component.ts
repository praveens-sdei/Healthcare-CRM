import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { map, Observable, startWith } from 'rxjs';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyPlanService } from '../../pharmacy-plan.service';

@Component({
  selector: 'app-commoninformation-preauth',
  templateUrl: './commoninformation-preauth.component.html',
  styleUrls: ['./commoninformation-preauth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommoninformationPreauthComponent implements OnInit {


  @Input() public mstepper: MatStepper;

  myControl = new FormControl('');
  patient = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  patientId: any;
  insuranceId: string;
  stepOneId: string = '';
  firstFormGroup = this._formBuilder.group({
    insuranceId: new FormControl('', [Validators.required]),
    patientId: new FormControl(''),
    ePrescriptionNumber: new FormControl(),
    pharmacyId: new FormControl(''),
    requestType: new FormControl('', [Validators.required]),
    claimNumber: new FormControl('', [Validators.required])
  });


  secondFormGroup = this._formBuilder.group({
    healthExpense: new FormControl(''),
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    dob: new FormControl(''),
    age: new FormControl(''),
    gender: new FormControl(''),
    insuranceId: new FormControl(''),
    policyId: new FormControl(''),
    employeeId: new FormControl(''),
    cardId: new FormControl(''),
    insHolderName: new FormControl(''),
    insValidityTo: new FormControl(''),
    insValidityFrom: new FormControl(''),
    reimbursment: new FormControl(''),
  });


  thirdFormGroup = this._formBuilder.group({
    first_namet: new FormControl(''),
    middle_namet: new FormControl(''),
    last_namet: new FormControl(''),
    dobt: new FormControl(''),
    aget: new FormControl(''),
    gendert: new FormControl(''),
    insuranceIdt: new FormControl(''),
    policyIdt: new FormControl(''),
    employeeIdt: new FormControl(''),
    cardIdt: new FormControl(''),
    insHolderNamet: new FormControl(''),
    insValidityTot: new FormControl(''),
    insValidityFromt: new FormControl(''),
    reimbursmentt: new FormControl(''),
    relationPrimaryt: new FormControl('')
  });
  fourthFormGroup = this._formBuilder.group({
    deliveryCenter: new FormControl(''),
    deliverFName: new FormControl(''),
    deliverMName: new FormControl(''),
    deliverLName: new FormControl(''),
    deliverTitle: new FormControl(''),
    prescriberCenter: new FormControl(''),
    prescriberFName: new FormControl(''),
    prescriberMName: new FormControl(''),
    prescriberLName: new FormControl(''),
    prescriberTitle: new FormControl(''),
    prescriberSpeciality: new FormControl('')
  });
  fifthFormGroup = this._formBuilder.group({
    firstName: new FormControl(''),
    accidentRelation: new FormControl(''),
    accidentDate: new FormControl(''),
    accidentType: new FormControl(''),
    other: new FormControl(''),
    officialReport: new FormControl(''),
    resThirdParty: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl('')
  });
  isLinear = false;


  nested_stepperOrientation: Observable<StepperOrientation>;
  isSubmitted: boolean = false;
  insuraneList: any;
  patientList: any[] = [];
  primaryFieldList: any[] = [];
  loggedId: string;
  loggedName: string;
  primaryFieldJson: any;
  secondaryFieldList: any[] = [];
  secondaryFieldJson: any;
  accidentFieldList: any[] = [];
  accidentFieldJson: any;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private pharmacyService: PharmacyPlanService,
    private superAdminService: SuperAdminService,
    private coreService: CoreService) {


    this.nested_stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.loggedId = this.coreService.getLocalStorage('loginData')._id;
    this.loggedName = this.coreService.getLocalStorage('adminData').pharmacy_name;

  }
  ngOnInit() {
    // console.log(this.mstepper)

    this.getAllInsurance();
    this.getAllPatient();

  }


  async getInsuranceId(event: any) {
    this.insuranceId = event.value;
    console.log('insuranceId', this.insuranceId);

    await this.getPrimaryInsuredField();
    await this.getSecondaryInsurerField();
    await this.getAccidentField();
  }

  private getPrimaryInsuredField() {
    const requestData = {
      insuranceId: this.insuranceId
    }
    this.primaryFieldList = [];
    this.primaryFieldJson = '';
    this.pharmacyService.getAllPrimaryInsuredFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);
          console.log('primary insured field', result);

          if (result.status) {
            this.primaryFieldJson = result.body.primaryData;
            result.body.primaryData.forEach(element => {
              this.primaryFieldList.push(Object.values(element))
            });
            // this.primaryFieldList = result.body.primaryData;
          } else {
            //this.coreService.showError(result.message,'');
          }
          console.log('primary field list', this.primaryFieldList);

        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
  }

  private getSecondaryInsurerField() {
    const requestData = {
      insuranceId: this.insuranceId
    }

    this.secondaryFieldList = [];
    this.secondaryFieldJson = '';
    this.pharmacyService.getAllSecondaryInsuredFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);
          console.log('secondary insured field', result);

          if (result.status) {
            if (result.body.secondaryData.length > 0) {
              this.secondaryFieldJson = result.body.secondaryData;

              result.body.secondaryData.forEach(element => {
                this.secondaryFieldList.push(Object.values(element))
              });
            } else {
              this.secondaryFieldJson = null;
              this.secondaryFieldList = [];
            }

          }
          console.log('secondary field list', this.secondaryFieldList);

        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });

  }

  private getAccidentField() {
    const requestData = {
      insuranceId: this.insuranceId
    }

    this.accidentFieldList = [];
    this.accidentFieldJson = '';
    this.pharmacyService.getAllAccidentInsurerFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);
          console.log('accident insured field', result);

          if (result.status) {
            if (result.body.accidentData.length > 0) {
              this.accidentFieldJson = result.body.accidentData;

              result.body.accidentData.forEach(element => {
                this.accidentFieldList.push(Object.values(element))
              });
            } else {
              this.accidentFieldJson = null;
              this.accidentFieldList = [];
            }

          }
          console.log('accident field list', this.accidentFieldList);

        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
  }

  getpatientId(event: any) {
    console.log(event);
    this.patientId = event.value;

  }

  private getAllPatient() {
    this.pharmacyService.getAllPatientList().subscribe({
      next: async (res) => {
        const patientList = await res;
        if (patientList) {
          let result = this.coreService.decryptContext(res);
          console.log(result);
          if (result.status) {
            this.patientList = result.body;
          } else {
            this.coreService.showError(result.message, '');
          }
          console.log(this.patientList)
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
  }

  private getAllInsurance() {
    const param = {
      page: 1,
      limit: 1000,
      searchText: '',
      startDate: '',
      endDate: ''
    }
    this.pharmacyService.getApprovedInsurance(param).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        console.log(encryptedData);

        let result = this.coreService.decryptObjectData(encryptedData);
        console.log(result);
        if (result.status) {
          this.insuraneList = result.body.result;
        } else {
          this.coreService.showError(result.message, '');
        }
        console.log(this.insuraneList);
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
  }

  public saveStepOne(formVal: any, stepper: MatStepper) {

    let finalReqData = {
      insurnaceId: this.insuranceId,
    };
    this.pharmacyService.checkInsuranceStaff(finalReqData).subscribe({
      next: async (res) => {
        console.log("stepone result", res.data);
        let encData = await res;
        console.log(encData, "90909");
        let result = this.coreService.decryptContext(encData);
        console.log(result, "check result");
        if (result.data) {
          console.log(result, "check result");


          this.isSubmitted = true;
          if (this.firstFormGroup.invalid) {
            return;
          }
          formVal.pharmacyId = this.loggedId
          formVal.claimId = '';
          formVal.patientId = this.patientId;
          formVal.ePrescriptionNumber = '';
          // console.log(stepper);
          // stepper.next();
          // stepper.previous();
          // return;
          this.pharmacyService.saveStepOne(formVal).subscribe({
            next: async (res) => {
              const encData = await res;
              console.log(encData);
              let result = this.coreService.decryptContext(encData);
              console.log(result);

              if (result.status) {
                this.stepOneId = result.data._id;
                this.coreService.showSuccess(result.message, '');
                stepper.next();
              } else {
                this.coreService.showError(result.message, '');
              }
            }, error(err: ErrorEvent) {
              console.log(err.message);
            },
          })
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error(err: ErrorEvent) {
        console.log(err.message);
      },

    })
    console.log(formVal);
  }

  get stepOneFormControl(): { [key: string]: AbstractControl } {
    return this.firstFormGroup.controls;
  }

  saveStepTwo(formVal: any, stepper: MatStepper) {


    this.isSubmitted = true;
    if (this.secondFormGroup.invalid) {
      console.log('invalid');
      return;
    }
    let reqData = []
    this.primaryFieldJson.forEach(element => {
      // console.log(element.fieldName);
      let addArray: any;
      switch (element.fieldName) {
        case 'First Name':
          addArray = {
            "fieldName": "First Name",
            "fieldValue": formVal.first_name
          }
          reqData.push(addArray);
          break;
        case 'Last Name':
          addArray = {
            "fieldName": "Last Name",
            "fieldValue": formVal.last_name
          }
          reqData.push(addArray);
          break;

        case 'Middle Name':
          addArray = {
            "fieldName": "Middle Name",
            "fieldValue": formVal.middle_name
          }
          reqData.push(addArray);
          break;
        case 'Date Of Birth':
          addArray = {
            "fieldName": "Date Of Birth",
            "fieldValue": formVal.dob
          }
          reqData.push(addArray);
          break;
        case 'Age':
          addArray = {
            "fieldName": "Age",
            "fieldValue": formVal.age
          }
          reqData.push(addArray);
          break;

        case 'Card ID':
          addArray = {
            "fieldName": "Card ID",
            "fieldValue": formVal.cardId
          }
          reqData.push(addArray);
          break;

        case 'Employee ID':
          addArray = {
            "fieldName": "Employee ID",
            "fieldValue": formVal.employeeId
          }
          reqData.push(addArray);
          break;

        case 'Gender':
          addArray = {
            "fieldName": "Gender",
            "fieldValue": formVal.gender
          }
          reqData.push(addArray);
          break;

        case 'Insurance Validity':
          addArray = {
            "fieldName": "Insurance Validity",
            "fieldValue": formVal.last_name
          }
          reqData.push(addArray);
          break;

        case 'Insurance ID':
          addArray = {
            "fieldName": "Insurance ID",
            "fieldValue": formVal.insuranceId
          }
          reqData.push(addArray);
          break;

        case 'Insurance Holder Name':
          addArray = {
            "fieldName": "Insurance Holder Name",
            "fieldValue": formVal.insHolderName
          }
          reqData.push(addArray);
          break;

        case 'Policy ID':
          addArray = {
            "fieldName": "Policy ID",
            "fieldValue": formVal.policyId
          }
          reqData.push(addArray);
          break;

        case '"Reimbursement"':
          addArray = {
            "fieldName": "Reimbursement",
            "fieldValue": formVal.reimbursment
          }
          reqData.push(addArray);
          break;

        default:

          break;
      }
    });

    let finalReqData = {
      "insurerType": formVal.healthExpense,
      "primaryInsuredIdentity": reqData,
      "pharmacyId": this.loggedId,
      "claimObjectId": this.stepOneId
    }


    this.pharmacyService.saveStepTwo(finalReqData).subscribe({
      next: (res) => {
        console.log(res);

        let result = this.coreService.decryptContext(res);
        console.log(result);
        if (result.status) {
          this.coreService.showSuccess(result.message, '');
          if (formVal.healthExpense == 'secondaryInsurer') {
            stepper.next();
          } else {
            stepper.next();
            stepper.next();
          }


        } else {
          this.coreService.showError(result.message, '');
        }

      }, error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    })
    console.log(finalReqData);
    // stepper.next();
    // stepper.next();





  }

  saveStepThree(formVal: any, stepper: MatStepper) {


    this.isSubmitted = true;
    if (this.thirdFormGroup.invalid) {
      console.log('invalid');
      return;
    }

    let reqData = [];
    this.secondaryFieldJson.forEach(element => {
      // console.log(element.fieldName);
      let addArray: any;
      switch (element.fieldName) {
        case 'First Name':
          addArray = {
            "fieldName": "First Name",
            "fieldValue": formVal.first_namet
          }
          reqData.push(addArray);
          break;
        case 'Last Name':
          addArray = {
            "fieldName": "Last Name",
            "fieldValue": formVal.last_namet
          }
          reqData.push(addArray);
          break;

        case 'Middle Name':
          addArray = {
            "fieldName": "Middle Name",
            "fieldValue": formVal.middle_namet
          }
          reqData.push(addArray);
          break;
        case 'Date Of Birth':
          addArray = {
            "fieldName": "Date Of Birth",
            "fieldValue": formVal.dobt
          }
          reqData.push(addArray);
          break;
        case 'Age':
          addArray = {
            "fieldName": "Age",
            "fieldValue": formVal.aget
          }
          reqData.push(addArray);
          break;

        case 'Card ID':
          addArray = {
            "fieldName": "Card ID",
            "fieldValue": formVal.cardIdt
          }
          reqData.push(addArray);
          break;

        case 'Employee ID':
          addArray = {
            "fieldName": "Employee ID",
            "fieldValue": formVal.employeeIdt
          }
          reqData.push(addArray);
          break;

        case 'Gender':
          addArray = {
            "fieldName": "Gender",
            "fieldValue": formVal.gendert
          }
          reqData.push(addArray);
          break;

        case 'Insurance Validity':
          addArray = {
            "fieldName": "Insurance Validity",
            "fieldValue": formVal.last_namet
          }
          reqData.push(addArray);
          break;

        case 'Insurance ID':
          addArray = {
            "fieldName": "Insurance ID",
            "fieldValue": formVal.insuranceIdt
          }
          reqData.push(addArray);
          break;

        case 'Insurance Holder Name':
          addArray = {
            "fieldName": "Insurance Holder Name",
            "fieldValue": formVal.insHolderNamet
          }
          reqData.push(addArray);
          break;

        case 'Policy ID':
          addArray = {
            "fieldName": "Policy ID",
            "fieldValue": formVal.policyIdt
          }
          reqData.push(addArray);
          break;

        case '"Reimbursement"':
          addArray = {
            "fieldName": "Reimbursement",
            "fieldValue": formVal.reimbursmentt
          }
          reqData.push(addArray);
          break;

        case '"Relation With The Primary Insured"':
          addArray = {
            "fieldName": "Relation With The Primary Insured",
            "fieldValue": formVal.relationPrimaryt
          }
          reqData.push(addArray);
          break;

        default:

          break;
      }
    });

    let finalReqData = {
      "secondaryInsuredIdentity": reqData,
      "pharmacyId": this.loggedId,
      "claimObjectId": this.stepOneId
    }


    this.pharmacyService.saveStepThree(finalReqData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log('stepthree result', result);
        if (result.status) {
          this.coreService.showSuccess(result.message, '');
          stepper.next();
        } else {
          this.coreService.showError(result.message, '');
        }

      }, error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    })
    console.log(finalReqData);

  }

  saveStepFour(formVal: any, stepper: MatStepper) {

    // deliveryCenter:new FormControl(''),
    // deliverFName:new FormControl(''),
    // deliverMName:new FormControl(''),
    // deliverLName:new FormControl(''),
    // deliverTitle:new FormControl(''),
    // prescriberCenter: new FormControl(''),
    // prescriberFName:new FormControl(''),
    // prescriberMName:new FormControl(''),
    // prescriberLName:new FormControl(''),
    // prescriberTitle:new FormControl(''),
    // prescriberSpeciality:new FormControl('')

    let reqData = {
      "deliverCenterInfo": {
        "deliverCenter": formVal.deliveryCenter,
        "deliverFirstName": formVal.deliverFName,
        "deliverMiddleName": formVal.deliverMName,
        "deliverLastName": formVal.deliverLName,
        "deliverTitle": formVal.deliverTitle
      },
      "prescriberCenterInfo": {
        "prescriberCenter": formVal.prescriberCenter,
        "prescriberFirstName": formVal.prescriberFName,
        "prescriberMiddleName": formVal.prescriberMName,
        "prescriberLastName": formVal.prescriberLName,
        "prescriberTitle": formVal.prescriberTitle,
        "prescriberSpeciality": formVal.prescriberSpeciality,
      },
      "pharmacyId": this.loggedId,
      "claimObjectId": this.stepOneId
    }

    this.pharmacyService.saveStepFour(reqData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log('stepFive result', result);
        if (result.status) {
          this.coreService.showSuccess(result.message, '');
          stepper.next();
        } else {
          this.coreService.showError(result.message, '');
        }

      }, error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    })



  }

  saveStepFive(formVal: any) {
    this.isSubmitted = true;
    if (this.fifthFormGroup.invalid) {
      console.log('invalid');
      return;
    }

    let reqData = [];
    this.accidentFieldJson.forEach(element => {
      let addArray: any;
      switch (element.fieldName) {
        case 'First Name':
          addArray = {
            "fieldName": "First Name",
            "fieldValue": formVal.firstName
          }
          reqData.push(addArray);
          break;
        case 'Is It Related To An Accident':
          addArray = {
            "fieldName": "Is It Related To An Accident",
            "fieldValue": formVal.accidentRelation
          }
          reqData.push(addArray);
          break;

        case 'Accident Date':
          addArray = {
            "fieldName": "Accident Date",
            "fieldValue": formVal.accidentDate
          }
          reqData.push(addArray);
          break;
        case 'Accident Type':
          addArray = {
            "fieldName": "Accident Type",
            "fieldValue": formVal.accidentType
          }
          reqData.push(addArray);
          break;
        case 'Is There An Official Report':
          addArray = {
            "fieldName": "Is There An Official Report",
            "fieldValue": formVal.officialReport
          }
          reqData.push(addArray);
          break;

        case 'Is There A Responsible Third Party':
          addArray = {
            "fieldName": "Is There A Responsible Third Party",
            "fieldValue": formVal.resThirdParty
          }
          reqData.push(addArray);
          break;

        case 'Last Name':
          addArray = {
            "fieldName": "Last Name",
            "fieldValue": formVal.lastName
          }
          reqData.push(addArray);
          break;

        case 'Phone Number':
          addArray = {
            "fieldName": "Phone Number",
            "fieldValue": formVal.phoneNumber
          }
          reqData.push(addArray);
          break;
        case '"Address"':
          addArray = {
            "fieldName": "Address",
            "fieldValue": formVal.address
          }
          reqData.push(addArray);
          break;

        default:

          break;
      }
    });

    let finalReqData = {
      "accidentRelatedField": reqData,
      "pharmacyId": this.loggedId,
      "claimObjectId": this.stepOneId
    }


    this.pharmacyService.saveStepFive(finalReqData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log('stepFive result', result);
        if (result.status) {
          this.coreService.showSuccess(result.message, '');
          this.mstepper.next();
        } else {
          this.coreService.showError(result.message, '');
        }

      }, error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    })
    console.log(finalReqData);
  }



  indexOf2d(array2d: any, itemtofind: string) {
    // console.log([].concat.apply([], ([].concat.apply([], array2d))));

    return [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind) !== -1;
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };


}
