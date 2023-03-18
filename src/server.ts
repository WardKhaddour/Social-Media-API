import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
import app from './app';

const DB: string = process.env.DATABASE_LOCAL!;

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch(err => console.error(err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
