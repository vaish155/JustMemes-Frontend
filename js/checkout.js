const CheckoutUI = (() => {
    let order = null;
    let razorpayInfo = null;
    let inFlight = false;

    const overlay = $('#checkout-overlay');
    const paymentModal = $('#payment-modal');
    const successOverlay = $('#success-overlay');
    const submitBtn = $('#pay-submit-btn');

    function open() {
        if (Cart.isEmpty()) return;
        renderSummary();
        overlay.classList.remove('hidden');
        overlay.classList.add('block');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        if (inFlight) return;
        overlay.classList.add('hidden');
        overlay.classList.remove('block');
        if (!$('#cart-drawer').classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function hideSuccess() {
        successOverlay.classList.add('hidden');
        successOverlay.classList.remove('flex');
        document.body.style.overflow = '';
    }

    function renderSummary() {
        const items = Cart.list();
        $('#checkout-items').innerHTML = items
            .map(
                (item) => `
            <div class="flex justify-between gap-3 text-sm">
                <span class="text-zinc-400 truncate">${item.qty}× ${escapeHtml(item.name)} <span class="text-zinc-600">(${SIZE_LABEL[item.size] || item.size.toUpperCase()})</span></span>
                <span class="font-bold shrink-0">${inr(item.price * item.qty)}</span>
            </div>`
            )
            .join('');
        const total = Cart.subtotal();
        $('#co-subtotal').textContent = inr(total);
        $('#co-total').textContent = inr(total);
        $('#pay-amount').textContent = inr(total);
    }

    async function placeOrder() {
        if (inFlight) return;
        const items = Cart.list();
        if (items.length === 0) {
            window.toast('Cart is empty, legend.', 'error');
            return;
        }

        if (window.demoMode === true && items.some((i) => String(i.productId).startsWith('demo-'))) {
            window.toast('Demo items can only be browsed — start the backend to checkout.', 'error');
            return;
        }

        const payload = {
            customerName: $('#c-name').value.trim(),
            contact: $('#c-contact').value.trim(),
            email: $('#c-email').value.trim(),
            address: $('#c-address').value.trim(),
            roomNumber: $('#c-room').value.trim(),
            hostelName: $('#c-hostel').value.trim(),
            items: items.map((i) => ({
                productId: i.productId,
                productName: i.name,
                size: i.size,
                quantity: i.qty,
                price: i.price
            }))
        };

        for (const key of ['customerName', 'contact', 'email', 'address', 'roomNumber', 'hostelName']) {
            if (!payload[key]) {
                window.toast('Fill in every field — we need the deets.', 'error');
                return;
            }
        }
        if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
            window.toast('That email is not emailing.', 'error');
            return;
        }

        inFlight = true;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Securing your order…';

        try {
            const { order } = await window.API.placeOrder(payload);
            overlay.classList.add('hidden');
            overlay.classList.remove('block');

            const amount = Math.max(1, Math.round((order.total || Cart.subtotal()) * 100));
            const payment = await window.API.createPaymentOrder({ orderId: order.id, amount });

            razorpayInfo = { order, rzp: payment.razorpay };
            if (payment.razorpay && payment.razorpay.mock) {
                showMockPayment();
            } else {
                await openRazorpayCheckout();
            }
        } catch (err) {
            window.toast(err.message || 'Checkout exploded. Try again.', 'error');
            resetSubmit();
        }
    }

    function resetSubmit() {
        inFlight = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order · Pay Securely';
    }

    function showMockPayment() {
        paymentModal.classList.remove('hidden');
        paymentModal.classList.add('flex');
    }

    function hideMockPayment() {
        paymentModal.classList.add('hidden');
        paymentModal.classList.remove('flex');
    }

    function loadRazorpayScript() {
        return new Promise((resolve, reject) => {
            if (window.Razorpay) return resolve();
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Could not load Razorpay checkout. Check your internet.'));
            document.head.appendChild(script);
        });
    }

    async function openRazorpayCheckout() {
        try {
            await loadRazorpayScript();
            const { order, rzp } = razorpayInfo;
            const options = {
                key: rzp.key,
                amount: rzp.amount,
                currency: rzp.currency,
                name: 'InsiderMemes',
                description: 'Drop 001 — Limited Merch',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEg4hslTC_Y8BJ1Twku1yqJf7l5VspZsq5fsQG4ba7cMPdCSrFVp6DEqp&s=10',
                order_id: rzp.id,
                prefill: {
                    name: order.customerName,
                    email: order.email,
                    contact: order.contact
                },
                theme: { color: '#a3e635' },
                handler: (resp) => verifyPayment(resp, order.id)
            };
            const rzpInstance = new window.Razorpay(options);
            rzpInstance.on('payment.failed', (err) => {
                window.toast('Payment failed: ' + (err.error && err.error.description || 'try again'), 'error');
            });
            rzpInstance.open();
        } catch (err) {
            window.toast(err.message, 'error');
            inFlight = false;
            open();
        }
    }

    async function verifyPayment(resp, orderId) {
        try {
            const result = await window.API.verifyPayment({
                orderId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature
            });
            finishOrder(result);
        } catch (err) {
            window.toast(err.message || 'Verification failed.', 'error');
            inFlight = false;
        }
    }

    function finishOrder(result) {
        inFlight = false;
        Cart.clear();
        const order = razorpayInfo ? razorpayInfo.order : { id: '—' };
        const paymentId = result.order && result.order.razorpayPaymentId;
        window.showSuccessScreen(order, paymentId);
    }

    if (!window.checkoutDeps) window.checkoutDeps = { closeAll: () => { close(); hideMockPayment(); } };

    window.Checkout = {
        open,
        close,
        hideSuccess,
        closeAll: () => {
            close();
            hideMockPayment();
        }
    };

    $('#pay-submit-btn').addEventListener('click', placeOrder);
    $$('[data-close-checkout]').forEach((el) => el.addEventListener('click', close));
    $('#pay-simulate-btn').addEventListener('click', async () => {
        if (!razorpayInfo) return;
        const { order, rzp } = razorpayInfo;
        const paymentId = 'pay_' + Date.now().toString(36).toUpperCase();
        const signature = CryptoJS.HmacSHA256(`${rzp.id}|${paymentId}`, 'test_secret').toString();
        $('#pay-spinner').innerHTML = '';
        $('#pay-spinner').className = 'text-4xl flex items-center justify-center w-16 h-16 mb-6';
        $('#pay-spinner').textContent = '✅';
        $('#pay-amount').textContent = inr(rzp.amount / 100);
        $('#pay-simulate-btn').disabled = true;
        const result = await window.API.verifyPayment({
            orderId: order.id,
            razorpay_order_id: rzp.id,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature
        });
        hideMockPayment();
        finishOrder(result);
    });

    return { open, close, hideSuccess };
})();