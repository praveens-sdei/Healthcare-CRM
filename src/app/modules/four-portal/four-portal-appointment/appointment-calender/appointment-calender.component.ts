import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { isSameDay, isSameMonth, } from "date-fns";
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from "angular-calendar";
import { EventColor } from "calendar-utils";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { DatePipe } from "@angular/common";
import { map, Observable, Subject } from "rxjs";
import * as moment from "moment";
import {
  ContextMenuComponent,
  ContextMenuService,
} from "@perfectmemory/ngx-contextmenu";
import { format } from "date-fns";
import { IResponse } from "src/app/shared/classes/api-response";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";

const colors: Record<string, EventColor> = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};

interface OfficeTime {
  dayStartHour: string;
  dayStartMinute: string;
  dayEndHour: string;
  dayEndMinute: string;
}

@Component({
  selector: 'app-appointment-calender',
  templateUrl: './appointment-calender.component.html',
  styleUrls: ['./appointment-calender.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppointmentCalenderComponent implements OnInit {
  locations = new FormControl("");
  locationList: string[] = [
    "India",
    "China",
    "Turki",
    "Japan",
    "Barma",
    "Indonesia",
  ];

  patients = new FormControl("");
  patientList: string[] = [
    "Jacob Jones",
    "Cameron Williamson",
    "Jenny Wilson",
    "Darrell Steward",
    "Robert Fox",
  ];


  userId: any = "";
  events: Observable<Array<CalendarEvent>>;
  activeDayIsOpen: boolean = false;
  trigger: any;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  resonText: any;

  isOpen = false;
  contextMenu: ContextMenuComponent;
  contextMenuPosition = { x: "0", y: "0" };
  openContextMenu: boolean = true;
  officeTime: OfficeTime;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  showAllEventDaysArray: number[] = [];
  viewDate: Date = new Date();

  appointId: number = 0;
  cancelledId: number = 0;
  rescheduledId: number = 0;
  setRemainderId: number = 0;
  bookingAvailableDates: string[] = [];

  refresh: Subject<any> = new Subject();
  isDayView: boolean;
  isWeekView: boolean;
  isMonthView: boolean;
  currentAppointmentId: any;

  hospital_location: any[] = [];

  assign_doctor_depart: any;
  listData: any;
  assign_doctor_services: any;
  assign_doctor_unit: any;

  @ViewChild("cancelappointmentcontent", { static: false })
  cancelappointmentcontent: any;
  doctor_portal_id: any[];
  userRole: any;
  doctor_id: any;
  for_portal_user: any;
  currentDate: Date = new Date();
  currentMonthStartDate: string = "";
  currentMonthEndDate: string = "";
  userType: any;

  doctorLocationFilter: any = "";
  patientNameFilter: any = "";
  uniquePatients: string[]

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private doctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
    private _patientService: PatientService,
    private fourPortalService: FourPortalService,
    private datePipe: DatePipe,
    private contextMenuService: ContextMenuService,
    private date: DatePipe,
    private patientService: PatientService
  ) { this.calculateMonthRange(this.currentDate); }
  calculateMonthRange(currentDate) {
    this.currentMonthStartDate = moment(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).format("YYYY-MM-DD");
    const nextMonth = currentDate.getMonth() + 1;
    const nextYear = currentDate.getFullYear() + (nextMonth === 12 ? 1 : 0);
    this.currentMonthEndDate = moment(new Date(nextYear, nextMonth % 12, 0)).format("YYYY-MM-DD");
  }
  ngOnInit(): void {
    let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userId = userData._id;
    this.userType = userData?.type
    this.userRole = userData?.role;
    this.assign_doctor_depart = adminData?.department
    this.assign_doctor_services = adminData?.services
    this.assign_doctor_unit = adminData?.department
    this.for_portal_user = adminData?.in_hospital;
    this.doctor_portal_id = [];
    this.getAppointmentlist();
    this.portal_Details();


  }


  getUniquePatients(patients: string[]): string[] {
    return Array.from(new Set(patients));
  }

  async getAppointmentlist() {
    let reqData = {
      portal_id: this.userId,
      status: "ALL",
      consultation_type: "ALL",
      date: this.currentMonthStartDate,
      to_date: this.currentMonthEndDate,
      page: 1,
      limit: 0,
      portal_type: this.userType,
      filterByDocLocname: this.doctorLocationFilter,
      filterByPatientname: this.patientNameFilter
    };
    console.log("REQ DATA==>", reqData);

    return (this.events = this.fourPortalService.fourPortal_appointment_list(reqData).pipe(
      map((res: any) => {
        let data = this.coreService.decryptObjectData({ data: res });
        console.log("APPOINTMENT LIST CALENDER===>", data);

        this.patientList = data.data.data.map((ele) => {
          return ele.patient_name;
        });
        if (this.patientNameFilter) {

        } else {

          this.uniquePatients = this.getUniquePatients(this.patientList);
          console.log("this.uniquePatients--------", this.patientList);
        }
        let responsData = data.data.data;
        return (responsData || []).map((res: any, index: number) => {
          // console.log(res, "responsData");

          // console.log(res);
          let action = [];
          if (
            res.status == "New" ||
            res.status == "Upcoming" ||
            res.status == "Today"
          ) {
            action = this.sendAllAction([
              {
                icon: '<span class="material-icons material-icons-delete" title="Delete" style="color:#d00;">cancel</span>', // '<i class="fa fa-fw fa-trash" title="Delete"></i>',
                name: "Deleted",
              },
            ]);
          }

          let consulatation_date = moment(res.consultation_date).format(
            "YYYY-MM-DD"
          );

          // console.log(consulatation_date, "consulatation_date");

          let consulatation_start_time = res?.consultation_time?.split("-")[0];
          let consulatation_end_time = res?.consultation_time?.split("-")[1];

          // console.log(consulatation_date+'--'+consulatation_start_time+'--'+consulatation_end_time);

          let start_date_time =
            consulatation_date + "T" + consulatation_start_time + ":00";
          let end_date_time =
            consulatation_date + "T" + consulatation_end_time + ":00";

          let appointmentObj = {
            statusName: res.status,
            startDateTime: start_date_time,
            endDateTime: end_date_time,
            patientName: res.patient_name,
            doctorName: res.doctor_name,
            appointmentId: res.appointment_id,
          };

          let title = `${res.consultation_time} ${res.patient_name}`;

          const eventObj: CalendarEvent = {
            title: title, //timeRange + appointmentObj.patientName,
            start: new Date(start_date_time),
            end: new Date(end_date_time),
            color: {
              primary: "brown",
              secondary: "red", // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
            },
            cssClass: "CustomEvent",
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
            actions: action,
            meta: {
              ...appointmentObj,
            },
          };

          return eventObj;
        });

        console.log(this.events, "events");
        // this.refresh.next();
      })
    ));
  }

  // get doctor department,service and unit assign to staff
  async getDoctor(doctor_list) {
    // console.log("getdoctor 1");

    let reqData = {
      in_hospital: this.doctor_id,
      doctor_list: doctor_list,
      departmentArray: this.assign_doctor_depart,
      unitArray: this.assign_doctor_unit,
      serviceArray: this.assign_doctor_services
    }
    console.log("reqData---->", reqData);

    this.doctorService.getdepartmentAsperDoctor(reqData).subscribe({

      next: async (result: IResponse<any>) => {
        let response = await this.coreService.decryptObjectData({ data: result });
        //  console.log("getdoctor 2");

        if (response.status == true) {
          this.listData = response?.body?.data.map((assDoc_is: any) => {
            console.log("assDoc_is", assDoc_is);

            if (this.doctor_portal_id.indexOf(assDoc_is?.for_portal_user) == -1) {
              this.doctor_portal_id.push(assDoc_is?.for_portal_user);
            }

          })
          console.log("getdepartmentAsperDoctor==>", response?.body?.data, this.doctor_portal_id);
          this.getAppointmentlist();
        }

      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        if (err.message === "INTERNAL_SERVER_ERROR") {
          this.coreService.showError("", err.message);
        }
      },

    })
  }

  addEvent(event: any, type: any): void {
    console.log(event, "event");
    console.log(type, "type");

    let id = this.currentAppointmentId;
    switch (type) {
      case "2":
        this.router.navigate([`/portals/appointment/${this.userType}/appointment-details/` + id]);
        break;
      case "3":
        this.router.navigate([`/portals/appointment/${this.userType}/appointment-details/` + id], {
          state: {
            mode: "CALENDER",
          },
        });
        break;
      case "4":
        this.openVerticallyCenteredcancelappointmentcontent(
          this.cancelappointmentcontent
        );
        break;
      case "6":
        this.router.navigate([`/portals/appointment/${this.userType}/appointment-details/` + id], {
          state: {
            mode: "REMAINDER_CALENDER",
          },
        });
        break;
    }
  }

  sendAllAction(actions: any) {
    return actions.map((obj) => {
      const icn = obj.icon as string;
      const [s1, ...s2Array] = icn.split(" ");
      const iconStr = [s1, 'value="' + obj.name + '"', s2Array].join(" ");
      obj.icon = iconStr.split(",").join(" ");

      return {
        label: obj.icon,
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent(obj.name, event.meta);
        },
      };
    });
  }

  disableContextMenu() {
    this.contextmenu = false;
  }

  handleEvent(type: string, event: any) {
    console.log(event, "appointmentObj");
    console.log("type", type);

    this.currentAppointmentId = event.appointmentId;
    let appointmentObj = {
      appointmentId: event?.patientAppointmentId,
      isRecurrence: event?.isRecurrence,
      parentAppointmentId: event?.parentAppointmentId,
      deleteSeries: false,
      claimId: event?.claimId,
      patientEncounterId: event?.patientEncounterId || 0,
      isBillable: event?.isBillable,
      patientId: event?.patientID,
      // currentStaffid: this.isClientLogin ? event.appointmentStaffs[0].staffId : 0
    };    
    switch (type.toUpperCase()) {
     
      case "DELETED":
        console.log(this.currentAppointmentId, "currentAppointmentId");
        this.openVerticallyCenteredcancelappointmentcontent(this.cancelappointmentcontent);        
        break;      
      default:
        break;
    }
  }

  openVerticallyCenteredcancelappointmentcontent(
    cancelappointmentcontent: any
  ) {
    this.modalService.open(cancelappointmentcontent, {
      centered: true,
      size: "md",
    });
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    this.isDayView = false;
    this.isWeekView = false;
    this.isMonthView = true;
    body.forEach((day) => {
      const slotInfo = {
        start: day.date,
        end: day.date,
      };
    
    });
  }

  eventClicked(event: CalendarEvent): void { }

  public onContextMenu(
    $event: any,
    selectedEvent: CalendarEvent = null,
    rescheduleDate: null | Date = null
  ): void {

    console.log(this.appointId, "appointId");

    this.appointId =
      $event.target.className.toLowerCase().indexOf("cal-event") == 0 ||
        $event.target.className.toLowerCase().indexOf("appt-blk") == 0 ||
        $event.target.className.toLowerCase().indexOf("month-event-txt-s") == 0
        ? 1
        : 0;
    if (
      $event.target.className.indexOf("material-icons") != 0 &&
      $event.target.className.indexOf("cal-event-title") != 0
    ) {
      console.log("in if");

      this.contextMenuService.show.next({
        anchorElement: $event.target,
        // Optional - if unspecified, all context menu components will open
        contextMenu: this.contextMenu,
        event: <any>$event,
        item: 5,
      });
      console.log(this.appointId, "niche appointId");
      console.log(selectedEvent.meta.statusName, "selectedEvent");

      // checking for cancelled in content menu

      if (selectedEvent && selectedEvent.meta) {
        if (
          selectedEvent.meta.statusName == "New" ||
          selectedEvent.meta.statusName == "Upcoming" ||
          selectedEvent.meta.statusName == "Today"
        ) {
          this.cancelledId = 1;
        } else {
          this.cancelledId = 0;
        }
        // checking rescheduling in content menu
        if (
          selectedEvent.meta.statusName == "Upcoming" ||
          selectedEvent.meta.statusName == "Today"
        ) {
          this.rescheduledId = 1;
          this.setRemainderId = 1;
        } else {
          this.rescheduledId = 0;
          this.setRemainderId = 0;
        }

        // localStorage.setItem('apptId', selectedEvent.meta.patientAppointmentId);
        this.currentAppointmentId = selectedEvent.meta.appointmentId;

      }

      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  isBoolingDateAvailable(reqDate: Date): boolean {
    if (this.bookingAvailableDates && this.bookingAvailableDates.length > 0) {
      const dateStr = format(reqDate, "YYYY-MM-DD");
      return this.bookingAvailableDates.some((x) => x == dateStr)
        ? true
        : false;
    } else {
      return false;
    }
  }

  toDateString(date) {
    return this.date.transform(new Date(date), "dd");
  }

  monthEvntsToolTip(appointmentTitle) {
    return '<div class="month-title-tip-view"> ' + appointmentTitle + " </div>";
  }

  getBgClass(index: number): string {
    return index % 2 == 0 ? "evenCellColor" : "oddCellColor";
  }

  monthViewActionCliked(action, event: CalendarEvent) {
    const actionEl = this.patientService.parseStringToHTML(
      action.label
    ) as HTMLElement;
    const actionName = actionEl.getAttribute("value") as string;
    this.handleEvent(actionName, event.meta);
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
 

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    
  }

  deleteEvent(eventToDelete: CalendarEvent) {
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  async closeOpenMonthViewDay(newDate: Date) {
    this.activeDayIsOpen = false;
    console.log("viewDate", this.viewDate, this.view, event, this.currentDate);
    console.log('Selected Month:', newDate.getMonth() + 1); // Adding 1 because months are zero-based
    console.log('Selected Year:', newDate.getFullYear());
    console.log(new Date((newDate.getMonth() + 1) + "-01-" + newDate.getFullYear()), "hghhghjhhjjhjh");

    await this.calculateMonthRange(new Date((newDate.getMonth() + 1) + "-01-" + newDate.getFullYear()));
    this.getAppointmentlist();
  }

  openVerticallyCentereddetale(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, { centered: true, size: "md" });
  }

  cancelAppointment() {
    let reqData = {
      appointment_id: this.currentAppointmentId,
      cancelReason: this.resonText,
      status: 'REJECTED',
      cancelledOrAcceptedBy: this.userId,
      portal_type: this.userType
    };

    console.log("REQDATA", reqData);

    this.fourPortalService.fourPortal_cancel_approved_appointment(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE===>", response);
        if (response.status) {
          this.router.navigate([`/portals/appointment/${this.userType}`]);
          this.modalService.dismissAll("close");
          this.toastr.success(response.message);
          this.getAppointmentlist()
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


  portal_Details() {
    let param = { portal_id: this.userId };

    this.fourPortalService.fourPortalDetails(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptObjectData({ data: res });

        this.hospital_location = await JSON.parse(
          JSON.stringify(result?.body?.data?.hospital_location)
        );

        console.log("hospital_location------", this.hospital_location);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onLocationSelectionChange(event: any) {
    this.doctorLocationFilter = event
    this.getAppointmentlist();
  }

  onPatientNameSelectionChange(event: any) {
    this.patientNameFilter = event
    this.getAppointmentlist();
  }
}
