export interface Product {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    totalAmount: number;
    discountApplied: number; // amount deducted
    timestamp: Date;
}

export interface DiscountCode {
    code: string;
    isUsed: boolean;
}

export interface StoreData {
    products: Product[];
    carts: Record<string, CartItem[]>; // userId -> items
    orders: Order[];
    discountCodes: DiscountCode[];
    nthOrderConfig: number; // The 'n' in nth order
}
