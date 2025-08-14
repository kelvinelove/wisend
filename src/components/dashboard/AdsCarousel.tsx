import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Student Accommodation UK',
    description: 'Find the perfect student housing in London, Manchester, and Birmingham. Safe, affordable, and convenient.',
    imageUrl: '/placeholder.svg',
    buttonText: 'Find Housing',
    backgroundColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-white'
  },
  {
    id: '2',
    title: 'International Money Transfer',
    description: 'Save money on your transfers with our partner network. Better rates, faster transfers.',
    imageUrl: '/placeholder.svg',
    buttonText: 'Get Better Rates',
    backgroundColor: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-white'
  },
  {
    id: '3',
    title: 'Study Insurance',
    description: 'Comprehensive health and travel insurance for students studying abroad. Peace of mind guaranteed.',
    imageUrl: '/placeholder.svg',
    buttonText: 'Get Quote',
    backgroundColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    textColor: 'text-white'
  }
];

export const AdsCarousel: React.FC = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % mockAds.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % mockAds.length);
    setIsAutoPlaying(false);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + mockAds.length) % mockAds.length);
    setIsAutoPlaying(false);
  };

  const currentAd = mockAds[currentAdIndex];

  return (
    <Card className="shadow-medium overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Featured Services</CardTitle>
            <CardDescription>Recommended for students abroad</CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-muted-foreground">Sponsored</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Ad Content */}
          <div className={`${currentAd.backgroundColor} ${currentAd.textColor} p-6 min-h-[200px] flex flex-col justify-between`}>
            <div>
              <h3 className="text-xl font-bold mb-2">{currentAd.title}</h3>
              <p className="text-sm opacity-90 mb-4 line-clamp-3">
                {currentAd.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {currentAd.buttonText}
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              
              {/* Navigation dots */}
              <div className="flex space-x-2">
                {mockAds.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentAdIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-opacity ${
                      index === currentAdIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevAd}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextAd}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40 p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Ad indicator */}
        <div className="px-4 py-2 bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground">
            Ad {currentAdIndex + 1} of {mockAds.length} • {isAutoPlaying ? 'Auto-playing' : 'Paused'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};