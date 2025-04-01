import React, { useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { Film } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setShowSplash } = useVideoStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setShowSplash]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <Film className="w-20 h-20 text-white mb-4 mx-auto animate-bounce" />
        <h1 className="text-4xl font-bold text-white mb-2">Video Editor</h1>
        <p className="text-blue-100">Create stunning videos with ease</p>
      </div>
    </div>
  );
};