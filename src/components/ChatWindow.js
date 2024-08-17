import React, { useEffect, useState } from 'react';

const ChatWindow = ({ messages, onTyping }) => {
    const [typedMessages, setTypedMessages] = useState([]);

    useEffect(() => {
        messages.forEach((message, i) => {
            if (i >= typedMessages.length) {
                if (message.sender === 'ai') {
                    onTyping(true); // Notify that typing has started
                    typeMessage(message.text, i);
                } else {
                    setTypedMessages(current => [...current, message]);
                }
            }
        });
    }, [messages, onTyping]);

    const typeMessage = (text, messageIndex) => {
        let typedText = '';
        let index = 0;
        const typeInterval = setInterval(() => {
            typedText += text.charAt(index);
            index++;
            if (index <= text.length) {
                setTypedMessages(current => {
                    const newMessages = [...current];
                    if (newMessages.length === messageIndex) {
                        newMessages.push({ text: typedText, sender: 'ai' });
                    } else {
                        newMessages[messageIndex] = { ...newMessages[messageIndex], text: typedText };
                    }
                    return newMessages;
                });
            } else {
                clearInterval(typeInterval);
                onTyping(false); // Notify that typing has ended
            }
        }, 0.5); // Adjusted delay for better readability
    };

    return (
        <div className='overflow-y-auto p-0 h-full'>
            {typedMessages.map((msg, index) => (
                <div key={index} className={`py-3 px-2 flex items-center ${msg.sender === 'user' ? 'bg-sky-300 ml-auto' : 'bg-gray-200 mr-auto'} ${msg.image ? 'flex-col' : 'flex-row'}`}>
                    <i className={`fas ${msg.sender === 'user' ? 'fa-user' : 'fa-robot'} text-xl m-2 pr-3`}></i>
                    <div className="text-black">{msg.text}</div>
                    {msg.image && <img src={msg.image} alt="Uploaded content" className="w-1/4 p-4 rounded-xl h-auto mt-2" />}
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;
