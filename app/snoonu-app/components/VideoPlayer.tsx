'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, X, Volume2, VolumeX, User, ShoppingBag } from 'lucide-react';
import { CreatorBasket } from '@/lib/types';

interface VideoPlayerProps {
    videoUrl?: string;
    creatorName?: string;
    creatorTier?: string;
    basket?: CreatorBasket;
    onClose: () => void;
    onShopBasket?: (basket: CreatorBasket) => void;
}

export function VideoPlayer({ videoUrl, creatorName, creatorTier, basket, onClose, onShopBasket }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Placeholder video for demo (local file for instant loading)
    const placeholderVideo = '/videos/placeholder.mp4';
    const actualVideoUrl = videoUrl || placeholderVideo;

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full bg-black rounded-lg overflow-hidden">
            {/* Video */}
            <div className="relative w-full h-[300px] bg-black flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                >
                    <source src={actualVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Clickable Overlay - Click anywhere to pause/play */}
                <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                    onClick={togglePlay}
                >
                    {/* Show play/pause icon briefly on state change */}
                    <div className={`w-14 h-14 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                        <Play className="w-6 h-6 ml-1" />
                    </div>
                </div>

                {/* Top Controls */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={toggleMute}
                        className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Creator Attribution */}
                {creatorName && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <User className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-medium">{creatorName}</span>
                        {creatorTier && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${creatorTier === 'platinum' ? 'bg-indigo-500' :
                                creatorTier === 'gold' ? 'bg-yellow-500' :
                                    creatorTier === 'silver' ? 'bg-gray-400' :
                                        'bg-amber-700'
                                } text-white`}>
                                {creatorTier.charAt(0).toUpperCase() + creatorTier.slice(1)}
                            </span>
                        )}
                    </div>
                )}

                {/* Shop This Basket Button */}
                {basket && onShopBasket && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShopBasket(basket);
                        }}
                        className="absolute bottom-2 right-2 flex items-center gap-2 bg-[#E31837] hover:bg-[#B8132C] text-white px-4 py-2 rounded-full font-medium text-sm transition-colors shadow-lg z-30"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Shop {basket.name.split("'s")[0]}&apos;s Picks</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{basket.totalPrice} QAR</span>
                    </button>
                )}
            </div>
        </div>
    );
}

