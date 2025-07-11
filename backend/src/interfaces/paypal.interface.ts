export interface PayPalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalPurchaseUnitAmount {
  currency_code: string;
  value: string;
}

export interface PayPalPurchaseUnit {
  reference_id?: string;
  description?: string;
  amount: PayPalPurchaseUnitAmount;
  payee?: {
    email_address: string;
    merchant_id: string;
  };
  payments?: {
    captures?: PayPalCapture[];
  };
}

export interface PayPalCapture {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  final_capture: boolean;
  seller_protection: {
    status: string;
    dispute_categories: string[];
  };
  create_time: string;
  update_time: string;
  invoice_id?: string;
  custom_id?: string;
  seller_receivable_breakdown?: {
    gross_amount: {
      currency_code: string;
      value: string;
    };
    paypal_fee: {
      currency_code: string;
      value: string;
    };
    net_amount: {
      currency_code: string;
      value: string;
    };
  };
  links?: PayPalLink[];
  note_to_payer?: string;
}

export interface PayPalOrderResponse {
  id: string;
  intent: string;
  status: string;
  purchase_units: PayPalPurchaseUnit[];
  payer?: {
    name?: {
      given_name: string;
      surname: string;
    };
    email_address?: string;
    payer_id?: string;
    address?: {
      country_code: string;
    };
  };
  links: PayPalLink[];
  create_time: string;
  update_time: string;
}

export interface PayPalCaptureResponse extends PayPalOrderResponse {
  purchase_units: (PayPalPurchaseUnit & { payments?: { captures: PayPalCapture[] } })[];
}
