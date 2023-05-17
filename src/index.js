"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION !!!💣️💣️ Shutting Down ...');
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config();
const api_1 = __importDefault(require("./api"));
const socket_io_1 = require("socket.io");
const DB = process.env.DATABASE_HOST;
mongoose_1.default
    .connect(DB)
    .then(() => {
    console.log('DB connection successful');
})
    .catch(err => console.error(err));
const port = process.env.PORT || 3000;
const server = api_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION !!!💣️💣️ Shutting Down ...');
    console.log(err.name, err.message);
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});
