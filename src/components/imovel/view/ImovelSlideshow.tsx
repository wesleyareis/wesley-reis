import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideShowProps {
  images: string[];
}

export function SlideShow({ images }: SlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full aspect-video group">
      <div
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        className="w-full h-full bg-center bg-cover duration-500 rounded-lg"
      />
      
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 left-4 h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 hover:bg-black/40 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-4 h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 hover:bg-black/40 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}