import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance-passwordreset',
  templateUrl: './insurance-passwordreset.component.html',
  styleUrls: ['./insurance-passwordreset.component.scss']
})
export class InsurancePasswordresetComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}
