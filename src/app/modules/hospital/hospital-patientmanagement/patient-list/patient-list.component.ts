import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HospitalService } from '../../hospital.service';
import { CoreService } from 'src/app/shared/core.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IndiviualDoctorService } from 'src/app/modules/individual-doctor/indiviual-doctor.service';

export interface PeriodicElement {
  patientname: string;
  gender: string;
  age: string;
  phonenumber: string;
  location: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {

  displayedColumns: string[] = [
    "patientname",
    "gender",
    "age",
    "phonenumber",
    "location",
    "active",
    "lockuser",
    "action"];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  
    @ViewChild("lockOrUnloackmodal") lockOrUnloackmodal: TemplateRef<any>;
    @ViewChild("activateDeactivate") activateDeactivate: TemplateRef<any>;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    userID: any;
    searchText = "";
  
    pageSize: number = 5;
    totalLength: number = 0;
    page: any = 1;
  
    sortColumn: string = 'full_name';
    sortOrder: 1 | -1 = 1;
    sortIconClass: string = 'arrow_upward';
    innerMenuPremission: any = [];
    patientId: any = "";
    doctorId: any = "";
    abc: any = "Lock";
    efg: any = "Deactivate";
    userRole: any;
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    constructor(
      private _hospitalService: HospitalService,
      private _coreService: CoreService,
      private modalService: NgbModal,
      private route: Router,
      private doctorservice: IndiviualDoctorService,
    ) {
      const loginData = this._coreService.getLocalStorage('loginData')
      this.userID = loginData?._id;
      this.userRole = loginData?.role;
  
    }
    onSortData(column: any) {
      this.sortColumn = column;
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
      this.gethospitalPatient(`${column}:${this.sortOrder}`);
    }
    ngOnInit(): void {
      this.gethospitalPatient();
      setTimeout(() => {
        this.checkInnerPermission();
      }, 2000);
    }
  
  
    findObjectByKey(array, key, value) {
      return array.find(obj => obj[key] === value);
    }
  
    checkInnerPermission() {
  
      let userPermission = this._coreService.getLocalStorage("loginData").permissions;
  
      let menuID = sessionStorage.getItem("currentPageMenuID");
  
      let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)
  
      if (checkData) {
        if (checkData.isChildKey == true) {
  
          var checkSubmenu = checkData.submenu;
  
          if (checkSubmenu.hasOwnProperty("claim-process")) {
            this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;
  
          } else {
            console.log(`does not exist in the object.`);
          }
  
        } else {
          var checkSubmenu = checkData.submenu;
  
          let innerMenu = [];
  
          for (let key in checkSubmenu) {
  
            innerMenu.push({ name: checkSubmenu[key].name, slug: key, status: true });
          }
  
          this.innerMenuPremission = innerMenu;
          console.log("this.innerMenuPremission_______________-", this.innerMenuPremission);
  
        }
      }
  
  
    }
    giveInnerPermission(value) {
      if (this.userRole === "INDIVIDUAL_DOCTOR_STAFF" || this.userRole === "HOSPITAL_STAFF") {
        const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
        return checkRequest ? checkRequest.status : false;
      } else {
        return true;
      }
  
  
    }
  
    gethospitalPatient(sort: any = '') {
      let reqData = {
        page: this.page,
        limit: this.pageSize,
        hospitalId: this.userID,
        searchText: this.searchText,
        sort: sort
      };
      this._hospitalService.gethospitalPatient(reqData).subscribe(
        (res: any) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          console.log("response", response);
          if (response.status == true) {
            this.dataSource = response?.body?.allPatient;
            this.totalLength = response?.body?.count;
            console.log("this.totalLength===>", this.totalLength)
          }
        }, (error) => {
  
        })
  
    }
  
    public handlePageEvent(data: { pageIndex: number; pageSize: number }): void {
      this.page = data.pageIndex + 1;
      this.pageSize = data.pageSize;
      this.gethospitalPatient();
    }
  
    handleSearchFilter(text: any) {
      this.searchText = text;
      this.gethospitalPatient();
    }
  
    calculateAge(dob: any) {
      let timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
      let patientAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      return patientAge;
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
  
    handleToggleChangeForActive(event: any, id: any) {
      this.patientId = id;
      if (event === false) {
        this.efg = "Deactivate";
      } else {
        this.efg = "Activate";
      }
      this.modalService.open(this.activateDeactivate);
    }
  
    activeLockDeleteDoctor(action: string, value: boolean) {
      let reqData = {
        patientId: this.patientId,
        action_name: action,
        action_value: value,
      };
  
      console.log("REQUEST DATA=========>", reqData);
  
      this.doctorservice.activeAndLockPatient(reqData).subscribe((res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        this.modalService.dismissAll("close");
        if (response.status == true) {
  
          this._coreService.showSuccess("", response.message);
        }else{
          this._coreService.showError("", response.message);
        }
      });
    }
  

    routeToNext(patientId:any,doctorId:any){
      console.log(doctorId,"patientId__________",patientId);
      this.route.navigate([`/hospital/patientmanagement/details`],{
        queryParams :{
          patientId : patientId,
          doctorId : doctorId
        }
        
      })
    }

}
