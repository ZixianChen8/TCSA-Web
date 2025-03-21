import { useState, useRef, useEffect, use } from "react";
import { Paper, Typography, Box } from "@mui/material";
import GalleryControls from "./GalleryControls";
import GalleryImages from "./GalleryImages";

const Gallery = () => {
  const [hover, setHover] = useState(false);
  const [direction, setDirection] = useState("right"); // Track scroll direction
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true); // Auto-scroll state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Track button state
  const galleryRef = useRef(null);

  // Scrolling function (manual & auto)
  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      const scrollAmount = window.innerWidth;
      galleryRef.current.scrollBy({ left: dir === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });

      // Toggle direction if at the end/start
      if (dir === "right" && galleryRef.current.scrollLeft + galleryRef.current.clientWidth >= galleryRef.current.scrollWidth) {
        setDirection("left");
      } else if (dir === "left" && galleryRef.current.scrollLeft <= 0) {
        setDirection("right");
      }
    }
  };

  // Handle manual click (disables auto-scroll for 5 seconds) and Track button state
  const handleManualScroll = (dir) => {
    if (isButtonDisabled) return; 

    setIsButtonDisabled(true); 
    scrollGallery(dir); 

    setTimeout(() => {
      setIsButtonDisabled(false); 
    }, 700);

    setAutoScrollEnabled(false); 
    setTimeout(() => setAutoScrollEnabled(true), 5000);
  };

  // Auto-scroll every 5 seconds (only if enabled)
  useEffect(() => {
    if (!autoScrollEnabled) return; // Skip auto-scroll when disabled

    const interval = setInterval(() => scrollGallery(direction), 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [direction, autoScrollEnabled]); // Rerun when direction or autoScrollEnabled changes


  return (
    <Paper
      elevation={3}
      sx={{
        width: "100vw",
        height: "60vh",
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          top: 10,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          width: "100%"
        }}
      >
        Gallery
      </Typography>

      {/* Image Slider + Controls */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          alignItems: "center",
        }}
      >
        <GalleryControls hover={hover} onScroll={handleManualScroll} />
        <GalleryImages galleryRef={galleryRef} />
      </Box>
    </Paper>
  );
};

export default Gallery;
