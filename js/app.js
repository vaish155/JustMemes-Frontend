const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const SIZE_LABEL = { xs: 'XS', s: 'S', m: 'M', l: 'L', xl: 'XL' };
const DEMO_DESC = 'The drop piece. If no one laughs, wear it anyway.';

const DEMO_PRODUCTS = [
    {
        id: 'demo-1',
        name: 'The "Three Apples" Tee',
        description: 'Certified unhinged. Oversized fit, bio-washed, zero chill.',
        price: 899,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEg4hslTC_Y8BJ1Twku1yqJf7l5VspZsq5fsQG4ba7cMPdCSrFVp6DEqp&s=10',
        stock: 12,
        size: ['s', 'm', 'l', 'xl']
    },
    {
        id: 'demo-2',
        name: 'The "Blank Canvas" Tee',
        description: 'For people with no thoughts upstairs. Classic fit.',
        price: 899,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Vw02bkwgzPdmBr_ir1F3mAuYoyzZdrvhlVOwYGLNazKAL3bpx-kW1dcH&s=10',
        stock: 3,
        size: ['s', 'm', 'l', 'xl']
    },
    {
        id: 'demo-3',
        name: 'The "Low Battery" Tee',
        description: 'Premium 240GSM. Emotionally identical every day.',
        price: 999,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSfDxRZh-VZL8GE8yHC4_MbCZvG0q7w9jcn2BVQ2rk_a2K3r_LT4iRcG0q7w9jcn2BVQ2rk_a2K3r_T4iRc',
        stock: 0,
        size: ['xs', 's', 'm', 'l', 'xl']
    }
];

let products = [];
let demoMode = false;
let modalProduct = null;
let modalSize = '';
let modalQty = 1;

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    $('#toasts').appendChild(el);
    setTimeout(() => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 350);
    }, 3200);
}

function boostCount() {
    const badge = $('#cart-count');
    badge.classList.remove('count-bump');
    void badge.offsetWidth;
    badge.classList.add('count-bump');
}

function updateCartUI() {
    $('#cart-count').textContent = Cart.count();
    $('#drawer-subtotal').textContent = inr(Cart.subtotal());
    $('#drawer-total').textContent = inr(Cart.subtotal());
    $('#checkout-btn').disabled = Cart.isEmpty();
}

function gridSkeletons() {
    $('#product-grid').innerHTML = Array.from({ length: 6 })
        .map(() => '<div class="skeleton h-[420px]"></div>')
        .join('');
}

function stockChip(product) {
    if (product.stock <= 0) return '<span class="bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1">Sold out</span>';
    if (product.stock <= 5) return '<span class="bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1">Only ' + product.stock + ' left</span>';
    return '<span class="bg-white/5 border border-white/15 text-zinc-400 text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1">In stock</span>';
}

async function fetchProducts() {
    gridSkeletons();
    try {
        const data = await API.getProducts();
        products = Array.isArray(data) ? data : [];
        demoMode = false;
        window.demoMode = false;
        $('#api-banner').classList.add('hidden');
    } catch {
        products = DEMO_PRODUCTS;
        demoMode = true;
        window.demoMode = true;
        $('#api-banner').classList.remove('hidden');
    }
    renderGrid(products);
}

function renderGrid(list) {
    $('#product-grid').innerHTML = list
        .map(
            (p) => `
        <div class="product-card group" data-product="${escapeHtml(p.id)}">
            <div class="card-img-wrap aspect-square mb-4 relative bg-zinc-800/60">
                <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}" loading="lazy" class="w-full h-full object-cover" onerror="this.style.opacity='0.15'">
                ${p.stock <= 0 ? '<div class="absolute inset-0 grid place-items-center bg-black/45"><span class="font-display font-bold text-2xl tracking-widest border-2 border-rose-400 text-rose-400 px-4 py-2 rounded-lg -rotate-12">SOLD OUT</span></div>' : ''}
            </div>
            <div class="card-body flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="font-display font-bold text-lg leading-snug">${escapeHtml(p.name)}</h3>
                    <p class="text-xs text-zinc-500 mt-0.5">${p.size.map((s) => SIZE_LABEL[s] || String(s).toUpperCase()).join(' · ')}</p>
                </div>
                <div class="text-right shrink-0">
                    <p class="font-display font-bold text-lg text-lime-400">${inr(p.price)}</p>
                    <p class="mt-1">${stockChip(p)}</p>
                </div>
            </div>
        </div>`
        )
        .join('');

    $$('#product-grid .product-card').forEach((card) => {
        card.addEventListener('click', () => openProductModal(card.dataset.product));
        tiltCard(card);
    });
}

