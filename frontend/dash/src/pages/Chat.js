import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

function Chat() {
  // Prevent any scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! Chat with our AI agent to learn more about your PDFs.' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // No auto-scroll at all

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');

    try {
      const fullToken = localStorage.getItem('token');
      if (!fullToken) throw new Error('No authentication token found');
      const token = fullToken.split('|')[1];
      if (!token) throw new Error('Invalid token format');

      const res = await fetch('http://localhost:8000/api/account/save-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: userMsg.text })
      });
      const data = await res.json();
      setMessages(msgs => [
        ...msgs,
        {
          from: 'ai',
          text: data.answer || 'Sorry, something went wrong.',
          error: !data.success
        }
      ]);
    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { from: 'ai', text: err.message || 'Error contacting AI.', error: true }
      ]);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat with AI</h2>
      <p className="chat-desc">Chat with our AI agent to learn more about your PDFs.</p>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.from === 'user' ? 'user-bubble' : 'ai-bubble'}${msg.error ? ' error-bubble' : ''}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form className="chat-input-row" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button className="chat-send-btn" type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  );
}

export default Chat;