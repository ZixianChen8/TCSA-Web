import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar.jsx";
import SecHero2 from "@/components/SecHero2/SecHero2.jsx" 
import Footer from '@/components/Footer/Footer.jsx'

import CardMember from "@/components/CardMember/CardMember.jsx"

import Divider from '@mui/material/Divider';

import styles from "./PageAlumni.module.css"

import axios from "axios";

const PageAlumni = () => {
    
    const [alumni, setAlumni] = useState([]);
    const [alumniLoading, setAlumniLoading] = useState(true);
    const [alumniError, setAlumniError] = useState(null);

    const [telferAlumni, setTelferAlumni] = useState([]);
    const [telferLoading, setTelferLoading] = useState(true);
    const [telferError, setTelferError] = useState(null);

    useEffect(() => {
      const fetchAlumni = async () => {
        setAlumniLoading(true);
        setAlumniError(null);
        try {
          const { data } = await axios.get("http://127.0.0.1:8000/api/alumni/");
          setAlumni(data);
        } catch (err) {
          console.error("Error fetching alumni:", err);
          setAlumniError("Failed to load alumni");
        } finally {
          setAlumniLoading(false);
        }
      };
      fetchAlumni();
    }, []);
    
    useEffect(() => {
      const fetchTelfer = async () => {
        setTelferLoading(true);
        setTelferError(null);
        try {
          const { data } = await axios.get("http://127.0.0.1:8000/api/telferAlumni/");
          setTelferAlumni(data);
        } catch (err) {
          console.error("Error fetching Telfer alumni:", err);
          setTelferError("Failed to load Telfer alumni");
        } finally {
          setTelferLoading(false);
        }
      };
      fetchTelfer();
    }, []);
    
    return (
        <main>
            <header>
                <SecHero2
                title="MEET THE ALUMNI "
                subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nisl condimentum, volutpat dolor et, tincidunt tortor. Maecenas finibus est eu justo pulvinar blandit."
                />
            </header>
            <Divider> <h2 className={styles.sectionTitle}>Former Club Members</h2> </Divider>
            
            <section className={styles.FCM}>
              {alumniLoading && <p>Loading alumni...</p>}
              {alumniError && <p className={styles.error}>{alumniError}</p>}
              {!alumniLoading && !alumniError && alumni
                .filter(a => a.major !== "Telfer")
                .map(alum => (
                  <CardMember
                    key={alum.id}
                    type="former"
                    name={alum.name}
                    position={alum.position}
                    major={alum.major}
                    email={alum.email}
                    pfp_img={alum.pfp_img}
                  />
              ))}
            </section>
            
             <Divider> <h2 className={styles.sectionTitle}>Telfer Alumni</h2> </Divider>
            <section className={styles.TA}>
              {telferLoading && <p>Loading Telfer alumni...</p>}
              {telferError && <p className={styles.error}>{telferError}</p>}
              {!telferLoading && !telferError && telferAlumni.map(alum => (
                <CardMember
                  key={alum.id}
                  type="telfer"
                  name={alum.name}
                  position={alum.position}
                  major={alum.major}
                  email={alum.email}
                  pfp_img={alum.pfp_img}
                />
              ))}
            </section>
            
            <Footer />

        </main>
        
    )
}
export default PageAlumni;