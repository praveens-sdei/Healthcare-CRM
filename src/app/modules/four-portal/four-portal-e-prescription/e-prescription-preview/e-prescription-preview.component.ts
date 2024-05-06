import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";

@Component({
  selector: 'app-e-prescription-preview',
  templateUrl: './e-prescription-preview.component.html',
  styleUrls: ['./e-prescription-preview.component.scss'],
})
export class EPrescriptionPreviewComponent implements OnInit {
  filterForm: any = FormGroup;
  appointmentId: any = "";
  doctorId: any = "";
  patient_id: any = "";
  patientDetails: any;
  userDetails: any;

  eprescriptionDetails: any;

  dosages: any[] = [];
  labs: any[] = [];
  imaging: any[] = [];
  vaccination: any[] = [];
  eyeglasses: any[] = [];
  others: any[] = [];

  totalCounts: any = 0;
  doctorLocationDetails: any;
  userRole: any = "";

  locationForClinic: any;
  locationForHospital: any;
  patientName:any=""
  userType: any;
  userId: any;
  patientAllDetails: any;
  medicineData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private coreService: CoreService,
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
    this.userRole = loginData?.role;
    this.userType = loginData?.type
    this.userId = loginData?._id
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userDetails = adminData;
    this.patientName = sessionStorage.getItem("patientName");
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get("id");

    this.getAppointmentDetails();
    this.getEprescription();
    this.getAllEprescriptionsTests();
    this.getLocationInfo();
    this.getHospitalOrClinicLocations();
  }

  async getAppointmentDetails() {
    let reqData = {
      appointment_id: this.appointmentId,
      portal_type:this.userType
    }
    this.fourPortalService
      .fourPortal_appointment_deatils(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });    
          
        if (response.status) {
          this.patientDetails = response?.data?.patinetDetails;
          
          this.patientAllDetails = response?.data?.patientAllDetails;     
          this.medicineData =  this.patientAllDetails?.medicineDetails?.current_medicines[ this.patientAllDetails?.medicineDetails?.current_medicines.length - 1];  
        }
      });
  }

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
      portal_type:this.userType
    };

    this.fourPortalService
      .fourPortal_get_ePrescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });
        console.log("response?.body______________",response?.body);
        
        if (response.status) {
          this.eprescriptionDetails = response?.body;
          this.patchPatientDetails(this.eprescriptionDetails)
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
      portal_type: this.userType
    };
    this.fourPortalService
      .fourPortal_get_all_testEprescription(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          let data = response?.body[0];
          console.log("data_______________",data);
          
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
      portalId: this.userId, 
      type:this.userType

    };

    this.fourPortalService.fourPortal_getlocationbyid(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.setDoctorLocation(response?.body);
      }
    });
  }

  async setDoctorLocation(data: any) {
    await this.getLocationInfoWithNames(data).then((res: any) => {
      this.doctorLocationDetails = res;
      
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
          resolve(response?.body);
          reject(response?.body);
        });
    });
  }

  async getHospitalOrClinicLocations() {
    let params = {
      portal_user_id: this.userId, 
      type:this.userType

    };
    this.fourPortalService
      .getLocations(params)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        let locationList = response?.data[0]?.hospital_or_clinic_location;

        locationList.forEach(async (element) => {
          if (
            element?.locationFor === "clinic" &&
            this.userRole === "INDIVIDUAL"
          ) {
            await this.getLocationInfoWithNames(element).then((res: any) => {
              this.locationForClinic = {
                clinicName: element?.hospital_name,
                ...res,
              };
            });

            return;
          }

          if (
            element?.locationFor === "hospital" &&
            this.userRole === "HOSPITAL") {
            this.locationForHospital = element;
            return;
          }
        });
      });
  }


  routeBack(){
    this.route.navigate([`/portals/eprescription/${this.userType}/details/${this.appointmentId}`])
  }

  RouteToNext(){
    this.route.navigate([`/portals/eprescription/${this.userType}/validate-eprescription/${this.appointmentId}`])
    
  }
  addComma(data: string): string {
    return data ? ', ' : '';
  }
}

