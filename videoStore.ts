import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoState {
  videoFile: File | null;
  videoUrl: string | null;
  videoDuration: number;
  trimStart: number;
  trimEnd: number;
  playbackSpeed: number;
  volume: number;
  hasCompletedOnboarding: boolean;
  showSplash: boolean;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
  };
  setVideoFile: (file: File) => void;
  setVideoDuration: (duration: number) => void;
  setTrimPoints: (start: number, end: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  setCrop: (crop: { x: number; y: number; width: number; height: number }) => void;
  setFilters: (filters: { brightness: number; contrast: number; saturation: number; grayscale: number }) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setShowSplash: (value: boolean) => void;
  clearVideo: () => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      videoFile: null,
      videoUrl: null,
      videoDuration: 0,
      trimStart: 0,
      trimEnd: 0,
      playbackSpeed: 1,
      volume: 1,
      hasCompletedOnboarding: false,
      showSplash: true,
      crop: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        grayscale: 0,
      },
      setVideoFile: (file) => {
        const url = URL.createObjectURL(file);
        set({ videoFile: file, videoUrl: url });
      },
      setVideoDuration: (duration) => {
        set({ videoDuration: duration, trimEnd: duration });
      },
      setTrimPoints: (start, end) => set({ trimStart: start, trimEnd: end }),
      setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
      setVolume: (volume) => set({ volume }),
      setCrop: (crop) => set({ crop }),
      setFilters: (filters) => set({ filters }),
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setShowSplash: (value) => set({ showSplash: value }),
      clearVideo: () => {
        set(state => {
          if (state.videoUrl) {
            URL.revokeObjectURL(state.videoUrl);
          }
          return {
            videoFile: null,
            videoUrl: null,
            videoDuration: 0,
            trimStart: 0,
            trimEnd: 0
          };
        });
      },
      reset: () => set(state => {
        if (state.videoUrl) {
          URL.revokeObjectURL(state.videoUrl);
        }
        return {
          videoFile: null,
          videoUrl: null,
          videoDuration: 0,
          trimStart: 0,
          trimEnd: 0,
          playbackSpeed: 1,
          volume: 1,
          crop: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          },
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            grayscale: 0,
          },
        };
      }),
    }),
    {
      name: 'video-editor-storage',
      partialize: () => ({
        // Return an empty object since we're not persisting anything
        // Removed the 'state' parameter since it's not being used
      }),
    }
  )
);