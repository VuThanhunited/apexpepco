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
  const set = (key, val) => { if (val) root.style.setProperty(key, val); };

  // Global
  set('--bg',              theme.primaryBg);
  set('--accent-red',      theme.primaryAccent);
  set('--accent-red-hover',theme.secondaryAccent);
  set('--accent-red-dim',  theme.tertiaryAccent);
  set('--text',            theme.primaryText);
  set('--muted',           theme.mutedText);
  set('--link-color',      theme.linkColor);
  // Derived bg-2/bg-3 follow primary
  if (theme.primaryBg) {
    set('--bg-2', theme.primaryBg);
    set('--bg-3', theme.primaryBg);
  }

  // Navbar
  set('--navbar-bg',     theme.navbarBg);
  set('--navbar-text',   theme.navbarText);
  set('--navbar-border', theme.navbarBorder);

  // Announcement bar
  set('--ann-bg',   theme.announcementBg);
  set('--ann-text', theme.announcementText);

  // Hero
  set('--hero-bg',       theme.heroBg);
  set('--hero-text',     theme.heroText);
  set('--hero-sub-text', theme.heroSubText);

  // Buttons
  set('--btn-primary-bg',        theme.btnPrimaryBg);
  set('--btn-primary-text',      theme.btnPrimaryText);
  set('--btn-secondary-bg',      theme.btnSecondaryBg);
  set('--btn-secondary-text',    theme.btnSecondaryText);
  set('--btn-secondary-border',  theme.btnSecondaryBorder);

  // Sections & Cards
  set('--section-bg',     theme.sectionBg);
  set('--section-alt-bg', theme.sectionAltBg);
  set('--section-text',   theme.sectionText);
  set('--card-bg',        theme.cardBg);
  set('--card-border',    theme.cardBorder);
  set('--card-text',      theme.cardText);

  // Footer
  set('--footer-bg',      theme.footerBg);
  set('--footer-text',    theme.footerText);
  set('--footer-heading', theme.footerHeading);

  // Age Gate
  set('--agegate-bg',           theme.ageGateBg);
  set('--agegate-text',         theme.ageGateText);
  set('--agegate-sub-text',     theme.ageGateSubText);
  set('--agegate-checkbox',     theme.ageGateCheckbox);
  set('--agegate-btn-bg',       theme.ageGateBtnBg);
  set('--agegate-btn-text',     theme.ageGateBtnText);
  set('--agegate-leave-bg',     theme.ageGateLeaveBg);
  set('--agegate-leave-text',   theme.ageGateLeaveText);
  set('--agegate-leave-border', theme.ageGateLeaveBorder);

  // Font
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
