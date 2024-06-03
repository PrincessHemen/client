import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ socket, username, room, messages, darkMode, sendMessage }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const chatBodyRef = useRef(null);

    const handleSendMessage = async () => {
        if (currentMessage !== "") {
            await sendMessage(currentMessage);
            setCurrentMessage(""); // Clear the input field after sending the message
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={`chat-box ${darkMode ? 'dark-mode' : ''}`}>
            <div className={`chat-header ${darkMode ? 'dark-mode' : ''}`}>
                <p>Live Chat</p>
            </div>

            <div className={`chat-body ${darkMode ? 'dark-mode' : ''}`} ref={chatBodyRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.author === username ? 'sent' : 'received'} ${darkMode ? 'dark-mode' : ''}`}
                    >
                        <div className="message-content">
                            <p>{message.message}</p>
                        </div>
                        <div className="message-info">
                            <span className="message-author">{message.author}</span>
                            <span className="message-time">{message.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`chat-footer ${darkMode ? 'dark-mode' : ''}`}>
                <input
                    type="text"
                    placeholder='Hey...'
                    value={currentMessage}
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyPress={(event) => { if (event.key === 'Enter') handleSendMessage(); }}
                />
                <button onClick={handleSendMessage}>&#9658;</button>
            </div>
        </div>
    );
};

export default Chat;
