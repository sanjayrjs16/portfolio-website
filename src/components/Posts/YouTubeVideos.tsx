import { useState } from 'react';
import './YouTubeVideos.css';

interface Video {
    id: string;
    title: string;
    thumbnail: string;
}

interface CustomEvent extends Event {
    detail: {
        videoId: string;
    };
}

const videos: Video[] = [
    {
        id: "1ibf5SxkMMI",
        title: "Don't trust your AI Agents. Cursor & Supabase MCP.",
        thumbnail: "https://i.ytimg.com/vi/1ibf5SxkMMI/hqdefault.jpg"
    },
    {
        id: "BMIVkzFYBbk",
        title: "WORST React.js Exploit Ever: React2Shell Explained in 4 Minutes.",
        thumbnail: "https://i.ytimg.com/vi/BMIVkzFYBbk/hqdefault.jpg"
    },
    {
        id: "C3C0HhhxOVk",
        title: "NPM's Rising Malware Problem",
        thumbnail: "https://i.ytimg.com/vi/C3C0HhhxOVk/hqdefault.jpg"
    },
    {
        id: "m4SZ4ML5KJs",
        title: "Recruiter Tries to Hack Me During an Interview",
        thumbnail: "https://i.ytimg.com/vi/m4SZ4ML5KJs/hqdefault.jpg"
    },
    {
        id: "SZIl6FPlDE4",
        title: "Gemini's UI is just BUILT DIFFERENT",
        thumbnail: "https://i.ytimg.com/vi/SZIl6FPlDE4/hqdefault.jpg"
    },
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
        id: "4twWQj4XncI",
        title: "Instagram's LIKE is a Clever Illusion",
        thumbnail: "https://i.ytimg.com/vi/4twWQj4XncI/hqdefault.jpg"
    },
    {
        id: "w-X0eu3Xjjk",
        title: "10 lines of HTML vs 326 lines of JS | Making modals the modern way",
        thumbnail: "https://i.ytimg.com/vi/w-X0eu3Xjjk/hqdefault.jpg"
    },
    {
        id: "8mGO_Cp-GmM",
        title: "How a SINGLE piece of code TOOK DOWN MySpace.",
        thumbnail: `https://img.youtube.com/vi/8mGO_Cp-GmM/maxresdefault.jpg`
    },
   
    {
        id: "kqiPfj5C0ig",
        title: "Animating Michael Scott's Parkour Flip on Scroll with React",
        thumbnail: `https://img.youtube.com/vi/kqiPfj5C0ig/maxresdefault.jpg`
    },
    {
        id: "Iq5MoWmuxlI",
        title: "Animating Sukuna full screen loader on the web",
        thumbnail: `https://img.youtube.com/vi/Iq5MoWmuxlI/maxresdefault.jpg`
    },
    {
        id: "BX0dTsmU5f4",
        title: "Why are frontend frameworks going REACTIVE ?",
        thumbnail: `https://img.youtube.com/vi/BX0dTsmU5f4/maxresdefault.jpg`
    },
    {
        id: "Rk-xkF9ge9Q",
        title: "REACT 70% FASTER?!? | Million.js explained",
        thumbnail: `https://img.youtube.com/vi/Rk-xkF9ge9Q/maxresdefault.jpg`
    },
    // 
        {
            id: "G2IjpyryO2U",
            title: "Naruto Shadow Clone Notification system using React",
            thumbnail: `https://img.youtube.com/vi/G2IjpyryO2U/maxresdefault.jpg`
        },
    // Iq5MoWmuxlI
   
    
    

    
];

export default function YouTubeVideos() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const handleKeyPress = (e: React.KeyboardEvent, videoId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedVideo(videoId);
        }
    };

    const handleCloseModal = () => setSelectedVideo(null);

    return (
        <>
        <div className="youtubeSection">
            <section className="videos-card" aria-labelledby="video-posts-heading">
                <div className="videos-card__head">
                    <h2 id="video-posts-heading">Videos</h2>
                    <p>Watch breakdowns, engineering notes, and product/security explainers.</p>
                </div>
                <div className="videosGrid">
                    {videos.map((video, index) => (
                        <div 
                            key={video.id} 
                            className="videoCard"
                            onClick={() => setSelectedVideo(video.id)}
                            onKeyDown={(e) => handleKeyPress(e, video.id)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Play ${video.title}`}
                            style={{ '--index': index } as React.CSSProperties}
                        >
                            <span className="videoNumber">{index + 1}.</span>
                            <img
                                src={video.thumbnail}
                                alt={`Thumbnail for ${video.title}`}
                                className="videoThumbnail"
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                            />
                            <h3 className="videoTitle">{video.title}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {selectedVideo && (
                <div 
                    className="modalOverlay" 
                    onClick={handleCloseModal}
                    role="dialog"
                    aria-label="Video player"
                >
                    <div className="modalContent" onClick={e => e.stopPropagation()}>
                        <button 
                            className="closeButton"
                            onClick={handleCloseModal}
                            aria-label="Close video"
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
            </>
    );
} 