"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lib_1 = require("../lib");
let Category = class Category {
    constructor(title) {
        this.id = Math.floor(Math.random() * 100);
        this.title = title;
    }
};
tslib_1.__decorate([
    lib_1.Edm.Key,
    lib_1.Edm.Computed,
    lib_1.Edm.Int32
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    lib_1.Edm.String
], Category.prototype, "title", void 0);
Category = tslib_1.__decorate([
    lib_1.odata.namespace("InheritanceSchema")
], Category);
exports.Category = Category;
let Subcategory = class Subcategory extends Category {
    constructor(title, subtitle) {
        super(title);
        this.subtitle = subtitle;
    }
};
tslib_1.__decorate([
    lib_1.Edm.String
], Subcategory.prototype, "subtitle", void 0);
Subcategory = tslib_1.__decorate([
    lib_1.odata.namespace("Default")
], Subcategory);
exports.Subcategory = Subcategory;
let Subcategory2 = class Subcategory2 extends Category {
    constructor(title, subtitle) {
        super(title);
        this.subtitle2 = subtitle;
    }
};
tslib_1.__decorate([
    lib_1.Edm.String
], Subcategory2.prototype, "subtitle2", void 0);
Subcategory2 = tslib_1.__decorate([
    lib_1.odata.namespace("Default")
], Subcategory2);
exports.Subcategory2 = Subcategory2;
class SubcategoryDetails extends Subcategory {
    constructor(title, subtitle, description) {
        super(title, subtitle);
        this.description = description;
        this.subid = Math.floor(Math.random() * 100) + 1000;
    }
}
tslib_1.__decorate([
    lib_1.Edm.String
], SubcategoryDetails.prototype, "description", void 0);
tslib_1.__decorate([
    lib_1.Edm.Key,
    lib_1.Edm.Int32
], SubcategoryDetails.prototype, "subid", void 0);
exports.SubcategoryDetails = SubcategoryDetails;
let InheritanceController = class InheritanceController extends lib_1.ODataController {
    all() {
        return [
            { id: 123, title: "Games", "@odata.type": Category },
            new Category("Games"),
            new Subcategory("Games", "Hearthstone"),
            new Subcategory2("Games", "Diablo 3"),
            new SubcategoryDetails("Games", "Diablo 3", "RPG game")
        ];
    }
    one(_, __) {
        return new SubcategoryDetails("Games", "Diablo 3", "RPG game");
    }
    insert(data, type) {
        console.log('@odata.type', type, data);
        return data;
    }
};
tslib_1.__decorate([
    lib_1.odata.GET
], InheritanceController.prototype, "all", null);
tslib_1.__decorate([
    lib_1.odata.GET,
    tslib_1.__param(0, lib_1.odata.key), tslib_1.__param(1, lib_1.odata.key)
], InheritanceController.prototype, "one", null);
tslib_1.__decorate([
    lib_1.odata.POST,
    tslib_1.__param(0, lib_1.odata.body), tslib_1.__param(1, lib_1.odata.type)
], InheritanceController.prototype, "insert", null);
InheritanceController = tslib_1.__decorate([
    lib_1.odata.type(Subcategory)
], InheritanceController);
exports.InheritanceController = InheritanceController;
let InheritanceServer = class InheritanceServer extends lib_1.ODataServer {
};
InheritanceServer = tslib_1.__decorate([
    lib_1.odata.controller(InheritanceController, true),
    lib_1.odata.controller(InheritanceController, "Inheritance2")
], InheritanceServer);
exports.InheritanceServer = InheritanceServer;
InheritanceServer.create(3000);
//# sourceMappingURL=inheritance.js.map