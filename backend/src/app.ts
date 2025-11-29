import express from 'express';
import cors from 'cors';
import { getProducts } from './controllers.ts';


const app = express();

app.use(cors());
app.use(express.json());


// Public & User APIs
app.get('/api/products', getProducts);

export default app;
