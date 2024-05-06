import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminHospitalService } from "../../super-admin-hospital.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
  selector: "app-hospitalpermission",
  templateUrl: "./hospitalpermission.component.html",
  styleUrls: ["./hospitalpermission.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalpermissionComponent implements OnInit {
  allMenus: any = [];
  menuCheckedArray: any = {};
  checkedMenuArray: any = [];
  children: any = {};
  hospitalId: string = "";
  forportalId: any;

  constructor(
    private service: SuperAdminHospitalService,
    private coreService: CoreService,
    private activateRouted: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    let paramId = this.activateRouted.snapshot.paramMap.get("id");
    this.activateRouted.queryParams.subscribe((params) => {
     
      this.forportalId = params["forPortalId"];
    
      console.log("forportalId___________",this.forportalId);
  });

    this.hospitalId = paramId;
    this.getAllMenus();
    this.getUserMenus();
  }

  handleAssignPerminssions() {
    const reqData = {
      menu_array: this.menuCheckedArray,
      children_array: this.children,
      user_id: this.hospitalId,
    };

    console.log("REQUEST DATA======>", reqData);
    this.service.asignMenuSubmit(reqData).subscribe(
      (res: any) => {
        const response = this.coreService.decryptObjectData(res);
        console.log("RESPONSE ASSIGNED====>", response);
        this.coreService.showSuccess(response.message, "Success");
        this.route.navigate(["/super-admin/hospital"]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getUserMenus() {
    const params = {
      module_name: "superadmin",
      user_id: this.hospitalId,
    };

    console.log("PARAMS====>", params);

    this.service.getUserMenus(params).subscribe(
      (res: any) => {
        const response = this.coreService.decryptObjectData(res);
        console.log("ASSIGNED MENUS RESPONSE======>", response);

        const checkedData = [];
        for (const data of response.body) {
          if (!data.parent_id) {
            this.menuCheckedArray[data.menu_id._id] = data.menu_order;
          }
          checkedData.push(data.menu_id._id);
        }
        this.checkedMenuArray = checkedData;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllMenus() {
    const params = {
      module_name: "superadmin",
      module_type: "hospital",
    };
    this.service.getMenus(params).subscribe(
      (res: any) => {
        const response = this.coreService.decryptObjectData(res);
        console.log("GET ALL HOSPITAL MENUS====>", response);
        const data = [];
        const childrenArray = {};
        for (const menu of response.body) {
          if (menu.parent_id === "0") {
            data.push({
              id: menu._id,
              name: menu.name,
              menu_order: menu.menu_order,
              parent_id: menu.parent_id,
            });
          } else {
            if (menu.parent_id in childrenArray) {
              let val = childrenArray[menu.parent_id];
              val.push(menu._id);
              childrenArray[menu.parent_id] = val;
            } else {
              childrenArray[menu.parent_id] = [menu._id];
            }
          }
        }
        this.allMenus = data;
        this.children = childrenArray;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  makeJSON(value: any, menuID: any, order: any) {
    if (value) {
      this.menuCheckedArray[menuID] = order;
    } else {
      for (const key in this.menuCheckedArray) {
        const getOrder = this.menuCheckedArray[key];
        if (getOrder === order) {
          delete this.menuCheckedArray[key];
        }
      }
    }
    console.log(this.menuCheckedArray, "this.menuCheckedArray");
  }
  makeSelectAll(event:any){

 
    this.allMenus.forEach((data) => {
      if(event.checked==true){ 
    this.checkedMenuArray.push(data.id);
   this.menuCheckedArray[data.id] = data.menu_order
  
  }
   else{
    this.checkedMenuArray=[""];
    for (const key in this.menuCheckedArray) {
      const getOrder = this.menuCheckedArray[key]
      if (getOrder === data.menu_order) {
        delete this.menuCheckedArray[key]
      }
    }
  }
  
    })  
        }

routeBack(){
  this.route.navigate([`/super-admin/hospital/details/${this.forportalId}`]);

}
}
