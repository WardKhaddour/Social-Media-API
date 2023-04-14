import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Post from '../src/models/Post';
import Like from '../src/models/Like';
import Comment from '../src/models/Comment';

dotenv.config();
console.log(process.env.DATABASE_LOCAL);

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

//READ JSON FILE
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const likes = JSON.parse(fs.readFileSync(`${__dirname}/likes.json`, 'utf-8'));
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/comments.json`, 'utf-8')
);
//IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Post.create(posts);
    await User.create(users, { validateBeforeSave: false });
    await Comment.create(comments);
    await Like.create(likes);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();
    await Like.deleteMany();
    await Comment.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
