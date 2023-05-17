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
const APIFeatures_1 = require("./../../utils/APIFeatures");
const constants_1 = require("../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = __importDefault(require("../../models/Post"));
const User_1 = __importDefault(require("../../models/User"));
const Category_1 = __importDefault(require("../../models/Category"));
const mongodb_1 = require("mongodb");
const getAllPosts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const savedPosts = (_a = req.user) === null || _a === void 0 ? void 0 : _a.savedPosts;
    const aggregation = new APIFeatures_1.APIAggregateFeatures(Post_1.default.aggregate(), req.query, Post_1.default)
        .removeFields(['attachment'])
        .populateFields({
        from: User_1.default.collection.name,
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        foreignFieldFields: {
            name: 1,
            _id: 1,
        },
    });
    //Filter Posts by Following
    if (req.params.byFollowing === '1') {
        const following = req.params.following.split(',').map(el => new mongodb_1.ObjectId(el)) || [];
        delete req.params.following;
        delete req.params.byFollowing;
        aggregation.aggregate.match({
            'author._id': { $in: following },
        });
    }
    aggregation.filter().filterByCategory().sort().limitFields();
    if (!req.query.category) {
        aggregation.populateFields({
            from: Category_1.default.collection.name,
            localField: 'category',
            foreignField: '_id',
            as: 'category',
            foreignFieldFields: {
                __v: 0,
            },
            asArray: true,
        });
    }
    aggregation.paginate();
    if (savedPosts)
        aggregation.addFields('isSaved', { $in: ['$_id', savedPosts] });
    const posts = yield aggregation.aggregate.exec();
    res.status(constants_1.OK).json({
        success: true,
        data: {
            posts,
            totalPages: aggregation.metaData.totalPages,
            page: aggregation.metaData.page,
        },
    });
}));
exports.default = getAllPosts;
