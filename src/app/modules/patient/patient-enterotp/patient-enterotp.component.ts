import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-enterotp',
  templateUrl: './patient-enterotp.component.html',
  styleUrls: ['./patient-enterotp.component.scss']
})
export class PatientEnterotpComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}
