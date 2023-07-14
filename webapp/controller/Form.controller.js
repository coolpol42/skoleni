let backendUrl = "http://localhost/skoleni/backend.php";

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller) {
    "use strict";
    var that, maxLength, inputs, oView, lang;
    var minLength = 3;
    return Controller.extend("sap.ui.skoleni.controller.Form", {
        onInit: function () {
            that = this;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("form").attachPatternMatched(this._onRouteMatched, this);

            oView = this.getView();
            inputs = [
                oView.byId("name"),
                oView.byId("surname"),
                oView.byId("company")
            ];
        },
        formCheck: function () {
            let error = false;

            inputs.forEach((input) => {
                let id = input.getId();
                let value = input.getValue();
                let name = id.split("--");
                name = name[name.length - 1].replace("Input", "");

                maxLength = input.getMaxLength();

                if (value.length === 0) {
                    error = true;
                    input.setValueState("None");
                    input.setValueStateText("");
                } else if (value.length < minLength || value.length > maxLength) {
                    input.setValueState("Error");
                    let lim = value.length < minLength ? "Min" : "Max";
                    let param = value.length < minLength ? minLength : maxLength;

                    input.setValueStateText(getI18nText("dnm" + lim + "Length", that, [param]));
                    error = true;
                } else {
                    input.setValueState("None");
                    input.setValueStateText("");
                }
            });

            if (!error) {
                let data = this.getOwnerComponent().getModel("formValues").getProperty("/entry");
                oView.byId("toVideo").setVisible(true);
            } else {
                oView.byId("toVideo").setVisible(false);
            }
        },
        navForward: function () {
            this.getOwnerComponent().getRouter().navTo("video", {language: lang});
        },
        navBack: function () {
            this.getOwnerComponent().getRouter().navTo("startpage");
        },

        _onRouteMatched: function (oEvent) {
            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);
        }
    });
});