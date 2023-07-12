"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const odata_v4_inmemory_1 = require("odata-v4-inmemory");
const index_1 = require("../lib/index");
const model_1 = require("./model/model");
const ModelsForPromise_1 = require("./model/ModelsForPromise");
const ModelsForGenerator_1 = require("./model/ModelsForGenerator");
const stream_1 = require("stream");
const mongodb_1 = require("mongodb");
const queryOptions_1 = require("./utils/queryOptions");
const fs = require("fs");
const path = require("path");
const streamBuffers = require("stream-buffers");
const extend = require("extend");
let categories = require("./model/categories").slice();
let products = require("./model/products").slice();
let categories2 = require("./model/categories").slice();
let products2 = require("./model/products").slice();
const serverCache = [];
if (typeof after == "function") {
    after(function () {
        serverCache.forEach(server => server.close());
    });
}
class Foobar {
    Foo() { }
    Bar() {
        return "foobar";
    }
    echo(message) {
        return message;
    }
    echoMany(message) {
        return [message];
    }
}
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.Int32
], Foobar.prototype, "id", void 0);
tslib_1.__decorate([
    index_1.Edm.Int16
], Foobar.prototype, "a", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Foobar.prototype, "foo", void 0);
tslib_1.__decorate([
    index_1.Edm.Action
], Foobar.prototype, "Foo", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.String)
], Foobar.prototype, "Bar", null);
tslib_1.__decorate([
    index_1.odata.namespace("Echo"),
    index_1.Edm.Function(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String)
], Foobar.prototype, "echo", null);
tslib_1.__decorate([
    index_1.odata.namespace("Echo"),
    index_1.Edm.Function(index_1.Edm.Collection(index_1.Edm.String)),
    tslib_1.__param(0, index_1.Edm.String)
], Foobar.prototype, "echoMany", null);
exports.Foobar = Foobar;
class Image {
}
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.Int32
], Image.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Image.prototype, "Filename", void 0);
tslib_1.__decorate([
    index_1.Edm.Stream("image/png")
], Image.prototype, "Data", void 0);
tslib_1.__decorate([
    index_1.Edm.Stream("image/png")
], Image.prototype, "Data2", void 0);
exports.Image = Image;
let Music = class Music extends stream_1.PassThrough {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.Int32
], Music.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Music.prototype, "Artist", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Music.prototype, "Title", void 0);
Music = tslib_1.__decorate([
    index_1.Edm.MediaEntity("audio/mp3")
], Music);
exports.Music = Music;
let foobarObj = { id: 1, foo: 'bar' };
let foobarObj2 = { id: 2, foo: 'bar', a: 'a' };
let SyncTestController = class SyncTestController extends index_1.ODataController {
    entitySet( /*@odata.query query:Token, @odata.context context:any, @odata.result result:any, @odata.stream stream:ODataProcessor*/) {
        return [{ id: 1, a: 1 }];
    }
    entity(key) {
        if (key === 1)
            return index_1.ODataResult.Ok(foobarObj);
        if (key === 2)
            return index_1.ODataResult.Ok(foobarObj2);
        if (key === 999)
            return index_1.ODataResult.Ok({ id: key, foo: "999" });
        return index_1.ODataResult.Ok({ id: key, foo: "bar" });
    }
    insert(body) {
        if (!body.id)
            body.id = 1;
        return body;
    }
    put(body) {
        body.id = 1;
    }
    patch(key, delta) {
        if (key === 2)
            return Object.assign(foobarObj2, delta);
        return Object.assign({
            id: key,
            foo: "bar",
            a: 'a'
        }, delta);
    }
    putProperty(body, _) {
        foobarObj.foo = body.foo;
    }
    patchProperty(body, _) {
        foobarObj.foo = body.foo;
    }
    deleteProperty(_) {
        if (foobarObj.foo)
            foobarObj.foo = null;
    }
    remove() { }
    getFoo() {
        return foobarObj;
    }
};
tslib_1.__decorate([
    index_1.odata.GET
], SyncTestController.prototype, "entitySet", null);
tslib_1.__decorate([
    index_1.odata.GET(),
    tslib_1.__param(0, index_1.odata.key())
], SyncTestController.prototype, "entity", null);
tslib_1.__decorate([
    index_1.odata.method("POST"),
    tslib_1.__param(0, index_1.odata.body)
], SyncTestController.prototype, "insert", null);
tslib_1.__decorate([
    tslib_1.__param(0, index_1.odata.body)
], SyncTestController.prototype, "put", null);
tslib_1.__decorate([
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], SyncTestController.prototype, "patch", null);
tslib_1.__decorate([
    index_1.odata.PUT('foo'),
    tslib_1.__param(0, index_1.odata.body), tslib_1.__param(1, index_1.odata.result)
], SyncTestController.prototype, "putProperty", null);
tslib_1.__decorate([
    index_1.odata.PATCH('foo'),
    tslib_1.__param(0, index_1.odata.body), tslib_1.__param(1, index_1.odata.result)
], SyncTestController.prototype, "patchProperty", null);
tslib_1.__decorate([
    index_1.odata.DELETE('foo'),
    tslib_1.__param(0, index_1.odata.result)
], SyncTestController.prototype, "deleteProperty", null);
tslib_1.__decorate([
    index_1.odata.method(index_1.ODataMethodType.DELETE)
], SyncTestController.prototype, "remove", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.EntityType(Foobar))
], SyncTestController.prototype, "getFoo", null);
SyncTestController = tslib_1.__decorate([
    index_1.odata.type(Foobar)
], SyncTestController);
exports.SyncTestController = SyncTestController;
let GeneratorTestController = class GeneratorTestController extends index_1.ODataController {
    *entitySet() {
        return [{ id: 1, a: 1 }];
    }
};
tslib_1.__decorate([
    index_1.odata.GET
], GeneratorTestController.prototype, "entitySet", null);
GeneratorTestController = tslib_1.__decorate([
    index_1.odata.type(Foobar)
], GeneratorTestController);
exports.GeneratorTestController = GeneratorTestController;
let AsyncTestController = class AsyncTestController extends index_1.ODataController {
    entitySet() {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    resolve([{ id: 1, a: 1 }]);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    entity(key) {
        return index_1.ODataResult.Ok(new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const a = 1;
                    let result = { id: key };
                    result.inlinecount = a;
                    resolve(result);
                });
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    insert(body) {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    body.id = 1;
                    resolve(body);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
};
tslib_1.__decorate([
    index_1.odata.GET
], AsyncTestController.prototype, "entitySet", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], AsyncTestController.prototype, "entity", null);
tslib_1.__decorate([
    index_1.odata.POST,
    tslib_1.__param(0, index_1.odata.body)
], AsyncTestController.prototype, "insert", null);
AsyncTestController = tslib_1.__decorate([
    index_1.odata.type(Foobar)
], AsyncTestController);
exports.AsyncTestController = AsyncTestController;
let InlineCountController = class InlineCountController extends index_1.ODataController {
    entitySet() {
        let result = [{ id: 1, a: 1 }];
        result.inlinecount = 1;
        return result;
    }
};
tslib_1.__decorate([
    index_1.odata.GET
], InlineCountController.prototype, "entitySet", null);
InlineCountController = tslib_1.__decorate([
    index_1.odata.type(Foobar)
], InlineCountController);
exports.InlineCountController = InlineCountController;
let BoundOperationController = class BoundOperationController extends index_1.ODataController {
    Action() {
        return new Promise((resolve) => {
            setTimeout(resolve);
        });
    }
    Function(value) {
        return `foobar:${value}`;
    }
    FunctionMore(message, value) {
        return `The number is ${value} and your message was ${message}.`;
    }
    entitySet() {
        return [{ id: 1, a: 1 }];
    }
    entity(key) {
        return { id: key, a: 1 };
    }
};
tslib_1.__decorate([
    index_1.Edm.Action
], BoundOperationController.prototype, "Action", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.Int16)
], BoundOperationController.prototype, "Function", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String), tslib_1.__param(1, index_1.Edm.Int64)
], BoundOperationController.prototype, "FunctionMore", null);
tslib_1.__decorate([
    index_1.odata.GET
], BoundOperationController.prototype, "entitySet", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], BoundOperationController.prototype, "entity", null);
BoundOperationController = tslib_1.__decorate([
    index_1.odata.type(Foobar)
], BoundOperationController);
exports.BoundOperationController = BoundOperationController;
let ImagesController = class ImagesController extends index_1.ODataController {
    entitySet(_, __, ___, ____) {
        let image = new Image();
        image.Id = 1;
        image.Filename = "tmp.png";
        return [image];
    }
    entity(key) {
        let image = new Image();
        image.Id = key;
        image.Filename = "tmp.png";
        return image;
    }
    getData(_, context) {
        let globalReadableImgStrBuffer = new streamBuffers.ReadableStreamBuffer();
        globalReadableImgStrBuffer.put("tmp.png");
        globalReadableImgStrBuffer.stop();
        return globalReadableImgStrBuffer;
    }
    postData(_, data) {
        let globalWritableImgStrBuffer = new streamBuffers.WritableStreamBuffer();
        return data.pipe(globalWritableImgStrBuffer);
    }
    getData2(_, stream, context) {
        return new index_1.ODataStream(fs.createReadStream(path.join(__dirname, "..", "..", "src", "test", "fixtures", "logo_jaystack.png"))).pipe(context.response);
    }
    postData2(_, data) {
        return new index_1.ODataStream(fs.createWriteStream(path.join(__dirname, "..", "..", "src", "test", "fixtures", "tmp.png"))).write(data);
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query), tslib_1.__param(1, index_1.odata.context), tslib_1.__param(2, index_1.odata.result), tslib_1.__param(3, index_1.odata.stream)
], ImagesController.prototype, "entitySet", null);
tslib_1.__decorate([
    index_1.odata.GET(),
    tslib_1.__param(0, index_1.odata.key())
], ImagesController.prototype, "entity", null);
tslib_1.__decorate([
    index_1.odata.GET("Data"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.context)
], ImagesController.prototype, "getData", null);
tslib_1.__decorate([
    index_1.odata.POST("Data"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], ImagesController.prototype, "postData", null);
tslib_1.__decorate([
    index_1.odata.GET("Data2"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.stream), tslib_1.__param(2, index_1.odata.context)
], ImagesController.prototype, "getData2", null);
tslib_1.__decorate([
    index_1.odata.POST("Data2"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], ImagesController.prototype, "postData2", null);
ImagesController = tslib_1.__decorate([
    index_1.odata.type(Image)
], ImagesController);
exports.ImagesController = ImagesController;
let globalWritableMediaStrBuffer = new streamBuffers.WritableStreamBuffer();
let globalReadableMediaStrBuffer = new streamBuffers.ReadableStreamBuffer();
let MusicController = class MusicController extends index_1.ODataController {
    findAll(_) {
        let music = new Music();
        music.Id = 1;
        music.Artist = "Dream Theater";
        music.Title = "Six degrees of inner turbulence";
        return [music];
    }
    findOne(_, __) {
        let music = new Music();
        music.Id = 1;
        music.Artist = "Dream Theater";
        music.Title = "Six degrees of inner turbulence";
        return music;
    }
    mp3(_, context) {
        globalReadableMediaStrBuffer.put(globalWritableMediaStrBuffer.getContents());
        return globalReadableMediaStrBuffer.pipe(context.response);
    }
    post(_, upload) {
        return upload.pipe(globalWritableMediaStrBuffer);
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context)
], MusicController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key()), tslib_1.__param(1, index_1.odata.context)
], MusicController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET.$value,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.context)
], MusicController.prototype, "mp3", null);
tslib_1.__decorate([
    index_1.odata.POST.$value,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], MusicController.prototype, "post", null);
