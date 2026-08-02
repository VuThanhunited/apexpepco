import { useState } from 'react';
import './FloatingAssistant.css';

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Astro Research AI Assistant. Ask anything about peptides, dosing, or what is right for your research goal.' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    "What's a good peptide to lose weight?",
    "Which peptide helps with healing and recovery?",
    "I'm new to peptides - where should I start?",
    "What's the difference between tirzepatide and semaglutide?"
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'All Astro Research compounds are 99%+ purity, laboratory grade, and third-party tested with Certificates of Analysis (COAs).'
      }]);
    }, 700);
  };

  const handleSuggestionClick = (query) => {
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'All Astro Research compounds undergo strict HPLC and MS testing for 99%+ purity. Always consult a licensed professional before starting research.'
      }]);
    }, 700);
  };

  return (
    <div className="floating-assistant">
      {open ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <div className="assistant-avatar-small">🤖</div>
              <div>
                <strong>Ask Astro</strong>
                <small className="chat-subtitle">AI Research Assistant</small>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close Assistant">✕</button>
          </div>

          <div className="chat-disclaimer">
            ⚠️ Always consult a licensed professional before starting any new research compound.
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.sender}`}>
                <p>{m.text}</p>
              </div>
            ))}

            {messages.length <= 2 && (
              <div className="chat-suggestions">
                {suggestions.map((s, idx) => (
                  <button key={idx} className="suggestion-btn" onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="chat-footer">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              id="assistant-input"
            />
            <button type="submit" id="assistant-send-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button
          className="floating-icon-btn"
          onClick={() => setOpen(true)}
          id="open-assistant-btn"
          aria-label="Open AI Assistant"
        >
          <div className="icon-inner">
            <span className="bot-icon">🤖</span>
            <span className="online-indicator"></span>
          </div>
        </button>
      )}
    </div>
  );
};

export default FloatingAssistant;
