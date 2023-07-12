"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="mocha" />
const index_1 = require("../lib/index");
class ValidationError extends index_1.HttpRequestError {
    constructor() {
        super(400, "ODataValidationError");
    }
}
class MyCustomValidation {
    static validate(query) {
        // throw error when using any query
        if ((typeof query == "object" && query && query.type != "ODataUri") || typeof query == "string")
            throw new ValidationError();
    }
}
class BaseController extends index_1.ODataController {
    query(ast) {
        return [];
    }
    filter(id, ast) {
        return {};
    }
}
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.query)
], BaseController.prototype, "query", null);
tslib_1.__decorate([
    index_1.odata.GET,
    tslib_1.__param(0, index_1.odata.key), tslib_1.__param(1, index_1.odata.filter)
], BaseController.prototype, "filter", null);
let ValidationController = class ValidationController extends BaseController {
};
ValidationController = tslib_1.__decorate([
    index_1.odata.validation(MyCustomValidation, {})
], ValidationController);
class NoValidationController extends BaseController {
}
let ValidationServer = class ValidationServer extends index_1.ODataServer {
};
ValidationServer = tslib_1.__decorate([
    index_1.odata.validation(MyCustomValidation, {}),
    index_1.odata.controller(ValidationController, true),
    index_1.odata.controller(NoValidationController, true)
], ValidationServer);
describe("ODataValidation", () => {
    it("should throw validation error (@odata.query)", () => {
        return new Promise((resolve, reject) => {
            try {
                ValidationServer.execute("/Validation?$filter=Id eq 1").then(() => {
                    reject(new Error("should throw validation error"));
                }, (err) => {
                    if (err instanceof ValidationError)
                        return resolve();
                    reject(new Error("should throw validation error"));
                }).catch(err => {
                    resolve();
                });
            }
            catch (err) {
                if (err instanceof ValidationError)
                    return resolve();
                reject(new Error("should throw validation error"));
            }
        });
    });
    it("should throw validation error (@odata.filter)", () => {
        return new Promise((resolve, reject) => {
            try {
                ValidationServer.execute("/Validation(1)?$filter=Id eq 1").then(() => {
                    reject(new Error("should throw validation error"));
                }, (err) => {
                    if (err instanceof ValidationError)
                        return resolve();
                    reject(new Error("should throw validation error"));
                }).catch(err => {
                    resolve();
                });
            }
            catch (err) {
                if (err instanceof ValidationError)
                    return resolve();
                reject(new Error("should throw validation error"));
            }
        });
    });
    it("should pass without validation error (@odata.query)", () => {
        return new Promise((resolve, reject) => {
            ValidationServer.execute("/Validation").then(() => {
                resolve();
            }, (err) => {
                if (err instanceof ValidationError)
                    return reject(new Error("should pass without validation error"));
                resolve();
            });
        });
    });
    it("should pass without validation error (@odata.filter)", () => {
        return new Promise((resolve, reject) => {
            ValidationServer.execute("/Validation(1)").then(() => {
                resolve();
            }, (err) => {
                if (err instanceof ValidationError)
                    return reject(new Error("should pass without validation error"));
                resolve();
            });
        });
    });
    it("should pass without validation error (@odata.query without @odata.validation)", () => {
        return new Promise((resolve, reject) => {
            ValidationServer.execute("/NoValidation?$filter=Id eq 1").then(() => {
                resolve();
            }, (err) => {
                if (err instanceof ValidationError)
                    return reject(new Error("should pass without validation error"));
                resolve();
            });
        });
    });
    it("should pass without validation error (@odata.filter without @odata.validation)", () => {
        return new Promise((resolve, reject) => {
            ValidationServer.execute("/NoValidation(1)?$filter=Id eq 1").then(() => {
                resolve();
            }, (err) => {
                if (err instanceof ValidationError)
                    return reject(new Error("should pass without validation error"));
                resolve();
            });
        });
    });
});
//# sourceMappingURL=validator.spec.js.map