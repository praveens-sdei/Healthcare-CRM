import { Component, OnInit } from '@angular/core';
import { InsuranceManagementService } from '../../super-admin/super-admin-insurance.service';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../insurance.service';
import { ToastrService } from 'ngx-toastr';
import { log } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-insurance-card-preview-master',
  templateUrl: './insurance-card-preview-master.component.html',
  styleUrls: ['./insurance-card-preview-master.component.scss']
})
export class InsuranceCardPreviewMasterComponent implements OnInit {

  insuranceFields: any;
  cardFields: any = [];
  frontSideFields: any = [];
  backSideFields: any = [];
  selectedFieldsFrontSide: string[] = [];
  maxCheckboxes = 10;
  adminInfo: any;
  insuranceCompanyId: any;
  companyCardFieldsList: any = [];
  companyCardFields: any = [];
  catSerFields: any = [];
  selectedRows: any;
  displayedColumns: string[] = ['categoryName', 'action', 'checkbox'];
  primaryInsuredFields: any = [];
  primaryFields: any = [];

  firstNameId: any = '';
  middleNameId: any = '';
  lastNameId: any = '';
  fullNameId: any = '';

  firstNameId1: any = '';
  middleNameId1: any = '';
  lastNameId1: any = '';
  fullNameId1: any = '';
  loginInfo: any;
  userRole: any;
  innerMenuPremission:any =[];

  constructor(private insuranceManService: InsuranceManagementService, private insuranceService: InsuranceService,
    private coreService: CoreService, private toastr: ToastrService,private loader: NgxUiLoaderService) { }

  async ngOnInit(): Promise<void> {

    this.loginInfo = JSON.parse(localStorage.getItem("loginData"));
    this.userRole = this.loginInfo?.role
    this.adminInfo = JSON.parse(localStorage.getItem("adminData"));

    if(this.userRole === 'INSURANCE_STAFF'){
      this.insuranceCompanyId = this.adminInfo?.for_user
    }else{
      this.insuranceCompanyId = this.loginInfo._id;
    }

   
    try {
      await this.primaryInsured(); // Wait for primaryInsured() to complete
      this.getCatServForCards();
    } catch (error) {
      console.error("Error fetching primary insured data:", error);
    }

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

        if (checkSubmenu.hasOwnProperty("card_preview")) {
          this.innerMenuPremission = checkSubmenu['card_preview'].inner_menu;

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
    }  
    

  }

  giveInnerPermission(value){
    if(this.userRole === 'INSURANCE_STAFF'){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }
   
  }


