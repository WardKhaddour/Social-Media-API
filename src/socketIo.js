"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioActions = exports.ioEvents = void 0;
const ioEvents = {
    POST: 'post',
    LIKE: 'like',
    COMMENT: 'comment',
    FOLLOW: 'follow',
    SAVE_POST: 'savePost',
};
exports.ioEvents = ioEvents;
const ioActions = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
};
exports.ioActions = ioActions;
