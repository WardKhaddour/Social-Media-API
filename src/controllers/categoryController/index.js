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
exports.deleteCategory = exports.updateCategory = exports.addNewCategory = exports.getAllCategories = void 0;
const constants_1 = require("./../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Category_1 = __importDefault(require("../../models/Category"));
const constants_2 = require("../../constants");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const APIFeatures_1 = require("../../utils/APIFeatures");
exports.getAllCategories = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = yield new APIFeatures_1.APIQueryFeatures(Category_1.default.find(), req.query, Category_1.default)
        .sort()
        .limitFields()
        .paginate({
        limit: +(req.query.limit || 10),
    });
    const categories = yield features.query.exec();
    res.status(constants_2.OK).json({
        success: true,
        data: {
            categories,
            totalPages: features.metaData.totalPages,
            page: features.metaData.page,
        },
    });
}));
exports.addNewCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const foundedCategory = yield Category_1.default.findOne({
        name,
    });
    if (foundedCategory) {
        return next(new AppError_1.default(req.i18n.t('categoryMsg.categoryExists'), constants_1.BAD_REQUEST));
    }
    const category = yield Category_1.default.create({
        name,
    });
    res.status(constants_2.CREATED).json({
        success: true,
        message: req.i18n.t('categoryMsg.categoryAdded'),
        data: {
            category: {
                name: category === null || category === void 0 ? void 0 : category.name,
            },
        },
    });
}));
exports.updateCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const { name } = req.body;
    const category = yield Category_1.default.findById(categoryId);
    if (!category) {
        return next(new AppError_1.default(req.i18n.t('categoryMsg.noCategory'), constants_1.NOT_FOUND));
    }
    if (category.name === name) {
        new AppError_1.default(req.i18n.t('categoryMsg.categoryExists'), constants_1.BAD_REQUEST);
    }
    category.name = name;
    yield category.save();
    res.status(constants_2.OK).json({
        success: true,
        message: req.i18n.t('categoryMsg.categoryUpdated'),
        data: {
            category: {
                name: category === null || category === void 0 ? void 0 : category.name,
            },
        },
    });
}));
exports.deleteCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    yield Category_1.default.findByIdAndDelete(categoryId);
    res.status(constants_2.DELETED).json({
        success: true,
    });
}));
