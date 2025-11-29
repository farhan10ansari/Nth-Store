import request from 'supertest';
import app from '../app.ts';
import { store } from '../store.ts';

describe('E-Commerce API', () => {
    beforeEach(() => {
        store.reset();
    });

    describe('GET /api/products', () => {
        it('should return a list of products', async () => {
            const res = await request(app).get('/api/products');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(4); // Based on initialProducts
        });
    });

    describe('Cart Operations', () => {
        it('should add an item to the cart', async () => {
            const res = await request(app)
                .post('/api/cart/add')
                .send({ userId: 'u1', productId: 'p1' });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            // Verify persistence
            const cartRes = await request(app).get('/api/cart/u1');
            expect(cartRes.body[0].productId).toBe('p1');
            expect(cartRes.body[0].product.name).toBe('Mechanical Keyboard'); // Enriched data
        });
    });

    describe('Checkout & Discount Logic', () => {
        it('should complete checkout successfully without discount', async () => {
            // 1. Add to cart
            await request(app).post('/api/cart/add').send({ userId: 'u1', productId: 'p1' }); // $150

            // 2. Checkout
            const res = await request(app)
                .post('/api/checkout')
                .send({ userId: 'u1' });

            expect(res.status).toBe(200);
            expect(res.body.order.totalAmount).toBe(150);
            expect(res.body.order.discountApplied).toBe(0);
        });

        it('should fail invalid discount code', async () => {
            await request(app).post('/api/cart/add').send({ userId: 'u1', productId: 'p1' });

            const res = await request(app)
                .post('/api/checkout')
                .send({ userId: 'u1', discountCode: 'FAKE_CODE' });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Invalid/);
        });
    });

    describe('Admin Nth Order Logic', () => {
        it('should only generate code when Nth order condition is met', async () => {
            // N = 3. 
            // Current Orders: 0. Next Order: 1. (1 % 3 != 0) -> Fail
            let res = await request(app).post('/api/admin/generate-code');
            expect(res.body.created).toBe(false);

            // Create 2 dummy orders to bump count to 2
            store.createOrder({ id: 'o1', items: [], totalAmount: 50, discountApplied: 0, timestamp: new Date() });
            store.createOrder({ id: 'o2', items: [], totalAmount: 50, discountApplied: 0, timestamp: new Date() });

            // Current Orders: 2. Next Order: 3. (3 % 3 == 0) -> Success
            res = await request(app).post('/api/admin/generate-code');
            expect(res.body.created).toBe(true);
            expect(res.body.code).toBeDefined();
        });
    });
});
