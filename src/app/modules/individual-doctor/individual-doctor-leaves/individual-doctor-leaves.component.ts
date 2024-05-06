import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { IndiviualDoctorService } from "../indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { DatePipe } from "@angular/common";
import { NgxUiLoaderService } from "ngx-ui-loader";
// Staff leave data
export interface PeriodicElement {
  staffname: string;
  leavetype: string;
  leavereason: string;
  fromdate: string;
  todate: string;
  comment: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    staffname: "Ralph Edwards",
    leavetype: "Sick Leave",
    leavereason: "Not well",
    fromdate: "22 Oct, 2020",
    todate: "17 Oct, 2022",
    comment:
      "consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum",
  },
  {
    staffname: "Ralph Edwards",
    leavetype: "Sick Leave",
    leavereason: "Not well",
    fromdate: "22 Oct, 2020",
    todate: "17 Oct, 2022",
    comment:
      "consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum",
  },
  {
    staffname: "Ralph Edwards",
    leavetype: "Sick Leave",
    leavereason: "Not well",
    fromdate: "22 Oct, 2020",
    todate: "17 Oct, 2022",
    comment:
      "consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum",
  },
];

// my leave data
export interface MyleavePeriodicElement {
  name: string;
  leavetype: string;
  leavereason: string;
  fromdate: string;
  todate: string;
  comment: string;
}

const MYLEAVE_ELEMENT_DATA: MyleavePeriodicElement[] = [
  {
    name: "Dr. Ralph Edwards",
    leavetype: "Medical Leave",
    leavereason: "Dentist appointment",
    fromdate: "22 Oct, 2020",
    todate: "17 Oct, 2022",
    comment:
      "consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum",
  },
  {
    name: "Dr. Ralph Edwards",
    leavetype: "Medical Leave",
    leavereason: "Dentist appointment",
    fromdate: "22 Oct, 2020",
    todate: "17 Oct, 2022",
    comment:
      "consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum",
  },
  {
    name: "Dr. Ralph Edwards",
    leavetype: "Medical Leave",
    leavereason: "Dentist appointment",
    fromdate: "22 Oct, 2020",
    todate: "17 Oct, 2022",
    comment:
      "consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum",
  },
];

