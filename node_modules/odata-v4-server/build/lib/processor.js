"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lexer_1 = require("odata-v4-parser/lib/lexer");
const url = require("url");
const qs = require("qs");
const util = require("util");
const deepmerge = require("deepmerge");
const stream_1 = require("stream");
const utils_1 = require("./utils");
const result_1 = require("./result");
const controller_1 = require("./controller");
const visitor_1 = require("./visitor");
const Edm = require("./edm");
const odata = require("./odata");
const error_1 = require("./error");
const getODataRoot = function (context) {
    return (context.protocol || "http") + "://" + (context.host || "localhost") + (context.base || "");
};
const createODataContext = function (context, entitySets, server, resourcePath, processor) {
    let odataContextBase = getODataRoot(context) + "/$metadata#";
    let odataContext = "";
    let prevResource = null;
    let prevType = server;
    let selectContext = "";
    if (processor.query && processor.query.$select) {
        selectContext = `(${processor.query.$select})`;
    }
    resourcePath.navigation.forEach((baseResource, i) => {
        let next = resourcePath.navigation[i + 1];
        let selectContextPart = (i == resourcePath.navigation.length - 1) ? selectContext : "";
        if (next && next.type == lexer_1.TokenType.RefExpression)
            return;
        if (baseResource.type == lexer_1.TokenType.QualifiedEntityTypeName || baseResource.type == lexer_1.TokenType.QualifiedComplexTypeName) {
            return odataContext += `/${baseResource.name}`;
        }
        if (baseResource.type == lexer_1.TokenType.EntitySetName) {
            prevResource = baseResource;
            prevType = baseResource.key ? entitySets[baseResource.name].prototype.elementType : entitySets[baseResource.name];
            odataContext += baseResource.name;
            odataContext += selectContextPart;
            if (baseResource.key && resourcePath.navigation.indexOf(baseResource) == resourcePath.navigation.length - 1)
                return odataContext += "/$entity";
            if (baseResource.key) {
                if (baseResource.key.length > 1) {
                    return odataContext += "(" + baseResource.key.map((key) => `${key.name}=${decodeURIComponent(key.raw)}`).join(",") + ")";
                }
                else {
                    return odataContext += "(" + decodeURIComponent(baseResource.key[0].raw) + ")";
                }
            }
        }
        else if (getResourcePartFunction(baseResource.type) && !(baseResource.name in expCalls)) {
            odataContext = "";
            if (prevResource) {
                let target = prevType || entitySets[prevResource.name];
                if (!target)
                    return;
                let propertyKey = baseResource.name.split(".").pop();
                let returnType = Edm.getReturnType(target, propertyKey, server.container);
                let returnTypeName = Edm.getReturnTypeName(target, propertyKey, server.container);
                if (typeof returnType == "function") {
                    prevType = returnType;
                    let ctrl = server.getController(returnType);
                    let entitySet = null;
                    for (let prop in entitySets) {
                        if (entitySets[prop] == ctrl) {
                            entitySet = prop;
                            break;
                        }
                    }
                    returnType = entitySet ? entitySet + (returnTypeName.indexOf("Collection") == 0 ? selectContextPart : selectContextPart + "/$entity") : returnTypeName;
                }
                else
                    returnType = returnTypeName;
                return odataContext += returnType;
            }
            else {
                let call = baseResource.name;
                let returnType = Edm.getReturnType(server, call, server.container);
                let returnTypeName = Edm.getReturnTypeName(server, call, server.container);
                if (typeof returnType == "function") {
                    prevType = returnType;
                    let ctrl = server.getController(returnType);
                    let entitySet = null;
                    for (let prop in entitySets) {
                        if (entitySets[prop] == ctrl) {
                            entitySet = prop;
                            break;
                        }
                    }
                    returnType = entitySet ? entitySet + (returnTypeName.indexOf("Collection") == 0 ? selectContextPart : selectContextPart + "/$entity") : returnTypeName;
                }
                else
                    returnType = returnTypeName;
                return odataContext += returnType;
            }
        }
        if (baseResource.type == lexer_1.TokenType.EntityCollectionNavigationProperty) {
            prevResource = baseResource;
            odataContext += "/" + baseResource.name;
            prevType = baseResource.key ? Edm.getType(prevType, baseResource.name, server.container) : server.getController(Edm.getType(prevType, baseResource.name, server.container));
            let ctrl = server.getController(prevType);
            let entitySet = null;
            for (let prop in entitySets) {
                if (entitySets[prop] == ctrl) {
                    entitySet = prop;
                    break;
                }
            }
            if (entitySet)
                odataContext = entitySet;
            odataContext += selectContextPart;
            if (baseResource.key && resourcePath.navigation.indexOf(baseResource) == resourcePath.navigation.length - 1)
                return odataContext += "/$entity";
            if (baseResource.key) {
                if (baseResource.key.length > 1) {
                    return odataContext += "(" + baseResource.key.map((key) => `${key.name}=${decodeURIComponent(key.raw)}`).join(",") + ")";
                }
                else {
                    return odataContext += "(" + decodeURIComponent(baseResource.key[0].raw) + ")";
                }
            }
            return odataContext;
        }
        if (baseResource.type == lexer_1.TokenType.EntityNavigationProperty) {
            prevResource = baseResource;
            prevType = Edm.getType(prevType, baseResource.name, server.container);
            let ctrl = server.getController(prevType);
            let entitySet = null;
            for (let prop in entitySets) {
                if (entitySets[prop] == ctrl) {
                    entitySet = prop;
                    break;
                }
            }
            return entitySet ? odataContext = entitySet + selectContextPart + "/$entity" : odataContext += "/" + baseResource.name;
        }
        if (baseResource.type == lexer_1.TokenType.PrimitiveProperty ||
            baseResource.type == lexer_1.TokenType.PrimitiveCollectionProperty ||
            baseResource.type == lexer_1.TokenType.ComplexProperty ||
            baseResource.type == lexer_1.TokenType.ComplexCollectionProperty) {
            prevType = Edm.getType(prevType, baseResource.name, server.container);
            return odataContext += "/" + baseResource.name;
        }
    });
    return odataContextBase + odataContext;
};
const fnCaller = function (fn, params) {
    params = params || {};
    let fnParams;
    fnParams = utils_1.getFunctionParameters(fn);
    for (var i = 0; i < fnParams.length; i++) {
        fnParams[i] = params[fnParams[i]];
    }
    return fn.apply(this, fnParams);
};
const ODataRequestMethods = ["get", "post", "put", "patch", "delete"];
const ODataRequestResult = {
    get: result_1.ODataResult.Ok,
    post: result_1.ODataResult.Created,
    put: (result, contentType) => {
        return (result ? result_1.ODataResult.Created : result_1.ODataResult.NoContent)(result, contentType);
    },
    patch: result_1.ODataResult.NoContent,
    delete: result_1.ODataResult.NoContent
};
const expCalls = {
    $count: function () {
        return this.body && this.body.value ? (this.body.value.length || 0) : 0;
    },
    $value: function (processor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let prevPart = processor.resourcePath.navigation[processor.resourcePath.navigation.length - 2];
                let fn = odata.findODataMethod(processor.ctrl, `${processor.method}/${prevPart.name}/$value`, prevPart.key || []);
                if (!fn && typeof this.elementType == "function" && Edm.isMediaEntity(this.elementType)) {
                    fn = odata.findODataMethod(processor.ctrl, `${processor.method}/$value`, prevPart.key || []);
                }
                if (fn) {
                    let ctrl = processor.ctrl;
                    let params = {};
                    if (prevPart.key)
                        prevPart.key.forEach((key) => params[key.name] = key.value);
                    let fnDesc = fn;
                    yield processor.__applyParams(ctrl, fnDesc.call, params, processor.url.query, this);
                    fn = ctrl.prototype[fnDesc.call];
                    if (fnDesc.key.length == 1 && prevPart.key.length == 1 && fnDesc.key[0].to != prevPart.key[0].name) {
                        params[fnDesc.key[0].to] = params[prevPart.key[0].name];
                        delete params[prevPart.key[0].name];
                    }
                    else {
                        for (let i = 0; i < fnDesc.key.length; i++) {
                            if (fnDesc.key[i].to != fnDesc.key[i].from) {
                                params[fnDesc.key[i].to] = params[fnDesc.key[i].from];
                                delete params[fnDesc.key[i].from];
                            }
                        }
                    }
                    let currentResult = fnCaller.call(ctrl, fn, params);
                    if (utils_1.isIterator(fn)) {
                        currentResult = run(currentResult, defaultHandlers);
                    }
                    if (!utils_1.isPromise(currentResult)) {
                        currentResult = Promise.resolve(currentResult);
                    }
                    if (prevPart.type == "PrimitiveProperty" || prevPart.type == "PrimitiveKeyProperty")
                        return currentResult.then(value => value.toString());
                    return currentResult;
                }
                else {
                    if (this.stream)
                        return Promise.resolve(this.stream);
                    if (this.body) {
                        let result = this.body.value || this.body;
                        for (let prop in result) {
                            if (prop.indexOf("@odata") >= 0)
                                delete result[prop];
                        }
                        result = result.value || result;
                        if (typeof result == "object" && (prevPart.type == "PrimitiveProperty" || prevPart.type == "PrimitiveKeyProperty"))
                            return Promise.resolve(result.toString());
                        return Promise.resolve(result);
                    }
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    },
    $ref: function (processor) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let prevPart = processor.resourcePath.navigation[processor.resourcePath.navigation.length - 2];
                let routePart = processor.resourcePath.navigation[processor.resourcePath.navigation.length - 3];
                let fn = odata.findODataMethod(processor.prevCtrl, processor.method + "/" + prevPart.name + "/$ref", routePart.key || []);
                if (processor.method == "get") {
                    return {
                        "@odata.context": `${getODataRoot(processor.context)}/$metadata#$ref`,
                        "@odata.id": `${this.body["@odata.id"]}/${prevPart.name}`
                    };
                }
                if (!fn)
                    throw new error_1.ResourceNotFoundError();
                let linkUrl = (processor.resourcePath.id || (processor.body || {})["@odata.id"] || "").replace(getODataRoot(processor.context), "");
                let linkAst, linkPath, linkPart;
                if (linkUrl) {
                    linkUrl = decodeURIComponent(linkUrl);
                    processor.emit("header", { "OData-EntityId": linkUrl });
                    linkAst = processor.serverType.parser.odataUri(linkUrl, { metadata: processor.serverType.$metadata().edmx });
                    linkPath = yield new visitor_1.ResourcePathVisitor(processor.serverType, processor.entitySets).Visit(linkAst);
                    linkPart = linkPath.navigation[linkPath.navigation.length - 1];
                }
                else
                    linkPart = prevPart;
                let ctrl = processor.prevCtrl;
                let params = {};
                if (routePart.key)
                    routePart.key.forEach((key) => params[key.name] = key.value);
                let fnDesc = fn;
                yield processor.__applyParams(ctrl, fnDesc.call, params, processor.url.query, this);
                fn = ctrl.prototype[fnDesc.call];
                if (fnDesc.key.length == 1 && routePart.key.length == 1 && fnDesc.key[0].to != routePart.key[0].name) {
                    params[fnDesc.key[0].to] = params[routePart.key[0].name];
                    delete params[routePart.key[0].name];
                }
                else {
                    for (let i = 0; i < fnDesc.key.length; i++) {
                        if (fnDesc.key[i].to != fnDesc.key[i].from) {
                            params[fnDesc.key[i].to] = params[fnDesc.key[i].from];
                            delete params[fnDesc.key[i].from];
                        }
                    }
                }
                let linkParams = {};
                if (linkPart.key)
                    linkPart.key.forEach((key) => linkParams[key.name] = key.value);
                if (fnDesc.link.length == 1 && linkPart.key.length == 1 && fnDesc.link[0].to != linkPart.key[0].name) {
                    params[fnDesc.link[0].to] = linkParams[linkPart.key[0].name];
                }
                else {
                    for (let i = 0; i < fnDesc.link.length; i++) {
                        params[fnDesc.link[i].to] = linkParams[fnDesc.link[i].from];
                    }
                }
                let currentResult = fnCaller.call(ctrl, fn, params);
                if (utils_1.isIterator(fn)) {
                    currentResult = run(currentResult, defaultHandlers);
                }
                if (!utils_1.isPromise(currentResult)) {
                    currentResult = Promise.resolve(currentResult);
                }
                return currentResult;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
};
const getResourcePartFunction = (type) => {
    switch (type) {
        case "PrimitiveFunctionImportCall":
        case "PrimitiveCollectionFunctionImportCall":
        case "ComplexFunctionImportCall":
        case "ComplexCollectionFunctionImportCall":
        case "EntityFunctionImportCall":
        case "EntityCollectionFunctionImportCall":
        case "ActionImportCall":
        case "ActionImport":
            return "__actionOrFunctionImport";
        case "BoundPrimitiveFunctionCall":
        case "BoundPrimitiveCollectionFunctionCall":
        case "BoundComplexFunctionCall":
        case "BoundComplexCollectionFunctionCall":
        case "BoundEntityFunctionCall":
        case "BoundEntityCollectionFunctionCall":
        case "BoundActionCall":
        case "BoundAction":
        case "CountExpression":
        case "ValueExpression":
        case "RefExpression":
            return "__actionOrFunction";
        default:
            return null;
    }
};
const jsPrimitiveTypes = [
    Object,
    String,
    Boolean,
    Number,
    Date
];
const writeMethods = [
    "delete",
    "post",
    "put",
    "patch"
];
var ODataGeneratorHandlers;
(function (ODataGeneratorHandlers) {
    function PromiseHandler(request, next) {
        if (utils_1.isPromise(request)) {
            return request.then(next);
        }
    }
    ODataGeneratorHandlers.PromiseHandler = PromiseHandler;
    function StreamHandler(request, next) {
        if (utils_1.isStream(request)) {
            return new Promise((resolve, reject) => {
                request.on("end", resolve);
                request.on("error", reject);
            }).then(next);
        }
    }
    ODataGeneratorHandlers.StreamHandler = StreamHandler;
    function GeneratorHandler(request, next) {
        if (utils_1.isIterator(request)) {
            return run(request(), defaultHandlers).then(next);
        }
    }
    ODataGeneratorHandlers.GeneratorHandler = GeneratorHandler;
})(ODataGeneratorHandlers = exports.ODataGeneratorHandlers || (exports.ODataGeneratorHandlers = {}));
const defaultHandlers = [
    ODataGeneratorHandlers.GeneratorHandler,
    ODataGeneratorHandlers.PromiseHandler,
    ODataGeneratorHandlers.StreamHandler
];
function run(iterator, handlers) {
    function id(x) { return x; }
    function iterate(value) {
        let next = iterator.next(value);
        let request = next.value;
        let nextAction = next.done ? id : iterate;
        for (let handler of handlers) {
            let action = handler(request, nextAction);
            if (typeof action != "undefined")
                return action;
        }
        return nextAction(request);
    }
    return iterate();
}
class ODataStreamWrapper extends stream_1.Transform {
    constructor() {
        super({
            objectMode: true
        });
        this.buffer = [];
    }
    _transform(chunk, _, done) {
        this.buffer.push(chunk);
        if (typeof done == "function")
            done();
    }
    _flush(done) {
        if (typeof done == "function")
            done();
    }
    toPromise() {
        return new Promise((resolve, reject) => {
            this.on("finish", () => {
                resolve(this.buffer);
            });
            this.on("error", reject);
        });
    }
}
class StreamWrapper {
    constructor(value) {
        this.stream = value;
    }
}
var ODataMetadataType;
(function (ODataMetadataType) {
    ODataMetadataType[ODataMetadataType["minimal"] = 0] = "minimal";
    ODataMetadataType[ODataMetadataType["full"] = 1] = "full";
    ODataMetadataType[ODataMetadataType["none"] = 2] = "none";
})(ODataMetadataType = exports.ODataMetadataType || (exports.ODataMetadataType = {}));
class ODataProcessor extends stream_1.Transform {
    constructor(context, server, options) {
        super({
            objectMode: true
        });
        this.streamStart = false;
        this.streamEnabled = false;
        this.streamObject = false;
        this.streamEnd = false;
        this.resultCount = 0;
        this.context = context;
        this.serverType = server;
        this.options = options || {};
        let method = this.method = context.method.toLowerCase();
        if (ODataRequestMethods.indexOf(method) < 0)
            throw new error_1.MethodNotAllowedError();
        context.url = decodeURIComponent(context.url);
        this.url = url.parse(context.url);
        this.query = qs.parse(this.url.query);
        let ast = this.serverType.parser.odataUri(context.url, { metadata: this.serverType.$metadata().edmx });
        if (this.serverType.validator) {
            this.serverType.validator(ast);
        }
        let entitySets = this.entitySets = odata.getPublicControllers(this.serverType);
        this.workflow = [(body) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let resourcePath = this.resourcePath = yield new visitor_1.ResourcePathVisitor(this.serverType, this.entitySets).Visit(ast);
                this.odataContext = createODataContext(context, entitySets, server, resourcePath, this);
                if (resourcePath.navigation.length == 0)
                    throw new error_1.ResourceNotFoundError();
                this.workflow.push(...resourcePath.navigation.map((part, i) => {
                    let next = resourcePath.navigation[i + 1];
                    if (next && next.type == lexer_1.TokenType.RefExpression)
                        return null;
                    let fn = getResourcePartFunction(part.type) || ("__" + part.type);
                    switch (fn) {
                        case "__actionOrFunction":
                            return this.__actionOrFunction.call(this, part);
                        case "__actionOrFunctionImport":
                            return this.__actionOrFunctionImport.call(this, part);
                        case "__QualifiedEntityTypeName":
                        case "__QualifiedComplexTypeName":
                            return this.__qualifiedTypeName.call(this, part);
                        case "__PrimitiveKeyProperty":
                        case "__PrimitiveCollectionProperty":
                        case "__ComplexProperty":
                        case "__ComplexCollectionProperty":
                        case "__PrimitiveProperty":
                            return this.__PrimitiveProperty.call(this, part);
                        case "__EntitySetName":
                            return this.__EntitySetName.call(this, part);
                        case "__EntityCollectionNavigationProperty":
                            return this.__EntityCollectionNavigationProperty.call(this, part);
                        case "__EntityNavigationProperty":
                            return this.__EntityNavigationProperty.call(this, part);
                        default:
                            return null;
                    }
                }).filter(it => !!it));
                this.workflow.push((result) => {
                    if (result && result.statusCode && result.statusCode == 201) {
                        this.emit("header", {
                            "Location": result.body["@odata.id"]
                        });
                    }
                    return Promise.resolve(result);
                });
                return body;
            })];
    }
    _transform(chunk, _, done) {
        if (this.streamEnabled) {
            if (!(chunk instanceof Buffer)) {
                this.streamObject = true;
                if (!this.streamStart) {
                    if (!this.options.objectMode) {
                        this.push("{");
                        if (this.options.metadata != ODataMetadataType.none) {
                            this.push(`"@odata.context":"${this.odataContext}",`);
                        }
                        this.push('"value":[');
                    }
                }
                else if (!this.options.objectMode && this.resultCount > 0)
                    this.push(',');
                try {
                    this.streamStart = true;
                    if (chunk instanceof Object) {
                        if (chunk["@odata.count"] || chunk.inlinecount) {
                            this.streamInlineCount = chunk["@odata.count"] || chunk.inlinecount;
                            if (Object.keys(chunk).length == 1) {
                                return typeof done == "function" ? done() : null;
                            }
                            else {
                                delete chunk["@odata.count"];
                                delete chunk.inlinecount;
                            }
                        }
                        let entity = {};
                        let defer;
                        if (this.ctrl)
                            defer = this.__appendLinks(this.ctrl, this.elementType || this.ctrl.prototype.elementType, entity, chunk);
                        let deferConvert = this.__convertEntity(entity, chunk, this.elementType || this.ctrl.prototype.elementType, this.resourcePath.includes, this.resourcePath.select);
                        defer = defer ? defer.then(_ => deferConvert) : deferConvert;
                        defer.then(() => {
                            chunk = this.options.objectMode ? entity : JSON.stringify(entity);
                            this.push(chunk);
                            this.resultCount++;
                            if (typeof done == "function")
                                done();
                        }, (err) => {
                            console.log(err);
                            if (typeof done == "function")
                                done(err);
                        });
                    }
                    else {
                        this.push(JSON.stringify(chunk));
                        this.resultCount++;
                        if (typeof done == "function")
                            done();
                    }
                }
                catch (err) {
                    console.log(err);
                    if (typeof done == "function")
                        done(err);
                }
            }
            else {
                this.streamStart = true;
                this.push(chunk);
                this.resultCount++;
                if (typeof done == "function")
                    done();
            }
        }
        else {
            this.resultCount++;
            if (typeof done == "function")
                done();
        }
    }
    _flush(done) {
        if (this.streamEnabled && this.streamObject) {
            if (this.options.objectMode) {
                let flushObject = {
                    value: [],
                    elementType: this.elementType || this.ctrl.prototype.elementType
                };
                if (this.options.metadata != ODataMetadataType.none) {
                    flushObject["@odata.context"] = this.odataContext;
                }
                if (this.streamStart && typeof this.streamInlineCount == "number") {
                    flushObject["@odata.count"] = this.streamInlineCount;
                }
                this.push(flushObject);
            }
            else {
                if (this.streamStart) {
                    if (typeof this.streamInlineCount == "number") {
                        this.push(`],"@odata.count":${this.streamInlineCount}}`);
                    }
                    else
                        this.push("]}");
                }
                else {
                    if (this.options.metadata == ODataMetadataType.none) {
                        this.push('{"value":[]}');
                    }
                    else {
                        this.push(`{"@odata.context":"${this.odataContext}","value":[]}`);
                    }
                }
            }
        }
        else if (this.streamEnabled && !this.streamStart) {
            if (this.options.metadata == ODataMetadataType.none) {
                this.push('{"value":[]}');
            }
            else {
                this.push(`{"@odata.context":"${this.odataContext}","value":[]}`);
            }
        }
        this.streamEnd = true;
        if (typeof done == "function")
            done();
    }
    __qualifiedTypeName(part) {
        return (result) => {
            result.elementType = part.node[visitor_1.ODATA_TYPE];
            return result;
        };
    }
    __EntityCollectionNavigationProperty(part) {
        return (result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let resultType = result.elementType;
                let elementType = Edm.getType(resultType, part.name, this.serverType.container);
                let partIndex = this.resourcePath.navigation.indexOf(part);
                let method = writeMethods.indexOf(this.method) >= 0 && partIndex < this.resourcePath.navigation.length - 1
                    ? "get"
                    : this.method;
                let fn = odata.findODataMethod(this.ctrl, `${method}/${part.name}`, part.key);
                if (fn) {
                    let ctrl = this.ctrl;
                    let fnDesc = fn;
                    let params = {};
                    if (part.key)
                        part.key.forEach((key) => params[key.name] = key.value);
                    yield this.__applyParams(ctrl, fnDesc.call, params, this.url.query, result);
                    fn = ctrl.prototype[fnDesc.call];
                    if (fnDesc.key.length == 1 && part.key.length == 1 && fnDesc.key[0].to != part.key[0].name) {
                        params[fnDesc.key[0].to] = params[part.key[0].name];
                        delete params[part.key[0].name];
                    }
                    else {
                        for (let i = 0; i < fnDesc.key.length; i++) {
                            if (fnDesc.key[i].to != fnDesc.key[i].from) {
                                params[fnDesc.key[i].to] = params[fnDesc.key[i].from];
                                delete params[fnDesc.key[i].from];
                            }
                        }
                    }
                    if (part.key)
                        part.key.forEach((key) => params[key.name] = key.value);
                    this.elementType = elementType;
                    return this.__read(ctrl, part, params, result, fn, elementType).then((result) => {
                        this.ctrl = this.serverType.getController(elementType);
                        return result;
                    });
                }
                else {
                    let ctrl = this.serverType.getController(elementType);
                    let foreignKeys = Edm.getForeignKeys(resultType, part.name);
                    let typeKeys = Edm.getKeyProperties(resultType);
                    result.foreignKeys = {};
                    let foreignFilter = (yield Promise.all(foreignKeys.map((key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        result.foreignKeys[key] = result.body[typeKeys[0]];
                        return `${key} eq ${yield Edm.escape(result.body[typeKeys[0]], Edm.getTypeName(elementType, key, this.serverType.container))}`;
                    })))).join(" and ");
                    let params = {};
                    if (part.key)
                        part.key.forEach((key) => params[key.name] = key.value);
                    return this.__read(ctrl, part, params, result, foreignFilter);
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    __EntityNavigationProperty(part) {
        return (result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let resultType = result.elementType;
                let elementType = Edm.getType(resultType, part.name, this.serverType.container);
                let partIndex = this.resourcePath.navigation.indexOf(part);
                let method = writeMethods.indexOf(this.method) >= 0 && partIndex < this.resourcePath.navigation.length - 1
                    ? "get"
                    : this.method;
                let fn = odata.findODataMethod(this.ctrl, `${method}/${part.name}`, part.key);
                if (fn) {
                    let ctrl = this.ctrl;
                    let fnDesc = fn;
                    let params = {};
                    if (part.key)
                        part.key.forEach((key) => params[key.name] = key.value);
                    yield this.__applyParams(ctrl, fnDesc.call, params, this.url.query, result);
                    fn = ctrl.prototype[fnDesc.call];
                    if (fnDesc.key.length == 1 && part.key.length == 1 && fnDesc.key[0].to != part.key[0].name) {
                        params[fnDesc.key[0].to] = params[part.key[0].name];
                        delete params[part.key[0].name];
                    }
                    else {
                        for (let i = 0; i < fnDesc.key.length; i++) {
                            if (fnDesc.key[i].to != fnDesc.key[i].from) {
                                params[fnDesc.key[i].to] = params[fnDesc.key[i].from];
                                delete params[fnDesc.key[i].from];
                            }
                        }
                    }
                    this.elementType = elementType;
                    return this.__read(ctrl, part, params, result, fn, elementType).then((result) => {
                        this.ctrl = this.serverType.getController(elementType);
                        return result;
                    });
                }
                else {
                    let ctrl = this.serverType.getController(elementType);
                    let foreignKeys = Edm.getForeignKeys(resultType, part.name);
                    result.foreignKeys = {};
                    part.key = foreignKeys.map((key) => {
                        result.foreignKeys[key] = result.body[key];
                        return {
                            name: key,
                            value: result.body[key]
                        };
                    });
                    let params = {};
                    if (part.key)
                        part.key.forEach((key) => params[key.name] = key.value);
                    return this.__read(ctrl, part, params, result);
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    __PrimitiveProperty(part) {
        return (result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    this.__enableStreaming(part);
                    let currentResult;
                    let prevPart = this.resourcePath.navigation[this.resourcePath.navigation.indexOf(part) - 1];
                    let fn = odata.findODataMethod(this.ctrl, `${this.method}/${part.name}`, prevPart.key || []) ||
                        odata.findODataMethod(this.ctrl, `${this.method}/${part.name}/$value`, prevPart.key || []);
                    if (!fn && this.method != "get") {
                        fn = this.method == "delete"
                            ? odata.findODataMethod(this.ctrl, "patch", prevPart.key || [])
                            : odata.findODataMethod(this.ctrl, `${this.method}`, prevPart.key || []);
                        if (fn) {
                            let body = this.body;
                            if (Edm.getTypeName(result.elementType, part.name, this.serverType.container) != "Edm.Stream")
                                body = body.body || body;
                            this.body = {};
                            this.body[part.name] = this.method == "delete" ? null : body.value || body;
                        }
                    }
                    if (fn) {
                        let ctrl = this.prevCtrl;
                        let params = {};
                        if (prevPart.key)
                            prevPart.key.forEach((key) => params[key.name] = key.value);
                        let fnDesc = fn;
                        yield this.__applyParams(ctrl, fnDesc.call, params, this.url.query, result);
                        fn = ctrl.prototype[fnDesc.call];
                        if (fnDesc.key.length == 1 && prevPart.key.length == 1 && fnDesc.key[0].to != prevPart.key[0].name) {
                            params[fnDesc.key[0].to] = params[prevPart.key[0].name];
                            delete params[prevPart.key[0].name];
                        }
                        else {
                            for (let i = 0; i < fnDesc.key.length; i++) {
                                if (fnDesc.key[i].to != fnDesc.key[i].from) {
                                    params[fnDesc.key[i].to] = params[fnDesc.key[i].from];
                                    delete params[fnDesc.key[i].from];
                                }
                            }
                        }
                        this.elementType = Edm.getType(result.elementType, part.name, this.serverType.container) || Object;
                        if (typeof this.elementType == "string")
                            this.elementType = Object;
                        currentResult = fnCaller.call(ctrl, fn, params);
                        if (utils_1.isIterator(fn)) {
                            currentResult = run(currentResult, defaultHandlers);
                        }
                        if (!utils_1.isPromise(currentResult)) {
                            currentResult = Promise.resolve(currentResult);
                        }
                    }
                    else {
                        let value = result.body[part.name];
                        if (value instanceof StreamWrapper) {
                            value = value.stream;
                        }
                        currentResult = Promise.resolve(value);
                    }
                    if (this.method == "get") {
                        currentResult.then((value) => {
                            try {
                                result.body = {
                                    "@odata.context": this.options.metadata != ODataMetadataType.none ? result.body["@odata.context"] : undefined,
                                    value: value
                                };
                                let elementType = result.elementType;
                                //if (value instanceof Object)
                                result.elementType = Edm.isEnumType(result.elementType, part.name)
                                    ? Edm.getTypeName(result.elementType, part.name, this.serverType.container)
                                    : Edm.getType(result.elementType, part.name, this.serverType.container) || Object;
                                if (value && (utils_1.isStream(value) || utils_1.isStream(value.stream))) {
                                    this.emit("header", { "Content-Type": Edm.getContentType(elementType.prototype, part.name) || value.contentType || "application/octet-stream" });
                                    if (value.stream)
                                        value = value.stream;
                                    value.pipe(this);
                                    value.on("end", resolve);
                                    value.on("error", reject);
                                }
                                else {
                                    if (this.streamEnabled && this.streamStart)
                                        delete result.body;
                                    if (result.stream)
                                        delete result.stream;
                                    resolve(result);
                                }
                            }
                            catch (err) {
                                console.log(err);
                                reject(err);
                            }
                        }, reject);
                    }
                    else {
                        result_1.ODataResult.NoContent(currentResult).then(resolve, reject);
                    }
                }));
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    __read(ctrl, part, params, data, filter, elementType, include, select) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                select = select || this.resourcePath.select;
                if (this.ctrl)
                    this.prevCtrl = this.ctrl;
                else
                    this.prevCtrl = ctrl;
                this.ctrl = ctrl;
                let method = writeMethods.indexOf(this.method) >= 0 &&
                    this.resourcePath.navigation.indexOf(part) < this.resourcePath.navigation.length - 1
                    ? "get"
                    : this.method;
                this.instance = new ctrl();
                let fn;
                if (typeof filter == "string" || !filter) {
                    fn = odata.findODataMethod(ctrl, method, part.key);
                    if (!fn)
                        return reject(new error_1.ResourceNotFoundError());
                    let queryString = filter ? `$filter=${filter}` : (include || this.url).query;
                    if (include && filter && include.query && !include.query.$filter) {
                        include.query.$filter = filter;
                        queryString = Object.keys(include.query).map(p => {
                            return `${p}=${include.query[p]}`;
                        }).join("&");
                    }
                    else if ((include && filter && include.query) || (!include && this.resourcePath.navigation.indexOf(part) == this.resourcePath.navigation.length - 1)) {
                        queryString = Object.keys((include || this).query).map(p => {
                            if (p == "$filter" && filter) {
                                (include || this).query[p] = `(${(include || this).query[p]}) and (${filter})`;
                            }
                            return `${p}=${(include || this).query[p]}`;
                        }).join("&") || queryString;
                    }
                    if (queryString && typeof queryString == "object") {
                        queryString = Object.keys(queryString).map(p => {
                            return `${p}=${queryString[p]}`;
                        }).join("&");
                    }
                    if (typeof fn != "function") {
                        let fnDesc = fn;
                        fn = ctrl.prototype[fnDesc.call];
                        if (fnDesc.key.length == 1 && part.key.length == 1 && fnDesc.key[0].to != part.key[0].name) {
                            params[fnDesc.key[0].to] = params[part.key[0].name];
                            delete params[part.key[0].name];
                        }
                        else {
                            for (let i = 0; i < fnDesc.key.length; i++) {
                                if (fnDesc.key[i].to != fnDesc.key[i].from) {
                                    params[fnDesc.key[i].to] = params[fnDesc.key[i].from];
                                    delete params[fnDesc.key[i].from];
                                }
                            }
                        }
                        yield this.__applyParams(ctrl, fnDesc.call, params, queryString, undefined, include);
                    }
                    else
                        yield this.__applyParams(ctrl, method, params, queryString, undefined, include);
                }
                else
                    fn = filter;
                if (!include)
                    this.__enableStreaming(part);
                let currentResult;
                switch (method) {
                    case "get":
                    case "delete":
                        currentResult = fnCaller.call(ctrl, fn, params);
                        break;
                    case "post":
                        this.odataContext += "/$entity";
                    case "put":
                    case "patch":
                        let body = data ? Object.assign(this.body || {}, data.foreignKeys) : this.body;
                        let bodyParam = odata.getBodyParameter(ctrl, fn.name);
                        let typeParam = odata.getTypeParameter(ctrl, fn.name);
                        if (typeParam) {
                            params[typeParam] = (body["@odata.type"] || (`${ctrl.prototype.elementType.namespace}.${ctrl.prototype.elementType.name}`)).replace(/^#/, "");
                        }
                        if (bodyParam) {
                            yield this.__deserialize(body, ctrl.prototype.elementType);
                            this.__stripOData(body);
                            params[bodyParam] = body;
                        }
                        if (!part.key) {
                            let properties = Edm.getProperties((elementType || ctrl.prototype.elementType).prototype);
                            properties.forEach((prop) => {
                                if (Edm.isKey(elementType || ctrl.prototype.elementType, prop)) {
                                    params[prop] = (this.body || {})[prop] || ((data || {}).body || {})[prop];
                                }
                            });
                        }
                        currentResult = fnCaller.call(ctrl, fn, params);
                        break;
                }
                if (utils_1.isIterator(fn)) {
                    currentResult = run(currentResult, defaultHandlers);
                }
                if (!utils_1.isPromise(currentResult)) {
                    currentResult = Promise.resolve(currentResult);
                }
                return currentResult.then((result) => {
                    if (utils_1.isStream(result) && include) {
                        include.streamPromise.then((result) => {
                            ODataRequestResult[method](result).then((result) => {
                                if (elementType)
                                    result.elementType = elementType;
                                return this.__appendODataContext(result, elementType || this.ctrl.prototype.elementType, (include || this.resourcePath).includes, select).then(() => {
                                    resolve(result);
                                }, reject);
                            }, reject);
                        }, reject);
                    }
                    else if (utils_1.isStream(result) && (!part.key || !Edm.isMediaEntity(elementType || this.ctrl.prototype.elementType))) {
                        result.on("end", () => resolve(ODataRequestResult[method]()));
                        result.on("error", reject);
                    }
                    else if (!(result instanceof result_1.ODataResult)) {
                        return ODataRequestResult[method](result).then((result) => {
                            if (!this.streamStart &&
                                writeMethods.indexOf(this.method) < 0 && !result.body)
                                return reject(new error_1.ResourceNotFoundError());
                            try {
                                if (elementType)
                                    result.elementType = elementType;
                                this.__appendODataContext(result, elementType || this.ctrl.prototype.elementType, (include || this.resourcePath).includes, select).then(() => {
                                    if (!this.streamEnd && this.streamEnabled && this.streamStart)
                                        this.on("end", () => resolve(result));
                                    else
                                        resolve(result);
                                }, reject);
                            }
                            catch (err) {
                                reject(err);
                            }
                        }, reject);
                    }
                    else {
                        try {
                            if (elementType)
                                result.elementType = elementType;
                            this.__appendODataContext(result, elementType || this.ctrl.prototype.elementType, (include || this.resourcePath).includes, select).then(() => {
                                if (!this.streamEnd && this.streamEnabled && this.streamStart)
                                    this.on("end", () => resolve(result));
                                else
                                    resolve(result);
                            }, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }
                }, reject);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    __deserialize(obj, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let prop in obj) {
                try {
                    let propType = Edm.getType(type, prop, this.serverType.container);
                    let fn = Edm.getDeserializer(type, prop, propType, this.serverType.container);
                    if (typeof fn == "function") {
                        obj[prop] = yield fn(obj[prop], prop, propType);
                    }
                    else if (typeof obj[prop] == "object") {
                        yield this.__deserialize(obj[prop], propType);
                    }
                }
                catch (err) { }
            }
        });
    }
    __stripOData(obj) {
        for (let prop in obj) {
            if (prop.indexOf("@odata") >= 0)
                delete obj[prop];
            if (typeof obj[prop] == "object")
                this.__stripOData(obj[prop]);
        }
    }
    __EntitySetName(part) {
        let ctrl = this.entitySets[part.name];
        let params = {};
        if (part.key)
            part.key.forEach((key) => params[key.name] = key.value);
        return (data) => {
            return this.__read(ctrl, part, params, data);
        };
    }
    __actionOrFunctionImport(part) {
        let fn = this.serverType.prototype[part.name];
        return (data) => {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    this.__enableStreaming(part);
                    let returnType = Edm.getReturnType(this.serverType, part.name, this.serverType.container);
                    let isAction = false;
                    let schemas = this.serverType.$metadata().edmx.dataServices.schemas;
                    if (Edm.isActionImport(this.serverType, part.name) ||
                        schemas.some(schema => schema.entityContainer.some(container => container.actionImports.some(actionImport => actionImport.name == part.name)))) {
                        isAction = true;
                        part.params = Object.assign(part.params || {}, this.body || {});
                    }
                    yield this.__applyParams(this.serverType, part.name, part.params);
                    let result = fnCaller.call(data, fn, part.params);
                    if (utils_1.isIterator(fn)) {
                        result = run(result, defaultHandlers);
                    }
                    if (isAction && !returnType) {
                        return result_1.ODataResult.NoContent(result).then(resolve, reject);
                    }
                    else {
                        return result_1.ODataResult.Ok(result).then((result) => {
                            if (utils_1.isStream(result.body)) {
                                result.body.on("end", resolve);
                                result.body.on("error", reject);
                            }
                            else {
                                try {
                                    this.__appendODataContext(result, returnType, this.resourcePath.includes, this.resourcePath.select).then(() => {
                                        resolve(result);
                                    });
                                }
                                catch (err) {
                                    reject(err);
                                }
                            }
                        }, reject);
                    }
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }));
        };
    }
    __actionOrFunction(part) {
        return (result) => {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    this.__enableStreaming(part);
                    if (!result)
                        return resolve();
                    let boundOpName = part.name.split(".").pop();
                    let elementType = result.elementType;
                    let entityBoundOp = typeof elementType == "function" ? elementType.prototype[boundOpName] : null;
                    let ctrlBoundOp = this.instance[boundOpName];
                    let expOp = expCalls[boundOpName];
                    let scope = this.serverType;
                    let returnType = Object;
                    let isAction = false;
                    let schemas = this.serverType.$metadata().edmx.dataServices.schemas;
                    if (entityBoundOp) {
                        scope = result.body;
                        returnType = Edm.getReturnType(elementType, boundOpName, this.serverType.container);
                        if (Edm.isAction(elementType, boundOpName) ||
                            schemas.some(schema => schema.actions.some(action => action.name == boundOpName && action.isBound && action.parameters.some(parameter => parameter.name == "bindingParameter" && parameter.type == (elementType.namespace + "." + elementType.name))))) {
                            isAction = true;
                            part.params = Object.assign(part.params || {}, this.body || {});
                        }
                        yield this.__applyParams(elementType, boundOpName, part.params, null, result);
                    }
                    else if (ctrlBoundOp) {
                        scope = this.instance;
                        returnType = Edm.getReturnType(this.ctrl, boundOpName, this.serverType.container);
                        if (Edm.isAction(elementType, boundOpName) ||
                            schemas.some(schema => schema.actions.some(action => action.name == boundOpName && action.isBound && action.parameters.some(parameter => parameter.name == "bindingParameter" && parameter.type == "Collection(" + (elementType.namespace + "." + elementType.name) + ")")))) {
                            isAction = true;
                            part.params = Object.assign(part.params || {}, this.body || {});
                        }
                        yield this.__applyParams(this.ctrl, boundOpName, part.params, null, result);
                    }
                    else if (expOp) {
                        scope = result;
                        part.params["processor"] = this;
                    }
                    let boundOp = entityBoundOp || ctrlBoundOp || expOp;
                    let opResult = fnCaller.call(scope, boundOp, part.params);
                    if (utils_1.isIterator(boundOp)) {
                        opResult = run(opResult, defaultHandlers);
                    }
                    if (boundOp == expOp) {
                        let expResult = Promise.resolve(boundOpName == "$count" ? opResult || this.resultCount : opResult);
                        if (elementType && boundOpName == "$value" && typeof elementType == "function" && Edm.isMediaEntity(elementType)) {
                            opResult.then((opResult) => {
                                if (this.method == "get") {
                                    this.emit("header", { "Content-Type": Edm.getContentType(elementType) || opResult.contentType || "application/octet-stream" });
                                    if (opResult.stream)
                                        opResult = opResult.stream;
                                    opResult.pipe(this);
                                    opResult.on("end", resolve);
                                    opResult.on("error", reject);
                                }
                                else
                                    result_1.ODataResult.NoContent().then(resolve, reject);
                            }, reject);
                        }
                        else {
                            return expResult.then((expResult) => {
                                return (boundOpName == "$ref" && this.method != "get" ? result_1.ODataResult.NoContent : ODataRequestResult[this.method])(expResult, typeof expResult == "object" ? "application/json" : "text/plain").then((result) => {
                                    if (typeof expResult == "object" && (boundOpName != "$ref" || this.method == "get"))
                                        result.elementType = elementType;
                                    resolve(result);
                                }, reject);
                            }, reject);
                        }
                    }
                    if (isAction && !returnType) {
                        return result_1.ODataResult.NoContent(opResult).then(resolve, reject);
                    }
                    return result_1.ODataResult.Ok(opResult).then((result) => {
                        if (utils_1.isStream(result.body)) {
                            result.body.on("end", resolve);
                            result.body.on("error", reject);
                        }
                        else {
                            try {
                                this.__appendODataContext(result, returnType, this.resourcePath.includes, this.resourcePath.select).then(() => {
                                    if (typeof result.body.value == "undefined")
                                        result.body.value = opResult;
                                    resolve(result);
                                });
                            }
                            catch (err) {
                                reject(err);
                            }
                        }
                    }, reject);
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }));
        };
    }
    __appendLinks(ctrl, elementType, context, body, result) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.options.metadata == ODataMetadataType.none)
                return;
            let entitySet = this.entitySets[this.resourcePath.navigation[0].name] == ctrl ? this.resourcePath.navigation[0].name : null;
            if (!entitySet) {
                for (let prop in this.entitySets) {
                    if (this.entitySets[prop] == ctrl) {
                        entitySet = prop;
                        break;
                    }
                }
            }
            let resultType = Object.getPrototypeOf(body).constructor;
            if (resultType != Object && resultType != elementType)
                elementType = resultType;
            if (typeof body["@odata.type"] == "function")
                elementType = body["@odata.type"];
            let keys = Edm.getKeyProperties(elementType);
            let resolveBaseType = (elementType) => {
                if (elementType && elementType.prototype) {
                    let proto = Object.getPrototypeOf(elementType.prototype);
                    if (proto) {
                        let baseType = proto.constructor;
                        if (baseType != Object && Edm.getProperties(baseType.prototype).length > 0) {
                            keys = Edm.getKeyProperties(baseType).concat(keys);
                            resolveBaseType(baseType);
                        }
                    }
                }
            };
            resolveBaseType(elementType);
            if (!entitySet || ctrl.prototype.elementType != elementType) {
                let typeCtrl = this.serverType.getController(elementType);
                if (typeCtrl) {
                    for (let prop in this.entitySets) {
                        if (this.entitySets[prop] == typeCtrl) {
                            entitySet = prop;
                            break;
                        }
                    }
                }
            }
            let id;
            if (keys.length > 0) {
                try {
                    if (keys.length == 1) {
                        id = yield Edm.escape(body[keys[0]], Edm.getTypeName(elementType, keys[0], this.serverType.container), Edm.getURLSerializer(elementType, keys[0], Edm.getType(elementType, keys[0], this.serverType.container), this.serverType.container));
                    }
                    else {
                        id = (yield Promise.all(keys.map((it) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            return `${it}=${yield Edm.escape(body[it], Edm.getTypeName(elementType, it, this.serverType.container), Edm.getURLSerializer(elementType, it, Edm.getType(elementType, it, this.serverType.container), this.serverType.container))}`;
                        })))).join(",");
                    }
                }
                catch (err) { }
            }
            if (entitySet && typeof id != "undefined") {
                context["@odata.id"] = `${getODataRoot(this.context)}/${entitySet}(${id})`;
                if (typeof elementType == "function" && Edm.isMediaEntity(elementType)) {
                    context["@odata.mediaReadLink"] = `${getODataRoot(this.context)}/${entitySet}(${id})/$value`;
                    if (odata.findODataMethod(ctrl, "post/$value", [])) {
                        context["@odata.mediaEditLink"] = `${getODataRoot(this.context)}/${entitySet}(${id})/$value`;
                    }
                    let contentType = Edm.getContentType(elementType);
                    if (contentType)
                        context["@odata.mediaContentType"] = contentType;
                    if (typeof result == "object") {
                        Object.defineProperty(result, "stream", {
                            configurable: true,
                            enumerable: false,
                            writable: false,
                            value: body
                        });
                    }
                }
                if (odata.findODataMethod(ctrl, "put", keys) ||
                    odata.findODataMethod(ctrl, "patch", keys)) {
                    context["@odata.editLink"] = `${getODataRoot(this.context)}/${entitySet}(${id})`;
                }
            }
            else {
                if (typeof elementType == "function" && Edm.isMediaEntity(elementType)) {
                    context["@odata.mediaReadLink"] = `${getODataRoot(this.context)}${this.context.url}(${id})/$value`;
                    context["@odata.mediaReadLink"] = context["@odata.mediaReadLink"].replace(`(${id})(${id})`, `(${id})`);
                    if (odata.findODataMethod(ctrl, "post/$value", [])) {
                        context["@odata.mediaEditLink"] = `${getODataRoot(this.context)}${this.context.url}(${id})/$value`;
                        context["@odata.mediaEditLink"] = context["@odata.mediaEditLink"].replace(`(${id})(${id})`, `(${id})`);
                    }
                    let contentType = Edm.getContentType(elementType);
                    if (contentType)
                        context["@odata.mediaContentType"] = contentType;
                    if (typeof result == "object") {
                        Object.defineProperty(result, "stream", {
                            configurable: true,
                            enumerable: false,
                            writable: false,
                            value: body
                        });
                    }
                }
                if (keys.length > 0 && typeof id != "undefined") {
                    if (odata.findODataMethod(ctrl, "put", keys) ||
                        odata.findODataMethod(ctrl, "patch", keys)) {
                        context["@odata.editLink"] = `${getODataRoot(this.context)}${this.context.url}(${id})`;
                        context["@odata.editLink"] = context["@odata.editLink"].replace(`(${id})(${id})`, `(${id})`);
                    }
                }
            }
        });
    }
    __appendODataContext(result, ctrlType, includes, select) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof result.body == "undefined")
                return;
            let context = {
                "@odata.context": this.options.metadata != ODataMetadataType.none ? this.odataContext : undefined
            };
            let elementType = result.elementType = jsPrimitiveTypes.indexOf(result.elementType) >= 0 || result.elementType == String || typeof result.elementType != "function" ? ctrlType : result.elementType;
            if (typeof result.body == "object" && result.body) {
                if (typeof result.body["@odata.count"] == "number")
                    context["@odata.count"] = result.body["@odata.count"];
                if (!result.body["@odata.context"]) {
                    let ctrl = this.ctrl && this.ctrl.prototype.elementType == ctrlType ? this.ctrl : this.serverType.getController(ctrlType);
                    if (result.body.value && Array.isArray(result.body.value)) {
                        context.value = [];
                        yield Promise.all(result.body.value.map((entity, i) => {
                            return ((entity, i) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                if (typeof entity == "object") {
                                    let item = {};
                                    if (ctrl)
                                        yield this.__appendLinks(ctrl, elementType, item, entity);
                                    yield this.__convertEntity(item, entity, elementType, includes, select);
                                    context.value[i] = item;
                                }
                                else {
                                    context.value[i] = entity;
                                }
                            }))(entity, i);
                        }));
                    }
                    else {
                        if (ctrl)
                            yield this.__appendLinks(ctrl, elementType, context, result.body, result);
                        yield this.__convertEntity(context, result.body, elementType, includes, select);
                    }
                }
            }
            else if (typeof result.body != "undefined" && result.body) {
                context.value = result.body;
            }
            result.body = context;
        });
    }
    __resolveAsync(type, prop, propValue, entity, converter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof converter == "function") {
                propValue = yield converter(propValue, prop, type);
            }
            if (utils_1.isIterator(propValue)) {
                propValue = yield run(propValue.call(entity), defaultHandlers);
            }
            if (typeof propValue == "function")
                propValue = propValue.call(entity);
            if (utils_1.isPromise(propValue))
                propValue = yield propValue;
            if (type != "Edm.Stream" && utils_1.isStream(propValue)) {
                let stream = new ODataStreamWrapper();
                propValue.pipe(stream);
                propValue = yield stream.toPromise();
            }
            return propValue;
        });
    }
    __setODataType(context, elementType) {
        let containerType = this.serverType.container.resolve(elementType);
        if (containerType) {
            context["@odata.type"] = `#${odata.getNamespace(Object.getPrototypeOf(this.serverType.container).constructor, containerType) || (this.serverType.container["namespace"] || elementType.namespace || this.serverType.namespace)}.${containerType}`;
        }
        else {
            context["@odata.type"] = `#${(elementType.namespace || this.serverType.namespace)}.${elementType.name}`;
        }
    }
    __convertEntity(context, result, elementType, includes, select) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(elementType.prototype instanceof Object) || elementType === Object || this.options.disableEntityConversion)
                return Object.assign(context, result || {});
            let resultType = Object.getPrototypeOf(result).constructor;
            if (resultType != Object && resultType != this.ctrl.prototype.elementType && resultType.prototype instanceof this.ctrl.prototype.elementType) {
                elementType = resultType;
                if (this.options.metadata != ODataMetadataType.none && Edm.isEntityType(elementType))
                    this.__setODataType(context, elementType);
            }
            if (typeof result["@odata.type"] == "function") {
                elementType = result["@odata.type"];
                if (this.options.metadata != ODataMetadataType.none && Edm.isEntityType(elementType))
                    this.__setODataType(context, elementType);
            }
            if (this.options.metadata == ODataMetadataType.full) {
                this.__setODataType(context, elementType);
            }
            let props = Edm.getProperties(elementType.prototype);
            if (Edm.isOpenType(elementType)) {
                props = Object.getOwnPropertyNames(result).concat(props);
            }
            let ctrl = this.serverType.getController(elementType);
            let resolveBaseType = (elementType) => {
                if (elementType && elementType.prototype) {
                    let proto = Object.getPrototypeOf(elementType.prototype);
                    if (proto) {
                        let baseType = proto.constructor;
                        if (baseType != Object && Edm.getProperties(baseType.prototype).length > 0) {
                            props = Edm.getProperties(baseType.prototype).concat(props);
                            ctrl = ctrl || this.serverType.getController(baseType);
                            resolveBaseType(baseType);
                        }
                    }
                }
            };
            resolveBaseType(elementType);
            let entityType = function () { };
            util.inherits(entityType, elementType);
            result = Object.assign(new entityType(), result || {});
            if (includes) {
                for (let expand in includes) {
                    let include = includes[expand];
                    for (let nav of include.navigation) {
                        if (nav.type == lexer_1.TokenType.EntityNavigationProperty || nav.type == lexer_1.TokenType.EntityCollectionNavigationProperty && !includes[nav.name]) {
                            includes[nav.name] = include;
                        }
                    }
                }
            }
            if (props.length > 0) {
                let metadata = {};
                yield Promise.all(props.map(prop => ((prop) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    let type = Edm.getType(elementType, prop, this.serverType.container);
                    let itemType;
                    if (typeof type == "function" && !Edm.isTypeDefinition(elementType, prop)) {
                        itemType = function () { };
                        util.inherits(itemType, type);
                    }
                    let converter = Edm.getSerializer(elementType, prop, type, this.serverType.container) || Edm.getConverter(elementType, prop);
                    let isCollection = Edm.isCollection(elementType, prop);
                    let entity = result;
                    let propValue = entity[prop];
                    propValue = yield this.__resolveAsync(type, prop, propValue, entity, converter);
                    if (select && Object.keys(select).length == 0) {
                        select = null;
                    }
                    if (!select || (select && select[prop]) || (includes && includes[prop])) {
                        if (isCollection && propValue) {
                            let value = Array.isArray(propValue) ? propValue : (typeof propValue != "undefined" ? [propValue] : []);
                            for (let i = 0; i < value.length; i++) {
                                value[i] = yield this.__resolveAsync(type, prop, value[i], entity, converter);
                            }
                            if (includes && includes[prop]) {
                                yield this.__include(includes[prop], (select || {})[prop], context, prop, ctrl, entity, elementType);
                            }
                            else if (typeof type == "function" && !Edm.isTypeDefinition(elementType, prop)) {
                                for (let i = 0; i < value.length; i++) {
                                    let it = value[i];
                                    if (!it)
                                        return it;
                                    let item = new itemType();
                                    yield this.__convertEntity(item, it, type, includes, (select || {})[prop]);
                                    value[i] = item;
                                }
                            }
                            context[prop] = value;
                        }
                        else {
                            if (this.options.metadata == ODataMetadataType.full) {
                                if (Edm.isEntityType(elementType, prop)) {
                                    if ((!includes || (includes && !includes[prop]))) {
                                        metadata[`${prop}@odata.associationLink`] = `${context["@odata.id"]}/${prop}/$ref`;
                                        metadata[`${prop}@odata.navigationLink`] = `${context["@odata.id"]}/${prop}`;
                                    }
                                }
                                else if (type != "Edm.String" && type != "Edm.Boolean") {
                                    let typeName = Edm.getTypeName(elementType, prop, this.serverType.container);
                                    if (typeof type == "string" && type.indexOf("Edm.") == 0)
                                        typeName = typeName.replace(/Edm\./, "");
                                    context[`${prop}@odata.type`] = `#${typeName}`;
                                }
                            }
                            if (includes && includes[prop]) {
                                yield this.__include(includes[prop], (select || {})[prop], context, prop, ctrl, entity, elementType);
                            }
                            else if (typeof type == "function" && propValue && !Edm.isTypeDefinition(elementType, prop)) {
                                context[prop] = new itemType();
                                yield this.__convertEntity(context[prop], propValue, type, includes, (select || {})[prop]);
                            }
                            else if (type == "Edm.Stream") {
                                if (this.options.metadata != ODataMetadataType.none) {
                                    context[`${prop}@odata.mediaReadLink`] = `${context["@odata.id"]}/${prop}`;
                                    if (odata.findODataMethod(ctrl, `post/${prop}`, []) || odata.findODataMethod(ctrl, `post/${prop}/$value`, [])) {
                                        context[`${prop}@odata.mediaEditLink`] = `${context["@odata.id"]}/${prop}`;
                                    }
                                    let contentType = Edm.getContentType(elementType.prototype, prop) || (propValue && propValue.contentType);
                                    if (contentType)
                                        context[`${prop}@odata.mediaContentType`] = contentType;
                                }
                                Object.defineProperty(context, prop, {
                                    configurable: true,
                                    enumerable: false,
                                    writable: false,
                                    value: new StreamWrapper(propValue)
                                });
                            }
                            else if (typeof propValue != "undefined")
                                context[prop] = propValue;
                        }
                    }
                }))(prop)));
                Object.assign(context, metadata);
            }
        });
    }
    __include(include, select, context, prop, ctrl, result, elementType) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let oldPrevCtrl = this.prevCtrl;
            let oldCtrl = this.ctrl;
            const isCollection = Edm.isCollection(elementType, include.navigationProperty);
            const navigationType = Edm.getType(elementType, include.navigationProperty, this.serverType.container);
            let navigationResult;
            if (typeof result[prop] == "object") {
                navigationResult = yield result_1.ODataResult.Ok(result[prop]);
                yield this.__appendODataContext(navigationResult, navigationType, include.includes, select);
                ctrl = this.serverType.getController(navigationType);
            }
            else {
                const fn = odata.findODataMethod(ctrl, `get/${include.navigationProperty}`, []);
                let params = {};
                let stream, streamPromise;
                if (isCollection) {
                    stream = include.stream = new ODataStreamWrapper();
                    streamPromise = include.streamPromise = stream.toPromise();
                }
                if (fn) {
                    yield this.__applyParams(ctrl, fn.call, params, include.ast, result, include);
                    let fnCall = ctrl.prototype[fn.call];
                    let fnResult = fnCaller.call(ctrl, fnCall, params);
                    if (utils_1.isIterator(fnCall)) {
                        fnResult = yield run(fnResult, defaultHandlers);
                    }
                    if (utils_1.isPromise(fnResult)) {
                        fnResult = yield fnResult;
                    }
                    if (isCollection && (utils_1.isStream(fnResult) || !fnResult || (stream && stream.buffer && stream.buffer.length > 0)) && stream && streamPromise)
                        navigationResult = yield result_1.ODataResult.Ok((yield streamPromise) || []);
                    else
                        navigationResult = yield result_1.ODataResult.Ok(fnResult);
                    yield this.__appendODataContext(navigationResult, navigationType, include.includes, select);
                    ctrl = this.serverType.getController(navigationType);
                }
                else {
                    ctrl = this.serverType.getController(navigationType);
                    if (isCollection) {
                        let foreignKeys = Edm.getForeignKeys(elementType, include.navigationProperty);
                        let typeKeys = Edm.getKeyProperties(navigationType);
                        result.foreignKeys = {};
                        let part = {};
                        let foreignFilter = (yield Promise.all(foreignKeys.map((key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            result.foreignKeys[key] = result[typeKeys[0]];
                            return `${key} eq ${yield Edm.escape(result[typeKeys[0]], Edm.getTypeName(navigationType, key, this.serverType.container))}`;
                        })))).join(" and ");
                        if (part.key)
                            part.key.forEach((key) => params[key.name] = key.value);
                        navigationResult = yield this.__read(ctrl, part, params, result, foreignFilter, navigationType, include, select);
                    }
                    else {
                        const foreignKeys = Edm.getForeignKeys(elementType, include.navigationProperty);
                        result.foreignKeys = {};
                        let part = {};
                        part.key = foreignKeys.map(key => {
                            result.foreignKeys[key] = result[key];
                            return {
                                name: key,
                                value: result[key]
                            };
                        });
                        if (part.key)
                            part.key.forEach((key) => params[key.name] = key.value);
                        navigationResult = yield this.__read(ctrl, part, params, result, undefined, navigationType, include, select);
                    }
                }
            }
            let entitySet = this.entitySets[this.resourcePath.navigation[0].name] == ctrl ? this.resourcePath.navigation[0].name : null;
            if (!entitySet) {
                for (let prop in this.entitySets) {
                    if (this.entitySets[prop] == ctrl) {
                        entitySet = prop;
                        break;
                    }
                }
            }
            delete navigationResult.body["@odata.context"];
            if (this.options.metadata == ODataMetadataType.full) {
                context[`${prop}@odata.associationLink`] = `${context["@odata.id"]}/${prop}/$ref`;
                context[`${prop}@odata.navigationLink`] = `${context["@odata.id"]}/${prop}`;
            }
            if (isCollection && navigationResult.body.value && Array.isArray(navigationResult.body.value)) {
                if (typeof navigationResult.body["@odata.count"] == "number")
                    context[prop + "@odata.count"] = navigationResult.body["@odata.count"];
                context[prop] = navigationResult.body.value;
            }
            else if (navigationResult.body && Object.keys(navigationResult.body).length > 0) {
                context[prop] = navigationResult.body;
            }
            this.prevCtrl = oldPrevCtrl;
            this.ctrl = oldCtrl;
        });
    }
    __enableStreaming(part) {
        this.streamEnabled = part == this.resourcePath.navigation[this.resourcePath.navigation.length - 1] ||
            (this.resourcePath.navigation[this.resourcePath.navigation.indexOf(part) + 1] &&
                this.resourcePath.navigation[this.resourcePath.navigation.indexOf(part) + 1].name == "$value");
        if (!this.streamEnabled)
            this.resultCount = 0;
    }
    __applyParams(container, name, params, queryString, result, include) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let queryParam, filterParam, contextParam, streamParam, resultParam, idParam, bodyParam;
            queryParam = odata.getQueryParameter(container, name);
            filterParam = odata.getFilterParameter(container, name);
            contextParam = odata.getContextParameter(container, name);
            streamParam = odata.getStreamParameter(container, name);
            resultParam = odata.getResultParameter(container, name);
            idParam = odata.getIdParameter(container, name);
            bodyParam = odata.getBodyParameter(container, name);
            let typeParam = odata.getTypeParameter(container, name);
            let elementType = (result && result.elementType) || (this.ctrl && this.ctrl.prototype.elementType) || null;
            if (queryParam) {
                let queryAst = queryString || this.resourcePath.ast.value.query || null;
                if (typeof queryAst == "string") {
                    queryAst = this.serverType.parser.query(queryAst, { metadata: this.resourcePath.ast.metadata || this.serverType.$metadata().edmx });
                    if (!include)
                        queryAst = deepmerge(queryAst, this.resourcePath.ast.value.query || {});
                    const lastNavigationPath = this.resourcePath.navigation[this.resourcePath.navigation.length - 1];
                    const queryType = lastNavigationPath.type == "QualifiedEntityTypeName" ?
                        this.resourcePath.navigation[this.resourcePath.navigation.length - 1].node[visitor_1.ODATA_TYPE] :
                        (result || this.ctrl.prototype).elementType;
                    yield new visitor_1.ResourcePathVisitor(this.serverType, this.entitySets).Visit(queryAst, {}, queryType);
                }
                params[queryParam] = this.serverType.connector ? this.serverType.connector.createQuery(queryAst, elementType) : queryAst;
                if (container.prototype instanceof controller_1.ODataControllerBase) {
                    const validator = container.validator;
                    if (validator) {
                        validator(params[queryParam]);
                    }
                }
            }
            if (filterParam) {
                let filterAst = queryString;
                let resourceFilterAst = this.resourcePath.ast.value.query && this.resourcePath.ast.value.query.value.options && this.resourcePath.ast.value.query.value.options.find(t => t.type == lexer_1.TokenType.Filter);
                if (typeof filterAst == "string") {
                    filterAst = qs.parse(filterAst).$filter;
                    if (typeof filterAst == "string") {
                        filterAst = this.serverType.parser.filter(filterAst, { metadata: this.resourcePath.ast.metadata || this.serverType.$metadata().edmx });
                        const lastNavigationPath = this.resourcePath.navigation[this.resourcePath.navigation.length - 1];
                        const queryType = lastNavigationPath.type == "QualifiedEntityTypeName" ?
                            this.resourcePath.navigation[this.resourcePath.navigation.length - 1].node[visitor_1.ODATA_TYPE] :
                            (result || this.ctrl.prototype).elementType;
                        yield new visitor_1.ResourcePathVisitor(this.serverType, this.entitySets).Visit(filterAst, {}, queryType);
                    }
                }
                else {
                    let token = queryString;
                    filterAst = token && token.value && token.value.options && token.value.options.find(t => t.type == lexer_1.TokenType.Filter);
                }
                if (filterAst && !include) {
                    filterAst = deepmerge(filterAst, (resourceFilterAst || {}).value || {});
                }
                params[filterParam] = this.serverType.connector ? this.serverType.connector.createFilter(filterAst, elementType) : filterAst;
                if (container.prototype instanceof controller_1.ODataControllerBase) {
                    const validator = container.validator;
                    if (validator) {
                        validator(params[filterParam]);
                    }
                }
            }
            if (contextParam) {
                params[contextParam] = this.context;
            }
            if (streamParam) {
                params[streamParam] = include ? include.stream : this;
            }
            if (resultParam) {
                params[resultParam] = result instanceof result_1.ODataResult ? result.body : result;
            }
            if (idParam) {
                params[idParam] = decodeURI(this.resourcePath.id || this.body["@odata.id"]);
            }
            if (bodyParam && !params[bodyParam]) {
                params[bodyParam] = this.body;
            }
            if (typeParam) {
                params[typeParam] = params[typeParam] || elementType;
            }
        });
    }
    execute(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.body = body;
            let next = yield this.workflow.shift().call(this, body);
            while (this.workflow.length > 0) {
                next = yield this.workflow.shift().call(this, next);
            }
            return next;
        });
    }
}
exports.ODataProcessor = ODataProcessor;
//# sourceMappingURL=processor.js.map