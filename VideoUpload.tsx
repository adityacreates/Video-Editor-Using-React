import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';

export const VideoUpload: React.FC = () => {
  const { setVideoFile } = useVideoStore();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  }, [setVideoFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  }, [setVideoFile]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="video/*"
        className="hidden"
        id="video-upload"
        onChange={handleFileInput}
      />
      <label
        htmlFor="video-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Drop your video here or click to upload
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supports MP4, WebM, and other video formats
        </p>
      </label>
    </div>
  );
};