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

 
}

export const store = new InMemoryStore();
