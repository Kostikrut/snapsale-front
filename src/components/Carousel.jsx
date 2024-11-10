import React, { useState, useEffect, useCallback } from "react";
import "../pages/styles/Carousel.css";

const Carousel = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="carousel-container">
      {banners.map((banner, index) => (
        <a
          href={banner.link}
          key={index}
          className="carousel-slide"
          style={{ display: currentIndex === index ? "block" : "none" }}
        >
          <img src={banner.src} alt={`Banner ${index + 1}`} />
        </a>
      ))}
      <button
        onClick={prevSlide}
        className="carousel-arrow carousel-arrow-left"
      >
        &#9664;
      </button>
      <button
        onClick={nextSlide}
        className="carousel-arrow carousel-arrow-right"
      >
        &#9654;
      </button>
    </div>
  );
};

export default Carousel;
