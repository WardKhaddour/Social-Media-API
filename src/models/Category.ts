import mongoose from 'mongoose';
import { CategoryDocInterface } from '../interfaces/documents/CategoryDoc';

const CategorySchema = new mongoose.Schema<CategoryDocInterface>({
  name: {
    type: String,
    unique: true,
    required: [true, 'Category name is required'],
  },
});

const Category = mongoose.model<CategoryDocInterface>(
  'Category',
  CategorySchema
);

export default Category;
