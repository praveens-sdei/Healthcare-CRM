import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../../super-admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

type player = 'PHARMA' | 'HOSDOC' | 'INDDOC' | 'PATIENT' | 'DENTAL' | 'OPTICAL' | 'LABIMG' | 'PARA';
type operator = 'MINUS' | 'ADD';
@Component({
  selector: 'app-maximum-request',
  templateUrl: './maximum-request.component.html',
  styleUrls: ['./maximum-request.component.scss']
})


export class MaximumRequestComponent implements OnInit {

  pharMedReqCounter: number = 0;
  hosMedReqCounter: number = 0;
  hosMedPrcCounter: number = 0;
  hosMedOrdCounter: number = 0;
  IndMedReqCounter: number = 0;
  IndMedPrcCounter: number = 0;
  IndMedOrdCounter: number = 0;
  PatMedReqCounter: number = 0;
  PatMedPrcCounter: number = 0;
  PatMedOrdCounter: number = 0;

  dentalMedReqCounter: number = 0;
  dentalMedPrcCounter: number = 0;
  dentalMedOrdCounter: number = 0;

  opitalMedReqCounter: number = 0;
  opitalMedPrcCounter: number = 0;
  opitalMedOrdCounter: number = 0;

  labImgMedReqCounter: number = 0;
  labImgMedPrcCounter: number = 0;
  labImgMedOrdCounter: number = 0;

  paraMedReqCounter: number = 0;
  paraMedPrcCounter: number = 0;
  paraMedOrdCounter: number = 0;

  localStorageData: any;
  userId: string;
  innerMenuPremission:any=[];
  loginrole: any;
  data: { pharmacy: { medicine_availability_request: any; }; hospital_doctor: { medicine_availability_request: any; medicine_price_request: any; order_medicine: any; }; individual_doctor: { medicine_availability_request: any; medicine_price_request: any; order_medicine: any; }; patient: { medicine_availability_request: any; medicine_price_request: any; order_medicine: any; }; userId: string; };
  constructor(
    private _coreService: CoreService, 
    private _superAdminService: SuperAdminService,
    private _route:Router,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService
    ) {
    this.localStorageData = this._coreService.getLocalStorage('loginData');
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.userId = this.localStorageData._id;
  }

