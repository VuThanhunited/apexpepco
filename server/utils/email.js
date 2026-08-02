const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'vtu21102000@gmail.com';

// Create Nodemailer Transporter
const getTransporter = async () => {
  // 1. Check custom SMTP credentials from environment
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

  // 2. Check Gmail SMTP credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    try {
      await gmailTransporter.verify();
      console.log('✅ Gmail SMTP verified successfully for:', process.env.EMAIL_USER);
      return gmailTransporter;
    } catch (err) {
      console.warn('⚠️ Gmail SMTP direct login notice:', err.message);
      console.warn('💡 Ghi chú: Vì tài khoản Gmail đã bật Xác minh 2 bước, Google yêu cầu tạo "Mật khẩu ứng dụng" (App Password) tại: https://myaccount.google.com/apppasswords');
      console.log('🔄 Đang tự động chuyển sang chế độ Mailer dự phòng (Ethereal Dev Mailer)...');
    }
  }

  // 3. Fallback: Ethereal auto-generated test SMTP for development
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('⚠️ Could not create Ethereal test mailer account:', err.message);
    return null;
  }
};

/**
 * Send order confirmation email to Customer & notification email to Admin
 */
const sendOrderEmails = async (order) => {
  try {
    const transporter = await getTransporter();

    const orderIdShort = order._id.toString().slice(-6).toUpperCase();
    const customerEmail = order.shippingAddress?.email || order.guestEmail || (order.user && order.user.email);
    const customerName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Valued Customer';
    const address = order.shippingAddress || {};

    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #2a2a2c;">
        <td style="padding: 12px; color: #ffffff;">
          <strong>${item.name || item.title || 'Peptide Product'}</strong>
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
          <h1 style="color: #c4222f; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px;">▲ APEX PEP CO</h1>
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
            <p style="margin: 4px 0; color: #8c8c8f;">Shipping: <strong style="color: #ffffff;">${order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</strong></p>
            <p style="margin: 8px 0 0 0; font-size: 18px; color: #c4222f;">Total: <strong>$${(order.total || 0).toFixed(2)}</strong></p>
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
          <p style="color: #ffffff;"><strong>Total Amount:</strong> <span style="color: #22c55e; font-size: 20px; font-weight: bold;">$${(order.total || 0).toFixed(2)}</span></p>
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

    // ─────────────────────────────────────────────────────────────
    // SEND EMAILS
    // ─────────────────────────────────────────────────────────────
    const fromAddress = process.env.EMAIL_FROM || '"Apex PepCo Orders" <orders@apexpepco.com>';

    if (transporter) {
      // Send to Customer
      if (customerEmail) {
        const info1 = await transporter.sendMail({
          from: fromAddress,
          to: customerEmail,
          subject: `[Apex PepCo] Order Confirmation - #${orderIdShort}`,
          html: customerHtml,
        });
        console.log(`✉️ Customer confirmation email sent to ${customerEmail}:`, nodemailer.getTestMessageUrl(info1) || info1.messageId);
      }

      // Send to Admin (vtu21102000@gmail.com)
      const info2 = await transporter.sendMail({
        from: fromAddress,
        to: ADMIN_EMAIL,
        subject: `🚨 [NEW ORDER ALERT] #${orderIdShort} - $${(order.total || 0).toFixed(2)} (${customerName})`,
        html: adminHtml,
      });
      console.log(`🔔 Admin notification email sent to ${ADMIN_EMAIL}:`, nodemailer.getTestMessageUrl(info2) || info2.messageId);
    } else {
      console.log(`ℹ️ Mailer transporter inactive. Order #${orderIdShort} logged for ${customerEmail} & ${ADMIN_EMAIL}`);
    }

  } catch (err) {
    console.error('❌ Error sending order emails:', err.message);
  }
};

module.exports = { sendOrderEmails };
