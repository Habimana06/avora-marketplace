import config from '../config/env.js';

export async function sendSMS({ to, message }) {
  if (!config.sms.enabled) {
    console.log(`[SMS disabled] Would send to ${to}: ${message}`);
    return { success: true, mock: true };
  }

  if (!config.sms.accountSid || !config.sms.authToken) {
    console.warn('[SMS] Twilio credentials not configured');
    return { success: false, error: 'SMS not configured' };
  }

  try {
    const twilio = await import('twilio');
    const client = twilio.default(config.sms.accountSid, config.sms.authToken);

    const result = await client.messages.create({
      body: message,
      from: config.sms.fromNumber,
      to,
    });

    return { success: true, sid: result.sid };
  } catch (err) {
    console.error('[SMS] Send failed:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendOrderStatusSMS(phone, orderNumber, status) {
  return sendSMS({
    to: phone,
    message: `AVORA: Your order ${orderNumber} is now ${status.replace(/_/g, ' ').toLowerCase()}.`,
  });
}

export async function sendDeliveryNotification(phone, orderNumber) {
  return sendSMS({
    to: phone,
    message: `AVORA: Your order ${orderNumber} is out for delivery. Our agent will contact you shortly.`,
  });
}