  ngOnInit(): void {
this.patchSaveMaximumReq();

    // this.data = {
    //   "pharmacy": {
    //     "medicine_availability_request": "12"
    //   },
    //   "hospital_doctor": {
    //     "medicine_availability_request": "121",
    //     "medicine_price_request": "132",
    //     "order_medicine":"141"
    //   },
    //   "individual_doctor": {
    //     "medicine_availability_request": "145",
    //     "medicine_price_request": "156",
    //     "order_medicine": "178"
    //   },
    //   "patient": {
    //     "medicine_availability_request":"198",
    //     "medicine_price_request":"108",
    //     "order_medicine": "104"
    //   },
    //   "userId": "63a2aba33c48b412de4ef9dc"
    // }
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("set_mazimum_request")) {
          this.innerMenuPremission = checkSubmenu['set_mazimum_request'].inner_menu;
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

  public maximumReqForm: FormGroup = new FormGroup({
    pharMedAvailReq: new FormControl('',[Validators.min(0)]),
    hosMedAvailReq: new FormControl('',[Validators.min(0)]),
    hosMedPriceReq: new FormControl('',[Validators.min(0)]),
    hosOrdMedicine: new FormControl('',[Validators.min(0)]),
    docMedAvailReq: new FormControl('',[Validators.min(0)]),
    docMedPriceReq: new FormControl('',[Validators.min(0)]),
    docOrdMedicine: new FormControl('',[Validators.min(0)]),
    patMedAvailReq: new FormControl('',[Validators.min(0)]),
    patMedPriceReq: new FormControl('',[Validators.min(0)]),
    patOrdMedicine: new FormControl('',[Validators.min(0)]),
    
    dentalMedAvailReq:new FormControl('',[Validators.min(0)]),
    dentalMedPriceReq:new FormControl('',[Validators.min(0)]),
    dentalOrderReq:new FormControl('',[Validators.min(0)]),

    opticalMedAvailReq:new FormControl('',[Validators.min(0)]),
    opticalMedPriceReq:new FormControl('',[Validators.min(0)]),
    opticalOrderReq:new FormControl('',[Validators.min(0)]),

    labImgMedAvailReq:new FormControl('',[Validators.min(0)]),
    labImgMedPriceReq:new FormControl('',[Validators.min(0)]),
    labImgOrderReq:new FormControl('',[Validators.min(0)]),

    paraMedAvailReq:new FormControl('',[Validators.min(0)]),
    paraMedPriceReq:new FormControl('',[Validators.min(0)]),
    paraOrderReq:new FormControl('',[Validators.min(0)])
  });



  public MedReq(player: player, operator: operator) {

    switch (player) {
      case 'PHARMA':
        if (operator === 'MINUS') {
          this.pharMedReqCounter--;
        }

        if (operator === 'ADD') {
          this.pharMedReqCounter++;
        }
        break;

      case 'HOSDOC':
        if (operator === 'MINUS') {
          this.hosMedReqCounter--;
        }

        if (operator === 'ADD') {
          this.hosMedReqCounter++;
        }
        break;

      case 'INDDOC':
        if (operator === 'MINUS') {
          this.IndMedReqCounter--;
        }

        if (operator === 'ADD') {
          this.IndMedReqCounter++;
        }
        break;

      case 'PATIENT':
        if (operator === 'MINUS') {
          this.PatMedReqCounter--;
        }

        if (operator === 'ADD') {
          this.PatMedReqCounter++;
        }
        break;
      
        case 'DENTAL':
          if (operator === 'MINUS') {
            this.dentalMedReqCounter--;
          }
  
          if (operator === 'ADD') {
            this.dentalMedReqCounter++;
          }
          break;
  
        case 'OPTICAL':
            if (operator === 'MINUS') {
              this.opitalMedReqCounter--;
            }
    
            if (operator === 'ADD') {
              this.opitalMedReqCounter++;
            }
            break;
            
        case 'LABIMG':
              if (operator === 'MINUS') {
                this.labImgMedReqCounter--;
              }
      
              if (operator === 'ADD') {
                this.labImgMedReqCounter++;
              }
              break;
              
        case 'PARA':
          if (operator === 'MINUS') {
            this.paraMedReqCounter--;
          }
  
          if (operator === 'ADD') {
            this.paraMedReqCounter++;
          }
          break;
      default:
        break;
    }

  }



  public MedPrc(player: player, operator: operator) {
    switch (player) {

      case 'HOSDOC':
        if (operator === 'MINUS') {
          this.hosMedPrcCounter--;
        }

        if (operator === 'ADD') {
          this.hosMedPrcCounter++;
        }
        break;

      case 'INDDOC':
        if (operator === 'MINUS') {
          this.IndMedPrcCounter--;
        }

        if (operator === 'ADD') {
          this.IndMedPrcCounter++;
        }
        break;

      case 'PATIENT':
        if (operator === 'MINUS') {
          this.PatMedPrcCounter--;
        }

        if (operator === 'ADD') {
          this.PatMedPrcCounter++;
        }
        break;

        case 'DENTAL':
          if (operator === 'MINUS') {
            this.dentalMedPrcCounter--;
          }
  
          if (operator === 'ADD') {
            this.dentalMedPrcCounter++;
          }
          break;
  
        case 'OPTICAL':
            if (operator === 'MINUS') {
              this.opitalMedPrcCounter--;
            }
    
            if (operator === 'ADD') {
              this.opitalMedPrcCounter++;
            }
            break;
            
        case 'LABIMG':
              if (operator === 'MINUS') {
                this.labImgMedPrcCounter--;
              }
      
              if (operator === 'ADD') {
                this.labImgMedPrcCounter++;
              }
              break;
              
        case 'PARA':
          if (operator === 'MINUS') {
            this.paraMedPrcCounter--;
          }
  
          if (operator === 'ADD') {
            this.paraMedPrcCounter++;
          }
          break;
      default:
        break;
    }
  }


  public MedOrd(player: player, operator: operator): void {

    switch (player) {

      case 'HOSDOC':
        if (operator === 'MINUS') {
          this.hosMedOrdCounter--;
        }

        if (operator === 'ADD') {
          this.hosMedOrdCounter++;
        }
        break;

      case 'INDDOC':
        if (operator === 'MINUS') {
          this.IndMedOrdCounter--;
        }

        if (operator === 'ADD') {
          this.IndMedOrdCounter++;
        }
        break;

      case 'PATIENT':
        if (operator === 'MINUS') {
          this.PatMedOrdCounter--;
        }

        if (operator === 'ADD') {
          this.PatMedOrdCounter++;
        }
        break;

      case 'DENTAL':
        if (operator === 'MINUS') {
          this.dentalMedOrdCounter--;
        }

        if (operator === 'ADD') {
          this.dentalMedOrdCounter++;
        }
        break;

      case 'OPTICAL':
          if (operator === 'MINUS') {
            this.opitalMedOrdCounter--;
          }
  
          if (operator === 'ADD') {
            this.opitalMedOrdCounter++;
          }
          break;
          
      case 'LABIMG':
            if (operator === 'MINUS') {
              this.labImgMedOrdCounter--;
            }
    
            if (operator === 'ADD') {
              this.labImgMedOrdCounter  ++;
            }
            break;

      case 'PARA':
              if (operator === 'MINUS') {
                this.paraMedOrdCounter--;
              }
      
              if (operator === 'ADD') {
                this.paraMedOrdCounter++;
              }
              break;       

      default:
        break;
    }
  }

patchSaveMaximumReq(){
  this._superAdminService.getAddMaximumReq(this.userId).subscribe((res: any) => {
    let encryptedData = { data: res };
    let response = this._coreService.decryptObjectData(encryptedData);
console.log(response,"response");

    if (response.status) {
      this.maximumReqForm.patchValue({
       
        pharMedAvailReq: response.body[0].pharmacy.medicine_availability_request,
        
      
        hosMedAvailReq:response.body[0].hospital_doctor.medicine_availability_request ,
        hosMedPriceReq:response.body[0].hospital_doctor.medicine_price_request ,
        hosOrdMedicine:response.body[0].hospital_doctor.order_medicine,
      
        docMedAvailReq:response.body[0].individual_doctor.medicine_availability_request ,
        docMedPriceReq:response.body[0].individual_doctor.medicine_price_request,
        docOrdMedicine:response.body[0].individual_doctor.order_medicine ,
   
        
        patMedAvailReq:response.body[0].patient.medicine_availability_request,
        patMedPriceReq:response.body[0].patient.medicine_price_request,
        patOrdMedicine:response.body[0].patient.order_medicine,


        dentalMedAvailReq:response.body[0].dental.availability_request,
        dentalMedPriceReq:response.body[0].dental.price_request,
        dentalOrderReq:response.body[0].dental.order_request,

        opticalMedAvailReq:response.body[0].optical.availability_request,
        opticalMedPriceReq:response.body[0].optical.price_request,
        opticalOrderReq:response.body[0].optical.order_request,


        labImgMedAvailReq:response.body[0].labimg.availability_request,
        labImgMedPriceReq:response.body[0].labimg.price_request,
        labImgOrderReq:response.body[0].labimg.order_request,

        paraMedAvailReq:response.body[0].para.availability_request,
        paraMedPriceReq:response.body[0].para.price_request,
        paraOrderReq:response.body[0].para.order_request,
    
      });
      //this.toastr.success(response.message);
    
    } else {
      this.toastr.error(response.message);
    }
  });

  


 
}

  saveMaximumReq(val) {
    console.log(val);
    if (this.maximumReqForm.invalid) {
      return;
    }
    this.loader.start();
    let reqData = {
      "pharmacy": {
        "medicine_availability_request": val.pharMedAvailReq > 0 ? val.pharMedAvailReq : 0
      },
      "hospital_doctor": {
        "medicine_availability_request": val.hosMedAvailReq > 0 ? val.hosMedAvailReq : 0,
        "medicine_price_request": val.hosMedPriceReq > 0 ? val.hosMedPriceReq : 0,
        "order_medicine": val.hosOrdMedicine > 0 ? val.hosOrdMedicine : 0
      },
      "individual_doctor": {
        "medicine_availability_request": val.docMedAvailReq > 0 ? val.docMedAvailReq : 0,
        "medicine_price_request": val.docMedPriceReq > 0 ? val.docMedPriceReq : 0,
        "order_medicine": val.docOrdMedicine > 0 ? val.docOrdMedicine : 0
      },
      "patient": {
        "medicine_availability_request": val.patMedAvailReq > 0 ? val.patMedAvailReq : 0,
        "medicine_price_request": val.patMedPriceReq > 0 ? val.patMedPriceReq : 0,
        "order_medicine": val.patOrdMedicine > 0 ? val.patOrdMedicine : 0
      },

      "dental": {
        "availability_request": val.dentalMedAvailReq > 0 ? val.dentalMedAvailReq : 0,
        "price_request": val.dentalMedPriceReq > 0 ? val.dentalMedPriceReq : 0,
        "order_request": val.dentalOrderReq > 0 ? val.dentalOrderReq : 0
      },
      "optical": {
        "availability_request": val.opticalMedAvailReq > 0 ? val.opticalMedAvailReq : 0,
        "price_request": val.opticalMedPriceReq > 0 ? val.opticalMedPriceReq : 0,
        "order_request": val.opitalOrderReq > 0 ? val.opitalOrderReq : 0
      },
      "labimg": {
        "availability_request": val.labImgMedAvailReq > 0 ? val.labImgMedAvailReq : 0,
        "price_request": val.labImgMedPriceReq > 0 ? val.labImgMedPriceReq : 0,
        "order_request": val.labImgOrderReq > 0 ? val.labImgOrderReq : 0
      },
      "para": {
        "availability_request": val.paraMedAvailReq > 0 ? val.paraMedAvailReq : 0,
        "price_request": val.paraMedPriceReq > 0 ? val.paraMedPriceReq : 0,
        "order_request": val.paraOrderReq > 0 ? val.paraOrderReq : 0
      },
      

      "userId": this.userId,
      "createdBy": this.userId
    }

    console.log(reqData,"set req Data");
    

    this._superAdminService.addMaximumReq(reqData).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      console.log(result.body,"result");
      if(result.status){
        this.loader.stop();
        this._coreService.showSuccess(result.message,'');
        console.log("if is performed successfully");
        this.patchSaveMaximumReq();
        this._route.navigate(['/super-admin/master']);
      }else{
        this.loader.stop();
        this._coreService.showError(result.message,'');
        console.log("else is performed successfully");
      }

    })

  }


}
