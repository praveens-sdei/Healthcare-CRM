import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { IndiviualDoctorService } from '../../individual-doctor/indiviual-doctor.service';
import { PatientService } from '../patient.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


// Medical Document Table
export interface PeriodicElement {
  sectionname: string;
  date: string;


}
const ELEMENT_DATA: PeriodicElement[] = [
  { sectionname: 'Document 1', date: '22-04-2022' },
  { sectionname: 'Document 1', date: '22-04-2022' },
  { sectionname: 'Document 1', date: '22-04-2022' },
  { sectionname: 'Document 1', date: '22-04-2022' },

];

// Appointment Table
export interface AppointmentPeriodicElement {
  doctorname: string;
  orderid: number;
  dateandtime: string;
  appointmenttype: string;
  hospitalorclinicname: string;
}
const APPONTMENT_ELEMENT_DATA: AppointmentPeriodicElement[] = [
  { doctorname: 'Dr.Kristin Watson', orderid: 1213213111, dateandtime: '08-21-2022  | 03:50Pm', appointmenttype: 'Home Visit', hospitalorclinicname: 'California Pacific Medical Center' },
  { doctorname: 'Dr.Kristin Watson', orderid: 1213213111, dateandtime: '08-21-2022  | 03:50Pm', appointmenttype: 'Home Visit', hospitalorclinicname: 'California Pacific Medical Center' },
  { doctorname: 'Dr.Kristin Watson', orderid: 1213213111, dateandtime: '08-21-2022  | 03:50Pm', appointmenttype: 'Home Visit', hospitalorclinicname: 'California Pacific Medical Center' },
  { doctorname: 'Dr.Kristin Watson', orderid: 1213213111, dateandtime: '08-21-2022  | 03:50Pm', appointmenttype: 'Home Visit', hospitalorclinicname: 'California Pacific Medical Center' },
  { doctorname: 'Dr.Kristin Watson', orderid: 1213213111, dateandtime: '08-21-2022  | 03:50Pm', appointmenttype: 'Home Visit', hospitalorclinicname: 'California Pacific Medical Center' },
];


// Medicine Table
export interface MedicinePeriodicElement {
  sectionname: string;
}
const MEDICINE_ELEMENT_DATA: MedicinePeriodicElement[] = [
  { sectionname: 'Current Medicine' },
  { sectionname: 'Past Medicine' },
];


// History Table
export interface HistoryPeriodicElement {

  PatientHistoryType: string;
  HistoryName: string;
  StartDate: string;
}
const HISTORY_ELEMENT_DATA: HistoryPeriodicElement[] = [

];
// alle
export interface AllergiPeriodicElement {

  AllergyType: string;

  StartDate: string;
}
const ALLERGY_ELEMENT_DATA: AllergiPeriodicElement[] = [

];
// LIFESTYLE_ELEMENT_DATA
export interface LifestylePeriodicElement {

  lifestyleType: string;
  lifestyleName: string;
  StartDate: string;
}
const LIFESTYLE_ELEMENT_DATA: LifestylePeriodicElement[] = [

]

// falimy history 
export interface FamlyPeriodicElement {

  Releationship: string;
  familyhistoytype: string;
  historyname: string;
  StartDate: string;
}
const FAMLY_ELEMENT_DATA: FamlyPeriodicElement[] = [

]



