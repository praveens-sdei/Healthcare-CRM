import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import { ToastrService } from "ngx-toastr";
import { Observable, map, startWith } from "rxjs";

@Component({
  selector: "app-eprescriptionmedicine",
  templateUrl: "./eprescriptionmedicine.component.html",
  styleUrls: ["./eprescriptionmedicine.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EprescriptionmedicineComponent implements OnInit {
  filterForm: any = FormGroup;
  dosageForm: any = FormGroup;
  currentFrequency: any = "Moment";
  medicineList: any = [];
  selectedMedicine: any;

  deleteModal: any;
  dosageModal: any;

  appointmentId: any = "";
  patientName: any = "";
  doctorId: any = "";
  eprescriptionDetails: any;
  isEprescriptionExist: boolean = false;
  ePrescriptionId: any = "";

  doseToBeDelete: any;
  @ViewChild("rabeprazolecontent") rabeprazolecontent: ElementRef;
  @ViewChild("deletepopup") deletepopup: ElementRef;
  @ViewChild("newmedicinemodal") newmedicinemodal: ElementRef;

  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  selectedmedicineinfo: any;
  searchmedicine: any = "";
  newmedicine: any = "";
  recentPrescribedMedcinesList: any[] = [];
  patientAllDetails: any;
  medicineData: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private sadminService: SuperAdminService,
    private indiviualDoctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private toastr: ToastrService
  ) {
    this.filterForm = this.fb.group({
      height: [0],
      weight: [0],
      bmi: [0],
      bmi_inetpreter: [0],
      liver_failure: ["None"],
      renal_failure: ["None"],
      accident_related: [false],
      occupational_desease: [false],
      free_of_charge: [false],
      allergies: [""],


    });

    this.dosageForm = this.fb.group({
      dosages: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorId = loginData?._id;
    this.appointmentId = sessionStorage.getItem("appointmentId");
    this.patientName = sessionStorage.getItem("patientName");
    this.getEprescription();
    this.getAppointmentDetails();
    this.addNewDosage();
    this.recentPrescribedMedicines();
  }

  async getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.patientAllDetails = response?.data?.patientAllDetails;
  
          console.log("DEtails====>", response);
  
          this.patchPatientDetails(  this.patientAllDetails);
        }
      });
  }

  patchPatientDetails(data) {
    const latestVital = data?.vitalsDetails[data?.vitalsDetails.length - 1];
    console.log("latestVital________",latestVital);
    
    this.medicineData = data?.medicineDetails?.current_medicines[data?.medicineDetails?.current_medicines.length - 1];

    this.filterForm.patchValue({
      height:latestVital?.height,
      weight: latestVital?.weight,
      bmi: latestVital?.bmi,
    });
  }

  patchPatientDetails1(data) {   
    console.log("patchPatientDetails1__________",data);
    
    this.filterForm.patchValue({     
      liver_failure: data?.liverFailure,
      renal_failure: data?.renalFailure,
      accident_related: data?.accidentRelated,
      occupational_desease: data?.occupationalDesease,
      free_of_charge: data?.freeOfCharge,
    });
  }

  handleMedicineChange(event) {
    this.searchmedicine = this.myControl.value;

    this.getMedicineList(this.searchmedicine);
  }

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
    };

    this.indiviualDoctorService
      .getEprescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        console.log("Eprescription Get====>", response);
        if (response.status) {
          this.eprescriptionDetails = response?.body;
          this.isEprescriptionExist = true;
          this.ePrescriptionId = response?.body?._id;
          this.getAllMedicineDosage();
          this.patchPatientDetails1(response?.body);
        } else {
          this.eprescriptionDetails = response?.body;
          this.isEprescriptionExist = false;
        }
      });
  }

  async createEprescription() {
    let data = this.filterForm.value;
    console.log("data___________",data);
    
    let reqData = {
      appointmentId: this.appointmentId,
      doctorId: this.doctorId,
      ePrescriptionNumber: "",
      patientBiometric: {
        height: data?.height,
        weight: data?.weight,
        bmi: data?.bmi,
        bmiInterpreter: data?.bmi_inetpreter,
      },
      liverFailure: data?.liver_failure,
      renalFailure: data?.renal_failure,    
      accidentRelated: data?.accident_related,
      occupationalDesease: data?.occupational_desease,
      freeOfCharge: data?.free_of_charge,
    };
    return new Promise((resolve, reject) => {
      this.indiviualDoctorService.createEprescription(reqData).subscribe({
        next: (res: any) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.ePrescriptionId = response?.body?._id;
            this.toastr.success(response.message);
            this.getEprescription();
          }
          resolve(response);
          reject(response);
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    });
  }



  openCommentPopup(medicinecontent: any, medicineId: any) {
    console.log(medicineId);

    let reqData = {
      medicineIds: [medicineId],
    };

    this.sadminService.getMedicinesById(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      console.log("MEdicine data===>", response);
      this.selectedmedicineinfo = response?.body[0]?.medicine; //get medicine by id response

      this.modalService.open(medicinecontent, {
        centered: true,

        size: "md",

        windowClass: "claim_successfully",
      });
    });

    console.log(this.selectedmedicineinfo);
  }

  getMedicineList(query = "") {
    let param = {
      query: query,
      doctorId: this.doctorId,
    };
    this.indiviualDoctorService
      .getmedicineListWithParam(param)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Medicines List===>", response);
        this.medicineList = response.body.medicneArray;

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(""),

          map((value) => this._filter(value || ""))
        );
      });
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

  async changeMedicine(event: any) {
    this.dosageForm.reset();
    this.dosages.clear();
    console.log("event", event);
    this.selectedMedicine = event;

    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      medicineId: this.selectedMedicine?._id,
    };

    console.log("Req Data===>", reqData);

    if (this.isEprescriptionExist) {
      await this.indiviualDoctorService
        .getMedicineDosages(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Dosages List===>", response.body);

          if (response.body.length != 0) {
            response.body.forEach((element, index) => {
              this.addNewDosage();

              this.dosages.at(index).patchValue({
                doseId: element?._id,
              });

              this.dosages.at(index).patchValue({
                dose_no: element?.dose_no,
              });

              this.dosages.at(index).patchValue({
                frequency_type: element?.frequency?.frequency_type,
              });

              //patch frequency----------
              if (element?.frequency?.frequency_type === "Moment") {
                this.dosages
                  .at(index)
                  .patchValue({ morning: element?.frequency?.morning });

                this.dosages
                  .at(index)
                  .patchValue({ midday: element?.frequency?.midday });

                this.dosages
                  .at(index)
                  .patchValue({ evening: element?.frequency?.evening });

                this.dosages
                  .at(index)
                  .patchValue({ night: element?.frequency?.night });
              } else if (element?.frequency?.frequency_type === "Recurrence") {
                this.dosages.at(index).patchValue({
                  recurrence_medicine_quantity:
                    element?.frequency?.medicine_quantity,
                });

                this.dosages.at(index).patchValue({
                  recurrence_every_quantity: element?.frequency?.every_quantity,
                });

                this.dosages.at(index).patchValue({
                  recurrence_in_type: element?.frequency?.type,
                });
              } else {
                this.dosages.at(index).patchValue({
                  alternate_medicine_quantity:
                    element?.frequency?.medicine_quantity,
                });

                this.dosages.at(index).patchValue({
                  alternate_every_quantity: element?.frequency?.every_quantity,
                });

                this.dosages.at(index).patchValue({
                  alternate_in_type: element?.frequency?.type,
                });
              }

              //patch take_for
              this.dosages.at(index).patchValue({
                take_for: {
                  quantity: element?.take_for?.quantity,
                  type: element?.take_for?.type,
                },
              });

              //patch enough quantities
              if (element?.quantities?.quantity_type === "Enough_Quantity") {
                this.dosages.at(index).patchValue({
                  quantities: {
                    quantity_type: element?.quantities?.quantity_type,
                    enough_count: element?.quantities?.quantity,
                    enough_type: element?.quantities?.type,
                  },
                });
              } else {
                this.dosages.at(index).patchValue({
                  quantities: {
                    quantity_type: element?.quantities?.quantity_type,
                    exact_count: element?.quantities?.quantity,
                    exact_type: element?.quantities?.type,
                  },
                });
              }

              console.log("After Patch====>", this.dosageForm.value);
            });
          } else {
            this.addNewDosage();
          }
        });
    } else {
      this.addNewDosage();
    }

    this.openVerticallyCenteredrabeprazole(this.rabeprazolecontent);
  }

  listMedicineDosages: any[] = [];
  allDosages: any[] = [];

  async getAllMedicineDosage() {
    let reqData = {
      ePrescriptionId: this.ePrescriptionId,
      medicineId: "",
    };

    await this.indiviualDoctorService
      .getMedicineDosages(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("ALL DOSAGES====>", response);

        if (response.status) {
          this.allDosages = response?.body;

          response?.body.forEach(async (element) => {
            let obj = {
              _id: element?.medicineId,
              medicine_name: element?.medicine_name,
            };

            let result = this.listMedicineDosages.filter((s) =>
              s?.medicine_name.includes(element.medicine_name)
            );
            if (result.length === 0) {
              this.listMedicineDosages.push(obj);
            }
          });
        }

        console.log("PUSHED MEDICINES======>", this.listMedicineDosages);
      });
  }

  returnDosagesForMedicine(medicineName) {
    let doseArray = [];
    let statementArray = [];
    this.allDosages.forEach((dose) => {
      if (dose.medicine_name === medicineName) {
        doseArray.push(dose);
      }
    });

    doseArray.forEach((dose) => {
      if (
        dose?.quantities?.quantity_type === "Exact_Quantity" ||
        dose?.quantities?.quantity_type === "Enough_Quantity"
      ) {
        if (dose?.frequency?.frequency_type === "Moment") {
          let statement = "";

          if (dose?.quantities?.quantity === 0) {
            statement = `Morning(${dose?.frequency?.morning}), Midday(${dose?.frequency?.midday}), Evening(${dose?.frequency?.evening}), Night(${dose?.frequency?.night}) for ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
            statementArray.push(statement);

          } else {
            statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Morning(${dose?.frequency?.morning}), Midday(${dose?.frequency?.midday}), Evening(${dose?.frequency?.evening}), Night(${dose?.frequency?.night}) for ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
            statementArray.push(statement);

          }

          // let statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Morning(${dose?.frequency?.morning}), Midday(${dose?.frequency?.midday}), Evening(${dose?.frequency?.evening}), Night(${dose?.frequency?.night}) for ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
        }

        if (
          dose?.frequency?.frequency_type === "Recurrence" ||
          dose?.frequency?.frequency_type === "Alternate_Taking"
        ) {
          let statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Medicines(${dose?.frequency?.medicine_quantity}) for every ${dose?.frequency?.every_quantity} ${dose?.frequency?.type},  ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
          statementArray.push(statement);
        }
      }
    });

    return statementArray;
  }

  async checkBeforeDosageSave() {
    if (this.isEprescriptionExist) {
      console.log("Saving dosages");
      this.handleSaveDosage();
    } else {
      console.log("Creating new prescription");
      await this.createEprescription().then((res: any) => {
        this.handleSaveDosage();
      });
    }
  }

  async handleSaveDosage() {
    console.log("Dosage Form====>", this.dosageForm.value);

    let dosages = [];

    this.dosageForm.value.dosages.forEach((element, index) => {
      let finalObject = {};
      let frequency = {};
      let quantities = {};

      //Check for frequency type
      if (element?.frequency_type === "Moment") {
        frequency = {
          frequency_type: element?.frequency_type,
          morning: element?.morning,
          midday: element?.midday,
          evening: element?.evening,
          night: element?.night,
          medicine_quantity: 0,
          every_quantity: 0,
          type: null,
        };
      } else if (element?.frequency_type === "Recurrence") {
        frequency = {
          frequency_type: element?.frequency_type,
          morning: 0,
          midday: 0,
          evening: 0,
          night: 0,
          medicine_quantity: element?.recurrence_medicine_quantity,
          every_quantity: element?.recurrence_every_quantity,
          type: element?.recurrence_in_type,
        };
      } else {
        frequency = {
          frequency_type: element?.frequency_type,
          morning: 0,
          midday: 0,
          evening: 0,
          night: 0,
          medicine_quantity: element?.alternate_medicine_quantity,
          every_quantity: element?.alternate_every_quantity,
          type: element?.alternate_in_type,
        };
      }

      //Check for Quantity
      if (element?.quantities?.quantity_type === "Enough_Quantity") {
        quantities = {
          quantity_type: element?.quantities?.quantity_type,
          type: element?.quantities?.enough_type,
          quantity: element?.quantities?.enough_count,
        };
      } else {
        quantities = {
          quantity_type: element?.quantities?.quantity_type,
          type: element?.quantities?.exact_type,
          quantity: element?.quantities?.exact_count,
        };
      }

      finalObject = {
        ePrescriptionId: this.ePrescriptionId,
        medicineId: this.selectedMedicine?._id,
        doctorId: this.doctorId,
        medicine_name: this.selectedMedicine?.medicine_name,
        dose_no: element?.dose_no ? element?.dose_no : index + 1,
        frequency,
        take_for: element?.take_for,
        quantities,
      };

      dosages.push(finalObject);
    });

    console.log("REQUEST DATA====>", dosages);

    this.indiviualDoctorService
      .addEprescriptionMedicineDosages({ dosages })
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("Dosaged added===>", response);
        if (response.status) {
          this.dosageModal.close();
          this.toastr.success(response.message);
          this.getAllMedicineDosage();
        }
      });
  }

  handleDeleteMedicineDose(doseId, index) {
    console.log(doseId, index);
    if (doseId) {
      this.doseToBeDelete = { doseId, index };
      this.openVerticallyDeleteModal(this.deletepopup);
    } else {
      this.removeDosage(index);
    }

  }

  deleteMedicineDose() {
    let reqData = {
      doseId: this.doseToBeDelete?.doseId,
    };

    this.indiviualDoctorService.deleteMedicineDose(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      console.log("Delete response====>", response);
      if (response.status) {
        this.deleteModal.close();
        this.removeDosage(this.doseToBeDelete?.index);
        this.getAllMedicineDosage();
        this.toastr.success(response.message);
      }
    });
  }

  handleAdd(addFor: any, index) {
    if (addFor === "morning") {
      this.dosages
        .at(index)
        .patchValue({ morning: this.dosages.at(index).value.morning + 1 });
    }

    if (addFor === "midday") {
      this.dosages
        .at(index)
        .patchValue({ midday: this.dosages.at(index).value.midday + 1 });
    }
    if (addFor === "evening") {
      this.dosages
        .at(index)
        .patchValue({ evening: this.dosages.at(index).value.evening + 1 });
    }

    if (addFor === "night") {
      this.dosages
        .at(index)
        .patchValue({ night: this.dosages.at(index).value.night + 1 });
    }

    if (addFor === "take_for") {
      this.dosages.at(index).patchValue({
        take_for: {
          quantity: this.dosages.at(index).value.take_for.quantity + 1,
        },
      });
    }

    if (addFor === "enough_count") {
      this.dosages.at(index).patchValue({
        quantities: {
          enough_count:
            this.dosages.at(index).value.quantities.enough_count + 1,
        },
      });
    }

    if (addFor === "exact_count") {
      this.dosages.at(index).patchValue({
        quantities: {
          exact_count: this.dosages.at(index).value.quantities.exact_count + 1,
        },
      });
    }

    if (addFor === "recurrence_medicine_quantity") {
      this.dosages.at(index).patchValue({
        recurrence_medicine_quantity:
          this.dosages.at(index).value.recurrence_medicine_quantity + 1,
      });
    }

    if (addFor === "recurrence_every_quantity") {
      this.dosages.at(index).patchValue({
        recurrence_every_quantity:
          this.dosages.at(index).value.recurrence_every_quantity + 1,
      });
    }

    if (addFor === "alternate_medicine_quantity") {
      this.dosages.at(index).patchValue({
        alternate_medicine_quantity:
          this.dosages.at(index).value.alternate_medicine_quantity + 1,
      });
    }

    if (addFor === "alternate_every_quantity") {
      this.dosages.at(index).patchValue({
        alternate_every_quantity:
          this.dosages.at(index).value.alternate_every_quantity + 1,
      });
    }

    console.log("Form===>", this.dosageForm.value);
  }

  handleMinus(addFor: any, index) {
    if (addFor === "morning") {
      if (this.dosages.at(index).value.morning > 0) {
        this.dosages
          .at(index)
          .patchValue({ morning: this.dosages.at(index).value.morning - 1 });
      }
    }

    if (addFor === "midday") {
      if (this.dosages.at(index).value.midday > 0) {
        this.dosages
          .at(index)
          .patchValue({ midday: this.dosages.at(index).value.midday - 1 });
      }
    }
    if (addFor === "evening") {
      if (this.dosages.at(index).value.evening > 0) {
        this.dosages
          .at(index)
          .patchValue({ evening: this.dosages.at(index).value.evening - 1 });
      }
    }

    if (addFor === "night") {
      if (this.dosages.at(index).value.night > 0) {
        this.dosages
          .at(index)
          .patchValue({ night: this.dosages.at(index).value.night - 1 });
      }
    }

    if (addFor === "take_for") {
      if (this.dosages.at(index).value.take_for.quantity > 1) {
        this.dosages.at(index).patchValue({
          take_for: {
            quantity: this.dosages.at(index).value.take_for.quantity - 1,
          },
        });
      }
    }

    if (addFor === "enough_count") {
      if (this.dosages.at(index).value.quantities.enough_count > 0) {
        this.dosages.at(index).patchValue({
          quantities: {
            enough_count:
              this.dosages.at(index).value.quantities.enough_count - 1,
          },
        });
      }
    }

    if (addFor === "exact_count") {
      if (this.dosages.at(index).value.quantities.exact_count > 0) {
        this.dosages.at(index).patchValue({
          quantities: {
            exact_count:
              this.dosages.at(index).value.quantities.exact_count - 1,
          },
        });
      }
    }

    if (addFor === "recurrence_medicine_quantity") {
      if (this.dosages.at(index).value.recurrence_medicine_quantity > 0) {
        this.dosages.at(index).patchValue({
          recurrence_medicine_quantity:
            this.dosages.at(index).value.recurrence_medicine_quantity - 1,
        });
      }
    }

    if (addFor === "recurrence_every_quantity") {
      if (this.dosages.at(index).value.recurrence_every_quantity > 0) {
        this.dosages.at(index).patchValue({
          recurrence_every_quantity:
            this.dosages.at(index).value.recurrence_every_quantity - 1,
        });
      }
    }

    if (addFor === "alternate_medicine_quantity") {
      if (this.dosages.at(index).value.alternate_medicine_quantity > 0) {
        this.dosages.at(index).patchValue({
          alternate_medicine_quantity:
            this.dosages.at(index).value.alternate_medicine_quantity - 1,
        });
      }
    }

    if (addFor === "alternate_every_quantity") {
      if (this.dosages.at(index).value.alternate_every_quantity > 0) {
        this.dosages.at(index).patchValue({
          alternate_every_quantity:
            this.dosages.at(index).value.alternate_every_quantity - 1,
        });
      }
    }

    console.log("Form===>", this.dosageForm.value);
  }

  //--------------Form Array Handling----------------
  get dosages() {
    return this.dosageForm.controls["dosages"] as FormArray;
  }

  addNewDosage() {
    const dosage = this.fb.group({
      doseId: [""],
      dose_no: [null],
      frequency_type: ["Moment"],
      morning: [0],
      midday: [0],
      evening: [0],
      night: [0],

      recurrence_medicine_quantity: [0],
      recurrence_every_quantity: [0],
      recurrence_in_type: ["Days"],

      alternate_medicine_quantity: [0],
      alternate_every_quantity: [0],
      alternate_in_type: ["Minutes"],

      take_for: this.fb.group({
        quantity: [1],
        type: ["Days"],
      }),

      quantities: this.fb.group({
        quantity_type: ["Enough_Quantity"],
        enough_count: [0],
        exact_count: [0],
        enough_type: ["Days"],
        exact_type: ["Unit"],
      }),
    });
    this.dosages.push(dosage);
  }

  removeDosage(index: number) {
    this.dosages.removeAt(index);
  }

  // Imaging modal
  openVerticallyCenteredmedicine(medicinecontent: any) {
    this.modalService.open(medicinecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  // Rabeprazole modal
  openVerticallyCenteredrabeprazole(rabeprazolecontent: any) {
    this.dosageModal = this.modalService.open(rabeprazolecontent, {
      centered: true,
      size: "lg",
      windowClass: "rabeprazole",
    });
  }

  //  Delete Modal
  openVerticallyDeleteModal(deletepopup: any) {
    this.deleteModal = this.modalService.open(deletepopup, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }

  // Mew Medicine modal
  openVerticallyCenteredNewMedicine(newmedicinemodal: any) {
    this.modalService.open(newmedicinemodal, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
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

  recentPrescribedMedicines() {
    let parameters = {
      recentItemsFor: "Medicines",
      doctorId: this.doctorId,
    };

    this.indiviualDoctorService
      .getRecentPrescribedMedicinesList(parameters)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RECENT PRESCRIBED-->", response);

        response?.body.forEach(async (element) => {
          let obj = {
            _id: element?.medicineId,
            medicine_name: element?.medicine_name,
          };

          let result = this.recentPrescribedMedcinesList.filter((s) =>
            s?.medicine_name.includes(element.medicine_name)
          );
          if (result.length === 0) {
            this.recentPrescribedMedcinesList.push(obj);
          }
        });
      });
  }

  handleAddNewMedicine() {
    this.openVerticallyCenteredNewMedicine(this.newmedicinemodal);
  }

  saveNewMedicine(name) {
    console.log(name);

    let reqData = {
      medicines: [
        {
          medicine: {
            medicine_name: name,
            status: false,
          },
        },
      ],
      isNew: true,      
      added_by: this.doctorId,
      type: "Doctor",
      for_user: "63763d9eda5f0a2708aff9fe",
    };

    console.log("ReqData-->", reqData);

    this.sadminService.addMedicine(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response);
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
      }
    });
  }
}
