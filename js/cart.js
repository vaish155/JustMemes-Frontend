const CART_KEY = 'jm_cart_v1';

window.Cart = (() => {
    let items = load();

    function load() {
        try {
            const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
            return Array.isArray(raw) ? raw : [];
        } catch {
            return [];
        }
    }

    function save() {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        emit();
    }

    function emit() {
        window.dispatchEvent(new CustomEvent('cartchange', {
            detail: { count: count(), subtotal: subtotal(), items: [...items] }
        }));
    }

    function count() {
        return items.reduce((n, i) => n + i.qty, 0);
    }

    function subtotal() {
        return items.reduce((n, i) => n + i.price * i.qty, 0);
    }

    function list() {
        return [...items];
    }

    function find(productId, size) {
        return items.find((i) => i.productId === productId && i.size === size);
    }

    function add(product, size, qty) {
        const existing = find(product.id, size);
        if (existing) {
            existing.qty = Math.min(existing.qty + qty, 99);
        } else {
            items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.imageUrl,
                stock: product.stock,
                size,
                qty
            });
        }
        save();
    }

    function setQty(productId, size, qty) {
        const item = find(productId, size);
        if (!item) return;
        if (qty <= 0) {
            remove(productId, size);
            return;
        }
        item.qty = Math.min(qty, 99);
        save();
    }

    function changeSize(productId, fromSize, toSize) {
        const item = find(productId, fromSize);
        if (!item) return;
        const existing = find(productId, toSize);
        if (existing) {
            existing.qty = Math.min(existing.qty + item.qty, 99);
            remove(productId, fromSize);
            save();
        } else {
            item.size = toSize;
            save();
        }
    }

    function remove(productId, size) {
        items = items.filter((i) => !(i.productId === productId && i.size === size));
        save();
    }

    function clear() {
        items = [];
        save();
    }

    function isEmpty() {
        return items.length === 0;
    }

    emit();

    return { list, count, subtotal, add, setQty, changeSize, remove, clear, isEmpty };
})();