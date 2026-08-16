export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
  size: Size[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  size: Size;
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

