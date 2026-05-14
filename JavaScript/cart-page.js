/**
 * cart-page.js — shopping-cart.html only
 * Renders cart lines + saved grid, demo discount/tax math, checkout navigation.
 */
document.addEventListener("DOMContentLoaded", () => {
    const cartRoot = document.getElementById("cartItemsRoot");
    const savedRoot = document.getElementById("savedItemsRoot");
    const titleEl = document.getElementById("cartPageTitle");
    const subtotalEl = document.getElementById("cartSubtotal");
    const discountEl = document.getElementById("cartDiscount");
    const taxEl = document.getElementById("cartTax");
    const totalEl = document.getElementById("cartTotal");
    const removeAllBtn = document.getElementById("cartRemoveAll");
    const backBtn = document.getElementById("cartBackToShop");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");

    const LISTINGS_URL = "listings.html?category=mobile-accessories";


    function formatMoney(n) {
        return `$${Number(n).toFixed(2)}`;
    }


    function renderCart() {
        if (!cartRoot) return;
        const items = window.Cart.getItems();

        if (titleEl) {
            titleEl.textContent = `My cart (${items.length})`;
        }

        if (items.length === 0) {
            cartRoot.innerHTML =
                '<p class="cart-empty-msg">Your cart is empty. <a href="' +
                LISTINGS_URL +
                '">Browse products</a>.</p>';
        } else {
            cartRoot.innerHTML = items
                .map(
                    (line) => `
                <div class="cart-item" data-cart-id="${line.id}">
                    <div class="item-left">
                        <img src="${line.image}" alt="">
                        <div class="item-info">
                            <h3>${escapeHtml(line.title)}</h3>
                            <p>${line.seller ? escapeHtml(line.seller) : "Seller: —"}</p>
                            <div class="buttons">
                                <button type="button" class="btn-small remove" data-remove="${line.id}">Remove</button>
                                <button type="button" class="btn-small save" data-save="${line.id}">Save for later</button>
                            </div>
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="price">${formatMoney(line.price)}</div>
                        <label class="qty-label">Qty
                            <select class="cart-qty-select" data-id="${line.id}">
                                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                    .map(
                                        (q) =>
                                            `<option value="${q}"${q === (line.qty || 1) ? " selected" : ""}>${q}</option>`
                                    )
                                    .join("")}
                            </select>
                        </label>
                    </div>
                </div>`
                )
                .join("");
        }

        const subtotal = window.Cart.subtotal(items);
        const discount = items.length ? 60 : 0;
        const tax = Math.max(0, (subtotal - discount) * 0.08);
        const total = Math.max(0, subtotal - discount + tax);

        if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
        if (discountEl) discountEl.textContent = items.length ? `- ${formatMoney(discount)}` : formatMoney(0);
        if (taxEl) taxEl.textContent = items.length ? `+ ${formatMoney(tax)}` : formatMoney(0);
        if (totalEl) totalEl.textContent = formatMoney(total);

        cartRoot.querySelectorAll("[data-remove]").forEach((btn) => {
            btn.addEventListener("click", () => {
                window.Cart.removeItem(btn.getAttribute("data-remove"));
                renderCart();
                renderSaved();
            });
        });

        cartRoot.querySelectorAll("[data-save]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-save");
                const line = items.find((x) => x.id === id);
                if (line) {
                    window.Cart.addSaved({
                        id: line.id,
                        title: line.title,
                        price: line.price,
                        image: line.image,
                    });
                    window.Cart.removeItem(id);
                    renderCart();
                    renderSaved();
                }
            });
        });

        cartRoot.querySelectorAll(".cart-qty-select").forEach((sel) => {
            sel.addEventListener("change", () => {
                window.Cart.updateQty(sel.getAttribute("data-id"), sel.value);
                renderCart();
            });
        });
    }


    function renderSaved() {
        if (!savedRoot) return;
        const saved = window.Cart.getSaved();
        if (saved.length === 0) {
            savedRoot.innerHTML = '<p class="cart-empty-msg">No saved items yet.</p>';
            return;
        }
        savedRoot.innerHTML = saved
            .map(
                (item) => `
            <div class="saved-item" data-saved-id="${item.id}">
                <img src="${item.image}" alt="">
                <div class="saved-price">${formatMoney(item.price)}</div>
                <div class="saved-name">${escapeHtml(item.title)}</div>
                <button type="button" class="move-btn" data-move="${item.id}">Move to cart</button>
            </div>`
            )
            .join("");

        savedRoot.querySelectorAll("[data-move]").forEach((btn) => {
            btn.addEventListener("click", () => {
                window.Cart.moveSavedToCart(btn.getAttribute("data-move"));
                renderCart();
                renderSaved();
            });
        });
    }


    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }


    if (removeAllBtn) {
        removeAllBtn.addEventListener("click", () => {
            window.Cart.clear();
            renderCart();
        });
    }


    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = LISTINGS_URL;
        });
        backBtn.removeAttribute("onclick");
    }


    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const items = window.Cart.getItems();
            if (!items.length) {
                window.location.href = LISTINGS_URL;
                return;
            }
            window.location.href = "checkout.html";
        });
    }


    renderCart();
    renderSaved();

    document.addEventListener("cartupdated", () => {
        renderCart();
        renderSaved();
    });
});
