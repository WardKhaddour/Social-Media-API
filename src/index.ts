import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION !!!💣️💣️ Shutting Down ...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
import app from './api';

import { Server } from 'socket.io';
const DB: string = process.env.DATABASE_HOST!;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch(err => console.error(err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION !!!💣️💣️ Shutting Down ...');
  console.log(err.name, err.message);
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

export { io };
