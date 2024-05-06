import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FourPortalService } from '../../four-portal.service';
@Component({
  selector: 'app-e-prescription-viewpdf',
  templateUrl: './e-prescription-viewpdf.component.html',
  styleUrls: ['./e-prescription-viewpdf.component.scss']
})
export class EPrescriptionViewpdfComponent implements OnInit {
  pdfKey: string;
  eprescriptionDetails: any ="";

  constructor(
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
    private fourPortalService: FourPortalService,

  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params: any) => {
      let appointmentId = params.id
      let portal_type = params.portal_type
      this.getEprescription(appointmentId, portal_type);
    });
  }

  async getEprescription(id, portal_type) {
    let reqData = {
      appointmentId: id,
      portal_type:portal_type
    };

    this.fourPortalService
      .fourPortal_get_ePrescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.eprescriptionDetails = await response?.body?.previewTemplateSigendUrl;
        }
      });
  }



  handleDownloadTemplate() {
    window.location.href = this.eprescriptionDetails;
  }

}
