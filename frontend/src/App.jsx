import React, { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [message, setMessage] = useState("")

  return (
      <div>
        <h1>React+Django</h1>
        <p>{message}</p>
      </div>
  );
}

export default App
