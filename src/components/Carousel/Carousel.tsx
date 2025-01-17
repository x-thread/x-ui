import LeftArrow from "./LeftArrow";
import RightArrow from "./RightArrow";
import CarouselFooter from "./CarouselFooter";
import FooterControl from "./FooterControl";
import { useEffect, useState } from "react";
import "./Carousel.css";

interface CarouselProps {
  images: string[];
  index?: number;
  footerIndicator?: boolean;
  footerControl?: boolean;
  footerControlOrientation?: "horizontal" | "vertical";
}

/**
*Carousel component to display images in a carousel
*@param images: Array of images to be displayed in the carousel
*@param index: Index of the image to be displayed first
*@param footerIndicator: Boolean to display footer indicator
*@param footerControl: Boolean to display footer control
*@param footerControlOrientation: Orientation of the footer control
*/
export const Carousel = ({images = [],index = 0,footerIndicator = true, footerControl = false, footerControlOrientation = "horizontal"}: CarouselProps) => {

  const [currentImg, setCurrentImg] = useState<string>("");
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(index);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    setIsFading(true);
    const timeoutId = setTimeout(() => {
      setCurrentImg(images[currentImgIndex]);
      setIsFading(false);
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [currentImgIndex, images]);

  return (
    <div className={`carousel-container-${footerControlOrientation}`}>
      <figure className={`carousel-${footerControlOrientation}`} id="carousel">
        <LeftArrow
          currentImgIndex={currentImgIndex}
          imagesLength={images.length}
          setCurrentImgIndex={setCurrentImgIndex}
        />
        <img
          alt="img"
          src={currentImg}
          className={`carousel-images ${isFading ? "fade-out" : ""}`}
        />
        <RightArrow
          currentImgIndex={currentImgIndex}
          imagesLength={images.length}
          setCurrentImgIndex={setCurrentImgIndex}
        />
        {
          footerIndicator ? (
            <CarouselFooter
              currentImgIndex={currentImgIndex}
              imagesLength={images.length}
              setCurrentImgIndex={setCurrentImgIndex}
            />
          ) : null
        }
      </figure>
      {footerControl ? (
        <FooterControl
          images={images}
          footerControlOrientation={footerControlOrientation}
          setCurrentImgIndex={setCurrentImgIndex}
        />
      ) : null}
    </div>
  );
};

export default Carousel;
