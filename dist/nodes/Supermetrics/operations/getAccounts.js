"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = void 0;
const GenericFunctions_1 = require("../GenericFunctions");
const getAccounts = async (ctx, i) => {
    var _a, _b;
    const dsId = ctx.getNodeParameter('dsId', i);
    const payload = { ds_id: dsId };
    const res = await GenericFunctions_1.supermetricsGetRequest.call(ctx, '/query/accounts', payload);
    const out = [];
    for (const login of (_a = res === null || res === void 0 ? void 0 : res.data) !== null && _a !== void 0 ? _a : []) {
        for (const acc of (_b = login === null || login === void 0 ? void 0 : login.accounts) !== null && _b !== void 0 ? _b : []) {
            out.push({ json: { ...acc, ds_user: login.ds_user } });
        }
    }
    return out;
};
exports.getAccounts = getAccounts;
