import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { api } from '../api';
import { type Product } from '../types';

const CURRENT_USER_ID = "user_123";

export const Shop: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: api.getProducts
    });

    const handleAddToCart = async (productId: string) => {
        try {
            await api.addToCart(CURRENT_USER_ID, productId);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            // Optional: Add a toast notification library here
        } catch (err) {
            console.error("Failed to add", err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Featured Products</h1>
                <p className="mt-2 text-gray-600">Explore our premium collection of tech accessories.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/*Image Area */}
                        <div className="h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <span className="text-4xl opacity-20">📦</span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">High quality verified.</p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="flex items-center justify-center p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-200 active:scale-95"
                                    title="Add to Cart"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