MusicController = tslib_1.__decorate([
    index_1.odata.type(Music)
], MusicController);
exports.MusicController = MusicController;
let ProductsController = class ProductsController extends index_1.ODataController {
    find(query) {
        const filter = query && query.value && query.value.options && query.value.options.find(t => t.type == "Filter");
        if (filter) {
            return products
                .map((product) => Object.assign({}, product, { _id: product._id.toString(), CategoryId: product.CategoryId && product.CategoryId.toString() }))
                .filter(odata_v4_inmemory_1.createFilter(filter));
        }
        products.inlinecount = products.length;
        return index_1.ODataResult.Ok(new Promise((resolve, reject) => {
            try {
                resolve(products);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    findOne(key) {
        return products.filter(product => product._id.toString() == key)[0] || null;
    }
    getName(key, result) {
        return result.Name;
    }
    setCategory(key, link) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return products.filter(product => {
                if (product._id.toString() === key) {
                    product.CategoryId = new mongodb_1.ObjectID(link);
                    return product;
                }
                return null;
            });
        });
    }
    unsetCategoryId(key, link) {
        return new Promise((resolve, reject) => {
            products.filter(product => {
                if (product._id.toString() === key) {
                    product.CategoryId = null;
                    return product;
                }
            });
            resolve(products);
        });
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query)
], ProductsController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameter("key", index_1.odata.key)
], ProductsController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET('Name'),
    index_1.odata.parameter("key", index_1.odata.key),
    index_1.odata.parameter("result", index_1.odata.result)
], ProductsController.prototype, "getName", null);
tslib_1.__decorate([
    index_1.odata.createRef("Category"),
    index_1.odata.updateRef("Category"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.link('categoryId'))
], ProductsController.prototype, "setCategory", null);
tslib_1.__decorate([
    index_1.odata.deleteRef("Category"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.link)
], ProductsController.prototype, "unsetCategoryId", null);
ProductsController = tslib_1.__decorate([
    index_1.odata.type(model_1.Product)
], ProductsController);
exports.ProductsController = ProductsController;
ProductsController.enableFilter(ProductsController.prototype.find, 'filter');
let CategoriesController = class CategoriesController extends index_1.ODataController {
    find(filter) {
        if (filter)
            return categories.map((category) => Object.assign({}, category, { _id: category._id.toString() })).filter(odata_v4_inmemory_1.createFilter(filter));
        return categories;
    }
    findOne(key) {
        return categories.filter(category => category._id.toString() == key)[0] || null;
    }
    insertProduct(key, link, body) {
        body._id = new mongodb_1.ObjectID('578e1a7c12eaebabec4af23c');
        return index_1.ODataResult.Created(new Promise((resolve, reject) => {
            try {
                resolve(body);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    findProduct(key, link) {
        return products.filter(product => product._id.toString() === link);
    }
    *setCategory(key, link) {
        yield products.filter(product => {
            if (product._id.toString() === link) {
                product.CategoryId = new mongodb_1.ObjectID(key);
                return product;
            }
        });
    }
    unsetCategory(key, link) {
        return new Promise(resolve => {
            products.filter(product => {
                if (product._id.toString() === link) {
                    product.CategoryId = null;
                    return product;
                }
            });
            resolve(products);
        });
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], CategoriesController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({
        key: index_1.odata.key
    })
], CategoriesController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.POST("Products"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.link), tslib_1.__param(2, index_1.odata.body)
], CategoriesController.prototype, "insertProduct", null);
tslib_1.__decorate([
    index_1.odata.GET("Products").$ref,
    index_1.odata.parameter("key", index_1.odata.key),
    index_1.odata.parameter("link", index_1.odata.link)
], CategoriesController.prototype, "findProduct", null);
tslib_1.__decorate([
    index_1.odata.POST("Products").$ref,
    index_1.odata.method("PUT", "Products").$ref,
    index_1.odata.PATCH("Products").$ref,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.link)
], CategoriesController.prototype, "setCategory", null);
tslib_1.__decorate([
    index_1.odata.DELETE("Products").$ref,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.link)
], CategoriesController.prototype, "unsetCategory", null);
CategoriesController = tslib_1.__decorate([
    index_1.odata.type(model_1.Category)
], CategoriesController);
exports.CategoriesController = CategoriesController;
CategoriesController.enableFilter('find');
class CategoryStream extends model_1.Category {
}
exports.CategoryStream = CategoryStream;
let CategoriesStreamingController = class CategoriesStreamingController extends index_1.ODataController {
    find(filter, stream) {
        let response = [];
        response = categories;
        if (filter)
            response = categories.map((category) => Object.assign({}, category, { _id: category._id.toString() })).filter(odata_v4_inmemory_1.createFilter(filter));
        response.forEach(c => {
            stream.write(c);
        });
        stream.end();
    }
    findOne(key) {
        return categories.find(category => category._id.toString() == key) || null;
    }
    getProducts(result, stream, context) {
        const filteredProducts = products.filter(p => p.CategoryId && p.CategoryId.toString() === result._id.toString());
        filteredProducts.forEach(p => { stream.write(p); });
        stream.end();
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.stream)
], CategoriesStreamingController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({
        key: index_1.odata.key
    })
], CategoriesStreamingController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("Products"),
    tslib_1.__param(0, index_1.odata.result), tslib_1.__param(1, index_1.odata.stream), tslib_1.__param(2, index_1.odata.context)
], CategoriesStreamingController.prototype, "getProducts", null);
CategoriesStreamingController = tslib_1.__decorate([
    index_1.odata.type(CategoryStream),
    index_1.Edm.EntitySet("Categories")
], CategoriesStreamingController);
exports.CategoriesStreamingController = CategoriesStreamingController;
/**
 *  GENERATOR CONTROLLERS
 */
