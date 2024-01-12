export interface IVendor {
  first_name: string;
  last_name: string;
  image: string;
  _id: string;
  tags: string[];
  phone_number: string;
  email: string;
  createdAt?: Date;
  rate?: number;
}

export interface IProduct {
  vendor?: IVendor;
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category: string;
  local_goverment: string;
  images: any[];
  is_service: boolean;
  billing_type: string;
  is_negotiable: boolean;
  show_phone_number: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  is_deleted: boolean;
  is_published: boolean;
  is_promoted: boolean;
  sponsorship: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  active_promotion: string;
  slug: string;
}

export interface IProductWithoutVendor {
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category: string;
  local_goverment: string;
  images: {
    url: string;
    id: string;
  }[];
  is_service: boolean;
  billing_type: string;
  active_promotion: string;
  sponsorship: string;
  is_negotiable: boolean;
  show_phone_number: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  is_deleted: boolean;
  is_published: boolean;
  is_promoted: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}

export interface iReview {
  _id: string;
  rating: number;
  comment: string;
  name: string;
  createdAt: Date;
}

export interface ISignup {
  emailOrPhone: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  main_app_vendor_id: string;
  password: string;
  cpassword: string;
  image: string;
  tags: string[];
  code: string;
}

export interface IProductFormData {
  name: string;
  category: string;
  sub_category: string;
  local_goverment: string;
  price: number;
  description: string;
  is_service: boolean;
  is_negotiable: boolean;
  billing_type: string;
  show_phone_number: boolean;
  show_email: boolean;
  show_whatsapp: boolean;
  images: IUploadImage[];
  type: string;
}
