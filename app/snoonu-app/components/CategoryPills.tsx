'use client';

import React from 'react';
import { Percent, Beef, ChefHat, Drumstick, Pizza, Coffee, Salad, IceCream } from 'lucide-react';

interface Category {
    icon: React.ReactNode;
    label: string;
    color: string;
}

export function CategoryPills() {
    const categories: Category[] = [
        { icon: <Percent className="w-6 h-6" />, label: 'Promos', color: 'bg-[#E31837]' },
        { icon: <Beef className="w-6 h-6" />, label: 'Burgers', color: 'bg-amber-600' },
        { icon: <ChefHat className="w-6 h-6" />, label: 'Home Chefs', color: 'bg-purple-700' },
        { icon: <Drumstick className="w-6 h-6" />, label: 'Fried Chicken', color: 'bg-orange-600' },
        { icon: <Pizza className="w-6 h-6" />, label: 'Pizza', color: 'bg-red-700' },
        { icon: <Coffee className="w-6 h-6" />, label: 'Café', color: 'bg-amber-800' },
        { icon: <Salad className="w-6 h-6" />, label: 'Healthy', color: 'bg-green-600' },
        { icon: <IceCream className="w-6 h-6" />, label: 'Desserts', color: 'bg-pink-500' },
    ];

    return (
        <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-4 py-3">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className="flex flex-col items-center gap-1.5 min-w-[64px]"
                    >
                        <div className={`${category.color} w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg`}>
                            {category.icon}
                        </div>
                        <span className="text-white text-xs font-medium text-center whitespace-nowrap">
                            {category.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

