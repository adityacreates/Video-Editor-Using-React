import React, { useRef, useEffect, useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { 
    videoUrl, 
    playbackSpeed, 
    volume, 
    filters, 
    crop,
    trimStart,
    trimEnd,
    videoDuration,
    setVideoDuration
  } = useVideoStore();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.volume = volume;
    }
  }, [playbackSpeed, volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      setVideoDuration(duration);
      
      // Ensure trim end is not beyond video duration
      if (trimEnd > duration) {
        video.currentTime = 0;
      } else {
        video.currentTime = trimStart;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // More robust trim handling
      if (video.currentTime >= trimEnd) {
        video.pause();
        video.currentTime = trimStart;
        setIsPlaying(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      video.currentTime = trimStart;
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Video error:', e);
      setIsPlaying(false);
      alert('Error playing video. Please check the video file.');
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [setVideoDuration, trimStart, trimEnd, videoDuration]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Ensure current time is within trim bounds before playing
      if (videoRef.current.currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = trimStart;
    setCurrentTime(trimStart);
    if (isPlaying) {
      videoRef.current.play();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!videoUrl) {
    return null;
  }

  const filterStyle = {
    filter: `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%)
      grayscale(${filters.grayscale}%)
    `,
    transform: `scale(${100/crop.width})`,
    clipPath: `inset(${crop.y}% ${100-crop.width-crop.x}% ${100-crop.height-crop.y}% ${crop.x}%)`,
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          style={filterStyle}
          playsInline
        />
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={handleRestart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(trimEnd)}
        </div>
      </div>
    </div>
  );
};