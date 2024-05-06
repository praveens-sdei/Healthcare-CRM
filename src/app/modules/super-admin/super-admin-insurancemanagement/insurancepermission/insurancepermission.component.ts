import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceManagementService } from '../../super-admin-insurance.service';
@Component({
  selector: 'app-insurancepermission',
  templateUrl: './insurancepermission.component.html',
  styleUrls: ['./insurancepermission.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsurancepermissionComponent implements OnInit {
  allSelected = false;
  allMenus: any = [];
  menuCheckedArray: any = {}
  checkedMenuArray: any = []
  children: any = {};
  userID: string = '';
  forportalId: any;
  constructor(private insuranceManagementService: InsuranceManagementService,
    private _coreService: CoreService,
    private route: Router,
    private activeRoute: ActivatedRoute,
  ) {
    // const userData = this._coreService.getLocalStorage('insAdminId')
    // this.userID = userData
    this.userID = this.activeRoute.snapshot.params["id"];
    console.log("CONSTRUCTOR===>", this.userID)
    this.getAllMenus()
    this.getUserMenus()
  }

  ngOnInit(): void {  
    // const userData = this._coreService.getLocalStorage('loginData')
    // console.log(userData, 'userData');
    // this.userID = userData._id;

  }


  getUserMenus() {
    const params = {
      module_name: 'superadmin',
      user_id: this.userID
    }

    console.log("USER PERMISSIONS===>", params)

    this.insuranceManagementService.getUserMenus(params).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(res)
      console.log(decryptedData, 'decryptedData');

      const checkedData = []
      for (const data of decryptedData.body) {
        if (!data.parent_id) {
          this.menuCheckedArray[data.menu_id._id] = data.menu_order
        }
        checkedData.push(data.menu_id._id)
      }
      this.checkedMenuArray = checkedData
    },
      (err) => {
        console.log(err);
      }
    );
  }


  getAllMenus() {
    const params = {
      module_name: "superadmin",
      module_type: "insurance"
    }
    this.insuranceManagementService.getMenus(params).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(res)
      const data = []
      const childrenArray = {}
      for (const menu of decryptedData.body) {
        if (menu.parent_id === '0') {
          data.push({
            id: menu._id,
            name: menu.name,
            menu_order: menu.menu_order,
            parent_id: menu.parent_id
          })
        } else {
          if (menu.parent_id in childrenArray) {
            let val = childrenArray[menu.parent_id]
            val.push(menu._id)
            childrenArray[menu.parent_id] = val
          } else {
            childrenArray[menu.parent_id] = [menu._id]
          }
        }
      }
      this.allMenus = data
      this.children = childrenArray
    },
      (err) => {
        console.log(err);
      }
    );
  }

  // makeJSON($event.checked, menu.id, menu.menu_order)
  makeJSON(value: any, menuID: any, order: any) {
    console.log(menuID, order, "menuID,order");

    if (value) {
      this.menuCheckedArray[menuID] = order
    } else {
      for (const key in this.menuCheckedArray) {
        const getOrder = this.menuCheckedArray[key]
        if (getOrder === order) {
          delete this.menuCheckedArray[key]
        }
      }
    }
    console.log(this.menuCheckedArray, 'this.menuCheckedArray');

  }
  assignSubmit() {
    const data = {
      menu_array: this.menuCheckedArray,
      children_array: this.children,
      user_id: this.userID
    }
    this.insuranceManagementService.asignMenuSubmit(data).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(res)
      console.log(decryptedData);

      this._coreService.showSuccess(decryptedData.message, "Success");
      this.route.navigate(['/super-admin/master'], {
        queryParams: {
          activeTab: 8
        }
      });

    },
      (err) => {
        console.log(err);
      }
    );
  }
  makeSelectAll(event: any) {


    this.allMenus.forEach((data) => {
      if (event.checked == true) {
        this.checkedMenuArray.push(data.id);
        this.menuCheckedArray[data.id] = data.menu_order

      }
      else {
        this.checkedMenuArray = [""];
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
    this.route.navigate([`/super-admin/insurance/details/${this.userID}/1`])
  }

}
