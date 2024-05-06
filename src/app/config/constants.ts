import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class Constants {
  public readonly GATEWAY_API_ENDPOINT: string = environment.apiUrl;
  public readonly PHARMACY_PORTAL: string = "healthcare-crm-pharmacy/";
  public readonly INSURANCE_PORTAL: string = "healthcare-crm-insurance/";
  public readonly PATIENT_PORTAL: string = "healthcare-crm-patient/";
  public readonly GATEWAY_API_MOCK_ENDPOINT: string = environment.apiUrl;
  public readonly PHARMACY_API_MOCK_ENDPOINT: string = "http://localhost:8001";
  public static RESCHEDULING_CANCEL_HOURS : Number = 8;
}
