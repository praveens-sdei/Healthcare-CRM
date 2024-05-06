import { CoreService } from "src/app/shared/core.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { SuperAdminService } from "../../super-admin/super-admin.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GeoLocationService } from "src/app/shared/geo-location.service";
import { GeoLocAddressService } from "src/app/shared/geo-loc-address.service";
import { FourPortalService } from "../four-portal.service";
declare var $: any;
@Component({
  selector: 'app-four-portal-sidebar',
  templateUrl: './four-portal-sidebar.component.html',
  styleUrls: ['./four-portal-sidebar.component.scss']
})
export class FourPortalSidebarComponent implements OnInit {

  doctorRole: any = "";

  userID: string = "";
  userMenu: any = [];
  activeMenu: any;

  isPlanPurchased:boolean=false

  @ViewChild("confirmationModel") confirmationModel: any;
  route_type: string;
  currentLogsID: any;
  currentAddress: string;

  constructor(
    private _coreService: CoreService,
    private sadminServce: SuperAdminService,
    private route: Router,
    private modalService: NgbModal,
    private activateroute: ActivatedRoute,
    private geolocationService: GeoLocationService,
    private addressService: GeoLocAddressService,
    private service : FourPortalService

  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorRole = loginData?.role;
    this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
    this.userID = loginData._id;
  }
  ngOnInit(): void {
    this.activateroute.paramMap.subscribe(params => {
      this.route_type = params.get('path');
    });
    this.getUserMenus();
    this.activeMenu = window.location.pathname;
    this.sidebarnavigation();
    this.getGeoLocation();
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
    this.service.updateLogs(reqData).subscribe((res) => {
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
    this.sadminServce.getUserMenus(params).subscribe(
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
        
      },
      (err) => {
        console.log(err);
      }
    );
  }

  handleNavigationClick(value: any, heading: any) {
    this.activeMenu = value;
    this.setHeader(heading);
  }

  sidebarnavigation() {
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

  setHeader(menuName: any) {
    this._coreService.setMenuInHeader(menuName);
    this._coreService.setLocalStorage(menuName, "menuTitle");
  }

  async handleRouting(routePath: any) {
    this.route.navigate([routePath]);
  }

  public handleClose() {
    this.modalService.dismissAll("close");
  }

  purchasePlan() {
    this.route.navigate([`/portals/dashboard/${this.route_type}`]);
    this.handleClose();
  }

  public openActionPopup(actionPopup: any) {
    this.modalService.open(actionPopup, { centered: true, size: "lg" });
  }
}

