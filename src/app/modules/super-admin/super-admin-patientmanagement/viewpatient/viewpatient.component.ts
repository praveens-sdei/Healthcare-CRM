import { Component, OnInit, ViewEncapsulation,ViewChild,TemplateRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from "./../../../../shared/core.service";
import { IndiviualDoctorService } from 'src/app/modules/individual-doctor/indiviual-doctor.service';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
export interface PeriodicElement {
  patientname: string;
  gender: string;
  dateofbirth: string;
  joineddate: string;
  insuranceprovider: string;
  phonenumber: string;
  email: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  { patientname: '',
  gender: '', 
  dateofbirth:'',
   joineddate: '', 
   insuranceprovider: '',
    phonenumber: '',
     email: ''
    },

];


@Component({
  selector: 'app-viewpatient',
  templateUrl: './viewpatient.component.html',
  styleUrls: ['./viewpatient.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ViewpatientComponent implements OnInit {
  displayedColumns: string[] = ['patientname', 'gender', 'dateofbirth','joineddate','insuranceprovider', 'phonenumber', 'email',  'status','lockuser','action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  patientlistsource : any[] = []
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  searchText = "";
  insurancePresent="";
  patientId: any = "";
  doctorId: any = "";
  abc: any = "Lock";
  efg: any = "Deactivate";
  patientdeleteId:any;
  dateFilter: any = "";
  activebutton:any=''
  patientList: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("activateDeactivate") activateDeactivate: TemplateRef<any>;
  @ViewChild("lockOrUnloackmodal") lockOrUnloackmodal: TemplateRef<any>;
  public date: moment.Moment;
  startDateFilter: any="";
  endDateFilter: any="";
  statusValue: any = "all";
  type: any;

  sortColumn: string = 'first_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private modalService: NgbModal,
    private coreService: CoreService,
    private service: IndiviualDoctorService,
    private route: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,) {
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getPatientList(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
     this.getPatientList(`${this.sortColumn}:${this.sortOrder}`)
     setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this.coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
          console.log(`exist in the object.`);

        } else {
          console.log(`does not exist in the object.`);
        }
      }else{
        var checkSubmenu = checkData.submenu;
        let innerMenu = [];
        for (let key in checkSubmenu) {
          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }
        this.innerMenuPremission = innerMenu;
      } 
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  allPatients(event:any){
    this.activebutton=event;
    console.log("this.activebutton", this.activebutton)
    this.insurancePresent=event
    console.log("this.insurancePresent", this.insurancePresent)
    this.getPatientList()

  }

  extendDateFormat(mydate){
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30);
    return mydate
  }
  getPatientList(sort:any ='') {
    let reqData = {
      insuranceStatus:this.insurancePresent,
      searchText: this.searchText,
      page: this.page,
      limit: this.pageSize,
      createdDate: this.startDateFilter,
      updatedDate: this.endDateFilter,
      status: this.statusValue,
      sort:sort
    };

    console.log("PATIENT REQDATA===>", reqData);
    this.service.getAllPatientForSuperAdmin(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.dataSource = response?.body?.result;
      this.patientlistsource =response?.body?.result;
      this.totalLength = response?.body?.totalRecords;

      console.log("PATIENT LIST===>", response);
    });
  }
  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getPatientList();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getPatientList();
  }
  handleSelectStartDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)  
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate
    this.getPatientList();
  }
  
  handleSelectEndDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)  
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate
    this.getPatientList();
  } 

  handleFilter(value: any) {
    console.log("value--->", value);
    this.statusValue = value
  
    // this.subscriberTypeFilter = value;
    this.getPatientList();
  }
  clearAll(){
    this.startDateFilter ="";
    this.endDateFilter ="";
    this.searchText= "";
    this.statusValue ="";
    this.getPatientList();
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

    //  Delete modal
    openVerticallyCentereddetale(addsecondsubsriber: any, id:any) {
      this.patientId=id;
      this.modalService.open(addsecondsubsriber,{ centered: true,size: 'md',windowClass : "delete_data" });
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
    calculateAge(dob: any) {
      let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
      let patientAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      return patientAge;
    }
    handleToggleChangeForActive(event: any, id: any) {
      this.patientId = id;
      if (event === false) {
        this.efg = "Deactivate";
      } else {
        this.efg = "Activate";
      }
      this.modalService.open(this.activateDeactivate);
    }

  handleToggleChangeForLock(event: any, id: any) {
    this.patientId = id;
    if (event === false) {
      this.abc = "Unlock";
    } else {
      this.abc = "Lock";
    }
    this.modalService.open(this.lockOrUnloackmodal);
  }


  activeLockDeleteDoctor(action: string, value: boolean) {
    let reqData = {
      patientId: this.patientId,
      action_name: action,
      action_value: value,
    };

    this.service.activeAndLockPatient(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.modalService.dismissAll("close");
      if (response.status) {
        this.toastr.success(response.message);
        this.getPatientList()
      }
    });
  }
  
  routeToEdit(id) {
    sessionStorage.setItem("tabIndexForDoctor", "0");
    this.route.navigate(["/individual-doctor/patientmanagement/edit", id]);
  }
}
