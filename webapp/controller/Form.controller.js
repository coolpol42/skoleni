let backendUrl = "http://localhost/skoleni/backend.php";

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    var that, maxLength, inputs, oView, lang, UI;
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

            setTimeout(() => {
                UI = {
                    form: {
                        title: getI18nText("form", that),
                        buttonsEdit: false,
                        buttonsForm: true,
                    },
                    button: {
                        text: getI18nText("toVideo", that),
                        icon: "begin",
                        cancel: false
                    }
                };
                let oModel = new JSONModel(UI);
                oView.setModel(oModel, "UI");
            }, 300);
        },
        formCheck: function () {
            let error = false;

            inputs.forEach((input) => {
                let value = input.getValue();

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
            if (this.getOwnerComponent().getModel("nav").getProperty("/editForm")) {
                this.getOwnerComponent().getModel("nav").setProperty("/editForm", false);
                this.getOwnerComponent().getRouter().navTo("summary", {language: lang});
            } else
                this.getOwnerComponent().getRouter().navTo("video", {language: lang});
        },
        navBack: function () {
            if (this.getOwnerComponent().getModel("nav").getProperty("/editForm")) {
                let values = copyObject(this.getOwnerComponent().getModel("backUp").getProperty("/entry"));
                this.getOwnerComponent().getModel("formValues").setProperty("/entry", values);

                this.getOwnerComponent().getModel("nav").setProperty("/editForm", false);
                this.getOwnerComponent().getRouter().navTo("summary", {language: lang});
            } else
                this.getOwnerComponent().getRouter().navTo("startpage");
        },

        _onRouteMatched: function (oEvent) {
            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);

            let oData;
            if (this.getOwnerComponent().getModel("nav").getProperty("/editForm")) {
                oData = {
                    form: {
                        title: getI18nText("formEdit", that),
                    },
                    button: {
                        text: getI18nText("toSummary", that),
                        icon: "save",
                        cancel: true
                    }
                }
            } else {
                oData = UI;
            }
            let oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "UI");
        }
    });
});
