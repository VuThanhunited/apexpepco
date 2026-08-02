import { useState, useEffect } from 'react';
import api from '../utils/api';
import './SiteSettings.css';

const SiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
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
      showToast(`${section} saved successfully!`);
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

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'announcement', label: 'Announcement', icon: '📢' },
    { id: 'agegate', label: 'Age Gate', icon: '🔒' },
    { id: 'hero', label: 'Hero Section', icon: '🦸' },
    { id: 'features', label: 'Features Bar', icon: '✨' },
    { id: 'featured', label: 'Featured Section', icon: '⭐' },
    { id: 'popup', label: 'Promo Popup', icon: '🎁' },
    { id: 'cta', label: 'CTA Section', icon: '📣' },
    { id: 'footer', label: 'Footer', icon: '🦶' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'shipping', label: 'Shipping', icon: '🚚' },
  ];

  return (
    <div className="cms-page">
      {toast && <div className={`cms-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="cms-header">
        <div>
          <h1>🎨 Site Settings <span className="cms-badge">CMS</span></h1>
          <p>Customize your website content without touching code</p>
        </div>
      </div>

      <div className="cms-layout">
        {/* Tab Nav */}
        <div className="cms-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`cms-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`cms-tab-${tab.id}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="cms-panel">

          {/* ── GENERAL ─────────────────────────────── */}
          {activeTab === 'general' && (
            <Panel title="General Settings" icon="⚙️" onSave={() => saveSection('siteName', settings.siteName)} saving={saving}>
              <Field label="Site Name">
                <input id="site-name" value={settings.siteName || ''} onChange={e => updateRoot('siteName', e.target.value)} />
              </Field>
              <Field label="Site Tagline">
                <input id="site-tagline" value={settings.siteTagline || ''} onChange={e => updateRoot('siteTagline', e.target.value)} />
              </Field>
              <Field label="Logo URL">
                <input id="site-logo" value={settings.logo || ''} onChange={e => updateRoot('logo', e.target.value)} placeholder="https://... or /uploads/..." />
              </Field>
              <SaveBtn onClick={() => api.patch('/settings/siteName', settings.siteName).then(() => showToast('General saved!')).catch(() => showToast('Error', 'error'))} saving={saving} />
            </Panel>
          )}

          {/* ── ANNOUNCEMENT BAR ────────────────────── */}
          {activeTab === 'announcement' && (
            <Panel title="Announcement Bar" icon="📢" saving={saving}>
              <Field label="Visible">
                <Toggle id="ann-visible" checked={settings.announcementBar?.isVisible} onChange={v => update('announcementBar', 'isVisible', v)} />
              </Field>
              <Field label="Text">
                <input id="ann-text" value={settings.announcementBar?.text || ''} onChange={e => update('announcementBar', 'text', e.target.value)} />
              </Field>
              <Field label="Background Color">
                <div className="color-field">
                  <input type="color" id="ann-bg-color" value={settings.announcementBar?.bgColor || '#0f172a'} onChange={e => update('announcementBar', 'bgColor', e.target.value)} />
                  <input value={settings.announcementBar?.bgColor || ''} onChange={e => update('announcementBar', 'bgColor', e.target.value)} />
                </div>
              </Field>
              <Field label="Text Color">
                <div className="color-field">
                  <input type="color" id="ann-text-color" value={settings.announcementBar?.textColor || '#94a3b8'} onChange={e => update('announcementBar', 'textColor', e.target.value)} />
                  <input value={settings.announcementBar?.textColor || ''} onChange={e => update('announcementBar', 'textColor', e.target.value)} />
                </div>
              </Field>
              <SaveBtn onClick={() => saveSection('announcementBar', settings.announcementBar)} saving={saving} />
            </Panel>
          )}

          {/* ── AGE GATE ────────────────────────────── */}
          {activeTab === 'agegate' && (
            <Panel title="Age Gate" icon="🔒" saving={saving}>
              <Field label="Enable Age Gate"><Toggle id="ag-enabled" checked={settings.ageGate?.isEnabled} onChange={v => update('ageGate', 'isEnabled', v)} /></Field>
              <Field label="Minimum Age"><input id="ag-min-age" type="number" value={settings.ageGate?.minAge || 21} onChange={e => update('ageGate', 'minAge', parseInt(e.target.value))} /></Field>
              <Field label="Title"><input id="ag-title" value={settings.ageGate?.title || ''} onChange={e => update('ageGate', 'title', e.target.value)} /></Field>
              <Field label="Message"><textarea id="ag-message" rows={3} value={settings.ageGate?.message || ''} onChange={e => update('ageGate', 'message', e.target.value)} /></Field>
              <Field label="Confirm Text"><input id="ag-confirm" value={settings.ageGate?.confirmText || ''} onChange={e => update('ageGate', 'confirmText', e.target.value)} /></Field>
              <Field label="Enter Button Text"><input id="ag-enter" value={settings.ageGate?.enterButtonText || ''} onChange={e => update('ageGate', 'enterButtonText', e.target.value)} /></Field>
              <Field label="Exit Button Text"><input id="ag-exit" value={settings.ageGate?.exitButtonText || ''} onChange={e => update('ageGate', 'exitButtonText', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('ageGate', settings.ageGate)} saving={saving} />
            </Panel>
          )}

          {/* ── HERO ────────────────────────────────── */}
          {activeTab === 'hero' && (
            <Panel title="Hero Section" icon="🦸" saving={saving}>
              <Field label="Title"><input id="hero-title" value={settings.hero?.title || ''} onChange={e => update('hero', 'title', e.target.value)} /></Field>
              <Field label="Subtitle"><textarea id="hero-subtitle" rows={3} value={settings.hero?.subtitle || ''} onChange={e => update('hero', 'subtitle', e.target.value)} /></Field>
              <Field label="Background Image URL"><input id="hero-bg" value={settings.hero?.backgroundImage || ''} onChange={e => update('hero', 'backgroundImage', e.target.value)} placeholder="Optional" /></Field>
              <Field label="Primary Button Text"><input id="hero-btn1-text" value={settings.hero?.primaryButtonText || ''} onChange={e => update('hero', 'primaryButtonText', e.target.value)} /></Field>
              <Field label="Primary Button Link"><input id="hero-btn1-href" value={settings.hero?.primaryButtonHref || ''} onChange={e => update('hero', 'primaryButtonHref', e.target.value)} /></Field>
              <Field label="Secondary Button Text"><input id="hero-btn2-text" value={settings.hero?.secondaryButtonText || ''} onChange={e => update('hero', 'secondaryButtonText', e.target.value)} /></Field>
              <Field label="Secondary Button Link"><input id="hero-btn2-href" value={settings.hero?.secondaryButtonHref || ''} onChange={e => update('hero', 'secondaryButtonHref', e.target.value)} /></Field>
              <div className="field-section">
                <h4>Badges <span className="field-hint">(checkmarks under title)</span></h4>
                {settings.hero?.badges?.map((b, i) => (
                  <div key={i} className="array-row">
                    <input placeholder="Icon" value={b.icon} style={{ width: '60px' }} onChange={e => {
                      const badges = [...(settings.hero.badges || [])];
                      badges[i] = { ...b, icon: e.target.value };
                      update('hero', 'badges', badges);
                    }} />
                    <input placeholder="Text" value={b.text} onChange={e => {
                      const badges = [...(settings.hero.badges || [])];
                      badges[i] = { ...b, text: e.target.value };
                      update('hero', 'badges', badges);
                    }} />
                    <button className="btn-remove-row" onClick={() => {
                      const badges = settings.hero.badges.filter((_, idx) => idx !== i);
                      update('hero', 'badges', badges);
                    }}>✕</button>
                  </div>
                ))}
                <button className="btn-add-row" onClick={() => update('hero', 'badges', [...(settings.hero?.badges || []), { icon: '✓', text: 'New Badge' }])}>+ Add Badge</button>
              </div>
              <SaveBtn onClick={() => saveSection('hero', settings.hero)} saving={saving} />
            </Panel>
          )}

          {/* ── FEATURES ────────────────────────────── */}
          {activeTab === 'features' && (
            <Panel title="Features Bar" icon="✨" saving={saving}>
              <p className="panel-desc">These features scroll in the marquee strip below the hero.</p>
              {settings.features?.map((f, i) => (
                <div key={i} className="feature-row">
                  <div className="feature-row-fields">
                    <input className="icon-input" placeholder="Icon" value={f.icon || ''} onChange={e => {
                      const feats = [...settings.features];
                      feats[i] = { ...f, icon: e.target.value };
                      updateRoot('features', feats);
                    }} />
                    <input placeholder="Title" value={f.title || ''} onChange={e => {
                      const feats = [...settings.features];
                      feats[i] = { ...f, title: e.target.value };
                      updateRoot('features', feats);
                    }} />
                    <input placeholder="Description" value={f.description || ''} onChange={e => {
                      const feats = [...settings.features];
                      feats[i] = { ...f, description: e.target.value };
                      updateRoot('features', feats);
                    }} />
                    <button className="btn-remove-row" onClick={() => {
                      updateRoot('features', settings.features.filter((_, idx) => idx !== i));
                    }}>✕</button>
                  </div>
                </div>
              ))}
              <button className="btn-add-row" id="add-feature-btn" onClick={() => updateRoot('features', [...(settings.features || []), { icon: '⚡', title: 'New Feature', description: '', order: settings.features?.length || 0 }])}>
                + Add Feature
              </button>
              <SaveBtn onClick={() => saveSection('features', settings.features)} saving={saving} />
            </Panel>
          )}

          {/* ── FEATURED SECTION ─────────────────────── */}
          {activeTab === 'featured' && (
            <Panel title="Featured Products Section" icon="⭐" saving={saving}>
              <Field label="Visible"><Toggle id="fs-visible" checked={settings.featuredSection?.isVisible} onChange={v => update('featuredSection', 'isVisible', v)} /></Field>
              <Field label="Section Title"><input id="fs-title" value={settings.featuredSection?.title || ''} onChange={e => update('featuredSection', 'title', e.target.value)} /></Field>
              <Field label="Section Subtitle"><input id="fs-subtitle" value={settings.featuredSection?.subtitle || ''} onChange={e => update('featuredSection', 'subtitle', e.target.value)} /></Field>
              <div className="info-box">💡 To control which products appear as "Featured", edit individual products and toggle the <strong>Featured</strong> flag.</div>
              <SaveBtn onClick={() => saveSection('featuredSection', settings.featuredSection)} saving={saving} />
            </Panel>
          )}

          {/* ── PROMO POPUP ──────────────────────────── */}
          {activeTab === 'popup' && (
            <Panel title="Promo Popup" icon="🎁" saving={saving}>
              <Field label="Enable Popup"><Toggle id="popup-enabled" checked={settings.promoPopup?.isEnabled} onChange={v => update('promoPopup', 'isEnabled', v)} /></Field>
              <Field label="Title"><input id="popup-title" value={settings.promoPopup?.title || ''} onChange={e => update('promoPopup', 'title', e.target.value)} /></Field>
              <Field label="Subtitle"><input id="popup-subtitle" value={settings.promoPopup?.subtitle || ''} onChange={e => update('promoPopup', 'subtitle', e.target.value)} /></Field>
              <Field label="Description"><textarea id="popup-desc" rows={3} value={settings.promoPopup?.description || ''} onChange={e => update('promoPopup', 'description', e.target.value)} /></Field>
              <Field label="CTA Button Text"><input id="popup-cta-text" value={settings.promoPopup?.ctaText || ''} onChange={e => update('promoPopup', 'ctaText', e.target.value)} /></Field>
              <Field label="CTA Link"><input id="popup-cta-href" value={settings.promoPopup?.ctaHref || ''} onChange={e => update('promoPopup', 'ctaHref', e.target.value)} /></Field>
              <Field label="Show After (seconds)"><input id="popup-delay" type="number" value={settings.promoPopup?.delaySeconds || 3} onChange={e => update('promoPopup', 'delaySeconds', parseInt(e.target.value))} /></Field>
              <SaveBtn onClick={() => saveSection('promoPopup', settings.promoPopup)} saving={saving} />
            </Panel>
          )}

          {/* ── PRE-FOOTER CTA ────────────────────────── */}
          {activeTab === 'cta' && (
            <Panel title="Pre-Footer CTA Section" icon="📣" saving={saving}>
              <Field label="Visible"><Toggle id="cta-visible" checked={settings.preFooterCta?.isVisible} onChange={v => update('preFooterCta', 'isVisible', v)} /></Field>
              <Field label="Title"><input id="cta-title" value={settings.preFooterCta?.title || ''} onChange={e => update('preFooterCta', 'title', e.target.value)} /></Field>
              <Field label="Subtitle"><input id="cta-subtitle" value={settings.preFooterCta?.subtitle || ''} onChange={e => update('preFooterCta', 'subtitle', e.target.value)} /></Field>
              <Field label="Button Text"><input id="cta-btn-text" value={settings.preFooterCta?.buttonText || ''} onChange={e => update('preFooterCta', 'buttonText', e.target.value)} /></Field>
              <Field label="Button Link"><input id="cta-btn-href" value={settings.preFooterCta?.buttonHref || ''} onChange={e => update('preFooterCta', 'buttonHref', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('preFooterCta', settings.preFooterCta)} saving={saving} />
            </Panel>
          )}

          {/* ── FOOTER ───────────────────────────────── */}
          {activeTab === 'footer' && (
            <Panel title="Footer" icon="🦶" saving={saving}>
              <Field label="Description"><textarea id="footer-desc" rows={3} value={settings.footer?.description || ''} onChange={e => update('footer', 'description', e.target.value)} /></Field>
              <Field label="Disclaimer"><textarea id="footer-disclaimer" rows={4} value={settings.footer?.disclaimer || ''} onChange={e => update('footer', 'disclaimer', e.target.value)} /></Field>
              <Field label="Copyright Text"><input id="footer-copyright" value={settings.footer?.copyrightText || ''} onChange={e => update('footer', 'copyrightText', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('footer', settings.footer)} saving={saving} />
            </Panel>
          )}

          {/* ── SEO ──────────────────────────────────── */}
          {activeTab === 'seo' && (
            <Panel title="SEO & Meta" icon="🔍" saving={saving}>
              <Field label="Default Title"><input id="seo-title" value={settings.seo?.defaultTitle || ''} onChange={e => update('seo', 'defaultTitle', e.target.value)} /></Field>
              <Field label="Default Description"><textarea id="seo-desc" rows={3} value={settings.seo?.defaultDescription || ''} onChange={e => update('seo', 'defaultDescription', e.target.value)} /></Field>
              <Field label="Keywords"><input id="seo-keywords" value={settings.seo?.keywords || ''} onChange={e => update('seo', 'keywords', e.target.value)} /></Field>
              <SaveBtn onClick={() => saveSection('seo', settings.seo)} saving={saving} />
            </Panel>
          )}

          {/* ── THEME ────────────────────────────────── */}
          {activeTab === 'theme' && (
            <Panel title="Theme & Colors" icon="🎨" saving={saving}>
              <p className="panel-desc">Change the color scheme of your website.</p>
              <div className="color-grid">
                {[
                  { key: 'primaryBg', label: 'Background', id: 'theme-bg' },
                  { key: 'primaryAccent', label: 'Primary Accent (Sky)', id: 'theme-sky' },
                  { key: 'secondaryAccent', label: 'Secondary Accent (Violet)', id: 'theme-violet' },
                  { key: 'tertiaryAccent', label: 'Tertiary Accent (Amber)', id: 'theme-amber' },
                  { key: 'primaryText', label: 'Primary Text', id: 'theme-text' },
                  { key: 'mutedText', label: 'Muted Text', id: 'theme-muted' },
                ].map(({ key, label, id }) => (
                  <div key={key} className="color-item">
                    <label>{label}</label>
                    <div className="color-field">
                      <input type="color" id={id} value={settings.theme?.[key] || '#000000'} onChange={e => update('theme', key, e.target.value)} />
                      <input value={settings.theme?.[key] || ''} onChange={e => update('theme', key, e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <Field label="Font Family">
                <select id="theme-font" value={settings.theme?.fontFamily || 'Inter'} onChange={e => update('theme', 'fontFamily', e.target.value)}>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Outfit</option>
                  <option>Space Grotesk</option>
                  <option>Sora</option>
                </select>
              </Field>
              <SaveBtn onClick={() => saveSection('theme', settings.theme)} saving={saving} />
            </Panel>
          )}

          {/* ── SHIPPING ─────────────────────────────── */}
          {activeTab === 'shipping' && (
            <Panel title="Shipping Settings" icon="🚚" saving={saving}>
              <Field label="Free Shipping Threshold ($)">
                <input id="ship-threshold" type="number" value={settings.freeShippingThreshold || 250} onChange={e => updateRoot('freeShippingThreshold', parseInt(e.target.value))} />
              </Field>
              <Field label="Standard Shipping Cost ($)">
                <input id="ship-cost" type="number" value={settings.shippingCost || 15} onChange={e => updateRoot('shippingCost', parseInt(e.target.value))} />
              </Field>
              <SaveBtn onClick={() => api.patch('/settings/freeShippingThreshold', settings.freeShippingThreshold).then(() => showToast('Saved!')).catch(() => showToast('Error', 'error'))} saving={saving} />
            </Panel>
          )}

        </div>
      </div>
    </div>
  );
};

// ── Helper Components ───────────────────────────────────────────

const Panel = ({ title, icon, children }) => (
  <div className="cms-section">
    <div className="cms-section-header">
      <span>{icon}</span>
      <h2>{title}</h2>
    </div>
    <div className="cms-section-body">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="cms-field">
    <label>{label}</label>
    {children}
  </div>
);

const Toggle = ({ id, checked, onChange }) => (
  <label className="toggle" htmlFor={id}>
    <input id={id} type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
    <span className="toggle-slider"></span>
  </label>
);

const SaveBtn = ({ onClick, saving }) => (
  <button className="btn-save-section" onClick={onClick} disabled={saving} id="save-section-btn">
    {saving ? '⏳ Saving...' : '💾 Save Changes'}
  </button>
);

export default SiteSettings;
