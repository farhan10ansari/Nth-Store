import { type Request, type Response } from 'express';
import { store } from './store.ts';
import { v4 as uuidv4 } from 'uuid'; // Assume uuid is installed or use Math.random

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
        id: uuidv4(), // or Math.random().toString()
        items: [...cartItems],
        totalAmount: finalTotal,
        discountApplied: discountAmount,
        timestamp: new Date()
    };

    store.createOrder(newOrder);
    store.clearCart(userId);

    res.json({ success: true, order: newOrder });
};



// Admin Controllers

export const generateDiscountCode = (req: Request, res: Response) => {
    const totalOrders = store.getOrderCount();
    const n = store.getNthConfig();


    // We check if (totalOrders + 1) is divisible by n.
    const isEligible = (totalOrders + 1) % n === 0;

    if (isEligible) {
        const newCode = `DISCOUNT_${Math.random().toString(36).substring(7).toUpperCase()}`;
        store.addDiscountCode(newCode);
        return res.json({ created: true, code: newCode });
    }

    res.json({ created: false, message: "Condition not met for Nth order" });
};

export const getAdminStats = (req: Request, res: Response) => {
    const orders = store.getOrders();
    const codes = store.getDiscountCodes();

    const totalItemsPurchased = orders.reduce((acc, order) => {
        return acc + order.items.reduce((iAcc, item) => iAcc + item.quantity, 0);
    }, 0);

    const totalPurchaseAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalDiscountAmount = orders.reduce((acc, order) => acc + order.discountApplied, 0);

    res.json({
        totalItemsPurchased,
        totalPurchaseAmount,
        discountCodes: codes,
        totalDiscountAmount,
        orderCount: orders.length
    });
};
