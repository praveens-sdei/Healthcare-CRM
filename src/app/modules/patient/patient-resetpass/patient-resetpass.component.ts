import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-resetpass',
  templateUrl: './patient-resetpass.component.html',
  styleUrls: ['./patient-resetpass.component.scss']
})
export class PatientResetpassComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}
