/**
 * catalog.js — In-memory product data + category helpers
 * Used by listings.js (grid) and product-page.js (?id=).
 * Categories use URL slugs; "mobile-accessories" aggregates charger/cover/etc. SKUs.
 */
(function () {
    /* Rows shown on listings / product detail when id matches */
    const PRODUCTS = [
        {
            id: "ma-ch-1",
            title: "USB-C Wall Charger 20W",
            price: 19.99,
            oldPrice: 24.99,
            image: "https://discountstore.pk/cdn/shop/files/Belkin-BoostCharge-Pro-45W-Dual-USB-C-Wall-Charger_533x.webp?v=1753884615",
            category: "chargers",
            parentCategory: "mobile-accessories",
            seller: "TechSupply Co.",
            desc: "Fast charging brick for phones and tablets. Compact travel design.",
        },
        {
            id: "ma-ch-2",
            title: "Dual USB Car Charger",
            price: 14.5,
            image: "https://cubeonline.pk/cdn/shop/files/01-600x600_2d673e7a-cc07-4126-b963-f20b1eafa5be_grande.png?v=1723803188",
            category: "chargers",
            parentCategory: "mobile-accessories",
            seller: "AutoGadgets",
            desc: "Charge two devices on the road. Built-in surge protection.",
        },
        {
            id: "ma-cv-1",
            title: "Clear Silicone Phone Case",
            price: 12.99,
            image: "https://icase.pk/cdn/shop/files/Hbe2e4025124b46ef824e8a4c561d79fci.jpg_960x960_c1cb54b4-f37e-4a37-8f4f-29c4d0fcfaa2.jpg?v=1696699847",
            category: "covers",
            parentCategory: "mobile-accessories",
            seller: "CoverLab",
            desc: "Shock-absorbing corners with crystal clear back.",
        },
        {
            id: "ma-cv-2",
            title: "Leather Wallet Flip Cover",
            price: 24.0,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzEWhkQnBBZTlCOercuTm6S7iTspbQVDid-g&s",
            category: "covers",
            parentCategory: "mobile-accessories",
            seller: "CoverLab",
            desc: "Card slots and stand function. Premium PU leather finish.",
        },
        {
            id: "ma-ear-1",
            title: "Wired Earphones with Mic",
            price: 18.99,
            image: "https://static3.webx.pk/files/68529/Images/71puic-4ndl.-ac-sl1500--68529-0-010324061957887.jpg",
            category: "earphones",
            parentCategory: "mobile-accessories",
            seller: "SoundMini",
            desc: "In-ear buds with inline remote. Crisp vocals for calls and music.",
        },
        {
            id: "ma-ear-2",
            title: "Bluetooth Neckband Earphones",
            price: 39.99,
            oldPrice: 49.99,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwQhGzxjytNmynSn9kkvKhS00r1B1edC-vA&s",
            category: "earphones",
            parentCategory: "mobile-accessories",
            seller: "SoundMini",
            desc: "Magnetic earbuds, 12h playback, splash resistant.",
        },
        {
            id: "ma-pb-1",
            title: "10000mAh Slim Power Bank",
            price: 29.99,
            image: "https://www.laptab.com.pk/theme/mobile/202092/6.jpg",
            category: "power-banks",
            parentCategory: "mobile-accessories",
            seller: "PowerCell",
            desc: "USB-A and USB-C out. Pocket-friendly metal shell.",
        },
        {
            id: "ma-pb-2",
            title: "20000mAh Fast Charge Power Bank",
            price: 45.0,
            image: "https://cdn.shopify.com/s/files/1/0550/5771/1164/files/first_post_SML-01_1400x1400.jpg",
            category: "power-banks",
            parentCategory: "mobile-accessories",
            seller: "PowerCell",
            desc: "45W PD for laptops and phones. LED charge indicator.",
        },
        {
            id: "ma-hp-1",
            title: "Over-Ear Wireless Headphones",
            price: 79.99,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiEUkArbeS-OhaVkqZRAIjWZX88n56VDB97A&s",
            category: "headphones",
            parentCategory: "mobile-accessories",
            seller: "AudioOne",
            desc: "Active noise reduction, 30h battery, plush ear cushions.",
        },
        {
            id: "ma-hp-2",
            title: "Gaming Headset with Boom Mic",
            price: 64.5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRalOAzQl4D7SJjCbeu-1jMUsD74c1ZzNSQtQ&s",
            category: "headphones",
            parentCategory: "mobile-accessories",
            seller: "AudioOne",
            desc: "Over-ear cups, detachable boom mic, and padded headband for long sessions.",
        },
        {
            id: "el-1",
            title: "4K Action Camera Kit",
            price: 998.0,
            oldPrice: 1128.0,
            image: "./assets/Image/tech/6.png",
            category: "cameras",
            parentCategory: "electronics",
            seller: "ProCam Ltd",
            desc: "Waterproof housing and dual batteries included.",
        },
        {
            id: "el-2",
            title: "Smart Watch Pro",
            price: 199.0,
            image: "./assets/Image/tech/8.png",
            category: "wearables",
            parentCategory: "electronics",
            seller: "WearTech",
            desc: "Heart rate, GPS, and week-long battery.",
        },
    ];


    /* SKUs that exist for product.html but not in the main listings array */
    const DETAIL_ONLY = {
        "prod-shirt": {
            id: "prod-shirt",
            title: "Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle",
            price: 98.0,
            image: "./assets/Layout/alibaba/Image/cloth/1.png",
            category: "clothing",
            parentCategory: "clothing",
            seller: "Guanjoi Trading LLC",
            desc: "Cotton blend base layer. Slim fit for everyday wear.",
        },
    };


    const CATEGORY_LABELS = {
        "mobile-accessories": "Mobile accessories",
        chargers: "Chargers",
        covers: "Phone covers",
        earphones: "Earphones",
        "power-banks": "Power banks",
        headphones: "Headphones",
        electronics: "Electronics",
    };


    const MOBILE_SLUGS = new Set(["chargers", "covers", "earphones", "power-banks", "headphones"]);


    function getProductsForCategoryKey(key) {
        if (!key || key === "mobile-accessories") {
            return PRODUCTS.filter((p) => p.parentCategory === "mobile-accessories");
        }
        if (MOBILE_SLUGS.has(key)) {
            return PRODUCTS.filter((p) => p.category === key);
        }
        if (key === "electronics") {
            return PRODUCTS.filter((p) => p.parentCategory === "electronics");
        }
        return PRODUCTS.slice();
    }


    function getProductById(id) {
        if (!id) return null;
        const fromList = PRODUCTS.find((p) => p.id === id);
        if (fromList) return { ...fromList };
        const detail = DETAIL_ONLY[id];
        return detail ? { ...detail } : null;
    }

    function sortProducts(list, sortKey) {
        const out = list.slice();
        if (sortKey === "price-asc") out.sort((a, b) => a.price - b.price);
        else if (sortKey === "price-desc") out.sort((a, b) => b.price - a.price);
        else if (sortKey === "name") out.sort((a, b) => a.title.localeCompare(b.title));
        return out;
    }


    window.Catalog = {
        PRODUCTS,
        CATEGORY_LABELS,
        getProductsForCategoryKey,
        getProductById,
        sortProducts,
    };
})();
