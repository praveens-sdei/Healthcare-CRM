import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IndiviualDoctorService } from "../../../app/modules/individual-doctor/indiviual-doctor.service";
import { CoreService } from '../core.service';
import { FormioOptions } from "angular-formio";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FourPortalService } from 'src/app/modules/four-portal/four-portal.service';
@Component({
  selector: 'app-consultationnotes',
  templateUrl: './consultationnotes.component.html',
  styleUrls: ['./consultationnotes.component.scss']
})
export class ConsultationnotesComponent implements OnInit {
  consulatationData: any = '';
  loggedInUserId: any;
  templateData: any = [];
  templateName: any = '';
  jsonFormDatastring: any;
  @Input() appointmentId: any;
  @Input() callby: string;
  @Input() portal_type: string='';


  @Output("openVerticallyCenteredconfirmationappointment") openVerticallyCenteredconfirmationappointment: EventEmitter<any> = new EventEmitter();
  @Output("openVerticallyCenteredaddeprescription") openVerticallyCenteredaddeprescription: EventEmitter<any> = new EventEmitter();
  userType: any;
  userRole: any;




  constructor(private doctorService: IndiviualDoctorService, private _coreService: CoreService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private modalService: NgbModal, private route: Router, private fourPortalService: FourPortalService) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.loggedInUserId = loginData._id;
    this.userType = loginData?.type;
    this.userRole = loginData?.role;
  }
  jsonFormData: any;
  appointmentstatus: any = '';
  formioOptions: FormioOptions = {
    disableAlerts: true,
  };
  initialFormValues: any = ''
  ngOnInit(): void {

    if (this.userRole === 'INDIVIDUAL_DOCTOR' || this.userRole === 'HOSPITAL_DOCTOR') {
      this.viewDoctorAppointment();
    } else
     if (this.userRole === 'INDIVIDUAL' || this.userRole === 'HOSPITAL') {
      this.fourPortal_AppointmentDetails();
    }


    if(this.userType  || (this.portal_type && this.portal_type !== null)){
      console.log("????");
      
      this.fourPortal_AppointmentDetails();
    }else{
      this.viewDoctorAppointment();
    }

console.log("portal_type====",this.portal_type);



  }

  viewDoctorAppointment() {
      this.doctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe(
        async (res) => {
          let response = await this._coreService.decryptObjectData({ data: res });
          console.log("APPOINTMENT DETAILS====>", response);
          this.appointmentstatus = response?.data?.appointmentDetails?.status

          if (response?.data?.otherinfo?.ANSJSON) {
            this.initialFormValues = JSON.parse(response?.data?.otherinfo?.ANSJSON);
            this.consulatationData = response?.data?.otherinfo?.consultationData;
            this.jsonFormData = JSON.parse(response?.data?.otherinfo?.templateJSON || "");
          }
          else {
            this.getTemplateBuilderList();
          }
        });
  }

  gettemplatedatabyid(id: any = '') {
    if(this.userRole === 'INDIVIDUAL_DOCTOR' || this.userRole === 'HOSPITAL_DOCTOR'){
      this.templateName = id;
      this.doctorService
        .editTemplateBuilder(id)
        .subscribe((res: any) => {
          let response = this._coreService.decryptObjectData({ data: res });
          if (response.status == true) {
            this.jsonFormData = JSON.parse(response.body.template_json || "");
            this.jsonFormDatastring = response.body.template_json;
          } else {
            this.toastr.error(response.message);
          }
        });
    } else if  (this.userRole === 'INDIVIDUAL' || this.userRole === 'HOSPITAL') {
      this.templateName = id;
      this.fourPortalService.editTemplateBuilder(id, this.userType) .subscribe((res: any) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("response===",response);
        
        if (response.status == true) {
          this.jsonFormData = JSON.parse(response.body.template_json || "");
          this.jsonFormDatastring = response.body.template_json;
        } else {
          this.toastr.error(response.message);
        }
      });
    }
   
  }

  getTemplateBuilderList() {
    let reqData = {
      page: 1,
      limit: 0,
      doctorId: this.loggedInUserId,
      searchText: '',
    };
    this.doctorService.gettemplateBuilderListApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.templateData = response?.body?.result;
      console.log(this.templateData);
    });
  }
  onSubmitTemplate(event) {
    // console.log(JSON.stringify(event));
    // console.log(this.consulatationData, 'consulatationdaat');

    if(this.userRole === 'INDIVIDUAL_DOCTOR' || this.userRole === 'HOSPITAL_DOCTOR'){

      let reqData = {
        appointment_id: this.appointmentId,
        columnData: {
          consultationData: this.consulatationData,
          templateJSON: this.jsonFormDatastring,
          ANSJSON: JSON.stringify(event)
        }
      };
  
      console.log("REQDATA", reqData);
  
      this.doctorService.updateConsultation(reqData).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData({ data: res });
          console.log("RESPONSE===>", response);
          if (response.status) {
            this.modalService.dismissAll("close");
            this.toastr.success(response.message);
            if (this.callby == 'videocall') {
              this.openVerticallyCenteredaddeprescription.emit();
            }
            else if (this.callby == 'patientappointment') {
  
            }
            else {
              console.log(this.appointmentstatus, "appointmentstatus");
  
              if (this.appointmentstatus != 'Past') {
                this.openVerticallyCenteredconfirmationappointment.emit();
  
              }
              else {
                this.route.navigateByUrl("/", { skipLocationChange: true }).then(() => {
                  this.route.navigate(["/individual-doctor/appointment/appointmentdetails/" + this.appointmentId]).then(() => {
                    // console.log(`After navigation I am on:${this.router.url}`)
                  })
                })
                // this.route.navigate([])
              }
              // this.openVerticallyCenteredconfirmationappointment(this.confirmationMessage)
            }
  
            // this.route.navigate(["/individual-doctor/appointment"]);
          }
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.message);
        }
      );

    }  else if  (this.userRole === 'INDIVIDUAL' || this.userRole === 'HOSPITAL') {

      let reqData = {
        appointment_id: this.appointmentId,
        columnData: {
          consultationData: this.consulatationData,
          templateJSON: this.jsonFormDatastring,
          ANSJSON: JSON.stringify(event)
        }
      };
  
      console.log("REQDATA", reqData);
  
      this.fourPortalService.fourPortal_paymentReceived(reqData).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData({ data: res });
          console.log("RESPONSE===>", response);
          if (response.status) {
            this.modalService.dismissAll("close");
            this.toastr.success(response.message);
            if (this.callby == 'videocall') {
              this.openVerticallyCenteredaddeprescription.emit();
            }
            else if (this.callby == 'patientappointment') {
  
            }
            else {
              console.log(this.appointmentstatus, "appointmentstatus");
  
              if (this.appointmentstatus != 'Past') {
                this.openVerticallyCenteredconfirmationappointment.emit();
  
              }
              else {
                this.route.navigateByUrl("/", { skipLocationChange: true }).then(() => {
                  this.route.navigate([`portals/appointment/${this.userType}/appointment-details/` + this.appointmentId]).then(() => {
                    // console.log(`After navigation I am on:${this.router.url}`)
                  })
                })
                // this.route.navigate([])
              }
              // this.openVerticallyCenteredconfirmationappointment(this.confirmationMessage)
            }
  
            // this.route.navigate(["/individual-doctor/appointment"]);
          }
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.message);
        }
      );
    }

  

  }



  fourPortal_AppointmentDetails() {
    let reqData = {
      appointment_id: this.appointmentId,
      portal_type:this.portal_type ? this.portal_type : this.userType
    }
    this.fourPortalService
      .fourPortal_appointment_deatils(reqData)  .subscribe(
        async (res) => {
          let response = await this._coreService.decryptObjectData({ data: res });
          console.log("APPOINTMENT DETAILS====>", response);
          this.appointmentstatus = response?.data?.appointmentDetails?.status

          if (response?.data?.otherinfo?.ANSJSON) {
            this.initialFormValues = JSON.parse(response?.data?.otherinfo?.ANSJSON);
            this.consulatationData = response?.data?.otherinfo?.consultationData;
            this.jsonFormData = JSON.parse(response?.data?.otherinfo?.templateJSON || "");
          }
          else {
            this.fourPortal_getTemplateBuilderList();
          }
        });
  }

  fourPortal_getTemplateBuilderList() {
    let reqData = {
      page: 1,
      limit: 0,
      userId: this.loggedInUserId,
      searchText: '',
      sort: '',
      type: this.userType
    };
    this.fourPortalService.gettemplateBuilderListApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response===",response);
      
      this.templateData = response?.body?.result;
      console.log(this.templateData);
    });
  }
}
