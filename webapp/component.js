let langCodes = ["eng", "cz", "pol", "de"];
let backendUrl = "backend.php";

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
], function (UIComponent, JSONModel) {
    "use strict";
    return UIComponent.extend("sap.ui.skoleni.Component", {

        metadata: {
            manifest: "json"
        },
        init: function () {

            UIComponent.prototype.init.apply(this, arguments);

            this.refresh();

            this.getRouter().initialize();
        },
        refresh: function () {
            var oModel = new JSONModel();
            this.setModel(oModel);

            var oData = {
                entry: {
                    FirstName: "",
                    LastName: "",
                    Company: ""
                }
            }
            oModel = new JSONModel(oData);
            this.setModel(oModel, "formValues");
            oModel = new JSONModel(copyObject(oData));
            this.setModel(oModel, "backUp");

            oData = {
                reCheck: false,
                videoViewed: false
            }
            oModel = new JSONModel(oData);
            this.setModel(oModel, "nav");
        }
    });
})

function getI18nText(key, That, params = []) {
    if (params.length > 0) {
        return That.getView().getModel("i18n").getResourceBundle().getText(key, params);
    }
    return That.getView().getModel("i18n").getResourceBundle().getText(key);
}

function copyObject(obj = {}) {
    return JSON.parse(JSON.stringify(obj));
}