import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { DatePipe } from "@angular/common";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { PatientService } from 'src/app/modules/patient/patient.service';
import { InsuranceSubscriber } from 'src/app/modules/insurance/insurance-subscriber.service';
@Component({
  selector: 'app-patientdetails',
  templateUrl: './patientdetails.component.html',
  styleUrls: ['./patientdetails.component.scss']
})
export class PatientdetailsComponent implements OnInit {
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  id: any;
  insuranceDetails: any;
  profile: any;
  country: any = "";
  locationData: any;
  region: any;
  showprimary:Boolean;
  showsecondaryAlso:Boolean;
  constructor(   private acctivatedRoute: ActivatedRoute,
    private _coreService: CoreService,
     private service: PatientService,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private sadminService: SuperAdminService,
    private coreService: CoreService,
    private modalService: NgbModal,
    private route: Router,
    private insuranceSubscriber: InsuranceSubscriber,
    // private insuranceSubscriber: InsuranceSubscriber,
    // private fb: FormBuilder,
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      // Use the extracted ID for further processing
      console.log(this.id);
    });
    this.getAllDetails();
    this.getCountryList();
    // this.getRegionList(this.locationData?.country);
  }
  primaryInsurance: any=[];
  secondaryInsurance: any=[];

  viewSubscriberDetails(subscriberId: any) {
    this.insuranceSubscriber
      .viewSubscriberDetails(subscriberId)
      .subscribe((res: any) => {
        const response = this._coreService.decryptObjectData(JSON.parse(res));
        this.primaryInsurance = response.body.subscriber_details;
        this.secondaryInsurance =
          response?.body?.subscriber_details?.secondary_subscriber[0];


        console.log("this.primaryInsurance", this.primaryInsurance);
        console.log("this.secondaryInsurance", this.secondaryInsurance);
      });
  }
  getAllDetails() {
    let params = {
      patient_id: this.id,
       doctor_id:"",
    };
    console.log(params);
    this.service.profileDetails(params).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });

        console.log("PATIENT DETAILS====>", response);
        
          this.profile = {
            ...response?.body?.personalDetails,
            ...response?.body?.portalUserDetails,
           ...response?.body?.familyDetails?.family_members[0]
          };
      
       
          this.insuranceDetails = response?.body?.insuranceDetails;

          if (response?.body?.insuranceDetails?.primary_subscriber_id) {
            this.viewSubscriberDetails(
              response?.body?.insuranceDetails?.primary_subscriber_id
            );
          }


      if(this.insuranceDetails){
          if(this.insuranceDetails.subscriber_id==this.insuranceDetails.primary_subscriber_id)
          {
            this.showprimary=true
            this.showsecondaryAlso=false
            console.log(this.showprimary,"this.showprimaryOnly");
            
          }
          this.insuranceDetails.secondary_subscriber_ids.map((ele:any)=>{
              if(this.insuranceDetails.subscriber_id==ele){
                this.showprimary=true
                this.showsecondaryAlso=true
                console.log(this.showsecondaryAlso,"this.showprimaryOnly");
                
              }
          })
      }


          this.locationData = response?.body?.locationDetails;
          if (this.locationData) {
            this.getCountryList();
            this.getRegionList(this.locationData?.country);
 
          }

        
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }
  //-------------Calling address api's---------------
  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.country) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getRegionList(countryID: any) {
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.region) {
            this.region = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
