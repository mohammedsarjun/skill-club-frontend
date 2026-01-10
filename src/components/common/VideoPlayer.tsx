import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";

interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  description?: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  title = "",
  description = "",
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = (): void => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = (): void => setDuration(video.duration);
    const handleEnded = (): void => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = (): void => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (): void => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number): void => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const toggleFullscreen = (): void => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = (): void => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
            aria-label="Close modal"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6">
          <div
            className="relative w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 mt-10">
              <video
                ref={videoRef}
                className="w-full aspect-video bg-black"
                src={videoUrl}
                onClick={togglePlay}
              />

              {/* Center Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <button
                    onClick={togglePlay}
                    className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl hover:scale-110 transition-transform duration-300"
                    aria-label="Play video"
                  >
                    <Play size={40} className="text-white ml-2" fill="white" />
                  </button>
                </div>
              )}

              {/* Controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Progress Bar */}
                <div className="px-6 pt-4">
                  <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden group cursor-pointer">
                    <div
                      className="absolute h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-150"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      aria-label="Video progress"
                    />
                    <div
                      className="absolute h-full w-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        left: `${progressPercentage}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 text-white hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    {/* Skip Back */}
                    <button
                      onClick={() => skip(-10)}
                      className="p-2 text-white hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                      aria-label="Skip back 10 seconds"
                    >
                      <SkipBack size={20} />
                    </button>

                    {/* Skip Forward */}
                    <button
                      onClick={() => skip(10)}
                      className="p-2 text-white hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                      aria-label="Skip forward 10 seconds"
                    >
                      <SkipForward size={20} />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 ml-2 group">
                      <button
                        onClick={toggleMute}
                        className="p-2 text-white hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <div className="relative w-0 group-hover:w-24 overflow-hidden transition-all duration-300">
                        <div className="relative h-1 bg-gray-700 rounded-full">
                          <div
                            className="absolute h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                            style={{
                              width: `${(isMuted ? 0 : volume) * 100}%`,
                            }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            aria-label="Volume control"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <span className="text-emerald-100 text-sm font-medium ml-3 bg-emerald-950/50 px-3 py-1 rounded-lg">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white hover:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all duration-200"
                    aria-label="Fullscreen"
                  >
                    <Maximize size={22} />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Title */}
            <div className="mt-6 px-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
