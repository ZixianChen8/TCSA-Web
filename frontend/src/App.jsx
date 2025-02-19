import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import './App.css'

import Home from "./pages/PageHome/Home.jsx";


function App() {
  console.log("App is rendering");
  console.log("Home Component:", Home);

  const [message, setMessage] = useState("")

  return (
      
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      
  );
}

export default App
