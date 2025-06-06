import { AppBar, Toolbar, Box, Button } from "@mui/material";
import Logo from './Logo.jsx'

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
        
        {/* Left Side */}
        <a href="/">
          <Logo />
        </a>


        {/* Right Side: Navigation Links */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button href="/events" sx={{ color: "#8F001A" }}>Events</Button>
          <Button href="/sponsors" sx={{ color: "#1C3144" }}>Services</Button>
          <Button href="/ourteam" sx={{ color: "#1C3144" }}>Alumni</Button>
          <Button href="/joinus" sx={{ color: "#1C3144" }}>Join us</Button>
          <Button href="/resources" sx={{ color: "#1C3144" }}>Resources</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
