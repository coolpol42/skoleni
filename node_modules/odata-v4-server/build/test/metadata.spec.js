"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="mocha" />
const index_1 = require("../lib/index");
const stream_1 = require("stream");
const mongodb_1 = require("mongodb");
const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const beautify = require("xml-beautifier");
const serverCache = [];
if (typeof after == "function") {
    after(function () {
        serverCache.forEach(server => server.close());
    });
}
const toObjectID = _id => _id && !(_id instanceof mongodb_1.ObjectID) ? mongodb_1.ObjectID.createFromHexString(_id) : _id;
let schemaJson = {
    version: "4.0",
    dataServices: {
        schema: [{
                namespace: "SchemJsonTest",
                entityType: [{
                        name: "Index",
                        key: [{
                                propertyRef: [{
                                        name: "id"
                                    }]
                            }],
                        property: [{
                                name: "id",
                                type: "Edm.Int64",
                                nullable: false
                            }]
                    }],
                entityContainer: {
                    name: "SchemJsonTestContext",
                    entitySet: [{
                            name: "SchemJsonTest",
                            entityType: "SchemJsonTest.Index"
                        }]
                }
            }]
    }
};
let defineEntities = {
    namespace: 'Default',
    containerName: 'Container',
    entities: [
        {
            name: 'Kitten',
            collectionName: 'Kittens',
            keys: ['Id'],
            computedKey: true,
            properties: {
                Id: 'Edm.String',
                Name: 'Edm.String',
                Age: 'Edm.Int32',
                Lives: 'Edm.Int32',
                Owner: 'Edm.String'
            },
            annotations: [
                { name: 'UI.DisplayName', value: 'Meww' },
                { property: 'Id', name: 'UI.ReadOnly', value: 'true' },
                { property: 'Title', name: 'UI.DisplayName', value: 'Meww Meww' },
            ]
        }
    ]
};
var Genre;
(function (Genre) {
    Genre[Genre["Unknown"] = 0] = "Unknown";
    Genre[Genre["Pop"] = 1] = "Pop";
    Genre[Genre["Rock"] = 2] = "Rock";
    Genre[Genre["Metal"] = 3] = "Metal";
    Genre[Genre["Classic"] = 4] = "Classic";
})(Genre = exports.Genre || (exports.Genre = {}));
index_1.Edm.Annotate({
    term: "foo",
    string: "bar"
})(Genre);
index_1.Edm.Annotate({
    term: "foo",
    string: "bar"
})(Genre, "Rock");
let Index = class Index {
};
tslib_1.__decorate([
    index_1.Edm.Int64
], Index.prototype, "id", void 0);
Index = tslib_1.__decorate([
    index_1.Edm.OpenType
], Index);
let Media = class Media extends stream_1.PassThrough {
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.Int32
], Media.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.String
], Media.prototype, "StringId", void 0);
tslib_1.__decorate([
    index_1.Edm.EntityType(index_1.Edm.ForwardRef(() => Meta)),
    index_1.Edm.Partner("MediaList")
], Media.prototype, "Meta", void 0);
Media = tslib_1.__decorate([
    index_1.odata.namespace("Media"),
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Media"
    }),
    index_1.Edm.MediaEntity("audio/mp3")
], Media);
exports.Media = Media;
class CompoundKey {
}
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Key
], CompoundKey.prototype, "bc0", void 0);
tslib_1.__decorate([
    index_1.Edm.Binary,
    index_1.Edm.Key
], CompoundKey.prototype, "bc1", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean,
    index_1.Edm.Key
], CompoundKey.prototype, "bc2", void 0);
tslib_1.__decorate([
    index_1.Edm.Byte,
    index_1.Edm.Key
], CompoundKey.prototype, "bc3", void 0);
tslib_1.__decorate([
    index_1.Edm.Guid,
    index_1.Edm.Key
], CompoundKey.prototype, "bc4", void 0);
tslib_1.__decorate([
    index_1.Edm.Double,
    index_1.Edm.Key
], CompoundKey.prototype, "bc5", void 0);
exports.CompoundKey = CompoundKey;
class BaseComplex {
}
tslib_1.__decorate([
    index_1.Edm.String
], BaseComplex.prototype, "bc0", void 0);
tslib_1.__decorate([
    index_1.Edm.EnumType(Genre)
], BaseComplex.prototype, "Genre", void 0);
exports.BaseComplex = BaseComplex;
class SubComplex extends BaseComplex {
}
tslib_1.__decorate([
    index_1.Edm.String
], SubComplex.prototype, "sc0", void 0);
exports.SubComplex = SubComplex;
class Complex extends SubComplex {
}
tslib_1.__decorate([
    index_1.Edm.String
], Complex.prototype, "c0", void 0);
exports.Complex = Complex;
let SimpleObjectID = class SimpleObjectID extends mongodb_1.ObjectID {
};
SimpleObjectID["@odata.type"] = "Simple.ObjectID";
SimpleObjectID = tslib_1.__decorate([
    index_1.Edm.String
], SimpleObjectID);
exports.SimpleObjectID = SimpleObjectID;
class SimpleEntity {
}
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.TypeDefinition(SimpleObjectID)
], SimpleEntity.prototype, "MongoId", void 0);
exports.SimpleEntity = SimpleEntity;
let MyType = class MyType {
};
MyType["@odata.type"] = "Server.MyType";
MyType = tslib_1.__decorate([
    index_1.Edm.String
], MyType);
exports.MyType = MyType;
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
    Color[Color["@odata.type"] = "Color2"] = "@odata.type";
})(Color = exports.Color || (exports.Color = {}));
class BaseMeta {
    constructor() {
        this.b0 = 'b0';
    }
}
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.TypeDefinition(mongodb_1.ObjectID),
    index_1.Edm.Deserialize(toObjectID)
], BaseMeta.prototype, "MongoId", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], BaseMeta.prototype, "b0", void 0);
exports.BaseMeta = BaseMeta;
let Meta = class Meta extends BaseMeta {
    a0() { }
    f0() {
        return "f";
    }
    f2(message) {
        return message;
    }
};
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Computed,
    index_1.Edm.Required,
    index_1.Edm.Int32,
    index_1.Edm.Annotate({
        term: "UI.DisplayName",
        string: "Identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
], Meta.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.TypeDefinition(mongodb_1.ObjectID)
], Meta.prototype, "MongoId", void 0);
tslib_1.__decorate([
    index_1.Edm.TypeDefinition(MyType)
], Meta.prototype, "myType", void 0);
tslib_1.__decorate([
    index_1.Edm.Binary,
    index_1.Edm.Nullable
], Meta.prototype, "p0", void 0);
tslib_1.__decorate([
    index_1.Edm.Boolean
], Meta.prototype, "p1", void 0);
tslib_1.__decorate([
    index_1.Edm.Byte
], Meta.prototype, "p2", void 0);
tslib_1.__decorate([
    index_1.Edm.Date
], Meta.prototype, "p3", void 0);
tslib_1.__decorate([
    index_1.Edm.DateTimeOffset
], Meta.prototype, "p4", void 0);
tslib_1.__decorate([
    index_1.Edm.Decimal,
    index_1.Edm.Precision(13),
    index_1.Edm.Scale(2)
], Meta.prototype, "p5", void 0);
tslib_1.__decorate([
    index_1.Edm.Double
], Meta.prototype, "p6", void 0);
tslib_1.__decorate([
    index_1.Edm.Duration
], Meta.prototype, "p7", void 0);
tslib_1.__decorate([
    index_1.Edm.Guid,
    index_1.Edm.ConcurrencyMode("custom")
], Meta.prototype, "p8", void 0);
tslib_1.__decorate([
    index_1.Edm.Int16,
    index_1.Edm.Key
], Meta.prototype, "p9", void 0);
tslib_1.__decorate([
    index_1.Edm.Int32,
    index_1.Edm.Key
], Meta.prototype, "p10", void 0);
tslib_1.__decorate([
    index_1.Edm.Int64,
    index_1.Edm.DefaultValue(256)
], Meta.prototype, "p11", void 0);
tslib_1.__decorate([
    index_1.Edm.SByte
], Meta.prototype, "p12", void 0);
tslib_1.__decorate([
    index_1.Edm.Single
], Meta.prototype, "p13", void 0);
tslib_1.__decorate([
    index_1.Edm.Stream("test")
], Meta.prototype, "p14", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.ForeignKey('c0'),
    index_1.Edm.Unicode
], Meta.prototype, "p15", void 0);
tslib_1.__decorate([
    index_1.Edm.TimeOfDay
], Meta.prototype, "p16", void 0);
tslib_1.__decorate([
    index_1.Edm.Geography
], Meta.prototype, "p17", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyPoint
], Meta.prototype, "p18", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyLineString
], Meta.prototype, "p19", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyPolygon
], Meta.prototype, "p20", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyMultiPoint
], Meta.prototype, "p21", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyMultiLineString
], Meta.prototype, "p22", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyMultiPolygon
], Meta.prototype, "p23", void 0);
tslib_1.__decorate([
    index_1.Edm.GeographyCollection
], Meta.prototype, "p24", void 0);
tslib_1.__decorate([
    index_1.Edm.Geometry
], Meta.prototype, "p25", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryPoint,
    index_1.Edm.SRID(123)
], Meta.prototype, "p26", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryLineString
], Meta.prototype, "p27", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryPolygon
], Meta.prototype, "p28", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryMultiPoint
], Meta.prototype, "p29", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryMultiLineString
], Meta.prototype, "p30", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryMultiPolygon
], Meta.prototype, "p31", void 0);
tslib_1.__decorate([
    index_1.Edm.GeometryCollection
], Meta.prototype, "p32", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Binary),
    index_1.Edm.Nullable
], Meta.prototype, "p33", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Boolean)
], Meta.prototype, "p34", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Byte)
], Meta.prototype, "p35", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Date)
], Meta.prototype, "p36", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.DateTimeOffset)
], Meta.prototype, "p37", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Decimal)
], Meta.prototype, "p38", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Double)
], Meta.prototype, "p39", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Duration)
], Meta.prototype, "p40", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Guid)
], Meta.prototype, "p41", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Int16)
], Meta.prototype, "p42", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Int32)
], Meta.prototype, "p43", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Int64)
], Meta.prototype, "p44", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.SByte)
], Meta.prototype, "p45", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Single)
], Meta.prototype, "p46", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Stream("test"))
], Meta.prototype, "p47", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.String)
], Meta.prototype, "p48", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.TimeOfDay)
], Meta.prototype, "p49", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Geography)
], Meta.prototype, "p50", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyPoint)
], Meta.prototype, "p51", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyLineString)
], Meta.prototype, "p52", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyPolygon)
], Meta.prototype, "p53", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyMultiPoint)
], Meta.prototype, "p54", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyMultiLineString)
], Meta.prototype, "p55", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyMultiPolygon)
], Meta.prototype, "p56", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeographyCollection)
], Meta.prototype, "p57", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.Geometry)
], Meta.prototype, "p58", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryPoint)
], Meta.prototype, "p59", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryLineString)
], Meta.prototype, "p60", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryPolygon)
], Meta.prototype, "p61", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryMultiPoint)
], Meta.prototype, "p62", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryMultiLineString)
], Meta.prototype, "p63", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryMultiPolygon)
], Meta.prototype, "p64", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.GeometryCollection)
], Meta.prototype, "p65", void 0);
tslib_1.__decorate([
    index_1.Edm.Stream
], Meta.prototype, "p66", void 0);
tslib_1.__decorate([
    index_1.Edm.ComplexType(index_1.Edm.ForwardRef(() => Complex))
], Meta.prototype, "Complex", void 0);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.ComplexType(index_1.Edm.ForwardRef(() => Complex)))
], Meta.prototype, "ComplexList", void 0);
tslib_1.__decorate([
    index_1.Edm.Action
], Meta.prototype, "a0", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.Function(index_1.Edm.String)
], Meta.prototype, "f0", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.Function(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String)
], Meta.prototype, "f2", null);
tslib_1.__decorate([
    index_1.Edm.Collection(index_1.Edm.EntityType(Media)),
    index_1.Edm.Partner("Meta")
], Meta.prototype, "MediaList", void 0);
tslib_1.__decorate([
    index_1.Edm.EnumType(Genre)
], Meta.prototype, "Genre", void 0);
tslib_1.__decorate([
    index_1.Edm.EnumType(Color)
], Meta.prototype, "Color", void 0);
Meta = tslib_1.__decorate([
    index_1.odata.namespace("Meta")
], Meta);
exports.Meta = Meta;
class TestEntity {
}
tslib_1.__decorate([
    index_1.Edm.Int32,
    index_1.Edm.Key,
    index_1.Edm.Required
], TestEntity.prototype, "test", void 0);
tslib_1.__decorate([
    index_1.Edm.EnumType(Genre)
], TestEntity.prototype, "Genre", void 0);
exports.TestEntity = TestEntity;
class EmptyEntity {
    enumTypeAction(value, type) {
        // console.log(type, value);
    }
    enumTypeFunction(value, type) {
        return value;
    }
}
tslib_1.__decorate([
    index_1.Edm.Action,
    tslib_1.__param(0, index_1.Edm.EnumType(Genre)), tslib_1.__param(1, index_1.odata.type)
], EmptyEntity.prototype, "enumTypeAction", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.EnumType(Genre)),
    tslib_1.__param(0, index_1.Edm.EnumType(Genre)), tslib_1.__param(1, index_1.odata.type)
], EmptyEntity.prototype, "enumTypeFunction", null);
exports.EmptyEntity = EmptyEntity;
class EmptyEntity2 {
}
exports.EmptyEntity2 = EmptyEntity2;
class EmptyEntity3 {
}
exports.EmptyEntity3 = EmptyEntity3;
class EmptyEntity4 {
}
exports.EmptyEntity4 = EmptyEntity4;
class EmptyEntity5 {
}
exports.EmptyEntity5 = EmptyEntity5;
class EmptyEntity6 {
}
exports.EmptyEntity6 = EmptyEntity6;
class EmptyEntity7 {
}
exports.EmptyEntity7 = EmptyEntity7;
class HiddenEmptyEntity {
}
exports.HiddenEmptyEntity = HiddenEmptyEntity;
class TestContainerBase extends index_1.Edm.ContainerBase {
    constructor() {
        super(...arguments);
        this.Test2 = TestEntity;
    }
}
exports.TestContainerBase = TestContainerBase;
var FuncEnum;
(function (FuncEnum) {
    FuncEnum[FuncEnum["Default"] = 42] = "Default";
})(FuncEnum = exports.FuncEnum || (exports.FuncEnum = {}));
var FuncEnum2;
(function (FuncEnum2) {
    FuncEnum2[FuncEnum2["Default"] = 13] = "Default";
})(FuncEnum2 = exports.FuncEnum2 || (exports.FuncEnum2 = {}));
var FuncEnum3;
(function (FuncEnum3) {
    FuncEnum3[FuncEnum3["ActionEnumMemberName"] = 42] = "ActionEnumMemberName";
})(FuncEnum3 = exports.FuncEnum3 || (exports.FuncEnum3 = {}));
var FuncEnum4;
(function (FuncEnum4) {
    FuncEnum4[FuncEnum4["FunctionEnumMemberName"] = 42] = "FunctionEnumMemberName";
})(FuncEnum4 = exports.FuncEnum4 || (exports.FuncEnum4 = {}));
class Foobar {
    toString() {
        return "foobar";
    }
}
exports.Foobar = Foobar;
class TestContainer extends TestContainerBase {
    constructor() {
        super(...arguments);
        this.Genre2 = Genre;
        this.ObjectID2 = mongodb_1.ObjectID;
        this.FuncEnum = FuncEnum;
        this.FuncEnum2 = FuncEnum2;
        this.FuncEnum3 = FuncEnum3;
        this.FuncEnum4 = FuncEnum4;
        this["Foo.Bar"] = Foobar;
    }
}
tslib_1.__decorate([
    index_1.Edm.Flags,
    index_1.Edm.Int64,
    index_1.Edm.URLSerialize((value) => `EnumSchema.Genre2'${value || 0}'`),
    index_1.Edm.Serialize(value => `EnumSchema.Genre2'${value || 0}'`),
    index_1.odata.namespace("EnumSchema")
], TestContainer.prototype, "Genre2", void 0);
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.URLSerialize((value) => `'${value.toHexString()}'`),
    index_1.Edm.URLDeserialize((value) => new mongodb_1.ObjectID(value)),
    index_1.Edm.Deserialize(value => new mongodb_1.ObjectID(value))
], TestContainer.prototype, "ObjectID2", void 0);
tslib_1.__decorate([
    index_1.Edm.Int64,
    index_1.odata.namespace("FuncEnumSchema")
], TestContainer.prototype, "FuncEnum", void 0);
tslib_1.__decorate([
    index_1.Edm.Int64,
    index_1.odata.namespace("FuncEnumSchema")
], TestContainer.prototype, "FuncEnum2", void 0);
tslib_1.__decorate([
    index_1.Edm.Int64,
    index_1.odata.namespace("FuncEnumSchema")
], TestContainer.prototype, "FuncEnum3", void 0);
tslib_1.__decorate([
    index_1.Edm.Int64,
    index_1.odata.namespace("FuncEnumSchema")
], TestContainer.prototype, "FuncEnum4", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], TestContainer.prototype, "Foo.Bar", void 0);
exports.TestContainer = TestContainer;
let TypeDefContainer = class TypeDefContainer extends index_1.Edm.ContainerBase {
    constructor() {
        super(...arguments);
        this['Object.ID2'] = mongodb_1.ObjectID;
    }
};
tslib_1.__decorate([
    index_1.Edm.String,
    index_1.Edm.URLSerialize((value) => `'${value.toHexString()}'`),
    index_1.Edm.URLDeserialize((value) => new mongodb_1.ObjectID(value)),
    index_1.Edm.Deserialize(value => new mongodb_1.ObjectID(value))
], TypeDefContainer.prototype, "Object.ID2", void 0);
TypeDefContainer = tslib_1.__decorate([
    index_1.odata.namespace("Container")
], TypeDefContainer);
exports.TypeDefContainer = TypeDefContainer;
let EnumContainer = class EnumContainer {
    constructor() {
        this['Server.Genre2'] = Genre;
    }
};
tslib_1.__decorate([
    index_1.Edm.Flags,
    index_1.Edm.Int64,
    index_1.Edm.URLSerialize((value) => `Server.Genre2'${value || 0}'`),
    index_1.Edm.Serialize(value => `Server.Genre2'${value || 0}'`)
], EnumContainer.prototype, "Server.Genre2", void 0);
EnumContainer = tslib_1.__decorate([
    index_1.odata.namespace("Container")
], EnumContainer);
exports.EnumContainer = EnumContainer;
let MetaController = 
// @odata.type(Meta)
class MetaController extends index_1.ODataController {
    findAll(__, ___, ____) {
        return [
            { MongoId: new mongodb_1.ObjectID('5968aad95eb7eb3a94a264f7'), b0: "basemeta", "@odata.type": BaseMeta },
            { Id: 1, p0: 1, p1: true, p9: 9, p10: 10, MongoId: new mongodb_1.ObjectID('5968aad95eb7eb3a94a264f6'), "@odata.type": Meta }
        ];
    }
    findOneByKeys(query, key1, key2, key3, key4) {
        let meta = new Meta();
        meta.Id = key1;
        meta.p9 = key3;
        meta.p10 = key2;
        meta.MongoId = new mongodb_1.ObjectID(key4);
        return meta;
    }
    insert(body) {
        return body;
    }
    getMedia(result) {
        let media = new Media();
        media.Id = 1;
        media.StringId = 'two';
        return [media];
    }
    getMediaByKey(key1, key2, result) {
        let media = new Media();
        media.Id = key1;
        media.StringId = key2;
        return media;
    }
    getMediaRef(link1, link2, k1, k2, k3, k4, result) {
        let meta = new Meta();
        meta.Id = k4;
        meta.p9 = k2;
        meta.p10 = k3;
        meta.MongoId = new mongodb_1.ObjectID(k1);
        return meta;
    }
    ControllerAction() {
        // console.log('ControllerAction');
    }
    ControllerFunction(str) {
        return str;
    }
    useOdataType(type) {
        return [
            { MongoId: new mongodb_1.ObjectID('5968aad95eb7eb3a94a264f7'), b0: "basemeta", "@odata.type": BaseMeta },
            { Id: 1, p0: 1, p1: true, p9: 9, p10: 10, MongoId: new mongodb_1.ObjectID('5968aad95eb7eb3a94a264f6'), "@odata.type": Meta },
            type.namespace
        ];
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], MetaController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.method("GET"),
    tslib_1.__param(0, index_1.odata.query), tslib_1.__param(1, index_1.odata.key('Id')), tslib_1.__param(2, index_1.odata.key('p10')), tslib_1.__param(3, index_1.odata.key('p9')), tslib_1.__param(4, index_1.odata.key('MongoId'))
], MetaController.prototype, "findOneByKeys", null);
tslib_1.__decorate([
    index_1.odata.POST,
    tslib_1.__param(0, index_1.odata.body)
], MetaController.prototype, "insert", null);
tslib_1.__decorate([
    index_1.odata.GET("MediaList"),
    tslib_1.__param(0, index_1.odata.result)
], MetaController.prototype, "getMedia", null);
tslib_1.__decorate([
    index_1.odata.GET("MediaList"),
    tslib_1.__param(0, index_1.odata.key('Id')), tslib_1.__param(1, index_1.odata.key('StringId')), tslib_1.__param(2, index_1.odata.result)
], MetaController.prototype, "getMediaByKey", null);
tslib_1.__decorate([
    index_1.odata.GET("MediaList").$ref,
    tslib_1.__param(0, index_1.odata.link('Id')), tslib_1.__param(1, index_1.odata.link('StringId')), tslib_1.__param(2, index_1.odata.key('MongoId')), tslib_1.__param(3, index_1.odata.key('p9')), tslib_1.__param(4, index_1.odata.key('p10')), tslib_1.__param(5, index_1.odata.key('Id')), tslib_1.__param(6, index_1.odata.result)
], MetaController.prototype, "getMediaRef", null);
tslib_1.__decorate([
    index_1.Edm.Action
], MetaController.prototype, "ControllerAction", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.Function(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String)
], MetaController.prototype, "ControllerFunction", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.EntityType(BaseMeta)),
    tslib_1.__param(0, index_1.odata.type)
], MetaController.prototype, "useOdataType", null);
MetaController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(BaseMeta)
    // @odata.type(Meta)
], MetaController);
exports.MetaController = MetaController;
let MediaController = class MediaController extends index_1.ODataController {
    findAll(__, ___, ____) {
        let media = new Media();
        media.Id = 1;
        media.StringId = 'two';
        return [media];
    }
    findOne(key1, key2) {
        let media = new Media();
        media.Id = key1;
        media.StringId = key2;
        return media;
    }
    ControllerAction(value) {
        value += 1;
    }
    ControllerFunction() {
        return 'ControllerFunction';
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], MediaController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.GET(),
    tslib_1.__param(0, index_1.odata.key('Id')), tslib_1.__param(1, index_1.odata.key('StringId'))
], MediaController.prototype, "findOne", null);
tslib_1.__decorate([
    index_1.Edm.Action,
    tslib_1.__param(0, index_1.Edm.Int32)
], MediaController.prototype, "ControllerAction", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.Function(),
    index_1.Edm.String
], MediaController.prototype, "ControllerFunction", null);
MediaController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(Media)
], MediaController);
exports.MediaController = MediaController;
let CompoundKeyController = class CompoundKeyController extends index_1.ODataController {
    findAll(__, ___, ____) {
        let ck = new CompoundKey();
        ck.bc0 = 1;
        ck.bc1 = 2;
        ck.bc2 = true;
        ck.bc3 = 4;
        ck.bc4 = '5';
        ck.bc5 = 6;
        return [ck];
    }
    findOneByKeys(key1, key2, key3, key4, key5, key6) {
        let ck = new CompoundKey();
        ck.bc0 = key1;
        ck.bc1 = key2;
        ck.bc2 = key3;
        ck.bc3 = key4;
        ck.bc4 = key5;
        ck.bc5 = key6;
        return ck;
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], CompoundKeyController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.method("GET"),
    tslib_1.__param(0, index_1.odata.key('bc0')), tslib_1.__param(1, index_1.odata.key('bc1')), tslib_1.__param(2, index_1.odata.key('bc2')), tslib_1.__param(3, index_1.odata.key('bc3')), tslib_1.__param(4, index_1.odata.key('bc4')), tslib_1.__param(5, index_1.odata.key('bc5'))
], CompoundKeyController.prototype, "findOneByKeys", null);
CompoundKeyController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(CompoundKey)
], CompoundKeyController);
exports.CompoundKeyController = CompoundKeyController;
let BaseTestEntityController = class BaseTestEntityController extends index_1.ODataController {
    findAll(__, ___, ____) {
        let te = new TestEntity();
        te.test = 10;
        return [te];
    }
    insert(body) {
        return body;
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], BaseTestEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.POST,
    tslib_1.__param(0, index_1.odata.body)
], BaseTestEntityController.prototype, "insert", null);
BaseTestEntityController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(TestEntity)
], BaseTestEntityController);
exports.BaseTestEntityController = BaseTestEntityController;
let TestEntityController = class TestEntityController extends BaseTestEntityController {
    findAll(__, ___, ____, $filter) {
        // console.log($filter, createFilter($filter));
        let te = new TestEntity();
        te.test = 1;
        return [te];
    }
    findOneByKeys(id) {
        let te = new TestEntity();
        te.test = id;
        return te;
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream), tslib_1.__param(3, index_1.odata.filter)
], TestEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    tslib_1.__param(0, index_1.odata.id)
], TestEntityController.prototype, "findOneByKeys", null);
TestEntityController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(TestEntity)
], TestEntityController);
exports.TestEntityController = TestEntityController;
TestEntityController.on('GET', 'findAll', 'findOneByKeys');
let EmptyEntityController = class EmptyEntityController extends index_1.ODataController {
    findAll(__, ___, ____) {
        let ee = new EmptyEntity();
        return [ee];
    }
    emptyEntityAction(value, type) {
        // console.log(type, value);
    }
    emptyEntityFunction(value, type) {
        return value;
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], EmptyEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.Edm.Action,
    tslib_1.__param(0, index_1.Edm.EnumType(Genre)), tslib_1.__param(1, index_1.odata.type)
], EmptyEntityController.prototype, "emptyEntityAction", null);
tslib_1.__decorate([
    index_1.Edm.Function(index_1.Edm.EnumType(Genre)),
    tslib_1.__param(0, index_1.Edm.EnumType(Genre)), tslib_1.__param(1, index_1.odata.type)
], EmptyEntityController.prototype, "emptyEntityFunction", null);
EmptyEntityController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(EmptyEntity)
], EmptyEntityController);
exports.EmptyEntityController = EmptyEntityController;
EmptyEntityController.on('GET', 'findAll');
let EmptyEntity2Controller = class EmptyEntity2Controller extends index_1.ODataController {
    findAll(__, ___, ____) {
        return [];
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], EmptyEntity2Controller.prototype, "findAll", null);
EmptyEntity2Controller = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(EmptyEntity2)
], EmptyEntity2Controller);
exports.EmptyEntity2Controller = EmptyEntity2Controller;
let EmptyEntity3Controller = class EmptyEntity3Controller extends index_1.ODataController {
    findAll(__, ___, ____) {
        return 'test';
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], EmptyEntity3Controller.prototype, "findAll", null);
EmptyEntity3Controller = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(EmptyEntity3)
], EmptyEntity3Controller);
exports.EmptyEntity3Controller = EmptyEntity3Controller;
let EmptyEntity4Controller = class EmptyEntity4Controller extends index_1.ODataController {
    findAll(__, ___, ____) {
        return '';
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], EmptyEntity4Controller.prototype, "findAll", null);
EmptyEntity4Controller = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(EmptyEntity4)
], EmptyEntity4Controller);
exports.EmptyEntity4Controller = EmptyEntity4Controller;
let EmptyEntity5Controller = class EmptyEntity5Controller extends index_1.ODataController {
    findAll(__, ___, ____) {
        return true;
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], EmptyEntity5Controller.prototype, "findAll", null);
EmptyEntity5Controller = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(EmptyEntity5)
], EmptyEntity5Controller);
exports.EmptyEntity5Controller = EmptyEntity5Controller;
let EmptyEntity6Controller = class EmptyEntity6Controller extends index_1.ODataController {
    findAll(__, ___, ____) {
        return 42;
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.context), tslib_1.__param(1, index_1.odata.result), tslib_1.__param(2, index_1.odata.stream)
], EmptyEntity6Controller.prototype, "findAll", null);
EmptyEntity6Controller = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(EmptyEntity6)
], EmptyEntity6Controller);
exports.EmptyEntity6Controller = EmptyEntity6Controller;
let SimpleEntityController = class SimpleEntityController extends index_1.ODataController {
    findAll(key) {
        let simple = new SimpleEntity();
        simple.MongoId = new mongodb_1.ObjectID('5968aad95eb7eb6b94a354g7');
        return [simple];
    }
    find(key) {
        let simple = new SimpleEntity();
        simple.MongoId = new mongodb_1.ObjectID(key);
        return simple;
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], SimpleEntityController.prototype, "findAll", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], SimpleEntityController.prototype, "find", null);
SimpleEntityController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(SimpleEntity)
], SimpleEntityController);
exports.SimpleEntityController = SimpleEntityController;
let HiddenEmptyController = class HiddenEmptyController extends index_1.ODataController {
};
HiddenEmptyController = tslib_1.__decorate([
    index_1.odata.namespace("Controller"),
    index_1.odata.type(HiddenEmptyEntity)
], HiddenEmptyController);
exports.HiddenEmptyController = HiddenEmptyController;
let SchemaJsonTestController = class SchemaJsonTestController extends index_1.ODataController {
};
SchemaJsonTestController = tslib_1.__decorate([
    index_1.odata.type(Index)
], SchemaJsonTestController);
let SchemaJsonServer = class SchemaJsonServer extends index_1.ODataServer {
};
SchemaJsonServer = tslib_1.__decorate([
    index_1.odata.namespace("SchemaJsonTest"),
    index_1.odata.controller(SchemaJsonTestController, true)
], SchemaJsonServer);
SchemaJsonServer.$metadata(schemaJson);
serverCache.push(SchemaJsonServer.create("/schemaJsonTest", 4004));
class DefineEntitiesServer extends index_1.ODataServer {
}
DefineEntitiesServer.$metadata(defineEntities);
serverCache.push(DefineEntitiesServer.create("/defineEntitiesTest", 4005));
let MetaTestServer = class MetaTestServer extends index_1.ODataServer {
    ActionImport() {
        // console.log('Server ActionImport')
    }
    ActionImportParams(value) {
        // console.log(`Server ActionImport ${value.length}`)
    }
    FunctionImport(message, value) {
        return `Server FunctionImport ${message}`;
    }
    FunctionImport2(message) {
        return `Server FunctionImport ${message}`;
    }
    FunctionImport3(message, value, geo) {
        return `Server FunctionImport ${message}`;
    }
    ObjId(v) {
        return v.toHexString();
    }
    ServerEnumTypeActionImport(value, type) {
        // console.log(type, value);
    }
    ServerEnumTypeFunctionImport(value, type) {
        // console.log(type, value);        
        return value;
    }
};
tslib_1.__decorate([
    index_1.odata.container("ActionImportContainer"),
    index_1.Edm.ActionImport
], MetaTestServer.prototype, "ActionImport", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    tslib_1.__param(0, index_1.Edm.Collection(index_1.Edm.Int32))
], MetaTestServer.prototype, "ActionImportParams", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.FunctionImport(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.Required),
    tslib_1.__param(1, index_1.Edm.Collection(index_1.Edm.Int32)),
    tslib_1.__param(1, index_1.Edm.Required),
    tslib_1.__param(1, index_1.Edm.Nullable)
], MetaTestServer.prototype, "FunctionImport", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.FunctionImport,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.Nullable),
    tslib_1.__param(0, index_1.Edm.Required)
], MetaTestServer.prototype, "FunctionImport2", null);
tslib_1.__decorate([
    index_1.odata.namespace("Functions"),
    index_1.Edm.FunctionImport(index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.String),
    tslib_1.__param(0, index_1.Edm.MaxLength(8)),
    tslib_1.__param(0, index_1.Edm.Unicode),
    tslib_1.__param(1, index_1.Edm.Decimal),
    tslib_1.__param(1, index_1.Edm.Required),
    tslib_1.__param(1, index_1.Edm.Nullable),
    tslib_1.__param(1, index_1.Edm.Precision(13)),
    tslib_1.__param(1, index_1.Edm.Scale(2)),
    tslib_1.__param(2, index_1.Edm.GeometryPoint),
    tslib_1.__param(2, index_1.Edm.SRID(1))
], MetaTestServer.prototype, "FunctionImport3", null);
tslib_1.__decorate([
    index_1.Edm.TypeDefinition(mongodb_1.ObjectID),
    index_1.Edm.FunctionImport,
    tslib_1.__param(0, index_1.Edm.TypeDefinition(mongodb_1.ObjectID))
], MetaTestServer.prototype, "ObjId", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    tslib_1.__param(0, index_1.Edm.EnumType(Genre)), tslib_1.__param(1, index_1.odata.type)
], MetaTestServer.prototype, "ServerEnumTypeActionImport", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport(index_1.Edm.EnumType(Genre)),
    tslib_1.__param(0, index_1.Edm.EnumType(Genre)), tslib_1.__param(1, index_1.odata.type)
], MetaTestServer.prototype, "ServerEnumTypeFunctionImport", null);
MetaTestServer = tslib_1.__decorate([
    index_1.Edm.Container(TestContainer),
    index_1.odata.namespace("Server"),
    index_1.odata.container("MetadataContainer"),
    index_1.odata.cors,
    index_1.odata.controller(MetaController, "Meta"),
    index_1.odata.controller(MediaController, "Media"),
    index_1.odata.controller(CompoundKeyController, 'CompoundKey'),
    index_1.odata.controller(TestEntityController, 'TestEntity'),
    index_1.odata.controller(EmptyEntityController, 'EmptyEntity'),
    index_1.odata.controller(EmptyEntity2Controller, 'EmptyEntity2'),
    index_1.odata.controller(EmptyEntity3Controller, 'EmptyEntity3'),
    index_1.odata.controller(SimpleEntityController, "SimpleEntity")
], MetaTestServer);
exports.MetaTestServer = MetaTestServer;
let TypeDefServer = class TypeDefServer extends index_1.ODataServer {
};
TypeDefServer = tslib_1.__decorate([
    index_1.Edm.Container(TypeDefContainer),
    index_1.odata.cors,
    index_1.odata.controller(SimpleEntityController, "SimpleEntity")
], TypeDefServer);
exports.TypeDefServer = TypeDefServer;
serverCache.push(TypeDefServer.create(4010));
let EnumServer = class EnumServer extends index_1.ODataServer {
};
EnumServer = tslib_1.__decorate([
    index_1.Edm.Container(EnumContainer),
    index_1.odata.cors,
    index_1.odata.controller(SimpleEntityController, "SimpleEntity")
], EnumServer);
exports.EnumServer = EnumServer;
serverCache.push(EnumServer.create(4011));
MetaTestServer.addController(HiddenEmptyController);
MetaTestServer.addController(EmptyEntity4Controller, true);
MetaTestServer.addController(EmptyEntity5Controller, true, EmptyEntity5);
MetaTestServer.addController(EmptyEntity6Controller, 'EmptyEntity6', EmptyEntity6);
MetaTestServer.create();
serverCache.push(MetaTestServer.create(4001));
serverCache.push(MetaTestServer.create('/test', 4002));
serverCache.push(index_1.createODataServer(MetaTestServer, "/test", 4003));
let Executor = class Executor {
    action() {
        return "foobar";
    }
    action2() {
        return "foobar";
    }
    func(complex) {
        return complex.c0;
    }
    func2(meta) {
        return meta.b0;
    }
};
tslib_1.__decorate([
    index_1.Edm.Action,
    index_1.Edm.String
], Executor.prototype, "action", null);
tslib_1.__decorate([
    index_1.Edm.Action(index_1.Edm.String)
], Executor.prototype, "action2", null);
tslib_1.__decorate([
    index_1.Edm.Function,
    index_1.Edm.ComplexType(Complex),
    tslib_1.__param(0, index_1.Edm.ComplexType(Complex))
], Executor.prototype, "func", null);
tslib_1.__decorate([
    index_1.Edm.Function,
    index_1.Edm.EntityType(Meta),
    tslib_1.__param(0, index_1.Edm.EntityType(Meta))
], Executor.prototype, "func2", null);
Executor = tslib_1.__decorate([
    index_1.Edm.OpenType
], Executor);
exports.Executor = Executor;
let ActionFunctionController = class ActionFunctionController extends index_1.ODataController {
    action() {
        return "foobar";
    }
    action2() {
        return "foobar";
    }
    func(complex) {
        return complex.c0;
    }
    func2(meta) {
        return meta.b0;
    }
};
tslib_1.__decorate([
    index_1.Edm.Action,
    index_1.Edm.String
], ActionFunctionController.prototype, "action", null);
tslib_1.__decorate([
    index_1.Edm.Action(index_1.Edm.String)
], ActionFunctionController.prototype, "action2", null);
tslib_1.__decorate([
    index_1.Edm.Function,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.ComplexType(Complex))
], ActionFunctionController.prototype, "func", null);
tslib_1.__decorate([
    index_1.Edm.Function,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.EntityType(Meta))
], ActionFunctionController.prototype, "func2", null);
ActionFunctionController = tslib_1.__decorate([
    index_1.odata.type(Executor)
], ActionFunctionController);
exports.ActionFunctionController = ActionFunctionController;
class FuncComplex {
}
exports.FuncComplex = FuncComplex;
class FuncComplex2 {
}
exports.FuncComplex2 = FuncComplex2;
class FuncEntity {
}
exports.FuncEntity = FuncEntity;
class FuncEntity2 {
}
exports.FuncEntity2 = FuncEntity2;
let ActionFunctionServer = class ActionFunctionServer extends index_1.ODataServer {
    action() {
        return "foobar";
    }
    action2() {
        return "foobar";
    }
    action3() {
        return FuncEnum.Default;
    }
    action4() {
        return new FuncComplex();
    }
    action5() {
        return new FuncEntity();
    }
    action6(enumValue) {
        return FuncEnum3[enumValue];
    }
    func(complex) {
        return complex.c0;
    }
    func2(meta) {
        return meta.b0;
    }
    func3() {
        return FuncEnum2.Default;
    }
    func4() {
        return new FuncComplex2();
    }
    func5() {
        return new FuncEntity2();
    }
    func6(enumValue) {
        return FuncEnum4[enumValue];
    }
    func7(foobar) {
        return foobar;
    }
};
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    index_1.Edm.String
], ActionFunctionServer.prototype, "action", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport(index_1.Edm.String)
], ActionFunctionServer.prototype, "action2", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    index_1.Edm.EnumType(FuncEnum)
], ActionFunctionServer.prototype, "action3", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    index_1.Edm.ComplexType(FuncComplex)
], ActionFunctionServer.prototype, "action4", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    index_1.Edm.EntityType(FuncEntity)
], ActionFunctionServer.prototype, "action5", null);
tslib_1.__decorate([
    index_1.Edm.ActionImport,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.EnumType(FuncEnum3))
], ActionFunctionServer.prototype, "action6", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.ComplexType(Complex))
], ActionFunctionServer.prototype, "func", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.EntityType(Meta))
], ActionFunctionServer.prototype, "func2", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.EnumType(FuncEnum2)
], ActionFunctionServer.prototype, "func3", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.ComplexType(FuncComplex2)
], ActionFunctionServer.prototype, "func4", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.EntityType(FuncEntity2)
], ActionFunctionServer.prototype, "func5", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.EnumType(FuncEnum4))
], ActionFunctionServer.prototype, "func6", null);
tslib_1.__decorate([
    index_1.Edm.FunctionImport,
    index_1.Edm.String,
    tslib_1.__param(0, index_1.Edm.TypeDefinition(Foobar))
], ActionFunctionServer.prototype, "func7", null);
ActionFunctionServer = tslib_1.__decorate([
    index_1.Edm.Container(TestContainer),
    index_1.odata.controller(ActionFunctionController, "Execute")
], ActionFunctionServer);
exports.ActionFunctionServer = ActionFunctionServer;
if (typeof describe == "function") {
    describe("Metadata test", () => {
        it("should return metadata xml", () => {
            expect(beautify(MetaTestServer.$metadata().document())).to.equal(beautify(fs.readFileSync(path.join(__dirname, "metadata", "$metadata.xml"), "utf8").replace(/" \/>/gi, "\"/>")));
        });
        it("should return SchemaJsonServer metadata xml", () => {
            expect(beautify(SchemaJsonServer.$metadata().document())).to.equal(beautify(fs.readFileSync(path.join(__dirname, "metadata", "$schemajson.xml"), "utf8").replace(/" \/>/gi, "\"/>")));
        });
        it("should return DefineEntitiesServer metadata xml", () => {
            expect(beautify(DefineEntitiesServer.$metadata().document())).to.equal(beautify(fs.readFileSync(path.join(__dirname, "metadata", "$defineentities.xml"), "utf8").replace(/" \/>/gi, "\"/>")));
        });
        it("should return TypeDefServer metadata xml", () => {
            expect(beautify(TypeDefServer.$metadata().document())).to.equal(beautify(fs.readFileSync(path.join(__dirname, "metadata", "$typedefserver.xml"), "utf8").replace(/" \/>/gi, "\"/>")));
        });
        it("should return EnumServer metadata xml", () => {
            expect(beautify(EnumServer.$metadata().document())).to.equal(beautify(fs.readFileSync(path.join(__dirname, "metadata", "$enumserver.xml"), "utf8").replace(/" \/>/gi, "\"/>")));
        });
        it("should return ActionFunctionServer metadata xml", () => {
            expect(beautify(ActionFunctionServer.$metadata().document())).to.equal(beautify(fs.readFileSync(path.join(__dirname, "metadata", "$actionfunction.xml"), "utf8").replace(/" \/>/gi, "\"/>")));
        });
    });
    describe("Root", () => {
        it("should return root result", () => {
            expect(MetaTestServer.document().document()).to.deep.equal({
                // "@odata.context": "http://localhost:3001/$metadata",
                "@odata.context": undefined,
                "value": [
                    {
                        "name": "SimpleEntity",
                        "kind": "EntitySet",
                        "url": "SimpleEntity"
                    },
                    {
                        "name": "EmptyEntity3",
                        "kind": "EntitySet",
                        "url": "EmptyEntity3"
                    },
                    {
                        "name": "EmptyEntity2",
                        "kind": "EntitySet",
                        "url": "EmptyEntity2"
                    },
                    {
                        "name": "EmptyEntity",
                        "kind": "EntitySet",
                        "url": "EmptyEntity"
                    },
                    {
                        "name": "TestEntity",
                        "kind": "EntitySet",
                        "url": "TestEntity"
                    },
                    {
                        "name": "CompoundKey",
                        "kind": "EntitySet",
                        "url": "CompoundKey"
                    },
                    {
                        "name": "Media",
                        "kind": "EntitySet",
                        "url": "Media"
                    },
                    {
                        "name": "Meta",
                        "kind": "EntitySet",
                        "url": "Meta"
                    },
                    {
                        "name": "EmptyEntity4",
                        "kind": "EntitySet",
                        "url": "EmptyEntity4"
                    },
                    {
                        "name": "EmptyEntity5",
                        "kind": "EntitySet",
                        "url": "EmptyEntity5"
                    },
                    {
                        "name": "EmptyEntity6",
                        "kind": "EntitySet",
                        "url": "EmptyEntity6"
                    }
                ]
            });
        });
    });
}
process.on("warning", warning => {
    console.log(warning.stack);
});
//# sourceMappingURL=metadata.spec.js.map