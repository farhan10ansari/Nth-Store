import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, DollarSign, ShoppingBag, Ticket, Activity } from 'lucide-react';
import { api } from '../api';
import { type AdminStats } from '../types';

export const Admin: React.FC = () => {
    const queryClient = useQueryClient();
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [genMsg, setGenMsg] = useState("");

    const { data: stats, isLoading } = useQuery<AdminStats>({
        queryKey: ['adminStats'],
        queryFn: api.getStats,
        refetchInterval: 3000 // Live polling
    });

    const handleGenerateCode = async () => {
        try {
            const res = await api.generateCode();
            if (res.created) {
                setGeneratedCode(res.code);
                setGenMsg("Success! Code Generated.");
                queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            } else {
                setGenMsg(res.message);
                setGeneratedCode(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div>Loading stats...</div>;

    const StatCard = ({ icon: Icon, label, value, colorClass }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Real-time store metrics and discount management.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={ShoppingBag}
                    label="Total Orders"
                    value={stats?.orderCount || 0}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={`$${stats?.totalPurchaseAmount || 0}`}
                    colorClass="bg-green-500"
                />
                <StatCard
                    icon={Activity}
                    label="Items Sold"
                    value={stats?.totalItemsPurchased || 0}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    icon={Ticket}
                    label="Discounts Given"
                    value={`$${stats?.totalDiscountAmount || 0}`}
                    colorClass="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generator Section */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-indigo-600" />
                        Discount Generator
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 mb-6">
                        Attempts to generate a code. Only succeeds if the <strong>next</strong> order is the "Nth" order (e.g., 3rd, 6th).
                    </p>

                    <button
                        onClick={handleGenerateCode}
                        className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                    >
                        Attempt Generation
                    </button>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[80px] flex flex-col items-center justify-center border border-dashed border-gray-300">
                        {generatedCode ? (
                            <>
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Generated Code</span>
                                <span className="text-xl font-mono font-bold text-green-600 mt-1">{generatedCode}</span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500 text-center">{genMsg || "Waiting for action..."}</span>
                        )}
                    </div>
                </div>

                {/* Codes List Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Discount Code History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.discountCodes.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-4 text-center text-gray-500">No codes generated yet.</td>
                                    </tr>
                                )}
                                {stats?.discountCodes.map((d, i) => (
                                    <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">{d.code}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.isUsed
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {d.isUsed ? 'Used' : 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
