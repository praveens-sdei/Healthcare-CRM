import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import { Router } from "@angular/router";
// import { Input } from 'hammerjs';

// Past appointment Table
export interface PastappointmentPeriodicElement {
  doctor: string;
  orderid: string;
  dateandtime: string;
  consultationtype: string;
  fee: string;
  status: string;
}
const PASTAPPOINTMENT_ELEMENT_DATA: PastappointmentPeriodicElement[] = [
  {
    doctor: "Cameron Williamson",
    orderid: "#1515411215",
    dateandtime: "08-21-2022 | 03:50Pm",
    consultationtype: "Online",
    fee: "200 CFA",
    status: "Past",
  },
];

@Component({
  selector: "app-pastappointment",
  templateUrl: "./pastappointment.component.html",
  styleUrls: ["./pastappointment.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PastappointmentComponent implements OnInit {
  @Output() refreshDetails = new EventEmitter<string>();
  // Past Appointment Table
  pastappointmentdisplayedColumns: string[] = [
    "doctor",
    "orderid",
    "dateandtime",
    "consultationtype",
    "fee",
    "status",
    "action",
  ];
  pastappointmentdataSource: any =
    new MatTableDataSource<PastappointmentPeriodicElement>(
      PASTAPPOINTMENT_ELEMENT_DATA
    );

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() patientId: any;

  appointmentId: any = "";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  ngAfterViewInit() {
    this.pastappointmentdataSource.paginator = this.paginator;
  }

  constructor(
    private indiviualDoctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let paramid = this.activatedRoute.snapshot.paramMap.get("id");
    this.appointmentId = paramid;
    this.getPastAppointment();
  }

  getPastAppointment() {
    let reqData = {
      patient_portal_id: this.patientId,
      // patient_portal_id: "63d0f8213c4b44b6397794ff",
      limit: this.pageSize,
      page: this.page,
      status: "PAST",
    };
    console.log(reqData);

    this.indiviualDoctorService
      .getPastAppointOfPatient(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("PAST APPOINTMENT==>", response);
        // this.pastappointmentdataSource = response?.data?.data;
        let pastAppArray = [];
        response?.data?.data.forEach((element) => {
          if (element.appointment_id != this.appointmentId) {
            pastAppArray.push(element);
          }
        });
        this.pastappointmentdataSource = pastAppArray;
        this.totalLength = response?.data?.totalCount;
      });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
  }

  viewOtherAppointment(appointmentId: any) {
    this.router.navigate([
      "/individual-doctor/appointment/appointmentdetails",
      appointmentId,
    ]);
    setTimeout(() => {
      this.refreshDetails.emit('refresh')
    }, 1000);
    
  }
}
