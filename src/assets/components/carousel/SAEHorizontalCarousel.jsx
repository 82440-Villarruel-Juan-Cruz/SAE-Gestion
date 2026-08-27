import { Box, IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SAEHorizontalCarousel({
  items = [],
  slidesToShow = 1,
  getKey,
  renderItem,
  activeIndicatorColor = "white",
  indicatorColor = "rgba(255,255,255,0.45)",
  controlsSx,
  sliderSettings,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const visibleSlides = Math.max(Math.floor(slidesToShow), 1);
  const maxIndex = Math.max(items.length - visibleSlides, 0);
  const safeActiveIndex = Math.min(activeIndex, maxIndex);
  const dotIndexes = Array.from({ length: maxIndex + 1 }, (_, index) => index);

  const carouselSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: visibleSlides,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    responsive: [],
    ...sliderSettings,
    beforeChange: (current, next) => {
      setActiveIndex(Math.min(next, maxIndex));
      sliderSettings?.beforeChange?.(current, next);
    },
  };

  const goTo = (nextIndex) => {
    const clampedIndex = Math.min(Math.max(nextIndex, 0), maxIndex);
    setActiveIndex(clampedIndex);
    sliderRef.current?.slickGoTo(clampedIndex);
  };

  const handlePrev = () => {
    goTo(safeActiveIndex === 0 ? maxIndex : safeActiveIndex - 1);
  };

  const handleNext = () => {
    goTo(safeActiveIndex >= maxIndex ? 0 : safeActiveIndex + 1);
  };

  if (!items.length) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Slider ref={sliderRef} {...carouselSettings}>
        {items.map((item, index) => (
          <Box key={getKey?.(item, index) ?? index} sx={{ height: "100%" }}>
            {renderItem(item, index)}
          </Box>
        ))}
      </Slider>

      {items.length > visibleSlides && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{
            zIndex: 20,
            backgroundColor: "transparent",
            borderRadius: 2,
            mt: { xs: 2, md: 1 },
            position: "relative",
            ...controlsSx,
          }}
        >
          <IconButton onClick={handlePrev}>
            <ArrowBackIosNewIcon />
          </IconButton>

          <Stack direction="row" spacing={1.5}>
            {dotIndexes.map((index) => (
              <Box
                key={index}
                onClick={() => goTo(index)}
                sx={{
                  width: safeActiveIndex === index ? 42 : 12,
                  cursor: safeActiveIndex !== index ? "pointer" : "default",
                  height: 12,
                  borderRadius: 20,
                  bgcolor:
                    safeActiveIndex === index
                      ? activeIndicatorColor
                      : indicatorColor,
                  transition: "all .3s ease",
                }}
              />
            ))}
          </Stack>

          <IconButton onClick={handleNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}
