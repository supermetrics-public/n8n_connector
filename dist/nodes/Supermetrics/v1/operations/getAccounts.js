"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccounts = void 0;
const fetchers_1 = require("../fetchers");
const getAccounts = async (ctx, i) => {
    var _a;
    const dsId = ctx.getNodeParameter('dsId', i);
    const data = await fetchers_1.fetchAccounts.call(ctx, dsId);
    const out = [];
    for (const login of data) {
        for (const acc of (_a = login === null || login === void 0 ? void 0 : login.accounts) !== null && _a !== void 0 ? _a : []) {
            out.push({
                json: {
                    ds_user: login.ds_user,
                    display_name: login.display_name,
                    cache_time: login.cache_time,
                    account_id: acc.account_id,
                    account_name: acc.account_name,
                    group_name: acc.group_name,
                },
            });
        }
    }
    return out;
};
exports.getAccounts = getAccounts;
