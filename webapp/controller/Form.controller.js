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

            // Settings on nav to this view
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("form").attachPatternMatched(this._onRouteMatched, this);

            oView = this.getView();
            inputs = [
                oView.byId("FirstName"),
                oView.byId("LastName"),
                oView.byId("Company")
            ];

            // Set model for default state of the view
            setTimeout(() => {
                UI = {
                    form: {
                        title: getI18nText("form", that)
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

            // Check if all inputs are filled with correct input lengths
            inputs.forEach((input) => {
                let value = input.getValue();
                let id = input.getId().split("--");
                id = id[id.length - 1].replace("Input", "");
                maxLength = input.getMaxLength();
                let inputError = false;

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
                } else { // Check if input is letters (and spaces) only
                    switch (id) {
                        case "FirstName":
                            if (!value.match(/^[ \p{L}]+$/u) || value.split(" ").length > 2) {
                                input.setValueState("Error");
                                input.setValueStateText(getI18nText("dnmPatternName", that));
                                error = true;
                                inputError = true;
                            }
                            break;
                        case "LastName":
                            if (!value.match(/^[\p{L}]+$/u)) {
                                input.setValueState("Error");
                                input.setValueStateText(getI18nText("dnmPatternLastName", that));
                                error = true;
                                inputError = true;
                            }
                    }
                    if (!inputError) {
                        input.setValueState("None");
                        input.setValueStateText("");
                    }
                }
            });

            // If everything is correct, enable button to navigate to video view
            oView.byId("toVideo").setBlocked(error);
        },
        navForward: function () { // Navigate to video/summary view - depending on editForm state
            if (this.getOwnerComponent().getModel("nav").getProperty("/editForm")) {
                this.getOwnerComponent().getModel("nav").setProperty("/editForm", false);
                this.getOwnerComponent().getRouter().navTo("summary", {language: lang});
            } else
                this.getOwnerComponent().getRouter().navTo("video", {language: lang});
        },
        navBack: function () { // Navigate to starpage/summary view - depending on editForm state
            if (this.getOwnerComponent().getModel("nav").getProperty("/editForm")) { // If editForm is true, restore values from backup
                let values = copyObject(this.getOwnerComponent().getModel("backUp").getProperty("/entry"));
                this.getOwnerComponent().getModel("formValues").setProperty("/entry", values);

                this.getOwnerComponent().getModel("nav").setProperty("/editForm", false);
                this.getOwnerComponent().getRouter().navTo("summary", {language: lang});
            } else
                this.getOwnerComponent().getRouter().navTo("startpage");
        },

        _onRouteMatched: function (oEvent) {
            var language = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(language) ? language : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);

            // Different texts for different view states
            setTimeout(() => {
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
                    UI.form.title = getI18nText("form", that);
                    UI.button.text = getI18nText("toVideo", that);
                    oData = UI;
                }
                let oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "UI");
                this.formCheck();
            }, 100);
        }
    });
});
