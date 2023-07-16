sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";
    var that, oView, lang, video;
    return Controller.extend("sap.ui.skoleni.controller.Form", {
        onInit: function () {
            that = this;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("summary").attachPatternMatched(this._onRouteMatched, this);

        },
        navToForm: function () {
            let values = copyObject(this.getOwnerComponent().getModel("formValues").getProperty("/entry"));
            this.getOwnerComponent().getModel("backUp").setProperty("/entry", values);

            this.getOwnerComponent().getModel("nav").setProperty("/editForm", true);
            this.getOwnerComponent().getRouter().navTo("form", {language: lang});
        },
        printAndSave: function () {

        },

        _onRouteMatched: function (oEvent) {
            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);
        }
    });
});
