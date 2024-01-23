'use client'
import { useState } from 'react';
import './style.css';


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [seed, setSeed] = useState(42);
  const [timer, setTimer] = useState(null);
  const [resultURL, setResultURL] = useState('');
  const [activeRequests, setActiveRequests] = useState(0);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(callApi, 300));
  };

  const callApi = () => {
    setActiveRequests(prev => prev + 1);
    console.log('Calling API with:', { prompt, value1, value2, value3 });
    fetch('./predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        scales: [value1, value2, value3].join(','),
        diffusion_steps: 1,
        seed: seed,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Success:', data);
          setResultURL(data.result);
        } else {
          console.error('Error (from API):', data.error);
        }
        setActiveRequests(prev => prev - 1);
      })
      .catch(error => {
        console.error('Error:', error);
        setActiveRequests(prev => prev - 1);
      });
  };

  return (
    <div className="container">
      <h1 className="title">SDXL Turbo H Space Modification</h1>
      <div className="image-container">
        <img src={resultURL} alt="Result" className="result-image" />
        {activeRequests > 0 && (
          <div className="loading-animation">Loading...</div>
        )}
      </div>
      <div className="input-container">
        <label htmlFor="prompt">Prompt: </label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={handleInputChange(setPrompt)}
          className="text-input"
          placeholder="Enter your prompt"
        />
      </div>
      <div className="sliders">
        <div className="slider">
          <label htmlFor="value1">Smiling: </label>
          <input
            id="value1"
            type="range"
            min="-5"
            max="5"
            value={value1}
            onChange={handleInputChange(setValue1)}
          />
        </div>
        <div className="slider">
          <label htmlFor="value2">Old: </label>
          <input
            id="value2"
            type="range"
            min="-5"
            max="5"
            value={value2}
            onChange={handleInputChange(setValue2)}
          />
        </div>
        <div className="slider">
          <label htmlFor="value3">Cyberpunk: </label>
          <input
            id="value3"
            type="range"
            min="-5"
            max="5"
            value={value3}
            onChange={handleInputChange(setValue3)}
          />
        </div>
      </div>
    </div>
  );
}
