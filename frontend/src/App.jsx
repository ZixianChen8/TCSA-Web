import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css'

import Home from "./pages/PageHome/Home.jsx";
import PageEvents from './pages/PageEvents/PageEvents.jsx';
import PageJoinus from './pages/PageJoinus/PageJoinus.jsx'
import PageAlumni from './pages/PageAlumni/PageAlumni.jsx'
import PageEventDetails from './pages/PageEventDetails/PageEventDetails.jsx';
import PageServices from './pages/PageServices/PageServices.jsx';
import PageResources from './pages/PageResources/PageResources.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.jsx';
import PageDesigns from './pages/PageDesigns/PageDesigns.jsx';
import PagePartnership from './pages/PagePartnership/PagePartnership.jsx';
import PageMembership from './pages/PageMembership/PageMembership.jsx';
import PageMembershipJoin from './pages/PageMembershipJoin/PageMembershipJoin.jsx';
import PageMembershipEvents from './pages/PageMembershipEvents/PageMembershipEvents.jsx';
import PageMembershipEventDetails from './pages/PageMembershipEventDetails/PageMembershipEventDetails.jsx';
import PageMembershipFaq from './pages/PageMembershipFaq/PageMembershipFaq.jsx';
import PageMembershipPolicies from './pages/PageMembershipPolicies/PageMembershipPolicies.jsx';
import PageNotFound from './pages/PageNotFound/PageNotFound.jsx';

import Navbar from "./components/Navbar/Navbar.jsx"

function App() {
  return (
    <>
      <a href="#main-content" className="skipLink">Skip to content</a>
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
        <Route path="/partnerships" element={<PagePartnership />} />
        <Route path="/membership" element={<PageMembership />} />
        <Route path="/membership/join" element={<PageMembershipJoin />} />
        <Route path="/membership/events" element={<PageMembershipEvents />} />
        <Route path="/membership/events/:id" element={<PageMembershipEventDetails />} />
        <Route path="/membership/faq" element={<PageMembershipFaq />} />
        <Route path="/membership/policies" element={<PageMembershipPolicies />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App
