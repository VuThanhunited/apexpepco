import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
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
