"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = void 0;
const GenericFunctions_1 = require("../GenericFunctions");
const getFields = async (ctx, i) => {
    var _a;
    const dsId = ctx.getNodeParameter('dsId', i);
    const payload = { ds_id: dsId };
    const res = await GenericFunctions_1.supermetricsGetRequest.call(ctx, '/query/fields', payload);
    return ((_a = res === null || res === void 0 ? void 0 : res.data) !== null && _a !== void 0 ? _a : []).map((f) => ({ json: f }));
};
exports.getFields = getFields;
