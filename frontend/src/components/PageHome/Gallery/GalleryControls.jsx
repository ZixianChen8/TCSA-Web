import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const GalleryControls = ({ hover, onScroll }) => {
  return (
    <>
      {hover && (
        <IconButton 
          onClick={() => onScroll("left")}
          sx={{
            position: "absolute", 
            left: 10, 
            color: "white", 
            background: "rgba(0,0,0,0.5)", 
            "&:hover": { background: "rgba(255,255,255,0.3)" }
          }}
        >
          <ArrowBackIos />
        </IconButton>
      )}

      {hover && (
        <IconButton 
          onClick={() => onScroll("right")}
          sx={{
            position: "absolute", 
            right: 20, 
            color: "white", 
            background: "rgba(0,0,0,0.5)", 
            "&:hover": { background: "rgba(255,255,255,0.3)" }
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      )}
    </>
  );
};

export default GalleryControls;
