export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  webhookSecret: process.env.WEBHOOK_SECRET,
  n8n: {
    leadSearchWebhookUrl: process.env.N8N_LEAD_SEARCH_WEBHOOK_URL,
    dispatchWebhookUrl: process.env.N8N_DISPATCH_WEBHOOK_URL,
    whatsappConnectWebhookUrl: process.env.N8N_WHATSAPP_CONNECT_WEBHOOK_URL,
  },
});
