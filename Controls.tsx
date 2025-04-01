import React from 'react';
import { Range } from 'react-range';
import { useVideoStore } from '../store/videoStore';
import { 
  Volume2, 
  FastForward,
  Sun,
  Contrast,
  Palette,
  Scissors,
  Crop,
  ScaleIcon as GrayscaleIcon
} from 'lucide-react';

export const Controls: React.FC = () => {
  const { 
    playbackSpeed, 
    volume, 
    filters,
    crop,
    trimStart,
    trimEnd,
    videoDuration,
    setPlaybackSpeed,
    setVolume,
    setFilters,
    setCrop,
    setTrimPoints
  } = useVideoStore();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderTrack = ({ props, children }) => (
    <div
      {...props}
      className="h-2 w-full bg-gray-200 rounded-full"
    >
      {children}
    </div>
  );

  const renderThumb = ({ props }) => {
    const { key, ...restProps } = props;
    return (
      <div
        key={key}
        {...restProps}
        className="h-4 w-4 bg-blue-500 rounded-full"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Playback Controls</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FastForward className="w-5 h-5" />
              <span className="text-sm font-medium">Playback Speed</span>
            </div>
            <Range
              step={0.25}
              min={0.25}
              max={2}
              values={[playbackSpeed]}
              onChange={(values) => setPlaybackSpeed(values[0])}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
            <span className="text-xs text-gray-500">{playbackSpeed}x</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <Range
              step={0.1}
              min={0}
              max={1}
              values={[volume]}
              onChange={(values) => setVolume(values[0])}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Trim Video</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            <span className="text-sm font-medium">Trim Points</span>
          </div>
          <Range
            step={0.1}
            min={0}
            max={Math.max(videoDuration, 0.1)}
            values={[trimStart, trimEnd]}
            onChange={(values) => setTrimPoints(values[0], values[1])}
            renderTrack={renderTrack}
            renderThumb={renderThumb}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(trimStart)}</span>
            <span>{formatTime(trimEnd)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Video Filters</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-medium">Brightness</span>
            </div>
            <Range
              step={5}
              min={0}
              max={200}
              values={[filters.brightness]}
              onChange={(values) => setFilters({ ...filters, brightness: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              <span className="text-sm font-medium">Contrast</span>
            </div>
            <Range
              step={5}
              min={0}
              max={200}
              values={[filters.contrast]}
              onChange={(values) => setFilters({ ...filters, contrast: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Saturation</span>
            </div>
            <Range
              step={5}
              min={0}
              max={200}
              values={[filters.saturation]}
              onChange={(values) => setFilters({ ...filters, saturation: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GrayscaleIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Grayscale</span>
            </div>
            <Range
              step={1}
              min={0}
              max={100}
              values={[filters.grayscale]}
              onChange={(values) => setFilters({ ...filters, grayscale: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Crop Video</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">X Position (%)</label>
            <Range
              step={1}
              min={0}
              max={100}
              values={[crop.x]}
              onChange={(values) => setCrop({ ...crop, x: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Y Position (%)</label>
            <Range
              step={1}
              min={0}
              max={100}
              values={[crop.y]}
              onChange={(values) => setCrop({ ...crop, y: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Width (%)</label>
            <Range
              step={1}
              min={10}
              max={100}
              values={[crop.width]}
              onChange={(values) => setCrop({ ...crop, width: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Height (%)</label>
            <Range
              step={1}
              min={10}
              max={100}
              values={[crop.height]}
              onChange={(values) => setCrop({ ...crop, height: values[0] })}
              renderTrack={renderTrack}
              renderThumb={renderThumb}
            />
          </div>
        </div>
      </div>
    </div>
  );
};