"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = void 0;
const fetchers_1 = require("../fetchers");
const getFields = async (ctx, i) => {
    const dsId = ctx.getNodeParameter('dsId', i);
    const fields = await fetchers_1.fetchFields.call(ctx, dsId);
    return fields.map((f) => ({ json: f }));
};
exports.getFields = getFields;
