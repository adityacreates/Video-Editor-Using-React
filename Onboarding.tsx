import React, { useState } from 'react';
import { useVideoStore } from '../store/videoStore';
import { Film, Scissors, Palette, Crop, ChevronRight, ChevronLeft, FastForward, Volume2 } from 'lucide-react';

const slides = [
  {
    icon: Film,
    title: 'Welcome to Video Editor',
    description: 'Create professional videos with our easy-to-use editing tools. Upload any video file and start editing in seconds.',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: FastForward,
    title: 'Playback Controls',
    description: 'Adjust playback speed and volume to perfect your video timing and audio levels.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: Scissors,
    title: 'Trim & Filter',
    description: 'Cut your video to the perfect length and enhance it with professional filters. Adjust brightness, contrast, saturation, and more.',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: Crop,
    title: 'Perfect Framing',
    description: 'Crop and resize your videos for any platform. Create the perfect composition for social media, websites, or presentations.',
    image: 'https://images.unsplash.com/photo-1533279443086-d1c19a186416?auto=format&fit=crop&w=800&q=80'
  }
];

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setHasCompletedOnboarding } = useVideoStore();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      setHasCompletedOnboarding(true);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSlide(currentSlide - 1);
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="max-w-4xl w-full px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Image */}
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Right side - Content */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-10 h-10 text-blue-500" />
                  <h2 className="text-3xl font-bold text-gray-900">{slide.title}</h2>
                </div>
                <p className="text-lg text-gray-600 mb-8">{slide.description}</p>
              </div>

              <div className="space-y-6">
                {/* Progress dots */}
                <div className="flex justify-center gap-2">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${currentSlide === 0 
                        ? 'opacity-0 cursor-default' 
                        : 'text-gray-600 hover:text-gray-900'}`}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  <div className="flex gap-4">
                    {currentSlide < slides.length - 1 && (
                      <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Skip
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};