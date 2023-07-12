"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="mocha" />
const index_1 = require("../lib/index");
const { expect } = require("chai");
class Address {
}
tslib_1.__decorate([
    index_1.Edm.String
], Address.prototype, "City", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Address.prototype, "Address", void 0);
tslib_1.__decorate([
    index_1.Edm.String
], Address.prototype, "Zip", void 0);
tslib_1.__decorate([
    index_1.Edm.Int32
], Address.prototype, "Nr", void 0);
class User {
}
tslib_1.__decorate([
    index_1.Edm.Key,
    index_1.Edm.Int32
], User.prototype, "Id", void 0);
tslib_1.__decorate([
    index_1.Edm.ComplexType(Address)
], User.prototype, "Address", void 0);
let UsersController = class UsersController extends index_1.ODataController {
    users() {
        return [{
                Id: 1,
                Address: {
                    City: "Gadgetzan",
                    Address: "Mean Street",
                    Zip: "1234",
                    Nr: 1234
                }
            }];
    }
};
tslib_1.__decorate([
    index_1.odata.GET
], UsersController.prototype, "users", null);
UsersController = tslib_1.__decorate([
    index_1.odata.type(User)
], UsersController);
let TestServer = class TestServer extends index_1.ODataServer {
};
TestServer = tslib_1.__decorate([
    index_1.odata.controller(UsersController, true)
], TestServer);
describe("OData projection", () => {
    it("should return projected entities when using $select", () => {
        return TestServer.execute("/Users?$select=Id").then(result => expect(result).to.deep.equal({
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Users(Id)",
                value: [{
                        "@odata.id": "http://localhost/Users(1)",
                        Id: 1
                    }]
            },
            contentType: "application/json",
            elementType: User
        }));
    });
    it("should return projected entities with complex type when using $select", () => {
        return TestServer.execute("/Users?$select=Address").then(result => expect(result).to.deep.equal({
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Users(Address)",
                value: [{
                        "@odata.id": "http://localhost/Users(1)",
                        Address: {
                            City: "Gadgetzan",
                            Address: "Mean Street",
                            Zip: "1234",
                            Nr: 1234
                        }
                    }]
            },
            contentType: "application/json",
            elementType: User
        }));
    });
    it("should return projected entities with projected complex type when using $select", () => {
        return TestServer.execute("/Users?$select=Address/City").then(result => expect(result).to.deep.equal({
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Users(Address/City)",
                value: [{
                        "@odata.id": "http://localhost/Users(1)",
                        Address: {
                            City: "Gadgetzan"
                        }
                    }]
            },
            contentType: "application/json",
            elementType: User
        }));
    });
    it("should return projected entities with projected complex type when using $select and odata.metadata=full", () => {
        return TestServer.execute({
            url: "/Users?$select=Address/City,Address/Nr",
            metadata: index_1.ODataMetadataType.full
        }).then(result => expect(result).to.deep.equal({
            statusCode: 200,
            body: {
                "@odata.context": "http://localhost/$metadata#Users(Address/City,Address/Nr)",
                value: [{
                        "@odata.id": "http://localhost/Users(1)",
                        "@odata.type": "#Default.User",
                        Address: {
                            "@odata.type": "#Default.Address",
                            City: "Gadgetzan",
                            Nr: 1234,
                            "Nr@odata.type": "#Int32"
                        },
                        "Address@odata.type": "#Default.Address"
                    }]
            },
            contentType: "application/json",
            elementType: User
        }));
    });
});
//# sourceMappingURL=projection.spec.js.map