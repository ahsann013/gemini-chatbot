import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatWindow from './ChatWindow';

const AiwithText = () => {
    const genAI = new GoogleGenerativeAI('AIzaSyDR1tL3IG1EJ75reAU_j59TCpyl7KIq2SM'); // Replace with your actual API key
    const [search, setSearch] = useState('');
    const [image, setImage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef(null);

    const aiRun = async () => {
        if (!search.trim() && !image) return;
        let userMessage = search || 'Image uploaded';
        addMessage(userMessage, 'user');
        setLoading(true);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let prompt = search ? `Briefly and concisely describe: ${search}` : '';
        if (image) {
            prompt += ` and also describe this image: ${image}`;
        }

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/\*{2}/g, '');
            addMessage(text, 'ai');
        } catch (error) {
            addMessage('Failed to fetch response.', 'ai');
            console.error('Error fetching AI content:', error);
        }
        setLoading(false);
        setImage('');
        setSearch('');
    };

    const addMessage = (text, sender) => {
        setMessages(prevMessages => [...prevMessages, { text, sender }]);
    };

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await getBase64(file);
            setImage(base64);
            aiRun();
        }
    };

    const handleClick = () => {
        if (!isTyping && (search.trim() || image)) {
            aiRun();
        }
    };

    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className='p-2 mt-2 bg-gray-400 rounded-xl w-full h-[85vh] flex flex-col justify-end'>
            <div className='bg-white h-full rounded-lg overflow-hidden'>
                <ChatWindow messages={messages} onTyping={setIsTyping} />
            </div>
            {loading && <p className='text-center text-black font-xl'>Thinking...</p>}
            <div className='flex space-x-4 p-2 items-center'>
                <i className="fa-solid fa-paperclip cursor-pointer" onClick={handleAttachmentClick}></i>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isTyping || loading}
                    style={{ display: 'none' }}
                />
                <input
                    className='flex-1 p-2 rounded-xl'
                    placeholder='Type in any topic to learn about...'
                    value={search}
                    onChange={handleChangeSearch}
                    onKeyPress={event => event.key === 'Enter' && handleClick()}
                    disabled={isTyping || loading}
                />
                <button
                    className={`px-4 py-2 rounded-xl transition duration-200 ${isTyping ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-black`}
                    onClick={handleClick}
                    disabled={isTyping || loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject('Error: ', error);
});

export default AiwithText;
