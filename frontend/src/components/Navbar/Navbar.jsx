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
          <Button href="/events" sx={{ color: "black" }}>Events</Button>
          <Button href="/sponsors" sx={{ color: "black" }}>Services</Button>
          <Button href="/ourteam" sx={{ color: "black" }}>Alumni</Button>
          <Button href="/joinus" sx={{ color: "black" }}>Join us</Button>
          <Button href="/resources" sx={{ color: "black"}}>Resources</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
