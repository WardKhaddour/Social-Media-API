import { ObjectId } from 'mongodb';
import { Aggregate, Model, Query, QueryOptions } from 'mongoose';
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
  model?: Model<any>;
  metaData = { totalPages: 0, page: 1 };
  constructor(query: QueryType, queryString: QueryOptions, model?: Model<any>) {
    this.query = query;
    this.queryString = queryString;
    this.model = model;
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
  async paginate(options?: { limit?: number }) {
    const page = this.queryString.page ?? 1;
    const limit = this.queryString.limit || options?.limit || 20;
    const skip = (page - 1) * limit;

    const totalDocs = (await this.model?.countDocuments({})) || 1;
    this.query = this.query.skip(skip).limit(limit);
    this.metaData = { totalPages: Math.ceil(totalDocs / limit), page };

    return this;
  }
}

export class APIAggregateFeatures {
  aggregate: Aggregate<any>;
  options?: AggregateOptions;
  model?: Model<any>;
  metaData = { totalPages: 0, page: 1 };
  constructor(
    aggregate: Aggregate<any>,
    options: AggregateOptions = {},
    model?: Model<any>
  ) {
    this.aggregate = aggregate;
    this.options = options;
    this.model = model;
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

  filterByMatches(options: {
    filedName: string;
    singleMatch?: string;
    arrayMatches?: any[];
  }) {
    if (options.singleMatch) {
      this.aggregate.match({
        [options.filedName]: options.singleMatch,
      });
    } else if (options.arrayMatches) {
      this.aggregate.match({
        [options.filedName]: { $in: options.arrayMatches },
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
  async paginate() {
    const page = this.options?.page ?? 1;
    const limit = this.options?.limit ?? 20;
    const skip = (page - 1) * limit;
    let totalDocs = (await this.model?.countDocuments({})) || 1;

    this.aggregate = this.aggregate.skip(+skip).limit(+limit);
    this.metaData = {
      totalPages: Math.ceil(totalDocs / limit),
      page,
    };

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

  addFields(fieldName: string, condition: any) {
    this.aggregate.addFields({
      [fieldName]: condition,
    });

    return this;
  }
  removeFields(fields: string[]) {
    const projectObj = fields.reduce((cur, field) => {
      return { ...cur, [field]: 0 };
    }, {});
    this.aggregate.project(projectObj);

    return this;
  }
}
