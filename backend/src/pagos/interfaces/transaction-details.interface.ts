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
}
