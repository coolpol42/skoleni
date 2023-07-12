"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const index_1 = require("../../lib/index");
const toObjectID = _id => _id && !(_id instanceof mongodb_1.ObjectID) ? mongodb_1.ObjectID.createFromHexString(_id) : _id;
let ProductPromise = class ProductPromise {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "ProductPromise identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], ProductPromise.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Required,
    index_1.Edm.Convert(toObjectID)
], ProductPromise.prototype, "CategoryId", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.EntityType(index_1.Edm.ForwardRef(() => CategoryPromise)),
    index_1.Edm.Partner("ProductPromise")
], ProductPromise.prototype, "CategoryPromise", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean
], ProductPromise.prototype, "Discontinued", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "ProductPromise title"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], ProductPromise.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "ProductPromise English name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], ProductPromise.prototype, "QuantityPerUnit", void 0);
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Unit price of ProductPromise"
    }, {
        term: "UI.ControlHint",
        string: "Decimal"
    })
], ProductPromise.prototype, "UnitPrice", void 0);
ProductPromise = tslib_1.__decorate([
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "ProductPromise"
    })
], ProductPromise);
exports.ProductPromise = ProductPromise;
let CategoryPromise = class CategoryPromise {
    echo() {
        return ["echotest"];
    }
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "CategoryPromise identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], CategoryPromise.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], CategoryPromise.prototype, "Description", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "CategoryPromise name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], CategoryPromise.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.Collection(index_1.Edm.EntityType(ProductPromise)),
    index_1.Edm.Partner("CategoryPromise")
], CategoryPromise.prototype, "ProductPromises", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.String),
    index_1.Edm.Function
], CategoryPromise.prototype, "echo", null);
CategoryPromise = tslib_1.__decorate([
    index_1.Edm.OpenType,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "CategoryPromise"
    })
], CategoryPromise);
exports.CategoryPromise = CategoryPromise;
//# sourceMappingURL=ModelsForPromise.js.map