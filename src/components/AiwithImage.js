import React, { useRef,useEffect, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatWindow from './ChatWindow';

const AiwithImage = () => {
    const genAI = new GoogleGenerativeAI('AIzaSyDR1tL3IG1EJ75reAU_j59TCpyl7KIq2SM'); // Replace with your actual API key
    const imgref = useRef(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const [image, setImage] = useState('');
    const [imageInlineData, setImageInlineData] = useState('');
    const [audio, setAudio] = useState('');
    const [audioInlineData, setAudioInlineData] = useState('');
    const [video, setVideo] = useState('');
    const [videoInlineData, setVideoInlineData] = useState('');
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);

    
 
    const aiImageRun = async () => {
        if (!prompt.trim() && !imageInlineData && !audioInlineData && !videoInlineData) return;
        let userMessage = prompt || 'Image, Audio or Video uploaded';
        addMessage(userMessage, 'user', image || audio || video);

        setLoading(true);
        setIsTyping(true);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
            const result = await model.generateContent([prompt, imageInlineData, audioInlineData, videoInlineData]);
            const response = await result.response;
            const text = response.text();
            addMessage(text, 'ai');
        } catch (error) {
            addMessage('Failed to fetch response.', 'ai');
            console.error('Error fetching AI content:', error);
        }

        setLoading(false);
        setIsTyping(false);
        setImage('');
        setAudio('');
        setVideo('');
        setPrompt('');
        setImageInlineData('');
        setAudioInlineData('');
        setVideoInlineData('');
    };

    const addMessage = (text, sender, image = null, audio = null, video = null) => {
        setMessages(prevMessages => [...prevMessages, { text, sender, image, audio, video }]);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await getBase64(file);
            setImage(base64);
            const imagePart = await fileToGenerativePart(file);
            setImageInlineData(imagePart);
        }
    };

    const handleAudioChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await getBase64(file);
            setAudio(base64);
            const audioPart = await fileToGenerativePart(file);
            setAudioInlineData(audioPart);
        }
    };

    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await getBase64(file);
            setVideo(base64);
            const videoPart = await fileToGenerativePart(file);
            setVideoInlineData(videoPart);
        }
    };

    const handleClick = () => {
        aiImageRun();
    };

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleAttachmentClick = () => {
        setShowOptions(!showOptions);
    };

    const handleOptionClick = (option) => {
        setShowOptions(false);
        if (option === 'photo') {
            fileInputRef.current.click();
        } else if (option === 'audio') {
            audioRef.current.click();
        } else if (option === 'video') {
            videoRef.current.click();
        }
    };

    // Converts a File object to a GoogleGenerativeAI.Part object.
    const fileToGenerativePart = async (file) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    };

    return (
        <>
            <h1 className='text-white m-2 bg-slate-900 flex justify-center mt-0'>Generative AI Teacher using Google Gemini!</h1>
            <div className='p-2 bg-gray-400 rounded-xl w-full h-[91vh] flex flex-col max-w-screen justify-end'>
                <div className='bg-white h-full rounded-lg overflow-hidden'>
                    <ChatWindow messages={messages} onTyping={setIsTyping} />
                </div>
                {loading && <p className='text-center text-black font-xl'>Thinking...</p>}
                <div className='flex space-x-3 p-2 items-center relative'>
                    <i className="fa-solid fa-paperclip cursor-pointer" onClick={handleAttachmentClick}></i>
                    {showOptions && (
                        <div className='absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2'>
                            <p className='cursor-pointer p-1 flex items-center' onClick={() => handleOptionClick('photo')}>
                                <i className="fa-solid fa-image mr-2"></i>Photo
                            </p>
                            <p className='cursor-pointer p-1 flex items-center' onClick={() => handleOptionClick('audio')}>
                                <i className="fa-solid fa-microphone mr-2"></i>Audio
                            </p>
                            <p className='cursor-pointer p-1 flex items-center' onClick={() => handleOptionClick('video')}>
                                <i className="fa-solid fa-video mr-2"></i>Video
                            </p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isTyping || loading}
                        style={{ display: 'none' }}
                    />
                    <input
                        type="file"
                        ref={audioRef}
                        accept="audio/*"
                        onChange={handleAudioChange}
                        disabled={isTyping || loading}
                        style={{ display: 'none' }}
                    />
                    <input
                        type="file"
                        ref={videoRef}
                        accept="video/*"
                        onChange={handleVideoChange}
                        disabled={isTyping || loading}
                        style={{ display: 'none' }}
                    />
                    <input
                        className='flex-1 rounded-xl'
                        placeholder='Enter your prompt...'
                        value={prompt}
                        onChange={handlePromptChange}
                        onKeyPress={event => event.key === 'Enter' && handleClick()}
                        disabled={isTyping || loading}
                    />
                    <button
                        className={`px-4 rounded-xl transition duration-200 ${isTyping ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        onClick={handleClick}
                        disabled={isTyping || loading}
                    >
                        Send
                    </button>
                </div>
                {image && <img ref={imgref} src={image} className='w-1/4 p-4 rounded-xl mt-2' alt="Uploaded content" />}
                {audio && <audio ref={audioRef} src={audio} controls className='w-1/4 h-1/5 p-4 rounded-xl mt-2' />}
                {video && <video ref={videoRef} src={video} controls className=' w-1/5  p-4 rounded-xl mt-2' />}
            </div>
        </>
    );
};

export const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject('Error: ', error);
});

export default AiwithImage;
