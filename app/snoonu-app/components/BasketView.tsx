'use client';

import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Tag, CheckCircle } from 'lucide-react';
import { CreatorBasket, BasketItem } from '@/lib/types';

interface BasketViewProps {
    basket: CreatorBasket;
    merchantName: string;
    onClose: () => void;
}

export function BasketView({ basket, merchantName, onClose }: BasketViewProps) {
    const [items, setItems] = useState<BasketItem[]>(basket.items);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 8;
    const discount = basket.affiliateCode ? Math.round(totalPrice * 0.1) : 0; // 10% off with code
    const finalTotal = totalPrice + deliveryFee - discount;

    const updateQuantity = (itemId: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleOrder = () => {
        setIsOrdering(true);
        // Simulate order processing
        setTimeout(() => {
            setIsOrdering(false);
            setOrderPlaced(true);
        }, 1500);
    };

    if (orderPlaced) {
        return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-sm w-full text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Order Placed!</h2>
                    <p className="text-gray-400 mb-2">
                        Your order from {merchantName} is being prepared
                    </p>
                    {basket.affiliateCode && (
                        <p className="text-purple-400 text-sm mb-4">
                            Code <span className="font-bold">{basket.affiliateCode}</span> applied • You saved {discount} QAR!
                        </p>
                    )}
                    <p className="text-gray-500 text-sm mb-6">
                        Estimated delivery: 25-35 mins
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-[#E31837] text-white py-3 rounded-xl font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div>
                    <h2 className="text-white font-bold text-lg">{basket.name}</h2>
                    <p className="text-gray-400 text-sm">{merchantName}</p>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Creator Note */}
            <div className="p-4 bg-gradient-to-r from-purple-900/30 to-transparent border-b border-gray-800">
                <p className="text-gray-300 text-sm italic">&quot;{basket.description}&quot;</p>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                            {item.image || '🍽️'}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-medium">{item.name}</h3>
                            <p className="text-[#E31837] font-bold">{item.price} QAR</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center"
                            >
                                <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 bg-[#E31837] rounded-full flex items-center justify-center"
                            >
                                <Plus className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Your basket is empty</p>
                    </div>
                )}
            </div>

            {/* Affiliate Code Banner */}
            {basket.affiliateCode && items.length > 0 && (
                <div className="mx-4 mb-2 bg-purple-900/30 border border-purple-500/30 rounded-xl p-3 flex items-center gap-3">
                    <Tag className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                        <p className="text-purple-300 text-sm font-medium">
                            Code <span className="font-bold">{basket.affiliateCode}</span> auto-applied!
                        </p>
                        <p className="text-purple-400/70 text-xs">10% off your order</p>
                    </div>
                    <span className="text-purple-300 font-bold">-{discount} QAR</span>
                </div>
            )}

            {/* Order Summary */}
            {items.length > 0 && (
                <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 space-y-3">
                    <div className="flex justify-between text-gray-400 text-sm">
                        <span>Subtotal</span>
                        <span>{totalPrice} QAR</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                        <span>Delivery</span>
                        <span>{deliveryFee} QAR</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-purple-400 text-sm">
                            <span>Discount ({basket.affiliateCode})</span>
                            <span>-{discount} QAR</span>
                        </div>
                    )}
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                        <span>Total</span>
                        <span>{finalTotal} QAR</span>
                    </div>
                    <button
                        onClick={handleOrder}
                        disabled={isOrdering}
                        className="w-full bg-[#E31837] hover:bg-[#B8132C] disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isOrdering ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-5 h-5" />
                                Place Order • {finalTotal} QAR
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

