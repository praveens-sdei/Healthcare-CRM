import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CoreService } from 'src/app/shared/core.service';
import { PharmacyService } from '../pharmacy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  claimdate: string;
  policytype: string;
  claimamount: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA'},
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA'},
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA'},
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA'},
  { claimdate: '11/18/2020', policytype: 'Medical Consultation', claimamount: '10 000 CFA'},
];


@Component({
  selector: 'app-pharmacy-revenuemanagement',
  templateUrl: './pharmacy-revenuemanagement.component.html',
  styleUrls: ['./pharmacy-revenuemanagement.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PharmacyRevenuemanagementComponent implements OnInit {

  displayedColumns: string[] = ['claimdate', 'policytype', 'claimamount'];
  dataSource = ELEMENT_DATA;
  userRole: any;
  userPermission: any;
  innerMenuPremission:any =[];
  pharmacyId:any;
  directPayment: number=0;
  pendingClaimAmount:number=0;
  approvedClaimAmount:number=0;
  CopayAmount:number=0;
  directPaymentGraph: any;
  coPaymentGraph:any;
  insuredGraph:any;

  startDateFilter: any="";
  endDateFilter: any="";
  selectedYear: number;
  years: number[] = [];
  graphyear: number;

  constructor(
    private _coreService: CoreService,
    private _pharmacyService: PharmacyService,
    private modalService: NgbModal
  ) {
    this.yeardropdown();
    let userData = this._coreService.getLocalStorage('loginData')
    this.userRole = userData?.role;
    this.pharmacyId = userData?._id;
    this.userPermission = this._coreService.getLocalStorage("loginData").permissions;
   }

   yeardropdown() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 4; i--) {
      this.years.push(i);
    }

    this.selectedYear = currentYear;
    this.graphyear = currentYear;
  }

  // Bar chart
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Medical Consultation', 'Medicine', 'Hospitalization'],
    datasets: [
      { data: [ 80,60,75 ],
         label: 'Series A',
         backgroundColor: ["#0B4977"],
         hoverBackgroundColor: ["#D9EFFF"],
         barThickness: 40,
         borderColor: ["#0B4977"],
         borderWidth: 1,
         borderRadius:10,
         hoverBorderColor: "#D9EFFF",
         hoverBorderWidth: 0,
         yAxisID: 'y-axis-r', 
        },
      
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

 
  ngOnInit(): void {
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);  

    this.getClaimAmount(this.startDateFilter,this.endDateFilter);
    this.getOrderCopayment(this.startDateFilter,this.endDateFilter);

    // this.getOrderCopayment();
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
    if(this.userRole === "PHARMACY_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }

  getClaimAmount(startyearDate,endyearDate){
    let reqData = {
      pharmacyId: this.pharmacyId,
      createdDate: startyearDate,
      updatedDate: endyearDate,
    };

    this._pharmacyService.getAllClaimRevenue(reqData).subscribe(async(res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response________",response)

      await this.getOrderCopayment(startyearDate,endyearDate);
      if (response.status) {
      this.pendingClaimAmount = response?.data?.alltotalRequestedAmount;
      this.approvedClaimAmount = response?.data?.alltotalApprovedAmount;
      this.CopayAmount = response?.data?.alltotalCoPayment;
      this.coPaymentGraph = Object.values(response?.data?.monthlyCoPayment);
      this.insuredGraph = Object.values(response?.data?.monthlyInsuredPayment);

      this.pieChartDatasets = [
        {
          data: [ this.approvedClaimAmount, this.directPayment,this.CopayAmount],
          backgroundColor: ['#4880FF','#1BEDD4','#FF6069'],
          // hoverBackgroundColor: ['#1BEDD4', '#FF6069', '#4880FF'],
          // hoverBorderColor: ['#1BEDD4', '#FF6069', '#4880FF'],
        }
      ]

      this.monthbarChartData = {
        labels: ['January','February','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'],
        datasets: [

          { data:  this.coPaymentGraph,
            label: 'Series A',
            backgroundColor: ["#0B4977"],
            hoverBackgroundColor: ["#0B4977"],
            barThickness: 20,
            borderColor: ["#0B4977"],
            borderWidth: 1,
            borderRadius:15,
            hoverBorderColor: "#0B4977",
            hoverBorderWidth: 0,
            yAxisID: 'y-axis-r', 
           },
           { data: this.insuredGraph ,
            label: 'Series B',
            backgroundColor: ["#3DA7C8"],
            hoverBackgroundColor: ["#3DA7C8"],
            barThickness: 20,
            borderColor: ["#3DA7C8"],
            borderWidth: 1,
            borderRadius:15,
            hoverBorderColor: "#3DA7C8",
            hoverBorderWidth: 0,
            yAxisID: 'y-axis-r', 
            },
        ]
      };
      }

    }
    );
  }

  getOrderCopayment(startyearDate,endyearDate){
    let reqData = {
      pharmacyId: this.pharmacyId,
      createdDate: startyearDate,
      updatedDate: endyearDate
    };

    this._pharmacyService.getTotalCopayment(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("response11111________",response)
      if (response.status) {
        this.directPayment = response?.data?.allco_payment;

        this.directPaymentGraph = Object.values(response?.data?.graphdata);

        this.lineChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              data:  this.directPaymentGraph,
              label: 'Series A',
              tension: 0.5,
              borderColor: '#3DA7C8',
              backgroundColor: 'white'
            }
          ]
        };
      }
    }
    ); 
  }

  handleSelectStartDateFilter(event: any) {    
    this.selectedYear=this.years[""]
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate
    console.log( this.startDateFilter," this.startDateFilter " );
    
    this.getClaimAmount(this.startDateFilter,this.endDateFilter );
  }

  handleSelectEndDateFilter(event: any) {    
    this.selectedYear=this.years[""]
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)
    console.log("originalDate",originalDate);    
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate
    this.getClaimAmount(this.startDateFilter,this.endDateFilter );
  }

  extendDateFormat(mydate){
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30); 
    return mydate
  }

  openVerticallyCenteredclaimlistpopup(claimlistpopup: any) {
    this.modalService.open(claimlistpopup, {
      centered: true,
      size: "lg",
      windowClass: "edit_staffnew",
    });
  }

  openVerticallyCenteredpiechartpopup(piechartpopup: any) {
    this.modalService.open(piechartpopup, {
      centered: true,
      size: "md",
      windowClass: "edit_staffnew",
    });
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  @ViewChild('select') select: MatSelect;

  allSelected=false;
   foods: any[] = [
    {value: 'ASCOMA', viewValue: 'ASCOMA'},
    {value: 'Coris', viewValue: 'Coris'},
    {value: 'yelen', viewValue: 'yelen'}
  ];
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
   optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // pie chart
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartDatasets = [ {
    data: [],
    backgroundColor: ['#1BEDD4', '#FF6069', '#4880FF'],
    // hoverBackgroundColor: ['#1BEDD4', '#FF6069', '#4880FF'],
    // hoverBorderColor: ['#1BEDD4', '#FF6069', '#4880FF'],
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

public lineChartData: ChartConfiguration<'line'>['data'] = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Augs',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      data: [],
      label: 'Series A',
      tension: 0.5,
      borderColor: '#3DA7C8',
      backgroundColor: 'white'
    },
    
  ]
};
public lineChartOptions: ChartOptions<'line'> = {
  responsive: true
};
public lineChartLegend = false;

//Month Bar chart
public monthbarChartLegend = false;
public monthbarChartPlugins = [];
public monthbarChartData: ChartConfiguration<'bar'>['data'] = {
  labels: [ 'Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'],
  datasets: [
    { data: [],
       label: 'Series A',
       backgroundColor: ["#0B4977"],
       hoverBackgroundColor: ["#0B4977"],
       barThickness: 20,
       borderColor: ["#0B4977"],
       borderWidth: 1,
       borderRadius:15,
       hoverBorderColor: "#0B4977",
       hoverBorderWidth: 0,
       yAxisID: 'y-axis-r', 
      },
      { data: [],
        label: 'Series B',
        backgroundColor: ["#3DA7C8"],
        hoverBackgroundColor: ["#3DA7C8"],
        barThickness: 20,
        borderColor: ["#3DA7C8"],
        borderWidth: 1,
        borderRadius:15,
        hoverBorderColor: "#3DA7C8",
        hoverBorderWidth: 0,
        yAxisID: 'y-axis-r', 
       },
  ],
};
public monthbarChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  
};



}
