import { store } from '../store.ts';

describe('Store Logic', () => {
    beforeEach(() => {
        // Clear memory before every test
        store.reset(); 
    });

    test('should initialize with default products', () => {
        const products = store.getProducts();
        expect(products.length).toBeGreaterThan(0);
        expect(products[0]).toHaveProperty('price');
    });

    test('should add items to cart correctly', () => {
        const userId = 'user123';
        const productId = 'p1';
        
        store.addToCart(userId, productId, 2);
        const cart = store.getCart(userId);
        
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);
    });

    test('should validate discount code usage', () => {
        const code = 'TEST_CODE';
        store.addDiscountCode(code);

        // First usage should be valid
        expect(store.validateCode(code)).toBe(true);

        // Mark used
        store.markCodeUsed(code);

        // Second usage should be invalid
        expect(store.validateCode(code)).toBe(false);
    });

    test('should track orders for Nth config', () => {
        // Nth config is default 3
        expect(store.getOrderCount()).toBe(0);
        
        store.createOrder({ id: '1', totalAmount: 100 } as any);
        expect(store.getOrderCount()).toBe(1);
    });
});
