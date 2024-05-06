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
import { Router } from "@angular/router";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../../four-portal.service";
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
    doctor: "",
    orderid: "",
    dateandtime: "",
    consultationtype: "",
    fee: "",
    status: "",
  },
];

@Component({
  selector: 'app-patient-past-appointment',
  templateUrl: './patient-past-appointment.component.html',
  styleUrls: ['./patient-past-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PatientPastAppointmentComponent implements OnInit {
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
  userType: any;
  ngAfterViewInit() {
    this.pastappointmentdataSource.paginator = this.paginator;
  }

  constructor(
    private fourPortalService: FourPortalService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let loginData = this.coreService.getLocalStorage('loginData');
    this.userType = loginData?.type
  }

  ngOnInit(): void {
    let paramid = this.activatedRoute.snapshot.paramMap.get("id");
    this.appointmentId = paramid;
    this.getPastAppointment();
  }

  getPastAppointment() {
    let reqData = {
      patient_portal_id: this.patientId,
      limit: this.pageSize,
      page: this.page,
      status: "PAST",
    };

    this.fourPortalService
      .getPastAppointOfPatient(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        let pastAppArray = [];
        response?.data.forEach((element) => {
          
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
       `/portals/appointment/${this.userType}/appointment-details`,
      appointmentId,
    ]);
    setTimeout(() => {
      this.refreshDetails.emit('refresh')
    }, 1000);
    
  }
}
