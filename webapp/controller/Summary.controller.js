let backendUrl = "http://localhost/skoleni/backend.php";

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/List",
    "sap/m/StandardListItem"
], function (Controller, MessageBox, StandardListItem, List) {
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
            let errors = {
                save: [false],
                print: [false]
            };
            // TODO: SAVE
            jQuery.ajax({
                url: backendUrl,
                method: "POST",
                data: {
                    data: JSON.stringify(this.getOwnerComponent().getModel("formValues").getProperty("/entry"))
                },
                success: function (data) {
                    errors.save[1] = new StandardListItem({
                        title: getI18nText("saveSuccess", that)
                    });
                }
            });

            // TODO: PRINT

            // TODO: messageBox - print and save success, or error states
            // TODO: error handling

            // TODO: reset formValues model, videoViewed model, backUp model, nav model

        },

        _onRouteMatched: function (oEvent) {

            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);

            let data = this.getOwnerComponent().getModel("formValues").getProperty("/entry");
            for (let values in data) {
                if (data[values] === "") {
                    this.getOwnerComponent().getRouter().navTo("startpage");
                    return;
                }
            }
            if (this.getOwnerComponent().getModel("nav").getProperty("/videoViewed") === false) {
                this.getOwnerComponent().getRouter().navTo("video", {language: lang});
            }
        }
    });
});
