"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSegments = void 0;
const genericFunctions_1 = require("../genericFunctions");
const getSegments = async (ctx, i) => {
    var _a, _b;
    const dsId = ctx.getNodeParameter('dsId', i);
    const payload = { ds_id: dsId };
    const res = await genericFunctions_1.supermetricsGetRequest.call(ctx, '/query/segments', payload);
    const out = [];
    for (const login of (_a = res === null || res === void 0 ? void 0 : res.data) !== null && _a !== void 0 ? _a : []) {
        for (const s of (_b = login === null || login === void 0 ? void 0 : login.segments) !== null && _b !== void 0 ? _b : []) {
            out.push({ json: { ...s, ds_user: login.ds_user } });
        }
    }
    return out;
};
exports.getSegments = getSegments;
