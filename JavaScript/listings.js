/**
 * listings.js — Category page UI (listings.html)
 * Renders products from Catalog, handles sort, grid/list toggle, add-to-cart,
 * and keeps ?category= in the URL via history.replaceState.
 */
document.addEventListener("DOMContentLoaded", () => {
    const gridBtn = document.getElementById("gridViewBtn");
    const listBtn = document.getElementById("listViewBtn");
    const productList = document.getElementById("productList");
    const resultsCountEl = document.getElementById("resultsCountLabel");
    const sortSelect = document.getElementById("listingSort");
    const categoryItems = document.querySelectorAll("#categoryFilterList .filter-list-item[data-category]");

    const allowedCategories = new Set([
        "mobile-accessories",
        "chargers",
        "covers",
        "earphones",
        "power-banks",
        "headphones",
        "electronics",
    ]);


    function getInitialCategory() {
        const params = new URLSearchParams(window.location.search);
        const raw = (params.get("category") || "mobile-accessories").toLowerCase();
        return allowedCategories.has(raw) ? raw : "mobile-accessories";
    }

    let activeCategory = getInitialCategory();


    function setUrlCategory(key) {
        const url = new URL(window.location.href);
        url.searchParams.set("category", key);
        history.replaceState({}, "", url);
    }


    function updateCategoryActiveState() {
        categoryItems.forEach((el) => {
            const key = el.getAttribute("data-category");
            el.classList.toggle("active-cat", key === activeCategory);
        });
    }


    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }


    function renderListings() {
        if (!productList || !window.Catalog) return;

        let products = window.Catalog.getProductsForCategoryKey(activeCategory);
        const sortKey = sortSelect?.value || "featured";
        if (sortKey !== "featured") {
            products = window.Catalog.sortProducts(products, sortKey);
        }

        const label =
            window.Catalog.CATEGORY_LABELS[activeCategory] ||
            activeCategory.replace(/-/g, " ");

        if (resultsCountEl) {
            resultsCountEl.innerHTML = `${products.length} items in <strong>${escapeHtml(
                label
            )}</strong>`;
        }

        const crumbMid = document.getElementById("listingBreadcrumbMid");
        const crumbCur = document.getElementById("listingBreadcrumbCurrent");
        if (crumbMid && crumbCur) {
            if (activeCategory === "electronics") {
                crumbMid.textContent = "Electronics";
                crumbMid.setAttribute("href", "listings.html?category=electronics");
                crumbCur.textContent = "All electronics";
            } else if (activeCategory === "mobile-accessories") {
                crumbMid.textContent = "Mobile accessories";
                crumbMid.setAttribute("href", "listings.html?category=mobile-accessories");
                crumbCur.textContent = "All items";
            } else {
                crumbMid.textContent = "Mobile accessories";
                crumbMid.setAttribute("href", "listings.html?category=mobile-accessories");
                crumbCur.textContent = label;
            }
        }

        productList.innerHTML = products
            .map(
                (p) => `
            <article class="listing-card">
                <button type="button" class="wishlist-btn" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
                <a class="listing-img-wrap" href="product.html?id=${encodeURIComponent(p.id)}">
                    <img src="${escapeHtml(p.image)}" alt="">
                </a>
                <div class="listing-info">
                    <a class="listing-title" href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(
                        p.title
                    )}</a>
                    <div class="listing-pricing">
                        <span class="listing-price">$${Number(p.price).toFixed(2)}</span>
                        ${
                            p.oldPrice
                                ? `<span class="listing-old-price">$${Number(p.oldPrice).toFixed(2)}</span>`
                                : ""
                        }
                    </div>
                    <div class="listing-meta">
                        <span class="listing-stars" aria-hidden="true">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i>
                        </span>
                        <span class="rating-count">7.5</span>
                        <span class="listing-orders">· 154 orders</span>
                        <span class="listing-shipping free">Free shipping</span>
                    </div>
                    <p class="listing-desc">${escapeHtml(p.desc)}</p>
                    <a class="view-details" href="product.html?id=${encodeURIComponent(p.id)}">View details</a>
                    <div class="listing-actions">
                        <button type="button" class="listing-add-cart" data-add-cart="${escapeHtml(p.id)}">Add to cart</button>
                    </div>
                </div>
            </article>
        `
            )
            .join("");

        productList.querySelectorAll("[data-add-cart]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const id = btn.getAttribute("data-add-cart");
                const prod = products.find((x) => x.id === id);
                if (!prod || !window.Cart) return;
                window.Cart.addItem({
                    id: prod.id,
                    title: prod.title,
                    price: prod.price,
                    image: prod.image,
                    seller: prod.seller || "",
                    desc: prod.desc || "",
                });
                const t = btn.textContent;
                btn.textContent = "Added ✓";
                setTimeout(() => {
                    btn.textContent = t;
                }, 1200);
            });
        });
    }

    categoryItems.forEach((el) => {
        el.addEventListener("click", () => {
            const key = el.getAttribute("data-category");
            if (!key || !allowedCategories.has(key)) return;
            activeCategory = key;
            setUrlCategory(key);
            updateCategoryActiveState();
            renderListings();
        });
    });

    updateCategoryActiveState();

    if (sortSelect) {
        sortSelect.addEventListener("change", renderListings);
    }

    if (gridBtn && listBtn && productList) {
        gridBtn.addEventListener("click", () => {
            productList.classList.add("list-view");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
        });
        listBtn.addEventListener("click", () => {
            productList.classList.remove("list-view");
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
        });

        /* HTML default: grid button active — .list-view in CSS = 3-column grid */
        if (gridBtn.classList.contains("active")) {
            productList.classList.add("list-view");
        }
    }

    renderListings();
});
