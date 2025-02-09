"use client";
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

const WatchSeries = () => {
    const params = useParams();
    const router = useRouter();
    const embedUrl = "https://embed.su/embed/tv";

    // Ensure params are valid
    const { id, season, episode } = params || {};
    if (!id || !season || !episode) return <p className="text-white text-center">Loading...</p>;

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center relative'>
            {/* Back Button */}
            <button 
                onClick={() => router.back()} 
                className='absolute top-3 left-7 flex items-center text-white text-base z-10'
            >
                <ChevronLeft width={18} /> Back
            </button>

            {/* Video Embed */}
            <iframe
                className="w-full h-full"
                src={`${embedUrl}/${id}/${season}/${episode}`}
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="Video Embed"
            ></iframe>
        </div>
    );
};

export default WatchSeries;
