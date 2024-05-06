import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { InsuranceManagementService } from "src/app/modules/super-admin/super-admin-insurance.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { IInsuranceStaffResponse } from "../../insurance-staffmanagement/addstaff/insurance-add-staff.type";
import { InsuranceService } from "../../insurance.service";
import { AbstractControl, FormBuilder, FormGroup, Validators,FormArray } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  sectionname: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { sectionname: "Approved Claims" },
  { sectionname: "Approved Claims" },
  { sectionname: "Approved Claims" },
  { sectionname: "Approved Claims" },
  { sectionname: "Approved Claims" },
];

@Component({
  selector: "app-selectrole",
  templateUrl: "./selectrole.component.html",
  styleUrls: ["./selectrole.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SelectroleComponent implements OnInit {
  displayedColumns: string[] = ["sectionname", "selectall"];
  dataSource = ELEMENT_DATA;
  roleForm: FormGroup;
  isSubmitted: boolean = false;
  panelOpenState = false;
  userID: any;
  allMenus: any[];
  children: {};
  checkedMenuArray: any = [];
  menuCheckedArray: any = {};
  allSubmenuesData: any = [];
selectall:any=false
  staffID: any;
  staffError: boolean = false;
  menuWiseSubmenu: any = [];
  menuName: any;
  newMenu: any;
  subMenuKeys: any = [];
  newKey: any;
  objectMenus: any = [];
  selectedOptionSubMenu: any = [];
  selectedOptioninnerSubMenu: any = [];
  activeSubmenuId: number;
  activeSubmenuIdsubmenu: any;
  selectedMenuItem: any = [];
  activemainmenuselectedid: any;
  alllogindata = [];
  initialValue: any;
  overlay: false;
  staffList: any[]=[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private _coreService: CoreService,
    private _insuranceService: InsuranceService,
    private insuranceManagementService: InsuranceManagementService,
    private fb: FormBuilder,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;

    // this.roleForm = this.fb.group({
    //   name: ['', [Validators.required]],
    //   status: [true]
    // })

    this.roleForm = this.fb.group({
      roles: this.fb.array([]),
    });

    this.initialValue = this.roleForm.value
  }

  ngOnInit(): void {
    this.getAllStaff();
    // this.getAllMenus()
    this.addnewRole();
    this.getLoginMenus();
  }

  openVerticallyCommonModal(commanModalForAll: any, id: any, name: any) {
    this.menuName = name;
    this.activemainmenuselectedid = id;
    let data = this.allSubmenuesData.filter((el: any) => {
      return el.parent_id === id;
    });
    if (data && data.length > 0) {
      this.menuWiseSubmenu = data[0].submenu;
      for (var key in this.menuWiseSubmenu) {
        // this.selectedOptioninnerSubMenu.push([]);
        var obj = this.menuWiseSubmenu[key];

        this.objectMenus.push(obj.inner_submenu);
      }
      // console.log(this.objectMenus, "objectMenus");
      // this.objectKeys(this.menuWiseSubmenu);
      this.modalService.open(commanModalForAll, {
        centered: true,
        backdrop: "static",
        size: "md",
        windowClass: "permission_commit",
      });
    } else {
    }
  }
  objectKeys(obj) {
    return Object.keys(obj);
  }

  toggle(item, event: MatCheckboxChange, i) {
    if (event.checked) {
      this.selectedOptionSubMenu.push(item?.name);

      if (i == this.activeSubmenuId) {
        this.objectMenus[this.activeSubmenuId].forEach((ele: any) => {
          const index = this.selectedOptioninnerSubMenu[
            this.activeSubmenuId
          ].indexOf(ele?.name);
          if (index >= 0) {
            this.selectedOptioninnerSubMenu[this.activeSubmenuId].push(
              ele?.name
            );
          }
        });
      }
    } else {
      const index = this.selectedOptionSubMenu.indexOf(item?.name);
      if (index >= 0) {
        this.selectedOptionSubMenu.splice(index, 1);
        if (i == this.activeSubmenuId) {
          this.selectedOptioninnerSubMenu[this.activeSubmenuId].length = 0;
        }
      }
    }
  }

  check(i, submenu) {
    this.activeSubmenuId = i;
    this.activeSubmenuIdsubmenu = submenu;
  }

  exists(id, item, i) {
    //  this.activeSubmenuId = i

    if (i == this.activeSubmenuId) {
      let data = this.isCheckedInner();
      if (data == true) {
        if (this.selectedOptionSubMenu.indexOf(id) == -1) {
          this.selectedOptionSubMenu.push(item?.name);
          return true;
        }
      } else {
        if (
          this.selectedOptionSubMenu.length > 0 &&
          this.selectedOptioninnerSubMenu[this.activeSubmenuId].length == 0 &&
          this.objectMenus[this.activeSubmenuId].length != 0
        ) {
          const index = this.selectedOptionSubMenu.indexOf(item?.name);
          if (index >= 0) {
            this.selectedOptionSubMenu.splice(index, 1);
          }
        }
      }
    } else {
    }
    return this.selectedOptionSubMenu.indexOf(id) > -1;
  }

  existsInner(id) {
    return (
      this.selectedOptioninnerSubMenu[this.activeSubmenuId].indexOf(id) > -1
    );
  }

  isIndeterminate() {
    return this.selectedOptionSubMenu.length > 0 && !this.isChecked();
  }
  isIndeterminateInner(item: any) {
    if (item == this.activeSubmenuId) {
      return (
        this.selectedOptioninnerSubMenu[this.activeSubmenuId].length > 0 &&
        !this.isCheckedInner()
      );
    } else {
      return false;
    }
  }

  isCheckedInner(i = "") {
    if (this.selectedOptioninnerSubMenu[this.activeSubmenuId].length > 0) {
      return (
        this.selectedOptioninnerSubMenu[this.activeSubmenuId].length ===
        this.objectMenus[this.activeSubmenuId].length
      );
    } else {
      return false;
    }
  }

  isChecked() {
    return (
      this.selectedOptionSubMenu.length ===
      this.objectKeys(this.menuWiseSubmenu).length
    );
  }

  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.objectKeys(this.menuWiseSubmenu).forEach(
        (pharmacy: any, index: any) => {
          if (
            this.selectedOptionSubMenu.indexOf(
              this.menuWiseSubmenu[pharmacy].name
            ) == -1
          ) {
            this.selectedOptionSubMenu.push(
              this.menuWiseSubmenu[pharmacy].name
            );
          }
          this.objectMenus[index].forEach((ele: any) => {
            if (
              this.selectedOptioninnerSubMenu[index].indexOf(ele?.name) == -1
            ) {
              this.selectedOptioninnerSubMenu[index].push(ele?.name);
            }
          });
        }
      );
    } else {
      this.selectedOptionSubMenu.forEach((ele: any, index) => {
        this.selectedOptioninnerSubMenu[index].length = 0;
      });

      this.selectedOptionSubMenu.length = 0;
    }
  }

  toggleInner(item, event: MatCheckboxChange) {
    if (event.checked) {
      if (
        this.selectedOptioninnerSubMenu[this.activeSubmenuId].indexOf(
          item?.name
        ) == -1
      ) {
        this.selectedOptioninnerSubMenu[this.activeSubmenuId].push(item?.name);
      }
    } else {
      const index = this.selectedOptioninnerSubMenu[
        this.activeSubmenuId
      ].indexOf(item?.name);
      if (index >= 0) {
        this.selectedOptioninnerSubMenu[this.activeSubmenuId].splice(index, 1);
      }
    }
    // this.association_group_selected_insuranceService = this.selectedOptionSubMenu.join(",");
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.activeSubmenuId;
    this.activeSubmenuIdsubmenu;
    this.objectMenus = [];
    this.menuWiseSubmenu = [];
    this.addnewRole();
  }

  openVerticallyCenteredsubscription_commit(Subscription: any) {
    this.modalService.open(Subscription, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredstaffmanagement_commit(staffmanagement: any) {
    this.modalService.open(staffmanagement, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredrevenuemanagement_commit(revenuemanagement: any) {
    this.modalService.open(revenuemanagement, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredmedicineclaims_commit(medicineclaims: any) {
    this.modalService.open(medicineclaims, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymenthistory_commit(paymenthistory: any) {
    this.modalService.open(paymenthistory, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymentratingandreviews_commit(ratingandreviews: any) {
    this.modalService.open(ratingandreviews, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymentCommunication_commit(Communication: any) {
    this.modalService.open(Communication, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymentmailbox_commit(mailbox: any) {
    this.modalService.open(mailbox, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymentlogs_commit(logs: any) {
    this.modalService.open(logs, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymentcomplaintmanagement_commit(
    complaintmanagement: any
  ) {
    this.modalService.open(complaintmanagement, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  openVerticallyCenteredpaymentmedicalproductstests_commit(
    medicalproductstests: any
  ) {
    this.modalService.open(medicalproductstests, {
      centered: true,
      size: "md",
      windowClass: "permission_commit",
    });
  }

  navigate() {
    this.router.navigateByUrl("/pharmacy/roleandpermission/view");
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // private getAllStaff() {
  //   this._insuranceService.gettAllStaffListing({for_user:this.userID}).subscribe({
  //     next: (result: any) => {
  //       const decryptedData = this._coreService.decryptObjectData(result);
  //       this.staffList = decryptedData.body;
  //       // this.staffData = decryptedData.body;
  //     },
  //     error: (err: ErrorEvent) => {
  //       this._coreService.showError("", "Staff Load Failed");
  //     },
  //   });
  // }

  private getAllStaff() {
    this._insuranceService.getAllInsuranceStaff(this.userID).subscribe({
      next: (result: IEncryptedResponse<IInsuranceStaffResponse>) => {
        const decryptedData = this._coreService.decryptObjectData(result);
        console.log(decryptedData, "decryptedData");

        decryptedData?.body.map((curentval) => {
        if(curentval?.for_portal_user._id !== null){
          if(this.staffList.indexOf({
            label: curentval?.staff_name,
            value: curentval?.for_portal_user._id
          })== -1){
            this.staffList.push({
              label: curentval?.staff_name,
              value: curentval?.for_portal_user._id
            });
          }
        }
      })
      },
      error: (err: ErrorEvent) => {
        console.log(err, "err");
        this._coreService.showError("", "Staff Load Failed");
      },
    });
  }

  handleClick() {}
  assignSubmit() {
    var childrenarraynew = {};
    var menuarray = {};
    // console.log(this.alllogindata, "this.staffID");
    console.log(this.selectedMenuItem, "this.selectedMenuItem",this.alllogindata);
// return;
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData1 = Object.keys(element)[0];
      var submenuidmenu_order = "";
      this.alllogindata.forEach((element111: any) => {
        if (element111.menu_id._id == objData1) {
          submenuidmenu_order = element111.menu_order;
        }
      });
      if (submenuidmenu_order != "" && element.isMenuSelected) {
        menuarray[objData1] = submenuidmenu_order;
      }

      console.log(objData1, "this.selectedMenuItem",this.selectedMenuItem[index][objData1]);
      if (this.selectedMenuItem[index][objData1].length > 0) {
        var newarray = [];
        console.log(objData1, "this.selectedMenuItem",this.selectedMenuItem[index][objData1]);
        this.selectedMenuItem[index][objData1].forEach((element1: any) => {
          var objData11 = Object.keys(element1)[0];
          if (element1.isChildKey && element1.isFinalStatus) {
            var submenuid = "";
            this.alllogindata.forEach((element111: any) => {
          // console.log(element111.menu_id.name, "this.selectedMenuItem",element1.name);

              if (element111.menu_id.name == element1.name) {
                submenuid = element111.menu_id._id;
              }
            });
            if (submenuid != "") {
              newarray.push(submenuid);
            }
          }
          console.log(newarray, "this.selectedMenuItem");
        });
        if (newarray.length > 0) {
          childrenarraynew[objData1] = newarray;
        }
      }

      // console.log(childrenarraynew, "this.staffID");
      // console.log(menuarray, "this.staffID");
    });
    var completeSubmenuData = [];

    this.selectedMenuItem.forEach((ele1) => {
      let subKey = {};

      let objData = Object.keys(ele1)[0];
      if (ele1[objData].length > 0 && ele1.isMenuSelected) {
        subKey["parent_id"] = objData;
        subKey["module_type"] = "insurance";
        subKey["isChildKey"] = true;
        subKey["status"] = true;

        let otherKeys = {};
        ele1[objData].forEach((ele2) => {
          if (ele2.isFinalStatus) {
            let objDataOtherKey = Object.keys(ele2)[0];
            subKey["isChildKey"] = ele2.isChildKey;
            otherKeys[objDataOtherKey] = {
              name: ele2.name,
              isChild: ele2[objDataOtherKey].length > 0 ? true : false,
              inner_menu: ele2[objDataOtherKey],
            };
          }
        });

        subKey["submenu"] = otherKeys;
        completeSubmenuData.push(subKey);
      }
    });
    console.log(completeSubmenuData, "completeSubmenuDatacompleteSubmenuData");

    const data = {
      menu_array: menuarray,
      children_array: childrenarraynew,
      user_id: this.staffID,
    };
    console.log(this.staffID, "this.staffID");
    this.loader.start();
    if (this.staffID) {
      this.staffError = false;
      this._insuranceService.asignMenuSubmit(data).subscribe(
        (res: any) => {
          const decryptedData = this._coreService.decryptObjectData(res);
          this.loader.stop();

          this._coreService.showSuccess(decryptedData.message, "Success");
          // this.route.navigate(['/super-admin/insurance']);

          this.saveSubMenusInfo(completeSubmenuData);
        },
        (err) => {
          this.loader.stop();
          console.log(err);
        }
      );
    } else {
      this.loader.stop();
      this.staffError = true;
    }
  }

  saveSubMenusInfo(data) {
    let datatoPass = {
      portal_user_id: this.staffID,
      permission_data: data,
    };
    this._insuranceService
      .addSubmenusInfo(datatoPass)
      .subscribe((response: any) => {
        let subMenuInfos = this._coreService.decryptObjectData({
          data: response,
        });
        console.log(subMenuInfos, "subMenuInfos");
      });
  }
  async getLoginMenus() {
    this.selectedMenuItem = [];
    const params = {
      module_name: "superadmin",
      user_id: this.userID,
    };
   return new Promise(async (resolve,reject)=>{
    this.insuranceManagementService.getUserMenus(params).subscribe(
     async (res: any) => {
        const decryptedData = this._coreService.decryptObjectData(res);
        console.log("GET ALL LOGIN MENUS=====>", decryptedData);
        this.alllogindata = decryptedData.body;
        console.log("run 11111111")
        const parendData = [];
        const childrenArray = {};
        for (const data of decryptedData.body) {
          if (data.menu_id._id != "6385eae92b487a1556bc8bd4") {
            if (data.parent_id === "") {
              const menuobj = {};
              menuobj[data.menu_id._id] = [];
              menuobj["isMenuSelected"] = false;
              this.selectedMenuItem.push(menuobj);

              parendData.push({
                id: data.menu_id._id,
                name: data.menu_id.name,
                menu_order: data.menu_id.menu_order,
                parent_id: data.menu_id.parent_id,
              });

              // let val = menuArray[data.parent_id]['children']
              // let object = menuArray[data.parent_id]
              // val.push({
              //   id: data._id,
              //   name: data.menu_id.name,
              //   route_path: data.menu_id.route_path,
              //   icon: data.menu_id.menu_icon,
              //   icon_hover: data.menu_id.menu_icon_hover,
              //   slug: data.menu_id.slug,
              //   parent_id: data.parent_id
              // })
              // object['children'] = val
              // menuArray[data.parent_id] = object
            } else {
              if (data.menu_id.parent_id in childrenArray) {
                let val = childrenArray[data.menu_id.parent_id];
                val.push(data.menu_id._id);
                childrenArray[data.menu_id.parent_id] = val;
              } else {
                childrenArray[data.menu_id.parent_id] = [data.menu_id._id];
              }

              // menuArray[data.menu_id._id] = {
              //   id: data._id,
              //   name: data.menu_id.name,
              //   route_path: data.menu_id.route_path,
              //   icon: data.menu_id.menu_icon,
              //   icon_hover: data.menu_id.menu_icon_hover,
              //   slug: data.menu_id.slug,
              //   parent_id: data.parent_id,
              //   children: []
              // }
            }
          }
        }

        await this.getAllSubmenus();
        console.log("run 33333333333")
        console.log("this.selectedMenuItem", this.selectedMenuItem);
        this.allMenus = parendData;
        this.children = childrenArray;
        console.log(this.allMenus, "allMenus");
        console.log(this.children, "children");
        // this.userMenu = menuArray
        resolve(true);
        console.log("decryptedData", decryptedData);
      },
      (err) => {
        reject(true);
        console.log(err);
      }
    );
   })
  }
  private getAllMenus() {
    const params = {
      module_name: "superadmin",
      module_type: "insurance",
    };
    this._insuranceService.getMenus(params).subscribe(
      (res: any) => {
        const decryptedData = this._coreService.decryptObjectData(res);
        const data = [];
        const childrenArray = {};
        for (const menu of decryptedData.body) {
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

        console.log(this.allMenus, "allMenus");
        console.log(this.children, "children");
      },
      (err) => {
        console.log(err);
      }
    );
  }

  makeJSON(value: any, menuID: any, order: any) {
    if (value) {
      // this.menuCheckedArray[menuID] = order;
      var checkIndex;
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == menuID) {
          checkIndex = index;
        }
      });
      this.selectedMenuItem[checkIndex].isMenuSelected = true;
      var sunMenuLength = this.selectedMenuItem[checkIndex][menuID].length;
      if (sunMenuLength > 0) {
        this.selectedMenuItem[checkIndex][menuID].forEach(
          (element1: any, index1: any) => {
            var objData1;

            this.selectedMenuItem[checkIndex][menuID][index1].isFinalStatus =
              true;
            this.selectedMenuItem[checkIndex][menuID].forEach(
              (element2: any, index2: any) => {
                objData1 = Object.keys(element2)[0];
                var subMenuLength1 = element2[objData1].length;

                if (subMenuLength1 > 0) {
                  element2[objData1].forEach((element3: any, index3: any) => {
                    this.selectedMenuItem[checkIndex][menuID][index2][objData1][
                      index3
                    ].status = true;
                  });
                }
              }
            );
          }
        );
      }
    } else {
      // for (const key in this.menuCheckedArray) {
      //   const getOrder = this.menuCheckedArray[key];
      //   if (getOrder === order) {
      //     delete this.menuCheckedArray[key];
      //   }
      // }
      var checkIndex;
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];

        if (objData == menuID) {
          checkIndex = index;
        }
      });

      this.selectedMenuItem[checkIndex].isMenuSelected = false;
      var sunMenuLength = this.selectedMenuItem[checkIndex][menuID].length;
      if (sunMenuLength > 0) {
        this.selectedMenuItem[checkIndex][menuID].forEach(
          (element1: any, index1: any) => {
            var objData1;

            this.selectedMenuItem[checkIndex][menuID][index1].isFinalStatus =
              false;
            this.selectedMenuItem[checkIndex][menuID].forEach(
              (element2: any, index2: any) => {
                objData1 = Object.keys(element2)[0];
                var subMenuLength1 = element2[objData1].length;

                if (subMenuLength1 > 0) {
                  element2[objData1].forEach((element3: any, index3: any) => {
                    this.selectedMenuItem[checkIndex][menuID][index2][objData1][
                      index3
                    ].status = false;
                  });
                }
              }
            );
          }
        );
      }
    }
  }

  checkedmainMenuArray(menuid) {
    var checkIndex;
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0];
      if (objData == menuid) {
        checkIndex = element.isMenuSelected;
      }
    });
    return checkIndex;
  }

  checkedmainMenuArrayintermidiate(menuid) {
    console.log("checkedmainMenuArrayintermidiate");

    var checksubmenutreu = [];
    var checksubmenufalse = [];
    var checksubmenutreu = [];
    var checkIndex = false;
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0];
      if (objData == menuid) {
        if (!element.isMenuSelected) {
          checkIndex = true;
        }
        if (element[menuid].length > 0) {
          element[menuid].forEach((element1: any, index1: any) => {
            var objData1 = Object.keys(element1)[0];
            if (!element1.isFinalStatus) {
              checkIndex = true;
              checksubmenufalse.push(true);
            } else {
              checksubmenutreu.push(true);
            }

            if (checksubmenutreu.length > 0) {
              checkIndex = false;
            }

            if (checksubmenutreu.length > 0) {
              element.isMenuSelected = true;
            } else {
              element.isMenuSelected = false;
            }

            if (element1[objData1].length > 0) {
              element1[objData1].forEach((element2: any, index2: any) => {
                if (!element2.status) {
                  checkIndex = true;
                } else {
                  checksubmenutreu.push(true);
                }
                if (checksubmenutreu.length > 0) {
                  checkIndex = false;
                }
                if (checksubmenutreu.length > 0) {
                  element.isMenuSelected = true;
                } else {
                  element.isMenuSelected = false;
                }
              });
            }
          });
        }
        if (element[menuid].length == checksubmenufalse.length) {
          checkIndex = null;
        }
      }
    });
    return checkIndex;
  }

  checkedsubMenuArray(menuid, submenu) {
    var checkIndex;
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0];
      if (objData == menuid) {
        if (element[menuid].length > 0) {
          element[menuid].forEach((element1: any, index1: any) => {
            var objData1 = Object.keys(element1)[0];
            if (objData1 == submenu) {
              checkIndex = element1.isFinalStatus;
            }
          });
        }
      }
    });
    return checkIndex;
  }

  checkedinnerMenuArrayintermidiate(menuid, submenu) {
    var checkIndex = false;
    if (this.activeSubmenuIdsubmenu) {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var checksubmenutreu = [];
              var checksubmenufalse = [];
              var objData1 = Object.keys(element1)[0];
              if (objData1 == this.activeSubmenuIdsubmenu) {
                if (element1[objData1].length > 0) {
                  element1[objData1].forEach((element2: any, index2: any) => {
                    if (!element2.status) {
                      checkIndex = true;
                      checksubmenufalse.push(true);
                    } else {
                      checksubmenutreu.push(true);
                    }
                    if (checksubmenutreu.length > 0) {
                      checkIndex = false;
                    }

                    if (checksubmenutreu.length > 0) {
                      element1.isFinalStatus = true;
                    } else {
                      element1.isFinalStatus = false;
                    }
                  });
                }
                if (element1[objData1].length == checksubmenufalse.length) {
                  checkIndex = null;
                }
              }
            });
          }
        }
      });
    } else {
      checkIndex = null;
    }
    return checkIndex;
  }

  checkedinnnersubMenuArray(menuid, submenu, innersubmenuslug) {
    var checkIndex;
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0];
      if (objData == menuid) {
        if (element[menuid].length > 0) {
          element[menuid].forEach((element1: any, index1: any) => {
            var objData1 = Object.keys(element1)[0];
            if (objData1 == submenu) {
              // console.log("element[menuid][submenu]",submenu);
              // console.log("element[menuid][submenu]",element1);
              // console.log("element[menuid][submenu]",element);
              // console.log("element[menuid][submenu]",element1[submenu]);
              if (element1[submenu].length > 0) {
                element1[submenu].forEach((element2: any, index2: any) => {
                  if (element2.slug == innersubmenuslug) {
                    checkIndex = element2.status;
                  }
                });
              }
              // checkIndex=element1.isFinalStatus;
            }
          });
        }
      }
    });
    return checkIndex;
  }

  removesubmenu(menuid, submenu, event) {
    if (event.checked) {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0];
              if (objData1 == submenu) {
                element1.isFinalStatus = true;
                if (element1[submenu].length > 0) {
                  element1[submenu].forEach((element2: any, index2: any) => {
                    element2.status = true;
                  });
                }
                // element1.isFinalStatus=false;
              }
              var checkfalsecount = 0;
              element[menuid].forEach((element3: any, index3: any) => {
                if (!element3.isFinalStatus) {
                  checkfalsecount++;
                }
              });

              if (checkfalsecount == element[menuid].length) {
                element.isMenuSelected = false;
              } else {
                element.isMenuSelected = true;
              }
            });
          }
        }
      });
    } else {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0];
              if (objData1 == submenu) {
                element1.isFinalStatus = false;
                if (element1[submenu].length > 0) {
                  element1[submenu].forEach((element2: any, index2: any) => {
                    element2.status = false;
                  });
                }
                var checkfalsecount = 0;
                element[menuid].forEach((element3: any, index3: any) => {
                  if (!element3.isFinalStatus) {
                    checkfalsecount++;
                  }
                });

                if (checkfalsecount == element[menuid].length) {
                  element.isMenuSelected = false;
                } else {
                  element.isMenuSelected = true;
                }

                // element1.isFinalStatus=false;
              }
            });
          }
        }
      });
    }
  }

  removeinnersubmenu(menuid, submenu, innersubmenu, event) {
    if (event.checked) {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0];
              if (objData1 == submenu) {
                if (element1[submenu].length > 0) {
                  element1[submenu].forEach((element2: any, index2: any) => {
                    if (innersubmenu == element2.slug) {
                      element2.status = true;
                    }
                  });
                }
                var checkfalsecount = 0;
                element1[submenu].forEach((element3: any, index3: any) => {
                  if (!element3.status) {
                    checkfalsecount++;
                  }
                });

                if (checkfalsecount == element1[submenu].length) {
                  element1.isFinalStatus = false;
                } else {
                  element1.isFinalStatus = true;
                }

                // element1.isFinalStatus=false;
              }
            });

            var checkSubmenuFalseCount = 0;
            element[menuid].forEach((element4: any, index4: any) => {
              if (!element4.isFinalStatus) {
                checkSubmenuFalseCount++;
              }
            });

            if (checkSubmenuFalseCount == element[menuid].length) {
              element.isMenuSelected = false;
            } else {
              element.isMenuSelected = true;
            }
          }
        }
      });
    } else {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0];
              if (objData1 == submenu) {
                if (element1[submenu].length > 0) {
                  element1[submenu].forEach((element2: any, index2: any) => {
                    // console.log("hjdjdhsfksd",innersubmenu);

                    if (innersubmenu == element2.slug) {
                      element2.status = false;
                    }
                    // element2.status=false;
                  });
                }
                var checkfalsecount = 0;
                element1[submenu].forEach((element3: any, index3: any) => {
                  if (!element3.status) {
                    checkfalsecount++;
                  }
                });

                if (checkfalsecount == element1[submenu].length) {
                  element1.isFinalStatus = false;
                }
              }
            });

            var checkSubmenuFalseCount = 0;
            element[menuid].forEach((element4: any, index4: any) => {
              if (!element4.isFinalStatus) {
                checkSubmenuFalseCount++;
              }
            });

            if (checkSubmenuFalseCount == element[menuid].length) {
              element.isMenuSelected = false;
            } else {
              element.isMenuSelected = true;
            }
          }
        }
      });
    }
  }

  falseAllMenu(data) {
    data.forEach((el: any) => {
      el.isMenuSelected = false;
      let objectData = Object.keys(el)[0];
      if (el[objectData].length > 0) {
        el[objectData].forEach((ele) => {
          ele.isFinalStatus = false;

          let newObj = Object.keys(ele)[0];

          if (ele[newObj].length > 0) {
            ele[newObj].forEach((element) => {
              element.status = false;
            });
          }
        });
      }
    });
  }

  public async handleStaffChange(value: any) {
    console.log(value, "value  run0000");
    this.selectedMenuItem = [];
    this.selectall=false
   await this.getLoginMenus();
    console.log("run =============")
    if (value) {
    console.log("run 444444")
      this.staffID = value;
      this.getUserMenus();
      this.staffError = false;
    } else {
      this.falseAllMenu(this.selectedMenuItem);
      this.staffID = "";
      this.checkedMenuArray = [];
    }
  }
  checkedallarray()
  {
    // let newarray=[];
    // this.allMenus.forEach(async (menu)=>{
    // var status=await  this.checkedmainMenuArray(menu.id)
    // return newarray.push(status)
    // })
    // console.log(newarray,"newarray");
    return false;
  }
  private getUserMenus() {
    this.falseAllMenu(this.selectedMenuItem);

    const params = {
      module_name: "superadmin",
      user_id: this.staffID,
    };
    this._insuranceService.getUserMenus(params).subscribe(
      (res: any) => {
        const decryptedData = this._coreService.decryptObjectData(res);
        console.log("GET USER MENUS==>", decryptedData);
        console.log(decryptedData, "decryptedData", this.selectedMenuItem);
        console.log("run 55555555")
        for (const data of decryptedData.body) {
          if (!data.parent_id) {
            var parentid = data.menu_id._id;

            this.selectedMenuItem.forEach((element: any, index: any) => {
              var objData1 = Object.keys(element)[0];
              if (objData1 == parentid) {
                console.log(
                  "true",
                  "decryptedData",
                  element,
                  this.selectedMenuItem[index].isMenuSelected
                );
                this.selectedMenuItem[index].isMenuSelected = true;

                console.log("decryptedData", this.selectedMenuItem);
              } else {
              }
            });
          } else {
            var parentid = data.parent_id;
            var parentidmenuname = data.menu_id.name;
            this.selectedMenuItem.forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0];

              if (objData1 == parentid) {
                this.selectedMenuItem[index1][parentid].forEach(
                  (element2: any, index2: any) => {
                    if (
                      parentidmenuname ==
                      this.selectedMenuItem[index1][parentid][index2].name
                    ) {
                      this.selectedMenuItem[index1][parentid][
                        index2
                      ].isFinalStatus = true;
                    }
                  }
                );

                console.log("decryptedData", this.selectedMenuItem);
              } else {
              }
            });
          }
        }
        this.submenudatabyuser();
        // this.checkedMenuArray = checkedData;
        console.log("decryptedData", this.selectedMenuItem);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  submenudatabyuser() {
    return new Promise((resolve,reject)=>{
    this._insuranceService
      .submenudatabyuser({
        portal_user_id: this.staffID,
        module_name: "insurance",
      })
      .subscribe((result: any) => {
        var decodedata = this._coreService.decryptObjectData(result);
        console.log("run 66666666")
        // console.log(JSON.stringify(decodedata)+"decodedata",this.selectedMenuItem);
       if (decodedata.body.user_permissions != null) {
        let userPermission = decodedata.body.user_permissions.permissions;
        this.selectedMenuItem.forEach((element: any, index: any) => {
          var objData1 = Object.keys(element)[0];
          userPermission.forEach((element1: any, index1: any) => {
            if (objData1 == element1.parent_id) {
              this.selectedMenuItem[index][objData1].forEach(
                (element2: any, index2: any) => {
                  var objData11 = Object.keys(element2)[0];
                  for (let key in userPermission[index1]["submenu"]) {
                    if (objData11 == key) {
                      this.selectedMenuItem[index][objData1][
                        index2
                      ].isFinalStatus = true;

                      this.selectedMenuItem[index][objData1][index2][
                        objData11
                      ] = userPermission[index1]["submenu"][key]["inner_menu"];
                    }
                  }
                }
              );
            }
          });
        });
      }
      resolve(true)
        // console.log(userPermission, "userPermission", this.selectedMenuItem);
      });
    })
  }

  getAllSubmenus() {
    console.log("elementddd");
    const params = {
      module_name: "superadmin",
      module_type: "insurance",
    };
return new Promise((resolve,reject)=>{
  this._insuranceService.getSubMenus(params).subscribe((res: any) => {
    const decryptedData = this._coreService.decryptObjectData(res);
    this.allSubmenuesData = decryptedData.body;
    console.log("run 22222")
    this.allSubmenuesData.forEach((data: any) => {
      var submenuArray = [];
      var indexItem;
      for (let ele in data.submenu) {
        const obj = {};
        data.submenu[ele].inner_submenu.forEach((item: any, index: any) => {
          item["status"] = false;
          data.submenu[ele].inner_submenu[index] = item;
        });
        obj[ele] = data.submenu[ele].inner_submenu;
        obj["isChildKey"] = data.isChildKey;
        obj["name"] = data.submenu[ele].name;
        obj["isFinalStatus"] = false;
        submenuArray.push(obj);
      }

      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0];
        if (objData == data.parent_id) {
          indexItem = index;
        }
        // console.log("objData: ", objData)
      });

      if (indexItem) {
        this.selectedMenuItem[indexItem][data.parent_id] = submenuArray;
      }
    });
    resolve(true);
  });
})


  }

  makeJSONAll(value: any) {
    this.selectall=true;
    this.allMenus.forEach((ele) => {
      this.makeJSON(value, ele.id, ele.menu_order)
    })
  }


  openVerticallyCenteredaddrole(addrolecontent: any) {
    this.modalService.open(addrolecontent, { centered: true, size: 'md', windowClass: "add_role" });
  }
  get roleFormControl(): { [key: string]: AbstractControl } {
    return this.roleForm.controls;
  }

  addRole() {
    this.isSubmitted = true;
    // console.log(this.signUpForm.value);
    if (this.roleForm.invalid) {
      return;
    }
    this.roleForm.value['userId'] = this.userID
    console.log(this.roleForm.value);
    let addData = {
      rolesArray: this.roleForm.value.roles,
      for_user: this.roleForm.value['userId']
    };
    
    // this._insuranceService.addRole(this.roleForm.value).subscribe((res) => {
      this._insuranceService.addRole(addData).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      // console.log(result);
      if (result.status) {
        this._coreService.showSuccess(result.message, '');
        this.roleForm.reset(this.initialValue);
        this.roleForm.markAsPristine();
        this.roleForm.markAsUntouched();
        this.handleClose()
        this.router.navigate(['/insurance/rolepermission/view'])
       
      }else{
        this._coreService.showError(result.message, '');
      }

    }, (error) => {
      console.log('error in add role', error);
    })

    // console.log(this.roleForm.value);

  }


  public handleClose() {
    let modalRespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalRespose);
  
  }
  
  newRoleForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      status: [true],
    });
  }

  get roles(): FormArray {
    return this.roleForm.get("roles") as FormArray;
  }

  addnewRole() {
    this.roles.push(this.newRoleForm());
  }

  removeRole(i: number) {
    this.roles.removeAt(i);
  }
}