  primaryInsured(): Promise<void> {

    let datatoPass = "Primary Insured Field";
    return new Promise((resolve, reject) => {
      this.insuranceManService.insuranceGetFields(datatoPass).subscribe(
        (res: any) => {
          this.insuranceFields = this.coreService.decryptObjectData({
            data: res,
          }).body;
          console.log(this.insuranceFields, "insuranceFieldss____");

          resolve();
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }


  getCompCardFields() {

    this.insuranceService.getCardFields(this.insuranceCompanyId).subscribe((res: any) => {
      this.companyCardFieldsList = this.coreService.decryptObjectData({
        data: res,
      }).body;
      let backSideFieldss;
      if (this.companyCardFieldsList.length > 0) {
        backSideFieldss = this.companyCardFieldsList[0].backSideFields;
        // Update checked status based on matching backSideFields
        this.catSerFields.forEach(item => {
          const match = backSideFieldss.find(backItem => backItem.category === item.has_category && backItem.service === item.service);
          if (match) {
            item.isChecked = true;
          }
        });
        console.log(this.catSerFields,"catSerFieldssss_____");
        
        this.companyCardFields = this.companyCardFieldsList[0].frontSideFields;
        this.primaryFields = this.companyCardFieldsList[0].primaryInsuredFields;

        //console.log(this.primaryFields, "primaryFieldsss____", this.companyCardFields);

        // Update disabled status immediately after fetching and initializing data

        this.selectedFieldsFrontSide = this.companyCardFields.map(field => field.fieldId._id);
        this.primaryInsuredFields = this.primaryFields.map(field => field.fieldId._id);
        //console.log(this.primaryInsuredFields, "primaryInsuredFieldsss_____", this.selectedFieldsFrontSide);

        this.backSideFields = backSideFieldss.map(catSer => ({ category: catSer.category, service: catSer.service }));
          console.log(this.backSideFields,"backSideFieldsss______");
          
        this.primaryFields.forEach((field) => {
          console.log(field, "fieldlldldll");

          if (field.fieldId.fieldName === 'First Name' || field.fieldId.fieldName === 'Last Name' || field.fieldId.fieldName === 'Middle Name') {
            this.fullNameId = this.getFieldIdByName('Full Name');
          }
          if (field.fieldId.fieldName === 'Full Name') {
            this.firstNameId = this.getFieldIdByName('First Name');
            this.lastNameId = this.getFieldIdByName('Last Name');
            this.middleNameId = this.getFieldIdByName('Middle Name');
          }
        });

        this.companyCardFields.forEach((field) => {
          console.log(field, "fieldlldldll222");

          if (field.fieldId.fieldName === 'First Name' || field.fieldId.fieldName === 'Last Name' || field.fieldId.fieldName === 'Middle Name') {
            this.fullNameId1 = this.getFieldIdByName('Full Name');
          }
          if (field.fieldId.fieldName === 'Full Name') {
            this.firstNameId1 = this.getFieldIdByName('First Name');
            this.lastNameId1 = this.getFieldIdByName('Last Name');
            this.middleNameId1 = this.getFieldIdByName('Middle Name');
          }
        });

        this.checkDisabledStatus();
      }

    });
  }

  getCatServForCards() {
    this.insuranceService.getcategoryServForCard(this.insuranceCompanyId).subscribe((res: any) => {
      this.catSerFields = this.coreService.decryptObjectData({
        data: res,
      }).body;
      this.getCompCardFields();
    })
  }

  addCardFields() {
    if (this.backSideFields.length === 0 || this.selectedFieldsFrontSide.length === 0 || this.primaryInsuredFields.length === 0) {
      this.toastr.error("Select Atleast One Box From Each Card Side!");
    } else {
      this.loader.start();
      let data = {
        backSideFields: this.backSideFields,
        frontSideFields: this.selectedFieldsFrontSide,
        insuranceCompanyId: this.insuranceCompanyId,
        primaryInsuredFields: this.primaryInsuredFields,
        addedBy : this.loginInfo?._id
      }
      this.insuranceService.addcardFields(data).subscribe((res: any) => {
        this.cardFields = this.coreService.decryptObjectData({
          data: res,
        }).body;
        if (this.companyCardFieldsList.length > 0) {
          this.loader.stop();
          this.toastr.success("Card Fields Updated Successfully!")
          this.getCompCardFields();
        
        } else {
          this.loader.stop();
          this.toastr.success("Card Fields Added Successfully!")
          this.getCompCardFields();
        }
      })
    }

  }

  isChecked(_id: string): boolean {
    return this.selectedFieldsFrontSide.includes(_id);
  }
  isCheckedPrimaryFields(_id: string): boolean {
    return this.primaryInsuredFields.includes(_id);
  }


  isFieldInCompanyCardFields(fieldId: string): boolean {
    return this.companyCardFields.some(item => item.fieldId === fieldId);
  }
  isFieldInCompanyCardPrimary(fieldId: string): boolean {
    return this.primaryFields.some(item => item.fieldId === fieldId);
  }

  onCheckboxChange(_id: string,fieldName:string) {

    if (fieldName === 'Full Name') {
      this.firstNameId1 = this.getFieldIdByName('First Name');
      this.lastNameId1 = this.getFieldIdByName('Last Name');
      this.middleNameId1 = this.getFieldIdByName('Middle Name');
      console.log(this.firstNameId1, " = ", this.lastNameId1, " = ", this.middleNameId1);
    }
    if (fieldName === 'First Name' || fieldName === 'Middle Name' || fieldName === 'Last Name') {
      this.fullNameId1 = this.getFieldIdByName('Full Name');
      console.log(this.fullNameId1, "fullNamee___");
    }

    if (this.selectedFieldsFrontSide.length < this.maxCheckboxes && !this.selectedFieldsFrontSide.includes(_id)) {
      this.selectedFieldsFrontSide.push(_id);
      this.checkDisabledStatus();
    } else {
      const index = this.selectedFieldsFrontSide.indexOf(_id);
      if (index !== -1) {
        this.selectedFieldsFrontSide.splice(index, 1);
        this.checkDisabledStatus();
      }

      if (this.firstNameId1 === '' && this.lastNameId1 === '' && this.middleNameId1=== '') {
        this.fullNameId1 = '';
        console.log(this.firstNameId1, " == ", this.lastNameId1, " == ", this.middleNameId1)
      }

      if (fieldName === 'First Name') {
        this.firstNameId1 = '';
      }

      if (fieldName === 'Middle Name') {
        this.middleNameId1 = '';
      }

      if (fieldName === 'Last Name') {
        this.lastNameId1 = '';

      }

      if (fieldName === 'Full Name') {
        this.firstNameId1 = '';
        this.middleNameId1 = '';
        this.lastNameId1 = '';
      }

    }
  }

  onCheckboxChangePrimaryField(_id: string, fieldName: string) {


    if (fieldName === 'Full Name') {
      this.firstNameId = this.getFieldIdByName('First Name');
      this.lastNameId = this.getFieldIdByName('Last Name');
      this.middleNameId = this.getFieldIdByName('Middle Name');
      console.log(this.firstNameId, " = ", this.lastNameId, " = ", this.middleNameId);

    }
    if (fieldName === 'First Name' || fieldName === 'Middle Name' || fieldName === 'Last Name') {
      this.fullNameId = this.getFieldIdByName('Full Name');
      console.log(this.fullNameId, "fullNamee___");
    }


    if (this.primaryInsuredFields.length < this.maxCheckboxes && !this.primaryInsuredFields.includes(_id)) {
      this.primaryInsuredFields.push(_id);
      this.checkDisabledStatus();
      console.log("changee11_______");

    } else {
      const index = this.primaryInsuredFields.indexOf(_id);
      if (index !== -1) {
        this.primaryInsuredFields.splice(index, 1);
        this.checkDisabledStatus();
        console.log("changee222_______");

      }


      if (this.firstNameId === '' && this.lastNameId === '' && this.middleNameId === '') {
        this.fullNameId = '';
        console.log(this.firstNameId, " == ", this.lastNameId, " == ", this.middleNameId)
      }

      if (fieldName === 'First Name') {
        this.firstNameId = '';
      }

      if (fieldName === 'Middle Name') {
        this.middleNameId = '';
      }

      if (fieldName === 'Last Name') {
        this.lastNameId = '';

      }

      if (fieldName === 'Full Name') {
        this.firstNameId = '';
        this.middleNameId = '';
        this.lastNameId = '';
      }


      console.log(this.fullNameId, "fullNameeeee_____");



    }

  }

  getFieldIdByName(fieldName: string): string | undefined {
    const field = this.insuranceFields.find(field => field.fieldName === fieldName);
    return field ? field._id : undefined;
  }

  /*  disableField(fieldId: string) {
     const data = this.insuranceFields.find(data => data._id === fieldId);
     if (data) {
       data.disabled1 = true;
     }
   } */


/*    onCheckboxChangeCatServ(row: any) {
    const index = this.backSideFields.findIndex(obj => obj.category === row.has_category && obj.service === row.service);
    if (row.isChecked) {
      if (index === -1) {
        const newObj = {
          category: row.has_category,
          service: row.service
        };
        this.backSideFields.push(newObj);
      }
    } else {
      if (index !== -1) {
        this.backSideFields.splice(index, 1);
      }
    }
    const selectedCount = this.backSideFields.length;
    console.log(selectedCount,"selectedCountttt____");
    
    const maxCheckboxesBackSide = 17;

    this.catSerFields.forEach(item => {
      item.disabled = selectedCount >= maxCheckboxesBackSide && !item.isChecked;
    });
  } */

   onCheckboxChangeCatServ(row: any) {
    const index = this.backSideFields.findIndex(obj => obj.category === row.has_category && obj.service === row.service);
  
    if (row.isChecked) {
      if (index === -1) {
        const newObj = {
          category: row.has_category,
          service: row.service
        };
        this.backSideFields.push(newObj);
        console.log(this.backSideFields,"backSideFields_Added__");
        
  
        // Check if the maximum limit is reached and disable unchecked checkboxes
        this.checkDisabledStatus();
      }
    } else {
      if (index !== -1) {
        this.backSideFields.splice(index, 1);
  
        // Enable all checkboxes when unchecking
        this.catSerFields.forEach(item => {
          item.disabled = false;
        });
      }
    }
  }



  checkDisabledStatus() {
    //const selectedCount = this.selectedFieldsFrontSide.length;

    const selectedCount = this.backSideFields.length;
    const maxCheckboxesBackSide = 24;
  
    this.catSerFields.forEach(item => {
      item.disabled = selectedCount >= maxCheckboxesBackSide && !item.isChecked;
    });
/* 
    let selectedBackCount;
    if (this.companyCardFieldsList.length > 0 && this.companyCardFieldsList[0].backSideFields.length > 0) {
      selectedBackCount = this.companyCardFieldsList[0].backSideFields.length;
    }
    const maxCheckboxesBackSide = 17;
    this.catSerFields.forEach(item => {
      item.disabled = selectedBackCount >= maxCheckboxesBackSide && !item.isChecked;
    }); */

    /*  this.insuranceFields.forEach(data => {
       data.disabled = selectedCount >= this.maxCheckboxes && !this.selectedFieldsFrontSide.includes(data._id);    
     }); */

    const combinedLength = this.selectedFieldsFrontSide.length + this.primaryInsuredFields.length;
    const uncheckedFields = this.insuranceFields.filter(data => !this.isChecked(data._id));
    const uncheckedFields1 = this.insuranceFields.filter(data => !this.isCheckedPrimaryFields(data._id));
    //console.log(uncheckedFields1, "uncheckedFields111___");


    if (combinedLength === this.maxCheckboxes) {
      uncheckedFields.forEach(data => {
        data.disabled = true;
      });

      uncheckedFields1.forEach(data => {
        data.disabled1 = true;
      });
    } else {
      // If maxCheckboxes is not reached, enable all fields
      this.insuranceFields.forEach(data => {
        data.disabled = false;
        data.disabled1 = false;
      });
    }


  }

}
