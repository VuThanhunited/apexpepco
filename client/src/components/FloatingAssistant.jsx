import { useState } from 'react';
import './FloatingAssistant.css';

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Apex PepCo AI Assistant. Ask anything about peptides, dosing, or what is right for your research goal.' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    "What's a good peptide to lose weight?",
    "Which peptide helps with healing and recovery?",
    "I'm new to peptides — where should I start?",
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
        text: 'All Apex PepCo compounds are 99%+ purity, laboratory grade, and third-party tested with Certificates of Analysis (COAs).'
      }]);
    }, 700);
  };

  const handleSuggestionClick = (query) => {
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'All Apex PepCo compounds undergo strict HPLC and MS testing for 99%+ purity. Always consult a licensed professional before starting research.'
      }]);
    }, 700);
  };

  // Exact 64x64 Robot SVG from astroresearch.health
  const RobotSvg = ({ className = "robot-svg" }) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <ellipse cx="32" cy="50" rx="14" ry="11" fill="#e8eef4"></ellipse>
      <ellipse cx="32" cy="49" rx="10" ry="8" fill="#f4f7fa"></ellipse>
      <rect x="27" y="46" width="10" height="7" rx="2" fill="#c8d6e5"></rect>
      <circle cx="30" cy="49" r="1.5" fill="#3b82f6"></circle>
      <circle cx="34" cy="49" r="1.5" fill="#22c55e"></circle>
      <ellipse cx="17" cy="46" rx="5" ry="7" fill="#e8eef4" transform="rotate(-15 17 46)"></ellipse>
      <ellipse cx="14" cy="52" rx="4" ry="4" fill="#d1dce8"></ellipse>
      <ellipse cx="47" cy="46" rx="5" ry="7" fill="#e8eef4" transform="rotate(15 47 46)"></ellipse>
      <ellipse cx="50" cy="52" rx="4" ry="4" fill="#d1dce8"></ellipse>
      <circle cx="32" cy="26" r="20" fill="#dde6ef"></circle>
      <circle cx="32" cy="26" r="17" fill="#c8d6e5"></circle>
      <ellipse cx="32" cy="27" rx="13" ry="12" fill="#1a2744"></ellipse>
      <ellipse cx="26" cy="20" rx="5" ry="3" fill="white" opacity="0.35" transform="rotate(-20 26 20)"></ellipse>
      <ellipse cx="23" cy="23" rx="2" ry="1.2" fill="white" opacity="0.25" transform="rotate(-23 23 23)"></ellipse>
      <ellipse cx="12" cy="26" rx="4" ry="5" fill="#c8d6e5"></ellipse>
      <ellipse cx="52" cy="26" rx="4" ry="5" fill="#c8d6e5"></ellipse>
      <ellipse cx="36" cy="10" rx="5" ry="3" fill="white" opacity="0.4" transform="rotate(20 36 10)"></ellipse>
    </svg>
  );

  return (
    <div className="floating-assistant-wrapper">
      {open ? (
        <div className="astro-chat-dialog">
          <div className="astro-chat-header">
            <div className="astro-header-left">
              <div className="astro-avatar-wrapper">
                <RobotSvg className="w-6 h-6" />
              </div>
              <div className="astro-header-titles">
                <strong className="astro-title-text">Ask Apex</strong>
                <span className="astro-subtitle-text">RESEARCH ASSISTANT</span>
              </div>
            </div>
            <button className="astro-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="astro-disclaimer-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="disclaimer-icon">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
            <span>Always consult a licensed professional before starting any new compound.</span>
          </div>

          <div className="astro-chat-body">
            <div className="astro-intro-text">
              Ask anything about peptides, dosing, or what's right for your goal.
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`astro-msg ${m.sender}`}>
                <p>{m.text}</p>
              </div>
            ))}

            {messages.length <= 2 && (
              <div className="astro-suggestions-list">
                {suggestions.map((s, idx) => (
                  <button key={idx} className="astro-suggestion-item" onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="astro-chat-footer">
            <input
              type="text"
              placeholder="Ask a question…"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="astro-chat-input"
              id="assistant-input"
            />
            <button type="submit" className="astro-send-btn" id="assistant-send-btn" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Zm0 0L11 13"/>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button
          className="astro-floating-btn"
          onClick={() => setOpen(true)}
          id="open-assistant-btn"
          aria-label="Ask Apex Research Assistant"
          data-testid="button-ask-astro-open"
        >
          <RobotSvg className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default FloatingAssistant;
