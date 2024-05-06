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
import { DatePipe } from "@angular/common";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { FourPortalService } from "../four-portal.service";
import { CoreService } from "src/app/shared/core.service";
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
  selector: 'app-four-portal-leave-management',
  templateUrl: './four-portal-leave-management.component.html',
  styleUrls: ['./four-portal-leave-management.component.scss']
})
export class FourPortalLeaveManagementComponent implements OnInit {
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
  page2: any = 1;
  pageSize2: number = 5;
  totalLengthStaff: number = 0;
  
  dataSource: any = [];
  dataStaffownLeave: any = [];
  datastaffLeavesInFourportal: any = [];

  startDateFilter: any = "";
  endDateFilter: any = "";
  dateFilter: any = "";
  maxDate = new Date();
  minDate = new Date();
  hospitalIds: any;
  hospitallist: any[] = [];
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
  type: any;
  totalLengthfourPortal: any;

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
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private loader: NgxUiLoaderService,
    private _coreService: CoreService,
    private modalService: NgbModal,
    private fourPortalService: FourPortalService,
  ) { this.addLeaveDetails = this.fb.group({
    leave_type: ["", [Validators.required]],
    subject: ["", [Validators.required]],
    reason: ["", [Validators.required]],
    from_date: ["", [Validators.required]],
    to_date: ["", [Validators.required]],
    sent_to: [""],
    created_by: [""],
    for_user: [""],
  }); }
  get f() {
    return this.addLeaveDetails.controls;
  }
  ngOnInit(): void {
    const userData = this._coreService.getLocalStorage("loginData");
    this.profileId=userData?.created_by_user
    this.userID = userData?._id;
    this.role=userData?.role
    this.type=userData?.type
    const profileData = this._coreService.getLocalStorage("adminData");
    // this.profileId = profileData?._id;
    const hospitalData = this._coreService.getLocalStorage("adminData");
    this.hospitalIds = hospitalData?.for_hospitalIds;
    if(this.role === "STAFF"){
      this.getAllStaffLeaveListInStaffPortal()
    }else if(this.role === "INDIVIDUAL"){
      this.getallStaffLeavesInfourPortal()
      this.getownFourPortalLeaveList()
    }
  }
  myFilters = (d: Date | null): boolean => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); 
    return d >= today;
  };

  openVerticallyCenterednewinvite(newinvitecontent: any) {
    if (this.role === 'INDIVIDUAL') {
      this.fourPortalService
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
          
          console.log(this.hospitallist);
          

          if(data?.result?.length == 0){
            this._coreService.showError("", "No hospital found");

          }
        });
    }

    this.modalService.open(newinvitecontent, {
      centered: true,
      size: "lg",
      windowClass: "add_leave",
    });
  }


  handleAddLeave() {
    if(this.role === "STAFF"){
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
        sent_to: this.profileId,
        role:this.role,
        type:this.type
      };
  
      this.fourPortalService.addleaves(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this.modalService.dismissAll();
              this.getAllStaffLeaveListInStaffPortal();
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
    }else if(this.role === "INDIVIDUAL"){
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
        // for_user: this.profileId,
        sent_to: this.addLeaveDetails.value.sent_to,
        role:this.role,
        type:this.type
      };
  
      this.fourPortalService.addleaves(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this.modalService.dismissAll();
              this.getownFourPortalLeaveList()
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
  }


  extendDateFormat(mydate) {
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30);
    return mydate;
  }

  handleSearch1(event: any) {
    this.searchKey = event.target.value;
    this.getAllStaffLeaveListInStaffPortal();
  }

  handleSelectStartDateFilter1(event: any) {
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate);
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate;
    const inputDate = new Date(formattedDate);
    const nextDate = inputDate.setHours(23, 59, 59, 59);
    this.endDateFilter = new Date(nextDate).toISOString();
    this.getAllStaffLeaveListInStaffPortal();
  }

  handleOwnStaffListEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaffLeaveListInStaffPortal();
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllStaffLeaveListInStaffPortal(`${column}:${this.sortOrder}`)
    this.getownFourPortalLeaveList(`${column}:${this.sortOrder}`)

  }

  getAllStaffLeaveListInStaffPortal(sort:any='') {
      const params = {
        created_by: this.userID,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.fourPortalService.getStaffLeaveListinStaffPortal(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.dataStaffownLeave = data?.body?.listdata;
        this.totalLengthStaff = data?.body?.totalRecords;
      });
    }
    handlestaffLeavelist(data:any){
      this.page = data.pageIndex + 1;
      this.pageSize = data.pageSize;
      this.getallStaffLeavesInfourPortal();
    }

  onSortDataStaff(column:any) {
    this.sortColumnStaff = column;
    this.sortOrderStaff = this.sortOrderStaff === 1 ? -1 : 1;
    this.sortIconClassStaff = this.sortOrderStaff === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getallStaffLeavesInfourPortal(`${column}:${this.sortOrderStaff}`)

  }
  handleSearch2(event: any) {
    this.searchKey = event.target.value;
    this.getallStaffLeavesInfourPortal();
    this.getownFourPortalLeaveList();

  }
  handleSelectStartDateFilter2(event: any) {
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate);
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate;
    const inputDate = new Date(formattedDate);
    const nextDate = inputDate.setHours(23, 59, 59, 59);
    this.endDateFilter = new Date(nextDate).toISOString();
    this.getallStaffLeavesInfourPortal();
    this.getownFourPortalLeaveList()
  }
    getallStaffLeavesInfourPortal(sort:any='') {
      const params = {
        sent_to: this.userID,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.fourPortalService.getallStaffLeavesInfourPortals(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.datastaffLeavesInFourportal = data?.body?.listdata;
        this.totalLengthStaff = data?.body?.totalRecords;
      });
    }

    selectedTab(event:any){
      this.activetab=event.index
        }
  


        acceptLeave(element:any){
          let reqData = {
            _id:element?._id,
            status:"1"
          }
            // this.isSubmitted = false;
            this.fourPortalService.leaveAccepts(reqData).subscribe(
              (res) => {
                try {
                  let data = this._coreService.decryptObjectData({ data: res });
                  if (data.status === true) {
                    this.getallStaffLeavesInfourPortal();
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

        rejectLeave(element:any){
          let reqData = {
            _id:element?._id,
            status:"2"
          }
            this.fourPortalService.leaveRejects(reqData).subscribe(
              (res) => {
                try {
                  let data = this._coreService.decryptObjectData({ data: res });
                  if (data.status === true) {
                    this.getallStaffLeavesInfourPortal();
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

        handlePageEvent(data: any) {
          this.page2 = data.pageIndex + 1;
          this.pageSize2 = data.pageSize;
          this.getownFourPortalLeaveList();
        }
        getownFourPortalLeaveList(sort:any='') {
            const params = {
              for_portal_user: this.userID,
              page: this.page2,
              limit: this.pageSize2,
              searchKey: this.searchKey,
              createdDate: this.startDateFilter,
              updatedDate: this.endDateFilter,
              sort:sort
            };
            this.fourPortalService.myLeaveListforFourportal(params).subscribe((res) => {
              let data = this._coreService.decryptObjectData({ data: res });
              this.dataSource = data?.body?.listdata;
              this.totalLengthfourPortal = data?.body?.totalRecords;
            });
          }
         
        
}
