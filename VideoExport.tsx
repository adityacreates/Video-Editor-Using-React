import React, { useState, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import { Download } from 'lucide-react';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const VideoExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { videoFile, playbackSpeed, volume, filters, crop, trimStart, trimEnd } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportVideo = async () => {
    if (!videoFile || !videoRef.current || !canvasRef.current) return;

    setIsExporting(true);
    setProgress(0);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      
      // Set up video
      video.src = URL.createObjectURL(videoFile);
      await new Promise(resolve => {
        video.onloadedmetadata = () => {
          // Set canvas size based on crop
          const targetWidth = (video.videoWidth * crop.width) / 100;
          const targetHeight = (video.videoHeight * crop.height) / 100;
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          resolve(null);
        };
      });

      // Calculate duration for progress tracking
      const fps = 30;
      const duration = trimEnd - trimStart;
      
      // Create audio context for audio processing
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioSource = audioCtx.createMediaElementSource(video);
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = volume; // Apply volume setting
      audioSource.connect(gainNode);
      
      // Set up MediaRecorder with WebM format
      const canvasStream = canvas.captureStream(fps);
      
      // Create a new audio destination
      const audioDestination = audioCtx.createMediaStreamDestination();
      gainNode.connect(audioDestination);
      
      // Combine video and audio tracks
      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ];
      
      const combinedStream = new MediaStream(combinedTracks);
      
      // Use VP9 codec for better quality/size ratio
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 8000000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (chunks.length === 0) {
          throw new Error('No video data recorded');
        }

        const blob = new Blob(chunks, { type: 'video/webm' });
        if (blob.size === 0) {
          throw new Error('Generated video file is empty');
        }

        // Connect audio back to speakers
        audioSource.disconnect();
        
        // Save the video file
        await saveVideoFile(blob);
        
        setIsExporting(false);
        setProgress(100);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      video.playbackRate = playbackSpeed;
      video.volume = volume;
      
      // Set video to trim start
      video.currentTime = trimStart;
      await new Promise(resolve => {
        video.onseeked = resolve;
      });
      
      // Process frames with requestAnimationFrame for better performance
      const frameInterval = 1000 / fps;
      let lastDrawTime = 0;
      
      // Create a filter string once instead of on every frame
      const filterString = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%)
        grayscale(${filters.grayscale}%)
      `;
      
      // Pre-calculate crop values
      const sourceX = (video.videoWidth * crop.x) / 100;
      const sourceY = (video.videoHeight * crop.y) / 100;
      const sourceWidth = (video.videoWidth * crop.width) / 100;
      const sourceHeight = (video.videoHeight * crop.height) / 100;
      
      // Handle progress updates
      video.ontimeupdate = () => {
        const currentProgress = Math.min(
          Math.round(((video.currentTime - trimStart) / duration) * 100),
          99
        );
        setProgress(currentProgress > 0 ? currentProgress : 1);
      };

      const drawFrame = async (timestamp: number) => {
        if (!video.paused && !video.ended && video.currentTime < trimEnd) {
          if (timestamp - lastDrawTime >= frameInterval) {
            // Apply filters
            ctx.filter = filterString;

            // Draw cropped and filtered frame
            ctx.drawImage(
              video,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, 0, canvas.width, canvas.height
            );
            
            lastDrawTime = timestamp;
          }
          requestAnimationFrame(drawFrame);
        } else {
          // Ensure at least one frame is drawn
          if (lastDrawTime === 0) {
            ctx.filter = filterString;
            ctx.drawImage(
              video,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, 0, canvas.width, canvas.height
            );
          }
          mediaRecorder.stop();
        }
      };

      video.play();
      requestAnimationFrame(drawFrame);
    } catch (error) {
      console.error('Error during export:', error);
      setIsExporting(false);
      setProgress(0);
      alert('Error exporting video. Please try again.');
    }
  };

  // Separate function to handle file saving
  const saveVideoFile = async (blob: Blob): Promise<void> => {
    // Convert blob to base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;
          const base64Content = base64Data.split(',')[1];
          
          // Save file using Capacitor Filesystem API
          const fileName = `edited-video-${Date.now()}.webm`;
          await Filesystem.writeFile({
            path: fileName,
            data: base64Content,
            directory: Directory.Documents,
            recursive: true
          });
          
          // Show success message
          alert('Video saved to Documents folder!');
          resolve();
        } catch (error) {
          console.error('Error saving file:', error);
          alert('Error saving video. Please try again.');
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="space-y-4">
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex flex-col gap-2">
        <button
          onClick={exportVideo}
          disabled={isExporting}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
            ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Exporting...' : 'Export Video'}
        </button>
        
        {isExporting && (
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};