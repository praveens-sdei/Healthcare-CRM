import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import { HospitalService } from '../../hospital.service';
import {FourPortalService} from '../../../four-portal/four-portal.service'

@Component({
  selector: 'app-paramedicalprofile',
  templateUrl: './paramedicalprofile.component.html',
  styleUrls: ['./paramedicalprofile.component.scss']
})
export class ParamedicalprofileComponent implements OnInit {


  doctorId: any = "";
  profileDetails: any;
  availabilityArray: any = [];
  profileImage: any = "";

  locationData: any;
  country: any = "";
  region: any = "";
  province: any = "";
  department: any = "";
  city: any = "";
  village: any = "";

  availability: any = {};
  selected: any = "ONLINE";
  inHospitalLocations: any = [];
  selectedLocation: any = "";
  feeManagementArray: any;
  locationList: any;
  selectedData: any;
  designation: any;
  title: any;
  team: any;
  hospitalId: any;
  pathologyTests: any = [];
  updatedPathologyTests: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: HospitalService,
    private coreService: CoreService,
    private sadminService: SuperAdminService,
    private toastr: ToastrService,
    private fourportalservice: FourPortalService
  ) { }

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.doctorId = paramId;
    this.getProfileDetails();
  }

  getProfileDetails() {
    let reqData = {
      portal_user_id: this.doctorId,
      type:'Paramedical-Professions'
    }
    this.fourportalservice.getProfileDetailsById(reqData ).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE DETAILS DOCTOR ============>", response);
        this.profileDetails = response?.data?.result[0];
        this.profileImage = this.profileDetails?.profile_picture?.url;
        this.locationData = response?.data[0]?.in_location;
        this.availabilityArray = response?.data?.availabilityArray;
        this.feeManagementArray = response?.data?.feeMAnagementArray
        this.getDesignation(this.profileDetails?.designation);
        this.getTitle(this.profileDetails?.title);

        if (this.locationData) {
          this.getCountryList();
          this.getRegionList(this.locationData?.country);
          this.getProvienceList(this.locationData?.region);
          this.getDepartmentList(this.locationData?.province);
          this.getCityList(this.locationData?.department);
        }
        
        this.availabilityArray.forEach((element) => {
          if (element.appointment_type === "ONLINE") {
            this.arrangAvailability(element?.week_days);
          }
        });

        this.hospitalId = response?.data?.result[0]?.for_hospital
        if(this.profileDetails?.team != null){
          this.getTeam(this.profileDetails?.team,this.hospitalId);
        }

        if (response?.data?.result[0]?.in_hospital_location != null) {
          this.inHospitalLocations =
          response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
          this.selectedLocation = this.inHospitalLocations[0]?.hospital_id;
        }

        this.pathologyTests = response.data.pathology_tests;

        const groupedTests = {};

        this.pathologyTests.forEach(test => {
          if (!groupedTests[test.typeOfTest]) {
            groupedTests[test.typeOfTest] = [];
          }
          groupedTests[test.typeOfTest].push(test.nameOfTest);
        });

        this.updatedPathologyTests = Object.keys(groupedTests).map(typeOfTest => {
          return {
            typeOfTest,
            nameOfTests: groupedTests[typeOfTest]
          };
        });
        console.log(this.pathologyTests, "updatedPathologyTests_____", this.updatedPathologyTests,);

        this.getLocations(this.feeManagementArray);

       
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  arrangAvailability(data: any) {
    console.log("WEEEK DAYS=====>", data);
    let Sun = [];
    let Mon = [];
    let Tue = [];
    let Wed = [];
    let Thu = [];
    let Fri = [];
    let Sat = [];
    data.forEach((element) => {
      let data = this.arrangeWeekDaysForPatch(element);
      Sun.push({
        start_time: data?.sun_start_time,
        end_time: data?.sun_end_time,
      });
      Mon.push({
        start_time: data?.mon_start_time,
        end_time: data?.mon_end_time,
      });
      Tue.push({
        start_time: data?.tue_start_time,
        end_time: data?.tue_end_time,
      });
      Wed.push({
        start_time: data?.wed_start_time,
        end_time: data?.wed_end_time,
      });
      Thu.push({
        start_time: data?.thu_start_time,
        end_time: data?.thu_end_time,
      });
      Fri.push({
        start_time: data?.fri_start_time,
        end_time: data?.fri_end_time,
      });
      Sat.push({
        start_time: data?.sat_start_time,
        end_time: data?.sat_end_time,
      });
    });

    let obj = {
      Sun: Sun,
      Mon: Mon,
      Tue: Tue,
      Wed: Wed,
      Thu: Thu,
      Fri: Fri,
      Sat: Sat,
    };

    this.availability = obj;

    console.log("AVAILABILITY======>", this.availability);
  }

  handleSelectAvailabilty(event) {
    this.availabilityArray.forEach((data) => {
      if (data.appointment_type === event.value) {
        this.arrangAvailability(data?.week_days);
      }
    });
  }

  getLocations(data: any) {
    console.log("data===>", data);
    let reqdata={
      portal_user_id:this.doctorId,
      type:'Paramedical-Professions'
    }
    this.fourportalservice.getLocations(reqdata).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("MATHING ID===>", response);
      if (response.status == true) {
        if (response.data.length != 0) {
          this.locationList = response?.data[0]?.hospital_or_clinic_location;
      
          console.log(" this.locationList", this.locationList, this.locationList[0].hospital_id);
          this.handleSelectFees(this.locationList[0].hospital_id)
        }
      }
    });
  }

  selected_Location: any
  selected_hospitalLocation: any = "";

  handleSelectFees(location_id) {
    console.log("handleSelectFees", this.feeManagementArray, event);
    if(this.feeManagementArray.length>0){
      this.selected_Location = location_id
      this.selected_hospitalLocation = this.feeManagementArray.filter(ele => ele.location_id === location_id)
      this.handleSelectConsulation('online')
    }
  

  }
  handleSelectConsulation(event: any) {
    console.log("event",  this.selected_hospitalLocation[0]);
    if(this.selected_hospitalLocation[0] !== undefined){
      this.selected = event
      this.selectedData = this.selected_hospitalLocation[0][event]
      console.log(this.selectedData)
    }

  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //-------------Calling address api's---------------
  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.country) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRegionList(countryID: any) {
    if (countryID === null) {
      return;
    }
    this.sadminService.getRegionListByCountryId(countryID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.region) {
            this.region = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProvienceList(regionID: any) {
    if (regionID === null) {
      return;
    }
    this.sadminService.getProvinceListByRegionId(regionID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.province) {
            this.province = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDepartmentList(provinceID: any) {
    if (provinceID === null) {
      return;
    }
    this.sadminService.getDepartmentListByProvinceId(provinceID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.department) {
            this.department = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCityList(departmentID: any) {
    if (departmentID === null) {
      return;
    }
    this.sadminService.getCityListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.city) {
            this.city = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.sadminService.getVillageListByDepartmentId(departmentID).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.village) {
            this.village = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //---------------------------------------
  arrangeWeekDaysForPatch(element: any) {
    let wkD = {
      sun_start_time:
        element.sun_start_time.slice(0, 2) +
        ":" +
        element.sun_start_time.slice(2, 4),

      sun_end_time:
        element.sun_end_time.slice(0, 2) +
        ":" +
        element.sun_end_time.slice(2, 4),

      mon_start_time:
        element.mon_start_time.slice(0, 2) +
        ":" +
        element.mon_start_time.slice(2, 4),

      mon_end_time:
        element.mon_end_time.slice(0, 2) +
        ":" +
        element.mon_end_time.slice(2, 4),

      tue_start_time:
        element.tue_start_time.slice(0, 2) +
        ":" +
        element.tue_start_time.slice(2, 4),

      tue_end_time:
        element.tue_end_time.slice(0, 2) +
        ":" +
        element.tue_end_time.slice(2, 4),

      wed_start_time:
        element.wed_start_time.slice(0, 2) +
        ":" +
        element.wed_start_time.slice(2, 4),

      wed_end_time:
        element.wed_end_time.slice(0, 2) +
        ":" +
        element.wed_end_time.slice(2, 4),

      thu_start_time:
        element.thu_start_time.slice(0, 2) +
        ":" +
        element.thu_start_time.slice(2, 4),

      thu_end_time:
        element.thu_end_time.slice(0, 2) +
        ":" +
        element.thu_end_time.slice(2, 4),

      fri_start_time:
        element.fri_start_time.slice(0, 2) +
        ":" +
        element.fri_start_time.slice(2, 4),

      fri_end_time:
        element.fri_end_time.slice(0, 2) +
        ":" +
        element.fri_end_time.slice(2, 4),

      sat_start_time:
        element.sat_start_time.slice(0, 2) +
        ":" +
        element.sat_start_time.slice(2, 4),

      sat_end_time:
        element.sat_end_time.slice(0, 2) +
        ":" +
        element.sat_end_time.slice(2, 4),
    };

    return wkD;
  }

  returnWithAmPm(data: any) {
    let filterValue = this.coreService.convertTwentyFourToTwelve(data);
    if (parseInt(filterValue) > 1200 || parseInt(filterValue) === 1200) {
      let format = filterValue.slice(0, 2);
      let after12 = parseInt(format) - 12;

      let finalTime =
        after12 != 0
          ? after12 + ":" + filterValue.slice(2, 4) + " PM"
          : data + " PM";
      return finalTime;
    } else {
      let am = data + " AM";
      return am;
    }
  }

  getDesignation(id: any) {
    this.sadminService.getByIdDesignation(id).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        console.log("result", result);

        this.designation = result.body?.list[0]?.designation
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  getTitle(id: any) {
    this.sadminService.getByIdTitle(id).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        console.log("result", result);
        this.title = result.body?.list[0]?.title

        // result.body?.list.forEach((element) => {
        //   if (element?._id === this.locationData?.city) {
        //     this.city = element?.name;
        //   }
        // });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getTeam(id: any,hospitalId) {
   let reqData ={
    _id:id,
    hospitalId:hospitalId
   }
   console.log("result", reqData);
    
    this.service.getByIdTeam(reqData).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.team = result?.body?.list?.team
        console.log("result---->", result?.body?.list?.team)

        // result.body?.list.forEach((element) => {
        //   if (element?._id === this.locationData?.city) {
        //     this.city = element?.name;
        //   }
        // });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
