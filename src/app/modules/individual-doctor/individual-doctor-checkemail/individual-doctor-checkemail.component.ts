import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-individual-doctor-checkemail',
  templateUrl: './individual-doctor-checkemail.component.html',
  styleUrls: ['./individual-doctor-checkemail.component.scss']
})
export class IndividualDoctorCheckemailComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  constructor() { }

  ngOnInit(): void {
  }

}
