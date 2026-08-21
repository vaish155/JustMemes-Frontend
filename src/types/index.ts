export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

export type Color = string;

export const COLOR_LABEL: Record<string, string> = {
  black: 'Black',
  white: 'White',
  grey: 'Grey',
  navy: 'Navy',
  olive: 'Olive',
  maroon: 'Maroon',
  beige: 'Beige',
};

export const COLOR_HEX: Record<string, string> = {
  black: '#18181b',
  white: '#fafafa',
  grey: '#a1a1aa',
  navy: '#1e3a5f',
  olive: '#6b7250',
  maroon: '#7f1d1d',
  beige: '#d6c9b4',
};

export const colorLabel = (c: string) =>
  COLOR_LABEL[c] || (c ? c.charAt(0).toUpperCase() + c.slice(1) : '');

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  stock: number;
  size: Size[];
  colors: Color[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  stock: number;
  size: Size;
  color: Color;
  qty: number;
}

export interface CheckoutFormData {
  customerName: string;
  contact: string;
  email: string;
  address: string;
  roomNumber: string;
  hostelName: string;
}

export interface OrderPayloadItem {
  productId: string;
  productName: string;
  size: Size;
  color: Color;
  quantity: number;
  price: number;
}

export interface OrderPayload extends CheckoutFormData {
  items: OrderPayloadItem[];
}

export interface OrderResponse {
  id: string;
  customerName: string;
  email: string;
  contact: string;
  total?: number;
  status?: string;
}

export interface AdminOrderItem {
  productId: string;
  productName: string;
  size: Size;
  color: Color;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  contact: string;
  email: string;
  address: string;
  roomNumber: string;
  hostelName: string;
  items: AdminOrderItem[];
  subtotal: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  phonepeTxnId: string;
  paymentGateway: string;
  phonepeResponseCode: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
}

export interface RazorpayCreateOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  order?: OrderResponse;
  error?: string;
}

export interface RazorpayVerifyPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface RazorpayVerifyResponse {
  success: boolean;
  valid: boolean;
  paymentStatus: string;
  order: OrderResponse;
}

export type ToastType = 'info' | 'success' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

