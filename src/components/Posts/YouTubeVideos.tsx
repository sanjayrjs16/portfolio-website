import { useState } from 'react';
import './YouTubeVideos.css';

interface Video {
    id: string;
    title: string;
    thumbnail: string;
}

const videos: Video[] = [
    {
        id: "kqiPfj5C0ig",
        title: "Building a Decentralized Film Funding Platform | Chainlink Hackathon",
        thumbnail: `https://img.youtube.com/vi/kqiPfj5C0ig/maxresdefault.jpg`
    },
    {
        id: "GZDLoeSsAm8",
        title: "Building a Solana Faucet with Next.js",
        thumbnail: `https://img.youtube.com/vi/GZDLoeSsAm8/maxresdefault.jpg`
    },
    {
        id: "8mGO_Cp-GmM",
        title: "Blockchain Basics: Understanding Proof of Stake",
        thumbnail: `https://img.youtube.com/vi/8mGO_Cp-GmM/maxresdefault.jpg`
    },
    {
        id: "BX0dTsmU5f4",
        title: "Frontend Caching Strategies Explained",
        thumbnail: `https://img.youtube.com/vi/BX0dTsmU5f4/maxresdefault.jpg`
    }
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