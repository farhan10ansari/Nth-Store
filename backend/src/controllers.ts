import { type Request, type Response } from 'express';
import { store } from './store.ts';

export const getProducts = (req: Request, res: Response) => {
    res.json(store.getProducts());
};