@Component({
  selector: 'app-patient-rolepermission',
  templateUrl: './patient-rolepermission.component.html',
  styleUrls: ['./patient-rolepermission.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientRolepermissionComponent implements OnInit {

  selectedPurmission: any = {
    "medical_documents": [],
    "appointment": [],
    "vital": false,
    "history": {
      "alergy": [],
      "patient_history": [],
      "family_history": [],
      "lifestyle": [],
    },
    "immunization": false,
    "medicine": { "current_medicine": false, "past_medicine": false }
  }
  activemainmenuselectedid: any = "medical_documents"
  loginuser_id: any
  DoctorList2: any[] = [];
  overlay: false;
  documentList: any[] = []
  doctorList: any[] = []
  pastappointmentdataSource: any[] = []
  vitalsList: any[] = []
  historyDetails: any
  // Medical Document Table
  displayedColumns: string[] = ['sectionname', 'date', 'selectall'];
  dataSource = ELEMENT_DATA;

  // Appointment Table
  appointmentdisplayedColumns: string[] = ['doctorname', 'orderid', 'dateandtime', 'appointmenttype', 'hospitalorclinicname', 'selectall'];
  appointmentdataSource = APPONTMENT_ELEMENT_DATA;

  // Medicine Table
  medicinedisplayedColumns: string[] = ['sectionname', 'selectall'];
  medicinedataSource = MEDICINE_ELEMENT_DATA;


  // History Table
  historydisplayedColumns: string[] = ['PatientHistoryType', 'HistoryName', 'StartDate', 'selectall'];
  historydataSource = HISTORY_ELEMENT_DATA

  // ALLERGY Table
  allergydisplayedColumns: string[] = ['AllergyType', 'StartDate', 'selectall'];
  allergydataSource = ALLERGY_ELEMENT_DATA
  // Lifestyle
  lifestyledisplayedColumns: string[] = ['lifestyleType', 'lifestyleName', 'StartDate', 'selectall'];

  lifestyledataSource = LIFESTYLE_ELEMENT_DATA
  // famly history


  familyledisplayedColumns: string[] = ['Releationship', 'familyhistoytype', 'historyname', 'StartDate', 'selectall'];

  familydataSource = FAMLY_ELEMENT_DATA

  staffError: any = false
  selecteddoctorlist: any = '';


  constructor(
    private modalService: NgbModal,
    private _patientService: PatientService,
    private _CoreService: CoreService,
    private indiviualDoctorService: IndiviualDoctorService,
    private toastr: ToastrService,
    private router: Router,
    private loader : NgxUiLoaderService

  ) {
    const userData = this._CoreService.getLocalStorage("loginData");
    this.loginuser_id = userData._id
  }

  ngOnInit(): void {
    this.getMedicalDocument()
    this.getAllDoctorList()
    this.getPastAppointment()
    this.getpatientdetails()
  }

  makeJSON(value: any, menuID: any, innersubmenu = '') {
    console.log(" this.selectedPurmission", this.selectedPurmission)
    console.log(" this.selectedPurmission", menuID)
    console.log(" this.selectedPurmission", value)
    if (value) {




      console.log(" this.selectedPurmission", this.selectedPurmission)
      console.log(" this.selectedPurmission", menuID)
      console.log(" this.selectedPurmission", value)


      if (menuID == "medical_documents") {
        this.documentList.forEach((element: any, index: any) => {
          this.selectedPurmission[menuID].push(element._id)



        })
      }

      if (menuID == "appointment") {
        this.pastappointmentdataSource.forEach((element: any, index: any) => {
          this.selectedPurmission[menuID].push(element.appointment_id)



        })
      }
      if (menuID == "history" && innersubmenu != '') {



        if (innersubmenu != 'all') {
          let datalist = []
          switch (innersubmenu) {
            case 'patient_history':
              datalist = this.historydataSource
              break;
            case 'alergy':


              datalist = this.allergydataSource
              break;
            case 'lifestyle':
              datalist = this.lifestyledataSource
              break;
            case 'family_history':
              datalist = this.familydataSource
              break;

          }

          if (datalist.length > 0) {

            datalist.forEach((element: any, index: any) => {
              this.selectedPurmission[menuID][innersubmenu].push(element._id)
            })
          }

        } else {

          this.allergydataSource.forEach((element: any, index: any) => {
            this.selectedPurmission[menuID]['alergy'].push(element._id)
          })
          this.lifestyledataSource.forEach((element: any, index: any) => {
            this.selectedPurmission[menuID]['lifestyle'].push(element._id)



          })
          this.familydataSource.forEach((element: any, index: any) => {
            this.selectedPurmission[menuID]['family_history'].push(element._id)



          })

          this.historydataSource.forEach((element: any, index: any) => {
            this.selectedPurmission[menuID]['patient_history'].push(element._id)



          })

        }


      }
      if (menuID == "vital") {
        this.selectedPurmission[menuID] = true


      }
      if (menuID == "immunization") {
        this.selectedPurmission[menuID] = true


      }

      if (menuID == "medicine") {
        this.selectedPurmission[menuID]['past_medicine'] = true
        this.selectedPurmission[menuID]['current_medicine'] = true
      }



      console.log(" this.selectedPurmission", this.selectedPurmission)

    } else {

      if (menuID == "history" && innersubmenu != '') {
        if (innersubmenu != "all") {
          this.selectedPurmission[menuID][innersubmenu] = []
        } else {
          this.selectedPurmission[menuID]["alergy"] = []
          this.selectedPurmission[menuID]["lifestyle"] = []
          this.selectedPurmission[menuID]["family_history"] = []
          this.selectedPurmission[menuID]["patient_history"] = []
        }
      }
      else if (menuID == "immunization") {
        this.selectedPurmission[menuID] = false
      }


      else if (menuID == "medicine") {
        this.selectedPurmission[menuID]['past_medicine'] = false
        this.selectedPurmission[menuID]['current_medicine'] = false


      }


      else if (menuID == "vital") {
        this.selectedPurmission[menuID] = false
      }
      else {
        this.selectedPurmission[menuID] = []
      }

    }
  }


  checkedsubMenuArray(menuid, submenu, innersubmenu = '') {
    var checkIndex

    if (menuid == "history") {

      if (innersubmenu != '') {


        this.selectedPurmission[menuid][innersubmenu].forEach((element: any, index: any) => {
          if (element == submenu) {
            checkIndex = true
          }
        })
      }



    } else if (menuid == "medicine") {

      let actual

      if (submenu == 'Current Medicine') {
        actual = 'current_medicine'

      } else {
        actual = 'past_medicine'


      }

      checkIndex = this.selectedPurmission[menuid][actual]
    }



    else {




      this.selectedPurmission[menuid].forEach((element: any, index: any) => {
        if (element == submenu) {
          checkIndex = true
        }
      })
    }
    return checkIndex
  }



  removesubmenu(menuid, submenu, event, innersubmenu = '') {

    if (event.checked) {

      if (menuid == 'history' && innersubmenu != '') {

        this.selectedPurmission[menuid][innersubmenu].push(submenu)

      }
      if (menuid == 'medicine') {
        let actual

        if (submenu == 'Current Medicine') {
          actual = 'current_medicine'

        } else {
          actual = 'past_medicine'


        }
        this.selectedPurmission[menuid][actual] = true;



      }
      else {

        this.selectedPurmission[menuid].push(submenu)
      }
    }
    else {

      if (menuid == 'history' && innersubmenu != '') {

        if (this.selectedPurmission[menuid][innersubmenu].length > 0) {
          let index = this.selectedPurmission[menuid][innersubmenu].indexOf(submenu)
          if (index != -1) {

            this.selectedPurmission[menuid][innersubmenu].splice(index, 1)
          }
        }
      }
      else

        if (menuid == "medicine") {

          let actual

          if (submenu == 'Current Medicine') {
            actual = 'current_medicine'
          } else {
            actual = 'past_medicine'
          }
          this.selectedPurmission[menuid][actual] = false
        }



      {

        if (this.selectedPurmission[menuid].length > 0) {
          let index = this.selectedPurmission[menuid].indexOf(submenu)
          if (index != -1) {

            this.selectedPurmission[menuid].splice(index, 1)
          }

        }
      }
    }

  }

  handleStaffChange(data: any) {
    // 
    console.log(data, "data")
    if (data != '') {
      this.staffError = false
      this.selecteddoctorlist = data.value;
      this.getPermission(data.value)
    }
    else {
      this.selecteddoctorlist = '';
    }



  }




  getMedicalDocument() {
    this._patientService.patientExistingDocs({ patientId: this.loginuser_id }).subscribe({
      next: (res) => {

        let result = this._CoreService.decryptObjectData({ data: res })
        this.documentList = result?.data
        // console.log("result", result)

      }
    })
  }

  async getAllDoctorList() {
    this._patientService.getAllDoctor().subscribe({
      next: async (res) => {

        let result = this._CoreService.decryptObjectData({ data: res })

        this.doctorList = result?.data
        this.DoctorList2 = await this._CoreService.createselect22array(this.doctorList, 'full_name', 'for_portal_user', 'Select Doctor')
        console.log("result", this.DoctorList2)
      },
      error: (err) => {
        console.log(err)
      }
    })


  }

  getPastAppointment() {
    let reqData = {
      patient_portal_id: this.loginuser_id,
      // patient_portal_id: "63d0f8213c4b44b6397794ff",
      limit: 5,
      page: 1,
      status: "PAST",
    };
    console.log(reqData);

    this.indiviualDoctorService
      .getPastAppointOfPatient(reqData)
      .subscribe((res) => {
        let response = this._CoreService.decryptObjectData({ data: res });
        console.log("response______________",response);
        

        // this.pastappointmentdataSource = response?.data?.data;

        this.pastappointmentdataSource = response?.data?.data
        // console.log("PAST APPOINTMENT==>", this.pastappointmentdataSource);
        // this.totalLength = response?.data?.totalCount;
      });
  }


  done() {

    console.log(this.selectedPurmission)



  }

  getpatientdetails() {
    this._patientService.profileDetails({ patient_id: this.loginuser_id }).subscribe({
      next: (res) => {

        let result = this._CoreService.decryptObjectData({ data: res })
        this.historyDetails = result?.body?.historyDetails
        this.historydataSource = result?.body?.historyDetails?.patient_history
        this.allergydataSource = result?.body?.historyDetails?.allergies
        this.lifestyledataSource = result?.body?.historyDetails?.lifestyle
        this.familydataSource = result?.body?.historyDetails?.familial_history
        // this.doctorList = result?.data
        // console.log("result", this.historyDetails)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


  getPermission(id: any) {
    let param = {
      doctor_id: id?._id,
      patient_id: this.loginuser_id

    }
    this._patientService.getPermission(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res })
        if (result.status) {
          // this.toastr.success(result.message);
          if (result.body.length > 0) {
            this.selectedPurmission = result.body[0].permission;
            console.log("AAAAA--->", this.selectedPurmission);

          }
          else {
            this.selectedPurmission = {
              "medical_documents": [],
              "appointment": [],
              "vital": false,
              "history": {
                "alergy": [],
                "patient_history": [],
                "family_history": [],
                "lifestyle": [],
              },
              "immunization": false,
              "medicine": { "current_medicine": false, "past_medicine": false }
            }
          }

        } else {
          this.toastr.error(result.message);
        }
        console.log(result)
      },
      error: (err) => {
        console.log(err)
      }
    })

  }
  checkdoctordata() {
    this.staffError = true;
  }


  setPermission() {
    console.log("test", this.selecteddoctorlist, this.selectedPurmission);
    if (this.selecteddoctorlist != '') {
      this.loader.start();
      this.staffError = false;
      let param = {
        doctor_id: this.selecteddoctorlist,
        patient_id: this.loginuser_id,
        permission: this.selectedPurmission
      }
      console.log(param);

    this._patientService.setPermission(param).subscribe({
      next: (res) => {
        let result = this._CoreService.decryptObjectData({ data: res })
        if (result.status) {
          this.loader.stop();
          this.toastr.success(result.message);
      setTimeout(() => {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
          this.router.navigate([`/patient/rolepermission/`,]).then(()=>{
          })
          })
      }, 100);  
        } else {
          this.loader.stop();
          this.toastr.error(result.message);
        }
      },
      error: (err) => {
        this.loader.stop();
        console.log(err)
      }
    })
  }
  else{
    this.loader.stop();
    this.staffError = true;
  }
  }




  //  Medical Document  modal
  openVerticallyCenteredmedicaldocument(medicaldocument_content: any, medicaldoc: any) {

    this.activemainmenuselectedid = medicaldoc;
    this.modalService.open(medicaldocument_content, { centered: true, backdrop: "static", size: 'lg', windowClass: "medical_document" });
  }

  //  Appointment modal
  openVerticallyCenteredappointment(appointment_content: any, appointment: any) {

    this.activemainmenuselectedid = appointment;
    this.modalService.open(appointment_content, { centered: true, backdrop: "static", size: 'lg', windowClass: "appointment" });
  }

  //  Medicine  modal
  openVerticallyCenteredmedicine(medicine_content: any, medicine: any) {
    this.activemainmenuselectedid = medicine;
    this.modalService.open(medicine_content, { centered: true, size: 'md', backdrop: "static", windowClass: "medicine" });
  }

  //  History  modal
  openVerticallyCenteredhistory(history_content: any, history: any) {
    this.activemainmenuselectedid = history;
    this.modalService.open(history_content, { centered: true, size: 'lg', backdrop: "static", windowClass: "history" });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}