"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lexer_1 = require("odata-v4-parser/lib/lexer");
const odata_v4_literal_1 = require("odata-v4-literal");
const qs = require("qs");
const Edm = require("./edm");
exports.ODATA_TYPE = "@odata.type";
exports.ODATA_TYPENAME = "@odata.type.name";
class ResourcePathVisitor {
    constructor(serverType, entitySets) {
        this.includes = {};
        this.navigation = [];
        this.path = "";
        this.alias = {};
        this.serverType = serverType;
        this.entitySets = entitySets;
    }
    Visit(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.ast = this.ast || node;
            if (!type)
                type = this.serverType;
            context = context || {};
            if (node) {
                node[exports.ODATA_TYPE] = type;
                let visitor;
                switch (node.type) {
                    case "PrimitiveFunctionImportCall":
                    case "PrimitiveCollectionFunctionImportCall":
                    case "ComplexFunctionImportCall":
                    case "ComplexCollectionFunctionImportCall":
                    case "EntityFunctionImportCall":
                    case "EntityCollectionFunctionImportCall":
                        visitor = this.VisitFunctionImportCall;
                        break;
                    case "BoundPrimitiveFunctionCall":
                    case "BoundPrimitiveCollectionFunctionCall":
                    case "BoundComplexFunctionCall":
                    case "BoundComplexCollectionFunctionCall":
                    case "BoundEntityFunctionCall":
                    case "BoundEntityCollectionFunctionCall":
                        visitor = this.VisitBoundFunctionCall;
                        break;
                    case "PrimitiveProperty":
                    case "PrimitiveKeyProperty":
                    case "PrimitiveCollectionProperty":
                    case "ComplexProperty":
                    case "ComplexCollectionProperty":
                    case "EntityNavigationProperty":
                    case "EntityCollectionNavigationProperty":
                        visitor = this.VisitProperty;
                        break;
                    case "QualifiedEntityTypeName":
                    case "QualifiedComplexTypeName":
                        visitor = this.VisitQualifiedTypeName;
                        break;
                    default:
                        visitor = this[`Visit${node.type}`];
                }
                if (visitor)
                    yield visitor.call(this, node, context, type);
            }
            return this;
        });
    }
    VisitODataUri(node, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.resource, context);
            yield this.Visit(node.value.query, context, this.navigation[this.navigation.length - 1].node[exports.ODATA_TYPE]);
            this.navigation.forEach(it => {
                if (it.params) {
                    for (let prop in it.params) {
                        if (typeof it.params[prop] == "function") {
                            it.params[prop] = it.params[prop]();
                        }
                    }
                }
            });
        });
    }
    VisitQueryOptions(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Promise.all(node.value.options.map((option) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.Visit(option, Object.assign({}, context), type); })));
        });
    }
    VisitSelect(node, context, type) {
        this.select = {};
        node.value.items.forEach((item) => this.Visit(item, context));
    }
    VisitSelectItem(node, context, type) {
        let select = this.select;
        node.raw.split("/").forEach(part => {
            select = select[part] = select[part] || {};
        });
    }
    VisitFilter(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            context = Object.assign({ filter: true }, context);
            yield this.Visit(node.value, context, type);
        });
    }
    VisitAndExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitOrExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitBoolParenExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value, context, type);
        });
    }
    VisitCommonExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value, context, type);
        });
    }
    VisitFirstMemberExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const firstMemberContext = Object.assign({}, context, { isFirstMemberExpression: true });
            yield this.Visit(node.value, firstMemberContext, type);
            if (firstMemberContext.qualifiedType && firstMemberContext.qualifiedTypeName) {
                type = firstMemberContext.qualifiedType || type;
                node.raw = node.raw.split('/').pop();
            }
            context.type = Edm.getType(type, node.raw, this.serverType.container);
            context.typeName = Edm.getTypeName(type, node.raw, this.serverType.container);
            context.deserializer = Edm.getURLDeserializer(type, node.raw, context.type, this.serverType.container);
            if (Edm.isEnumType(type, node.raw)) {
                const containerType = Object.getPrototypeOf(this.serverType.container).constructor;
                const enumType = context.type;
                const prop = node.raw;
                let enumName = context.typeName;
                let enumNamespace = containerType.namespace;
                if (enumName.indexOf(".") > 0) {
                    enumNamespace = enumName.slice(0, enumName.lastIndexOf("."));
                    enumName = enumName.slice(enumName.lastIndexOf(".") + 1);
                }
                context.typeName = Edm.getTypeName(containerType, enumName, this.serverType.container) ||
                    Edm.getTypeName(containerType, `${enumNamespace}.${enumName}`, this.serverType.container) ||
                    "Edm.Int32";
            }
        });
    }
    VisitMemberExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (node.value && node.value.name && node.value.value) {
                yield this.Visit(node.value.name, context, type);
                yield this.Visit(node.value.value, context, type);
            }
            else
                yield this.Visit(node.value, context, type);
        });
    }
    VisitPropertyPathExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (node.value.current && node.value.next) {
                yield this.Visit(node.value.current, context, type);
                yield this.Visit(node.value.next, context, type);
            }
            else
                yield this.Visit(node.value, context, type);
        });
    }
    VisitNotExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value, context, type);
        });
    }
    VisitEqualsExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitNotEqualsExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitLesserThanExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitLesserOrEqualsExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitGreaterThanExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitGreaterOrEqualsExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitHasExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.left, context, type);
            yield this.Visit(node.value.right, context, type);
        });
    }
    VisitExpand(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Promise.all(node.value.items.map((item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let expandPath = item.value.path.raw;
                let visitor = this.includes[expandPath];
                if (!visitor) {
                    visitor = new ResourcePathVisitor(node[exports.ODATA_TYPE], this.entitySets);
                    this.includes[expandPath] = visitor;
                }
                yield visitor.Visit(item, Object.assign({}, context), type);
            })));
        });
    }
    VisitExpandItem(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.path, context, type);
            type = this.navigation[this.navigation.length - 1].node[exports.ODATA_TYPE] || type;
            if (node.value.options) {
                this.ast = new lexer_1.Token(node);
                this.ast.type = lexer_1.TokenType.QueryOptions;
                this.ast.raw = node.value.options.map(n => n.raw).join("&");
                this.query = qs.parse(this.ast.raw);
                yield Promise.all(node.value.options.map((item) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.Visit(item, Object.assign({}, context), type); })));
            }
            if (node.value.ref)
                yield this.Visit(node.value.ref, Object.assign({}, context), type);
            if (node.value.count)
                yield this.Visit(node.value.count, Object.assign({}, context), type);
        });
    }
    VisitExpandPath(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let item of node.value) {
                yield this.Visit(item, Object.assign({}, context), type);
                type = item[exports.ODATA_TYPE] || type;
            }
            for (let i = this.navigation.length - 1; i >= 0; i--) {
                let nav = this.navigation[i];
                if (nav.type == lexer_1.TokenType.EntityCollectionNavigationProperty || nav.type == lexer_1.TokenType.EntityNavigationProperty) {
                    this.navigationProperty = nav.name;
                    break;
                }
            }
        });
    }
    VisitId(node) {
        this.id = node.value;
    }
    VisitInlineCount(node) {
        this.inlinecount = odata_v4_literal_1.Literal.convert(node.value.value, node.value.raw);
    }
    VisitAliasAndValue(node, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.value.value, context);
            this.alias[node.value.alias.value.name] = context.literal;
            delete context.literal;
        });
    }
    VisitResourcePath(node, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.resource, context);
            yield this.Visit(node.value.navigation, context, context[exports.ODATA_TYPE]);
            delete context[exports.ODATA_TYPE];
        });
    }
    VisitSingletonEntity(node) {
        this.singleton = node.raw;
    }
    VisitEntitySetName(node, context) {
        node[exports.ODATA_TYPE] = context[exports.ODATA_TYPE] = this.entitySets[node.value.name].prototype.elementType;
        this.navigation.push({ name: node.value.name, type: node.type, node });
        this.path += "/" + node.value.name;
    }
    VisitCountExpression(node) {
        this.navigation.push({
            name: "$count",
            type: node.type,
            params: {},
            node
        });
        this.path += "/$count";
    }
    ;
    VisitCollectionNavigation(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            context.isCollection = true;
            yield this.Visit(node.value.name, context, type);
            yield this.Visit(node.value.path, context, type);
            delete context.isCollection;
        });
    }
    VisitCollectionNavigationPath(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.predicate, context, type);
            yield this.Visit(node.value.navigation, context, type);
        });
    }
    VisitSimpleKey(node, _, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lastNavigationPart = this.navigation[this.navigation.length - 1];
            node[exports.ODATA_TYPENAME] = Edm.getTypeName(type, node.value.key, this.serverType.container);
            node[exports.ODATA_TYPE] = Edm.getType(type, node.value.key, this.serverType.container);
            let value = odata_v4_literal_1.Literal.convert(node.value.value.value, node.value.value.raw);
            let deserializer = Edm.getURLDeserializer(type, node.value.key, node[exports.ODATA_TYPE], this.serverType.container);
            if (typeof deserializer == "function")
                value = yield deserializer(value);
            lastNavigationPart.key = [{
                    name: node.value.key,
                    value,
                    raw: node.value.value.raw,
                    node
                }];
            this.path += "(\\(([^,]+)\\))";
        });
    }
    VisitCompoundKey(node, _, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.path += "(\\(";
            let lastNavigationPart = this.navigation[this.navigation.length - 1];
            lastNavigationPart.key = yield Promise.all(node.value.map((pair, i) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.path += i == node.value.length - 1 ? "([^,]+)" : "([^,]+,)";
                node[exports.ODATA_TYPENAME] = Edm.getTypeName(type, pair.value.key.value.name, this.serverType.container);
                node[exports.ODATA_TYPE] = Edm.getType(type, pair.value.key.value.name, this.serverType.container);
                let value = odata_v4_literal_1.Literal.convert(pair.value.value.value, pair.value.value.raw);
                let deserializer = Edm.getURLDeserializer(type, pair.value.key.value.name, node[exports.ODATA_TYPE], this.serverType.container);
                if (typeof deserializer == "function")
                    value = yield deserializer(value);
                return {
                    name: pair.value.key.value.name,
                    value,
                    raw: pair.value.value.raw,
                    node
                };
            })));
            this.path += "\\))";
        });
    }
    VisitQualifiedTypeName(node, context, type) {
        const children = Edm.getChildren(node[exports.ODATA_TYPE]);
        const child = children.find(t => `${t.namespace}.${t.name}` == node.raw);
        if (child) {
            node[exports.ODATA_TYPE] = child;
            node[exports.ODATA_TYPENAME] = node.raw;
            if (context.isFirstMemberExpression) {
                context.qualifiedType = child;
                context.qualifiedTypeName = node.raw;
            }
            else {
                this.navigation.push({
                    name: node.raw,
                    type: node.type,
                    node
                });
                this.path += `/${node.raw}`;
            }
        }
    }
    VisitSingleNavigation(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            context.isCollection = false;
            if (node.value.name)
                yield this.Visit(node.value.name, context, type);
            yield this.Visit(node.value.path, context, type);
            delete context.isCollection;
        });
    }
    VisitPropertyPath(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.path, context, type);
            yield this.Visit(node.value.navigation, context, type);
        });
    }
    VisitProperty(node, _) {
        node[exports.ODATA_TYPENAME] = Edm.getTypeName(node[exports.ODATA_TYPE], node.value.name, this.serverType.container);
        node[exports.ODATA_TYPE] = Edm.getType(node[exports.ODATA_TYPE], node.value.name, this.serverType.container);
        this.navigation.push({ name: node.value.name, type: node.type, node });
        this.path += "/" + node.value.name;
    }
    ;
    VisitValueExpression(node) {
        this.navigation.push({
            name: "$value",
            type: node.type,
            params: {},
            node
        });
        this.path += "/$value";
    }
    VisitRefExpression(node) {
        this.navigation.push({
            name: "$ref",
            type: node.type,
            params: {},
            node
        });
        this.path += "/$ref";
    }
    VisitBoundOperation(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.operation, context, type);
            yield this.Visit(node.value.navigation, context, type);
        });
    }
    VisitBoundActionCall(node) {
        let part = {
            type: node.type,
            name: node.raw,
            node
        };
        this.navigation.push(part);
        this.path += "/" + part.name;
    }
    VisitBoundFunctionCall(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let part = {
                type: node.type,
                name: node.value.call.value.namespace + "." + node.value.call.value.name,
                params: {},
                node
            };
            this.navigation.push(part);
            this.path += "/" + part.name;
            this.path += "(\\(";
            if (context.isCollection) {
                type = this.serverType.getController(type);
            }
            context.parameters = Edm.getParameters(type, part.name.split(".").pop());
            yield Promise.all(node.value.params.value.map((param, i) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.Visit(param, context);
                if (i < node.value.params.value.length - 1)
                    this.path += ",";
            })));
            delete context.parameters;
            this.path += "\\))";
        });
    }
    VisitFunctionImportCall(node, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let part = {
                type: node.type,
                name: node.value.import.value.name,
                params: {},
                node
            };
            this.navigation.push(part);
            this.path += "/" + part.name;
            this.path += "(\\(";
            context.parameters = Edm.getParameters(node[exports.ODATA_TYPE], part.name);
            yield Promise.all(node.value.params.map((param) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield this.Visit(param, Object.assign({}, context)); })));
            delete context.parameters;
            this.path += "\\))";
        });
    }
    VisitFunctionParameter(node, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let edmParam = context.parameters.find(p => p.name == [node.value.name.value.name]);
            let deserializer = (edmParam && Edm.getURLDeserializer(node[exports.ODATA_TYPE], edmParam.name, edmParam.type, this.serverType.container)) || (_ => _);
            context = Object.assign({}, context);
            yield this.Visit(node.value.value, context, edmParam && edmParam.type);
            let params = this.navigation[this.navigation.length - 1].params;
            params[node.value.name.value.name] = (literal => _ => deserializer(typeof literal == "function" ? literal() : literal))(context.literal);
            this.path += node.value.name.value.name + "=([^,]+)";
            delete context.literal;
        });
    }
    VisitActionImportCall(node) {
        let part = {
            type: node.value.type,
            name: node.value.value.name,
            node
        };
        this.navigation.push(part);
        this.path += "/" + part.name;
    }
    VisitParameterAlias(node, context) {
        context.literal = (name => _ => this.alias[name])(node.value.name);
    }
    VisitLiteral(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let literal = odata_v4_literal_1.Literal.convert(node.value, node.raw);
            if (node.value != context.typeName) {
                node.raw = yield (context.deserializer || (_ => _))(literal);
                node.value = context.typeName;
                literal = node.raw;
            }
            context.literal = literal;
        });
    }
    VisitObject(node, context, type) {
        context.literal = JSON.parse(node.raw);
    }
    VisitEnum(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const enumName = node.value.name.raw.split('.');
            context.enumName = enumName.pop();
            context.enumNamespace = enumName.join('.');
            yield this.Visit(node.value.value, context, type);
        });
    }
    VisitEnumValue(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.Visit(node.value.values[0], context, type);
        });
    }
    VisitEnumerationMember(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (context.filter && type) {
                node.type = lexer_1.TokenType.EnumMemberValue;
                const deserializer = Edm.getURLDeserializer(type, context.typeName, context.type, this.serverType.container);
                if (deserializer) {
                    node.raw = yield deserializer(node.value.name);
                    node.value = node.raw;
                }
                else {
                    const { enumNamespace, enumName } = context;
                    const qualifiedEnumTypeName = `${enumNamespace}.${enumName}`;
                    if (!(context.type || context.typeName) && enumNamespace && enumName) {
                        context.type = this.serverType.container[qualifiedEnumTypeName] || this.serverType.container[context.enumName];
                        const containerType = Object.getPrototypeOf(this.serverType.container).constructor;
                        context.typeName =
                            Edm.getTypeName(containerType, qualifiedEnumTypeName, this.serverType.container) ||
                                Edm.getTypeName(containerType, enumName, this.serverType.container) ||
                                "Edm.Int32";
                    }
                    node[exports.ODATA_TYPE] = context.type;
                    node[exports.ODATA_TYPENAME] = context.typeName;
                    node.raw = `${context.type && context.type[node.value.name]}`;
                    node.value = context.typeName;
                }
            }
            else {
                context.literal = (type && type[node.value.name]) || node.value.name;
            }
        });
    }
    VisitEnumMemberValue(node, context, type) {
        context.literal = odata_v4_literal_1.Literal.convert(node.value, node.raw);
    }
    VisitRootExpression(node, context, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let rootValue = yield this.serverType.execute(node.raw.replace('$root/', ''), 'GET');
            node.type = lexer_1.TokenType.Literal;
            node.value = rootValue.elementType;
            node.raw = yield Edm.escape(rootValue.body.value, node.value);
            yield this.Visit(node, context, type);
        });
    }
}
exports.ResourcePathVisitor = ResourcePathVisitor;
//# sourceMappingURL=visitor.js.map