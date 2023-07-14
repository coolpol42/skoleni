sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.skoleni.controller.StartPage", {

        onInit: function () {
            // set mock model
            var sPath = sap.ui.require.toUrl("sap/ui/skoleni/src/languages/tiles.json"),
                oModel = new JSONModel(sPath);

            this.getView().setModel(oModel);

        },
        onSelect: function (oEvent) {
            var language = oEvent.getSource().getBindingContext().getProperty("code").toLowerCase();
            this.getOwnerComponent().getRouter().navTo("form", {
                "language": language
            });
        }
    });

});