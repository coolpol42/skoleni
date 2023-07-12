"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const odata_v4_inmemory_1 = require("odata-v4-inmemory");
const index_1 = require("../lib/index");
let categories = require("./categories").map((category) => {
    category._id = category._id.toString();
    return category;
});
let products = require("./products").map((product) => {
    product._id = product._id.toString();
    product.CategoryId = product.CategoryId.toString();
    return product;
});
class ProductsController extends index_1.ODataController {
    find(filter) {
        if (filter)
            return products.filter(odata_v4_inmemory_1.createFilter(filter));
        return products;
    }
    findOne(key) {
        return products.filter(product => product._id == key)[0];
    }
    insert(product) {
        product._id = new mongodb_1.ObjectID().toString();
        products.push(product);
        return product;
    }
    update(key, delta) {
        let product = products.filter(product => product._id == key)[0];
        for (let prop in delta) {
            product[prop] = delta[prop];
        }
    }
    remove(key) {
        products.splice(products.indexOf(products.filter(product => product._id == key)[0]), 1);
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], ProductsController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], ProductsController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.POST,
    tslib_1.__param(0, index_1.odata.body)
], ProductsController.prototype, "insert", null);
tslib_1.__decorate([
    index_1.odata.PATCH,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], ProductsController.prototype, "update", null);
tslib_1.__decorate([
    index_1.odata.DELETE,
    tslib_1.__param(0, index_1.odata.key)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController;
class CategoriesController extends index_1.ODataController {
    find(filter) {
        if (filter)
            return categories.filter(odata_v4_inmemory_1.createFilter(filter));
        return categories;
    }
    findOne(key) {
        return categories.filter(category => category._id == key)[0];
    }
    insert(category) {
        category._id = new mongodb_1.ObjectID().toString();
        categories.push(category);
        return category;
    }
    update(key, delta) {
        let category = categories.filter(category => category._id == key)[0];
        for (let prop in delta) {
            category[prop] = delta[prop];
        }
    }
    remove(key) {
        categories.splice(categories.indexOf(categories.filter(category => category._id == key)[0]), 1);
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], CategoriesController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], CategoriesController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.POST,
    tslib_1.__param(0, index_1.odata.body)
], CategoriesController.prototype, "insert", null);
tslib_1.__decorate([
    index_1.odata.PATCH,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], CategoriesController.prototype, "update", null);
tslib_1.__decorate([
    index_1.odata.DELETE,
    tslib_1.__param(0, index_1.odata.key)
], CategoriesController.prototype, "remove", null);
exports.CategoriesController = CategoriesController;
let NorthwindODataServer = class NorthwindODataServer extends index_1.ODataServer {
};
NorthwindODataServer = tslib_1.__decorate([
    index_1.odata.cors,
    index_1.odata.controller(ProductsController, true),
    index_1.odata.controller(CategoriesController, true)
], NorthwindODataServer);
exports.NorthwindODataServer = NorthwindODataServer;
NorthwindODataServer.create("/odata", 3000);
//# sourceMappingURL=simple.js.map