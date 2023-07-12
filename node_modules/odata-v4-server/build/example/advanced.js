"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const odata_v4_mongodb_1 = require("odata-v4-mongodb");
const index_1 = require("../lib/index");
const model_1 = require("./model");
let categories = require("./categories");
let products = require("./products");
const mongodb = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield mongodb_1.MongoClient.connect("mongodb://localhost:27017/odataserver")).db();
    });
};
let ProductsController = class ProductsController extends index_1.ODataController {
    find(query, stream) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return (yield mongodb()).collection("Products").find(mongodbQuery.query, { projection: mongodbQuery.projection, skip: mongodbQuery.skip, limit: mongodbQuery.limit }).stream().pipe(stream);
        });
    }
    findOne(key, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return (yield mongodb()).collection("Products").findOne({ _id: key }, {
                fields: mongodbQuery.projection
            });
        });
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query), tslib_1.__param(1, index_1.odata.stream)
], ProductsController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.query)
], ProductsController.prototype, "findOne", null);
ProductsController = tslib_1.__decorate([
    index_1.odata.type(model_1.Product),
    index_1.Edm.EntitySet("Products")
], ProductsController);
exports.ProductsController = ProductsController;
let CategoriesController = class CategoriesController extends index_1.ODataController {
    find(query, stream) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return (yield mongodb()).collection("Categories").find(mongodbQuery.query, { projection: mongodbQuery.projection, skip: mongodbQuery.skip, limit: mongodbQuery.limit }).stream().pipe(stream);
        });
    }
    findOne(key, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
            return (yield mongodb()).collection("Categories").findOne({ _id: key }, {
                fields: mongodbQuery.projection
            });
        });
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query), tslib_1.__param(1, index_1.odata.stream)
], CategoriesController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key()), tslib_1.__param(1, index_1.odata.query)
], CategoriesController.prototype, "findOne", null);
CategoriesController = tslib_1.__decorate([
    index_1.odata.type(model_1.Category),
    index_1.Edm.EntitySet("Categories")
], CategoriesController);
exports.CategoriesController = CategoriesController;
let NorthwindODataServer = class NorthwindODataServer extends index_1.ODataServer {
    *GetCategoryById(id) {
        return yield categories.filter((category) => category._id.toString() == id)[0];
    }
    initDb() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let db = yield mongodb();
            yield db.dropDatabase();
            let categoryCollection = db.collection("Categories");
            let productsCollection = db.collection("Products");
            yield categoryCollection.insertMany(categories);
            yield productsCollection.insertMany(products);
        });
    }
    static errorHandler(err, req, res, next) {
        delete err.stack;
        index_1.ODataErrorHandler(err, req, res, next);
    }
};
tslib_1.__decorate([
    index_1.Edm.EntityType(model_1.Category),
    index_1.Edm.FunctionImport,
    tslib_1.__param(0, index_1.Edm.String)
], NorthwindODataServer.prototype, "GetCategoryById", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport
], NorthwindODataServer.prototype, "initDb", null);
NorthwindODataServer = tslib_1.__decorate([
    index_1.odata.namespace("Northwind"),
    index_1.Edm.Container(model_1.NorthwindTypes),
    index_1.odata.container("NorthwindContext"),
    index_1.odata.controller(ProductsController),
    index_1.odata.controller(CategoriesController),
    index_1.odata.cors
], NorthwindODataServer);
exports.NorthwindODataServer = NorthwindODataServer;
index_1.createODataServer(NorthwindODataServer, "/odata", 3000);
process.on("warning", warning => {
    console.log(warning.stack);
});
Error.stackTraceLimit = -1;
//# sourceMappingURL=advanced.js.map