import express from 'express';
import cors from 'cors';
import { addToCart, getCart, getProducts } from './controllers.ts';


const app = express();

app.use(cors());
app.use(express.json());


// Public & User APIs
app.get('/api/products', getProducts);
app.get('/api/cart/:userId', getCart);
app.post('/api/cart/add', addToCart);

export default app;
