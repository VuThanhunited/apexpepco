import './Logo.css';

/**
 * Logo component – single source of truth for the brand logo.
 *
 * Props:
 *   variant     – "inline" (navbar, horizontal) | "stacked" (agegate, login, centered)
 *   className   – extra class(es) for the wrapper element
 *   showTagline – whether to show "RESEARCH USE ONLY" (default: true)
 */
const Logo = ({
  variant = 'inline',
  className = '',
  showTagline = true,
}) => {
  if (variant === 'stacked') {
    return (
      <div className={`logo-stacked ${className}`.trim()}>
        <img
          src="/logo-light.png"
          alt="Apex Pep Co"
          className="logo-stacked-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/logo-light.png';
          }}
        />
        <div className="logo-stacked-name">APEX PEP CO</div>
        {showTagline && (
          <>
            <div className="logo-stacked-divider" />
            <div className="logo-stacked-tagline">RESEARCH USE ONLY</div>
          </>
        )}
      </div>
    );
  }

  // Default: inline (horizontal) – used in Navbar
  return (
    <div className={`logo-brand ${className}`.trim()}>
      <img
        src="/logo-dark.png"
        alt="Apex Pep Co"
        className="logo-brand-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/logo-light.png';
        }}
      />
      <div className="logo-brand-text">
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
};

export default Logo;
