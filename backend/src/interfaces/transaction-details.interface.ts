
export interface TransactionAmount {
  currency_code: string;
  value: string;
}

export interface TransactionCapture {
  id: string;
  status: string;
  amount: TransactionAmount;
  create_time: string;
  update_time: string;
}

export interface TransactionPayerName {
  given_name: string;
  surname: string;
}

export interface TransactionPayer {
  name: TransactionPayerName;
  email_address: string;
  payer_id: string;
}

export interface TransactionDetails {
  id: string;
  status: string;
  create_time: string;
  update_time: string;
  payer: TransactionPayer;
  [key: string]: unknown;
  amount: TransactionAmount;
}
