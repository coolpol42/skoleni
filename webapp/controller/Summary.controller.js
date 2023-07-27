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

            // Settings on nav to this view
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("summary").attachPatternMatched(this._onRouteMatched, this);

        },
        navToForm: function () {
            // Create backup of the form values
            let values = copyObject(this.getOwnerComponent().getModel("formValues").getProperty("/entry"));
            this.getOwnerComponent().getModel("backUp").setProperty("/entry", values);

            // Changing the state for the form view
            this.getOwnerComponent().getModel("nav").setProperty("/editForm", true);
            this.getOwnerComponent().getRouter().navTo("form", {language: lang});
        },
        printAndSave: function () {
            this.getView().setBusy(true);
            let errors = {
                save: [undefined, ""],
                print: [undefined, ""]
            };
            let entry = this.getOwnerComponent().getModel("formValues").getProperty("/entry");

            jQuery.ajax({
                url: backendUrl,
                method: "POST",
                data: {
                    action: "save",
                    data: JSON.stringify(this.getOwnerComponent().getModel("formValues").getProperty("/entry")),
                    language: lang,
                    texts: JSON.stringify({
                        "DateOfEntry": getI18nText("DateOfEntry", that),
                    })
                },
                success: function (message) {
                    console.log(message);
                    errors = JSON.parse(message);
                },
                error: function (message) {
                    console.info("DDD"); // TODO: can't be connected to the script
                }
            });


            // errors.save[0] = true;
            // errors.save[1] = "saveLocally"
            //
            // // TODO: PRINT
            // errors.print[0] = true;
            // errors.print[1] = "printError"


            // Setting values for the list items for the messageBox

            let interval = setInterval(() => {
                if (errors.save[0] !== undefined || errors.print[0] !== undefined) {
                    clearInterval(interval);
                    this.getView().setBusy(false);

                    let actions = [MessageBox.Action.OK];
                    let emphasizedAction = "";

                    if (errors.save[1] === "dataError") {
                        actions.push(getI18nText("editValues", that));
                        emphasizedAction = getI18nText("editValues", that);
                    } else if (errors.print[1] === "printError") {
                        actions.push(getI18nText("printAgain", that));
                        emphasizedAction = getI18nText("printAgain", that);
                    }


                    errors.save[1] = new StandardListItem({
                        title: getI18nText("toSave", this).toUpperCase(),
                        description: getI18nText(errors.save[1], this),
                        icon: getIcon(errors.save[0])
                    });
                    errors.print[1] = new StandardListItem({
                        title: getI18nText("toPrint", this).toUpperCase(),
                        description: getI18nText(errors.print[1], this),
                        icon: getIcon(errors.print[0]),
                    });

                    // Creating list of items for the messageBox
                    let list = new List({
                        mode: "None",
                        items: [errors.save[1], errors.print[1]],
                        showSeparators: "None"
                    });

                    switch (Math.max(errors.save[0], errors.print[0])) {
                        case 0:
                            MessageBox.success(list, {
                                actions: actions,
                                title: getI18nText("pnsSuccess", that),
                                emphasizedAction: emphasizedAction,
                                onClose: function (sAction) {
                                    that.onCloseMB(sAction);
                                }
                            });
                            break;
                        case 1:
                            MessageBox.warning(list, {
                                actions: actions,
                                title: getI18nText("pnsWarning", that),
                                emphasizedAction: emphasizedAction,
                                onClose: function (sAction) {
                                    that.onCloseMB(sAction);
                                }
                            });
                            break;
                        case 2:
                            MessageBox.error(list, {
                                actions: actions,
                                title: getI18nText("pnsError", that),
                                emphasizedAction: emphasizedAction,
                                onClose: function (sAction) {
                                    that.onCloseMB(sAction);
                                }
                            });
                    }

                    // if (!errors.save[0] && !errors.print[0]) {
                    //     MessageBox.success(list, {
                    //         actions: [MessageBox.Action.OK],
                    //         title: getI18nText("pnsSuccess", that),
                    //         onClose: function () {
                    //             that.reset();
                    //         }
                    //     });
                    // } else if (errors.save[0] && !errors.print[0]) {
                    //     MessageBox.warning(list, {
                    //         actions: [MessageBox.Action.OK],
                    //         title: getI18nText("pnsSuccess", that),
                    //         onClose: function () {
                    //             that.reset();
                    //         }
                    //     });
                    // } else if (errors.save[1].getDescription() === getI18nText("dataError", that)) {
                    //     MessageBox.error(list, {
                    //         actions: [MessageBox.Action.OK, getI18nText("editValues", that)],
                    //         emphasizedAction: getI18nText("editValues", that),
                    //         title: getI18nText("pnsError", that),
                    //         onClose: function (sAction) {
                    //             if (sAction === getI18nText("editValues", that)) {
                    //                 that.navToForm();
                    //             }
                    //         }
                    //     });
                    // } else {
                    //     MessageBox.error(list, {
                    //         actions: [MessageBox.Action.OK, getI18nText("printAgain", that)],
                    //         emphasizedAction: getI18nText("printAgain", that),
                    //         title: getI18nText("pnsError", that),
                    //     });
                    // }
                }
            }, 1000);

            function getIcon(errorState) {
                switch (errorState) {
                    case 0:
                        return "sap-icon://accept";
                    case 1:
                        return "sap-icon://warning";
                    case 2:
                        return "sap-icon://error";
                }
            }

        },
        onCloseMB: function (sAction) {
            if (sAction === getI18nText("editValues", that)) {
                that.navToForm();
            } else {
                that.reset();
            }
        },
        print: function () {
            jQuery.ajax({
                url: backendUrl,
                method: "POST",
                data: {
                    action: "print",
                    data: JSON.stringify(this.getOwnerComponent().getModel("formValues").getProperty("/entry"))
                },
                success: function (message) {
                    return message;
                }
            });
        },
        // reset: function () {
        //     this.getOwnerComponent().refresh();
        //     this.getOwnerComponent().getRouter().navTo("startpage");
        // },
        _onRouteMatched: function (oEvent) {

            var language = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(language) ? language : "eng";

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
