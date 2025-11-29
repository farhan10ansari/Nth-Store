export interface Product {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product?: Product; // enriched
}

export interface DiscountCode {
    code: string;
    isUsed: boolean;
}

export interface AdminStats {
    totalItemsPurchased: number;
    totalPurchaseAmount: number;
    discountCodes: DiscountCode[];
    totalDiscountAmount: number;
    orderCount: number;
}
