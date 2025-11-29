import { type StoreData, type Product } from './types.ts';

// Initial Mock Data
const initialProducts: Product[] = [
    { id: 'p1', name: 'Mechanical Keyboard', price: 150 },
    { id: 'p2', name: 'Gaming Mouse', price: 80 },
    { id: 'p3', name: 'Monitor 4K', price: 400 },
    { id: 'p4', name: 'USB-C Hub', price: 45 },
];

class InMemoryStore {
    private data: StoreData;

    constructor() {
        this.data = {
            products: initialProducts,
            carts: {},
            orders: [],
            discountCodes: [],
            nthOrderConfig: 3, // Every 3rd order gets a discount for demo purposes
        };
    }

    getProducts() {
        return this.data.products;
    }

    getProduct(id: string) {
        return this.data.products.find((p) => p.id === id);
    }

    getCart(userId: string) {
        return this.data.carts[userId] || [];
    }

    addToCart(userId: string, productId: string, quantity: number = 1) {
        if (!this.data.carts[userId]) {
            this.data.carts[userId] = [];
        }

        const cart = this.data.carts[userId];
        const existingItem = cart.find((item) => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
    }

    clearCart(userId: string) {
        delete this.data.carts[userId];
    }

    createOrder(order: any) { // Using 'any' briefly for pure data object push
        this.data.orders.push(order);
    }

    getOrders() {
        return this.data.orders;
    }

    getOrderCount() {
        return this.data.orders.length;
    }

    // Discount Logic
    addDiscountCode(code: string) {
        this.data.discountCodes.push({ code, isUsed: false });
    }

    validateCode(code: string): boolean {
        const found = this.data.discountCodes.find((d) => d.code === code && !d.isUsed);
        return !!found;
    }

    markCodeUsed(code: string) {
        const found = this.data.discountCodes.find((d) => d.code === code);
        if (found) found.isUsed = true;
    }

    getDiscountCodes() {
        return this.data.discountCodes;
    }

    getNthConfig() {
        return this.data.nthOrderConfig;
    }

    // Reset Store (for testing purposes)
    reset() {
        this.data = {
            products: initialProducts,
            carts: {},
            orders: [],
            discountCodes: [],
            nthOrderConfig: 3, 
        };
    }

}

export const store = new InMemoryStore();
