import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceManagementService } from "../../../../super-admin/super-admin-insurance.service";
import { PatientService } from "src/app/modules/patient/patient.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";

@Component({
  selector: "app-manage-claim-content",
  templateUrl: "./manage-claim-content.component.html",
  styleUrls: ["./manage-claim-content.component.scss"],
})
export class ManageClaimContentComponent implements OnInit {
  overlay: false;
  insuranceFields: any;
  secondaryInsurerFieldsData: any;
  accidentRelatedFieldData: any;
  finalSubmitId: any = {
    primaryClaimField: [],
    secondaryClaimField: [],
    accidentRelatedField: [],
  };
  insuranceList: any[] = [];
  insuranceCompanyId: any;
  primaryData: any;
  secondaryData: any;
  accidetalData: any;
  selectedFields: any = [];
  selectedFieldsSecondary: any = [];
  selectedFieldsAccidental: any = [];
  selectallprimary: any = false;
  selectallsecondary: any = false;
  selectallaccident: any = false;
  isSubmitted: boolean = false
  userID: any;
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private modalService: NgbModal,
    private insuranceService: InsuranceManagementService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private patientService: PatientService,
    private loader : NgxUiLoaderService,
    private route: Router
  ) {

    const userData = this.coreService.getLocalStorage('loginData')
    this.userID = userData._id
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
   }

  ngOnInit(): void {
    this.primaryInsured();
    this.secondaryInsurerFields();
    this.accidentRelatedFields();
    this.getInsuranceList();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this.coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("manage_claim_content")) {
          this.innerMenuPremission = checkSubmenu['manage_claim_content'].inner_menu;
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
      }
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  //  Add Field modal
  openVerticallyCenteredaddfield(addfieldcontent: any) {
    this.modalService.open(addfieldcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_field",
    });
  }

  primaryInsured() {
    let datatoPass = "Primary Insured Field";
    this.insuranceService
      .insuranceGetFields(datatoPass)
      .subscribe((res: any) => {
        this.insuranceFields = this.coreService.decryptObjectData({
          data: res,
        }).body;
      });
  }

  getprimaryInsuranceById(id) {
    let dataToPass = {
      insuranceId: id,
    };
    this.insuranceService
      .primaryInsuranceById(dataToPass)
      .subscribe((res: any) => {
        let responseData = this.coreService.decryptObjectData({ data: res });
        if (responseData) {
          this.primaryData = responseData.body.primaryData;
          if (this.insuranceCompanyId != "") {
            this.insuranceFields.forEach((element) => {
              let reee = this.checkCat(element._id, "primaryIds");
            });
          }
        }
      });
  }

  public checkCat(fieldId: string, type: string) {

    if (this.primaryData != null && type == "primaryIds") {

      let data = [];
      this.selectedFields.push(false);
      const unique = [...new Map(this.primaryData.map((m) => [m._id, m])).values()];

      data = unique;
      console.log(data, "111dddddddddddddddddd");
      data.forEach((ele: any) => {
        console.log(ele, "element")
        if (ele._id == fieldId) {
          this.selectedFields[this.selectedFields.length - 1] = true;
          console.log(this.selectedFields, "this.selectedFields");

          // this.onChange(serviceId, catId, '',true);
          this.onCheckboxChange(fieldId, type, "", true);
        }
      });
    }
    if (this.secondaryData != null && type == "secondaryId") {
      let data = [];
      this.selectedFieldsSecondary.push(false);
      const unique = [...new Map(this.secondaryData.map((m) => [m._id, m])).values()];

      data = unique;
      console.log(data, "222dddddddddddddddddd");
      data.forEach((element) => {
        if (element._id == fieldId) {
          this.selectedFieldsSecondary[
            this.selectedFieldsSecondary.length - 1
          ] = true;

          // this.onChange(serviceId, catId, '',true);
          this.onCheckboxChange(fieldId, type, "", true);
        }
      });
    }

    if (this.accidetalData != null && type == "accidentalId") {
      let data = [];
      this.selectedFieldsAccidental.push(false);
      const unique = [...new Map(this.accidetalData.map((m) => [m._id, m])).values()];

      data = unique;
      console.log(data, "333dddddddddddddddddd");
      data.forEach((element) => {
        if (element._id == fieldId) {
          this.selectedFieldsAccidental[
            this.selectedFieldsAccidental.length - 1
          ] = true;

          // this.onChange(serviceId, catId, '',true);
          this.onCheckboxChange(fieldId, type, "", true);
        }
      });
    }
  }
  getSecodaryInsuranceById(id) {
    let dataToPass = {
      insuranceId: id,
    };
    this.insuranceService
      .secondaryInsuranceById(dataToPass)
      .subscribe((res: any) => {
        let responseData = this.coreService.decryptObjectData({ data: res });
        if (responseData) {
          this.secondaryData = responseData.body.secondaryData;

          if (this.insuranceCompanyId != "") {
            this.secondaryInsurerFieldsData.forEach((element) => {
              let reee = this.checkCat(element._id, "secondaryId");
            });
          }
        }
      });
  }
  getAccidentalInsuranceById(id) {
    let dataToPass = {
      insuranceId: id,
    };
    this.insuranceService
      .AccidentalInsuranceById(dataToPass)
      .subscribe((res: any) => {
        let responseData = this.coreService.decryptObjectData({ data: res });
        if (responseData) {
          this.accidetalData = responseData.body.accidentData;

          if (this.insuranceCompanyId != "") {
            this.accidentRelatedFieldData.forEach((element) => {
              let reee = this.checkCat(element._id, "accidentalId");
            });
          }
        }
      });
  }

  secondaryInsurerFields() {
    let datatoPass = "Secondary Insured Field";
    this.insuranceService
      .insuranceGetFields(datatoPass)
      .subscribe((res: any) => {
        this.secondaryInsurerFieldsData = this.coreService.decryptObjectData({
          data: res,
        }).body;
      });
  }

  accidentRelatedFields() {
    let datatoPass = "Accident Related Field";
    this.insuranceService
      .insuranceGetFields(datatoPass)
      .subscribe((res: any) => {
        this.accidentRelatedFieldData = this.coreService.decryptObjectData({
          data: res,
        }).body;
      });
  }

  onCheckboxChange(e, type, event, status = false) {


    if (status) {
      if (type == "primaryIds") {
        this.finalSubmitId.primaryClaimField.push({ fieldId: e });
      } else if (type == "secondaryId") {
        this.finalSubmitId.secondaryClaimField.push({ fieldId: e });
      } else {
        this.finalSubmitId.accidentRelatedField.push({ fieldId: e });
      }
    } else {
      console.log("event11111111111", event);
      if (event.checked) {
        if (type == "primaryIds") {
          this.finalSubmitId.primaryClaimField.push({ fieldId: e });
        } else if (type == "secondaryId") {
          this.finalSubmitId.secondaryClaimField.push({ fieldId: e });
        } else {
          this.finalSubmitId.accidentRelatedField.push({ fieldId: e });
        }
      } else {
        if (type == "primaryIds") {
          if (
            this.finalSubmitId.primaryClaimField.findIndex(
              (x) => x.fieldId === e
            ) > -1
          ) {
            this.finalSubmitId.primaryClaimField.splice(
              this.finalSubmitId.primaryClaimField.findIndex(
                (x) => x.fieldId === e
              ),
              1
            );
          }
        } else if (type == "secondaryId") {
          if (
            this.finalSubmitId.secondaryClaimField.findIndex(
              (x) => x.fieldId === e
            ) > -1
          ) {
            this.finalSubmitId.secondaryClaimField.splice(
              this.finalSubmitId.secondaryClaimField.findIndex(
                (x) => x.fieldId === e
              ),
              1
            );
          }
        } else {
          if (
            this.finalSubmitId.accidentRelatedField.findIndex(
              (x) => x.fieldId === e
            ) > -1
          ) {
            this.finalSubmitId.accidentRelatedField.splice(
              this.finalSubmitId.accidentRelatedField.findIndex(
                (x) => x.fieldId === e
              ),
              1
            );
          }
        }
      }
    }
  }
  makeSelectAll(event: any, type: any) {
    console.log(event, "event");
    console.log(type, "event");

    if (event.checked) {
      console.log(type, "event");
      if (type == "primaryIds") {
        this.insuranceFields.forEach((element, index) => {
          this.onCheckboxChange(element._id, 'primaryIds', event)
          //  let reee = this.checkCat(element._id, "primaryIds");
          this.selectedFields[index] = true;

        });
      }
      if (type == "secondaryId") {
        this.secondaryInsurerFieldsData.forEach((element, index) => {
          this.onCheckboxChange(element._id, 'secondaryId', event)
          //  let reee = this.checkCat(element._id, "primaryIds");
          this.selectedFieldsSecondary[index] = true;

        });
      }
      if (type == "accidentalId") {
        this.accidentRelatedFieldData.forEach((element, index) => {
          this.onCheckboxChange(element._id, 'accidentalId', event)
          //  let reee = this.checkCat(element._id, "primaryIds");
          this.selectedFieldsAccidental[index] = true;

        });
      }

    }
    else {
      if (type == "primaryIds") {
        this.insuranceFields.forEach((element, index) => {
          this.onCheckboxChange(element._id, 'primaryIds', event)
          this.selectedFields[index] = false;

        });
      }
      if (type == "secondaryId") {
        this.secondaryInsurerFieldsData.forEach((element, index) => {
          this.onCheckboxChange(element._id, 'secondaryId', event)
          this.selectedFieldsSecondary[index] = false;

        });
      }
      if (type == "accidentalId") {
        this.accidentRelatedFieldData.forEach((element, index) => {
          this.onCheckboxChange(element._id, 'accidentalId', event)
          this.selectedFieldsAccidental[index] = false;

        });
      }
    }
  }
  saveInsuranceData() {
    this.loader.start();
    let data = {
      primaryClaimField: this.finalSubmitId.primaryClaimField,
      secondaryClaimField: this.finalSubmitId.secondaryClaimField,
      accidentRelatedField: this.finalSubmitId.accidentRelatedField,
      insuranceId: this.insuranceCompanyId,
      createdBy: this.userID
    };


    this.isSubmitted = true;
    if (this.insuranceCompanyId) {
      this.insuranceService.saveInsurance(data).subscribe((res: any) => {
        this.isSubmitted = false;
        // this.insuranceCompanyId = ''
        let encryptedData = { data: res };
        let response = this.coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.route.navigate(['/super-admin/dashboard']);

        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
    } else {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }


  getCompanyid(event: any) {
    this.selectedFields = [];
    this.selectedFieldsSecondary = [];
    this.selectedFieldsAccidental = [];
    this.selectallprimary = false;
    this.selectallsecondary = false;
    this.selectallaccident = false;

    this.finalSubmitId = {
      primaryClaimField: [],
      secondaryClaimField: [],
      accidentRelatedField: [],
    };
    this.insuranceCompanyId = event.value;
    this.getSecodaryInsuranceById(this.insuranceCompanyId);
    this.getAccidentalInsuranceById(this.insuranceCompanyId);
    this.getprimaryInsuranceById(this.insuranceCompanyId);


  }

  getInsuranceList() {
    this.patientService.getInsuanceList().subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      console.log(response, "this check")
      const arr = response?.body?.result;
      console.log(arr, "check arr");

      // arr.unshift({
      //   for_portal_user: { _id: "" },
      //    company_name: "All Insurance Company",
      // });
      arr.map((curentval: any) => {
        this.insuranceList.push({
          label: curentval?.company_name,
          value: curentval?.for_portal_user?._id,
        });
      });
      console.log(this.insuranceList, "insuranceList");
    });
  }

  shouldShowField(fieldName: string): boolean {
    return (
      fieldName !== 'Full Name' &&
      fieldName !== 'Unique ID' &&
      fieldName !== 'Validity Date' &&
      fieldName !== 'Relationship' &&
      fieldName !== 'Mobile Phone'
    );
  }
  

}