function tiltCard(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${py * -7}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
}

function openProductModal(id) {
    const product = products.find((p) => String(p.id) === String(id));
    if (!product) {
        toast('Product not found', 'error');
        return;
    }
    modalProduct = product;
    modalSize = '';
    modalQty = 1;

    $('#modal-img').src = product.imageUrl || '';
    $('#modal-img').style.opacity = '';
    $('#modal-title').textContent = product.name;
    $('#modal-desc').textContent = product.description || DEMO_DESC;
    $('#modal-price').textContent = inr(product.price);

    const chip = $('#modal-stock-chip');
    if (product.stock <= 0) {
        chip.textContent = 'Sold out';
        chip.className = 'absolute top-4 left-4 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur bg-black/60 border border-rose-400/50 text-rose-400';
    } else if (product.stock <= 5) {
        chip.textContent = 'Only ' + product.stock + ' left';
        chip.className = 'absolute top-4 left-4 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur bg-black/60 border border-amber-400/50 text-amber-300';
    } else {
        chip.textContent = 'In stock';
        chip.className = 'absolute top-4 left-4 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur bg-black/60 border border-lime-400/50 text-lime-300';
    }

    renderSizes();
    renderQty();
    updateAddButton();

    $('#product-modal').classList.remove('hidden');
    $('#product-modal').classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function renderSizes() {
    const wrap = $('#modal-sizes');
    wrap.innerHTML = modalProduct.size
        .map((s) => `<button type="button" class="size-btn" data-size="${s}">${SIZE_LABEL[s] || String(s).toUpperCase()}</button>`)
        .join('');
    $('#modal-size-hint').textContent = '';
    $$('#modal-sizes .size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            modalSize = btn.dataset.size;
            $$('#modal-sizes .size-btn').forEach((b) => b.classList.toggle('selected', b === btn));
            $('#modal-size-hint').textContent = '';
            updateAddButton();
        });
    });
    if (modalProduct.size.length === 1) {
        modalSize = modalProduct.size[0];
        $$('#modal-sizes .size-btn')[0].classList.add('selected');
        updateAddButton();
    }
}

function renderQty() {
    $('#modal-qty').textContent = modalQty;
}

function updateAddButton() {
    const btn = $('#add-to-cart-btn');
    if (modalProduct.stock <= 0) {
        btn.disabled = true;
        btn.textContent = 'Sold Out — Gone Forever';
    } else if (!modalSize) {
        btn.disabled = true;
        btn.textContent = 'Pick a size first';
    } else {
        btn.disabled = false;
        btn.textContent = 'Add to Cart — ' + inr(modalProduct.price * modalQty);
    }
}

function closeProductModal() {
    $('#product-modal').classList.add('hidden');
    $('#product-modal').classList.remove('flex');
    document.body.style.overflow = '';
}

function openCartDrawer() {
    renderCartItems();
    $('#cart-drawer').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    $('#cart-drawer').classList.add('hidden');
    document.body.style.overflow = '';
}

