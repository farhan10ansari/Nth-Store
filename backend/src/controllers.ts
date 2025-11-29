import { type Request, type Response } from 'express';
import { store } from './store.ts';
import { v4 as uuidv4 } from 'uuid';

export const getProducts = (req: Request, res: Response) => {
    res.json(store.getProducts());
};



export const getCart = (req: Request, res: Response) => {
    const { userId } = req.params;
    const items = store.getCart(userId);

    // add product details for frontend
    const enrichedCart = items.map(item => {
        const product = store.getProduct(item.productId);
        return { ...item, product };
    });

    res.json(enrichedCart);
};


export const addToCart = (req: Request, res: Response) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).send("Missing data");

    store.addToCart(userId, productId);
    res.json({ success: true, message: "Added to cart" });
};


export const checkout = (req: Request, res: Response) => {
    const { userId, discountCode } = req.body;
    const cartItems = store.getCart(userId);

    if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate Total
    let rawTotal = 0;
    cartItems.forEach(item => {
        const p = store.getProduct(item.productId);
        if (p) rawTotal += p.price * item.quantity;
    });

    // Validate Discount
    let discountAmount = 0;
    if (discountCode) {
        const isValid = store.validateCode(discountCode);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid or used discount code" });
        }
        discountAmount = rawTotal * 0.10; // 10%
        store.markCodeUsed(discountCode);
    }

    // Create Order
    const finalTotal = rawTotal - discountAmount;
    const newOrder = {
        id: uuidv4(),
        items: [...cartItems],
        totalAmount: finalTotal,
        discountApplied: discountAmount,
        timestamp: new Date()
    };

    store.createOrder(newOrder);
    store.clearCart(userId);

    res.json({ success: true, order: newOrder });
};