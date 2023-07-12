"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const index_1 = require("../../lib/index");
const toObjectID = _id => _id && !(_id instanceof mongodb_1.ObjectID) ? mongodb_1.ObjectID.createFromHexString(_id) : _id;
let StreamProduct = class StreamProduct {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "StreamProduct identifier" }, { term: "UI.ControlHint", string: "ReadOnly" })
], StreamProduct.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Required,
    index_1.Edm.Convert(toObjectID)
], StreamProduct.prototype, "CategoryId", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.Partner("StreamProduct"),
    index_1.Edm.EntityType(index_1.Edm.ForwardRef(() => StreamCategory))
], StreamProduct.prototype, "StreamCategory", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean
], StreamProduct.prototype, "Discontinued", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "StreamProduct title" }, { term: "UI.ControlHint", string: "ShortText" })
], StreamProduct.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "StreamProduct English name" }, { term: "UI.ControlHint", string: "ShortText" })
], StreamProduct.prototype, "QuantityPerUnit", void 0);
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Unit price of StreamProduct"
    }, {
        term: "UI.ControlHint",
        string: "Decimal"
    })
], StreamProduct.prototype, "UnitPrice", void 0);
StreamProduct = tslib_1.__decorate([
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "StreamProduct"
    })
], StreamProduct);
exports.StreamProduct = StreamProduct;
let StreamCategory = class StreamCategory {
    echo() { return ["echotest"]; }
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "StreamCategory identifier" }, { term: "UI.ControlHint", string: "ReadOnly" })
], StreamCategory.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], StreamCategory.prototype, "Description", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "CategoryPromise name" }, { term: "UI.ControlHint", string: "ShortText" })
], StreamCategory.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.Partner("StreamCategory"),
    index_1.Edm.Collection(index_1.Edm.EntityType(StreamProduct))
], StreamCategory.prototype, "StreamProducts", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.String),
    index_1.Edm.Function
], StreamCategory.prototype, "echo", null);
StreamCategory = tslib_1.__decorate([
    index_1.Edm.OpenType,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "StreamCategory"
    })
], StreamCategory);
exports.StreamCategory = StreamCategory;
//# sourceMappingURL=ModelsForStream.js.map