function renderCartItems() {
    const items = Cart.list();
    const wrap = $('#cart-items');
    if (items.length === 0) {
        wrap.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center py-10">
                <p class="text-5xl mb-4">🛒</p>
                <p class="font-display font-bold text-xl mb-1">Nothing yet, legend</p>
                <p class="text-sm text-zinc-500 mb-6">Emptier than the canteen after 9pm.</p>
                <button id="empty-cart-shop" class="btn-primary text-sm px-6 py-3">Go shop the drop</button>
            </div>`;
        $('#empty-cart-shop').addEventListener('click', () => {
            closeCartDrawer();
            $('#shop').scrollIntoView({ behavior: 'smooth' });
        });
        return;
    }

    wrap.innerHTML = items
        .map(
            (item, idx) => `
        <div class="flex gap-3 cart-item" data-item="${idx}">
            <div class="w-16 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                <img src="${escapeHtml(item.image)}" alt="" class="w-full h-full object-cover" onerror="this.style.opacity='0.1'">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between gap-2">
                    <p class="font-semibold text-sm leading-snug truncate">${escapeHtml(item.name)}</p>
                    <p class="text-sm font-bold text-lime-400 shrink-0">${inr(item.price * item.qty)}</p>
                </div>
                <div class="mt-2 flex items-center gap-2">
                    <select data-size-pick="${idx}" class="field !w-auto !py-1.5 !px-2 !text-xs !mt-0">
                        ${itemSizesOptions(item)}
                    </select>
                    <div class="flex items-center gap-1.5 ml-auto">
                        <button data-cart-dec="${idx}" class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition active:scale-90">−</button>
                        <span class="w-5 text-center text-sm font-bold">${item.qty}</span>
                        <button data-cart-inc="${idx}" class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition active:scale-90">+</button>
                        <button data-cart-del="${idx}" class="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 font-bold ml-1 transition active:scale-90">✕</button>
                    </div>
                </div>
            </div>
        </div>`
        )
        .join('');

    items.forEach((item, idx) => {
        wrap.querySelector(`[data-item="${idx}"] [data-cart-inc]`).addEventListener('click', () => Cart.setQty(item.productId, item.size, item.qty + 1));
        wrap.querySelector(`[data-item="${idx}"] [data-cart-dec]`).addEventListener('click', () => Cart.setQty(item.productId, item.size, item.qty - 1));
        wrap.querySelector(`[data-item="${idx}"] [data-cart-del]`).addEventListener('click', () => Cart.remove(item.productId, item.size));
        wrap.querySelector(`[data-item="${idx}"] [data-size]`).addEventListener('change', (e) => Cart.changeSize(item.productId, item.size, e.target.value));
    });
}

function itemSizesOptions(item) {
    const product = products.find((p) => String(p.id) === String(item.productId));
    const sizes = product && product.size && product.size.length ? product.size : [item.size];
    return sizes
        .map((s) => `<option value="${s}" ${s === item.size ? 'selected' : ''}>${SIZE_LABEL[s] || String(s).toUpperCase()}</option>`)
        .join('');
}

const confettiCanvas = $('#confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function burstConfetti() {
    const colors = ['#a3e635', '#f472b6', '#a78bfa', '#fde047', '#fafafa'];
    for (let i = 0; i < 180; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20 - Math.random() * confettiCanvas.height * 0.5,
            w: 6 + Math.random() * 8,
            h: 8 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 3,
            vy: 2 + Math.random() * 3.5,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.25
        });
    }
    if (!confettiRunning) {
        confettiRunning = true;
        requestAnimationFrame(confettiTick);
    }
}

function confettiTick() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter((p) => p.y < confettiCanvas.height + 40);
    confettiPieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.rot);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
    });
    if (confettiPieces.length) {
        requestAnimationFrame(confettiTick);
    } else {
        confettiRunning = false;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function showSuccessScreen(order, paymentId) {
    $('#success-order-id').textContent = String(order.id || '').toUpperCase();
    $('#success-payment-id').textContent = paymentId || '—';
    $('#success-overlay').classList.remove('hidden');
    $('#success-overlay').classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        $('#success-check').classList.remove('scale-0');
    }, 120);
    setTimeout(burstConfetti, 250);
}

window.addEventListener('resize', resizeConfetti);
resizeConfetti();

$('#cart-btn').addEventListener('click', openCartDrawer);
$('#drawer-close').addEventListener('click', closeCartDrawer);
$$('[data-close-cart]').forEach((el) => el.addEventListener('click', closeCartDrawer));
$('#modal-close').addEventListener('click', closeProductModal);
$$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeProductModal));
$('#qty-plus').addEventListener('click', () => {
    modalQty = Math.min(modalQty + 1, 99);
    renderQty();
});
$('#qty-minus').addEventListener('click', () => {
    modalQty = Math.max(modalQty - 1, 1);
    renderQty();
});
$('#add-to-cart-btn').addEventListener('click', () => {
    if (!modalProduct) return;
    if (modalProduct.stock <= 0) {
        toast('That one is gone, my guy.', 'error');
        return;
    }
    if (!modalSize) {
        $('#modal-size-hint').textContent = 'You have to pick a size, obviously.';
        requestAnimationFrame(() => $('#modal-size-hint').classList.add('text-amber-300'));
        return;
    }
    Cart.add(modalProduct, modalSize, modalQty);
    toast(`${modalProduct.name} (${SIZE_LABEL[modalSize] || modalSize.toUpperCase()}) added`, 'success');
    boostCount();
});

$('#clear-cart-btn').addEventListener('click', () => {
    Cart.clear();
    toast('Cart cleared. Pristine. Empty. Sad.', 'info');
});

$('#checkout-btn').addEventListener('click', () => {
    if (Cart.isEmpty()) {
        toast('Nothing to check out yet, champ.', 'error');
        return;
    }
    window.Checkout.open();
});

window.addEventListener('cartchange', () => {
    updateCartUI();
    if (!$('#cart-drawer').classList.contains('hidden')) {
        renderCartItems();
    }
});

updateCartUI();
fetchProducts();