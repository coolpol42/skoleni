let backendUrl = "http://localhost/skoleni/backend.php";

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/List",
    "sap/m/StandardListItem"
], function (Controller, MessageBox, List, StandardListItem) {
    "use strict";
    var that, lang;
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
                save: [false, "saveSuccess"],
                print: [false, "printSuccess"]
            };
            // TODO: SAVE
            // jQuery.ajax({
            //     url: backendUrl,
            //     method: "POST",
            //     data: {
            //         data: JSON.stringify(this.getOwnerComponent().getModel("formValues").getProperty("/entry"))
            //     },
            //     success: function (data) {
            //         errors.save[1] = new StandardListItem({
            //             title: getI18nText("saveSuccess", this)
            //         });
            //     }
            // });


            // errors.save[0] = true;
            // errors.save[1] = "saveLocally"
            //
            // // TODO: PRINT
            // errors.print[0] = true;
            // errors.print[1] = "printError"


            // TODO: messageBox - print and save success, or error states
            // TODO: error handling


            errors.save[1] = new StandardListItem({
                title: getI18nText("toSave", this).toUpperCase(),
                description: getI18nText(errors.save[1], this),
                icon: (errors.save[0] ? "sap-icon://warning" : "sap-icon://accept")
            });
            errors.print[1] = new StandardListItem({
                title: getI18nText("toPrint", this).toUpperCase(),
                description: getI18nText(errors.print[1], this),
                icon: (errors.print[0] ? "sap-icon://error" : "sap-icon://accept"),
            });

            let list = new List({mode: "None", items: [errors.save[1], errors.print[1]], showSeparators: "None"});
            if (!errors.save[0] && !errors.print[0]) {
                MessageBox.success(list, {
                    actions: [MessageBox.Action.OK],
                    title: getI18nText("pnsSuccess", that),
                    onClose: function () {
                        that.reset();
                    }
                });
            } else if (errors.save[0] && !errors.print[0]) {
                MessageBox.warning(list, {
                    actions: [MessageBox.Action.OK],
                    title: getI18nText("pnsSuccess", that),
                });
            } else {
                MessageBox.error(list, {
                    actions: [MessageBox.Action.OK, getI18nText("printAgain", that)],
                    emphasizedAction: getI18nText("printAgain", that),
                    title: getI18nText("pnsError", that),
                });
            }

        },
        reset: function () {
            this.getOwnerComponent().refresh();
            this.getOwnerComponent().getRouter().navTo("startpage");
        },
        _onRouteMatched: function (oEvent) {

            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);

            // let data = this.getOwnerComponent().getModel("formValues").getProperty("/entry");
            // for (let values in data) {
            //     if (data[values] === "") {
            //         this.getOwnerComponent().getRouter().navTo("startpage");
            //         return;
            //     }
            // }
            // if (this.getOwnerComponent().getModel("nav").getProperty("/videoViewed") === false) {
            //     this.getOwnerComponent().getRouter().navTo("video", {language: lang});
            // }
        }
    });
});
