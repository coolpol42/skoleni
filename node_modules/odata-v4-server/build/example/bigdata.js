"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const odata_v4_inmemory_1 = require("odata-v4-inmemory");
const index_1 = require("../lib/index");
let schemaJson = {
    version: "4.0",
    dataServices: {
        schema: [{
                namespace: "BigData",
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
                    name: "BigDataContext",
                    entitySet: [{
                            name: "Indices",
                            entityType: "BigData.Index"
                        }]
                }
            }]
    }
};
let schemaEntityTypeProperties = schemaJson.dataServices.schema[0].entityType[0].property;
const propertyCount = 1000;
for (let i = 0; i < propertyCount; i++) {
    schemaEntityTypeProperties.push({
        name: `Property${i}`,
        type: "Edm.String",
        nullable: true
    });
}
console.log("Schema ready.");
let bigdata = [];
const dataCount = 100;
for (let d = 0; d < dataCount; d++) {
    let data = {
        id: d
    };
    for (let i = 0; i < propertyCount; i++) {
        data[`Property${i}`] = `StringData${i}-${d}`;
    }
    bigdata.push(data);
}
console.log("Data ready.");
let Index = class Index {
};
tslib_1.__decorate([
    index_1.Edm.Int64
], Index.prototype, "id", void 0);
Index = tslib_1.__decorate([
    index_1.Edm.OpenType
], Index);
let IndicesController = class IndicesController extends index_1.ODataController {
    find(filter, query) {
        let mapper = it => it;
        if (query) {
            let $select = query.value.options.find(t => t.type == "Select");
            if ($select) {
                let props = $select.value.items.map(t => t.raw);
                mapper = it => {
                    let r = {};
                    props.forEach(p => r[p] = it[p]);
                    return r;
                };
            }
        }
        if (filter)
            return bigdata.filter(odata_v4_inmemory_1.createFilter(filter)).map(mapper);
        return bigdata.map(mapper);
    }
};
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter), tslib_1.__param(1, index_1.odata.query)
], IndicesController.prototype, "find", null);
IndicesController = tslib_1.__decorate([
    index_1.odata.type(Index)
], IndicesController);
let BigDataServer = class BigDataServer extends index_1.ODataServer {
};
BigDataServer = tslib_1.__decorate([
    index_1.odata.namespace("BigData"),
    index_1.odata.controller(IndicesController, true)
], BigDataServer);
BigDataServer.$metadata(schemaJson);
BigDataServer.create("/odata", 3000);
console.log("OData ready.");
//# sourceMappingURL=bigdata.js.map