import { useState, useEffect } from 'react';
import '../styles/Caroussel.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import hogwartsImg from '../images/hogwarts.webp';
import tlousImg from '../images/tlous.jpg';

interface Slide {
  id: number;
  image: string;
  title: string;
  link?: string;
}

const slides: Slide[] = [
  { id: 1, image: hogwartsImg, title: 'Horizon Forbidden West', link: '' },
  { id: 3, image: tlousImg, title: 'Spider-Man 2', link: '' },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleSlideChange = (newIndex: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFade(true);
    }, 300);
  };

  const goToPrev = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    handleSlideChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    handleSlideChange(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <div className="carousel">
      <button className="nav left" onClick={goToPrev}>
        <ArrowBackIosNewIcon className="arrow-icon" />
      </button>

      <div className="carousel-slide">
        <a href={slides[currentIndex].link}>
          <img
            src={slides[currentIndex].image}
            alt="slide"
            className={fade ? 'fade-in' : 'fade-out'}
          />
        </a>
      </div>

      <button className="nav right" onClick={goToNext}>
        <ArrowForwardIosIcon className="arrow-icon" />
      </button>

      <div className="pagination1">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleSlideChange(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;