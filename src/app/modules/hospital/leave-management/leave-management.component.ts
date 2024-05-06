import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { HospitalService } from "../../hospital/hospital.service";
import { CoreService } from "src/app/shared/core.service";
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
// import { IndiviualDoctorService } from "../indiviual-doctor.service";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";
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
  selector: "app-leave-management",
  templateUrl: "./leave-management.component.html",
  styleUrls: ["./leave-management.component.scss"],
})
export class LeaveManagementComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
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
    "leavetype",
    "leavereason",
    "fromdate",
    "todate",
    "comment",
    "action",
  ];
  mystaffleavedisplayedColumns: string[] = [
    "name",
    "leavetype",
    "leavereason",
    "fromdate",
    "todate",
    "comment",
    "action",
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
  dataSource: any = [];
  dataHospitalstaffSource: any = [];
  datastaffSource: any = [];

  startDateFilter: any = "";
  endDateFilter: any = "";
  dateFilter: any = "";
  maxDate = new Date();
  minDate = new Date();
  hospitalIds: any;
  hospitallist: any;
  profileId: any;
  portalUserId: any;
  hospitalStaffRole: any;
  role: any;
  hospitalId: any;
  staffId: any;
  activetab: any;

  sortColumn: string = 'DoctorData.full_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  sortColumnStaff: string = 'leave_type';
  sortOrderStaff: 'asc' | 'desc' = 'asc';
  sortIconClassStaff: string = 'arrow_upward';
  datalaboratorySource: any=[];
  laboratorytotalLength: any;
  datadentalSource: any=[];
  dentaltotalLength: any;
  dataopticalSource: any=[];
  opticaltotalLength: any;
  dataparamedicalSource: any=[];
  paramedicaltotalLength: any;
  alltotalLength: any;

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
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private HospitalService: HospitalService,
    private _coreService: CoreService,
    private loader: NgxUiLoaderService
  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.portalUserId = loginData?._id;

    this.hospitalStaffRole = loginData?.role;

    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.hospitalId = adminData?.in_hospital;

    let staffData = JSON.parse(localStorage.getItem("staffData"));
    this.staffId = staffData?._id;

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

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllleaveList(`${column}:${this.sortOrder}`);
    this.getAllHospitalleaveList(`${column}:${this.sortOrder}`);
    this.getAllLaboratoryLeaveleaveList(`${this.sortColumn}:${this.sortOrder}`)
  }


  onSortDataStaff(column:any) {
    this.sortColumnStaff = column;
    this.sortOrderStaff = this.sortOrderStaff === 'asc' ? 'desc' : 'asc';
    this.sortIconClassStaff = this.sortOrderStaff === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllHospitalStaffleaveList(`${column}:${this.sortOrderStaff}`);
  }

  ngOnInit(): void {
    this.getAllleaveList(`${this.sortColumn}:${this.sortOrder}`);

    this.getAllHospitalleaveList(`${this.sortColumn}:${this.sortOrder}`);

    this.getAllHospitalStaffleaveList(`${this.sortColumnStaff}:${this.sortOrderStaff}`);

if( this.hospitalStaffRole === 'HOSPITAL_ADMIN'){
  this.getAllLaboratoryLeaveleaveList(`${this.sortColumn}:${this.sortOrder}`)
  this.getAllDentalleaveList(`${this.sortColumn}:${this.sortOrder}`)
  this.getAllOpticalleaveList(`${this.sortColumn}:${this.sortOrder}`)
  this.getAllParamedicalleaveList(`${this.sortColumn}:${this.sortOrder}`)
}
  }
  // handleSearch(event: any) {
  //   if (this.hospitalStaffRole === "HOSPITAL_ADMIN") {
  //     this.searchKey = event.target.value;
  //     this.getAllleaveList();
  //   } else if (this.hospitalStaffRole === "HOSPITAL_STAFF") {
  //     this.searchKey = event.target.value;
  //     this.getAllHospitalStaffleaveList();
  //   }
  // }
  handleSearch(event: any) {
      this.searchKey = event.target.value;
      this.getAllleaveList();
      if (this.activetab == 1) {
      this.searchKey = event.target.value;
      this.getAllHospitalleaveList();
    } else if (this.activetab == 2) {
      this.searchKey = event.target.value;
      this.getAllLaboratoryLeaveleaveList(`${this.sortColumn}:${this.sortOrder}`)

    } else if (this.activetab == 3) {
      this.searchKey = event.target.value;
      this.getAllDentalleaveList(`${this.sortColumn}:${this.sortOrder}`)

    } else if (this.activetab == 4) {
      this.searchKey = event.target.value;
      this.getAllOpticalleaveList(`${this.sortColumn}:${this.sortOrder}`)

    }else if (this.activetab == 5) {
      this.searchKey = event.target.value;
      this.getAllParamedicalleaveList(`${this.sortColumn}:${this.sortOrder}`)

    }
  }
  handleSearch1(event: any) {
    this.searchKey = event.target.value;
    this.getAllHospitalStaffleaveList();
  }

  //  Add Leave modal
  openVerticallyCenterednewinvite(newinvitecontent: any) {
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
  getAllleaveList(sort:any='') {
    if (this.hospitalStaffRole === "HOSPITAL_ADMIN") {
      const params = {
        sent_to: this.portalUserId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.HospitalLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });

        this.dataSource = data?.body?.listdata;
        this.alltotalLength = data?.body?.totalRecords;
      });
    }
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllleaveList();
  }

  handlePageEvent1(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllHospitalleaveList();
  }
  handlePageEvent2(data: any) {
    if (this.hospitalStaffRole === "HOSPITAL_STAFF") {
      this.page = data.pageIndex + 1;
      this.pageSize = data.pageSize;
      this.getAllHospitalStaffleaveList();
    }
  }
  extendDateFormat(mydate) {
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30);
    return mydate;
  }
  handleSelectStartDateFilter(event: any) {
    
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();

      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllleaveList();
    if (this.activetab == 1) {
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();

      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllHospitalleaveList();
    }
    else if (this.activetab == 2) {
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();

      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllLaboratoryLeaveleaveList(`${this.sortColumn}:${this.sortOrder}`)
    }
    else if (this.activetab == 3) {
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();

      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllDentalleaveList(`${this.sortColumn}:${this.sortOrder}`)
    } else if (this.activetab == 4) {
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();

      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllOpticalleaveList(`${this.sortColumn}:${this.sortOrder}`)
    }else if (this.activetab == 5) {
      const originalDate = new Date(event.value);
      this.extendDateFormat(originalDate);
      const formattedDate = originalDate.toISOString();

      this.startDateFilter = formattedDate;
      const inputDate = new Date(formattedDate);
      const nextDate = inputDate.setHours(23, 59, 59, 59);
      this.endDateFilter = new Date(nextDate).toISOString();
      this.getAllParamedicalleaveList(`${this.sortColumn}:${this.sortOrder}`)
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
    this.getAllHospitalStaffleaveList();
  }
  openVerticallyCenteredsecond(deletePopup: any, element: any) {
    this.loader.start();
    let reqData = {
      _id: element?._id,
      status: "1",
    };
    // this.isSubmitted = false;
    this.HospitalService.leaveAccept(reqData).subscribe(
      (res) => {
        try {
          let data = this._coreService.decryptObjectData({ data: res });
          if (data.status === true) {
            this.loader.stop();
            this.getAllleaveList();
            this._coreService.showSuccess(data.message, "");
          }
        } catch (error) {
          this.loader.stop();
          console.log("error------", error);
          this._coreService.showError("", "Not added");
        }
      },
      (err: Error) => {
        this.loader.stop();
        alert(err.message);
      }
    );
  }
  openVerticallyCenteredseconds(deletePopup: any, element: any) {
    this.loader.start();
    let reqData = {
      _id: element?._id,
      status: "2",
    };
    // this.isSubmitted = false;
    this.HospitalService.leaveReject(reqData).subscribe(
      (res) => {
        try {
          let data = this._coreService.decryptObjectData({ data: res });
          if (data.status === true) {
            this.loader.stop();
            this.getAllleaveList();
            this._coreService.showSuccess(data.message, "");
          }
        } catch (error) {
          this.loader.stop();
          console.log("error------", error);
          this._coreService.showError("", "Not added");
        }
      },
      (err: Error) => {
        this.loader.stop();
        alert(err.message);
      }
    );
  }

  handleAddLeave() {
    if (this.hospitalStaffRole === "HOSPITAL_STAFF") {
      this.isSubmitted = true;

      if (this.addLeaveDetails.invalid) {
        return;
      }
      this.loader.start();
      this.isSubmitted = false;

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
        created_by: this.staffId,
        for_user: this.hospitalId,
        sent_to: this.hospitalId,
        role_type: this.hospitalStaffRole,
      };

      this.isSubmitted = false;
      this.HospitalService.addleave(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this.getAllHospitalStaffleaveList();
              this.modalService.dismissAll();
              this.addLeaveDetails.reset();
              this._coreService.showSuccess(data.message, "");
            }
          } catch (error) {
            this.loader.stop();
            console.log("error------", error);
            this._coreService.showError("", "Not added");
          }
        },
        (err: Error) => {
          this.loader.stop();
          alert(err.message);
        }
      );
    }
  }

  getAllHospitalStaffleaveList(sort:any='') {
    if (this.hospitalStaffRole === "HOSPITAL_STAFF") {
      const params = {
        created_by: this.staffId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.OwnStaffLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });

        this.dataHospitalstaffSource = data?.body?.listdata;
        this.totalLength = data?.body?.totalRecords;
      });
    }
  }

  getAllHospitalleaveList(sort:any='') {
    if (this.hospitalStaffRole === "HOSPITAL_ADMIN") {
      const params = {
        sent_to: this.portalUserId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.HospitalStaffLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });

        this.datastaffSource = data?.body?.listdata;
        this.totalLength = data?.body?.totalRecords;
      });
    }
  }

  selectedTab(event: any) {
    this.activetab = event.index;
  }

  handleupdate(element: any) {
    this.loader.start();
    let reqData = {
      _id: element?._id,
      status: "1",
    };
    // this.isSubmitted = false;
    this.HospitalService.HospitalStaffleaveAccept(reqData).subscribe(
      (res) => {
        try {
          let data = this._coreService.decryptObjectData({ data: res });
          if (data.status === true) {
            this.loader.stop();
            this.getAllHospitalleaveList();
            this._coreService.showSuccess(data.message, "");
          }
        } catch (error) {
          this.loader.stop();
          console.log("error------", error);
          this._coreService.showError("", "Not added");
        }
      },
      (err: Error) => {
        this.loader.stop();
        alert(err.message);
      }
    );
  }
  handleupdate1(element: any) {
    this.loader.start();
    let reqData = {
      _id: element?._id,
      status: "2",
    };
    // this.isSubmitted = false;
    this.HospitalService.HospitalStaffleaveReject(reqData).subscribe(
      (res) => {
        try {
          let data = this._coreService.decryptObjectData({ data: res });
          if (data.status === true) {
            this.loader.stop();
            this.getAllHospitalleaveList();
            this._coreService.showSuccess(data.message, "");
          }
        } catch (error) {
          this.loader.stop();
          console.log("error------", error);
          this._coreService.showError("", "Not added");
        }
      },
      (err: Error) => {
        this.loader.stop();
        alert(err.message);
      }
    );
  }







  laboratoryhandlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllLaboratoryLeaveleaveList();
  }

  getAllLaboratoryLeaveleaveList(sort:any='') {
      const params = {
        sent_to: this.portalUserId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.HospitallaboratoryLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.datalaboratorySource = data?.body?.listdata;
        this.laboratorytotalLength = data?.body?.totalRecords;
      });
    }

    dentalhandlePageEvent(data: any) {
      this.page = data.pageIndex + 1;
      this.pageSize = data.pageSize;
      this.getAllDentalleaveList();
    }
    getAllDentalleaveList(sort:any='') {
      const params = {
        sent_to: this.portalUserId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.HospitalDentalLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.datadentalSource = data?.body?.listdata;
        this.dentaltotalLength = data?.body?.totalRecords;
      });
    }

    opticalhandlePageEvent(data: any) {
      this.page = data.pageIndex + 1;
      this.pageSize = data.pageSize;
      this.getAllOpticalleaveList();
    }
    getAllOpticalleaveList(sort:any='') {
      const params = {
        sent_to: this.portalUserId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.HospitalOpticalLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.dataopticalSource = data?.body?.listdata;
        this.opticaltotalLength = data?.body?.totalRecords;
      });
    }

    paramedicalhandlePageEvent(data: any) {
      this.page = data.pageIndex + 1;
      this.pageSize = data.pageSize;
      this.getAllParamedicalleaveList();
    }
    getAllParamedicalleaveList(sort:any='') {
      const params = {
        sent_to: this.portalUserId,
        page: this.page,
        limit: this.pageSize,
        searchKey: this.searchKey,
        createdDate: this.startDateFilter,
        updatedDate: this.endDateFilter,
        sort:sort
      };
      this.HospitalService.HospitalParaMedicalLeaveList(params).subscribe((res) => {
        let data = this._coreService.decryptObjectData({ data: res });
        this.dataparamedicalSource = data?.body?.listdata;
        this.paramedicaltotalLength = data?.body?.totalRecords;
      });
    }



    acceptleaveforFourPortal(element: any) {
      this.loader.start();
      let reqData = {
        _id: element?._id,
        status: "1",
      };
      // this.isSubmitted = false;
      this.HospitalService.fourportalleaveAccept(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this._coreService.showSuccess(data.message, "");
             if (this.activetab == 2) {
                this.getAllLaboratoryLeaveleaveList(`${this.sortColumn}:${this.sortOrder}`)
              } else if (this.activetab == 3) {
                this.getAllDentalleaveList(`${this.sortColumn}:${this.sortOrder}`)
              } else if (this.activetab == 4) {
                this.getAllOpticalleaveList(`${this.sortColumn}:${this.sortOrder}`)
              }else if (this.activetab == 5) {
                this.getAllParamedicalleaveList(`${this.sortColumn}:${this.sortOrder}`)
              }
            }
          } catch (error) {
            this.loader.stop();
            console.log("error------", error);
            this._coreService.showError("", "Not added");
          }
        },
        (err: Error) => {
          this.loader.stop();
          alert(err.message);
        }
      );
    }

    rejectleaveforFourPortal(element: any) {
      this.loader.start();
      let reqData = {
        _id: element?._id,
        status: "2",
      };
      // this.isSubmitted = false;
      this.HospitalService.fourportalleaveReject(reqData).subscribe(
        (res) => {
          try {
            let data = this._coreService.decryptObjectData({ data: res });
            if (data.status === true) {
              this.loader.stop();
              this._coreService.showSuccess(data.message, "");
              if (this.activetab == 2) {
                this.getAllLaboratoryLeaveleaveList(`${this.sortColumn}:${this.sortOrder}`)
              } else if (this.activetab == 3) {
                this.getAllDentalleaveList(`${this.sortColumn}:${this.sortOrder}`)
              } else if (this.activetab == 4) {
                this.getAllOpticalleaveList(`${this.sortColumn}:${this.sortOrder}`)
              }else if (this.activetab == 5) {
                this.getAllParamedicalleaveList(`${this.sortColumn}:${this.sortOrder}`)
              }
            }
          } catch (error) {
            this.loader.stop();
            console.log("error------", error);
            this._coreService.showError("", "Not added");
          }
        },
        (err: Error) => {
          this.loader.stop();
          alert(err.message);
        }
      );
    }
}
