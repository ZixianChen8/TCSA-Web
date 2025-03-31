import { AppBar, Toolbar, Box, Button } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
        
        {/* Left Side: Logo with Hover and Click Effects */}
        <Box 
          component="a" 
          href="/" 
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            "&:active": { transform: "scale(0.95)" }
          }}
        >
          <Box 
            component="img" 
            src="/TCSA_logo.jpg" 
            alt="TCSA Logo" 
            loading="lazy"
            sx={{
              height: { xs: "40px", md: "60px" }, // Responsive size
              width: "auto",
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "scale(1.1)" }
            }}
          />
        </Box>

        {/* Right Side: Navigation Links */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button href="/events" sx={{ color: "black" }}>Events</Button>
          <Button href="#" sx={{ color: "black"}}>Resources</Button>
          <Button href="/joinus" sx={{ color: "black" }}>Join us</Button>
          <Button href="/ourteam" sx={{ color: "black" }}>Alumni</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
