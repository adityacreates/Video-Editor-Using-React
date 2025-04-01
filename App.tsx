// App.tsx
import React, { useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Controls } from './components/Controls';
import { VideoUpload } from './components/VideoUpload';
import { VideoExport } from './components/VideoExport';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { useVideoStore } from './store/videoStore';
import { ArrowLeft } from 'lucide-react';

function App() {
  const { 
    videoUrl, 
    clearVideo, 
    showSplash, 
    hasCompletedOnboarding,
    setHasCompletedOnboarding
  } = useVideoStore();

  // This effect ensures the onboarding shows every time the app loads
  useEffect(() => {
    setHasCompletedOnboarding(false);
  }, [setHasCompletedOnboarding]);

  const handleBack = () => {
    clearVideo();
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!videoUrl ? (
        <VideoUpload />
      ) : (
        <div className="max-w-[1600px] mx-auto p-4">
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <VideoPlayer />
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <VideoExport />
              </div>
            </div>
            <div className="lg:col-span-1 overflow-auto max-h-[calc(100vh-2rem)]">
              <Controls />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;