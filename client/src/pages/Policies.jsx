import { useSite } from '../contexts/SiteContext';
import './Policies.css';

const Policies = () => {
  const { settings, loading } = useSite();

  if (loading) {
    return (
      <div className="policies-loading">
        <div className="policies-spinner" />
      </div>
    );
  }

  const shipping = settings?.shippingInfo;
  const terms = settings?.termsOfService;

  return (
    <div className="policies-page">
      <div className="policies-header">
        <span className="policies-eyebrow">LEGAL &amp; LOGISTICS</span>
        <h1 className="policies-title">Store Policies &amp; Information</h1>
        <p className="policies-subtitle">
          Everything you need to know about shipping, returns, and terms.
        </p>
      </div>

      <div className="policies-grid">
        {/* Shipping Info card */}
        <div className="policies-card">
          <div className="policies-card-icon">🚚</div>
          <h2 className="policies-card-title">Shipping Info</h2>
          <div className="policies-card-body">
            {shipping?.processingTime && (
              <p>{shipping.processingTime}</p>
            )}
            {shipping?.freeShippingNote && (
              <p>{shipping.freeShippingNote}</p>
            )}
            {shipping?.packagingNote && (
              <p>{shipping.packagingNote}</p>
            )}
            {/* Fallback defaults */}
            {!shipping && (
              <>
                <p>Orders ship within 24 hours of payment confirmation.</p>
                <p>Free shipping on orders over $250.</p>
                <p>Shipped in plain, unmarked packages.</p>
              </>
            )}
          </div>
        </div>

        {/* Refund Policy card */}
        <div className="policies-card">
          <div className="policies-card-icon">↩️</div>
          <h2 className="policies-card-title">
            {shipping?.refundTitle || 'Refund Policy'}
          </h2>
          <div className="policies-card-body">
            <p>
              {shipping?.refundBody ||
                'Due to the nature of research chemicals, unopened vials can be returned within 14 days of receipt for store credit or replacement.'}
            </p>
          </div>
        </div>

        {/* Terms of Service card */}
        <div className="policies-card policies-card--full">
          <div className="policies-card-icon">📋</div>
          <h2 className="policies-card-title">Terms of Service</h2>
          <div className="policies-card-body">
            <p>
              {terms?.body ||
                'All products sold are intended strictly for laboratory research use by qualified personnel. Not for human or veterinary administration.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