const toObjectID = _id => _id && !(_id instanceof mongodb_1.ObjectID) ? mongodb_1.ObjectID.createFromHexString(_id) : _id;
const delay = function (ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
};
let Product2 = class Product2 {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Convert(toObjectID),
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product2 identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Product2.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Required,
    index_1.Edm.Convert(toObjectID)
], Product2.prototype, "CategoryId", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.EntityType(index_1.Edm.ForwardRef(() => Category2)),
    index_1.Edm.Partner("Products2")
], Product2.prototype, "Category2", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean
], Product2.prototype, "Discontinued", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product2 title"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Product2.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product2 English name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Product2.prototype, "QuantityPerUnit", void 0);
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Unit price of product2"
    }, {
        term: "UI.ControlHint",
        string: "Decimal"
    })
], Product2.prototype, "UnitPrice", void 0);
Product2 = tslib_1.__decorate([
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Products2"
    })
], Product2);
exports.Product2 = Product2;
let Category2 = class Category2 {
    echo() {
        return ["echotest"];
    }
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.String,
    index_1.Edm.Deserialize(toObjectID),
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Category2 identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Category2.prototype, "_id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Category2.prototype, "Description", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Category2 name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
], Category2.prototype, "Name", void 0);
tslib_1.__decorate([
    index_1.Edm.ForeignKey("CategoryId"),
    index_1.Edm.Collection(index_1.Edm.EntityType(Product2)),
    index_1.Edm.Partner("Category2")
], Category2.prototype, "Products2", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.String),
    index_1.Edm.Function
], Category2.prototype, "echo", null);
Category2 = tslib_1.__decorate([
    index_1.Edm.OpenType,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Categories2"
    })
], Category2);
exports.Category2 = Category2;
let CategoriesGeneratorController = class CategoriesGeneratorController extends index_1.ODataController {
    *find(filter, stream) {
        let response = categories2;
        if (filter)
            response = yield categories2.map((category) => Object.assign({}, category, { _id: category._id.toString() })).filter(odata_v4_inmemory_1.createFilter(filter));
        stream.write({ "@odata.count": response.length });
        for (let category of response) {
            stream.write(category);
            yield delay(1);
        }
        ;
        stream.end();
    }
    *findOne(key) {
        return yield categories2.find(category => category._id.toString() === key) || null;
    }
    *findProduct(key, result) {
        return yield products2.filter((product) => product.CategoryId && product.CategoryId.toString() === result._id.toString() && product._id.toString() === key.toString());
    }
    *findProducts(filter, stream, result) {
        let response = products2.map((product) => Object.assign({}, product, { _id: product._id.toString() }));
        if (filter)
            response = response.filter(odata_v4_inmemory_1.createFilter(filter));
        response = response.filter((product) => product.CategoryId && product.CategoryId.toString() === result._id.toString());
        for (let c of response) {
            stream.write(c);
            yield delay(10);
        }
        stream.end();
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.stream)
], CategoriesGeneratorController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({
        key: index_1.odata.key
    })
], CategoriesGeneratorController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("Products2"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.result)
], CategoriesGeneratorController.prototype, "findProduct", null);
tslib_1.__decorate([
    index_1.odata.GET("Products2"),
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.stream), tslib_1.__param(2, index_1.odata.result)
], CategoriesGeneratorController.prototype, "findProducts", null);
CategoriesGeneratorController = tslib_1.__decorate([
    index_1.odata.type(Category2),
    index_1.Edm.EntitySet("Categories2")
], CategoriesGeneratorController);
exports.CategoriesGeneratorController = CategoriesGeneratorController;
let ProductsGeneratorController = class ProductsGeneratorController extends index_1.ODataController {
    *find(filter, stream) {
        let response = products2;
        if (filter)
            response = yield products2
                .map((product) => Object.assign({}, product, { _id: product._id.toString(), CategoryId: product.CategoryId && product.CategoryId.toString() }))
                .filter(odata_v4_inmemory_1.createFilter(filter));
        for (let category of response) {
            stream.write(category);
            yield delay(1);
        }
        ;
        stream.end();
    }
    *findOne(key) {
        return yield products2.filter(p => p._id.toString() == key)[0] || null;
    }
    *findCategories(filter, stream, result) {
        return yield categories2.filter((c) => c && c._id.toString() === result.CategoryId.toString());
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.stream)
], ProductsGeneratorController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({
        key: index_1.odata.key
    })
], ProductsGeneratorController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("Category2"),
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.stream), tslib_1.__param(2, index_1.odata.result)
], ProductsGeneratorController.prototype, "findCategories", null);
ProductsGeneratorController = tslib_1.__decorate([
    index_1.odata.type(Product2),
    index_1.Edm.EntitySet("Products2")
], ProductsGeneratorController);
exports.ProductsGeneratorController = ProductsGeneratorController;
let ProductsPromiseGeneratorController = class ProductsPromiseGeneratorController extends index_1.ODataController {
    *find(filter) {
        if (filter) {
            return yield Promise.resolve(products2
                .map((product) => Object.assign({}, product, { _id: product._id.toString() }))
                .filter(odata_v4_inmemory_1.createFilter(filter)));
        }
        else {
            products2.inlinecount = products2.length;
            return yield Promise.resolve(products2);
        }
    }
    *findOne(key) {
        return yield Promise.resolve(products2.filter(p => p._id.toString() == key)[0] || null);
    }
    *findCategories(filter, result) {
        return yield Promise.resolve(categories2.filter((c) => c && c._id.toString() === result.CategoryId.toString()));
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], ProductsPromiseGeneratorController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({
        key: index_1.odata.key
    })
], ProductsPromiseGeneratorController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("CategoryPromise"),
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.result)
], ProductsPromiseGeneratorController.prototype, "findCategories", null);
ProductsPromiseGeneratorController = tslib_1.__decorate([
    index_1.odata.type(ModelsForPromise_1.ProductPromise)
], ProductsPromiseGeneratorController);
exports.ProductsPromiseGeneratorController = ProductsPromiseGeneratorController;
let CategoriesPromiseGeneratorController = class CategoriesPromiseGeneratorController extends index_1.ODataController {
    *find(filter) {
        if (filter) {
            return yield Promise.resolve(categories2
                .map((category) => Object.assign({}, category, { _id: category._id.toString() }))
                .filter(odata_v4_inmemory_1.createFilter(filter)));
        }
        return yield Promise.resolve(categories2);
    }
    *findOne(key) {
        return yield Promise.resolve(categories2.find(category => category._id.toString() === key) || null);
    }
    *findProduct(key, result) {
        return yield Promise.resolve(products2.filter((product) => product.CategoryId && product.CategoryId.toString() === result._id.toString() && product._id.toString() === key.toString()));
    }
    *findProducts(filter, stream, result) {
        return yield Promise.resolve(products2.filter((product) => product.CategoryId && product.CategoryId.toString() === result._id.toString()));
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], CategoriesPromiseGeneratorController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({
        key: index_1.odata.key
    })
], CategoriesPromiseGeneratorController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("ProductPromises"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.result)
], CategoriesPromiseGeneratorController.prototype, "findProduct", null);
tslib_1.__decorate([
    index_1.odata.GET("ProductPromises"),
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.stream), tslib_1.__param(2, index_1.odata.result)
], CategoriesPromiseGeneratorController.prototype, "findProducts", null);
CategoriesPromiseGeneratorController = tslib_1.__decorate([
    index_1.odata.type(ModelsForPromise_1.CategoryPromise)
], CategoriesPromiseGeneratorController);
exports.CategoriesPromiseGeneratorController = CategoriesPromiseGeneratorController;
const getAllProducts = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield products2;
});
const getProductsByFilter = (filter) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield products2
        .map((product) => Object.assign({}, product, { _id: product._id.toString(), CategoryId: product.CategoryId && product.CategoryId.toString() }))
        .filter(odata_v4_inmemory_1.createFilter(filter));
});
const getProductByKey = (key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return (yield products2.find(p => p._id.toString() == key)) || null;
});
const getCategoryOfProduct = (result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return (yield categories2.find((c) => c && c._id.toString() === result.CategoryId.toString())) || null;
});
const getCategoryByFilterOfProduct = (filter, result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield categories2
        .filter(c => c._id.toString() === result.CategoryId.toString())
        .map((category) => Object.assign({}, category, { _id: category._id.toString() }))
        .filter(odata_v4_inmemory_1.createFilter(filter));
});
let ProductsAdvancedGeneratorController = class ProductsAdvancedGeneratorController extends index_1.ODataController {
    *find(filter) {
        if (filter)
            return yield getProductsByFilter(filter);
        return yield getAllProducts();
    }
    *findOne(key) {
        return yield getProductByKey(key);
    }
    *findCategories(filter, result) {
        if (filter)
            return yield getCategoryByFilterOfProduct(filter, result);
        return yield getCategoryOfProduct(result);
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], ProductsAdvancedGeneratorController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({ key: index_1.odata.key })
], ProductsAdvancedGeneratorController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("GeneratorCategory"),
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.result)
], ProductsAdvancedGeneratorController.prototype, "findCategories", null);
ProductsAdvancedGeneratorController = tslib_1.__decorate([
    index_1.odata.type(ModelsForGenerator_1.GeneratorProduct)
], ProductsAdvancedGeneratorController);
exports.ProductsAdvancedGeneratorController = ProductsAdvancedGeneratorController;
const getAllCategories = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield categories2;
});
const getCategoriesByFilter = (filter) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield categories2
        .map((category) => Object.assign({}, category, { _id: category._id.toString() }))
        .filter(odata_v4_inmemory_1.createFilter(filter));
});
const getCategoryByKey = (key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return (yield categories2.find(category => category._id.toString() === key)) || null;
});
const getProductOfCategory = (key, result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield products2.filter((product) => product.CategoryId && product.CategoryId.toString() === result._id.toString() && product._id.toString() === key.toString());
});
const getProductsOfCategory = (result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield products2.filter((product) => product.CategoryId && product.CategoryId.toString() === result._id.toString());
});
const getProductsByFilterOfCategory = (filter, result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield products2
        .filter(p => p.CategoryId.toString() === result._id.toString())
        .map((product) => Object.assign({}, product, { _id: product._id.toString(), CategoryId: product.CategoryId && product.CategoryId.toString() }))
        .filter(odata_v4_inmemory_1.createFilter(filter));
});
let CategoriesAdvancedGeneratorController = class CategoriesAdvancedGeneratorController extends index_1.ODataController {
    *find(query, filter) {
        let options = yield queryOptions_1.processQueries(query);
        let response = yield getAllCategories();
        if (filter)
            response = yield getCategoriesByFilter(filter);
        response = yield queryOptions_1.doOrderby(response, options);
        response = yield queryOptions_1.doSkip(response, options);
        response = yield queryOptions_1.doTop(response, options);
        return response;
    }
    *findOne(key) {
        return yield getCategoryByKey(key);
    }
    *filterProducts(query, filter, result) {
        let options = yield queryOptions_1.processQueries(query);
        let response = yield getProductsOfCategory(result);
        if (filter)
            response = yield getProductsByFilterOfCategory(filter, result);
        response = yield queryOptions_1.doOrderby(response, options);
        response = yield queryOptions_1.doSkip(response, options);
        response = yield queryOptions_1.doTop(response, options);
        return response;
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query), tslib_1.__param(1, index_1.odata.filter)
], CategoriesAdvancedGeneratorController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    index_1.odata.parameters({ key: index_1.odata.key })
], CategoriesAdvancedGeneratorController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.GET("GeneratorProducts"),
    tslib_1.__param(0, index_1.odata.query), tslib_1.__param(1, index_1.odata.filter), tslib_1.__param(2, index_1.odata.result)
], CategoriesAdvancedGeneratorController.prototype, "filterProducts", null);
CategoriesAdvancedGeneratorController = tslib_1.__decorate([
    index_1.odata.type(ModelsForGenerator_1.GeneratorCategory)
], CategoriesAdvancedGeneratorController);
exports.CategoriesAdvancedGeneratorController = CategoriesAdvancedGeneratorController;
let Image2 = class Image2 {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.Int32
], Image2.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Image2.prototype, "Filename", void 0);
tslib_1.__decorate([
    index_1.Edm.Stream("image/png")
], Image2.prototype, "Data", void 0);
tslib_1.__decorate([
    index_1.Edm.Stream("image/png")
], Image2.prototype, "Data2", void 0);
Image2 = tslib_1.__decorate([
    index_1.Edm.MediaEntity("image/png")
], Image2);
exports.Image2 = Image2;
let Images2Controller = class Images2Controller extends index_1.ODataController {
    entitySet(_) {
        let image2 = new Image2();
        image2.Id = 1;
        image2.Filename = "tmp.png";
        return [image2];
    }
    entity(key) {
        let image2 = new Image2();
        image2.Id = key;
        image2.Filename = "tmp.png";
        return image2;
    }
    *getData2(_, stream, context) {
        return yield new index_1.ODataStream(fs.createReadStream(path.join(__dirname, "..", "..", "src", "test", "fixtures", "logo_jaystack.png"))).pipe(context.response);
    }
    *postData2(_, data) {
        return yield new index_1.ODataStream(fs.createWriteStream(path.join(__dirname, "..", "..", "src", "test", "fixtures", "tmp.png"))).write(data);
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query)
], Images2Controller.prototype, "entitySet", null);
tslib_1.__decorate([
    index_1.odata.GET(),
    tslib_1.__param(0, index_1.odata.key())
], Images2Controller.prototype, "entity", null);
tslib_1.__decorate([
    index_1.odata.GET("Data2"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.stream), tslib_1.__param(2, index_1.odata.context)
], Images2Controller.prototype, "getData2", null);
tslib_1.__decorate([
    index_1.odata.POST("Data2"),
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.body)
], Images2Controller.prototype, "postData2", null);
Images2Controller = tslib_1.__decorate([
    index_1.odata.type(Image2)
], Images2Controller);
exports.Images2Controller = Images2Controller;
class Location {
    constructor(city, address) {
        this.City = city;
        this.Address = address;
    }
}
tslib_1.__decorate([
    index_1.Edm.String
], Location.prototype, "City", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Location.prototype, "Address", void 0);
exports.Location = Location;
class User {
    constructor(id, location) {
        this.Id = id;
        this.Location = location;
    }
}
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Int32
], User.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.ComplexType(Location)
], User.prototype, "Location", void 0);
exports.User = User;
class UsersController extends index_1.ODataController {
    find() {
        return [new User(1, new Location("Budapest", "Virág utca"))];
    }
    findOne(key) {
        return new User(key, new Location("Budapest", "Virág utca"));
    }
    logout() { }
}
tslib_1.__decorate([
    index_1.odata.GET
], UsersController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], UsersController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.odata.namespace("Session"),
    index_1.Edm.Action
], UsersController.prototype, "logout", null);
exports.UsersController = UsersController;
class DefTest extends index_1.ODataEntity {
}
exports.DefTest = DefTest;
DefTest.define({
    id: [index_1.Edm.Int32, index_1.Edm.Key, index_1.Edm.Computed],
    key: index_1.Edm.String,
    value: index_1.Edm.String
});
class DefTestController extends index_1.ODataController {
    all() {
        return [Object.assign(new DefTest(), {
                id: 1,
                key: 'testkey',
                value: 'testvalue'
            })];
    }
    one(key) {
        return Object.assign(new DefTest(), {
            id: key,
            key: `testkey${key}`,
            value: `testvalue${key}`
        });
    }
}
exports.DefTestController = DefTestController;
DefTestController.define(index_1.odata.type(DefTest), {
    all: index_1.odata.GET,
    one: [index_1.odata.GET, {
            key: index_1.odata.key
        }]
});
class HeaderTestEntity {
}
tslib_1.__decorate([
    index_1.Edm.Int32,
    index_1.Edm.Key,
    index_1.Edm.Required
], HeaderTestEntity.prototype, "Id", void 0);
exports.HeaderTestEntity = HeaderTestEntity;
let HeaderTestEntityController = class HeaderTestEntityController extends index_1.ODataController {
    findAll(ctx, ___, ____) {
        ctx.response.status(403);
        return [];
    }
    findOneByKeys(key, ctx) {
        ctx.response.sendStatus(500);
        return {};
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], HeaderTestEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.context)
], HeaderTestEntityController.prototype, "findOneByKeys", null);
HeaderTestEntityController = tslib_1.__decorate([
    index_1.odata.type(HeaderTestEntity)
], HeaderTestEntityController);
exports.HeaderTestEntityController = HeaderTestEntityController;
class UpsertTestEntity {
    constructor(id, name) {
        this.Id = id;
        this.name = name;
    }
}
tslib_1.__decorate([
    index_1.Edm.Int32,
    index_1.Edm.Key,
    index_1.Edm.Required
], UpsertTestEntity.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], UpsertTestEntity.prototype, "name", void 0);
exports.UpsertTestEntity = UpsertTestEntity;
let UpsertTestEntityController = class UpsertTestEntityController extends index_1.ODataController {
    findAll(ctx, ___, ____) {
        return [new UpsertTestEntity(1, 'upsert')];
    }
    findOneByKeys(id, ctx) {
        return new UpsertTestEntity(1, 'upsert');
    }
    put(body) {
        let up = new UpsertTestEntity(1, 'upsert');
        if (body.Id && body.Id === 1) {
            up.name = body.name;
            return null;
        }
        if (body.Id) {
            return new UpsertTestEntity(body.Id, body.name);
        }
        return new UpsertTestEntity(9999, body.name);
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], UpsertTestEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.id), tslib_1.__param(1, index_1.odata.context)
], UpsertTestEntityController.prototype, "findOneByKeys", null);
tslib_1.__decorate([
    tslib_1.__param(0, index_1.odata.body)
], UpsertTestEntityController.prototype, "put", null);
UpsertTestEntityController = tslib_1.__decorate([
    index_1.odata.type(UpsertTestEntity)
], UpsertTestEntityController);
exports.UpsertTestEntityController = UpsertTestEntityController;
class DefTestServer extends index_1.ODataServer {
}
exports.DefTestServer = DefTestServer;
DefTestServer.define(index_1.odata.controller(DefTestController, true));
class HiddenController extends index_1.ODataController {
}
exports.HiddenController = HiddenController;
let TestServer = class TestServer extends index_1.ODataServer {
    ActionImport() {
        return new Promise((resolve) => {
            setTimeout(resolve);
        });
    }
    ActionImportParams(value) {
        if (typeof value != "number")
            throw new Error("value is not a number!");
    }
    FunctionImport(value) {
        return `The number is ${value}.`;
    }
    FunctionImportMore(message, value) {
        return `The number is ${value} and your message was ${message}.`;
    }
    SetStatusCode(ctx) {
        ctx.response.sendStatus(403);
        return `The status code is ${ctx.response.statusCode}`;
    }
    SetStatusCode2(ctx) {
        ctx.response.sendStatus(500);
    }
};
tslib_1.__decorate([
    index_1.Edm.ActionImport
], TestServer.prototype, "ActionImport", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    tslib_1.__param(0, index_1.Edm.Int32)
], TestServer.prototype, "ActionImportParams", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.Int64)
], TestServer.prototype, "FunctionImport", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String), tslib_1.__param(1, index_1.Edm.Int64)
], TestServer.prototype, "FunctionImportMore", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport(index_1.Edm.String),
    tslib_1.__param(0, index_1.odata.context)
], TestServer.prototype, "SetStatusCode", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    tslib_1.__param(0, index_1.odata.context)
], TestServer.prototype, "SetStatusCode2", null);
TestServer = tslib_1.__decorate([
    index_1.odata.cors,
    index_1.odata.controller(SyncTestController, "EntitySet"),
    index_1.odata.controller(GeneratorTestController, "GeneratorEntitySet"),
    index_1.odata.controller(AsyncTestController, "AsyncEntitySet"),
    index_1.odata.controller(InlineCountController, "InlineCountEntitySet"),
    index_1.odata.controller(BoundOperationController, "BoundOperationEntitySet"),
    index_1.odata.controller(ImagesController, "ImagesControllerEntitySet"),
    index_1.odata.controller(MusicController, "MusicControllerEntitySet"),
    index_1.odata.controller(ProductsController, true),
    index_1.odata.controller(CategoriesController, true),
    index_1.odata.controller(UsersController, true, User),
    index_1.odata.controller(HiddenController),
    index_1.odata.controller(CategoriesStreamingController, "CategoriesStream"),
    index_1.odata.controller(CategoriesGeneratorController),
    index_1.odata.controller(ProductsGeneratorController),
    index_1.odata.controller(ProductsPromiseGeneratorController, "AdvancedProducts"),
    index_1.odata.controller(CategoriesPromiseGeneratorController, "AdvancedCategories"),
    index_1.odata.controller(ProductsAdvancedGeneratorController, "GeneratorProducts"),
    index_1.odata.controller(CategoriesAdvancedGeneratorController, "GeneratorCategories"),
    index_1.odata.controller(Images2Controller, "Images2ControllerEntitySet"),
    index_1.odata.controller(HeaderTestEntityController, "HeaderTestEntity"),
    index_1.odata.controller(UpsertTestEntityController, "UpsertTestEntity"),
    index_1.odata.container("TestContainer")
], TestServer);
exports.TestServer = TestServer;
serverCache.push(TestServer.create(5005));
let AuthenticationServer = class AuthenticationServer extends index_1.ODataServer {
    echo(message) {
        return message;
    }
};
tslib_1.__decorate([
    index_1.odata.namespace("Echo"),
    index_1.Edm.FunctionImport(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String)
], AuthenticationServer.prototype, "echo", null);
AuthenticationServer = tslib_1.__decorate([
    index_1.odata.namespace("Authentication"),
    index_1.odata.controller(UsersController, true)
], AuthenticationServer);
exports.AuthenticationServer = AuthenticationServer;
let ProductServer = class ProductServer extends index_1.ODataServer {
};
ProductServer = tslib_1.__decorate([
    index_1.odata.cors,
    index_1.odata.controller(ProductsController, true),
    index_1.odata.controller(CategoriesController, false)
], ProductServer);
exports.ProductServer = ProductServer;
serverCache.push(ProductServer.create(7001));
let CategoryServer = class CategoryServer extends index_1.ODataServer {
};
CategoryServer = tslib_1.__decorate([
    index_1.odata.cors,
    index_1.odata.controller(ProductsController, false),
    index_1.odata.controller(CategoriesController, true)
], CategoryServer);
exports.CategoryServer = CategoryServer;
serverCache.push(CategoryServer.create(7002));
class NoServer extends index_1.ODataServer {
}
exports.NoServer = NoServer;
process.on("warning", warning => {
    console.log(warning.stack);
});
//# sourceMappingURL=test.model.js.map