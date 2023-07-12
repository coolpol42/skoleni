"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Benchmark = require("benchmark");
const odata_v4_inmemory_1 = require("odata-v4-inmemory");
const odata_v4_mongodb_1 = require("odata-v4-mongodb");
const index_1 = require("../lib/index");
let data = [];
let suite = new Benchmark.Suite();
class InMemoryController extends index_1.ODataController {
    find(filter) {
        odata_v4_inmemory_1.createFilter(filter);
        return data;
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], InMemoryController.prototype, "find", null);
class MongoDBController extends index_1.ODataController {
    find(filter) {
        odata_v4_mongodb_1.createFilter(filter);
        return data;
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.filter)
], MongoDBController.prototype, "find", null);
let BenchmarkServer = class BenchmarkServer extends index_1.ODataServer {
};
BenchmarkServer = tslib_1.__decorate([
    index_1.odata.controller(InMemoryController, true),
    index_1.odata.controller(MongoDBController, true)
], BenchmarkServer);
console.log("Benchmarking...");
suite.add("InMemory#filter", {
    defer: true,
    fn: (defer) => {
        BenchmarkServer.execute("/InMemory?$filter=Title eq 'Title'", "GET").then(() => defer.resolve());
    }
}).add("MongoDB#filter", {
    defer: true,
    fn: (defer) => {
        BenchmarkServer.execute("/MongoDB?$filter=Title eq 'Title'", "GET").then(() => defer.resolve());
    }
}).on("cycle", (event) => {
    console.log(event.target.toString());
}).run();
//# sourceMappingURL=benchmark.js.map