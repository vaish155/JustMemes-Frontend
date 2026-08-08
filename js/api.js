const API_BASE = window.API_CONFIG && window.API_CONFIG.base
    ? window.API_CONFIG.base
    : 'http://localhost:3000';

async function req(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
}

window.API = {
    base: API_BASE,
    fetch: req,
    ping: () => req('/ping'),
    getProducts: () => req('/products'),
    placeOrder: (payload) => req('/checkout', { method: 'POST', body: payload }),
    createPaymentOrder: (payload) => req('/payments/create-order', { method: 'POST', body: payload }),
    verifyPayment: (payload) => req('/payments/verify', { method: 'POST', body: payload })
};