"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
const test_model_1 = require("./test.model");
const index_1 = require("../lib/index");
const { expect } = require("chai");
describe("Code coverage", () => {
    it("should return empty object when no public controllers on server", () => {
        expect(index_1.odata.getPublicControllers(test_model_1.NoServer)).to.deep.equal({});
    });
    it("should not allow non-OData methods", () => {
        try {
            test_model_1.NoServer.execute("/dev/null", "MERGE");
            throw new Error("MERGE should not be allowed");
        }
        catch (err) {
            expect(err.message).to.equal("Method not allowed.");
        }
    });
    it("should throw resource not found error", () => {
        return test_model_1.AuthenticationServer.execute("/Users", "DELETE").then(() => {
            throw new Error("should throw error");
        }, (err) => {
            expect(err.message).to.equal("Resource not found.");
        });
    });
});
//# sourceMappingURL=odata.spec.js.map