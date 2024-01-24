'use client'
import { useState } from 'react';
import './style.css';
import attributes from './attributes.json';
import Description from './description.mdx';


console.log('Attributes:', attributes);


export default function Home() {
  const num_attr = attributes.map((attribute) => attribute['attributes'].length).reduce((a, b) => a + b, 0);
  const [prompt, setPrompt] = useState('');
  const [basePrompt, setBasePrompt] = useState(0);
  const [scales, setScales] = useState(Array(num_attr).fill(0));
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
    console.log('Calling API with:', { prompt, scales, seed });
    fetch('./predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        scales: scales.join(','),
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
        <img src={resultURL} className="result-image" />
        {activeRequests > 0 && (
          <div className="loading-overlay"><div className='lds-dual-ring'></div></div>
        )}
      </div>
      <div className="prompt-container">
        <div>
          <label htmlFor="seed">Base Prompt</label>
          <select id='base-prompt' value={basePrompt} onChange={handleInputChange(setBasePrompt)}>
            {attributes.map((attribute, i) => (
              <option key={i} value={i}>{attribute['base_prompt']}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prompt">Prompt Continuation</label>
          <input
            id="extra-prompt"
            type="text"
            value={prompt}
            onChange={handleInputChange(setPrompt)}
            className="text-input"
            placeholder="e.g. cyberpunk style"
          />
        </div>
      </div>
      <div className="sliders">
        {attributes[basePrompt].attributes.map(({ attribute, prompt }, i) => {
          const index = attributes.reduce((a, b, j) => j < basePrompt ? a + b.attributes.length : a, 0) + i;
          return (
            <div className="slider" key={attribute} title={prompt}>
              <label htmlFor={`value-${attribute}`}>{attribute}</label>
              <input
                id={`value-${attribute}`}
                type="range"
                min="-5"
                max="5"
                value={scales[index]}
                onChange={handleInputChange((x) => {setScales(prev => {prev[index] = x; return [...prev]})})}
              />
            </div>
          )
        })}
        {/* <div className="slider">
          <label htmlFor="value1">Smiling </label>
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
          <label htmlFor="value2">Old </label>
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
          <label htmlFor="value3">Cyberpunk </label>
          <input
            id="value3"
            type="range"
            min="-5"
            max="5"
            value={value3}
            onChange={handleInputChange(setValue3)}
          />
        </div> */}
      </div>
      <div id="description">
        <Description/>
      </div>
    </div>
  );
}
