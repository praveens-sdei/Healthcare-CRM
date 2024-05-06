import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SuperAdminService } from '../../super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormGroup } from '@angular/forms';

export interface PeriodicElement {
  
  complainantName: string;
  complainttype: string
  complaintsid: number;
  complaintreason: string;
  complaintagainsttype: string;
  complaintaganistname: string;  
  dateandtime: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { complainantName: 'Darrell Steward', complainttype: 'Patient', complaintsid: 123456, complaintreason: 'Doctor', complaintagainsttype: 'Lorem Ipsum is simply dummy text...', complaintaganistname: 'Lorem Ipsum is simply dummy text...', dateandtime: '08-21-2022 | 03:50Pm' },
  
];

@Component({
  selector: 'app-complaintlist',
  templateUrl: './complaintlist.component.html',
  styleUrls: ['./complaintlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComplaintlistComponent implements OnInit {
  displayedColumns: string[] = ['complainantName', 'complainttype', 'complaintsid', 'complaintreason', 'complaintagainsttype', 'complaintaganistname', 'dateandtime', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  pageSize: number = 20;
  totalLength: number = 0;
  page: any = 1;
  searchText = "";
  compalintdataSource: any = [];
  selectedOption: string;
  selectedDate: Date = null ;

  sortColumn: string = 'complaint_from_user_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userId: string;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private _superAdminService: SuperAdminService,
    private _coreService: CoreService,

  ) { 
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userId = loginData?._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getComplaintList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getComplaintList(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array?.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
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

  getComplaintList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      // dateFilter: this.selectedDate,
      type : 'superadmin',
      userId : this.userId,
      sort:sort
    };
    console.log("reqDtat", reqData);

    this._superAdminService.getComplaintList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.dataSource = response?.body?.data;
      this.compalintdataSource = response?.body?.data;
      this.totalLength = response?.body?.totalRecords

      console.log("getComplaintList----------------->", response);
    });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getComplaintList();
  }
  handleSearchData(event: any) {
    this.searchText = event.target.value;
    this.getComplaintList();
  }

  // onSelectChange(event: any) {
  //   this.selectedOption = event.value;    
  //   this.getComplaintList();  
  // }

  clearFilter() {
    this.searchText = "";
    // this.selectedOption = "all";
    this.getComplaintList();
  }
  onSelect(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    console.log('Selected Date:', this.selectedDate);
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };


}
