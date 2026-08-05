import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SiteContext = createContext(null);

// Inject Google Font dynamically
const applyFont = (fontFamily) => {
  if (!fontFamily || fontFamily === 'Inter') return;
  const id = 'dynamic-google-font';
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
  document.documentElement.style.setProperty('--font-family', `'${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`);
};

// Inject theme CSS variables into :root
const applyTheme = (theme) => {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primaryBg)      root.style.setProperty('--bg', theme.primaryBg);
  if (theme.primaryAccent)  root.style.setProperty('--accent-red', theme.primaryAccent);
  if (theme.secondaryAccent) root.style.setProperty('--accent-red-hover', theme.secondaryAccent);
  if (theme.tertiaryAccent) root.style.setProperty('--accent-red-dim', theme.tertiaryAccent);
  if (theme.primaryText)    root.style.setProperty('--text', theme.primaryText);
  if (theme.mutedText)      root.style.setProperty('--muted', theme.mutedText);
  // Derived values
  if (theme.primaryBg) {
    // bg-2 and bg-3 are slightly lighter variants of primaryBg
    root.style.setProperty('--bg-2', theme.primaryBg);
    root.style.setProperty('--bg-3', theme.primaryBg);
  }
  if (theme.fontFamily) applyFont(theme.fontFamily);
};

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
        applyTheme(data?.theme);
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
export default SiteContext;
