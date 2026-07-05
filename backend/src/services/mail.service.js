import config from '../config/env.js';

export async function sendEmail({ to, subject, html, text }) {
  if (!config.mail.enabled) {
    console.log(`[MAIL disabled] Would send to ${to}: ${subject}`);
    return { success: true, mock: true };
  }

  if (!config.mail.user || !config.mail.password) {
    console.warn('[MAIL] SMTP credentials not configured');
    return { success: false, error: 'Mail not configured' };
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });

    const info = await transporter.sendMail({
      from: `"${config.mail.fromName}" <${config.mail.from}>`,
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>/g, ''),
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[MAIL] Send failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendOrderConfirmation(user, order) {
  return sendEmail({
    to: user.email,
    subject: `AVORA — Order ${order.orderNumber} Confirmed`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0D0D0D; font-size: 24px;">Thank you, ${user.firstName}</h1>
        <p style="color: #909090;">Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
        <p style="color: #909090;">Total: ${order.total} RWF</p>
        <p style="color: #B8892D;">— AVORA</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to AVORA',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0D0D0D;">Welcome to AVORA</h1>
        <p style="color: #909090;">African Luxury. Engineered Elegance.</p>
        <p style="color: #909090;">Hello ${user.firstName}, your account is ready.</p>
      </div>
    `,
  });
}
