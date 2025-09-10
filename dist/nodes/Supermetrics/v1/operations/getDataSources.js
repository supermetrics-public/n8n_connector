"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSources = void 0;
const fetchers_1 = require("../fetchers");
const getDataSources = async (ctx) => {
    const list = await fetchers_1.fetchDataSources.call(ctx);
    return list.map((row) => ({ json: row }));
};
exports.getDataSources = getDataSources;
