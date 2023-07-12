"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../lib/index");
const test_model_1 = require("./test.model");
const { expect } = require("chai");
describe("OData ES6 .define()", () => {
    class DefTestController extends index_1.ODataController {
        all() {
        }
        one(key) {
        }
    }
    it("should throw decorator error", () => {
        try {
            DefTestController.define(index_1.odata.type(test_model_1.DefTest), {
                all: index_1.odata.GET,
                one: [index_1.odata.GET, {
                        key: index_1.odata.key
                    }]
            }, "ex");
        }
        catch (err) {
            expect(err.message).to.equal("Unsupported decorator on DefTestController using ex");
        }
    });
    it("should throw member decorator error", () => {
        try {
            DefTestController.define(index_1.odata.type(test_model_1.DefTest), {
                all: index_1.odata.GET,
                one: [index_1.odata.GET, {
                        key: index_1.odata.key
                    }],
                ex: "ex"
            });
        }
        catch (err) {
            expect(err.message).to.equal("Unsupported member decorator on DefTestController at ex using ex");
        }
    });
    it("should throw parameter decorator error", () => {
        try {
            DefTestController.define(index_1.odata.type(test_model_1.DefTest), {
                all: index_1.odata.GET,
                one: [index_1.odata.GET, {
                        key: index_1.odata.key,
                        ex: "ex"
                    }]
            });
        }
        catch (err) {
            expect(err.message).to.equal("Unsupported parameter decorator on DefTestController at one.ex using ex");
        }
    });
});
//# sourceMappingURL=define.spec.js.map