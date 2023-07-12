"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const index_1 = require("../../lib/index");
const toObjectID = _id => _id && !(_id instanceof mongodb_1.ObjectID) ? mongodb_1.ObjectID.createFromHexString(_id) : _id;
let GeneratorProduct = class GeneratorProduct {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "ProductPromise identifier" }, { term: "UI.ControlHint", string: "ReadOnly" })
], GeneratorProduct.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Required,
    index_1.Edm.Convert(toObjectID)
], GeneratorProduct.prototype, "CategoryId", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.EntityType(index_1.Edm.ForwardRef(() => GeneratorCategory)),
    index_1.Edm.Partner("GeneratorProduct")
], GeneratorProduct.prototype, "GeneratorCategory", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean
], GeneratorProduct.prototype, "Discontinued", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "GeneratorProduct title" }, { term: "UI.ControlHint", string: "ShortText" })
], GeneratorProduct.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "GeneratorProduct English name" }, { term: "UI.ControlHint", string: "ShortText" })
], GeneratorProduct.prototype, "QuantityPerUnit", void 0);
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "Unit price of GeneratorProduct" }, { term: "UI.ControlHint", string: "Decimal" })
], GeneratorProduct.prototype, "UnitPrice", void 0);
GeneratorProduct = tslib_1.__decorate([
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "GeneratorProduct" })
], GeneratorProduct);
exports.GeneratorProduct = GeneratorProduct;
let GeneratorCategory = class GeneratorCategory {
    echo() {
        return ["echotest"];
    }
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "GeneratorCategory identifier" }, { term: "UI.ControlHint", string: "ReadOnly" })
], GeneratorCategory.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], GeneratorCategory.prototype, "Description", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "GeneratorCategory name" }, { term: "UI.ControlHint", string: "ShortText" })
], GeneratorCategory.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.Collection(index_1.Edm.EntityType(GeneratorProduct)),
    index_1.Edm.Partner("GeneratorCategory")
], GeneratorCategory.prototype, "GeneratorProducts", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.String),
    index_1.Edm.Function
], GeneratorCategory.prototype, "echo", null);
GeneratorCategory = tslib_1.__decorate([
    index_1.Edm.OpenType,
    index_1.Edm.Annotate({ term: "UI.DisplayName", string: "GeneratorCategory" })
], GeneratorCategory);
exports.GeneratorCategory = GeneratorCategory;
//# sourceMappingURL=ModelsForGenerator.js.map