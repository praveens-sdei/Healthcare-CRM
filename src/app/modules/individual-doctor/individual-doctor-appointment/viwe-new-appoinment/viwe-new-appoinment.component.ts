import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { IndiviualDoctorService } from 'src/app/modules/individual-doctor/indiviual-doctor.service';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { Router, ActivatedRoute } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormArray,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-viwe-new-appoinment',
  templateUrl: './viwe-new-appoinment.component.html',
  styleUrls: ['./viwe-new-appoinment.component.scss']
})
export class ViweNewAppoinmentComponent implements OnInit {
  appointment_id: any
  doctor_basic_info: any
  appointmentDetails: any
  patientDetails: any
  paymentDetailsForm: FormGroup
  DoctorRating:any
  doctor_id: any
  patient_document: any[]
  constructor(private modalService: NgbModal,
    private _indiviualDoctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private _PatientService: PatientService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toster: ToastrService) {
    this.route.queryParams.subscribe((res) => {
      this.appointment_id = res["appointment_id"]
      console.log("res", this.appointment_id)
    })



  }

  ngOnInit(): void {
    this.viweAppoinment()
  }

  viweAppoinment() {
    let prama = {
      appointment_id: this.appointment_id

    }
    this._indiviualDoctorService.viewAppoinment(prama).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res })
        this.doctor_basic_info = result?.data?.doctor_basic_info[0]
        this.appointmentDetails = result?.data?.result
        this.doctor_id = result?.data?.result?.doctorId?._id
        this.patientDetails = result?.data?.result?.patientDetails
        this.patient_document = result?.data.patient_document
        this.DoctorRating=result?.data?.doctor_rating
        console.log(result)
        // console.log("this.patientDetails", this.patientDetails)
      },
      error: (err) => {
        console.log(err)
      }

    })

  }









}
