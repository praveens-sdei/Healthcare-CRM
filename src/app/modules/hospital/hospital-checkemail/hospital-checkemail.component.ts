import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hospital-checkemail',
  templateUrl: './hospital-checkemail.component.html',
  styleUrls: ['./hospital-checkemail.component.scss']
})
export class HospitalCheckemailComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  constructor() { }

  ngOnInit(): void {
  }

}
