'use client'
import { useState, useEffect } from 'react';
import './style.css';
import attributes from './attributes.json';
import Description from './description.mdx';


export default function Home() {
  const num_attr = attributes.map((attribute) => attribute['attributes'].length).reduce((a, b) => a + b, 0);
  const [extraPrompt, setExtraPrompt] = useState('');
  const [basePrompt, setBasePrompt] = useState(0);
  const [scales, setScales] = useState(Array(num_attr).fill(0));
  const [seed, setSeed] = useState(42);
  const [timer, setTimer] = useState(null);
  const [resultURL, setResultURL] = useState('');
  const [activeRequests, setActiveRequests] = useState(0);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const callApi = () => {
    setActiveRequests(prev => prev + 1);
    const prompt = basePrompt < attributes.length ? attributes[basePrompt]['base_prompt'] + ' ' + extraPrompt : extraPrompt;
    console.log('Calling API with:', { prompt, scales, seed });
    const queryParams = new URLSearchParams({
      prompt: prompt,
      scales: scales.join(','),
      diffusion_steps: 1,
      seed: seed
    }).toString();
    fetch('./predictions?' + queryParams, {method: 'GET', cache: 'default'})
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

  useEffect(() => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(callApi, 500));
  }, [basePrompt, extraPrompt, scales, seed]);

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
          <select id='base-prompt' value={basePrompt} onChange={handleInputChange(x => {setBasePrompt(x); setScales(Array(num_attr).fill(0))})}>
            {attributes.map((attribute, i) => (
              <option key={i} value={i}>{attribute['base_prompt']}</option>
            ))}
            <option value={attributes.length}>No Base Prompt</option>
          </select>
        </div>
        <div>
          <label htmlFor="prompt">Prompt Continuation</label>
          <input
            id="extra-prompt"
            type="text"
            value={extraPrompt}
            onChange={handleInputChange(setExtraPrompt)}
            className="text-input"
            placeholder="e.g. photo, colorful"
          />
        </div>
      </div>
      <div className='sliders'>{(() => {
        const sliders = [];
        let i = 0;
        for (let j = 0; j < attributes.length; j++) {
          const { base_prompt, attributes: inner_attributes } = attributes[j];
          for (const { attribute, prompt } of inner_attributes) {
            if (basePrompt == attributes.length || basePrompt == j) {
              sliders.push(
                <div className="slider" key={i} title={prompt}>
                  <label htmlFor={`value-${attribute}`}>{(basePrompt == attributes.length ? base_prompt + ' - ' : '') + attribute}</label>
                  <input
                    id={`value-${attribute}`}
                    type="range"
                    min="-8"
                    max="8"
                    value={scales[i]}
                    onChange={((i) => handleInputChange((x) => {setScales(prev => {const tmp = [...prev]; tmp[i] = parseInt(x); return tmp})}))(i)}
                  />
                </div>
              );
            }
            i++;
          }
        }
        console.log(scales);
        return sliders;
      })()}</div>
      <div id="description">
        <Description/>
      </div>
    </div>
  );
}