@Component({
  selector: "app-individual-doctor-leaves",
  templateUrl: "./individual-doctor-leaves.component.html",
  styleUrls: ["./individual-doctor-leaves.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class IndividualDoctorLeavesComponent implements OnInit {
  // Staff leave data
  displayedColumns: string[] = [

    "leavetype",
    "leavereason",
    "fromdate",
    "todate",
    "comment",
    "action",
  ];
  displayedColumns1: string[] = [
"staffname",
    "leavetype",
    "leavereason",
    "fromdate",
    "todate",
    "comment",
    "action",
  ];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  // my leave data
  myleavedisplayedColumns: string[] = [
    // "name",
    "leavetype",
    "leavereason",
    "fromdate",
    "todate",
    "comment",
    "status",
  ];
  myleavedataSource = new MatTableDataSource<MyleavePeriodicElement>(
    MYLEAVE_ELEMENT_DATA
  );

  @ViewChild(MatPaginator) paginator: MatPaginator;
  addLeaveDetails!: FormGroup;
  isSubmitted: any = false;
  userID: any;
  searchKey: any = "";
  searchWithDate: any = "";
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  page1: any = 1;
  pageSize1: number = 5;
  dataSource: any = [];
  dataDoctorstaffSource: any = [];
  dataStaffListSource: any = [];

  startDateFilter: any = "";
  endDateFilter: any = "";
  dateFilter: any = "";
  maxDate = new Date();
  minDate = new Date();
  hospitalIds: any;
  hospitallist: any[]= [];
  profileId: any;
  staffHospitalId: void;
  role: any;
  activetab: any;

  sortColumn: string = 'leave_type';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';

  sortColumnStaff: string = 'StaffData.name';
  sortOrderStaff: 1 | -1 = 1;
  sortIconClassStaff: string = 'arrow_upward';
  totalLength1: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.myleavedataSource.paginator = this.paginator;
  }
  optionsList: any[] = [
    { value: "1", label: "Full Day" },
    { value: "2", label: "Half Day" },
    { value: "3", label: "Short Leave" },
    // Add more options to the list as needed.
  ];

  selectedOption: string;
  selectedOptions: string;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private individualService: IndiviualDoctorService,
    private _coreService: CoreService,
    private datePipe: DatePipe,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.role = userData?.role;
    this.userID = userData?._id;
    const hospitalData = this._coreService.getLocalStorage("adminData");
    this.hospitalIds = hospitalData?.for_hospitalIds;
    const profileData = this._coreService.getLocalStorage("adminData");
    this.profileId = profileData?._id;
    const individualDoctorStaff =
      this._coreService.getLocalStorage("adminData");
    this.staffHospitalId = individualDoctorStaff.in_hospital;

    this.addLeaveDetails = this.fb.group({
      leave_type: ["", [Validators.required]],
      subject: ["", [Validators.required]],
      reason: ["", [Validators.required]],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      sent_to: [""],
      created_by: [""],
      for_user: [""],
    });
  }

  get f() {
    return this.addLeaveDetails.controls;
  }

  //  Add Leave modal
  openVerticallyCenterednewinvite(newinvitecontent: any) {
    this.hospitallist = []
    if (this.hospitalIds?.length > 0) {
      this.individualService
        .addHospitalIds(this.hospitalIds)
        .subscribe((res) => {
          let data = this._coreService.decryptObjectData({ data: res });
          const hospitallist = data?.result;
          hospitallist.map((hospital)=>{
            this.hospitallist.push(
              {
                label : hospital.hospital_name,
                value : hospital.for_portal_user
              }
            )
          })
        });
    }

    this.modalService.open(newinvitecontent, {
      centered: true,
      size: "lg",
      windowClass: "add_leave",
    });
  }
  myFilters = (d: Date | null): boolean => {
    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0); // Set the time to midnight

    // If the date is before today, hide it
    return d >= today;
  };
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getDoctorLeaveList(`${column}:${this.sortOrder}`);
    this.getAllDoctorStaffleaveList(`${column}:${this.sortOrder}`)

  }

  onSortDataStaff(column:any) {
    this.sortColumnStaff = column;
    this.sortOrderStaff = this.sortOrderStaff === 1 ? -1 : 1;
    this.sortIconClassStaff = this.sortOrderStaff === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAllStaffLeaveList_In_Doctor(`${column}:${this.sortOrderStaff}`)

  }

  ngOnInit(): void {
    this.getDoctorLeaveList(`${this.sortColumn}:${this.sortOrder}`);
    this.getAllDoctorStaffleaveList(`${this.sortColumn}:${this.sortOrder}`)
    this.getAllStaffLeaveList_In_Doctor(`${this.sortColumnStaff}:${this.sortOrderStaff}`)
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  handleAddLeave() {
    if (this.role === "INDIVIDUAL_DOCTOR") {
      this.isSubmitted = true;
      if (this.addLeaveDetails.invalid) {
        return;
      }
      this.isSubmitted = false;
      this.loader.start();
      const originalDate = this.addLeaveDetails.value.from_date;
      const newDate = new Date(originalDate);
      const fromDate = this.datePipe.transform(newDate, "yyyy-MM-dd");

      const originalDate1 = this.addLeaveDetails.value.to_date;
      const newDate1 = new Date(originalDate1);
      const toDate = this.datePipe.transform(newDate1, "yyyy-MM-dd");
      let reqData = {
        leave_type: this.addLeaveDetails.value.leave_type,
        subject: this.addLeaveDetails.value.subject,
        reason: this.addLeaveDetails.value.reason,
        from_date: fromDate,
        to_date: toDate,
        created_by: this.userID,
        for_user: this.profileId,
        sent_to: this.addLeaveDetails.value.sent_to,
        role_type:this.role
      };

      this.individualService.addleave(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this.modalService.dismissAll();
              this.getDoctorLeaveList();
              this.addLeaveDetails.reset();
              this._coreService.showSuccess(data.message, "");
            }
          } catch (error) {
            console.log("error------", error);
            this._coreService.showError("", "Not added");
            this.loader.stop();
          }
        },
        (err: Error) => {
          alert(err.message);
          this.loader.stop();
        }
      );
    } else if (this.role === "INDIVIDUAL_DOCTOR_STAFF") {
      this.isSubmitted = true;
      if (this.addLeaveDetails.invalid) {
        return;
      }
      this.isSubmitted = false;
      this.loader.start();
      const originalDate = this.addLeaveDetails.value.from_date;
      const newDate = new Date(originalDate);
      const fromDate = this.datePipe.transform(newDate, "yyyy-MM-dd");

      const originalDate1 = this.addLeaveDetails.value.to_date;
      const newDate1 = new Date(originalDate1);
      const toDate = this.datePipe.transform(newDate1, "yyyy-MM-dd");
      let reqData = {
        leave_type: this.addLeaveDetails.value.leave_type,
        subject: this.addLeaveDetails.value.subject,
        reason: this.addLeaveDetails.value.reason,
        from_date: fromDate,
        to_date: toDate,
        created_by: this.userID,
        for_user: this.profileId,
        sent_to: this.staffHospitalId,
      };

      this.individualService.addleave(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this.modalService.dismissAll();
              this.getAllDoctorStaffleaveList();
              this.addLeaveDetails.reset();
              this._coreService.showSuccess(data.message, "");
            }
          } catch (error) {
            console.log("error------", error);
            this.loader.stop();
            this._coreService.showError("", "Not added");
          }
        },
        (err: Error) => {
          alert(err.message);
          this.loader.stop();
        }
      );
    }

    // this.isSubmitted = false;
  }

  getDoctorLeaveList(sort:any='') {
    if(this.role === "INDIVIDUAL_DOCTOR") {
      const params = {
        for_portal_user: this.userID,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.individualService.myLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.dataSource = data?.body?.listdata;
        this.totalLength1 = data?.body?.totalRecords;
      });
    }
   
  }
  getAllStaffLeaveList_In_Doctor(sort:any='') {
    if(this.role === "INDIVIDUAL_DOCTOR") {
      const params = {
        sent_to: this.userID,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.individualService.allStaff_Leave_List_in_doctor(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        
        this.dataStaffListSource = data?.body?.listdata;
        this.totalLength = data?.body?.totalRecords;
      });
    }
   
  }
 
  getAllDoctorStaffleaveList(sort:any='') {
    if(this.role === "INDIVIDUAL_DOCTOR_STAFF"){
      const params = {
        created_by: this.userID,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.individualService.doctorStaffleaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        
        this.dataDoctorstaffSource = data?.body?.listdata;
        this.totalLength = data?.body?.totalRecords;
      });
    }

  }
  handleSearch(event: any) {
    if(this.activetab == 0){
      this.searchKey = event.target.value;
      this.getAllStaffLeaveList_In_Doctor();
    }else if(this.activetab == 1){
      this.searchKey = event.target.value;
      this.getDoctorLeaveList();
    }
  
  }
  handleSearch1(event: any) {
    this.searchKey = event.target.value;
    this.getAllDoctorStaffleaveList();
  }
  handlePageEvent(data: any) {
    this.page1 = data.pageIndex + 1;
    this.pageSize1 = data.pageSize;
    this.getDoctorLeaveList();
  }
  handlePageDoctorStaffEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllDoctorStaffleaveList();
  }
  handleSelectStartDateFilter(event: any) {
    if(this.activetab == 0){
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();
  
      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllStaffLeaveList_In_Doctor();
    }else if(this.activetab == 1){
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();
  
      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getDoctorLeaveList();
    }
    
  }

  handleSelectStartDateFilter1(event: any) {
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate);
    const formattedDate = originalDate.toISOString();

    this.startDateFilter = formattedDate;
    const inputDate = new Date(formattedDate);
    const nextDate = inputDate.setHours(23, 59, 59, 59);
    this.endDateFilter = new Date(nextDate).toISOString();
    this.getAllDoctorStaffleaveList();

  }
  handleSelectEndDateFilter(event: any) {
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate);
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate;
  }

  extendDateFormat(mydate) {
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30);
    return mydate;
  }


  openVerticallyCenteredsecond(element:any){
 let reqData = {
  _id:element?._id,
  status:"1"
}
  // this.isSubmitted = false;
  this.individualService.leaveAccept(reqData).subscribe(
    (res) => {
      try {
        let data = this._coreService.decryptObjectData({ data: res });
        if (data.status === true) {
          this.getAllStaffLeaveList_In_Doctor();
          this._coreService.showSuccess(data.message, "");
        }
      } catch (error) {
        console.log("error------", error);
        this._coreService.showError("", "Not added")
      }
    },
    (err: Error) => {
      alert(err.message);
    }
  );
  }


  handlestaffLeavelist(data:any){
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaffLeaveList_In_Doctor();
  }

  openVerticallyCenteredseconds(element:any){
    let reqData = {
      _id:element?._id,
      status:"2"
    }
      // this.isSubmitted = false;
      this.individualService.leaveReject(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.getAllStaffLeaveList_In_Doctor();
              this._coreService.showSuccess(data.message, "");
            }
          } catch (error) {
            console.log("error------", error);
            this._coreService.showError("", "Not added")
          }
        },
        (err: Error) => {
          alert(err.message);
        }
      );
  }

  selectedTab(event:any){
    this.activetab=event.index
      }
}
