export interface PayPalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalItem {
  name: string;
  unit_amount: PayPalAmount;
  quantity: string;
  sku?: string;
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION';
}

export interface PayPalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string;
  admin_area_1?: string;
  postal_code?: string;
  country_code?: string;
}

export interface PayPalShipping {
  type?: 'SHIPPING' | 'PICKUP';
  name?: {
    full_name?: string;
  };
  address?: PayPalAddress;
}

export interface PayPalCapture {
  id: string;
  status: 'COMPLETED' | 'PENDING' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  amount: PayPalAmount;
  seller_protection?: {
    status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
    dispute_categories: string[];
  };
  final_capture?: boolean;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalPurchaseUnit {
  reference_id?: string;
  amount: PayPalAmount;
  payee?: {
    email_address?: string;
    merchant_id?: string;
  };
  description?: string;
  items?: PayPalItem[];
  shipping?: PayPalShipping;
  payments?: {
    captures: PayPalCapture[];
  };
}

export interface PayPalApplicationContext {
  brand_name?: string;
  locale?: string;
  landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE';
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  user_action?: 'CONTINUE' | 'PAY_NOW';
  return_url?: string;
  cancel_url?: string;
}


export interface PayPalLink { 
  href: string;
  rel: string;
  method?: string;
}

export interface PayPalPayer {
  email_address?: string;
  payer_id?: string;
  name?: {
    given_name?: string;
    surname?: string;
  };
  address?: PayPalAddress;
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  purchase_units: PayPalPurchaseUnit[];
  payer?: PayPalPayer;
  links: PayPalLink[];
  create_time?: string;
  update_time?: string;
}


export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'PENDING' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  amount: PayPalAmount;
  seller_protection?: {
    status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
    dispute_categories: string[];
  };
  final_capture?: boolean;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}