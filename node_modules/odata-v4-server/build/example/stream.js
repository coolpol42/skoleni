"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const mongodb_1 = require("mongodb");
const odata_v4_mongodb_1 = require("odata-v4-mongodb");
const stream_1 = require("stream");
const lib_1 = require("../lib");
const model_1 = require("./model");
const mongodb = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield mongodb_1.MongoClient.connect("mongodb://localhost:27017/odataserver")).db();
    });
};
const delay = function (ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
};
let ProductsController = class ProductsController extends lib_1.ODataController {
    /*@odata.GET
    *find(@odata.query query:ODataQuery, @odata.stream stream:Writable):any{
        let db:Db = yield mongodb();
        let mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string") mongodbQuery.query.CategoryId = new ObjectID(mongodbQuery.query.CategoryId);
        return db.collection("Products")
            .find(
                mongodbQuery.query,
                mongodbQuery.projection,
                mongodbQuery.skip,
                mongodbQuery.limit
            ).stream().pipe(stream);
    }*/
    // example using generator with mongodb .next() and passing entity data into OData stream
    *find(query, stream) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        if (typeof mongodbQuery.query._id == "string")
            mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
        if (typeof mongodbQuery.query.CategoryId == "string")
            mongodbQuery.query.CategoryId = new mongodb_1.ObjectID(mongodbQuery.query.CategoryId);
        let cursor = db.collection("Products")
            .find(mongodbQuery.query, {
            projection: mongodbQuery.projection,
            skip: mongodbQuery.skip,
            limit: mongodbQuery.limit
        });
        let item = yield cursor.next();
        while (item) {
            stream.write(item);
            item = yield cursor.next();
        }
        stream.end();
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
};
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.query), tslib_1.__param(1, lib_1.odata.stream)
], ProductsController.prototype, "find", null);
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.key()), tslib_1.__param(1, lib_1.odata.query)
], ProductsController.prototype, "findOne", null);
tslib_1.__decorate([
    lib_1.odata.POST,
    tslib_1.__param(0, lib_1.odata.body)
], ProductsController.prototype, "insert", null);
ProductsController = tslib_1.__decorate([
    lib_1.odata.type(model_1.Product)
], ProductsController);
let CategoriesController = class CategoriesController extends lib_1.ODataController {
    *find(query) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        if (typeof mongodbQuery.query._id == "string")
            mongodbQuery.query._id = new mongodb_1.ObjectID(mongodbQuery.query._id);
        let cursor = db.collection("Categories")
            .find(mongodbQuery.query, {
            projection: mongodbQuery.projection,
            skip: mongodbQuery.skip,
            limit: mongodbQuery.limit
        });
        let result = yield cursor.toArray();
        result.inlinecount = yield cursor.count(false);
        return result;
    }
    *findOne(key, query) {
        let db = yield mongodb();
        let mongodbQuery = odata_v4_mongodb_1.createQuery(query);
        return db.collection("Categories").findOne({ _id: new mongodb_1.ObjectID(key) }, {
            fields: mongodbQuery.projection
        });
    }
};
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.query)
], CategoriesController.prototype, "find", null);
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.key()), tslib_1.__param(1, lib_1.odata.query)
], CategoriesController.prototype, "findOne", null);
CategoriesController = tslib_1.__decorate([
    lib_1.odata.type(model_1.Category)
], CategoriesController);
var Genre;
(function (Genre) {
    Genre[Genre["Unknown"] = 0] = "Unknown";
    Genre[Genre["Pop"] = 1] = "Pop";
    Genre[Genre["Rock"] = 2] = "Rock";
    Genre[Genre["Metal"] = 3] = "Metal";
    Genre[Genre["Classic"] = 4] = "Classic";
})(Genre || (Genre = {}));
let Music = class Music extends stream_1.PassThrough {
};
tslib_1.__decorate([
    lib_1.Edm.Key,
    lib_1.Edm.Computed,
    lib_1.Edm.TypeDefinition(mongodb_1.ObjectID)
    //@Edm.Int32
], Music.prototype, "Id", void 0);
tslib_1.__decorate([
    lib_1.Edm.String
], Music.prototype, "Artist", void 0);
tslib_1.__decorate([
    lib_1.Edm.String
], Music.prototype, "Title", void 0);
tslib_1.__decorate([
    lib_1.Edm.EnumType(Genre)
], Music.prototype, "Genre", void 0);
tslib_1.__decorate([
    lib_1.Edm.TypeDefinition(mongodb_1.ObjectID)
], Music.prototype, "uid", void 0);
Music = tslib_1.__decorate([
    lib_1.Edm.MediaEntity("audio/mp3")
], Music);
let NorthwindTypes = class NorthwindTypes extends lib_1.Edm.ContainerBase {
    constructor() {
        super(...arguments);
        this.Genre2 = Genre;
        this.ObjectID2 = mongodb_1.ObjectID;
        this.Music2 = Music;
    }
};
tslib_1.__decorate([
    lib_1.Edm.Flags,
    lib_1.Edm.Int64,
    lib_1.Edm.Serialize(value => `NorthwindTypes.Genre2'${value}'`)
], NorthwindTypes.prototype, "Genre2", void 0);
tslib_1.__decorate([
    lib_1.Edm.String,
    lib_1.Edm.URLDeserialize((value) => new Promise(resolve => setTimeout(_ => resolve(new mongodb_1.ObjectID(value)), 1000))),
    lib_1.Edm.Deserialize(value => new mongodb_1.ObjectID(value))
], NorthwindTypes.prototype, "ObjectID2", void 0);
NorthwindTypes = tslib_1.__decorate([
    lib_1.odata.namespace("NorthwindTypes")
], NorthwindTypes);
let MusicController = class MusicController extends lib_1.ODataController {
    find(filter, query) {
        console.log(JSON.stringify(odata_v4_mongodb_1.createQuery(query).query, null, 2), JSON.stringify(odata_v4_mongodb_1.createFilter(filter), null, 2));
        let music = new Music();
        music.Id = new mongodb_1.ObjectID;
        music.Artist = "Dream Theater";
        music.Title = "Six degrees of inner turbulence";
        music.Genre = Genre.Metal;
        music.uid = new mongodb_1.ObjectID();
        return [music];
    }
    findOne(_) {
        let music = new Music();
        music.Id = new mongodb_1.ObjectID;
        music.Artist = "Dream Theater";
        music.Title = "Six degrees of inner turbulence";
        music.Genre = Genre.Metal;
        music.uid = new mongodb_1.ObjectID();
        return music;
    }
    insert(body) {
        body.Id = new mongodb_1.ObjectID();
        console.log(body);
        return body;
    }
    mp3(_, context) {
        let file = fs.createReadStream("tmp.mp3");
        return new Promise((resolve, reject) => {
            file.on("open", () => {
                context.response.on("finish", () => {
                    file.close();
                });
                resolve(file);
            }).on("error", reject);
        });
    }
    post(_, upload) {
        let file = fs.createWriteStream("tmp.mp3");
        return new Promise((resolve, reject) => {
            file.on('open', () => {
                upload.pipe(file);
            }).on('error', reject);
            upload.on('end', resolve);
        });
    }
};
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.filter), tslib_1.__param(1, lib_1.odata.query)
], MusicController.prototype, "find", null);
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.key())
], MusicController.prototype, "findOne", null);
tslib_1.__decorate([
    lib_1.odata.POST,
    tslib_1.__param(0, lib_1.odata.body)
], MusicController.prototype, "insert", null);
tslib_1.__decorate([
    lib_1.odata.GET.$value,
    tslib_1.__param(0, lib_1.odata.key), tslib_1.__param(1, lib_1.odata.context)
], MusicController.prototype, "mp3", null);
tslib_1.__decorate([
    lib_1.odata.POST.$value,
    tslib_1.__param(0, lib_1.odata.key), tslib_1.__param(1, lib_1.odata.body)
], MusicController.prototype, "post", null);
MusicController = tslib_1.__decorate([
    lib_1.odata.type(Music),
    lib_1.odata.container("Media")
], MusicController);
class ImageMember {
}
tslib_1.__decorate([
    lib_1.Edm.String
], ImageMember.prototype, "value", void 0);
let Image = class Image {
};
tslib_1.__decorate([
    lib_1.Edm.Key,
    lib_1.Edm.Computed,
    lib_1.Edm.Int32
], Image.prototype, "Id", void 0);
tslib_1.__decorate([
    lib_1.Edm.String
], Image.prototype, "Filename", void 0);
tslib_1.__decorate([
    lib_1.Edm.Collection(lib_1.Edm.ComplexType(ImageMember))
], Image.prototype, "Members", void 0);
tslib_1.__decorate([
    lib_1.Edm.Stream("image/png")
], Image.prototype, "Data", void 0);
tslib_1.__decorate([
    lib_1.Edm.Stream("image/png")
], Image.prototype, "Data2", void 0);
Image = tslib_1.__decorate([
    lib_1.Edm.OpenType
], Image);
let ImagesController = class ImagesController extends lib_1.ODataController {
    images(id) {
        let image = new Image();
        image.Id = id;
        image.Filename = "tmp.png";
        image.mm = [[1, 2], [3, 4]];
        return image;
    }
    *getMembers(_, stream) {
        for (let i = 0; i < 10; i++) {
            stream.write({ value: `Member #${i}` });
            yield delay(1);
        }
        stream.end();
    }
    getData(_, context, result) {
        return new lib_1.ODataStream(fs.createReadStream(result.Filename)).pipe(context.response);
    }
    postData(_, data, result) {
        return new lib_1.ODataStream(fs.createWriteStream(result.Filename)).write(data);
    }
};
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.key)
], ImagesController.prototype, "images", null);
tslib_1.__decorate([
    lib_1.odata.GET("Members"),
    tslib_1.__param(0, lib_1.odata.key), tslib_1.__param(1, lib_1.odata.stream)
], ImagesController.prototype, "getMembers", null);
tslib_1.__decorate([
    lib_1.odata.GET("Data"),
    lib_1.odata.GET("Data2").$value,
    tslib_1.__param(0, lib_1.odata.key), tslib_1.__param(1, lib_1.odata.context), tslib_1.__param(2, lib_1.odata.result)
], ImagesController.prototype, "getData", null);
tslib_1.__decorate([
    lib_1.odata.POST("Data"),
    lib_1.odata.POST("Data2").$value,
    tslib_1.__param(0, lib_1.odata.key), tslib_1.__param(1, lib_1.odata.body), tslib_1.__param(2, lib_1.odata.result)
], ImagesController.prototype, "postData", null);
ImagesController = tslib_1.__decorate([
    lib_1.odata.type(Image),
    lib_1.odata.container("Media")
], ImagesController);
let PlainObject = class PlainObject {
};
PlainObject = tslib_1.__decorate([
    lib_1.Edm.OpenType
], PlainObject);
let StreamServer = class StreamServer extends lib_1.ODataServer {
    objid(v) {
        return v.toHexString();
    }
    stringify(obj) {
        return JSON.stringify(obj);
    }
    Fetch(filename, stream, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let file = fs.createReadStream(filename);
            return file.on("open", () => {
                context.response.contentType(path.extname(filename));
                file.pipe(stream);
            });
        });
    }
};
tslib_1.__decorate([
    lib_1.Edm.TypeDefinition(mongodb_1.ObjectID),
    lib_1.Edm.FunctionImport,
    tslib_1.__param(0, lib_1.Edm.TypeDefinition(mongodb_1.ObjectID))
], StreamServer.prototype, "objid", null);
tslib_1.__decorate([
    lib_1.Edm.FunctionImport(lib_1.Edm.String),
    tslib_1.__param(0, lib_1.Edm.EntityType(PlainObject))
], StreamServer.prototype, "stringify", null);
tslib_1.__decorate([
    lib_1.odata.container("almafa"),
    lib_1.Edm.FunctionImport(lib_1.Edm.Stream),
    tslib_1.__param(0, lib_1.Edm.String), tslib_1.__param(1, lib_1.odata.stream), tslib_1.__param(2, lib_1.odata.context)
], StreamServer.prototype, "Fetch", null);
StreamServer = tslib_1.__decorate([
    lib_1.Edm.Container(NorthwindTypes),
    lib_1.odata.controller(ProductsController, true),
    lib_1.odata.controller(CategoriesController, true),
    lib_1.odata.controller(MusicController, true),
    lib_1.odata.controller(ImagesController, true)
], StreamServer);
//console.dir(createMetadataJSON(StreamServer).dataServices.schema[0]["function"][1].parameter);
//console.log(createMetadataJSON(StreamServer).dataServices.schema[0].entityType[2]);
//console.log(StreamServer.$metadata().edmx.dataServices.schemas[0].typeDefinitions);
StreamServer.create("/odata", 3000);
//# sourceMappingURL=stream.js.map