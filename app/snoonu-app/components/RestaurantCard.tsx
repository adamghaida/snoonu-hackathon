'use client';

import React, { useState } from 'react';
import { Play, Star, Clock, MapPin, Heart, Ticket } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { CreatorBasket } from '@/lib/types';

export interface RestaurantData {
    id: string;
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    distance: string;
    priceLevel: string;
    categories: string[];
    supportLocal?: boolean;
    hasVideo?: boolean;
    videoUrl?: string;
    creatorName?: string;
    creatorTier?: string;
    hasCreatorCodes?: boolean;
    creatorCodeInfo?: string; // e.g., "Use code SARA for 10% off"
    basket?: CreatorBasket;
}

interface RestaurantCardProps {
    restaurant: RestaurantData;
    onShopBasket?: (basket: CreatorBasket) => void;
}

export function RestaurantCard({ restaurant, onShopBasket }: RestaurantCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div 
            className={`bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300 ease-out ${
                isExpanded ? 'shadow-xl shadow-[#E31837]/20' : ''
            }`}
        >
            {/* Image Container */}
            <div className="relative">
                <div className={`relative overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'h-auto' : 'h-48'
                }`}>
                    {!isExpanded ? (
                        <>
                            {/* Restaurant Image */}
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-48 object-cover"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {/* Delivery Time Badge */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <Clock className="w-3.5 h-3.5 text-white" />
                                <span className="text-white text-xs font-medium">{restaurant.deliveryTime}</span>
                            </div>

                            {/* Distance Badge */}
                            <div className="absolute bottom-3 left-24 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                <MapPin className="w-3 h-3 text-white" />
                                <span className="text-white text-xs">{restaurant.distance}</span>
                            </div>

                            {/* Rating Badge */}
                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                <span className="text-green-400 text-xs">👍</span>
                                <span className="text-white text-xs font-medium">{restaurant.rating}%</span>
                            </div>

                            {/* Favorite Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFavorite(!isFavorite);
                                }}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
                            >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'text-[#E31837] fill-[#E31837]' : 'text-white'}`} />
                            </button>

                            {/* Video Play Button */}
                            {restaurant.hasVideo && (
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="absolute bottom-3 right-3 w-10 h-10 bg-[#E31837] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Play className="w-5 h-5 text-white ml-0.5" />
                                </button>
                            )}
                        </>
                    ) : (
                        /* Video Player when expanded */
                        <VideoPlayer
                            videoUrl={restaurant.videoUrl}
                            creatorName={restaurant.creatorName}
                            creatorTier={restaurant.creatorTier}
                            basket={restaurant.basket}
                            onClose={() => setIsExpanded(false)}
                            onShopBasket={onShopBasket}
                        />
                    )}
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            {restaurant.supportLocal && (
                                <span className="text-[10px] bg-[#E31837]/20 text-[#E31837] px-1.5 py-0.5 rounded font-medium">
                                    S+
                                </span>
                            )}
                            <span className="text-[10px] text-gray-400">ad</span>
                            <h3 className="text-white font-semibold text-sm">{restaurant.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">{restaurant.priceLevel}</span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-400 text-xs truncate">
                                {restaurant.categories.join(', ')}
                            </span>
                        </div>
                        {restaurant.supportLocal && (
                            <span className="text-[#E31837] text-xs font-medium mt-1 inline-block">
                                Support Local
                            </span>
                        )}
                        {restaurant.hasCreatorCodes && (
                            <div className="flex items-center gap-1 mt-1">
                                <Ticket className="w-3 h-3 text-purple-400" />
                                <span className="text-purple-400 text-xs font-medium">
                                    {restaurant.creatorCodeInfo || 'Creator codes accepted'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-medium">{(restaurant.rating / 20).toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

