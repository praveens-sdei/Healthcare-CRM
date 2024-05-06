import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../super-admin.service';


export interface PeriodicElement {
  pharmacy: string;
  date: string;
  claimid: string;
  prescribercentre: string;
  insuranceprovider: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  rejectamount: string;
  // comments: string;
  status: string;
  detail: string;

}

const ELEMENT_DATA: PeriodicElement[] = []

@Component({
  selector: 'app-super-admin-mediclaimview',
  templateUrl: './super-admin-mediclaimview.component.html',
  styleUrls: ['./super-admin-mediclaimview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SuperAdminMediclaimviewComponent implements OnInit {

  displayedColumns: string[] = [
    "pharmacy",
    "date",
    "claimid",
    "prescribercentre",
    "insuranceprovider",
    "insuranceholder",
    "insuranceid",
    "patient",
    "reimbursmentrate",
    "totalamount",
    "paidbypatient",
    "requestedamount",
    "approvedamount",
    "rejectamount",
    "status",
    "Resubmit Reason",
    "Action",

  ];
  dataSource = ELEMENT_DATA;
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  groupID: any;
  startDate: string = null;
  endDate: string = null;
  selectedId: any[] = [];
  selectedId1: any[] = [];
  constructor(
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private route: Router,
    private service: PatientService
  ) {
    const loginData = this.coreService.getLocalStorage('loginData');
    const adminData = this.coreService.getLocalStorage('adminData');
    console.log(loginData._id);
    this.groupID = adminData._id
    this.viewAssociationGroup();
  }

  ngOnInit(): void {
    this.resetDate();

  }

  @ViewChild('select') select: MatSelect;
  @ViewChild('selectinsurance') selectinsurance: MatSelect;

  allSelected = false;
  allSelected1 = false;
  pharmacyArray: any[] = [];
  insuranceArray: any[] = [];
  foods: any[] = [];
  getInsuranceList() {
    this.service.getInsuanceList().subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      console.log(response.body?.result);
      // this.insuranceList = response.body.result;

      for (let insurance of response.body?.result) {
        this.insuranceArray.push({ value: insurance.for_portal_user._id, viewValue: insurance.company_name })
        this.selectedId1.push(
          insurance.for_portal_user._id
        )
      }
      this.getClaimList();

      console.log(this.insuranceArray, "hjdhkjhd");
      this.filterData();
    });

  }


  viewAssociationGroup() {
    this.superAdminService.viewAssociationGroup(this.groupID).subscribe((res) => {

      let response = this.coreService.decryptObjectData(res);



      for (let pharmacy of response.data[1]?.pharmacy_details) {
        this.pharmacyArray.push({ value: pharmacy.portal_user_id, viewValue: pharmacy.pharmacy_name })
        this.selectedId.push(
          pharmacy.portal_user_id
        )
        // this.selectedPharmacy.push(pharmacy.portal_user_id);
      }
      this.getInsuranceList();


    });

  }

  resetDate() {
    this.startDate = this.lastYearDate();
    this.endDate = new Date().toISOString();
  }

  private lastYearDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString();
  }


  filterData() {
    console.log('hiiiiiii');

    console.log(this.startDate, 'startdate');
    console.log(this.endDate, 'enddate');
    console.log(this.selectedId, 'all selected');
    this.getClaimList();

  }
  public onEndDateChange(data: MatDatepickerInputEvent<Date>): void {
    console.log(data.value, ":::: end date ::::");
    this.endDate = data.value.toISOString()
    this.filterData();
  }

  public onStartDateChange(data: MatDatepickerInputEvent<Date>): void {
    console.log(data.value, ":::: start date :::::");
    this.startDate = data.value.toISOString();
    this.filterData();
  }
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
      // this.filterData();
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      // this.filterData();
    }
    this.filterData();
  }
  toggleAllSelection1() {
    if (this.allSelected1) {
      this.selectinsurance.options.forEach((item: MatOption) => item.select());
      // this.filterData();
    } else {
      this.selectinsurance.options.forEach((item: MatOption) => item.deselect());
      // this.filterData();
    }
    this.filterData();
  }

  findvalue(fieldname: any, data: any) {
    let findobject = [];
    if (data) {
      findobject = data.filter((element: any) => {
        return (element.fieldName == fieldname)
      })
    }
    else {
      findobject = [];
    }
    if (findobject.length > 0) {
      return findobject[0].fieldValue
    } else {
      return '';
    }

  }

  optionClick() {

    this.selectedId = [];
    console.log(this.select.options, 'this.select.options');

    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;

      }
      if (item.selected) {

        this.selectedId.push(
          item.value
        )
      }
    });

    if (this.selectedId.length == 0) {
      this.select.options.forEach((item: MatOption) => {

        this.selectedId.push(
          item.value
        )
      });
    }

    this.allSelected = newStatus;
    console.log('optionclick', this.selectedId);
    this.filterData();

  }
  optionClick1() {

    this.selectedId1 = [];

    let newStatus = true;
    this.selectinsurance.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;

      }
      if (item.selected) {
        this.selectedId1.push(
          item.value
        )
      }
    });
    this.allSelected1 = newStatus;
    this.filterData();


  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getClaimList()
  }

  private createDate(date: Date) {
    const newDay = `0${date.getDate()}`
    const newMonth = `0${date.getMonth() + 1}`
    return `${date.getFullYear()}-${newMonth.length > 2 ? newMonth.slice(1) : newMonth}-${newDay.length > 2 ? newDay.slice(1) : newDay}`;
  }

  trimContent(text: any) {
    console.log(text, 'text');

    return text.replace(',', '');
  }

  getFieldValue(fieldName: string, value: any) {
    let fieldValue = ''
    for (const data of value) {
      if (data.fieldName == fieldName) fieldValue = data.fieldValue
    }
    return fieldValue
  }

  getAssociationGroupDetails(groupID: string) {
    this.superAdminService.viewAssociationGroup(groupID).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        console.log(result);
        if (result.status === true) {
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
      },
    });
  }


  getClaimList() {
    let reqData = {
      status: 'AssociationGroup',
      pharmacyIds: this.selectedId.join(","),
      insuranceIds: this.selectedId1.join(","),
      limit: this.pageSize,
      page: this.page,
      fromdate: this.startDate,
      todate: this.endDate,
    };
    this.superAdminService.medicineClaimList(reqData).subscribe((res) => {

      let response = this.coreService.decryptObjectData({ data: res });
      console.log("All Medicine claims ---->", response);
      this.dataSource = response?.data?.result;
      this.totalLength = response?.data?.totalRecords;

    });
  }

  // getTotalClaims() {
  //   const data = {
  //     pharmacyIds: this.selectedId,
  //     insuranceIds: this.selectedId1,
  //     page: this.page,
  //     limit: this.pageSize,
  //     monthly: "",
  //     from: this.startDate,
  //     to: this.endDate
  //   } 
  //   this.superAdminService.getTotalClaims(data).subscribe({
  //     next: (result1) => {
  //       let result = this.coreService.decryptObjectData({ data: result1 });
  //       console.log(result);
  //       if (result.status === true) {
  //         this.totalLength = result.data.totalRecords
  //         const dataArray = []
  //         for (const data of result.data.result) {
  //           dataArray.push({
  //               pharmacy: data?.for_portal_user?.user_name, 
  //               date: this.createDate(new Date(data?.createdAt)), 
  //               claimfrom: 'Pharmacy', 
  //               claimnumber: data?.claimNumber, 
  //               claimid: data?.claimId, 
  //               insuranceprovider: 'CHU de Bobo',
  //               insuranceholder: 'Zodo Company', 
  //               insuranceid: this.getFieldValue('Insurance ID', data?.primaryInsuredIdentity), 
  //               patient: 'Adama Traore', 
  //               reimbursmentrate: '80%', 
  //               paidbypatient: '2 000 CFA ', 
  //               requestedamount: '8 000 CFA',
  //               totalamount: data?.totalCoPayment, 
  //               approvedamount: '10 000 CFA', 
  //               rejectamount: '10 000 CFA', 
  //               comments: 'Lorem Ipsum is simply dummy text of', 
  //               status: data?.status,
  //           })
  //         }
  //         console.log(dataArray, 'dataArray');

  //         this.dataSource = dataArray
  //       }
  //     },
  //     error: (err: ErrorEvent) => {
  //       this.coreService.showError("", err.message);
  //     },
  //   });
  // }

  showDetailPage(id: any) {
    this.route.navigate(['/super-admin/medicineclaim/detailview', id])
  }

}
