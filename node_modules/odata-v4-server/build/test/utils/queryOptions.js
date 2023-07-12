"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.processQueries = (_query) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const query = yield exports.clone(_query);
    return new Promise((resolve) => {
        const options = { skipNumber: 0, topNumber: 0, orderby: { fields: [], order: "" } };
        if (query && query.value && query.value.options) {
            for (let token of query.value.options) {
                if (token.type === "Skip")
                    options.skipNumber = token.value.raw;
                if (token.type === "Top")
                    options.topNumber = token.value.raw;
                if (token.type === "OrderBy") {
                    const raw = decodeURIComponent(token.raw).replace(/'/g, '').replace(/\"/g, "");
                    options.orderby.fields = raw.split("=")[1].split(" ")[0].split(",");
                    options.orderby.order = raw.split("=")[1].split(" ")[1] || "asc";
                }
            }
            return resolve(options);
        }
        return resolve(options);
    });
});
exports.doOrderby = (_response, _options) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const response = yield exports.clone(_response);
    const options = yield exports.clone(_options);
    return new Promise((resolve) => {
        if (options.orderby && !!options.orderby.fields && !!options.orderby.order) {
            const sorted = response.sort((a, b) => {
                if (a[`${options.orderby.fields[0]}`] > b[`${options.orderby.fields[0]}`]) {
                    return options.orderby.order === "asc" ? 1 : -1;
                }
                if (a[`${options.orderby.fields[0]}`] < b[`${options.orderby.fields[0]}`]) {
                    return options.orderby.order === "asc" ? -1 : 1;
                }
                return 0;
            });
            return resolve(sorted);
        }
        return resolve(response);
    });
});
exports.doSkip = (_response, _options) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const response = yield exports.clone(_response);
    const options = yield exports.clone(_options);
    return new Promise((resolve) => {
        if (options.skipNumber > 0)
            return resolve(response.filter((c, idx) => idx >= options.skipNumber));
        return resolve(response);
    });
});
exports.doTop = (_response, _options) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const response = yield exports.clone(_response);
    const options = yield exports.clone(_options);
    return new Promise((resolve) => {
        if (options.topNumber > 0)
            return resolve(response.filter((c, idx) => idx < options.topNumber));
        return resolve(response);
    });
});
exports.clone = (object) => {
    return JSON.parse(JSON.stringify(object));
};
//# sourceMappingURL=queryOptions.js.map