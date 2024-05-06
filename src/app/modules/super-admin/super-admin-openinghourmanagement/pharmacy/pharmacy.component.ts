import { DatePipe, formatDate } from "@angular/common";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Observable, Observer } from "rxjs";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../super-admin.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface PeriodicElement {
  ondutygroupnumber: string;
  city: string;
  startdate: string;
  starttime: string;
  enddate: string;
  endtime: string;
  id: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-pharmacy",
  templateUrl: "./pharmacy.component.html",
  styleUrls: ["./pharmacy.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PharmacyComponent implements OnInit {
  displayedColumns: string[] = [
    "creationDate",
    "ondutygroupnumber",
    "city",
    // "startdate",
    // "starttime",
    // "enddate",
    // "endtime",
    "action",
  ];

  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cityList: any[] = [];
  pageSize: number = 20;
  totalLength: number = 0;
  page: any = 1;
  public searchText = "";
  dutyGroupList: any = [];
  @ViewChild("editonduty", { static: false }) editonduty: any;
  @ViewChild("viewonduty", { static: false }) viewonduty: any;
  onDutyGroupNumber: any = "";
  city_name: any = "";
  startDate: any = "";
  start_time: any = "";
  end_date: any = "";
  end_time: any = "";

  csvFor: any = "";
  overlay:false;
  selectfilename: any = "";
  minDate = new Date();
  minDateOfCreation = new Date();
  maxDate = new Date();
  pharmacySource: any = [];

  sortColumn: string = 'date_of_creation';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  loginID: any;
  innerMenuPremission:any=[];
  loginrole: any;  pharmacyId: any;
  selectedLabs: any = [];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private modalService: NgbModal,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private router: Router,
    private fb: FormBuilder,
    private Date_pipe: DatePipe,
    private loader : NgxUiLoaderService
  ) {

    const userData = this.coreService.getLocalStorage('loginData')
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
    this.loginID = userData._id
  }


  public ondutyForm: FormGroup = new FormGroup(
    {
      ondutyGroupId: new FormControl("123"),
      ondutyGroupNumber: new FormControl("", [
        Validators.required,
        // Validators.pattern(/^\+?\d+$/),
      ]),
      city: new FormControl("", [Validators.required]),
      onDuty: this.fb.array([]),
      /* start_date: new FormControl(""),
      start_time: new FormControl("", [Validators.required]),
      end_date: new FormControl("", [Validators.required]),
      end_time: new FormControl("", [Validators.required]), */
      date_of_creation: new FormControl("", [Validators.required]),
    }
  );

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.onDutyGroupList(`${column}:${this.sortOrder}`);
  }



  ngOnInit(): void {
    this.onDutyGroupList(`${this.sortColumn}:${this.sortOrder}`);
    this.getCityList();
    this.addNewOnDuty();

    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
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
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
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

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.onDutyGroupList(`${this.sortColumn}:${this.sortOrder}`);
  }

  public onDutyGroupList(sort: any = '') {
    const listRequest = {
      page: this.page,
      limit: this.pageSize,
      searchKey: this.searchText,
      sort: sort
    };
    this.superAdminService.listDutyGroup(listRequest).subscribe({
      next: (res) => {
        let groupList: any = [];
        let encryptedData = { data: res };
        let result = this.coreService.decryptObjectData(encryptedData);
        // console.log("LIST GROUP===>", result);
        groupList = result?.data?.data.map((data: any) => ({
          ondutygroupnumber: data?.onDutyGroupNumber,
          city: data?.city,
          startdate: data?.startDate,
          starttime: data?.startTime,
          enddate: data?.endDate,
          endtime: data?.endTime,
          id: data?._id,
          date_of_creation: data?.date_of_creation
        }));
        this.dataSource = groupList
        //new MatTableDataSource();
        this.pharmacySource = result?.data;
        this.totalLength = result?.data?.totalCount;
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
      },
    });
  }

  checkTodate() {
    // this.maxDate = new Date(this.ondutyForm.controls['end_date'].value);
    this.maxDate = new Date(this.ondutyForm.value.end_date);
    console.log(this.minDate, "min Date");

    // insuranceValidityTo
  }

  checkEnddate() {
    console.log("in checkendDate");

    // this.minDate = new Date(this.ondutyForm.controls['start_date'].value);
    this.minDate = new Date(this.ondutyForm.value.start_date);
  }

  public getGroupDetails(id: any, type: any) {
    const param = {
      onDutyGroupId: id,
    };
    this.DutyForms.clear();
    this.DutyForms.reset();
    this.ondutyForm.reset();
    this.addNewOnDuty();
    this.superAdminService.getOnDutyGroupDetails(param).subscribe({
      next: async (res) => {
        let result = await this.coreService.decryptContext(res);

        console.log(result.data, "getGroupDetails");
        //   var today = new Date();
        //  console.log(today.setHours(today.getHours() + result.data.endTime),'custom data');

        if (result.status) {
          // this.groupData = result.data;
          if (type == "Edit") {
            console.log("tttttttttttttttt11111111111111");

            this.openVerticallyCenterededitonduty(this.editonduty);
          }

          // const momentSTime = moment(result.data.startTime, ["HH:mm"]).toDate();
          // const momentETime = moment(result.data.endTime, ["HH:mm"]).toDate();
          
          this.ondutyForm.patchValue({
            ondutyGroupId: result.data._id,
            ondutyGroupNumber: result.data.onDutyGroupNumber,
            city: result.data.city,
            date_of_creation: result.data.date_of_creation,
          });


          let res_on_duty_arr = [];
          result?.data?.datetimeArray.forEach((ele) => {
            console.log(ele.from_date_timestamp, "hoursnumber");


            console.log("hoursnumber", this.Date_pipe.transform(ele.from_date_timestamp, "hh:mm a"));

            let cdT = {
              start_date: moment(ele.from_date_timestamp).format("YYYY-MM-DD"),
              start_time: this.convertDate(moment(ele.from_date_timestamp).format("hh:mm A")),
              end_date: moment(ele.to_date_timestamp).format("YYYY-MM-DD"),
              end_time: this.convertDate(moment(ele.to_date_timestamp).format("hh:mm A")),
            };

            res_on_duty_arr.push(cdT);
          });
          console.log("tttttttttttttttt111111111111");

          this.patchOnDutyInfo(res_on_duty_arr);
          console.log("tttttttttttttttt33333333333333333", result.data.startDate);


          // this.onDutyGroupNumber = result.data.onDutyGroupNumber;
          // this.city_name = result.data.city;
          // this.startDate = result.data.startDate;
          // this.start_time = result.data.startTime;
          // this.end_date = result.data.endDate;
          // this.end_time = result.data.endTime;


          if (type == "View") {
            this.router.navigate(["/super-admin/openhour/addpharmacy/", id]);
          }
        } else {
          this.coreService.showError(result.message, "");
        }
      },
    });
  }


  convertDate(data) {
    console.log("dattaaa", data);

    const timeString = data; // Replace with your desired time string    
    const timeParts = timeString.split(' ');
    const hoursMinutes = timeParts[0].split(':');
    const meridian = timeParts[1];

    const date = new Date();
    date.setHours(parseInt(hoursMinutes[0], 10));
    date.setMinutes(parseInt(hoursMinutes[1], 10));

    if (meridian === 'PM' && date.getHours() !== 12) {
      date.setHours(date.getHours() + 12);
    } else if (meridian === 'AM' && date.getHours() === 12) {
      date.setHours(0);
    }

    return date;
  }


  patchOnDutyInfo(profile: any) {
    console.log("tttttttttttttttt2222222222222222222222");

    for (let i = 0; i < profile.length - 1; i++) {
      console.log("tttttttttttttttt2222222222222222222222");

      this.addNewOnDuty();
    }
    this.ondutyForm.patchValue({
      onDuty: profile,
    });
  }

  public handlePageEvent(data: any): void {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.onDutyGroupList();
  }

  public onSubmit() {
    console.log("FORM VALUE===>", this.ondutyForm.value);
    let addedDateRanges = [];
    let isAlreadyAdded = false;
    const invalid = [];
    const controls = this.ondutyForm.controls;
    console.log("FORM VALUE===>", controls);

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log("INVALID===>", invalid.length);

    // if (this.ondutyForm.invalid) {
    //   console.log("=======INVALID===========", this.ondutyForm.errors);
    //   return;
    // }
    if (invalid.length > 1) {
      console.log("Form is invalid, cannot submit.");
      return;
    }



    let on_duty_arr = [];
    let allDateRangesValid = true; // Flag to track overall date range validity

    this.ondutyForm.value.onDuty.forEach((el) => {
      console.log(el, "el log");

      const fromDate = moment(el.start_date);
      const toDate = moment(el.end_date);
      const fromTime = moment(el.start_time, 'HH:mm');

      const parsedDateFrom = moment(fromTime, "ddd MMM DD YYYY HH:mm:ss");
      const formattedTimeFrom = parsedDateFrom.format("HH:mm");
      const toTime = moment(el.end_time, 'HH:mm');

      const parsedDate = moment(toTime, "ddd MMM DD YYYY HH:mm:ss");
      const formattedTime = parsedDate.format("HH:mm");
      console.log(formattedTimeFrom, "fromTime", formattedTime);

      if (fromDate.isBefore(toDate) ||
        (fromDate.isSame(toDate) && fromTime.isBefore(toTime))) {

        isAlreadyAdded = addedDateRanges.some((range) => {
          // return (
          // range.startDate === fromDate.format("YYYY-MM-DD") &&
          // range.endDate === toDate.format("YYYY-MM-DD") &&
          // range.startTime === formattedTimeFrom &&
          // range.endTime === formattedTime
          const rangeStartDate = moment(range.startDate);
          const rangeEndDate = moment(range.endDate);
          const rangeStartTime = moment(range.startTime, 'HH:mm');
          const rangeEndTime = moment(range.endTime, 'HH:mm');

          // );

          const overlap = (
            (fromDate.isBetween(rangeStartDate, rangeEndDate, null, '[]') || toDate.isBetween(rangeStartDate, rangeEndDate, null, '[]')) ||
            (rangeStartDate.isBetween(fromDate, toDate, null, '[]') || rangeEndDate.isBetween(fromDate, toDate, null, '[]')) ||
            (fromDate.isSame(rangeStartDate) && toDate.isSame(rangeEndDate) && fromTime.isBetween(rangeStartTime, rangeEndTime, null, '[]'))
          );

          return overlap;

        });
        console.log(isAlreadyAdded, "isAlreadyAdded");

        if (!isAlreadyAdded) {
          let cdT = {
            startDate: fromDate.format("YYYY-MM-DD"),
            startTime: formattedTimeFrom,
            endDate: toDate.format("YYYY-MM-DD"),
            endTime: formattedTime,
          };

          on_duty_arr.push(cdT);
          addedDateRanges.push(cdT);
        }


        else {
          this.coreService.showError('Date range already added', "");

          console.log('Date range already added:', el);
        }
      } else {
        allDateRangesValid = false;
        console.log('Invalid date and time range:', el);
      }
    });

    if (!allDateRangesValid) {



      this.coreService.showError("Check From date And Time Need To Be greater Than To Date And Time!", "");
      // this.toastr.error("Check From date And Time Need To Be greater Than To Date And Time!")
      console.log('At least one date range is invalid. Aborting save.');
      return;
    }



    console.log("789456+85");
    if (isAlreadyAdded) {
      return;
    } else {
      this.loader.start();
      const formVal = {
        onDutyGroupId: this.ondutyForm.value.ondutyGroupId
          ? this.ondutyForm.value.ondutyGroupId
          : "",
        onDutyGroupNumber: this.ondutyForm.value.ondutyGroupNumber,
        city: this.ondutyForm.value.city,
        datetimeArray: on_duty_arr,
        date_of_creation: moment(this.ondutyForm.value.date_of_creation).format("YYYY-MM-DD"),
        createdBy: this.loginID
      };
      console.log("ON DUTY REQ DATA===>", formVal);

      // return;

      this.superAdminService.addOndutyGroupPhar(formVal).subscribe({
        next: (res) => {
          let result = this.coreService.decryptContext(res);
          if (result.status) {
            this.loader.stop();
            this.closePopup();
            this.coreService.showSuccess(result.message, "");
            this.modalService.dismissAll();
            this.onDutyGroupList();
            this.ondutyForm.reset();
          }

          else {            
            this.loader.stop();
            this.coreService.showError(result.message, "");
          }

        },
        error: (err: ErrorEvent) => {
          this.loader.stop();
          console.log(err.message);
        },
      });
    }

  }

  public onUpdate() {
    console.log(this.ondutyForm.value, "on update");
  }

  public getCityList() {
    this.superAdminService
      .getCityListByDepartmentId("")
      .subscribe(async (res) => {

        let result = await this.coreService.decryptContext(res);
        if (result.status == true) {

          result?.body?.list.map((curentval, index:any) => { 
              if(this.cityList.indexOf({
                label:curentval?.name,
                value: curentval?._id,
              })== -1) {
                this.cityList.push({
                  label:curentval?.name,
                  value: curentval?._id,
                });
              } 
            });
console.log("result___________1",this.cityList);

        }
      });
  }

  public deleteGroup(id: any) {
    this.loader.start();
    const param = {
      onDutyGroupId: id,
    };
    this.superAdminService.deleteGroup(param).subscribe({
      next: (res) => {
        let result = this.coreService.decryptContext(res);
        if (result.status) {
          this.closePopup();
          this.loader.stop();
          this.coreService.showSuccess(result.message, "");
          this.onDutyGroupList();
        } else {
          this.closePopup();
          this.loader.stop();
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "error in delete group");
      },
    });
  }

  // Add on duty group modal
  openVerticallyCenteredaddonduty(addonduty: any) {
    this.DutyForms.clear();
    this.DutyForms.reset();
    this.ondutyForm.reset();
    this.addNewOnDuty();

    this.ondutyForm.patchValue({
      date_of_creation: new Date()
    })
    this.modalService.open(addonduty, {
      centered: true,
      size: "md",
      windowClass: "add_onduty",
      keyboard: false,
      backdrop: false,
    });
  }

  // Edit on duty group modal
  openVerticallyCenterededitonduty(editonduty: any) {
    this.modalService.open(editonduty, {
      centered: true,
      size: "md",
      windowClass: "add_onduty",
      keyboard: false,
      backdrop: false,
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
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

  selectedCsv: any = null;

  selectFile(file: any) {
    this.selectedCsv = file.target.files[0];

    console.log("Selected file--->", file.target.files[0]);
    console.log("FIE TYPE===>", file.target.files[0].type);
    this.selectfilename = file.target.files[0].name;
    // this.formSubmitError = "";
    // this.selectedFileName = file.target.files[0].name;
  }

  uploadCsvOnDutyGroup() {
    const formdata = new FormData();
    formdata.append("csv_file", this.selectedCsv);
    if (this.csvFor === "Group") {
      this.loader.start();
      this.superAdminService.uploadBulkCsvDutyGroup(formdata).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });

          console.log("response--->", response);
          if (response.status) {
            this.loader.stop();
            this.coreService.showSuccess("", response.message);
            this.closePopup();
            this.onDutyGroupList();
            this.selectedCsv = null;
            this.selectfilename = "";
          } else {
            this.loader.stop();
            if (response.errorCode == null) {
              this.coreService.showInfo("", response.message);
              this.closePopup();
              this.selectfilename = "";
            } else {
              this.coreService.showError("", response.message);
              this.closePopup();
              this.selectfilename = "";
            }
          }
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.loader.stop();
          this.coreService.showError("", errResponse.message);
        }
      );
    } else {
      this.loader.start();
      this.superAdminService.uploadBulkCsvPharmacyDutyGroup(formdata).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });

          console.log("response--->", response);
          if (response.status) {
            this.loader.stop();
            this.coreService.showSuccess("", response.message);
            this.closePopup();
            this.onDutyGroupList();
            this.selectedCsv = null;
            this.selectfilename = "";
          } else {
            this.loader.stop();
            if (response.errorCode == null) {
              this.coreService.showInfo("", response.message);
              this.closePopup();
              this.selectfilename = "";
            } else {
              this.coreService.showError("", response.message);
              this.closePopup();
              this.selectfilename = "";
            }
          }
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.loader.stop();
          this.coreService.showError("", errResponse.message);
        }
      );
    }
  }

  downloadSampleExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    if (this.csvFor === "Group") {
      link.setAttribute("href", "assets/doc/on_duty_group.xlsx");
      link.setAttribute("download", `sample-on-duty-group.xlsx`);
    } else {
      link.setAttribute("href", "assets/doc/sample-on-duty-pharmacy-group.xlsx");
      link.setAttribute("download", `sample-on-duty-pharmacy-group.xlsx`);
    }

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  closePopup() {
    console.log("check log123");

    this.ondutyForm.reset();
    this.modalService.dismissAll("close");
    this.selectfilename = "";
    this.selectedCsv = null;
  }

  openVerticallyCenteredEditplan(imporsubscriber: any, csvFor: any) {
    this.csvFor = csvFor;
    this.modalService.open(imporsubscriber, {
      centered: true,
      windowClass: "import_subscribes",
    });
  }


  public newOnDutyForm(): FormGroup {
    return this.fb.group({
      start_date: ["", [Validators.required]],
      start_time: ["", [Validators.required]],
      end_date: ["", [Validators.required]],
      end_time: ["", [Validators.required]],
    });
  }

  getCurrentDate() {
    const today = new Date();

    console.log("RETURN TODAY DATE===>", today.toISOString().substring(0, 10))
    return new Date(); // Format the date as YYYY-MM-DD
  }

  get DutyForms(): FormArray {
    return this.ondutyForm.get("onDuty") as FormArray;
  }



  addNewOnDuty() {
    this.DutyForms.push(this.newOnDutyForm());
  }
  removeOnDuty(i: number) {
    // console.log("formindex", i);
    this.DutyForms.removeAt(i);
  }

  openVerticallyCenteredsecond(deletePopup: any, pharmacyId: any) {
    this.pharmacyId = pharmacyId;

    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  // handleClose() {
  //   let modalDespose = this.getDismissReason(1);
  //   this.modalService.dismissAll(modalDespose);
  //   this.modalService.dismissAll("close");
  //   this.lab.clear();
  //   this.labForm.reset();
  //   this.excleForm.reset();
  //   this.addLabs();
  // }

  deletelab(isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      ondutytId: "",
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.ondutytId = "";
    } else {
      reqData.ondutytId = this.selectedLabs;
    }

    console.log("REQUEST DATA LABS===>", reqData);

    this.superAdminService.deleteOnDutyGroupMasterAction(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.onDutyGroupList();
        // this.toastr.success(response.message);
        this.closePopup();
        this.selectedLabs = []
      } else {
        this.loader.stop();
        // this.toastr.error(response.message);
      }
    });
  }

  handleCheckBoxChange(event, medicineId) {
    console.log(event, "sdfsdf", medicineId);

    if (event.checked == true) {
      this.selectedLabs.push(medicineId);
    } else {
      const index = this.selectedLabs.indexOf(medicineId);
      if (index > -1) {
        this.selectedLabs.splice(index, 1);
      }
    }
  }

  makeSelectAll(event: any) {
    console.log(event, "check event all");

    if (event.checked == true) {
      this.dataSource?.map((element) => {
        if (!this.selectedLabs.includes(element?.id)) {
          this.selectedLabs.push(element?.id);
          console.log(this.selectedLabs?.push(element?.id), "event check");
        }
      });
    } else {
      this.selectedLabs = [];
    }
  }


  isAllSelected() {
    let allSelected = false;
    if (this.selectedLabs?.length === this.dataSource?.length && this.selectedLabs?.length != 0) {
      allSelected = true;
    }
    return allSelected;
  }

  openVerticallyCenteredDelete(deletePopup: any, pharmacyId: any) { 
    this.pharmacyId = pharmacyId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }
}
