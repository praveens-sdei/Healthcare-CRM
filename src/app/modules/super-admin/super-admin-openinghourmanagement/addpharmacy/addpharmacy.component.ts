import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../super-admin.service';
import intlTelInput from "intl-tel-input";
import { Location } from '@angular/common';


@Component({
  selector: 'app-addpharmacy',
  templateUrl: './addpharmacy.component.html',
  styleUrls: ['./addpharmacy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddpharmacyComponent implements OnInit {

  pendingdisplayedColumns: string[] = [
    "date_of_creation",
    "pharmacy_name",
    "email",
    "phone_number",
    "address",
    "action",
  ];


  pendingdisplayedColumns1: string[] = [
    "start_date",
    "start_time",
    "end_date",
    "end_time",
  ];
  pendingdataSource: any = []

  startDate: any = '';

  end_date: any = '';

  groupData: any;

  iti: any;
  selectedCountryCode: any;
  autoComplete: google.maps.places.Autocomplete;
  loc: any = {};
  paramId: any = '';
  pharmacyList: any[] = [];
  @ViewChild("phone") phone: ElementRef<HTMLInputElement>;
  @ViewChild("address") address!: ElementRef;
  datesData: any;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private sadminService: SuperAdminService,
    private router: Router,
    private location: Location) {
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getGroupDetails(this.paramId);
    this.listOnDutyPhar();
  }

  ngOnInit(): void {

    // this.openCountryCodeData();

  }

  public listOnDutyPhar() {
    const params = {
      onDutyGroupId: this.paramId
    }
    this.superAdminService.listOnDutyPharmacy(params).subscribe({
      next: async (res) => {
        const result = await this.coreService.decryptContext(res);
        console.log("LIST ON DUTY PHARMACY====>", result);

        if (result.status) {
          this.pharmacyList = result.data.result;
        }
      },
      error: (err) => {
        this.coreService.showError(err.message, '')
      }
    })
  }

  public addPharForm: FormGroup = new FormGroup(
    {
      pharmacy_name: new FormControl(""),
      mobile_phone_number: new FormControl("", [Validators.required, Validators.pattern(/^\+?\d+$/),]),
      email: new FormControl("", [
        Validators.required,
      ]),
      address: new FormControl(""),
      loc: new FormControl(""),
      neighborhood: new FormControl(""),
      nationality: new FormControl(""),
      region: new FormControl(""),
      province: new FormControl(""),
      department: new FormControl(""),
      city: new FormControl(""),
      village: new FormControl(""),
      sun_start_time: new FormControl("00:00"),
      sun_end_time: new FormControl("00:00"),
      mon_start_time: new FormControl("00:00"),
      mon_end_time: new FormControl("00:00"),
      tue_start_time: new FormControl("00:00"),
      tue_end_time: new FormControl("00:00"),
      wed_start_time: new FormControl("00:00"),
      wed_end_time: new FormControl("00:00"),
      thu_start_time: new FormControl("00:00"),
      thu_end_time: new FormControl("00:00"),
      fri_start_time: new FormControl("00:00"),
      fri_end_time: new FormControl("00:00"),
      sat_start_time: new FormControl("00:00"),
      sat_end_time: new FormControl("00:00"),
      close_any_date: new FormControl("00:00"),
      close_start_tme: new FormControl("00:00"),
      close_end_time: new FormControl("00:00"),
    },
    { validators: [] }
  );

  public onSubmit() {

  }





  onFocus = () => {
    var getCode = this.iti.getSelectedCountryData().dialCode;
    this.selectedCountryCode = "+" + getCode;
    console.log(this.selectedCountryCode, 'vvvvv');

  };

  public getGroupDetails(id: any) {


    const param = {
      onDutyGroupId: id
    }

    this.superAdminService.getOnDutyGroupDetails(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptContext(res);

        console.log(result, 'getGroupDetails');


        if (result.status) {

          const momentSTime = moment(result.data.startTime, ["HH:mm"]).toDate();
          const momentETime = moment(result.data.endTime, ["HH:mm"]).toDate();

          this.groupData = result.data
          // this.onDutyGroupNumber = result.data.onDutyGroupNumber;
          // this.city_name = result.data.city.name;
          this.datesData = this.groupData.datetimeArray.map(item => ({
            start_date: new Date(item.from_date_timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            start_time: new Date(item.from_date_timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            end_date: new Date(item.to_date_timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            end_time: new Date(item.to_date_timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            _id: item._id
          }));





          this.startDate = moment(result.data.startDate).format('MMMM Do YYYY');
          // this.start_time = result.data.startTime;
          this.end_date = moment(result.data.endDate).format('MMMM Do YYYY');
          // this.end_time = result.data.endTime;


        } else {
          this.coreService.showError(result.message, '')
        }



      }
    })




  }

  redirectOnDuty() {
    this.router.navigate(['/super-admin/openhour/addOnDutyPharmacy/', this.paramId])
  }

  redirectOnDutyEdit(id: any) {

    // this.router.navigate(['/super-admin/openhour/addOnDutyPharmacy/',this.paramId,id])
    this.router.navigate(['/super-admin/openhour/addOnDutyPharmacy/', this.paramId], {
      state: {
        onDutypharmacyId: id
      }
    })
  }


  countryList: any[] = [];
  regionList: any[] = [];
  provienceList: any[] = [];
  departmentList: any[] = [];
  cityList: any[] = [];
  villageList: any[] = [];
  spokenLanguages: any[] = [];

  getSpokenLanguage() {
    this.sadminService.spokenLanguage().subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.spokenLanguages = response.body?.spokenLanguage;
    });
  }

  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.countryList = result.body?.list;
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
        this.regionList = result.body?.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.provienceList = result.body?.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.departmentList = result.body?.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.cityList = result.body.list;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.villageList = result.body.list;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }





  // Add Pharmacy modal
  openVerticallyCenteredaddpharmacy(addpharmacy: any) {
    // openCountryCodeData
    this.modalService.open(addpharmacy, { centered: true, size: 'lg', windowClass: "add_pharmacy_content" });
    // this.openCountryCodeData();
  }

  // Edit Pharmacy modal
  openVerticallyCenterededitpharmacy(editpharmacy: any) {
    this.modalService.open(editpharmacy, { centered: true, size: 'lg', windowClass: "add_pharmacy_content" });
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

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

}
