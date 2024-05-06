import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../super-admin.service';
import { GeoLocationService } from 'src/app/shared/geo-location.service';
import { GeoLocAddressService } from 'src/app/shared/geo-loc-address.service';
declare var $: any;
@Component({
  selector: 'app-super-admin-sidebar',
  templateUrl: './super-admin-sidebar.component.html',
  styleUrls: ['./super-admin-sidebar.component.scss']
})
export class SuperAdminSidebarComponent implements OnInit {

  // userID: string = '634516f8ed22c5c55ff5bc97'
  userID:any;
  userMenu: any = []
  activeMenu: any;
  loginLogo:any='';
  currentLogsID: any;
  currentAddress: string;

  constructor(private service: SuperAdminService, private _coreService: CoreService,private geolocationService: GeoLocationService,
    private addressService: GeoLocAddressService,) { 
    const userData = this._coreService.getLocalStorage('loginData');
    const adminData = this._coreService.getLocalStorage('adminData');
    this.currentLogsID = this._coreService.getSessionStorage('currentLogId');
    this.loginLogo = (adminData?.association_group_icon?.url)?adminData?.association_group_icon?.url:'';
    this.userID = userData._id
    this.getUserMenus()
    this.activeMenu = window.location.pathname
    this.sidebarnavigation()
  }
  getUserMenus(){
    const params = {
      module_name: 'superadmin',
      user_id: this.userID
    }
    this.service.getUserMenus(params).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(res)
      console.log("decryptedData===>",decryptedData)
      const menuArray = {}
      for (const data of decryptedData.body) {
        if (data.parent_id) {
          let val = menuArray[data.parent_id]['children']
          let object = menuArray[data.parent_id]
          console.log("object===>",object)
          val.push({
            id: data._id,
            name: data.menu_id.name,
            route_path: data.menu_id.route_path,
            icon: data.menu_id.menu_icon,
            icon_hover: data.menu_id.menu_icon_hover,
            slug: data.menu_id.slug,
            parent_id: data.parent_id
          })
          object['children'] = val
          menuArray[data.parent_id] = object
        } else {
          menuArray[data.menu_id._id] = {
            id: data._id,
            name: data.menu_id.name,
            route_path: data.menu_id.route_path,
            icon: data.menu_id.menu_icon,
            icon_hover: data.menu_id.menu_icon_hover,
            slug: data.menu_id.slug,
            parent_id: data.parent_id,
            children: []
          }
        }
      }
      this.userMenu = menuArray
      console.log("checkdata", this.userMenu)
    },
    (err) => {
      console.log(err);
    }
  );
  }
  handleNavigationClick(value: any,menuName:any){
    
    this.activeMenu = value;
    this._coreService.setMenuInHeader(menuName);
    this._coreService.setLocalStorage(menuName,'menuTitle');
    
  }

  sidebarnavigation(){
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

    $(document).on('click', "#close-sidebar",function () {
      $(".page-wrapper").removeClass("toggled");
    });
    $(document).on('click', "#show-sidebar",function () {
      $(".page-wrapper").addClass("toggled");
    });
  }

  ngOnInit(): void {
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

        console.log("userAddress___________",response);
      }else{
        this._coreService.showError("", response.message)
      }
     
    })
  }


  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  // setHeader(menuName:any){
  //   this._coreService.setMenuInHeader(menuName);
  //   this._coreService.setLocalStorage(menuName,'menuTitle');
  // }
}