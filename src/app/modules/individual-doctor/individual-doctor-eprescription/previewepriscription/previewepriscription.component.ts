import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HospitalService } from "src/app/modules/hospital/hospital.service";

@Component({
  selector: "app-previewepriscription",
  templateUrl: "./previewepriscription.component.html",
  styleUrls: ["./previewepriscription.component.scss"],
})
export class PreviewepriscriptionComponent implements OnInit {
  filterForm: any = FormGroup;
  appointmentId: any = "";
  doctorId: any = "";
  patient_id: any = "";
  patientDetails: any;
  doctorDetails: any;

  eprescriptionDetails: any;

  dosages: any[] = [];
  labs: any[] = [];
  imaging: any[] = [];
  vaccination: any[] = [];
  eyeglasses: any[] = [];
  others: any[] = [];

  totalCounts: any = 0;
  doctorLocationDetails: any;
  doctorRole: any = "";

  locationForClinic: any;
  locationForHospital: any;
  patientName:any=""
  medicineData: any;
  patientAllDetails: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private sadminService: SuperAdminService,
    private modalService: NgbModal,
    private route: Router,
    private fb: FormBuilder,
    private indiviualDoctorService: IndiviualDoctorService,
    private hospitalService: HospitalService
  ) {
    this.filterForm = this.fb.group({
      height: [""],
      weight: [""],
      bmi: [""],
      bmi_inetpreter: [""],
      liver_failure: [""],
      renal_failure: [""],
      accident_related: [false],
      occupational_desease: [false],
      free_of_charge: [false],
    });
  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorRole = loginData?.role;
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.doctorDetails = adminData;
    this.patientName = sessionStorage.getItem("patientName");
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("Appointment Id=====>", this.appointmentId);

    this.getAppointmentDetails();
    this.getEprescription();
    this.getAllEprescriptionsTests();
    this.getLocationInfo();
    this.getHospitalOrClinicLocations();
  }

  async getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.patientDetails = response?.data?.patinetDetails;
          this.patientAllDetails = response?.data?.patientAllDetails;
  
          console.log("DEtails====>", response);
  
          console.log("PATIENT  DETAILS====>", this.patientDetails);
          // this.patchPatientDetails(this.patientAllDetails);
        }
      });
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
          this.patchPatientDetails(response?.body);
        }
      });
  }

  patchPatientDetails(data) {    
    this.filterForm.patchValue({
      height: data?.patientBiometric?.height,
      weight: data?.patientBiometric?.weight,
      bmi: data?.patientBiometric?.bmi,
      liver_failure: data?.liverFailure,
      renal_failure: data?.renalFailure,
      accident_related: data?.accidentRelated,
      occupational_desease: data?.occupationalDesease,
      free_of_charge: data?.freeOfCharge,
    });
  }


  listMedicineDosages: any[] = [];
  allDosages: any[] = [];

  getAllEprescriptionsTests() {
    let reqData = {
      appointmentId: this.appointmentId,
    };
    this.indiviualDoctorService
      .getAllEprescriptionTests(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          let data = response?.body[0];
          //For MEdicine Dosage
          // if(data.length!=0){
            this.allDosages = data?.dosages;

            data?.dosages.forEach(async (element) => {
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
  
            this.labs = data?.labs;
            console.log(" this.labs ", this.labs,data );
            
            this.imaging = data?.imaging;
            this.vaccination = data?.vaccinations;
            this.eyeglasses = data?.eyeglasses;
            this.others = data?.others;
  
            this.totalCounts =
              this.listMedicineDosages?.length +
              this.labs?.length +
              this.vaccination?.length +
              this.others?.length +
              this.eyeglasses?.length +
              this.imaging?.length;
          }
          // }
        
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

  getLocationInfo() {
    let params = {
      doctorId: this.doctorDetails?.for_portal_user, //doctorId
    };

    this.indiviualDoctorService.getLocationInfo(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Location Info-->", response);
      if (response.status) {
        this.setDoctorLocation(response?.body);
      }
    });
  }

  async setDoctorLocation(data: any) {
    await this.getLocationInfoWithNames(data).then((res: any) => {
      this.doctorLocationDetails = res;
      console.log(" this.doctorLocationDetails", this.doctorLocationDetails);
      
    });
  }

  async getLocationInfoWithNames(data: any) {
    let reqData = {
      location: {
        ...data,
      },
    };

    return new Promise((resolve, reject) => {
      this.indiviualDoctorService
        .getLocationInfoWithNames(reqData)
        .subscribe(async (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Location with Names", response);
          resolve(response?.body);
          reject(response?.body);
        });
    });
  }

  async getHospitalOrClinicLocations() {
    this.hospitalService
      .getLocations(this.doctorDetails?.for_portal_user)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("LOCATIONS LIST CLINIC/HOSPITAL===>", response);
        let locationList = response?.data[0]?.hospital_or_clinic_location;

        locationList.forEach(async (element) => {
          if (
            element?.locationFor === "clinic" &&
            this.doctorRole === "INDIVIDUAL_DOCTOR"
          ) {
            await this.getLocationInfoWithNames(element).then((res: any) => {
              console.log("FOR CLINIC----->", res);
              this.locationForClinic = {
                clinicName: element?.hospital_name,
                ...res,
              };
            });

            return;
          }

          if (
            element?.locationFor === "hospital" &&
            this.doctorRole === "HOSPITAL_DOCTOR"
          ) {
            this.locationForHospital = element;
            return;
          }
        });
      });
  }
  addComma(data: string): string {
    return data ? ', ' : '';
  }
}
