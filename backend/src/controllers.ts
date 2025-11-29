import { type Request, type Response } from 'express';
import { store } from './store.ts';

export const getProducts = (req: Request, res: Response) => {
    res.json(store.getProducts());
};


export const getCart = (req: Request, res: Response) => {
    const { userId } = req.params;
    const items = store.getCart(userId);


    res.json(items);
};

export const addToCart = (req: Request, res: Response) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).send("Missing data");

    store.addToCart(userId, productId);
    res.json({ success: true, message: "Added to cart" });
};
