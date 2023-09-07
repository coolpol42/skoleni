sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/List",
    "sap/m/StandardListItem"
], function (Controller, MessageBox, List, StandardListItem) {
    "use strict";
    var that, lang, printTimes, timeOut, request, labelData;
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
            if (action === "save") {
                errors.save = [];
                request = jQuery.ajax({
                    url: backendUrl,
                    method: "POST",
                    data: {
                        action: "save",
                        data: JSON.stringify(this.getOwnerComponent().getModel("formValues").getProperty("/entry")),
                        language: lang,
                        texts: JSON.stringify({
                            "DateOfEntry": getI18nText("DateOfEntry", that),
                            "NotTransferable": getI18nText("NotTransferable", that),
                        })
                    },
                    success: function (message) {
                        if (message.includes(">")) { // Message can include Warnings/Errors from the PHP script
                            message = message.split(">"); // Removal of the warnings/errors from the message
                            message = message[message.length - 1];
                        }
                        errors.save = JSON.parse(message).save;
                        labelData = JSON.parse(message).print;
                        if (errors.save[0] < 2) { // If the save was successful, the print is made
                            that.sendRequest("print");
                        } else
                            errors.print = [2, "printNotMade"];

                    },
                    error: function () { // If the connection to the backend fails
                        errors = {
                            save: [3, "sConnectionError"],
                            print: [3, "printNotMade"]
                        }
                    }
                });
            } else if (action === "print") {
                printTimes++;
                errors.print = [];

                if (!printer) {
                    getPrinter();
                    if (!printer) {
                        errors.print = [2, "printerNotConnected"];
                    }
                } else {
                    printer.isPrinterReady(
                        function () {
                            let out = "^XA\n" +
                                "^CI28" +
                                "^MMC\n" +
                                "^PW799\n" +
                                "^LL0609\n" +
                                "^LS0\n" +
                                "^FT10,160^A0N,70,67^FB779,2,0,C^FH\\^FD" + (labelData["FirstName"] + " " + labelData["LastName"]).toUpperCase() + "^FS\n" +
                                "^FT15,310^A0N,39,38^FB769,3,10,C^FH\\^FD" + labelData["Company"] + "^FS\n" +
                                "^FO21,332^GB763,0,4^FS" +

                                "^FO55,407^GFA^GFA,03072,03072,00032,:Z64:\n" +
                                "eJzt1EFuxCAMBVAjpLLkCDkKF+rsK3Uqsuu12PUac4QsGU0UN2CSegYSryvxNwQ9CWFjBaCnp+c/B1OWtE6gEEdwSBkzK9qkNYJGDOCLh+yauxHcCu4E94Jj04MpropPAE3XghvBreDDn/uWuwMv7xA9pq/se7jjfOr3tUNn/iBY3aSBqBzxVtweeCBfC+WeMudnyT6UgXtxt51vj30SPAo+1664L7XnuOJIzusDKqn4mJ3359kDuTnyG7mmm9Y+kcNLdo95w92nM1cvda4l+KfDseFL2x+C3wWPknvBHfdr7QNztdRumeufsXLD3HzWrrl/heLT7or52/vmNF/b/2n3a8M984+GO+aXhg/sfpexdsvq/264Yf1D6Ok5zy9J2vtO:CD6B^FS" +

                                "^FT128,391^A0N,39,38^FH\\^FD" + getI18nText("DateOfEntry", that) + ": " + labelData["DateOfEntry"] + "^FS\n" +
                                "^FT636,487^A0N,65,62^FH\\^FD" + labelData["Language"].toUpperCase() + "^FS\n" +
                                "^FT106,562^A0N,28,28^FB588,2,0,C^FH\\^FD" + getI18nText("NotTransferable", that) + "^FS" +
                                "^PQ1,0,1,Y^XZ"
                            printer.query(out)
                                .then(function () {
                                    // Command sent successfully, now let's get the status
                                    return printer.isPrinterReady();
                                })
                                .then(function () {
                                    // We got the status, let's print it
                                    errors.print = [0, "printSuccess"];
                                })
                                .catch(function (error) {
                                    // An error occurred
                                    errors.print = printerResponse(error);
                                });
                        },
                        (response) => {
                            errors.print = printerResponse(response)
                        });
                }

            }
            timeOut = setTimeout(() => {
                this.getView().setBusy(false);
                request.abort();
                if (errors.save[0] === undefined) {
                    errors = {
                        save: [3, "sConnectionError"],
                        print: [3, "printNotMade"]
                    }
                } else if (errors.print[0] === undefined) {
                    errors.print = [2, "printerNotResponding"];
                }
            }, 30000);

            function printerResponse(response) {
                let out;
                printer.clearRequestQueue();
                switch (response) {
                    case "Paused":
                        out = [1, "printerPaused"];
                        break;
                    case "Paper Out":
                        out = [2, "printerPaperOut"];
                        break;
                }
                return out;
            }
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
                if (errors.save[0] !== undefined && errors.print[0] !== undefined) {
                    clearTimeout(timeOut);
                    clearInterval(interval);
                    this.getView().setBusy(false);

                    let actions = [MessageBox.Action.OK];
                    let emphasizedAction = "";

                    // Setting the actions and emphasizedAction for the messageBox according to the error state
                    if (errors.save[1] === "dataError") {
                        actions.push(getI18nText("editValues", that));
                        emphasizedAction = getI18nText("editValues", that);
                    } else if (errors.print[0] > 0) {
                        actions = [getI18nText("printAgain", that)];
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
                        actions = [getI18nText("printAgain", that)];
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
            labelData = {};

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