import { useState } from 'react';
import './YouTubeVideos.css';

interface Video {
    id: string;
    title: string;
    thumbnail: string;
}

const videos: Video[] = [
    {
        id: "bjwnLa83Aj0",
        title: "We built the official website for The Goatlife",
        thumbnail: `https://img.youtube.com/vi/bjwnLa83Aj0/maxresdefault.jpg`
    },
    {
        id: "GZDLoeSsAm8",
        title: "CASH-IN on CACHING as a frontend developer | Part 1 | Browser cache",
        thumbnail: `https://img.youtube.com/vi/GZDLoeSsAm8/maxresdefault.jpg`
    },
    {
        id: "8mGO_Cp-GmM",
        title: "How a SINGLE piece of code TOOK DOWN MySpace.",
        thumbnail: `https://img.youtube.com/vi/8mGO_Cp-GmM/maxresdefault.jpg`
    },
    {
        id: "BX0dTsmU5f4",
        title: "Why are frontend frameworks going REACTIVE ?",
        thumbnail: `https://img.youtube.com/vi/BX0dTsmU5f4/maxresdefault.jpg`
    },
    {
        id: "kqiPfj5C0ig",
        title: "Animating Michael Scott's Parkour Flip on Scroll with React",
        thumbnail: `https://img.youtube.com/vi/kqiPfj5C0ig/maxresdefault.jpg`
    },
    {
        id: "Rk-xkF9ge9Q",
        title: "REACT 70% FASTER?!? | Million.js explained",
        thumbnail: `https://img.youtube.com/vi/Rk-xkF9ge9Q/maxresdefault.jpg`
    },
    
    
    
];

export default function YouTubeVideos() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    return (
        <div className="youtubeSection" style={{ position: 'relative', zIndex: 2 }}>
            <h2>Videos</h2>
            <div className="videosGrid">
                {videos.map((video) => (
                    <div 
                        key={video.id} 
                        className="videoCard"
                        onClick={() => setSelectedVideo(video.id)}
                    >
                        <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="videoThumbnail"
                        />
                        <h3 className="videoTitle">{video.title}</h3>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <div className="modalOverlay" onClick={() => setSelectedVideo(null)}>
                    <div className="modalContent" onClick={e => e.stopPropagation()}>
                        <button 
                            className="closeButton"
                            onClick={() => setSelectedVideo(null)}
                        >
                            ×
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 