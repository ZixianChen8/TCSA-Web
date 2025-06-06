import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // Import Router components
import './App.css'

import Home from "./pages/PageHome/Home.jsx";
import PageEvents from './pages/PageEvents/PageEvents.jsx';
import PageJoinus from './pages/PageJoinus/PageJoinus.jsx'
import PageOurTeam from './pages/PageOurTeam/PageOurTeam.jsx'
import PageEventDetails from './pages/PageEventDetails/PageEventDetails.jsx'
import PageSponsors from './pages/PageSponsors/PageSponsors.jsx';
import PageResources from './pages/PageResources/PageResources.jsx'

import Navbar from "./components/Navbar/Navbar.jsx"
import Dock from './components/Dock/Dock.jsx';
import { VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';

function App() {

  useEffect(() => {
    const dock = document.querySelector('.dock');
    function onScroll() {
      if (window.scrollY > 0) {
        dock.classList.add('show');
      } else {
        dock.classList.remove('show');
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll(); // set initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = useNavigate();
  console.log("App is rendering");
  console.log("Home Component:", Home);

  const [message, setMessage] = useState("")

  const EventIcon = (
    <svg
      width={24}
      height={24}
      fill="#000000"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M2.67 10.73a3.52 3.52 0 0 0-.94 1.93 5 5 0 0 0-.07 1.1v.58h.8a5.05 5.05 0 0 0 .88-.08 3.46 3.46 0 0 0 1.93-.94 1.76 1.76 0 0 0-.14-2.48 1.76 1.76 0 0 0-2.46-.11zm1.74 1.73a2.26 2.26 0 0 1-1.26.6h-.22v-.22a2.26 2.26 0 0 1 .6-1.26.36.36 0 0 1 .24-.08.67.67 0 0 1 .47.22.54.54 0 0 1 .17.74zM14.65 2.24a.91.91 0 0 0-.89-.89A8.75 8.75 0 0 0 7.27 3.5L5.64 5.4l-2.4-.5a1 1 0 0 0-.92.27l-.68.68a1 1 0 0 0-.28.81 1 1 0 0 0 .45.74l2.06 1.32.13.08 3.2 3.25.08.08 1.32 2.06a1 1 0 0 0 .74.45h.11a1 1 0 0 0 .7-.29l.68-.68a1 1 0 0 0 .27-.92l-.5-2.39 1.84-1.58a8.79 8.79 0 0 0 2.21-6.54zM3.11 6.15l1.32.28-.64.75-1-.67zm6.38 7.1-.67-1 .75-.64.28 1.32zm2.39-5.11.18.17zm-.28-.28L7.92 11 5 8.08 8.14 4.4a7.44 7.44 0 0 1 5.26-1.8 7.48 7.48 0 0 1-1.8 5.26z"></path>
        <path d="M11.13 6.63a1.19 1.19 0 0 0-.06-1.7 1.16 1.16 0 1 0-1.64 1.63 1.2 1.2 0 0 0 1.7.07z"></path>
      </g>
    </svg>
  );

  const ServicesIcon = (
    <svg
      width={26}
      height={26}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M12 7C9.23858 7 7 9.23858 7 12C7 13.3613 7.54402 14.5955 8.42651 15.4972C8.77025 15.8484 9.05281 16.2663 9.14923 16.7482L9.67833 19.3924C9.86537 20.3272 10.6862 21 11.6395 21H12.3605C13.3138 21 14.1346 20.3272 14.3217 19.3924L14.8508 16.7482C14.9472 16.2663 15.2297 15.8484 15.5735 15.4972C16.456 14.5955 17 13.3613 17 12C17 9.23858 14.7614 7 12 7Z"
          stroke="#000000"
          strokeWidth="2"
        ></path>
        <path
          d="M12 4V3"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M18 6L19 5"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M20 12H21"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M4 12H3"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M5 5L6 6"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M10 17H14"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );

  const AlumniIcon = (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.4472 1.10557C12.1657 0.964809 11.8343 0.964809 11.5528 1.10557L4.55279 4.60557C4.214 4.77496 4 5.12123 4 5.5C4 5.87877 4.214 6.22504 4.55279 6.39443L6.58603 7.41105C6.21046 8.19525 6 9.07373 6 10C6 11.8604 6.84668 13.523 8.17572 14.6235C4.98421 15.7459 3 18.2474 3 21C3 21.5523 3.44772 22 4 22C4.55228 22 5 21.5523 5 21C5 18.7306 7.3553 16 12 16C16.6447 16 19 18.7306 19 21C19 21.5523 19.4477 22 20 22C20.5523 22 21 21.5523 21 21C21 18.2474 19.0158 15.7459 15.8243 14.6235C17.1533 13.523 18 11.8604 18 10C18 9.07373 17.7895 8.19525 17.414 7.41105L19.4472 6.39443C19.786 6.22504 20 5.87877 20 5.5C20 5.12123 19.786 4.77496 19.4472 4.60557L12.4472 1.10557ZM12 14C14.2091 14 16 12.2091 16 10C16 9.39352 15.8656 8.81975 15.6248 8.30566L12.4472 9.89443C12.1657 10.0352 11.8343 10.0352 11.5528 9.89443L8.37525 8.30566C8.13443 8.81975 8 9.39352 8 10C8 12.2091 9.79086 14 12 14ZM8.44695 6.10544L7.23607 5.5L12 3.11803L16.7639 5.5L15.5531 6.10544L12 7.88197L8.44695 6.10544Z"
          fill="#000000"
        ></path>
      </g>
    </svg>
  );

  const JoinUsIcon = (
    <svg
      width={21}
      height={21}
      viewBox="0 0 24 24"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>
            {".cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:1.91px;}"}
          </style>
        </defs>
        <path
          className="cls-1"
          d="M6.17,10.86h0A8.16,8.16,0,0,1,14.33,19h0"
        ></path>
        <rect
          className="cls-1"
          x="17.73"
          y="2.48"
          width="4.77"
          height="7.64"
          rx="2.39"
        ></rect>
        <rect
          className="cls-1"
          x="12.95"
          y="1.52"
          width="4.77"
          height="8.59"
          rx="2.39"
        ></rect>
        <path
          className="cls-1"
          d="M11.56,9.89A2.37,2.37,0,0,0,13,7.73V3.91a2.39,2.39,0,1,0-4.77,0V6.19"
        ></path>
        <path
          className="cls-1"
          d="M3.41,7.79V3.91a2.39,2.39,0,1,1,4.77,0V6.19"
        ></path>
        <path
          className="cls-1"
          d="M6.27,23.48V21.57l-.75-.64c-2.57-2.58-4-5.12-4-8.77h0A6,6,0,0,1,3.25,7.94h0A6,6,0,0,1,7.47,6.19h2.2A2.33,2.33,0,0,1,12,8.52h0a2.33,2.33,0,0,1-2.33,2.34H6.17"
        ></path>
        <path
          className="cls-1"
          d="M17.73,23.48V21.57l.75-.64c2.57-2.58,4-5.12,4-8.77h0V7.36"
        ></path>
      </g>
    </svg>
  );

  const ResourcesIcon = (
    <svg
      width={38}
      height={38}
      fill="#000000"
      viewBox="-12.5 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <title>info</title>
        <path d="M5.8 22h-1.64v-7c0-0.48-0.36-0.84-0.84-0.84h-2.48c-0.48 0-0.84 0.36-0.84 0.84s0.36 0.84 0.84 0.84h1.64v6.16h-1.64c-0.48 0-0.84 0.36-0.84 0.84s0.36 0.84 0.84 0.84h4.96c0.44 0 0.84-0.36 0.84-0.84s-0.36-0.84-0.84-0.84zM3.32 13.28c-1.36 0-2.48-1.12-2.48-2.48s1.12-2.48 2.48-2.48 2.48 1.12 2.48 2.48-1.12 2.48-2.48 2.48zM3.32 10c-0.44 0-0.8 0.36-0.8 0.8s0.36 0.8 0.8 0.8 0.8-0.36 0.8-0.8-0.36-0.8-0.8-0.8z"></path>
      </g>
    </svg>
  );

  const dockItems = [
    { icon: EventIcon, label: 'Events', onClick: () => navigate('/events') },
    { icon: ServicesIcon, label: 'Services', onClick: () => navigate('/sponsors') },
    { icon: AlumniIcon, label: 'Alumni', onClick: () => navigate('/ourteam') },
    { icon: JoinUsIcon, label: 'Join us', onClick: () => navigate('/joinus') },
    { icon: ResourcesIcon, label: 'Resources', onClick: () => navigate('/resources') },
  ];

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
        <Route path="/ourteam" element={<PageOurTeam />} />
        <Route path="events/:id" element={<PageEventDetails />} />
        <Route path="/sponsors" element={<PageSponsors />} />
        <Route path="/resources" element={<PageResources />} />
      </Routes>

      <div className="dock">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </>
  );
}

export default App
