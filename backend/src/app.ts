import express from 'express';
import cors from 'cors';
import {
    addToCart,
    checkout,
    generateDiscountCode,
    getAdminStats,
    getCart,
    getProducts
} from './controllers.ts';

const app = express();

app.use(cors());
app.use(express.json());

// Public & User APIs
app.get('/api/products', getProducts);
app.get('/api/cart/:userId', getCart);
app.post('/api/cart/add', addToCart);
app.post('/api/checkout', checkout);

// Admin APIs
app.post('/api/admin/generate-code', generateDiscountCode);
app.get('/api/admin/stats', getAdminStats);

export default app;
