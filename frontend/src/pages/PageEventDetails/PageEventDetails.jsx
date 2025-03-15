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
    phone: '',
    wechat_id: '',
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
    
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/events/${id}/register/`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      setMessage('Registration successful! You are now registered for this event.');
      // Clear the form
      setFormData({
        first_name: '',
        last_name: '',
        phone: '',
        wechat_id: '',
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setMessage('Registration failed. Please try again later.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={styles.loadingContainer}>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <SecHero
        title={event?.title || "Event Details"}
        message={event?.description || "Loading event information..."}
        showBtn={false}
      />
      
      <div className={styles.content}>
        <div className={styles.eventInfo}>
          <h2>{event?.title}</h2>
          <p>{event?.description}</p>
          <div className={styles.eventDetails}>
            <p><strong>Date:</strong> {event?.date}</p>
            <p><strong>Location:</strong> {event?.location}</p>
            <p><strong>Organizer:</strong> {event?.organizer}</p>
          </div>
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
              <label htmlFor="phone">Phone:</label>
              <input 
                type="tel" 
                id="phone"
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="wechat_id">WeChat ID:</label>
              <input 
                type="text" 
                id="wechat_id"
                name="wechat_id" 
                value={formData.wechat_id}
                onChange={handleChange}
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
  );
};

export default PageEventDetails;