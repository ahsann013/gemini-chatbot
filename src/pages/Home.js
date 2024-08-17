import React, { useState } from 'react';
import AiwithText from '../components/AiwithText';
import AiwithImage from '../components/AiwithImage';

const Home = () => {
  const [aiWith, setLAiWith] = useState('text');

  const handleAiWith = (value) => {
    setLAiWith(value);
  }

  return (
    <div className='flex p-2 rounded-xl items-center   flex-col bg-slate-900 min-h-screen min-w-screen'>
      <h1 className='text-white mt-0'>Generative AI Teacher using Google Gemini!</h1>
      

   

      {
        aiWith === 'text' ?
          <AiwithText />
          :
          <AiwithImage />
      }
    </div>
  );
};

export default Home;