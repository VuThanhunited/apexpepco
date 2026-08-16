import './Logo.css';

/**
 * Logo component – single source of truth for the brand logo.
 * Use this everywhere a logo is needed so a single change here
 * propagates to all locations (Navbar, AgeGate, Login, Register, Footer, etc.).
 *
 * Props:
 *   className  – extra class(es) for the wrapper element
 *   imgClass   – extra class(es) for the triangle <img>
 *   textClass  – extra class(es) for the text block div
 *   showTagline – whether to show the "RESEARCH USE ONLY" tagline (default: true)
 */
const Logo = ({
  className = '',
  imgClass = '',
  textClass = '',
  showTagline = true,
}) => (
  <div className={`logo-brand ${className}`.trim()}>
    <img
      src="/logo-triangle.png"
      alt="Apex Pep Co"
      className={`logo-brand-img ${imgClass}`.trim()}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/logo-icon.jpg';
      }}
    />
    <div className={`logo-brand-text ${textClass}`.trim()}>
      <span className="logo-brand-apex">APEX</span>
      <div className="logo-brand-pepco">
        <span className="logo-brand-pep">PEP</span>
        <span className="logo-brand-co">CO</span>
      </div>
      {showTagline && (
        <span className="logo-brand-tagline">RESEARCH USE ONLY</span>
      )}
    </div>
  </div>
);

export default Logo;
