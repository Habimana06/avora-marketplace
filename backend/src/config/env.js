const config = {
  app: {
    name: process.env.APP_NAME || 'AVORA',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    frontendUrl: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'avora_jwt_secret_change_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'avora_refresh_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  mail: {
    enabled: process.env.MAIL_ENABLED === 'true',
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    from: process.env.MAIL_FROM || 'noreply@avora.rw',
    fromName: process.env.MAIL_FROM_NAME || 'AVORA',
  },
  sms: {
    enabled: process.env.SMS_ENABLED === 'true',
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '',
  },
  payments: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    mtnMomo: {
      apiKey: process.env.MTN_MOMO_API_KEY || '',
      apiSecret: process.env.MTN_MOMO_API_SECRET || '',
      subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
    },
    airtelMoney: {
      clientId: process.env.AIRTEL_MONEY_CLIENT_ID || '',
      clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET || '',
    },
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
};

export default config;
