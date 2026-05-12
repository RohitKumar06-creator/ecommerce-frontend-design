/**
 * cart.js — Shopping cart + “saved for later” in localStorage (demo only).
 * Dispatches window event "cartupdated" after writes so site.js can refresh badges.
 */
(function () {
    const CART_KEY = "brand_ecom_cart_v1";
    const SAVED_KEY = "brand_ecom_saved_v1";


    function read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function write(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
        document.dispatchEvent(new CustomEvent("cartupdated", { detail: { key } }));
    }


    window.Cart = {
        getItems() {
            return read(CART_KEY, []);
        },


        setItems(items) {
            write(CART_KEY, items);
        },


        addItem(line) {
            const items = this.getItems();
            const addQty = Math.max(1, parseInt(line.qty, 10) || 1);
            const idx = items.findIndex((x) => x.id === line.id);
            if (idx >= 0) {
                items[idx].qty = (items[idx].qty || 1) + addQty;
            } else {
                items.push({
                    id: line.id,
                    title: line.title,
                    price: Number(line.price),
                    image: line.image || "",
                    seller: line.seller || "",
                    desc: line.desc || "",
                    qty: addQty,
                });
            }
            this.setItems(items);
        },

        removeItem(id) {
            this.setItems(this.getItems().filter((x) => x.id !== id));
        },


        updateQty(id, qty) {
            const q = Math.max(1, parseInt(qty, 10) || 1);
            this.setItems(
                this.getItems().map((x) => (x.id === id ? { ...x, qty: q } : x))
            );
        },


        clear() {
            write(CART_KEY, []);
        },


        getSaved() {
            return read(SAVED_KEY, []);
        },


        setSaved(items) {
            write(SAVED_KEY, items);
        },


        addSaved(item) {
            const s = this.getSaved();
            if (!s.find((x) => x.id === item.id)) {
                s.push({
                    id: item.id,
                    title: item.title,
                    price: Number(item.price),
                    image: item.image || "",
                });
            }
            this.setSaved(s);
        },


        removeSaved(id) {
            this.setSaved(this.getSaved().filter((x) => x.id !== id));
        },


        moveSavedToCart(id) {
            const item = this.getSaved().find((x) => x.id === id);
            if (!item) return;
            this.addItem({ ...item, qty: 1 });
            this.removeSaved(id);
        },


        lineTotal(line) {
            return (Number(line.price) || 0) * (line.qty || 1);
        },


        subtotal(items) {
            return items.reduce((sum, line) => sum + this.lineTotal(line), 0);
        },
    };
})();
