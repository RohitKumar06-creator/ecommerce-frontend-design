/**
 * site.js — Shared behavior on every page
 * - Syncs header cart badge with localStorage (same key as cart.js)
 * - Blocks empty search submits
 * - Home page: makes promo/product cards navigate to product.html
 */

/** Same key as cart.js — badge works even if cart.js is not loaded. */
const CART_STORAGE_KEY = "brand_ecom_cart_v1";


function getCartItemCount() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const items = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(items)) return 0;
        return items.reduce((sum, x) => {
            const q = parseInt(x.qty, 10);
            return sum + (Number.isFinite(q) && q > 0 ? q : 1);
        }, 0);
    } catch {
        return 0;
    }
}


function refreshNavCartBadge() {
    const n = getCartItemCount();
    document.querySelectorAll("[data-nav-cart-link]").forEach((link) => {
        const badge = link.querySelector("[data-cart-badge]");
        link.setAttribute(
            "aria-label",
            n === 0 ? "Shopping cart, empty" : `Shopping cart, ${n} item${n === 1 ? "" : "s"}`
        );
        if (!badge) return;
        if (n > 0) {
            badge.textContent = n > 99 ? "99+" : String(n);
            badge.removeAttribute("hidden");
        } else {
            badge.textContent = "0";
            badge.setAttribute("hidden", "");
        }
    });
}


document.addEventListener("cartupdated", refreshNavCartBadge);


document.addEventListener("DOMContentLoaded", () => {
    refreshNavCartBadge();

    document.querySelectorAll(".search-bar").forEach((form) => {
        form.addEventListener("submit", (event) => {
            const input = form.querySelector("input[type='text']");
            const value = input?.value?.trim() ?? "";
            if (!value) {
                event.preventDefault();
                if (input) {
                    input.focus();
                }
            }
        });
    });

    const path = window.location.pathname.toLowerCase();
    const isHome = path.endsWith("/index.html") || path.endsWith("/") || path === "";
    if (isHome) {
        document.querySelectorAll(".deal-card, .home-card, .elec-card, .product-card").forEach((card) => {
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                window.location.href = "product.html";
            });
        });
    }
});
