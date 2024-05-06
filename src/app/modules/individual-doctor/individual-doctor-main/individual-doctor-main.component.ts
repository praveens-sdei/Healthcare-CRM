import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-individual-doctor-main',
  templateUrl: './individual-doctor-main.component.html',
  styleUrls: ['./individual-doctor-main.component.scss']
})
export class IndividualDoctorMainComponent implements OnInit {
  loggedInUserName:any;
  portaltype='doctor'
  constructor() { 
     let adminData = JSON.parse(localStorage.getItem("adminData"));
  this.loggedInUserName=adminData?.full_name
}

  ngOnInit(): void {
  }

}
