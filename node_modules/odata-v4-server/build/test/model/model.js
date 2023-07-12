"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const index_1 = require("../../lib/index");
const toObjectID = _id => _id && !(_id instanceof mongodb_1.ObjectID) ? mongodb_1.ObjectID.createFromHexString(_id) : _id;
let Product = class Product {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Product.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Required,
    index_1.Edm.Convert(toObjectID)
], Product.prototype, "CategoryId", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.EntityType(index_1.Edm.ForwardRef(() => Category)),
    index_1.Edm.Partner("Products")
], Product.prototype, "Category", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean
], Product.prototype, "Discontinued", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product title"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Product.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product English name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Product.prototype, "QuantityPerUnit", void 0);
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Unit price of product"
    }, {
        term: "UI.ControlHint",
        string: "Decimal"
    })
], Product.prototype, "UnitPrice", void 0);
Product = tslib_1.__decorate([
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Products"
    })
], Product);
exports.Product = Product;
let Category = class Category {
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
        string: "Category identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Category.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Category.prototype, "Description", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Category name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Category.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.Collection(index_1.Edm.EntityType(Product)),
    index_1.Edm.Partner("Category")
], Category.prototype, "Products", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.String),
    index_1.Edm.Function
], Category.prototype, "echo", null);
Category = tslib_1.__decorate([
    index_1.Edm.OpenType,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Categories"
    })
], Category);
exports.Category = Category;
//# sourceMappingURL=model.js.map