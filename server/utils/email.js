const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'vtu21102000@gmail.com';
const EMAIL_USER = process.env.EMAIL_USER || 'vtu21102000@gmail.com';
const EMAIL_PASS = (process.env.EMAIL_PASS || 'yfqwyyctowncryac').replace(/\s+/g, '');

// Create Nodemailer Transporter - try multiple ports for Render.com compatibility
const getTransporter = async () => {
  // 1. Custom SMTP if specified
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // 2. Try Gmail port 465 first, fallback to 587
  const configs = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  for (const cfg of configs) {
    try {
      const t = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: cfg.port,
        secure: cfg.secure,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
      });
      await t.verify();
      console.log(`✅ Gmail SMTP verified on port ${cfg.port}`);
      return t;
    } catch (e) {
      console.warn(`⚠️ Gmail SMTP port ${cfg.port} failed: ${e.message}`);
    }
  }

  throw new Error('All SMTP transports failed');
};

/**
 * Send order confirmation email to Customer & notification email to Admin
 */
const sendOrderEmails = async (order) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn('⚠️ Mailer transporter not initialized');
      return;
    }

    const orderIdShort = order.orderNumber || (order._id ? order._id.toString().slice(-6).toUpperCase() : 'APEX-ORDER');
    const customerEmail = order.shippingAddress?.email || order.guestEmail || (order.user && order.user.email);
    const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Valued Customer';
    const address = order.shippingAddress || {};

    const itemsHtml = (order.items || []).map(item => `
      <tr style="border-bottom: 1px solid #2a2a2c;">
        <td style="padding: 12px; color: #ffffff;">
          <strong>${item.productName || item.name || item.title || 'Peptide Product'}</strong>
          ${item.variant ? `<br/><span style="font-size: 12px; color: #8c8c8f;">Option: ${item.variant.name || item.variant}</span>` : ''}
        </td>
        <td style="padding: 12px; text-align: center; color: #ffffff;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; color: #ffffff;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // ─────────────────────────────────────────────────────────────
    // 1. CUSTOMER EMAIL HTML
    // ─────────────────────────────────────────────────────────────
    const customerHtml = `
      <div style="background-color: #0b0b0c; color: #ededed; font-family: sans-serif; padding: 30px; max-width: 650px; margin: 0 auto; border-radius: 10px; border: 1px solid #2a2a2c;">
        <div style="text-align: center; border-bottom: 2px solid #c4222f; padding-bottom: 20px; margin-bottom: 25px;">
          <a href="${process.env.CLIENT_URL || 'https://apexpepco.vercel.app'}" style="text-decoration: none;">
            <h1 style="color: #c4222f; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px;">▲ APEX PEP CO</h1>
          </a>
          <p style="color: #8c8c8f; margin-top: 5px; font-size: 13px;">RESEARCH GRADE COMPOUNDS</p>
        </div>

        <h2 style="color: #ffffff; font-size: 20px;">Order Confirmation #${orderIdShort}</h2>
        <p style="color: #c5c5c8; font-size: 15px; line-height: 1.6;">
          Hello <strong>${customerName}</strong>,<br/>
          Thank you for your order with <strong>Apex PepCo</strong>. We have received your order details and are preparing your research compounds for dispatch.
        </p>

        <div style="background: #121214; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #2a2a2c;">
          <h3 style="color: #c4222f; margin-top: 0; font-size: 16px;">ORDER SUMMARY</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 1px solid #3a3a3c; color: #8c8c8f; text-align: left;">
                <th style="padding: 8px 12px;">PRODUCT</th>
                <th style="padding: 8px 12px; text-align: center;">QTY</th>
                <th style="padding: 8px 12px; text-align: right;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 15px; border-top: 1px solid #3a3a3c; padding-top: 12px; text-align: right; font-size: 14px;">
            <p style="margin: 4px 0; color: #8c8c8f;">Subtotal: <strong style="color: #ffffff;">$${(order.subtotal || 0).toFixed(2)}</strong></p>
            <p style="margin: 4px 0; color: #8c8c8f;">Shipping: <strong style="color: #ffffff;">${order.shippingCost === 0 ? 'FREE' : `$${(order.shippingCost || 0).toFixed(2)}`}</strong></p>
            <p style="margin: 8px 0 0 0; font-size: 18px; color: #c4222f;">Total: <strong>$${(order.total || order.totalAmount || 0).toFixed(2)}</strong></p>
          </div>
        </div>

        <div style="background: #121214; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #2a2a2c;">
          <h3 style="color: #c4222f; margin-top: 0; font-size: 16px;">SHIPPING ADDRESS</h3>
          <p style="color: #c5c5c8; margin: 0; font-size: 14px; line-height: 1.5;">
            ${customerName}<br/>
            ${address.address || ''} ${address.apartment ? `, ${address.apartment}` : ''}<br/>
            ${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}<br/>
            ${address.country || 'USA'}<br/>
            Phone: ${address.phone || 'N/A'}
          </p>
        </div>

        <div style="background: #121214; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #2a2a2c;">
          <h3 style="color: #c4222f; margin-top: 0; font-size: 16px;">PAYMENT METHOD</h3>
          <p style="color: #ffffff; margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">
            ${order.paymentMethod || 'Credit Card / Pending'}
          </p>
        </div>

        <p style="color: #8c8c8f; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #2a2a2c; padding-top: 15px;">
          For research use only. Not for human consumption.<br/>
          Apex PepCo © 2026. All rights reserved.
        </p>
      </div>
    `;

    // ─────────────────────────────────────────────────────────────
    // 2. ADMIN ALERT EMAIL HTML
    // ─────────────────────────────────────────────────────────────
    const adminHtml = `
      <div style="background-color: #0b0b0c; color: #ededed; font-family: sans-serif; padding: 30px; max-width: 650px; margin: 0 auto; border-radius: 10px; border: 2px solid #c4222f;">
        <div style="background: #c4222f; color: #ffffff; padding: 15px; text-align: center; border-radius: 6px; font-size: 20px; font-weight: bold;">
          🚨 NEW ORDER RECEIVED #${orderIdShort}
        </div>

        <div style="margin: 20px 0; font-size: 15px;">
          <p style="color: #ffffff;"><strong>Total Amount:</strong> <span style="color: #22c55e; font-size: 20px; font-weight: bold;">$${(order.total || order.totalAmount || 0).toFixed(2)}</span></p>
          <p style="color: #ffffff;"><strong>Payment Method:</strong> ${order.paymentMethod || 'Pending'}</p>
          <p style="color: #ffffff;"><strong>Customer Email:</strong> ${customerEmail}</p>
          <p style="color: #ffffff;"><strong>Customer Phone:</strong> ${address.phone || 'N/A'}</p>
        </div>

        <div style="background: #121214; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #2a2a2c;">
          <h3 style="color: #c4222f; margin-top: 0;">CUSTOMER SHIPPING INFO</h3>
          <p style="color: #c5c5c8; margin: 0; line-height: 1.5;">
            Name: ${customerName}<br/>
            Address: ${address.address || ''} ${address.apartment ? `, ${address.apartment}` : ''}<br/>
            City/State/Zip: ${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}
          </p>
        </div>

        <div style="background: #121214; padding: 15px; border-radius: 8px; border: 1px solid #2a2a2c;">
          <h3 style="color: #c4222f; margin-top: 0;">ORDERED ITEMS</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 1px solid #3a3a3c; color: #8c8c8f; text-align: left;">
                <th style="padding: 6px;">PRODUCT</th>
                <th style="padding: 6px; text-align: center;">QTY</th>
                <th style="padding: 6px; text-align: right;">PRICE</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const fromHeader = `"${process.env.EMAIL_FROM_NAME || 'Apex PepCo Orders'}" <${EMAIL_USER}>`;

    // Send Customer Email
    if (customerEmail) {
      const res1 = await transporter.sendMail({
        from: fromHeader,
        to: customerEmail,
        replyTo: fromHeader,
        subject: `[Apex PepCo] Order Confirmation - #${orderIdShort}`,
        html: customerHtml,
        headers: {
          'X-Priority': '1',
          'X-Mailer': 'ApexPepCo-Mailer',
          'List-Unsubscribe': `<mailto:${EMAIL_USER}?subject=unsubscribe>`,
        }
      });
      console.log(`✉️ Customer email delivered to ${customerEmail}:`, res1.messageId);
    } else {
      console.warn('⚠️ No customer email found in order:', order.orderNumber);
    }

    // Send Admin Email
    const res2 = await transporter.sendMail({
      from: fromHeader,
      to: ADMIN_EMAIL,
      replyTo: customerEmail || fromHeader,
      subject: `🚨 [NEW ORDER ALERT] #${orderIdShort} - $${(order.total || order.totalAmount || 0).toFixed(2)} (${customerName})`,
      html: adminHtml,
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'ApexPepCo-Mailer',
      }
    });
    console.log(`🔔 Admin notification email delivered to ${ADMIN_EMAIL}:`, res2.messageId);

  } catch (err) {
    console.error('❌ Error sending order emails via Gmail SMTP:', err);
  }
};

module.exports = { sendOrderEmails };
