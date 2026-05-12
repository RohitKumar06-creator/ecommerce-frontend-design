/**
 * product-page.js — Fills product.html from ?id= and wires “Add to cart”.
 * Falls back to demo id when param missing (see catalog.js DETAIL_ONLY).
 */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "prod-shirt";
    const product = window.Catalog && window.Catalog.getProductById(id);

    const titleEl = document.getElementById("productPageTitle");
    const imgEl = document.getElementById("productMainImage");
    const thumbRow = document.querySelector(".thumbnails");
    const addBtn = document.getElementById("productAddToCartBtn");

    if (product) {
        if (titleEl) titleEl.textContent = product.title;
        if (imgEl) {
            imgEl.src = product.image;
            imgEl.alt = product.title;
        }
        if (thumbRow) {
            const firstThumb = thumbRow.querySelector(".thumb img");
            if (firstThumb) {
                firstThumb.src = product.image;
                firstThumb.alt = product.title;
            }
        }
        const priceBoxes = document.querySelectorAll(".price-box .price h2");
        if (priceBoxes.length && product.price) {
            priceBoxes[0].textContent = `$${Number(product.price).toFixed(2)}`;
        }
    }

    if (addBtn && window.Cart && product) {
        addBtn.addEventListener("click", () => {
            window.Cart.addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                seller: product.seller || "",
            });
            const t = addBtn.textContent;
            addBtn.textContent = "Added to cart ✓";
            setTimeout(() => {
                addBtn.textContent = t;
            }, 1400);
        });
    }
});
