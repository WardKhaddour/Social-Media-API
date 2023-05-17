"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
require("../localization");
const i18next_1 = __importDefault(require("i18next"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const auth_1 = __importDefault(require("../routes/auth"));
const user_1 = __importDefault(require("../routes/user"));
const posts_1 = __importDefault(require("../routes/posts"));
const category_1 = __importDefault(require("../routes/category"));
const constants_1 = require("../constants");
const AppError_1 = __importDefault(require("../utils/AppError"));
const errorController_1 = __importDefault(require("../controllers/errorController"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
app.set('view engine', 'pug');
app.set('views', path_1.default.join(__dirname, 'views'));
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour',
});
// Allow cors
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// Set Security HTTP Headers
app.use((0, helmet_1.default)());
// Limit requests from same IP
// app.use('/api', limiter);
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Body parser
app.use(express_1.default.json({
    limit: '10kb',
}));
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
// Prevent parameter pollution
app.use((0, hpp_1.default)({
    whitelist: [],
}));
// Compress text responses
app.use((0, compression_1.default)());
// Serving static files
app.use(express_1.default.static('public'));
//Add Socket Id to request
app.use('/api/v1', (req, res, next) => {
    const socketId = req.headers.socketid;
    req.socketId = socketId;
    next();
});
// Language Headers
app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
app.use('/api/v1', (req, res, next) => {
    const lang = req.headers.lang || 'en';
    req.i18n.changeLanguage(lang);
    req.i18n.getFixedT(lang);
    next();
});
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/post', posts_1.default);
app.use('/api/v1/category', category_1.default);
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server`, constants_1.NOT_FOUND));
});
app.use(errorController_1.default);
exports.default = app;
