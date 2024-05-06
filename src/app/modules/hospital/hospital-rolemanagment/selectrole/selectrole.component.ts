import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../../../super-admin/super-admin.service";
import { InsuranceManagementService } from "../../../super-admin/super-admin-insurance.service";
import { HospitalService } from "../../hospital.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { SuperAdminStaffResponse } from "src/app/modules/super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type";
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  sectionname: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // { sectionname: 'View'},
  // { sectionname: 'Add'},
  // { sectionname: 'Delete'},
  // { sectionname: 'Edit'},
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

  panelOpenState = false;
  userID: any;
  staffList: any;
  allMenus: any[] = [];
  children: {};
  checkedMenuArray: any = [];
  menuCheckedArray: any = {};
  allSubmenuesData: any = [];
  overlay : false;
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
  completeStaffList: any;
  roleForm!: FormGroup;
  isSubmitted: boolean = false;
  initialValue: any;
  selectall: any = false
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private _coreService: CoreService,
    private hospitalServce: HospitalService,
    private fb: FormBuilder,
    private insuranceManagementService: InsuranceManagementService,
    private loader: NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.roleForm = this.fb.group({
      roles: this.fb.array([]),
    });

    this.initialValue = this.roleForm.value
  }

  ngOnInit(): void {
    this.getAllStaff();
    this.addnewRole();
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
        var obj = this.menuWiseSubmenu[key];
        this.objectMenus.push(obj.inner_submenu);
      }
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
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.activeSubmenuId;
    this.activeSubmenuIdsubmenu;
    this.objectMenus = [];
    this.menuWiseSubmenu = [];
    this.addnewRole()
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

  private getAllStaff() {
    this.hospitalServce.gettAllStaffListing({ hospitalId: this.userID }).subscribe({
      next: (result: any) => {
        const decryptedData = this._coreService.decryptObjectData({ data: result });
        console.log("decryptedData_________",decryptedData);
        
        if (decryptedData.status) {
          let staffArray = []; 
  
          decryptedData?.body.map((curentval, index: any) => {
            console.log("curentval?.profileinfos?.for_portal_user",curentval)            
                staffArray.push({
                  label: curentval?.in_profile?.name,
                  value: curentval?.in_profile?.for_portal_user,
                })              
          });
          this.staffList = staffArray;         
    
        }    
        
       
      },
      error: (err: ErrorEvent) => {
        this._coreService.showError("", "Staff Load Failed");
      },
    });
  }

  handleClick() { }
  assignSubmit() {

    var childrenarraynew = {};
    var menuarray = {};
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData1 = Object.keys(element)[0]
      var submenuidmenu_order = '';
      this.alllogindata.forEach((element111: any) => {
        if (element111.menu_id._id == objData1) {
          submenuidmenu_order = element111.menu_order
        }
      })
      if (element.isMenuSelected) {
        menuarray[objData1] = submenuidmenu_order;
      }

      if (this.selectedMenuItem[index][objData1].length > 0) {
        var newarray = [];

        this.selectedMenuItem[index][objData1].forEach((element1: any) => {
          var objData11 = Object.keys(element1)[0]

          if (element1.isChildKey && element1.isFinalStatus) {
            var submenuid = '';
            this.alllogindata.forEach((element111: any) => {
              if (element111.menu_id.name == element1.name) {
                submenuid = element111.menu_id._id
              }
            })
            if (submenuid != '') {
              newarray.push(submenuid)
            }
          }
        });
        if (newarray.length > 0) {
          childrenarraynew[objData1] = newarray
        }
      }
    })
    var completeSubmenuData = [];

    this.selectedMenuItem.forEach((ele1) => {
      let subKey = {}

      let objData = Object.keys(ele1)[0]
      if (ele1[objData].length > 0 && ele1.isMenuSelected) {
        subKey['parent_id'] = objData
        subKey['module_type'] = "hospital"
        subKey['isChildKey'] = true
        subKey['status'] = true

        let otherKeys = {}
        ele1[objData].forEach((ele2) => {

          if (ele2.isFinalStatus) {

            let objDataOtherKey = Object.keys(ele2)[0]
            subKey["isChildKey"] = ele2.isChildKey;
            otherKeys[objDataOtherKey] = {
              "name": ele2.name,
              "isChild": ele2[objDataOtherKey].length > 0 ? true : false,
              "inner_menu": ele2[objDataOtherKey]
            }
          }

        })

        subKey['submenu'] = otherKeys
        completeSubmenuData.push(subKey)
      }

    })
    const data = {
      menu_array: menuarray,
      children_array: childrenarraynew,
      user_id: this.staffID,
    };

    this.loader.start();
    if (this.staffID) {
      this.staffError = false;
      this.hospitalServce.asignMenuSubmit(data).subscribe(
        (res: any) => {
          const decryptedData = this._coreService.decryptObjectData(res);
          this.loader.stop();
          this._coreService.showSuccess(decryptedData.message, "Success");
          this.saveSubMenusInfo(completeSubmenuData)
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
      permission_data: data
    }
    this.hospitalServce.addSubmenusInfo(datatoPass).subscribe((response: any) => {
      let subMenuInfos = this._coreService.decryptObjectData(response)

    })
  }
  async getLoginMenus(userId = this.userID) {
    this.selectedMenuItem = [];
    const params = {
      module_name: "superadmin",
      user_id: userId,
    };
    return new Promise((resolve, reject) => {
      this.hospitalServce.getUserMenus(params).subscribe(
        (res: any) => {
          const decryptedData = this._coreService.decryptObjectData(res);
          this.alllogindata = decryptedData.body;
          const parendData = [];
          const childrenArray = {};
          for (const data of decryptedData.body) {

            if (data.menu_id._id != "63d8f3cf49b37ad0542d6bb0" && data.menu_id._id != "63d8f3cf49b37ad0542d6bac") {

              if (data.parent_id === "") {
                const menuobj = {};
                menuobj[data.menu_id._id] = [];
                menuobj["isMenuSelected"] = false;
                this.selectedMenuItem.push(menuobj)

                parendData.push({
                  id: data.menu_id._id,
                  name: data.menu_id.name,
                  menu_order: data.menu_id.menu_order,
                  parent_id: data.menu_id.parent_id,
                });

              } else {
                if (data.menu_id.parent_id in childrenArray) {
                  let val = childrenArray[data.menu_id.parent_id];
                  val.push(data.menu_id._id);
                  childrenArray[data.menu_id.parent_id] = val;
                } else {
                  childrenArray[data.menu_id.parent_id] = [data.menu_id._id];
                }

              }
            }
          }
          this.getAllSubmenus();
          this.allMenus = parendData;
          this.children = childrenArray;
          resolve(true)
        },
        (err) => {
          reject(true)
          console.log(err);
        }
      );
    });
  }
  private getAllMenus(moduletype = 'hospital') {
    const params = {
      module_name: "superadmin",
      module_type: moduletype,
    };

    return new Promise((resolve, reject) => {
      this.hospitalServce.getMenus(params).subscribe(
        async (res: any) => {
          const decryptedData = await this._coreService.decryptObjectData(res);
          const data = [];
          const childrenArray = {};
          for await (const menu of decryptedData.body) {
            if (menu._id != "63e24fe850fa3f54d75ef4a3" && menu._id != "63e2870750fa3f54d75ef4a4" && menu._id != "646ee6735c80001a548c42f8") {
              if (menu.parent_id === "0") {

                const menuobj = {};
                menuobj[menu._id] = [];
                menuobj["isMenuSelected"] = false;
                this.selectedMenuItem.push(menuobj)

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
          }
          this.allMenus = data;
          this.children = childrenArray;

          resolve(true);

        },
        (err) => {
          console.log(err);
          reject('error')
        }
      );
    })

  }

  makeJSON(value: any, menuID: any, order: any) {
    if (value) {
      var checkIndex = 0;
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuID) {
          checkIndex = index
        }
      })
      this.selectedMenuItem[checkIndex].isMenuSelected = true;
      var sunMenuLength = this.selectedMenuItem[checkIndex][menuID].length
      if (sunMenuLength > 0) {
        this.selectedMenuItem[checkIndex][menuID].forEach((element1: any, index1: any) => {
          var objData1

          this.selectedMenuItem[checkIndex][menuID][index1].isFinalStatus = true;
          this.selectedMenuItem[checkIndex][menuID].forEach((element2: any, index2: any) => {
            objData1 = Object.keys(element2)[0]
            var subMenuLength1 = element2[objData1].length
            if (subMenuLength1 > 0) {
              element2[objData1].forEach((element3: any, index3: any) => {
                this.selectedMenuItem[checkIndex][menuID][index2][objData1][index3].status = true;
              })
            }
          })
        })
      }

    } else {
      var checkIndex = 0
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuID) {
          checkIndex = index
        }
      })
      this.selectedMenuItem[checkIndex].isMenuSelected = false;
      var sunMenuLength = this.selectedMenuItem[checkIndex][menuID].length
      if (sunMenuLength > 0) {
        this.selectedMenuItem[checkIndex][menuID].forEach((element1: any, index1: any) => {
          var objData1

          this.selectedMenuItem[checkIndex][menuID][index1].isFinalStatus = false;
          this.selectedMenuItem[checkIndex][menuID].forEach((element2: any, index2: any) => {
            objData1 = Object.keys(element2)[0]
            var subMenuLength1 = element2[objData1].length
            if (subMenuLength1 > 0) {
              element2[objData1].forEach((element3: any, index3: any) => {
                this.selectedMenuItem[checkIndex][menuID][index2][objData1][index3].status = false;
              })
            }
          })
        })
      }
    }
  }


  checkedmainMenuArray(menuid) {

    var checkIndex
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0]
      if (objData == menuid) {
        checkIndex = element.isMenuSelected;

      }
    })
    return checkIndex
  }

  checkedmainMenuArrayintermidiate(menuid) {


    var checksubmenutreu = [];
    var checksubmenufalse = [];
    var checksubmenutreu = [];
    var checkIndex = false;
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0]
      if (objData == menuid) {
        if (!element.isMenuSelected) {
          checkIndex = true;
        }
        if (element[menuid].length > 0) {
          element[menuid].forEach((element1: any, index1: any) => {
            var objData1 = Object.keys(element1)[0]
            if (!element1.isFinalStatus) {
              checkIndex = true;
              checksubmenufalse.push(true);
            }
            else {
              checksubmenutreu.push(true);
            }

            if (checksubmenutreu.length > 0) {
              checkIndex = false;
            }

            if (checksubmenutreu.length > 0) {
              element.isMenuSelected = true;
            }
            else {
              element.isMenuSelected = false;
            }

            if (element1[objData1].length > 0) {
              element1[objData1].forEach((element2: any, index2: any) => {
                if (!element2.status) {
                  checkIndex = true;
                }
                else {
                  checksubmenutreu.push(true)
                }
                if (checksubmenutreu.length > 0) {
                  checkIndex = false;
                }
                if (checksubmenutreu.length > 0) {
                  element.isMenuSelected = true;
                }
                else {
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

    })
    return checkIndex
  }

  checkedsubMenuArray(menuid, submenu) {
    var checkIndex
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0]
      if (objData == menuid) {
        if (element[menuid].length > 0) {
          element[menuid].forEach((element1: any, index1: any) => {
            var objData1 = Object.keys(element1)[0]
            if (objData1 == submenu) {
              checkIndex = element1.isFinalStatus;
            }

          });
        }


      }
    })
    return checkIndex
  }

  checkedinnerMenuArrayintermidiate(menuid, submenu) {
    var checkIndex = false;
    if (this.activeSubmenuIdsubmenu) {

      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var checksubmenutreu = [];
              var checksubmenufalse = [];
              var objData1 = Object.keys(element1)[0]
              if (objData1 == this.activeSubmenuIdsubmenu) {


                if (element1[objData1].length > 0) {
                  element1[objData1].forEach((element2: any, index2: any) => {
                    if (!element2.status) {
                      checkIndex = true;
                      checksubmenufalse.push(true);
                    }
                    else {
                      checksubmenutreu.push(true);
                    }
                    if (checksubmenutreu.length > 0) {
                      checkIndex = false
                    }


                    if (checksubmenutreu.length > 0) {
                      element1.isFinalStatus = true;
                    }
                    else {
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
      })
    }
    else {
      checkIndex = null
    }
    return checkIndex
  }

  checkedinnnersubMenuArray(menuid, submenu, innersubmenuslug) {
    var checkIndex
    this.selectedMenuItem.forEach((element: any, index: any) => {
      var objData = Object.keys(element)[0]
      if (objData == menuid) {
        if (element[menuid].length > 0) {
          element[menuid].forEach((element1: any, index1: any) => {
            var objData1 = Object.keys(element1)[0]
            if (objData1 == submenu) {
              if (element1[submenu].length > 0) {
                element1[submenu].forEach((element2: any, index2: any) => {
                  if (element2.slug == innersubmenuslug) {
                    checkIndex = element2.status;
                  }
                });
              }

            }

          });
        }


      }
    })
    return checkIndex
  }

  removesubmenu(menuid, submenu, event) {
    if (event.checked) {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0]
              if (objData1 == submenu) {

                element1.isFinalStatus = true;
                if (element1[submenu].length > 0) {
                  element1[submenu].forEach((element2: any, index2: any) => {
                    element2.status = true;
                  });

                }
              }
              var checkfalsecount = 0;
              element[menuid].forEach((element3: any, index3: any) => {
                if (!element3.isFinalStatus) {
                  checkfalsecount++;
                }
              });

              if (checkfalsecount == element[menuid].length) {
                element.isMenuSelected = false;
              }
              else {
                element.isMenuSelected = true;
              }

            });
          }


        }
      })
    }
    else {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuid) {
          if (element[menuid].length > 0) {

            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0]
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
                }
                else {
                  element.isMenuSelected = true;
                }


                // element1.isFinalStatus=false;
              }

            });
          }


        }
      })
    }


  }

  removeinnersubmenu(menuid, submenu, innersubmenu, event) {

    if (event.checked) {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuid) {
          if (element[menuid].length > 0) {



            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0]
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
                }
                else {
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
            }
            else {
              element.isMenuSelected = true;
            }
          }


        }
      })
    }
    else {
      this.selectedMenuItem.forEach((element: any, index: any) => {
        var objData = Object.keys(element)[0]
        if (objData == menuid) {
          if (element[menuid].length > 0) {
            element[menuid].forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0]
              if (objData1 == submenu) {
                if (element1[submenu].length > 0) {
                  element1[submenu].forEach((element2: any, index2: any) => {

                    if (innersubmenu == element2.slug) {

                      element2.status = false;
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
            }
            else {
              element.isMenuSelected = true;
            }
          }


        }
      })
    }


  }


  falseAllMenu(data) {
    data.forEach((el: any) => {
      el.isMenuSelected = false;
      let objectData = Object.keys(el)[0]
      if (el[objectData].length > 0) {
        el[objectData].forEach((ele) => {

          ele.isFinalStatus = false

          let newObj = Object.keys(ele)[0]

          if (ele[newObj].length > 0) {
            ele[newObj].forEach((element) => {
              element.status = false
            })
          }


        })
      }

    })

  }

  public async handleStaffChange(value: any) {    
    this.selectall = false;
    if (value) {
      this.staffID = value;
      const result = this.checkDoctorAssign(this.staffID).then(async (val) => {
        let menuResult
        if (val) {
          menuResult = await this.getAllMenus('individual-doctor')
          this.getAllSubmenus('individual-doctor')
        } else {
          menuResult = await this.getLoginMenus(this.userID)
        }
        if (menuResult) {
          this.getUserMenus();
        }
      },)




      this.staffError = false;
    } else {
      this.falseAllMenu(this.selectedMenuItem)
      this.staffID = "";
      this.checkedMenuArray = [];
    }
  }
  private getUserMenus() {
    this.falseAllMenu(this.selectedMenuItem)
    const params = {
      module_name: "superadmin",
      user_id: this.staffID,
    };
    this.hospitalServce.getUserMenus(params).subscribe(
      async (res: any) => {
        const decryptedData = await this._coreService.decryptObjectData(res);

        for await (const data of decryptedData.body) {
          if (!data.parent_id) {
            var parentid = data.menu_id._id;

            this.selectedMenuItem.forEach((element: any, index: any) => {
              var objData1 = Object.keys(element)[0]
              if (objData1 == parentid) {
                this.selectedMenuItem[index].isMenuSelected = true;
              }
              else {

              }
            });

          }
          else {
            var parentid = data.parent_id;
            var parentidmenuname = data.menu_id.name;
            this.selectedMenuItem.forEach((element1: any, index1: any) => {
              var objData1 = Object.keys(element1)[0]

              if (objData1 == parentid) {
                this.selectedMenuItem[index1][parentid].forEach((element2: any, index2: any) => {
                  if (parentidmenuname == this.selectedMenuItem[index1][parentid][index2].name) {
                    this.selectedMenuItem[index1][parentid][index2].isFinalStatus = true;
                  }
                });
              }
              else {
              }
            });
          }
        }
        this.submenudatabyuser();
      },
      (err) => {
        console.log(err);
      }
    );
  }


  submenudatabyuser() {
    this.hospitalServce.submenudatabyuser({ user_id: this.staffID, module_name: "hospital" }).subscribe(async (result: any) => {
      var decodedata = await this._coreService.decryptObjectData(result);
      if (decodedata.body.user_permissions != null) {
        let userPermission = await decodedata.body.user_permissions.permissions
        this.selectedMenuItem.forEach((element: any, index: any) => {
          var objData1 = Object.keys(element)[0]
          userPermission.forEach((element1: any, index1: any) => {

            if (objData1 == element1.parent_id) {
              this.selectedMenuItem[index][objData1].forEach((element2: any, index2: any) => {
                var objData11 = Object.keys(element2)[0]
                for (let key in userPermission[index1]['submenu']) {
                  if (objData11 == key) {
                    this.selectedMenuItem[index][objData1][index2].isFinalStatus = true;

                    this.selectedMenuItem[index][objData1][index2][objData11] = userPermission[index1]['submenu'][key]["inner_menu"];



                  }
                }


              });

            }
          })

        })
      }

    })
  }

  getAllSubmenus(moduleType: any = 'hospital') {
    const params = {
      module_name: "superadmin",
      module_type: moduleType,
    };
    return new Promise((resolve, reject) => {
      this.hospitalServce.getSubMenus(params).subscribe((res: any) => {
        const decryptedData = this._coreService.decryptObjectData(res);
        this.allSubmenuesData = decryptedData.body;
        this.allSubmenuesData.forEach((data: any) => {
          var submenuArray = [];
          var indexItem
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
            var objData = Object.keys(element)[0]
            if (objData == data.parent_id) {
              indexItem = index
            }
          })
          if (indexItem) {
            this.selectedMenuItem[indexItem][data.parent_id] = submenuArray;
          }
        });
        resolve(true);
      });
    })
  }

  async checkDoctorAssign(staffId: any) {
    let condition: boolean;
    this.staffID = staffId;
    const params = {
      hospitalStaffId: staffId,
    };

    return new Promise((resolve, reject) => {
      this.hospitalServce.getStaffDetails(params).subscribe({
        next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
          const staffDetails = await this._coreService.decryptObjectData({
            data: result,
          });
          let doctorLength = await staffDetails.body?.for_doctor;
          if (doctorLength.length > 0) {
            condition = true;
          } else {
            condition = false;
          }
          resolve(condition)
        },
        error: (err: ErrorEvent) => {
          console.log(err.message);
          reject('false');

        }
      });
    })





  }
  makeJSONAll(value: any) {
    this.selectall = true;
    this.allMenus.forEach((ele) => {
      this.makeJSON(value, ele.id, ele.menu_order)
    })
  }

  clearFilter() {
    this.staffList = [];
    this.getAllStaff();
  }

  get roleFormControl(): { [key: string]: AbstractControl } {
    return this.roleForm.controls;
  }
  //  Add Role modal
  openVerticallyCenteredaddrole(addrolecontent: any) {
    this.modalService.open(addrolecontent, { centered: true, size: 'md', windowClass: "add_role" });
  }

  addRole() {

    this.isSubmitted = true;
    if (this.roleForm.invalid) {
      return;
    }
    this.roleForm.value['userId'] = this.userID
    this.loader.start();
    let addData = {
      rolesArray: this.roleForm.value.roles,
      for_user: this.roleForm.value['userId']
    };
    this.hospitalServce.addRole(addData).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      if (result.status == true) {
        this.loader.stop();
        this._coreService.showSuccess(result.message, '');
        this.roleForm.reset(this.initialValue);
        this.roleForm.markAsUntouched();
        this.handleClose()
        this.router.navigate(['/hospital/rolemanagement/view'])
      } else {
        this.loader.stop();
        this._coreService.showError("", result?.message)
      }

    }, (error) => {
      this.loader.stop();
    })

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