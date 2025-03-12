import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import './App.css'

import Home from "./pages/PageHome/Home.jsx";
import PageEvents from './pages/PageEvents/PageEvents.jsx';
import PageJoinus from './pages/PageJoinus/PageJoinus.jsx'
import PageOurTeam from './pages/PageOurTeam/PageOurTeam.jsx'

function App() {
  console.log("App is rendering");
  console.log("Home Component:", Home);

  const [message, setMessage] = useState("")

  return (
      
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<PageEvents />} />
        <Route path="/joinus" element={<PageJoinus />} />
        <Route path="/ourteam" element={<PageOurTeam />} />
      </Routes>
      
      
  );
}

export default App
