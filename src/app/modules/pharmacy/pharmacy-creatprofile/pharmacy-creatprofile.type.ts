export interface IProfileRequest {
  for_portal_user: string;
  address: string;
  email:string;
  loc: Object;
  pharmacy_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  slogan: string;
  main_phone_number: string;
  additional_phone_number: string[];
  about_pharmacy: string;
  medicine_request: {
    prescription_order: boolean;
    medicine_price_request: boolean;
    request_medicine_available: boolean;
  };
  association: {
    enabled: boolean;
    name: string[];
  };
  profile_picture: string;
  licence_details: {
    id_number: string;
    expiry_date: string;
    licence_picture: string;
  };
  duty_group: {
    enabled: boolean;
    id_number: string;
  };
  show_to_patient: boolean;
  bank_details: {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_address: string;
  };
  mobile_pay_details: {
    provider: string;
    pay_number: string;
  };
  location_info: {
    nationality: string;
    neighborhood: string;
    region: string;
    province: string;
    department: string;
    city: string;
    village: string;
    pincode: string;
  };
  pharmacy_picture
}

export interface IProfileResponse {
  adminData: string;
}

export interface IFileUploadResult {
  ETag: string;
  ServerSideEncryption: string;
  VersionId: string;
  Location: string;
  Key: string;
  Bucket: string;
}
