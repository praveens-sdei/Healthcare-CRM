import { Component, OnInit ,ViewEncapsulation,ViewChild,TemplateRef} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../super-admin.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {MatPaginator} from '@angular/material/paginator';
import { ToastrService } from "ngx-toastr";


export interface PeriodicElement {
  pharmacy:string;
   dateofFilling: string;
   invoiceNumber: string;
   dateofClaimSubmittion: string;
   invoiceDate: string;
   insuranceCompany: string;

}
const ELEMENT_DATA: PeriodicElement[] = []
@Component({
  selector: 'app-super-admin-manualmedicineclaimlist',
  templateUrl: './super-admin-manualmedicineclaimlist.component.html',
  styleUrls: ['./super-admin-manualmedicineclaimlist.component.scss']
})
export class SuperAdminManualmedicineclaimlistComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("activateDeactivate") activateDeactivate: TemplateRef<any>;
  groupID:any;
  claimId:any;
  dataSource = ELEMENT_DATA;
  efg: any = "Deactivate";
  displayedColumns: string[] = [
    "pharmacy",
     "dateofFilling",
  "invoiceNumber",
    "dateofClaimSubmittion",
       "invoiceDate",
     "insuranceCompany",

     "Action",

  ];
  
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  patientId: any;
  startDateFilter: any="";
  endDateFilter: any="";
  searchText: any='';

  constructor( private modalService: NgbModal,
 private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private route:Router,
    private toastr: ToastrService,) {
      const loginData = this.coreService.getLocalStorage('loginData');
      const adminData = this.coreService.getLocalStorage('adminData');
      console.log(loginData._id);
      this.groupID = adminData._id
     }
     handleSelectStartDateFilter(event: any) {    
      const originalDate = new Date(event.value);
      console.log("originalDate",originalDate);   
      this.extendDateFormat(originalDate) 
      const formattedDate = originalDate.toISOString();
      this.startDateFilter = formattedDate
      this.getlistofmanualmedicinClaim();
    }
    
    handleSelectEndDateFilter(event: any) {    
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate)     
      const formattedDate = originalDate.toISOString();
      this.endDateFilter = formattedDate
      this.getlistofmanualmedicinClaim();
    } 
      extendDateFormat(mydate){
      mydate.setHours(mydate.getHours() + 5); // Add 5 hours
      mydate.setMinutes(mydate.getMinutes() + 30); 
      return mydate
    }
  ngOnInit(): void {
    this.getlistofmanualmedicinClaim()

  }
  clearAll(){
    this.startDateFilter ="";
    this.endDateFilter ="";
    this.searchText="";
    this.getlistofmanualmedicinClaim();
  }
  getlistofmanualmedicinClaim() {
    let reqData = {
      limit: this.pageSize,
      page: this.page,
      createdDate:this.startDateFilter,
      updatedDate:this.endDateFilter,
      searchText:this.searchText 
    };
    console.log(reqData,"reqData");
    
    this.superAdminService.getlistofmanualmedicinClaim(reqData).subscribe((res) => {

      let response = this.coreService.decryptObjectData({ data: res });
      console.log("All Medicine claims ---->", response);
      this.dataSource = response?.body?.result;
      this.totalLength = response?.body?.totalRecords;
      console.log(this.dataSource,"thisdataSource",this.totalLength);

    });
  }
  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getlistofmanualmedicinClaim();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getlistofmanualmedicinClaim()
  }

    openVerticallyCenteredsecond(deleteModal: any, _id: any) {
      this.claimId = _id;
      this.modalService.open(deleteModal, { centered: true, size: "sm" });
    }
    handleDeleteGroup() {
      let reqData = {
        id: this.claimId,
      };
  
      this.superAdminService.deletemanualmedicinClaim(reqData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({data:res});
        if (response.status) {
          this.toastr.success(response.message);
          this.getlistofmanualmedicinClaim()
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
    }
    closePopup() {
      this.modalService.dismissAll("close");
    }
    navigate(){
      this.route.navigate(['super-admin/add-manualmedicineclaim'])
    }
}
