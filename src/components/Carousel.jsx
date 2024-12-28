import React, { useState, useEffect, useCallback } from "react";

import { config } from "../config";

import "../pages/styles/Carousel.css";

const apiUrl = config.API_URL;

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/v1/banners`);

        const data = await res.json();

        setBanners(data.data.banners);
      } catch (error) {
        console.error("Error fetching banners", error);
      }
    };
    fetchBanners();
  }, []);

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
          <img src={banner.image.url} alt={`Banner ${index + 1}`} />
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
