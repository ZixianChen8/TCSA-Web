import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import Divider from '@mui/material/Divider';
// Utility to read CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Configure axios to include CSRF token and send cookies
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

import Navbar from "@/components/Navbar/Navbar.jsx";
import SecHero from "@/components/SecHero/SecHero.jsx";
import styles from "./PageEventDetails.module.css";

// Format a date string to human-friendly format
const formatDate = (dateString) => {
  if (!dateString) return "Date not specified";
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
};

// Format a time string to human-friendly format
const formatTime = (timeString) => {
  if (!timeString) return "Time not specified";
  try {
    const [hour, minute] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return timeString;
  }
};

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
    axios.get(`/api/events/${id}/`, {
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
      console.log(`Posting to /api/events/${id}/register/`);
      const response = await axios.post(
        `/api/events/${id}/register/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
          withCredentials: true,
        }
      );
      
      console.log('Registration successful!', response.data);
      setMessage('Registration successful! You are now registered for this event.');

      // Send notification to admin
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_REG_AUTO_REPLY_ADMIN_TEMPLATE_ID,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          event_title: event?.title,
          event_date: event?.start_date,
        }
      ).then(
        result => console.log('Admin notification sent:', result.text),
        error => console.error('Admin notification error:', error.text)
      );

      // Send confirmation email to registrant via EmailJS
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_REG_AUTO_REPLY_REGISTRANT_TEMPLATE_ID,
        {
          first_name: formData.first_name,
          email: formData.email,
          event_title: event?.title,
          event_date: event?.start_date,
        }
      ).then(
        result => console.log('Confirmation email sent:', result.text),
        error => console.error('Confirmation email error:', error.text)
      );

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

      <Helmet>
        <title>{event?.title ? `${event.title} - TCSA` : 'Event Details - TCSA'}</title>
      </Helmet>

    <h2 className={styles.bigTitle}>{event?.title}</h2>
{/* 
      <SecHero
        title={event?.title || "Event Details"}
        message={event?.description || "Loading event information..."}
        showBtn={false}
      /> */}
      
      <div className={styles.content}>

        <div className={styles.eventInfo} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div className={styles.eventDescription}>
            <p>{event?.description}</p>
          </div> {/* end of eventDescription */}
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <div className={styles.eventDetails}>
            <p><strong>Date & Time:</strong></p>
            <p>
              {formatDate(event.start_date)}{' '}
              {formatTime(event.start_time)}
            </p>
            <p><strong>Location:</strong></p>
            <p>{event?.location}</p>
            <p><strong>Organizer:</strong></p>
            <p>{event?.organizer}</p>
            <p><strong>Duration:</strong></p>
            <p>{event?.duration}</p>
          </div>
        </div>

        <div className={styles.lowLevel}>

          <div className={styles.eventPoster}>
            {event?.poster_img ? (
              <img src={event.poster_img} alt="Event Poster" className={styles.posterImg} />
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