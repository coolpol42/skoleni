"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const es = require("event-stream");
const index_1 = require("../lib/index");
class TestController extends index_1.ODataController {
    find() {
        return [{
                a: 1
            }, {
                b: 2
            }, {
                t: Date.now()
            }];
    }
    findOne(key) {
        return {
            id: key,
            t: Date.now()
        };
    }
}
tslib_1.__decorate([
    index_1.odata.GET
], TestController.prototype, "find", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key)
], TestController.prototype, "findOne", null);
let TestServer = class TestServer extends index_1.ODataServer {
};
TestServer = tslib_1.__decorate([
    index_1.odata.controller(TestController, true)
], TestServer);
exports.TestServer = TestServer;
TestServer.execute("/Test/$count", "GET").then((result) => {
    console.log(result);
});
let server = new TestServer();
server.pipe(es.mapSync(data => console.log(data)));
setInterval(() => {
    server.write({
        url: "/Test(" + Math.floor(Math.random() * 1000) + ")",
        method: "GET"
    });
}, 1000);
//# sourceMappingURL=test.js.map