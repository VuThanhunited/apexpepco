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
      port: parseInt(process.env.SMTP_PORT || '587', 10),
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

    const orderIdShort = order.orderNumber || (order._id ? order._id.toString().slice(-8).toUpperCase() : 'APEX-ORDER');
    
    // Resolve Customer Email reliably
    let customerEmail = (
      order.shippingAddress?.email ||
      order.guestEmail ||
      (order.user && typeof order.user === 'object' ? order.user.email : null)
    );

    // Fallback: If user is an ObjectId, lookup user email in DB
    if (!customerEmail && order.user) {
      try {
        const User = require('../models/User');
        const userDoc = await User.findById(order.user).select('email firstName lastName').lean();
        if (userDoc?.email) {
          customerEmail = userDoc.email;
        }
      } catch (err) {
        console.warn('⚠️ Could not resolve customer email from User ID:', err.message);
      }
    }

    if (customerEmail) {
      customerEmail = customerEmail.trim();
    }

    const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Valued Customer';
    const address = order.shippingAddress || {};
    const siteUrl = process.env.CLIENT_URL || 'https://apexpepco.com';
    const orderTotal = Number(order.total || order.totalAmount || 0);
    const subtotal = Number(order.subtotal || 0);
    const shippingCost = Number(order.shippingCost || 0);
    const paymentMethodText = (order.paymentMethod || 'Credit Card / Pending').toUpperCase().replace(/_/g, ' ');

    const itemsHtml = (order.items || []).map(item => `
      <tr style="border-bottom: 1px solid #2a2a2c;">
        <td style="padding: 12px; color: #ffffff; font-size: 14px;">
          <strong style="color: #ffffff;">${item.productName || item.name || item.title || 'Research Compound'}</strong>
          ${item.variant ? `<br/><span style="font-size: 12px; color: #9ca3af;">Option: ${item.variant.name || item.variant}</span>` : ''}
        </td>
        <td style="padding: 12px; text-align: center; color: #e5e7eb; font-size: 14px;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; color: #ffffff; font-size: 14px; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const itemsText = (order.items || []).map(item => 
      `- ${item.productName || item.name || 'Product'} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    // ─────────────────────────────────────────────────────────────
    // 1. CUSTOMER EMAIL CONTENT (HTML + TEXT)
    // ─────────────────────────────────────────────────────────────
    const customerText = `Hello ${customerName},

Thank you for your order with Apex PepCo!
Order Reference: #${orderIdShort}

ORDER SUMMARY:
${itemsText}

Subtotal: $${subtotal.toFixed(2)}
Shipping: ${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
Total: $${orderTotal.toFixed(2)}

SHIPPING ADDRESS:
${customerName}
${address.address || ''}${address.apartment ? `, ${address.apartment}` : ''}
${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}
${address.country || 'USA'}
Phone: ${address.phone || 'N/A'}

PAYMENT METHOD: ${paymentMethodText}

We are preparing your order. You will receive another notification once your package has shipped.
If you have any questions, reply to this email or visit ${siteUrl}/contact

Best regards,
Apex PepCo Team
`;

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation #${orderIdShort}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e7eb;">
        <div style="max-width: 600px; margin: 30px auto; background-color: #141416; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <div style="background-color: #18181b; padding: 25px 20px; text-align: center; border-bottom: 2px solid #c4222f;">
            <a href="${siteUrl}" style="text-decoration: none;">
              <h1 style="margin: 0; color: #c4222f; font-size: 24px; letter-spacing: 2px; font-weight: 800;">APEX PEP CO</h1>
            </a>
            <p style="margin: 6px 0 0 0; color: #a1a1aa; font-size: 12px; letter-spacing: 1px;">RESEARCH GRADE COMPOUNDS</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 28px 24px;">
            <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 14px; margin-bottom: 20px; text-align: center;">
              <h2 style="margin: 0; color: #22c55e; font-size: 18px;">✓ Order Confirmed #${orderIdShort}</h2>
            </div>

            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Hello <strong>${customerName}</strong>,<br/>
              Thank you for ordering with <strong>Apex PepCo</strong>. We have received your order details and are preparing your research compounds for dispatch.
            </p>

            <!-- Order Summary Table -->
            <div style="background: #1c1c20; border: 1px solid #2e2e34; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px 0; color: #c4222f; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #3f3f46; color: #a1a1aa; font-size: 12px; text-align: left;">
                    <th style="padding: 8px 12px;">PRODUCT</th>
                    <th style="padding: 8px 12px; text-align: center;">QTY</th>
                    <th style="padding: 8px 12px; text-align: right;">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="margin-top: 16px; border-top: 1px solid #3f3f46; padding-top: 12px; text-align: right; font-size: 14px;">
                <p style="margin: 4px 0; color: #a1a1aa;">Subtotal: <strong style="color: #ffffff;">$${subtotal.toFixed(2)}</strong></p>
                <p style="margin: 4px 0; color: #a1a1aa;">Shipping: <strong style="color: #ffffff;">${shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</strong></p>
                <p style="margin: 8px 0 0 0; font-size: 18px; color: #c4222f; font-weight: bold;">Total: $${orderTotal.toFixed(2)}</p>
              </div>
            </div>

            <!-- Shipping & Payment Grid -->
            <div style="display: table; width: 100%; margin-bottom: 20px;">
              <div style="background: #1c1c20; border: 1px solid #2e2e34; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                <h4 style="margin: 0 0 8px 0; color: #c4222f; font-size: 13px; text-transform: uppercase;">Shipping Address</h4>
                <p style="margin: 0; color: #d4d4d8; font-size: 14px; line-height: 1.5;">
                  <strong>${customerName}</strong><br/>
                  ${address.address || ''}${address.apartment ? `, ${address.apartment}` : ''}<br/>
                  ${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}<br/>
                  ${address.country || 'USA'}<br/>
                  Phone: ${address.phone || 'N/A'}
                </p>
              </div>

              <div style="background: #1c1c20; border: 1px solid #2e2e34; border-radius: 8px; padding: 16px;">
                <h4 style="margin: 0 0 8px 0; color: #c4222f; font-size: 13px; text-transform: uppercase;">Payment Method</h4>
                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                  ${paymentMethodText}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="${siteUrl}/account/orders" style="display: inline-block; background-color: #c4222f; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                View Order in Account
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #101012; border-top: 1px solid #27272a; padding: 20px; text-align: center; font-size: 12px; color: #71717a;">
            <p style="margin: 0 0 8px 0;">For research use only. Not for human consumption.</p>
            <p style="margin: 0;">Apex PepCo © 2026. All rights reserved. • <a href="${siteUrl}/contact" style="color: #c4222f; text-decoration: none;">Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ─────────────────────────────────────────────────────────────
    // 2. ADMIN EMAIL CONTENT (HTML + TEXT)
    // ─────────────────────────────────────────────────────────────
    const adminText = `[NEW ORDER RECEIVED] #${orderIdShort}
Total: $${orderTotal.toFixed(2)}
Payment: ${paymentMethodText}
Customer: ${customerName} (${customerEmail || 'No Email'})
Phone: ${address.phone || 'N/A'}
Address: ${address.address || ''}, ${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}

ITEMS:
${itemsText}
`;

    const adminHtml = `
      <div style="background-color: #0b0b0c; color: #ededed; font-family: sans-serif; padding: 30px; max-width: 650px; margin: 0 auto; border-radius: 10px; border: 2px solid #c4222f;">
        <div style="background: #c4222f; color: #ffffff; padding: 15px; text-align: center; border-radius: 6px; font-size: 20px; font-weight: bold;">
          🚨 NEW ORDER RECEIVED #${orderIdShort}
        </div>

        <div style="margin: 20px 0; font-size: 15px;">
          <p style="color: #ffffff; margin: 6px 0;"><strong>Total Amount:</strong> <span style="color: #22c55e; font-size: 20px; font-weight: bold;">$${orderTotal.toFixed(2)}</span></p>
          <p style="color: #ffffff; margin: 6px 0;"><strong>Payment Method:</strong> ${paymentMethodText}</p>
          <p style="color: #ffffff; margin: 6px 0;"><strong>Customer Email:</strong> <a href="mailto:${customerEmail}" style="color: #c4222f;">${customerEmail || 'N/A'}</a></p>
          <p style="color: #ffffff; margin: 6px 0;"><strong>Customer Phone:</strong> ${address.phone || 'N/A'}</p>
        </div>

        <div style="background: #121214; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #2a2a2c;">
          <h3 style="color: #c4222f; margin-top: 0;">CUSTOMER SHIPPING INFO</h3>
          <p style="color: #c5c5c8; margin: 0; line-height: 1.5;">
            Name: ${customerName}<br/>
            Address: ${address.address || ''} ${address.apartment ? `, ${address.apartment}` : ''}<br/>
            City/State/Zip: ${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}<br/>
            Country: ${address.country || 'USA'}
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

    const fromHeader = process.env.EMAIL_FROM || `"Apex PepCo Orders" <${EMAIL_USER}>`;
    const replyToEmail = ADMIN_EMAIL || EMAIL_USER;

    // Send both Customer & Admin emails independently
    const emailPromises = [];

    // 1. Send Customer Email
    if (customerEmail) {
      emailPromises.push(
        transporter.sendMail({
          from: fromHeader,
          to: customerEmail,
          replyTo: replyToEmail,
          subject: `Order Confirmation #${orderIdShort} — Apex PepCo`,
          text: customerText,
          html: customerHtml,
        }).then(res => {
          console.log(`✉️ Customer email delivered to [${customerEmail}]:`, res.messageId);
          return { recipient: 'customer', success: true, messageId: res.messageId };
        }).catch(err => {
          console.error(`❌ Customer email failed for [${customerEmail}]:`, err.message);
          return { recipient: 'customer', success: false, error: err.message };
        })
      );
    } else {
      console.warn(`⚠️ No customer email found in order #${orderIdShort}`);
    }

    // 2. Send Admin Email
    emailPromises.push(
      transporter.sendMail({
        from: fromHeader,
        to: ADMIN_EMAIL,
        replyTo: customerEmail || replyToEmail,
        subject: `🚨 [NEW ORDER ALERT] #${orderIdShort} - $${orderTotal.toFixed(2)} (${customerName})`,
        text: adminText,
        html: adminHtml,
      }).then(res => {
        console.log(`🔔 Admin notification email delivered to [${ADMIN_EMAIL}]:`, res.messageId);
        return { recipient: 'admin', success: true, messageId: res.messageId };
      }).catch(err => {
        console.error(`❌ Admin notification email failed for [${ADMIN_EMAIL}]:`, err.message);
        return { recipient: 'admin', success: false, error: err.message };
      })
    );

    const results = await Promise.allSettled(emailPromises);
    return results;

  } catch (err) {
    console.error('❌ Error sending order emails via SMTP:', err);
  }
};

module.exports = { sendOrderEmails };
