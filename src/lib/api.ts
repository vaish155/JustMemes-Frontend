import {
  Product,
  OrderPayload,
  OrderResponse,
  PaymentCreateResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from '@/types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://justmemes-backend-531422631456.asia-south1.run.app';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'The "Three Apples" Tee',
    description: 'Certified unhinged. Oversized fit, bio-washed, zero chill.',
    price: 899,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEg4hslTC_Y8BJ1Twku1yqJf7l5VspZsq5fsQG4ba7cMPdCSrFVp6DEqp&s=10',
    stock: 12,
    size: ['s', 'm', 'l', 'xl'],
  },
  {
    id: 'demo-2',
    name: 'The "Blank Canvas" Tee',
    description: 'For people with no thoughts upstairs. Classic fit.',
    price: 899,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Vw02bkwgzPdmBr_ir1F3mAuYoyzZdrvhlVOwYGLNazKAL3bpx-kW1dcH&s=10',
    stock: 3,
    size: ['s', 'm', 'l', 'xl'],
  },
  {
    id: 'demo-3',
    name: 'The "Low Battery" Tee',
    description: 'Premium 240GSM. Emotionally identical every day.',
    price: 999,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSfDxRZh-VZL8GE8yHC4_MbCZvG0q7w9jcn2BVQ2rk_a2K3r_LT4iRcG0q7w9jcn2BVQ2rk_a2K3r_T4iRc',
    stock: 0,
    size: ['xs', 's', 'm', 'l', 'xl'],
  },
];

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const API = {
  base: API_BASE,
  async getProducts(): Promise<{ products: Product[]; isDemo: boolean }> {
    try {
      const data = await req<Product[]>('/products');
      if (Array.isArray(data)) {
        return { products: data, isDemo: false };
      }
      return { products: DEMO_PRODUCTS, isDemo: true };
    } catch {
      return { products: DEMO_PRODUCTS, isDemo: true };
    }
  },
  async getProductById(id: string): Promise<Product | null> {
    const { products } = await this.getProducts();
    const found = products.find((p) => String(p.id) === String(id));
    return found || null;
  },
  placeOrder(payload: OrderPayload): Promise<{ order: OrderResponse }> {
    return req<{ order: OrderResponse }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  createPaymentOrder(payload: { orderId: string; amount: number }): Promise<PaymentCreateResponse> {
    return req<PaymentCreateResponse>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
    return req<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
