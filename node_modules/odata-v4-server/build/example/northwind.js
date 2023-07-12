"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const odata_v4_mongodb_1 = require("odata-v4-mongodb");
const index_1 = require("../lib/index");
let schemaJson = require("./schema");
let categories = require("./categories");
let products = require("./products");
const mongodb = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield mongodb_1.MongoClient.connect("mongodb://localhost:27017/odataserver")).db();
    });
};
class ProductsController extends index_1.ODataController {
    *find(query) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        if (typeof mongodbQuery.query._id == "string")
            mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string")
            mongodbQuery.query.CategoryId = new mongodb_1.ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products").find(mongodbQuery.query, {
            projection: mongodbQuery.projection,
            skip: mongodbQuery.skip,
            limit: mongodbQuery.limit
        }).toArray();
    }
    *findOne(key, query) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        return db.collection("Products").findOne({ _id: new mongodb_1.ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }
    insert(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let db = yield mongodb();
            if (data.CategoryId)
                data.CategoryId = new mongodb_1.ObjectID(data.CategoryId);
            return yield db.collection("Products").insert(data).then((result) => {
                data._id = result.insertedId;
                return data;
            });
        });
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query)
], ProductsController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.query)
], ProductsController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.POST,
    tslib_1.__param(0, index_1.odata.body)
], ProductsController.prototype, "insert", null);
class CategoriesController extends index_1.ODataController {
    *find(query) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        if (typeof mongodbQuery.query._id == "string")
            mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
        return db.collection("Categories").find(mongodbQuery.query, {
            projection: mongodbQuery.projection,
            skip: mongodbQuery.skip,
            limit: mongodbQuery.limit
        }).toArray();
    }
    *findOne(key, query) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        return db.collection("Categories").findOne({ _id: new mongodb_1.ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query)
], CategoriesController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.query)
], CategoriesController.prototype, "findOne", null);
let NorthwindServer = class NorthwindServer extends index_1.ODataServer {
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
};
NorthwindServer = tslib_1.__decorate([
    index_1.odata.controller(ProductsController, true),
    index_1.odata.controller(CategoriesController, true)
], NorthwindServer);
NorthwindServer.$metadata(schemaJson);
NorthwindServer.create("/odata", 3000);
//# sourceMappingURL=northwind.js.map