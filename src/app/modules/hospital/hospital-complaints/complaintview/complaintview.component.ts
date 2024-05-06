import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';

export interface PeriodicElement {
  complaintype: string;
  complaintid: string;
  complainanttype: string;
  complaintreason: string;
  complainantname: string; 
  status: string;
  dateandtime: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { complaintype: 'Found Difficulty', complaintid: 'Patient',  complainanttype: 'Lorem Ipsum is simply dummy text of the printing and typesetting...',complaintreason: 'Doctor', complainantname: 'Doctor',status: 'Solved',dateandtime: '08-21-2022 | 03:50Pm'},
 

];

@Component({
  selector: 'app-complaintview',
  templateUrl: './complaintview.component.html',
  styleUrls: ['./complaintview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComplaintviewComponent implements OnInit {
  displayedColumns: string[] = ['complaintype', 'complaintid','complainanttype','complaintreason',  'complainantname', 'status', 'dateandtime','action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  pageSize: number = 20;
  totalLength: number = 0;
  page: any = 1;
  searchText = "";
  compalintdataSource: any = [];

  sortColumn: string = 'complaint_subject';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  userId: any;
  userRole: string;
  userPermission: any;
  innerMenuPremission:any=[];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(

    private _coreService: CoreService,
    private _superAdminService: SuperAdminService

  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.userId = admindata?.in_hospital;

    }else{
      this.userId = loginData?._id;
    }
    this.userPermission = loginData?.permissions;
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
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){ 
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("health_plan")) {
          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;  
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
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }
  giveInnerPermission(value){   
    if(this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }
  
  getComplaintList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      type : 'hospital',
      userId : this.userId,
      sort:sort
    };
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


}
