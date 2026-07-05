import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import prisma from './config/database.js';
import config from './config/env.js';
import { getRedis } from './config/redis.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import workshopRoutes from './routes/workshop.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';

const redisClient = getRedis();

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: config.app.frontendUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(morgan('combined'));

app.get('/api/health', async (_req, res) => {
  let dbStatus = 'ok';
  let redisStatus = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }

  try {
    if (redisClient) {
      await redisClient.ping();
    } else {
      redisStatus = 'disabled';
    }
  } catch {
    redisStatus = 'error';
  }

  const healthy = dbStatus === 'ok';

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    app: config.app.name,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus,
      mail: config.mail.enabled ? 'enabled' : 'disabled',
      sms: config.sms.enabled ? 'enabled' : 'disabled',
    },
  });
});

app.get('/api/logs', async (_req, res) => {
  try {
    if (!redisClient) return res.json({ logs: [] });
    const logs = await redisClient.lrange('avora:logs', 0, 99);
    const formattedLogs = logs.map((log) => {
      try {
        return JSON.parse(log);
      } catch {
        return { message: log };
      }
    });
    res.json({ logs: formattedLogs.reverse() });
  } catch {
    res.json({ logs: [] });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/workshop', workshopRoutes);
app.use('/api/delivery', deliveryRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = config.app.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${config.app.name} Backend running on port ${PORT}`);
});

export { app, prisma, redisClient };
