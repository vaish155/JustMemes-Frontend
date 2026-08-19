import {
  Product,
  OrderPayload,
  OrderResponse,
  RazorpayCreateOrderResponse,
  RazorpayVerifyPayload,
  RazorpayVerifyResponse,
  AdminOrder,
} from '@/types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://justmemes-backend-531422631456.asia-south1.run.app';

export const FLAT_PRICE = 1;

const ADMIN_PWD_KEY = 'adminPwd';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getAdminPwd(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(ADMIN_PWD_KEY);
}

export function setAdminPwd(pwd: string) {
  window.sessionStorage.setItem(ADMIN_PWD_KEY, pwd);
}

export function clearAdminPwd() {
  window.sessionStorage.removeItem(ADMIN_PWD_KEY);
}

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'The "Three Apples" Tee',
    description: 'Certified unhinged. Oversized fit, bio-washed, zero chill.',
    price: FLAT_PRICE,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEg4hslTC_Y8BJ1Twku1yqJf7l5VspZsq5fsQG4ba7cMPdCSrFVp6DEqp&s=10',
    stock: 12,
    size: ['s', 'm', 'l', 'xl'],
  },
  {
    id: 'demo-2',
    name: 'The "Blank Canvas" Tee',
    description: 'For people with no thoughts upstairs. Classic fit.',
    price: FLAT_PRICE,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Vw02bkwgzPdmBr_ir1F3mAuYoyzZdrvhlVOwYGLNazKAL3bpx-kW1dcH&s=10',
    stock: 3,
    size: ['s', 'm', 'l', 'xl'],
  },
  {
    id: 'demo-3',
    name: 'The "Low Battery" Tee',
    description: 'Premium 240GSM. Emotionally identical every day.',
    price: FLAT_PRICE,
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
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

export const API = {
  base: API_BASE,
  async getOrders(): Promise<AdminOrder[]> {
    const pwd = getAdminPwd();
    const data = await req<AdminOrder[]>('/orders', {
      headers: pwd ? { 'x-admin-pwd': pwd } : {},
    });
    return Array.isArray(data) ? data : [];
  },
  async getProducts(): Promise<{ products: Product[]; isDemo: boolean }> {
    try {
      const data = await req<Product[]>('/products');
      if (Array.isArray(data) && data.length > 0) {
        return {
          products: data.map((p) => ({ ...p, price: FLAT_PRICE })),
          isDemo: false,
        };
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
  async getOrderById(id: string): Promise<AdminOrder> {
    return req<AdminOrder>(`/orders/${encodeURIComponent(id)}`);
  },
  placeOrder(payload: OrderPayload): Promise<{ order: OrderResponse }> {
    return req<{ order: OrderResponse }>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  createRazorpayOrder(payload: { orderId: string }): Promise<RazorpayCreateOrderResponse> {
    return req<RazorpayCreateOrderResponse>('/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verifyRazorpayPayment(payload: RazorpayVerifyPayload): Promise<RazorpayVerifyResponse> {
    return req<RazorpayVerifyResponse>('/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

