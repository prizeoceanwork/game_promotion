import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, PlayCircle } from "lucide-react";
import videoThumbnail from "../assets/poster.png"; // keep your poster

interface VideoSectionProps {
  onVideoComplete: () => void;
}

export default function VideoSection({ onVideoComplete }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hlsUrl =
      "https://res.cloudinary.com/dziy5sjas/video/upload/sp_auto/v1/Michael_Patrick_-_PART_1_D4UP_Scratch_Win_1_f6nipw.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = hlsUrl;
    }
  }, []);

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().finally(() => setIsLoading(false));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progressPercent = (currentTime / duration) * 100;
      setProgress(progressPercent);

      if (progressPercent >= 80 && !videoCompleted) {
        onVideoComplete();
        setVideoCompleted(true);
      }
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#DEB406] text-white text-center py-4 md:py-6 rounded-t-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-3 px-4">
              <PlayCircle className="animate-pulse flex-shrink-0" size={24} />
              <h2 className="text-base md:text-2xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                CLICK BELOW TO WATCH THE VIDEO
              </h2>
            </div>
          </div>

          <div className="relative bg-gray-900 rounded-b-lg shadow-2xl overflow-hidden">
            <div className="aspect-video relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                preload="metadata"
                playsInline
                controls={isPlaying} // show controls only after play
                poster={videoThumbnail}
                onTimeUpdate={handleTimeUpdate}
              />

              {!isPlaying && (
                <button
                  onClick={handlePlay}
                  disabled={isLoading}
                  className="absolute inset-0 flex items-center justify-center z-10 bg-black/40"
                >
                  <div className="bg-white bg-opacity-90 rounded-full p-6 shadow-2xl">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10155E]"></div>
                    ) : (
                      <Play className="text-4xl text-[#FFDF20] ml-1" size={48} />
                    )}
                  </div>
                </button>
              )}

              <div
                className="absolute bottom-0 left-0 h-1 bg-[#DEB406] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
