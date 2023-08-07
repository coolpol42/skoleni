sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/List",
    "sap/m/StandardListItem"
], function (Controller, MessageBox, List, StandardListItem) {
    "use strict";
    var that, lang, printTimes, timeOut, request;
    var errors = {
        save: [],
        print: []
    }
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
        sendRequest: function (action) {
            this.getView().setBusy(true);
            request = jQuery.ajax({
                url: backendUrl,
                method: "POST",
                data: {
                    action: action,
                    data: JSON.stringify(this.getOwnerComponent().getModel("formValues").getProperty("/entry")),
                    language: lang,
                    texts: JSON.stringify({
                        "DateOfEntry": getI18nText("DateOfEntry", that),
                        "NotTransferable": getI18nText("NotTransferable", that),
                    })
                },
                success: function (message) {
                    console.log(message);
                    printTimes++;
                    if (message.includes(">")) { // Message can include Warnings/Errors from the PHP script
                        message = message.split(">"); // Removal of the warnings/errors from the message
                        message = message[message.length - 1];
                    }
                    errors = JSON.parse(message);
                },
                error: function () { // If the connection to the backend fails
                    errors = {
                        save: [3, "sConnectionError"],
                        print: [3, "printNotMade"]
                    }
                }
            });
            timeOut = setTimeout(() => {
                this.getView().setBusy(false);
                request.abort();
                errors = {
                    save: [3, "sConnectionError"],
                    print: [3, "printNotMade"]
                }
            }, 60000);
        },
        messageBox: function (errors, actions, emphasizedAction, list) {
            switch (Math.max(errors.save[0], errors.print[0])) { // Getting the highest error state
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
                    break;
                case 3:
                    MessageBox.error(list, {
                        actions: [MessageBox.Action.OK],
                        title: getI18nText("connectionError", that),
                        onClose: function (sAction) {
                            that.onCloseMB(sAction);
                        }
                    });
            }
        },
        printAndSave: function () {
            this.sendRequest("save");

            let interval = setInterval(() => {
                if (errors.save[0] !== undefined || errors.print[0] !== undefined) {
                    clearTimeout(timeOut);
                    clearInterval(interval);
                    this.getView().setBusy(false);

                    let actions = [MessageBox.Action.OK];
                    let emphasizedAction = "";

                    // Setting the actions and emphasizedAction for the messageBox according to the error state
                    if (errors.save[1] === "dataError") {
                        actions.push(getI18nText("editValues", that));
                        emphasizedAction = getI18nText("editValues", that);
                    } else if (errors.print[0] === 2) {
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

                    this.messageBox(errors, actions, emphasizedAction, list);
                }
            }, 1000);

        },
        onCloseMB: function (sAction) {
            if (sAction === getI18nText("editValues", that)) {
                that.navToForm();
            } else if (sAction === getI18nText("printAgain", that)) {
                that.print();
            } else {
                that.reset();
            }
        },
        print: function () {
            if (printTimes < 3) { // If the print fails 3 times, the print cannot be repeated
                errors.print = [undefined, ""]
                this.sendRequest("print");
            } else
                errors.print = [2, "printErrorFinal"];

            let interval = setInterval(() => {
                if (errors.print[0] !== undefined) {
                    clearTimeout(timeOut);
                    clearInterval(interval);
                    this.getView().setBusy(false);

                    let actions = [MessageBox.Action.OK];
                    if (errors.print[0] > 0 && errors.print[1] !== "printErrorFinal") {
                        actions.push(getI18nText("printAgain", that));
                    }
                    errors.print[1] = new StandardListItem({
                        title: getI18nText("toPrint", this).toUpperCase(),
                        description: getI18nText(errors.print[1], this),
                        icon: getIcon(errors.print[0]),
                    });
                    let list = new List({
                        mode: "None",
                        items: [errors.print[1]],
                        showSeparators: "None"
                    });
                    errors.save = [0, ""];
                    this.messageBox(errors, actions, getI18nText("printAgain", that), list);
                }

            }, 1000);
        },
        reset: function () {
            this.getOwnerComponent().refresh();
            this.getOwnerComponent().getRouter().navTo("startpage");
        },
        _onRouteMatched: function (oEvent) {
            // Resetting the printTimes and errors
            printTimes = 0;
            errors = {
                save: [],
                print: []
            }

            var language = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(language) ? language : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);

            // If the form is not filled, the user is redirected to the startpage
            let data = this.getOwnerComponent().getModel("formValues").getProperty("/entry");
            for (let values in data) {
                if (data[values] === "") {
                    this.getOwnerComponent().getRouter().navTo("startpage");
                    return;
                }
            }
            // If the video is not viewed, the user is redirected to the video view
            if (this.getOwnerComponent().getModel("nav").getProperty("/videoViewed") === false) {
                this.getOwnerComponent().getRouter().navTo("video", {language: lang});
            }
        }
    });
});

// Function for getting the icon according to the error state
function getIcon(errorState) {
    switch (errorState) {
        case 0:
            return "sap-icon://accept";
        case 1:
            return "sap-icon://warning2";
        case 2:
        case 3:
            return "sap-icon://decline";
    }
}