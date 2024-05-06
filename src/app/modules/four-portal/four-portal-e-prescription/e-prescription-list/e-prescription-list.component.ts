import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";

export interface PeriodicElement {
  patientname: string;
  eprescriptionid: string;
  dateandtime: string;
  consultationtype: string;
  reasonforappt: string;
  fee: string;
  status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    patientname: "Cameron Williamson",
    eprescriptionid: "#1515411215",
    dateandtime: "08-25-2022 | 10:30AM",
    consultationtype: "Online",
    reasonforappt: "Lorem Ipsum simply",
    fee: "$200",
    status: "Completed",
  },
  {
    patientname: "Cameron Williamson",
    eprescriptionid: "#1515411215",
    dateandtime: "08-25-2022 | 10:30AM",
    consultationtype: "Online",
    reasonforappt: "Lorem Ipsum simply",
    fee: "$200",
    status: "Completed",
  },
  {
    patientname: "Cameron Williamson",
    eprescriptionid: "#1515411215",
    dateandtime: "08-25-2022 | 10:30AM",
    consultationtype: "Online",
    reasonforappt: "Lorem Ipsum simply",
    fee: "$200",
    status: "Completed",
  },
  {
    patientname: "Cameron Williamson",
    eprescriptionid: "#1515411215",
    dateandtime: "08-25-2022 | 10:30AM",
    consultationtype: "Online",
    reasonforappt: "Lorem Ipsum simply",
    fee: "$200",
    status: "Completed",
  },
  {
    patientname: "Cameron Williamson",
    eprescriptionid: "#1515411215",
    dateandtime: "08-25-2022 | 10:30AM",
    consultationtype: "Online",
    reasonforappt: "Lorem Ipsum simply",
    fee: "$200",
    status: "Completed",
  },
];

@Component({
  selector: 'app-e-prescription-list',
  templateUrl: './e-prescription-list.component.html',
  styleUrls: ['./e-prescription-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EPrescriptionListComponent implements OnInit {
  displayedColumns: string[] = [
    "patientname",
    "eprescriptionid",
    "dateandtime",
    // "appointmenttype",
    "consultationtype",
    "reasonforappt",
    "fee",
    // "status",
    "action",
  ];
  dataSource: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userId: any = "";

  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;

  selectedType: any = "ALL";

  sortColumn: string = 'appointment.patientDetails.patientFullName';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  userType: any;
  userRole: any;
  innerMenuPremission:any=[];
  constructor(
    private fourPoratlService: FourPortalService,
    private indiviualDoctorService: IndiviualDoctorService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private router: Router
  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userType = loginData?.type
    this.userRole = loginData?.role;
    if(this.userRole === 'STAFF'){
      this.userId = adminData.creatorId;

    }else{
      this.userId = loginData._id;

    }
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllEprescription(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
   

    this.getAllEprescription(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

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
        console.log("this.innerMenuPremission_______________-",this.innerMenuPremission);
        
      }      
    }  
    

  }
  giveInnerPermission(value){
    if(this.userRole === "STAFF" || this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }

  
  }



  handleSelectFliterList(event: any) {
    this.selectedType = event.value;
    this.getAllEprescription();
  }

  getAllEprescription(sort:any='') {
    let reqData = {
      portalId: this.userId,
      page: this.page,
      limit: this.pageSize,
      appointmentType: this.selectedType,
      sort:sort,
      portal_type:this.userType 
    };


    this.fourPoratlService
      .fourPortal_listAllePrescription(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.dataSource = response?.body?.result;
          this.totalLength = response?.body?.totalRecords;
        }
      });
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllEprescription();
  }


  routeToDetails(id:any){
    this.router.navigate([`portals/eprescription/${this.userType}/details/${id}`])
  }
  validatePage(id:any){
    this.router.navigate([`/portals/eprescription/${this.userType}/validate-eprescription/${id}`])
  }
}

