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
const constants_1 = require("../../constants");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const User_1 = __importDefault(require("../../models/User"));
const APIFeatures_1 = require("../../utils/APIFeatures");
const getAllUsers = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = yield new APIFeatures_1.APIQueryFeatures(User_1.default.find().setOptions({
        notAuthData: true,
    }), req.query, User_1.default)
        .filterByCategory()
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = yield features.query;
    res.status(constants_1.OK).json({
        success: true,
        data: {
            users,
            totalPages: features.metaData.totalPages,
            page: features.metaData.page,
        },
    });
}));
exports.default = getAllUsers;
