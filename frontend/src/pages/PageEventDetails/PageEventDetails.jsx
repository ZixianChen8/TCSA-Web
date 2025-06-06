// src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "@/components/Navbar/Navbar.jsx";
import SecHero from "@/components/SecHero/SecHero.jsx";
import styles from "./PageEventDetails.module.css";

const PageEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [registering, setRegistering] = useState(false);

  // Fetch event details from the backend
  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/api/events/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.data) {
          setEvent(res.data);
          setError(null);
        } else {
          setError("No event data received");
        }
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setError(err.response?.data?.error || "Failed to load event details. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setMessage('');
    
    console.log('Submitting registration form:', formData);
    
    try {
      console.log(`Posting to http://127.0.0.1:8000/api/events/${id}/register/`);
      const response = await axios.post(
        `http://127.0.0.1:8000/api/events/${id}/register/`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      console.log('Registration successful!', response.data);
      setMessage('Registration successful! You are now registered for this event.');
      // Clear the form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      console.error("Error details:", err.response?.data || err.message);
      setMessage(`Registration failed: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className={styles.loadingContainer}>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />

    <h2 className={styles.bigTitle}>{event?.title}</h2>
{/* 
      <SecHero
        title={event?.title || "Event Details"}
        message={event?.description || "Loading event information..."}
        showBtn={false}
      /> */}
      
      <div className={styles.content}>

        <div className={styles.eventInfo}>
          {/* <h2>{event?.title}</h2> */}
          <p>{event?.description}</p>
          <div className={styles.eventDetails}>
            <p><strong>Date: </strong>April 5, 2025</p>
            {/* <p><strong>Date:</strong> {event?.date}</p> */}
            <p><strong>Location:</strong> {event?.location}</p>
            <p><strong>Organizer:</strong> {event?.organizer}</p>
          </div>
        </div>

        <div className={styles.lowLevel}>

          <div className={styles.eventPoster}>
            {event?.poster ? (
              <img src={event.poster} alt="Event Poster" className={styles.posterImg} />
            ) : (
              <div className={styles.noPoster}>No poster available</div>
            )}
          </div>




          <div className={styles.registrationForm}>
            <h3>Register for this Event</h3>
            {message && (
              <div className={`${styles.message} ${message.includes('successful') ? styles.success : styles.error}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="first_name">First Name:</label>
                <input 
                  type="text" 
                  id="first_name"
                  name="first_name" 
                  value={formData.first_name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="last_name">Last Name:</label>
                <input 
                  type="text" 
                  id="last_name"
                  name="last_name" 
                  value={formData.last_name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={registering}
              >
                {registering ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>

        </div>




      </div>
    </div>
  );
};

export default PageEventDetails;