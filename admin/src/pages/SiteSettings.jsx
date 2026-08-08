import { useState, useEffect } from 'react';
import api from '../utils/api';
import './SiteSettings.css';

const SiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveSection = async (section, data) => {
    setSaving(true);
    try {
      await api.patch(`/settings/${section}`, data);
      setSettings(prev => ({ ...prev, [section]: data }));
      showToast(`Saved successfully!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const update = (section, key, value) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const updateRoot = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="cms-loading"><div className="admin-spinner-lg"></div><p>Loading settings...</p></div>;
  if (!settings) return <div className="cms-error">Failed to load settings.</div>;

  // SVG icon components - clean monochrome style
  const icons = {
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    shop: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    about: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    product: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    cart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    checkout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    header: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>,
    footer: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>,
    lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    palette: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
    truck: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    star: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    gift: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    megaphone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    target: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    columns: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/></svg>,
    search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    speaker: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
    chart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  };

  const pages = [
    { id: 'home', icon: icons.home, label: 'Home Page', desc: 'Hero, Features, Featured Products, Popup, CTA' },
    { id: 'shop', icon: icons.shop, label: 'Shop Page', desc: 'Page title, subtitle, empty state, products per page' },
    { id: 'about', icon: icons.about, label: 'About Page', desc: 'Hero, Pillars, Standards, Mission, CTA section' },
    { id: 'product', icon: icons.product, label: 'Product Detail', desc: 'Related products title, Add to Cart text' },
    { id: 'cart', icon: icons.cart, label: 'Cart Page', desc: 'Cart title, empty state, button texts' },
    { id: 'checkout', icon: icons.checkout, label: 'Checkout Page', desc: 'Checkout title, success messages' },
    { id: 'header', icon: icons.header, label: 'Header & Nav', desc: 'Logo, Site Name, Announcement Bar' },
    { id: 'footer', icon: icons.footer, label: 'Footer', desc: 'Description, Disclaimer, Copyright' },
    { id: 'agegate', icon: icons.lock, label: 'Age Gate', desc: 'Age verification modal settings' },
    { id: 'theme', icon: icons.palette, label: 'Theme & SEO', desc: 'Colors, Font, SEO meta tags' },
    { id: 'shipping', icon: icons.truck, label: 'Shipping & Policies', desc: 'Free threshold, Standard cost, Shipping Info, Terms of Service' },
  ];

  const currentPage = pages.find(p => p.id === activePage);

  return (
    <div className="cms-page">
      {toast && <div className={`cms-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="cms-header">
        <h1>{icons.settings} Site Settings <span className="cms-badge">CMS</span></h1>
        <p>Manage your website content page by page</p>
      </div>

      <div className="cms-layout">
        {/* Page Navigation */}
        <div className="cms-page-nav">
          {pages.map(page => (
            <button
              key={page.id}
              className={`cms-page-btn ${activePage === page.id ? 'active' : ''}`}
              onClick={() => setActivePage(page.id)}
            >
              <span className="page-icon">{page.icon}</span>
              <span className="page-name">{page.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="cms-panel">
          {currentPage && (
            <div className="page-desc-card">
              <div className="page-desc-icon">{currentPage.icon}</div>
              <div className="page-desc-text">
                <h3>{currentPage.label}</h3>
                <p>{currentPage.desc}</p>
              </div>
            </div>
          )}

          {/* ═══ HOME PAGE ═══ */}
          {activePage === 'home' && (
            <>
              <Panel title="Hero Section" icon={icons.target}>
                <Field label="Title"><input value={settings.hero?.title || ''} onChange={e => update('hero', 'title', e.target.value)} /></Field>
                <Field label="Subtitle"><textarea rows={3} value={settings.hero?.subtitle || ''} onChange={e => update('hero', 'subtitle', e.target.value)} /></Field>
                <Field label="Background Image URL"><input value={settings.hero?.backgroundImage || ''} onChange={e => update('hero', 'backgroundImage', e.target.value)} placeholder="Optional" /></Field>
                <Field label="Primary Button Text"><input value={settings.hero?.primaryButtonText || ''} onChange={e => update('hero', 'primaryButtonText', e.target.value)} /></Field>
                <Field label="Primary Button Link"><input value={settings.hero?.primaryButtonHref || ''} onChange={e => update('hero', 'primaryButtonHref', e.target.value)} /></Field>
                <Field label="Secondary Button Text"><input value={settings.hero?.secondaryButtonText || ''} onChange={e => update('hero', 'secondaryButtonText', e.target.value)} /></Field>
                <Field label="Secondary Button Link"><input value={settings.hero?.secondaryButtonHref || ''} onChange={e => update('hero', 'secondaryButtonHref', e.target.value)} /></Field>
                <div className="field-section">
                  <h4>Badges <span className="field-hint">(checkmarks under title)</span></h4>
                  {settings.hero?.badges?.map((b, i) => (
                    <div key={i} className="array-row">
                      <input placeholder="Icon" value={b.icon} style={{ width: '60px' }} onChange={e => { const badges = [...settings.hero.badges]; badges[i] = { ...b, icon: e.target.value }; update('hero', 'badges', badges); }} />
                      <input placeholder="Text" value={b.text} onChange={e => { const badges = [...settings.hero.badges]; badges[i] = { ...b, text: e.target.value }; update('hero', 'badges', badges); }} />
                      <button className="btn-remove-row" onClick={() => update('hero', 'badges', settings.hero.badges.filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                  <button className="btn-add-row" onClick={() => update('hero', 'badges', [...(settings.hero?.badges || []), { icon: '✓', text: 'New Badge' }])}>+ Add Badge</button>
                </div>
                <SaveBtn onClick={() => saveSection('hero', settings.hero)} saving={saving} />
              </Panel>

              <Panel title="Features Bar" icon={icons.zap}>
                <p className="panel-desc">These features scroll in the marquee strip below the hero.</p>
                {settings.features?.map((f, i) => (
                  <div key={i} className="feature-row"><div className="feature-row-fields">
                    <input className="icon-input" placeholder="Icon" value={f.icon || ''} onChange={e => { const feats = [...settings.features]; feats[i] = { ...f, icon: e.target.value }; updateRoot('features', feats); }} />
                    <input placeholder="Title" value={f.title || ''} onChange={e => { const feats = [...settings.features]; feats[i] = { ...f, title: e.target.value }; updateRoot('features', feats); }} />
                    <input placeholder="Description" value={f.description || ''} onChange={e => { const feats = [...settings.features]; feats[i] = { ...f, description: e.target.value }; updateRoot('features', feats); }} />
                    <button className="btn-remove-row" onClick={() => updateRoot('features', settings.features.filter((_, idx) => idx !== i))}>✕</button>
                  </div></div>
                ))}
                <button className="btn-add-row" onClick={() => updateRoot('features', [...(settings.features || []), { icon: '⚡', title: 'New Feature', description: '', order: settings.features?.length || 0 }])}>+ Add Feature</button>
                <SaveBtn onClick={() => saveSection('features', settings.features)} saving={saving} />
              </Panel>

              <Panel title="Featured Products Section" icon={icons.star}>
                <Field label="Visible"><Toggle id="fs-visible" checked={settings.featuredSection?.isVisible} onChange={v => update('featuredSection', 'isVisible', v)} /></Field>
                <Field label="Section Title"><input value={settings.featuredSection?.title || ''} onChange={e => update('featuredSection', 'title', e.target.value)} /></Field>
                <Field label="Section Subtitle"><input value={settings.featuredSection?.subtitle || ''} onChange={e => update('featuredSection', 'subtitle', e.target.value)} /></Field>
                <div className="info-box">To control which products appear as "Featured", edit individual products and toggle the <strong>Featured</strong> flag.</div>
                <SaveBtn onClick={() => saveSection('featuredSection', settings.featuredSection)} saving={saving} />
              </Panel>

              <Panel title="Promo Popup" icon={icons.gift}>
                <Field label="Enable Popup"><Toggle id="popup-enabled" checked={settings.promoPopup?.isEnabled} onChange={v => update('promoPopup', 'isEnabled', v)} /></Field>
                <Field label="Title"><input value={settings.promoPopup?.title || ''} onChange={e => update('promoPopup', 'title', e.target.value)} /></Field>
                <Field label="Subtitle"><input value={settings.promoPopup?.subtitle || ''} onChange={e => update('promoPopup', 'subtitle', e.target.value)} /></Field>
                <Field label="Description"><textarea rows={3} value={settings.promoPopup?.description || ''} onChange={e => update('promoPopup', 'description', e.target.value)} /></Field>
                <Field label="CTA Button Text"><input value={settings.promoPopup?.ctaText || ''} onChange={e => update('promoPopup', 'ctaText', e.target.value)} /></Field>
                <Field label="CTA Link"><input value={settings.promoPopup?.ctaHref || ''} onChange={e => update('promoPopup', 'ctaHref', e.target.value)} /></Field>
                <Field label="Show After (seconds)"><input type="number" value={settings.promoPopup?.delaySeconds || 3} onChange={e => update('promoPopup', 'delaySeconds', parseInt(e.target.value))} /></Field>
                <SaveBtn onClick={() => saveSection('promoPopup', settings.promoPopup)} saving={saving} />
              </Panel>

              <Panel title="Pre-Footer CTA Section" icon={icons.megaphone}>
                <Field label="Visible"><Toggle id="cta-visible" checked={settings.preFooterCta?.isVisible} onChange={v => update('preFooterCta', 'isVisible', v)} /></Field>
                <Field label="Title"><input value={settings.preFooterCta?.title || ''} onChange={e => update('preFooterCta', 'title', e.target.value)} /></Field>
                <Field label="Subtitle"><input value={settings.preFooterCta?.subtitle || ''} onChange={e => update('preFooterCta', 'subtitle', e.target.value)} /></Field>
                <Field label="Button Text"><input value={settings.preFooterCta?.buttonText || ''} onChange={e => update('preFooterCta', 'buttonText', e.target.value)} /></Field>
                <Field label="Button Link"><input value={settings.preFooterCta?.buttonHref || ''} onChange={e => update('preFooterCta', 'buttonHref', e.target.value)} /></Field>
                <SaveBtn onClick={() => saveSection('preFooterCta', settings.preFooterCta)} saving={saving} />
              </Panel>
            </>
          )}

          {/* ═══ SHOP PAGE ═══ */}
          {activePage === 'shop' && (
            <Panel title="Shop Page Content" icon={icons.shop}>
              <Field label="Page Title"><input value={settings.shopPage?.title || ''} onChange={e => update('shopPage', 'title', e.target.value)} /></Field>
              <Field label="Page Subtitle"><input value={settings.shopPage?.subtitle || ''} onChange={e => update('shopPage', 'subtitle', e.target.value)} /></Field>
              <Field label="Products Per Page"><input type="number" value={settings.shopPage?.productsPerPage || 12} onChange={e => update('shopPage', 'productsPerPage', parseInt(e.target.value))} /></Field>
              <div className="field-section">
                <h4>Empty State <span className="field-hint">(when no products match)</span></h4>
                <Field label="Empty Icon"><input value={settings.shopPage?.emptyIcon || ''} onChange={e => update('shopPage', 'emptyIcon', e.target.value)} style={{ width: '80px' }} /></Field>
                <Field label="Empty Title"><input value={settings.shopPage?.emptyTitle || ''} onChange={e => update('shopPage', 'emptyTitle', e.target.value)} /></Field>
                <Field label="Empty Text"><input value={settings.shopPage?.emptyText || ''} onChange={e => update('shopPage', 'emptyText', e.target.value)} /></Field>
              </div>
              <SaveBtn onClick={() => saveSection('shopPage', settings.shopPage)} saving={saving} />
            </Panel>
          )}

          {/* ═══ ABOUT PAGE ═══ */}
          {activePage === 'about' && (
            <>
              <Panel title="About Hero" icon={icons.about}>
                <Field label="Eyebrow Text"><input value={settings.aboutPage?.eyebrow || ''} onChange={e => update('aboutPage', 'eyebrow', e.target.value)} /></Field>
                <Field label="Hero Title"><input value={settings.aboutPage?.heroTitle || ''} onChange={e => update('aboutPage', 'heroTitle', e.target.value)} /></Field>
                <Field label="Hero Subtitle"><textarea rows={3} value={settings.aboutPage?.heroSubtitle || ''} onChange={e => update('aboutPage', 'heroSubtitle', e.target.value)} /></Field>
                <SaveBtn onClick={() => saveSection('aboutPage', settings.aboutPage)} saving={saving} />
              </Panel>

              <Panel title="Pillars" icon={icons.columns}>
                <p className="panel-desc">The 4 key pillars displayed on the About page.</p>
                {(settings.aboutPage?.pillars || []).map((p, i) => (
                  <div key={i} className="feature-row"><div className="feature-row-fields">
                    <input className="icon-input" placeholder="Icon" value={p.icon || ''} onChange={e => { const pillars = [...(settings.aboutPage?.pillars || [])]; pillars[i] = { ...p, icon: e.target.value }; update('aboutPage', 'pillars', pillars); }} />
                    <input placeholder="Title" value={p.title || ''} onChange={e => { const pillars = [...(settings.aboutPage?.pillars || [])]; pillars[i] = { ...p, title: e.target.value }; update('aboutPage', 'pillars', pillars); }} />
                    <input placeholder="Description" value={p.description || ''} onChange={e => { const pillars = [...(settings.aboutPage?.pillars || [])]; pillars[i] = { ...p, description: e.target.value }; update('aboutPage', 'pillars', pillars); }} />
                    <button className="btn-remove-row" onClick={() => update('aboutPage', 'pillars', (settings.aboutPage?.pillars || []).filter((_, idx) => idx !== i))}>✕</button>
                  </div></div>
                ))}
                <button className="btn-add-row" onClick={() => update('aboutPage', 'pillars', [...(settings.aboutPage?.pillars || []), { icon: '⚡', title: 'New Pillar', description: '' }])}>+ Add Pillar</button>
                <SaveBtn onClick={() => saveSection('aboutPage', settings.aboutPage)} saving={saving} />
              </Panel>

              <Panel title="Standards Section" icon={icons.chart}>
                <Field label="Section Tag"><input value={settings.aboutPage?.standardsTag || ''} onChange={e => update('aboutPage', 'standardsTag', e.target.value)} /></Field>
                <Field label="Section Title"><input value={settings.aboutPage?.standardsTitle || ''} onChange={e => update('aboutPage', 'standardsTitle', e.target.value)} /></Field>
                <Field label="Paragraph 1"><textarea rows={3} value={settings.aboutPage?.standardsText1 || ''} onChange={e => update('aboutPage', 'standardsText1', e.target.value)} /></Field>
                <Field label="Paragraph 2"><textarea rows={3} value={settings.aboutPage?.standardsText2 || ''} onChange={e => update('aboutPage', 'standardsText2', e.target.value)} /></Field>
                <div className="field-section">
                  <h4>Standards List</h4>
                  {(settings.aboutPage?.standardsList || []).map((item, i) => (
                    <div key={i} className="array-row">
                      <input value={item} onChange={e => { const list = [...(settings.aboutPage?.standardsList || [])]; list[i] = e.target.value; update('aboutPage', 'standardsList', list); }} />
                      <button className="btn-remove-row" onClick={() => update('aboutPage', 'standardsList', (settings.aboutPage?.standardsList || []).filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                  <button className="btn-add-row" onClick={() => update('aboutPage', 'standardsList', [...(settings.aboutPage?.standardsList || []), '✓ New standard'])}>+ Add Item</button>
                </div>
                <div className="field-section">
                  <h4>Statistics</h4>
                  {(settings.aboutPage?.stats || []).map((s, i) => (
                    <div key={i} className="array-row">
                      <input placeholder="Value" value={s.value || ''} style={{ width: '100px' }} onChange={e => { const stats = [...(settings.aboutPage?.stats || [])]; stats[i] = { ...s, value: e.target.value }; update('aboutPage', 'stats', stats); }} />
                      <input placeholder="Label" value={s.label || ''} onChange={e => { const stats = [...(settings.aboutPage?.stats || [])]; stats[i] = { ...s, label: e.target.value }; update('aboutPage', 'stats', stats); }} />
                      <button className="btn-remove-row" onClick={() => update('aboutPage', 'stats', (settings.aboutPage?.stats || []).filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                  <button className="btn-add-row" onClick={() => update('aboutPage', 'stats', [...(settings.aboutPage?.stats || []), { value: '100%', label: 'New Stat' }])}>+ Add Stat</button>
                </div>
                <SaveBtn onClick={() => saveSection('aboutPage', settings.aboutPage)} saving={saving} />
              </Panel>

              <Panel title="Mission & CTA" icon={icons.target}>
                <Field label="Mission Title"><input value={settings.aboutPage?.missionTitle || ''} onChange={e => update('aboutPage', 'missionTitle', e.target.value)} /></Field>
                <Field label="Mission Text"><textarea rows={3} value={settings.aboutPage?.missionText || ''} onChange={e => update('aboutPage', 'missionText', e.target.value)} /></Field>
                <Field label="CTA Title"><input value={settings.aboutPage?.ctaTitle || ''} onChange={e => update('aboutPage', 'ctaTitle', e.target.value)} /></Field>
                <Field label="CTA Subtitle"><input value={settings.aboutPage?.ctaSubtitle || ''} onChange={e => update('aboutPage', 'ctaSubtitle', e.target.value)} /></Field>
                <Field label="Primary Button Text"><input value={settings.aboutPage?.ctaPrimaryText || ''} onChange={e => update('aboutPage', 'ctaPrimaryText', e.target.value)} /></Field>
                <Field label="Primary Button Link"><input value={settings.aboutPage?.ctaPrimaryHref || ''} onChange={e => update('aboutPage', 'ctaPrimaryHref', e.target.value)} /></Field>
                <Field label="Secondary Button Text"><input value={settings.aboutPage?.ctaSecondaryText || ''} onChange={e => update('aboutPage', 'ctaSecondaryText', e.target.value)} /></Field>
                <Field label="Secondary Button Link"><input value={settings.aboutPage?.ctaSecondaryHref || ''} onChange={e => update('aboutPage', 'ctaSecondaryHref', e.target.value)} /></Field>
                <SaveBtn onClick={() => saveSection('aboutPage', settings.aboutPage)} saving={saving} />
              </Panel>
            </>
          )}

          {/* ═══ PRODUCT DETAIL ═══ */}
          {activePage === 'product' && (
            <Panel title="Product Detail Page" icon={icons.product}>
              <Field label="Related Products Title"><input value={settings.productDetailPage?.relatedTitle || ''} onChange={e => update('productDetailPage', 'relatedTitle', e.target.value)} /></Field>
              <Field label="Related Products Subtitle"><input value={settings.productDetailPage?.relatedSubtitle || ''} onChange={e => update('productDetailPage', 'relatedSubtitle', e.target.value)} /></Field>
              <Field label="Add to Cart Button Text"><input value={settings.productDetailPage?.addToCartText || ''} onChange={e => update('productDetailPage', 'addToCartText', e.target.value)} /></Field>
              <Field label="Out of Stock Text"><input value={settings.productDetailPage?.outOfStockText || ''} onChange={e => update('productDetailPage', 'outOfStockText', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('productDetailPage', settings.productDetailPage)} saving={saving} />
            </Panel>
          )}

          {/* ═══ CART PAGE ═══ */}
          {activePage === 'cart' && (
            <Panel title="Cart Page" icon={icons.cart}>
              <Field label="Page Title"><input value={settings.cartPage?.title || ''} onChange={e => update('cartPage', 'title', e.target.value)} /></Field>
              <Field label="Checkout Button Text"><input value={settings.cartPage?.checkoutButtonText || ''} onChange={e => update('cartPage', 'checkoutButtonText', e.target.value)} /></Field>
              <div className="field-section">
                <h4>Empty Cart State</h4>
                <Field label="Empty Title"><input value={settings.cartPage?.emptyTitle || ''} onChange={e => update('cartPage', 'emptyTitle', e.target.value)} /></Field>
                <Field label="Empty Text"><input value={settings.cartPage?.emptyText || ''} onChange={e => update('cartPage', 'emptyText', e.target.value)} /></Field>
                <Field label="Continue Shopping Button"><input value={settings.cartPage?.emptyButtonText || ''} onChange={e => update('cartPage', 'emptyButtonText', e.target.value)} /></Field>
              </div>
              <SaveBtn onClick={() => saveSection('cartPage', settings.cartPage)} saving={saving} />
            </Panel>
          )}

          {/* ═══ CHECKOUT PAGE ═══ */}
          {activePage === 'checkout' && (
            <Panel title="Checkout Page" icon={icons.checkout}>
              <Field label="Page Title"><input value={settings.checkoutPage?.title || ''} onChange={e => update('checkoutPage', 'title', e.target.value)} /></Field>
              <div className="field-section">
                <h4>Order Success Screen</h4>
                <Field label="Success Title"><input value={settings.checkoutPage?.successTitle || ''} onChange={e => update('checkoutPage', 'successTitle', e.target.value)} /></Field>
                <Field label="Success Message"><textarea rows={3} value={settings.checkoutPage?.successText || ''} onChange={e => update('checkoutPage', 'successText', e.target.value)} /></Field>
              </div>
              <SaveBtn onClick={() => saveSection('checkoutPage', settings.checkoutPage)} saving={saving} />
            </Panel>
          )}

          {/* ═══ HEADER & NAV ═══ */}
          {activePage === 'header' && (
            <>
              <Panel title="Site Identity" icon={icons.settings}>
                <Field label="Site Name"><input value={settings.siteName || ''} onChange={e => updateRoot('siteName', e.target.value)} /></Field>
                <Field label="Site Tagline"><input value={settings.siteTagline || ''} onChange={e => updateRoot('siteTagline', e.target.value)} /></Field>
                <Field label="Logo URL"><input value={settings.logo || ''} onChange={e => updateRoot('logo', e.target.value)} placeholder="https://... or /uploads/..." /></Field>
                <SaveBtn onClick={async () => {
                  setSaving(true);
                  try {
                    await Promise.all([
                      api.patch('/settings/siteName', { value: settings.siteName }),
                      api.patch('/settings/siteTagline', { value: settings.siteTagline }),
                      api.patch('/settings/logo', { value: settings.logo }),
                    ]);
                    showToast('General saved!');
                  } catch (err) {
                    showToast(err.response?.data?.message || 'Save failed', 'error');
                  } finally {
                    setSaving(false);
                  }
                }} saving={saving} />
              </Panel>

              <Panel title="Announcement Bar" icon={icons.speaker}>
                <Field label="Visible"><Toggle id="ann-visible" checked={settings.announcementBar?.isVisible} onChange={v => update('announcementBar', 'isVisible', v)} /></Field>
                <Field label="Text"><input value={settings.announcementBar?.text || ''} onChange={e => update('announcementBar', 'text', e.target.value)} /></Field>
                <Field label="Background Color">
                  <div className="color-field">
                    <input type="color" value={settings.announcementBar?.bgColor || '#0f172a'} onChange={e => update('announcementBar', 'bgColor', e.target.value)} />
                    <input value={settings.announcementBar?.bgColor || ''} onChange={e => update('announcementBar', 'bgColor', e.target.value)} />
                  </div>
                </Field>
                <Field label="Text Color">
                  <div className="color-field">
                    <input type="color" value={settings.announcementBar?.textColor || '#94a3b8'} onChange={e => update('announcementBar', 'textColor', e.target.value)} />
                    <input value={settings.announcementBar?.textColor || ''} onChange={e => update('announcementBar', 'textColor', e.target.value)} />
                  </div>
                </Field>
                <SaveBtn onClick={() => saveSection('announcementBar', settings.announcementBar)} saving={saving} />
              </Panel>
            </>
          )}

          {/* ═══ FOOTER ═══ */}
          {activePage === 'footer' && (
            <Panel title="Footer" icon={icons.footer}>
              <Field label="Description"><textarea rows={3} value={settings.footer?.description || ''} onChange={e => update('footer', 'description', e.target.value)} /></Field>
              <Field label="Disclaimer"><textarea rows={4} value={settings.footer?.disclaimer || ''} onChange={e => update('footer', 'disclaimer', e.target.value)} /></Field>
              <Field label="Copyright Text"><input value={settings.footer?.copyrightText || ''} onChange={e => update('footer', 'copyrightText', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('footer', settings.footer)} saving={saving} />
            </Panel>
          )}

          {/* ═══ AGE GATE ═══ */}
          {activePage === 'agegate' && (
            <Panel title="Age Gate" icon={icons.lock}>
              <Field label="Enable Age Gate"><Toggle id="ag-enabled" checked={settings.ageGate?.isEnabled} onChange={v => update('ageGate', 'isEnabled', v)} /></Field>
              <Field label="Minimum Age"><input type="number" value={settings.ageGate?.minAge || 21} onChange={e => update('ageGate', 'minAge', parseInt(e.target.value))} /></Field>
              <Field label="Title"><input value={settings.ageGate?.title || ''} onChange={e => update('ageGate', 'title', e.target.value)} /></Field>
              <Field label="Message"><textarea rows={3} value={settings.ageGate?.message || ''} onChange={e => update('ageGate', 'message', e.target.value)} /></Field>
              <Field label="Confirm Text"><input value={settings.ageGate?.confirmText || ''} onChange={e => update('ageGate', 'confirmText', e.target.value)} /></Field>
              <Field label="Enter Button Text"><input value={settings.ageGate?.enterButtonText || ''} onChange={e => update('ageGate', 'enterButtonText', e.target.value)} /></Field>
              <Field label="Exit Button Text"><input value={settings.ageGate?.exitButtonText || ''} onChange={e => update('ageGate', 'exitButtonText', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('ageGate', settings.ageGate)} saving={saving} />
            </Panel>
          )}

          {/* ═══ THEME & SEO ═══ */}
          {activePage === 'theme' && (
            <>
              <Panel title="Theme & Colors" icon={icons.palette}>
                <p className="panel-desc">Tùy chỉnh màu sắc từng khu vực của website. Nhấn <strong>Save Changes</strong> để áp dụng ngay.</p>

                {/* ── Global ── */}
                <div className="color-group">
                  <h4 className="color-group-title">🌐 Global</h4>
                  <div className="color-grid">
                    {[
                      { key: 'primaryBg',     label: 'Background chính' },
                      { key: 'primaryText',   label: 'Chữ chính' },
                      { key: 'mutedText',     label: 'Chữ phụ / muted' },
                      { key: 'primaryAccent', label: 'Màu nhấn chính' },
                      { key: 'secondaryAccent', label: 'Màu nhấn phụ' },
                      { key: 'linkColor',     label: 'Màu link' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#000000'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Navbar ── */}
                <div className="color-group">
                  <h4 className="color-group-title">🧭 Navbar</h4>
                  <div className="color-grid">
                    {[
                      { key: 'navbarBg',     label: 'Nền Navbar' },
                      { key: 'navbarText',   label: 'Chữ Navbar' },
                      { key: 'navbarBorder', label: 'Đường viền Navbar' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#ffffff'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Announcement Bar ── */}
                <div className="color-group">
                  <h4 className="color-group-title">📢 Thanh thông báo (Announcement Bar)</h4>
                  <div className="color-grid">
                    {[
                      { key: 'announcementBg',   label: 'Nền' },
                      { key: 'announcementText', label: 'Chữ' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#c4222f'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Hero ── */}
                <div className="color-group">
                  <h4 className="color-group-title">🦸 Hero Section</h4>
                  <div className="color-grid">
                    {[
                      { key: 'heroBg',      label: 'Nền Hero' },
                      { key: 'heroText',    label: 'Tiêu đề Hero' },
                      { key: 'heroSubText', label: 'Phụ đề Hero' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#ffffff'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Buttons ── */}
                <div className="color-group">
                  <h4 className="color-group-title">🔘 Nút (Buttons)</h4>
                  <div className="color-grid">
                    {[
                      { key: 'btnPrimaryBg',       label: 'Nút chính - Nền' },
                      { key: 'btnPrimaryText',     label: 'Nút chính - Chữ' },
                      { key: 'btnSecondaryBg',     label: 'Nút phụ - Nền' },
                      { key: 'btnSecondaryText',   label: 'Nút phụ - Chữ' },
                      { key: 'btnSecondaryBorder', label: 'Nút phụ - Viền' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#000000'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Sections & Cards ── */}
                <div className="color-group">
                  <h4 className="color-group-title">📄 Sections & Cards</h4>
                  <div className="color-grid">
                    {[
                      { key: 'sectionBg',    label: 'Nền section' },
                      { key: 'sectionAltBg', label: 'Nền section (xen kẽ)' },
                      { key: 'sectionText',  label: 'Chữ section' },
                      { key: 'cardBg',       label: 'Nền card' },
                      { key: 'cardBorder',   label: 'Viền card' },
                      { key: 'cardText',     label: 'Chữ card' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#ffffff'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Footer ── */}
                <div className="color-group">
                  <h4 className="color-group-title">🦶 Footer</h4>
                  <div className="color-grid">
                    {[
                      { key: 'footerBg',      label: 'Nền Footer' },
                      { key: 'footerText',    label: 'Chữ Footer' },
                      { key: 'footerHeading', label: 'Tiêu đề Footer' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#0b0b0c'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                </div>

                {/* ── Age Gate ── */}
                <div className="color-group">
                  <h4 className="color-group-title">🔒 Age Gate (Popup xác minh tuổi)</h4>
                  <div className="color-grid">
                    {[
                      { key: 'ageGateBg',          label: 'Nền modal' },
                      { key: 'ageGateText',         label: 'Chữ tiêu đề' },
                      { key: 'ageGateSubText',      label: 'Chữ mô tả' },
                      { key: 'ageGateCheckbox',     label: 'Màu checkbox' },
                      { key: 'ageGateBtnBg',        label: 'Nút Enter - Nền' },
                      { key: 'ageGateBtnText',      label: 'Nút Enter - Chữ' },
                      { key: 'ageGateLeaveBg',      label: 'Nút Leave - Nền' },
                      { key: 'ageGateLeaveText',    label: 'Nút Leave - Chữ' },
                      { key: 'ageGateLeaveBorder',  label: 'Nút Leave - Viền' },
                    ].map(({ key, label }) => (
                      <ColorSwatch key={key} label={label} value={settings.theme?.[key] || '#ffffff'} onChange={v => update('theme', key, v)} />
                    ))}
                  </div>
                  {/* Mini Age Gate preview */}
                  <div style={{
                    background: settings.theme?.ageGateBg || '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1rem 1.25rem',
                    marginTop: '0.75rem',
                    maxWidth: 320,
                  }}>
                    <p style={{ color: settings.theme?.ageGateText || '#111827', fontWeight: 700, fontSize: '0.88rem', margin: '0 0 0.35rem' }}>Age Verification</p>
                    <p style={{ color: settings.theme?.ageGateSubText || '#4b5563', fontSize: '0.77rem', margin: '0 0 0.75rem' }}>Preview mô tả modal</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: settings.theme?.ageGateBtnBg || '#c4222f', color: settings.theme?.ageGateBtnText || '#fff', border: 'none', padding: '0.35rem 0.9rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'default' }}>Enter</button>
                      <button style={{ background: settings.theme?.ageGateLeaveBg || '#fff', color: settings.theme?.ageGateLeaveText || '#1f2937', border: `1px solid ${settings.theme?.ageGateLeaveBorder || '#d1d5db'}`, padding: '0.35rem 0.9rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'default' }}>Leave</button>
                    </div>
                  </div>
                </div>

                {/* ── Font ── */}
                <Field label="Font chữ">
                  <select value={settings.theme?.fontFamily || 'Inter'} onChange={e => update('theme', 'fontFamily', e.target.value)}>
                    <option>Inter</option><option>Roboto</option><option>Outfit</option><option>Space Grotesk</option><option>Sora</option><option>Poppins</option><option>Nunito</option>
                  </select>
                </Field>


                {/* Live Preview Strip */}
                <div className="theme-preview-strip" style={{
                  background: settings.theme?.primaryBg || '#0b0b0c',
                  border: `2px solid ${settings.theme?.primaryAccent || '#c4222f'}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginTop: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ color: settings.theme?.primaryText || '#ededed', fontWeight: 700, fontSize: '0.95rem' }}>Live Preview</span>
                  <span style={{ color: settings.theme?.mutedText || '#8c8c8f', fontSize: '0.85rem' }}>Chữ phụ</span>
                  <button style={{
                    background: settings.theme?.btnPrimaryBg || '#c4222f',
                    color: settings.theme?.btnPrimaryText || '#fff',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'default',
                    fontSize: '0.85rem',
                  }}>Nút chính</button>
                  <button style={{
                    background: settings.theme?.btnSecondaryBg || 'transparent',
                    color: settings.theme?.btnSecondaryText || '#fff',
                    border: `1.5px solid ${settings.theme?.btnSecondaryBorder || '#fff'}`,
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'default',
                    fontSize: '0.85rem',
                  }}>Nút phụ</button>
                  <a style={{ color: settings.theme?.linkColor || '#c4222f', textDecoration: 'underline', fontSize: '0.85rem', cursor: 'default' }}>Link</a>
                </div>

                <SaveBtn onClick={() => saveSection('theme', settings.theme)} saving={saving} />
              </Panel>

              <Panel title="SEO & Meta" icon={icons.search}>
                <Field label="Default Title"><input value={settings.seo?.defaultTitle || ''} onChange={e => update('seo', 'defaultTitle', e.target.value)} /></Field>
                <Field label="Default Description"><textarea rows={3} value={settings.seo?.defaultDescription || ''} onChange={e => update('seo', 'defaultDescription', e.target.value)} /></Field>
                <Field label="Keywords"><input value={settings.seo?.keywords || ''} onChange={e => update('seo', 'keywords', e.target.value)} /></Field>
                <SaveBtn onClick={() => saveSection('seo', settings.seo)} saving={saving} />
              </Panel>
            </>
          )}



          {/* ═══ SHIPPING ═══ */}
          {activePage === 'shipping' && (
            <>
              <Panel title="Shipping Settings" icon={icons.truck}>
                <Field label="Free Shipping Threshold ($)"><input type="number" value={settings.freeShippingThreshold || 250} onChange={e => updateRoot('freeShippingThreshold', parseInt(e.target.value) || 0)} /></Field>
                <Field label="Standard Shipping Cost ($)"><input type="number" value={settings.shippingCost || 15} onChange={e => updateRoot('shippingCost', parseInt(e.target.value) || 0)} /></Field>
                <SaveBtn onClick={async () => {
                  setSaving(true);
                  try {
                    await Promise.all([
                      api.patch('/settings/freeShippingThreshold', { value: settings.freeShippingThreshold }),
                      api.patch('/settings/shippingCost', { value: settings.shippingCost }),
                    ]);
                    showToast('Saved successfully!');
                  } catch (err) {
                    showToast(err.response?.data?.message || 'Save failed', 'error');
                  } finally {
                    setSaving(false);
                  }
                }} saving={saving} />
              </Panel>

              <Panel title="Shipping Info" icon={icons.truck}>
                <p className="panel-desc">Nội dung hiển thị ở trang Shipping Info trên website.</p>
                <Field label="Processing Time">
                  <textarea rows={2} value={settings.shippingInfo?.processingTime || ''} onChange={e => update('shippingInfo', 'processingTime', e.target.value)} />
                </Field>
                <Field label="Free Shipping Note">
                  <textarea rows={2} value={settings.shippingInfo?.freeShippingNote || ''} onChange={e => update('shippingInfo', 'freeShippingNote', e.target.value)} />
                </Field>
                <Field label="Packaging Note">
                  <textarea rows={2} value={settings.shippingInfo?.packagingNote || ''} onChange={e => update('shippingInfo', 'packagingNote', e.target.value)} />
                </Field>
                <Field label="Refund Policy Title">
                  <input value={settings.shippingInfo?.refundTitle || ''} onChange={e => update('shippingInfo', 'refundTitle', e.target.value)} />
                </Field>
                <Field label="Refund Policy Body">
                  <textarea rows={4} value={settings.shippingInfo?.refundBody || ''} onChange={e => update('shippingInfo', 'refundBody', e.target.value)} />
                </Field>
                <SaveBtn onClick={() => saveSection('shippingInfo', settings.shippingInfo)} saving={saving} />
              </Panel>

              <Panel title="Terms of Service" icon={icons.lock}>
                <p className="panel-desc">Nội dung hiển thị ở phần Terms of Service trên website.</p>
                <Field label="Terms of Service Content">
                  <textarea rows={6} value={settings.termsOfService?.body || ''} onChange={e => update('termsOfService', 'body', e.target.value)} />
                </Field>
                <SaveBtn onClick={() => saveSection('termsOfService', settings.termsOfService)} saving={saving} />
              </Panel>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

// ── Helper Components ─────────────────────
const Panel = ({ title, icon, children }) => (
  <div className="cms-section">
    <div className="cms-section-header"><span>{icon}</span><h2>{title}</h2></div>
    <div className="cms-section-body">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="cms-field"><label>{label}</label>{children}</div>
);

const Toggle = ({ id, checked, onChange }) => (
  <label className="toggle" htmlFor={id}>
    <input id={id} type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
    <span className="toggle-slider"></span>
  </label>
);

const SaveBtn = ({ onClick, saving }) => (
  <button className="btn-save-section" onClick={onClick} disabled={saving}>
    {saving ? 'Saving...' : 'Save Changes'}
  </button>
);

const ColorSwatch = ({ label, value, onChange }) => (
  <div className="color-swatch-item">
    <div className="color-swatch-preview" style={{ background: value }}>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        title={label}
      />
    </div>
    <div className="color-swatch-info">
      <span className="color-swatch-label">{label}</span>
      <input
        className="color-swatch-hex"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
      />
    </div>
  </div>
);

export default SiteSettings;
