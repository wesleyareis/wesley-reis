import * as React from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";

export type CarouselApi = UseEmblaCarouselType[1];
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation?: "horizontal" | "vertical";
  opts?: Parameters<typeof useEmblaCarousel>[0];
};

export const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}