"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIAggregateFeatures = exports.APIQueryFeatures = void 0;
const mongodb_1 = require("mongodb");
const Category_1 = __importDefault(require("../models/Category"));
class APIQueryFeatures {
    constructor(query, queryString, model) {
        this.metaData = { totalPages: 0, page: 1 };
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
        }
        else {
            this.query = this.query.sort('-publishedAt');
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = `${this.queryString.fields}`.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_a = this.queryString.page) !== null && _a !== void 0 ? _a : 1;
            const limit = this.queryString.limit || (options === null || options === void 0 ? void 0 : options.limit) || 20;
            const skip = (page - 1) * limit;
            const totalDocs = (yield ((_b = this.model) === null || _b === void 0 ? void 0 : _b.countDocuments({}))) || 1;
            this.query = this.query.skip(skip).limit(limit);
            this.metaData = { totalPages: Math.ceil(totalDocs / limit), page };
            return this;
        });
    }
}
exports.APIQueryFeatures = APIQueryFeatures;
class APIAggregateFeatures {
    constructor(aggregate, options = {}, model) {
        this.metaData = { totalPages: 0, page: 1 };
        this.aggregate = aggregate;
        this.options = options;
        this.model = model;
    }
    filter() {
        var _a;
        const properties = (_a = this.options) === null || _a === void 0 ? void 0 : _a.properties;
        if (!properties) {
            return this;
        }
        const excludedProperties = ['page', 'sort', 'limit', 'fields'];
        const requiredProperties = structuredClone(properties);
        excludedProperties.forEach(property => delete requiredProperties[property]);
        let projectString = JSON.stringify(requiredProperties);
        projectString = projectString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const projectObject = JSON.parse(projectString)
            .split(',')
            .map((el) => {
            return { [el]: 1 };
        });
        this.aggregate.project(projectObject);
        return this;
    }
    filterByCategory() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.category) {
            const categoryId = new mongodb_1.ObjectId(this.options.category.toString());
            this.aggregate
                .match({
                category: { $in: [categoryId] },
            })
                .lookup({
                from: Category_1.default.collection.name,
                localField: 'category'.toString(),
                foreignField: '_id'.toString(),
                as: 'category',
            });
        }
        return this;
    }
    filterByMatches(options) {
        if (options.singleMatch) {
            this.aggregate.match({
                [options.filedName]: options.singleMatch,
            });
        }
        else if (options.arrayMatches) {
            this.aggregate.match({
                [options.filedName]: { $in: options.arrayMatches },
            });
        }
        return this;
    }
    sort() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.sort) {
            const sortBy = `${this.options.sort}`.split(',').join(' ');
            this.aggregate = this.aggregate.sort(sortBy);
        }
        else {
            this.aggregate = this.aggregate.sort('-publishedAt');
        }
        return this;
    }
    limitFields() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.fields) {
            const fields = `${this.options.fields}`.split(',');
            const projectObject = fields.reduce((prev, cur) => {
                return Object.assign(Object.assign({}, prev), { [cur]: 1 });
            }, {});
            this.aggregate.project(projectObject);
        }
        else {
            this.aggregate = this.aggregate.project({
                __v: 0,
            });
        }
        return this;
    }
    paginate() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const page = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.page) !== null && _b !== void 0 ? _b : 1;
            const limit = (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.limit) !== null && _d !== void 0 ? _d : 20;
            const skip = (page - 1) * limit;
            let totalDocs = (yield ((_e = this.model) === null || _e === void 0 ? void 0 : _e.countDocuments({}))) || 1;
            this.aggregate = this.aggregate.skip(+skip).limit(+limit);
            this.metaData = {
                totalPages: Math.ceil(totalDocs / limit),
                page,
            };
            return this;
        });
    }
    populateFields(options) {
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
    addFields(fieldName, condition) {
        this.aggregate.addFields({
            [fieldName]: condition,
        });
        return this;
    }
    removeFields(fields) {
        const projectObj = fields.reduce((cur, field) => {
            return Object.assign(Object.assign({}, cur), { [field]: 0 });
        }, {});
        this.aggregate.project(projectObj);
        return this;
    }
}
exports.APIAggregateFeatures = APIAggregateFeatures;
