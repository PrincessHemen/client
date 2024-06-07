import './App.css';
import Chat from './Components/Chat/Chat';
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';

// Determine the socket URL based on the hostname
const socketURL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://server-33sx.onrender.com";
const socket = io.connect(socketURL);

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", room);
            setShowChat(true);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    const sendMessage = async (currentMessage) => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).toLocaleTimeString(), 
            };

            await socket.emit("send_message", messageData);
        }
    };

    return (
        <div className={`hero ${darkMode ? 'dark-mode' : ''}`}>
            <button className='dark-mode-toggle' onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'} 
            </button> 
            { !showChat ? 
             ( <div className='chat'>
                <h3>Start a Chat</h3>
                <input type="text" placeholder='Name...' onChange={(event) => { setUsername(event.target.value); }} />
                <input type="text" placeholder='Room ID...' onChange={(event) => { setRoom(event.target.value); }} />
                <button onClick={joinRoom}>Join a Room</button>
            </div> )
            :
           ( <Chat socket={socket} username={username} room={room} messages={messages} darkMode={darkMode} sendMessage={sendMessage} /> )
            }
        </div>
    );
}

export default App;
