import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { thisWeek } from "@igniteui/material-icons-extended";

@Component({
  selector: "app-retailhospitalinfo",
  templateUrl: "./retailhospitalinfo.component.html",
  styleUrls: ["./retailhospitalinfo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RetailhospitalinfoComponent implements OnInit {
  hospitalId: any;
  hospitalDoctorList: any[] = [];
  doctorsList: any[] = [];
  hospitalDetails: any = "";
  hospitalRatings : any ="";
  specialityList: any[] = [];
  hospitalProfile: any = "";
  numberofDoctors: any = "";
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  doctor_name: any = "";
  overlay: false;
  specialityID: any = "";
  groupedDoctors:any=[];
  selectedDoctor:any=[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: HospitalService,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hospitalId = this.activatedRoute.snapshot.paramMap.get("id");
    // this.getSpecialitylist();
    this.gethospitalDoctorlist();
    this.gethospitalDetails();
  }
  handleRoute(){
    let doctorId = this.hospitalDoctorList[0]._id
    console.log(doctorId)
    this.router.navigate([ '/patient/homepage/retaildoctordetail',doctorId])
  }
  gethospitalDoctorlist() {
    let reqData = {
      hospital_portal_id: this.hospitalId,
      doctor_name: this.doctor_name,
      speciality: this.specialityID
    };
    console.log("reqDataSearch----------->", reqData);
    this.service.hospitalDoctorListApi(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({data:res});
      console.log("response----------->", response);

      this.hospitalDoctorList = response?.body?.result;
      this.doctorsList = response?.body?.result;
      console.log(" this.hospitalDoctorList==============>", this.doctorsList);
      this.groupDoctorsBySpeciality(this.doctorsList)
    });
  }
  
  groupDoctorsBySpeciality(doctorsList: any[]) {
    console.log("doctorsList>>>>>>>",doctorsList)
    doctorsList.forEach(doctor => {
      doctor.speciality1.forEach(speciality => {
        let index = this.groupedDoctors.findIndex(group => group.speciality === speciality);
        if (index === -1) {
          this.groupedDoctors.push({ speciality: speciality, doctors: [doctor] });
        } else {
          this.groupedDoctors[index].doctors.push(doctor);
        }
      });
    });
    return this.groupedDoctors;
  }
  

  getSpecialitylist() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
    };
    this.superAdminService.listSpeciality(reqData).subscribe((res) => {
      console.log("speciality res", res);
     let  encryptedData = {data:res}
      let response = this.coreService.decryptObjectData(encryptedData);

      // this.specialityList = response?.body?.data;
      const arr = response?.body?.data;
      arr.unshift({value: '', label: 'Select speciality'});
      arr.map((curentval: any) => {
        this.specialityList.push({
          label: curentval?.specilization,
          value: curentval?.specilization,
        });
      });
    });
  }
  gethospitalDetails() {
    this.service.hospitalDetailsApi(this.hospitalId).subscribe((res) => {
      
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log('Hospital Details => ',response);
      console.log(response,"dshjdghjdghjdg");
      
      this.hospitalDetails = response?.body?.data;
      this.hospitalProfile = response?.body?.data?.profile_picture;
      this.numberofDoctors = response?.body?.doctorCount;
      this.hospitalRatings = response?.body?.hospital_rating
      console.log(this.hospitalRatings , "ljkj");
      
      const team = response?.body?.our_team;
      let specialityArray = [{
        label: 'Select Speciality',
        value: ''
      }]
      for (const idx in team) {
        specialityArray.push({
          label: team[idx][0].speciality.name,
          value: team[idx][0].speciality.id
        })
      }
      this.specialityList = specialityArray
    });
  }
  handleSelectSpecialityList(event: any) {
    console.log(event,"this.specialityID",this.specialityID)
    this.groupedDoctors = [];
    this.specialityID = event.value
    this.gethospitalDoctorlist();
  }
  handleSearchDoctorList(event: any) {
    this.groupedDoctors = [];
    this.doctor_name = event.target.value;
    this.gethospitalDoctorlist();
  }
  getDirection(direction:any ) {
    if(!direction)
    return null
    const lat = direction[1];
    const lng = direction[0];
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, "_blank");  
  
  }
}
