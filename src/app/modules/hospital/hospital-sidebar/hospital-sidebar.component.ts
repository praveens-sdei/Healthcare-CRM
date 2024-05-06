import { Component, OnInit } from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceManagementService } from "../../super-admin/super-admin-insurance.service";
import { Router } from "@angular/router";
import { GeoLocationService } from "src/app/shared/geo-location.service";
import { GeoLocAddressService } from "src/app/shared/geo-loc-address.service";
import { HospitalService } from "../hospital.service";
declare var $: any;
@Component({
  selector: "app-hospital-sidebar",
  templateUrl: "./hospital-sidebar.component.html",
  styleUrls: ["./hospital-sidebar.component.scss"],
})
export class HospitalSidebarComponent implements OnInit {
  currentLogsID: any;
  ngOnInit(): void {
    this.getGeoLocation();
    // $(".sidebar-dropdown > a").click(function (e: any) {
    //   $(".sidebar-submenu").slideUp(200);
    //   if (
    //     $(".sidebar-dropdown > a")
    //       .parent()
    //       .hasClass("active")
    //   ) {
    //     $(".sidebar-dropdown").removeClass("active");
    //     $(".sidebar-dropdown > a")
    //       .parent()
    //       .removeClass("active");
    //   } else {
    //     $(".sidebar-dropdown").removeClass("active");
    //     $(".sidebar-dropdown > a")
    //       .next(".sidebar-submenu")
    //       .slideDown(200);
    //     $(".sidebar-dropdown > a")
    //       .parent()
    //       .addClass("active");
    //   }
    // });
    // $(".nav-item").click( () => {
    //   $(this).addClass("active");
    // });
    // $("#close-sidebar").click(function () {
    //   $(".page-wrapper").removeClass("toggled");
    // });
    // $("#show-sidebar").click(function () {
    //   $(".page-wrapper").addClass("toggled");
    // });
  }

  // ngOnInit(): void {
  //   console.log('sidebar');

  // }
  currentAddress: string;

  userID: string = "634516f8ed22c5c55ff5bc97";
  userMenu: any = [];
  activeMenu: any;
  constructor(
    private insuranceManagementService: InsuranceManagementService,
    private _coreService: CoreService,
    private route: Router,
    private geolocationService: GeoLocationService,
    private addressService: GeoLocAddressService,
    private _hospitalService: HospitalService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.currentLogsID = this._coreService.getSessionStorage('currentLogId')

    this.getUserMenus();
    this.activeMenu = window.location.pathname;
    this.sidebarnavigation();
  }

  getGeoLocation() {
    this.geolocationService.getCurrentPosition()
      .then(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        return this.addressService.getAddress(latitude, longitude);
      })
      .then(address => {
        this.currentAddress = address;   
        this.updateLogs();
      })
      .catch(error => {
        console.error('Error getting geolocation:', error);
        this.currentAddress = 'Error getting geolocation';
      });
  }

  updateLogs(){
    let reqData ={
      currentLogID : this.currentLogsID,
      userAddress : this.currentAddress
    }
    this._hospitalService.updateLogs(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status == true){

      }else{
        this._coreService.showError("", response.message)
      }
     
    })
  }

  getUserMenus() {
    const params = {
      module_name: "superadmin",
      user_id: this.userID,
    };
    this.insuranceManagementService.getUserMenus(params).subscribe(
      (res: any) => {
        const decryptedData = this._coreService.decryptObjectData(res);
        
        const menuArray = {};
        for (const data of decryptedData.body) {
          if (data.parent_id) {
            let val = menuArray[data.parent_id]["children"];
            let object = menuArray[data.parent_id];
            val.push({
              id: data._id,
              name: data.menu_id.name,
              route_path: data.menu_id.route_path,
              icon: data.menu_id.menu_icon,
              icon_hover: data.menu_id.menu_icon_hover,
              slug: data.menu_id.slug,
              parent_id: data.parent_id,
            });
            object["children"] = val;
            menuArray[data.parent_id] = object;
          } else {
            menuArray[data.menu_id._id] = {
              id: data._id,
              name: data.menu_id.name,
              route_path: data.menu_id.route_path,
              icon: data.menu_id.menu_icon,
              icon_hover: data.menu_id.menu_icon_hover,
              slug: data.menu_id.slug,
              parent_id: data.parent_id,
              children: [],
            };
          }
        }
        this.userMenu = menuArray;
        console.log(" this.userMenu ___________", this.userMenu );
        
      },
      (err) => {
        console.log(err);
      }
    );
  }
  handleNavigationClick(value: any) {
    this.activeMenu = value;
  }

  sidebarnavigation() {
    // $(document).on('click', ".sidebar-dropdown > a", function (e: any) {
    //   $(".sidebar-submenu").slideUp(200);
    //   if (
    //     $(".sidebar-dropdown > a")
    //       .parent()
    //       .hasClass("active")
    //   ) {
    //     $(".sidebar-dropdown").removeClass("active");
    //     $(".sidebar-dropdown > a")
    //       .parent()
    //       .removeClass("active");
    //   } else {
    //     $(".sidebar-dropdown").removeClass("active");
    //     $(".sidebar-dropdown > a")
    //       .next(".sidebar-submenu")
    //       .slideDown(200);
    //     $(".sidebar-dropdown > a")
    //       .parent()
    //       .addClass("active");
    //   }
    // });

    // $(document).on('click', ".nav-item", () => {
    //   $(this).addClass("active");
    // });

    $(document).on("click", "#close-sidebar", function () {
      $(".page-wrapper").removeClass("toggled");
    });
    $(document).on("click", "#show-sidebar", function () {
      $(".page-wrapper").addClass("toggled");
    });
  }

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  async handleRouting(routePath: any,menuName='') {
    this._coreService.setMenuInHeader(menuName);
    this.route.navigate([routePath]);
  }
}
