import React, { useState } from 'react';
import axios from 'axios';
import '../styles/chat.css'; // Import the CSS file

const Chat = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error

        try {
            const response = await axios.post('http://localhost:8000/chat/', {
                message: message
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Update conversation state with new messages
            const newMessages = [
                ...conversation,
                { role: 'user', content: message },
                { role: 'assistant', content: response.data.message }
            ];
            setConversation(newMessages);
            setMessage(''); // Clear the input field
        } catch (error) {
            console.error('Error fetching response:', error);
            setError('Failed to get a response from the server.');
        }
    };

    return (
        <div className="chat-container">
            <h1 className="chat-title">Chat with EduTech Assistant</h1>
            <div className="chat-conversation">
                {conversation.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <p><strong>{msg.role}:</strong> {msg.content}</p>
                    </div>
                ))}
            </div>
            <form className="chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleChange}
                />
                <button type="submit" className="chat-button">Send</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Chat;
