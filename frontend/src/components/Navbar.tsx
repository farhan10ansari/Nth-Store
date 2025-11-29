import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const CURRENT_USER_ID = "user_123";

export const Navbar: React.FC = () => {
    const location = useLocation();

    // Fetch cart count for badge
    const { data: cartItems } = useQuery({
        queryKey: ['cart', CURRENT_USER_ID],
        queryFn: () => api.getCart(CURRENT_USER_ID),
    });

    const cartCount = cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

    const isActive = (path: string) =>
        location.pathname === path ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50";

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/shop" className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <ShoppingBag className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">NthStore</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/shop"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/shop')}`}
                        >
                            Shop
                        </Link>

                        <Link
                            to="/admin"
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')}`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin
                        </Link>

                        <Link
                            to="/cart"
                            className={`relative group p-2 rounded-full transition-colors ${isActive('/cart')}`}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
