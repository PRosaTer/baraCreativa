export interface PayPalActions {
  order: {
    create(data: Record<string, unknown>): Promise<string>;
    capture(): Promise<void>;
  };
}

export interface CreateOrderData {

}

export interface OnApproveData {

}

export interface PayPalError {
  name?: string;
  message?: string;
  details?: unknown;
}

export interface PayPalButtonOptions {
  createOrder: (data: CreateOrderData, actions: PayPalActions) => Promise<string>;
  onApprove: (data: OnApproveData, actions: PayPalActions) => Promise<void>;
  onError?: (err: PayPalError) => void;
}

export interface PayPalButtons {
  render: (selector: string) => void;
}

export interface PayPalNamespace {
  Buttons: (options: PayPalButtonOptions) => PayPalButtons;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}
