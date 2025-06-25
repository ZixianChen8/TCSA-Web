import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Import Router components
import './App.css'

import Home from "./pages/PageHome/Home.jsx";
import PageEvents from './pages/PageEvents/PageEvents.jsx';
import PageJoinus from './pages/PageJoinus/PageJoinus.jsx'
import PageAlumni from './pages/PageAlumni/PageAlumni.jsx'
import PageEventDetails from './pages/PageEventDetails/PageEventDetails.jsx'
import PageServices from './pages/PageServices/PageServices.jsx';
import PageResources from './pages/PageResources/PageResources.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.jsx'
import PageDesigns from './pages/PageDesigns/PageDesigns.jsx'


import Navbar from "./components/Navbar/Navbar.jsx"

function App() {

  const navigate = useNavigate();
  console.log("App is rendering");
  console.log("Home Component:", Home);

  const [message, setMessage] = useState("")

  return (
    <>
      {/* Navbar */}
      <section className="navbar">
        <Navbar />
      </section>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<PageEvents />} />
        <Route path="/joinus" element={<PageJoinus />} />
        <Route path="/alumni" element={<PageAlumni />} />
        <Route path="events/:id" element={<PageEventDetails />} />
        <Route path="/services" element={<PageServices />} />
        <Route path="/resources" element={<PageResources />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/designs" element={<PageDesigns />} />


      </Routes>
    </>
  );
}

export default App
