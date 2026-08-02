import { useState } from 'react';
import './FloatingAssistant.css';

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Astro Research AI Assistant. How can I assist with your research compound questions today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'All Astro Research compounds are for laboratory research use only (99%+ purity). Every batch is third-party tested and shipped with a Certificate of Analysis (COA).'
      }]);
    }, 800);
  };

  return (
    <div className="floating-assistant">
      {open ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-dot"></span>
              <strong>Astro Research Assistant</strong>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.sender}`}>
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="chat-footer">
            <input
              type="text"
              placeholder="Ask about compounds, COAs..."
              value={input}
              onChange={e => setInput(e.target.value)}
              id="assistant-input"
            />
            <button type="submit" id="assistant-send-btn">Send</button>
          </form>
        </div>
      ) : (
        <button className="floating-btn" onClick={() => setOpen(true)} id="open-assistant-btn">
          <span className="btn-sparkle">✨</span>
          <span>Ask Astro Research Assistant</span>
        </button>
      )}
    </div>
  );
};

export default FloatingAssistant;
