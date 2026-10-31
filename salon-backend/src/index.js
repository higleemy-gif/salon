const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const { startScheduler } = require('./services/scheduler');
const whatsapp = require('./services/whatsappService');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const serviceRoutes = require('./routes/services');
const staffRoutes = require('./routes/staff');
const appointmentRoutes = require('./routes/appointments');
const invoiceRoutes = require('./routes/invoices');
const loyaltyRoutes = require('./routes/loyalty');
const messageRoutes = require('./routes/messages');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');
const reportRoutes = require('./routes/reports');
const expenseRoutes = require('./routes/expenses');
const whatsappRoutes = require('./routes/whatsapp');
const campaignRoutes = require('./routes/campaigns');
const publicRoutes = require('./routes/public');
const feedbackRoutes = require('./routes/feedback');
const membershipRoutes = require('./routes/memberships');
const walletRoutes = require('./routes/wallet');
const giftVoucherRoutes = require('./routes/giftVouchers');
const productRoutes = require('./routes/products');
const happyHourRoutes = require('./routes/happyHours');
const upsellRoutes = require('./routes/upsells');
const waitlistRoutes = require('./routes/waitlist');
const queueRoutes = require('./routes/queue');
const commissionRoutes = require('./routes/commissions');
const referralRoutes = require('./routes/referrals');
const vipTierRoutes = require('./routes/vipTiers');
const whatsappCrmRoutes = require('./routes/whatsappCrm');

const app = express();

// Running behind Coolify's reverse proxy — trust it so client IPs and
// X-Forwarded-* headers are handled correctly (needed by express-rate-limit).
app.set('trust proxy', 1);

// ── Security Middleware ──
app.use(helmet());
app.use(compression());

// CORS: only the configured frontend (FRONTEND_URL) plus any extra origins in
// CORS_ORIGINS. Localhost dev ports are allowed only outside production.
const allowedOrigins = new Set([config.frontendUrl, ...config.corsOrigins]);
if (config.nodeEnv !== 'production') {
  ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
    .forEach((o) => allowedOrigins.add(o));
}
console.log(`🌐 CORS allowed origins: ${[...allowedOrigins].join(', ')}`);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Settings carries the salon logo as a base64 data URL (UI caps the file at 500 KB,
// ~670 KB once encoded) plus the invoice template JSON, so it needs a bigger limit.
// This parser runs first for /api/settings; the global one then skips parsed bodies.
app.use('/api/settings', express.json({ limit: '1mb' }));
app.use(express.json({ limit: '100kb' }));

// ── Request Logging ──
if (config.nodeEnv === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// ── Rate Limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 100000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', apiLimiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 15 : 100000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Root route ──
app.get('/', (_req, res) => {
  res.json({
    message: 'Orrenza Salon Management API',
    version: '1.0.0',
    status: 'running',
    docs: 'API endpoints available under /api/*',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      appointments: '/api/appointments',
      services: '/api/services',
      staff: '/api/staff',
      dashboard: '/api/dashboard',
      health: '/api/health'
    },
    frontend: 'Deploy the salon-app to access the admin dashboard',
    timestamp: new Date().toISOString()
  });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/gift-vouchers', giftVoucherRoutes);
app.use('/api/products', productRoutes);
app.use('/api/happy-hours', happyHourRoutes);
app.use('/api/upsells', upsellRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/vip-tiers', vipTierRoutes);
app.use('/api/whatsapp-crm', whatsappCrmRoutes);

// ── Error handler ──
app.use(errorHandler);

// ── Start server ──
app.listen(config.port, () => {
  console.log(`🚀 Salon API running on http://localhost:${config.port}`);
  startScheduler();
  whatsapp.autoConnect();

  // Register disconnect alert — logs to console + could add DB/email alert
  whatsapp.onDisconnectAlert(({ reason, timestamp }) => {
    console.error(`\n${'='.repeat(60)}`);
    console.error(`🚨 WHATSAPP DISCONNECT ALERT`);
    console.error(`   Time: ${timestamp}`);
    console.error(`   Reason: ${reason}`);
    console.error(`   Action: Check Settings > WhatsApp or restart server`);
    console.error(`${'='.repeat(60)}\n`);
  });
});

module.exports = app;
