import { Component, OnInit ,ViewEncapsulation,ViewChild,TemplateRef} from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../super-admin.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {MatPaginator} from '@angular/material/paginator';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-view-manualmedicin-claim',
  templateUrl: './view-manualmedicin-claim.component.html',
  styleUrls: ['./view-manualmedicin-claim.component.scss']
})
export class ViewManualmedicinClaimComponent implements OnInit {
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  patientId: any;
  id:any;
  dataSource:any;
  referenceofFile: any;
  constructor(
    private modalService: NgbModal,
 private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private route:Router,
    private rout:ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.rout.queryParams.subscribe((val: any) => {
      this.id = val.id;
    });
    this.getviewofmanualmedicinClaim()
  }
  getviewofmanualmedicinClaim() {
    this.superAdminService.getviewofmanualmedicinClaim(this.id).subscribe((res) => {

      let response = this.coreService.decryptObjectData({ data: res });
     
       this.dataSource = response?.body;
    console.log(this.dataSource,"this.dataSource");
this.referenceofFile=response?.body.referenceofFile
    });
  }
}
