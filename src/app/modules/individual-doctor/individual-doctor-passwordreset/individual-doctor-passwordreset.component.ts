import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-individual-doctor-passwordreset',
  templateUrl: './individual-doctor-passwordreset.component.html',
  styleUrls: ['./individual-doctor-passwordreset.component.scss']
})
export class IndividualDoctorPasswordresetComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}
