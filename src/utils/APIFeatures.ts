import { ObjectId } from 'mongodb';
import { Aggregate, Query, QueryOptions } from 'mongoose';
import Category from '../models/Category';

type QueryType = Query<any, any>;

interface AggregateOptions {
  sort?: string;
  paginate?: string;
  filter?: [string];
  properties?: { [key: string]: string };
  category?: string;
  fields?: string;
  page?: number;
  limit?: number;
}

export class APIQueryFeatures {
  query: QueryType;

  queryString: QueryOptions;
  constructor(query: QueryType, queryString: QueryOptions) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = structuredClone(this.queryString);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  filterByCategory() {
    if (this.queryString.category)
      this.query = this.query.find({
        category: { $in: [this.queryString.category] },
      });
    else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = `${this.queryString.sort}`.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-publishedAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = `${this.queryString.fields}`.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }
  paginate() {
    const page = this.queryString.page ?? 1;
    const limit = this.queryString.limit ?? 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export class APIAggregateFeatures {
  aggregate: Aggregate<any>;
  options?: AggregateOptions;
  constructor(aggregate: Aggregate<any>, options: AggregateOptions = {}) {
    this.aggregate = aggregate;
    this.options = options;
  }

  filter() {
    const properties = this.options?.properties;
    if (!properties) {
      return this;
    }
    const excludedProperties = ['page', 'sort', 'limit', 'fields'];

    const requiredProperties = structuredClone(properties);
    excludedProperties.forEach(property => delete requiredProperties[property]);

    let projectString = JSON.stringify(requiredProperties);
    projectString = projectString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    const projectObject = JSON.parse(projectString)
      .split(',')
      .map((el: string) => {
        return { [el]: 1 };
      });

    this.aggregate.project(projectObject);
    return this;
  }
  filterByCategory() {
    if (this.options?.category) {
      const categoryId = new ObjectId(this.options.category.toString());

      this.aggregate
        .match({
          category: { $in: [categoryId] },
        })
        .lookup({
          from: Category.collection.name,
          localField: 'category'.toString(),
          foreignField: '_id'.toString(),
          as: 'category',
        });
    }

    return this;
  }
  sort() {
    if (this.options?.sort) {
      const sortBy = `${this.options.sort}`.split(',').join(' ');
      this.aggregate = this.aggregate.sort(sortBy);
    } else {
      this.aggregate = this.aggregate.sort('-publishedAt');
    }

    return this;
  }

  limitFields() {
    if (this.options?.fields) {
      const fields = `${this.options.fields}`.split(',');

      const projectObject = fields.reduce((prev, cur) => {
        return { ...prev, [cur]: 1 };
      }, {});

      this.aggregate.project(projectObject);
    } else {
      this.aggregate = this.aggregate.project({
        __v: 0,
      });
    }

    return this;
  }
  paginate() {
    const page = this.options?.page ?? 1;
    const limit = this.options?.limit ?? 20;
    const skip = (page - 1) * limit;

    this.aggregate = this.aggregate.skip(+skip).limit(+limit);

    return this;
  }

  populateFields(options: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
    foreignFieldFields?: object;
    asArray?: boolean;
  }) {
    const pipeline = [];
    if (options.foreignFieldFields) {
      pipeline.push({
        $project: options.foreignFieldFields,
      });
    }
    this.aggregate.lookup({
      from: options.from,
      localField: options.localField.toString(),
      foreignField: options.foreignField.toString(),
      as: options.as,
      pipeline,
    });

    if (!options.asArray) {
      this.aggregate.unwind(options.localField);
    }

    return this;
  }
}
