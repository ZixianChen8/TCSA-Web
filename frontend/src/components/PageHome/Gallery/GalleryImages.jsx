import { Box } from "@mui/material";

const galleryImages = [
  "/gallery_images/image1.jpg",
  "/gallery_images/image2.jfif",
  "/gallery_images/image3.jfif",
  "https://cdn.discordapp.com/attachments/687166132397932564/1352087158877327430/IMG20250319211118.jpg?ex=67dcbccb&is=67db6b4b&hm=32a158ee4e53d56b5cca49a32dbffc1d912b4360227bbd895aa626f4aef5fbe4&",
];

const GalleryImages = ({ galleryRef }) => {
  return (
    <Box 
      ref={galleryRef}
      sx={{
        display: "flex",
        overflowX: "auto",
        scrollBehavior: "smooth",
        width: "100%",
        height: "100%",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" }  // Hide scrollbar
      }}
    >
      {galleryImages.map((src, index) => (
        <Box 
          key={index}
          sx={{
            minWidth: "100vw",
            height: "100%",
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
    </Box>
  );
};

export default GalleryImages;
