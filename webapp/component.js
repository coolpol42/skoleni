let langCodes = ["eng", "cz", "pol", "de"];

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

            var oModel = new JSONModel();
            this.setModel(oModel);

            var oData = {
                entry: {
                    name: "",
                    surname: "",
                    company: ""
                }
            }
            oModel = new JSONModel(oData);
            this.setModel(oModel, "formValues");

            this.getRouter().initialize();
        },
    });
})

function getI18nText(key, That, params = []) {
    if (params.length > 0) {
        return That.getView().getModel("i18n").getResourceBundle().getText(key, params);
    }
    return That.getView().getModel("i18n").getResourceBundle().getText(key);
}