import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import { NOT_FOUND } from './constants';
import AppError from './utils/AppError';
import globalErrorHandler from './controllers/errorController';

const app: express.Application = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

// Allow cors
app.use(
  cors({
    origin: '*',
  })
);

// Set Security HTTP Headers
app.use(helmet());

// Limit requests from same IP
app.use('/api', limiter);

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Serving static files
app.use(express.static('public'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, NOT_FOUND));
});

app.use(globalErrorHandler);

export default app;
