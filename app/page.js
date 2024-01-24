'use client'
import { useState, useEffect } from 'react';
import './style.css';
import attributes from './attributes.json';
import Description from './description.mdx';

const attributes_list = attributes.map(({base_prompt, attributes}) => attributes.map(({attribute, prompt}) => ({base_prompt, attribute, prompt}))).flat();
const num_attr = attributes_list.length;


export default function Home() {
  const [extraPrompt, setExtraPrompt] = useState('');
  const [basePrompt, setBasePrompt] = useState(0);
  const [scales, setScales] = useState(Array(num_attr).fill(0));
  const [seed, setSeed] = useState(42);
  const [timer, setTimer] = useState(null);
  const [activeRequests, setActiveRequests] = useState(0);
  const [cache, setCache] = useState({});
  const prompt = basePrompt < attributes.length ? attributes[basePrompt]['base_prompt'] + ' ' + extraPrompt : extraPrompt;
  const queryParams = new URLSearchParams({
    prompt: prompt,
    scales: scales.join(','),
    diffusion_steps: 1,
    seed: seed
  }).toString();

  console.log('cache', cache);

  const callApi = (queryParams) => {
    setActiveRequests(prev => prev + 1);
    console.log('Calling API with ', queryParams);
    fetch('./predictions?' + queryParams, {method: 'GET', cache: 'default'})
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Success:', data);
          setCache(prev => ({...prev, [queryParams]: data.result}));
        } else {
          console.error('Error (from API):', data.error);
          // TODO: maybe display toast with error message
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
    if (!(queryParams in cache)) {
      setTimer(setTimeout(callApi, 500, queryParams));
    }
  }, [queryParams]);

  return (
    <div className="container">
      <h1 className="title">SDXL Turbo H Space Modification</h1>
      <div className="image-container">
        <img src={cache[queryParams] || ''} className="result-image" />
        {activeRequests > 0 && (
          <div className="loading-overlay"><div className='lds-dual-ring'></div></div>
        )}
      </div>
      <div className="prompt-container">
        <div>
          <label htmlFor="seed">Base Prompt</label>
          <select id='base-prompt' value={basePrompt} onChange={e => {setBasePrompt(e.target.value); setScales(Array(num_attr).fill(0))}}>
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
            onChange={e => setExtraPrompt(e.target.value)}
            className="text-input"
            placeholder="e.g. photo, colorful"
          />
        </div>
      </div>
      <div className='sliders'>{
        attributes_list.map(({base_prompt, attribute, prompt}, i) => (
          <div className={`slider ${(basePrompt < attributes.length && base_prompt != attributes[basePrompt].base_prompt) ? 'nodisplay' : ''}`} key={`value-${i}`} title={prompt}>
            <label htmlFor={`value-${i}`}>{(basePrompt == attributes.length ? base_prompt + ' - ' : '') + attribute}</label>
            <input
              id={`value-${i}`}
              type="range"
              min="-8"
              max="8"
              value={scales[i]}
              onChange={e => {setScales(prev => {const tmp = [...prev]; tmp[i] = e.target.value; return tmp})}}
            />
          </div>
        ))
      }</div>
      <div id="description">
        <Description/>
      </div>
    </div>
  );
}
