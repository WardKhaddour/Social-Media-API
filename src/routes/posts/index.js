"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postController_1 = require("./../../controllers/postController");
const express_1 = require("express");
const restrictAuthenticated_1 = __importDefault(require("../../middleware/restrictAuthenticated"));
const like_1 = __importDefault(require("../like"));
const comment_1 = __importDefault(require("../comment"));
const aliasPostsByCategory_1 = __importDefault(require("../../controllers/postController/aliasPostsByCategory"));
const checkAuthenticated_1 = __importDefault(require("../../middleware/checkAuthenticated"));
const attachPostFiles_1 = __importDefault(require("../../middleware/attachPostFiles"));
const formatAttachments_1 = __importDefault(require("../../middleware/formatAttachments"));
const router = (0, express_1.Router)();
router.get('/most-popular', postController_1.aliasMostPopular, (0, checkAuthenticated_1.default)(), postController_1.getAllPosts);
router.get('/category/:category', aliasPostsByCategory_1.default, (0, checkAuthenticated_1.default)(), postController_1.getAllPosts);
router.get('/following', (0, restrictAuthenticated_1.default)(), postController_1.aliasPostsByFollowing, postController_1.getAllPosts);
router.use('/:postId/like', like_1.default);
router.use('/:postId/comment', comment_1.default);
router
    .route('/')
    .get((0, checkAuthenticated_1.default)(), postController_1.getAllPosts)
    .post((0, restrictAuthenticated_1.default)(), attachPostFiles_1.default, formatAttachments_1.default, postController_1.addNewPost);
router.get('/saved', (0, restrictAuthenticated_1.default)(), postController_1.getSavedPosts);
router.post('/saved/:postId', (0, restrictAuthenticated_1.default)(), postController_1.toggleSavePost);
router
    .route('/:postId')
    .get((0, checkAuthenticated_1.default)(), postController_1.getPost)
    .patch((0, restrictAuthenticated_1.default)(), attachPostFiles_1.default, formatAttachments_1.default, postController_1.updatePost)
    .delete((0, restrictAuthenticated_1.default)(), postController_1.deletePost);
//  `post/${postId}/attachment/${attachmentName}`;
router.delete('/:postId/attachment/:attachmentName', (0, restrictAuthenticated_1.default)(), postController_1.deletePostAttachment);
exports.default = router;
