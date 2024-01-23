'use client'
import { useState } from 'react';


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [seed, setSeed] = useState(42);
  const [timer, setTimer] = useState(null);
  const [resultURL, setResultURL] = useState('');

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(callApi, 300));
  };

  const callApi = () => {
    console.log('Calling API with:', { prompt, value1, value2, value3 });
    fetch('./predictions', {
      method: 'GET',
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
        console.log('Success:', data);
        setResultURL(data.result);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h1>SDXL Turbo H Space Modification</h1>
      <img src={resultURL} height={512} width={512} />
      <input
        type="text"
        value={prompt}
        onChange={handleInputChange(setPrompt)}
      />
      <input
        type="range"
        min="-5"
        max="5"
        value={value1}
        onChange={handleInputChange(setValue1)}
      />
      <input
        type="range"
        min="-5"
        max="5"
        value={value2}
        onChange={handleInputChange(setValue2)}
      />
      <input
        type="range"
        min="-5"
        max="5"
        value={value3}
        onChange={handleInputChange(setValue3)}
      />
    </div>
  );
}
