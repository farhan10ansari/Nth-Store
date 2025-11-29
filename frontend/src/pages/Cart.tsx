import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Tag } from 'lucide-react';
import { api } from '../api';
import { type CartItem } from '../types';

const CURRENT_USER_ID = "user_123";

export const Cart: React.FC = () => {
    const queryClient = useQueryClient();
    const [discountCode, setDiscountCode] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const { data: cartItems, isLoading } = useQuery<CartItem[]>({
        queryKey: ['cart', CURRENT_USER_ID],
        queryFn: () => api.getCart(CURRENT_USER_ID)
    });

    const handleCheckout = async () => {
        setErrorMsg("");
        setIsCheckingOut(true);
        try {
            const res = await api.checkout(CURRENT_USER_ID, discountCode);
            alert(`🎉 Order successfully placed!\nTotal Paid: $${res.data.order.totalAmount}`);
            setDiscountCode("");
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || "Checkout failed");
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Calculate subtotal safely
    const subtotal = cartItems?.reduce((acc, item) => {
        return acc + (item.product ? item.product.price * item.quantity : 0);
    }, 0) || 0;

    const total = subtotal;

    if (isLoading) return <div>Loading...</div>;

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart ({cartItems.length})</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <li key={item.productId} className="p-6 flex items-center gap-6">
                                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                    📦
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg">{item.product?.name}</h3>
                                    <p className="text-sm text-gray-500">Unit Price: ${item.product?.price}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-md">
                                        Qty: {item.quantity}
                                    </div>
                                    <span className="font-bold text-lg text-gray-900">
                                        ${(item.product?.price || 0) * item.quantity}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Discount Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="block w-full pl-10 p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                />
                            </div>
                            {errorMsg && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow"
                        >
                            {isCheckingOut ? 'Processing...' : (
                                <>
                                    <CreditCard className="w-4 h-4" />
                                    Checkout Now
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
