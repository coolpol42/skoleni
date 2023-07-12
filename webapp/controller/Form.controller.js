let backendUrl = "http://localhost/skoleni/backend.php";

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, MessageBox, List, StandardListItem, History) {
    "use strict";
    var that, minLength, inputs, oView;
    return Controller.extend("sap.ui.skoleni.controller.Form", {
        onInit: function () {
            that = this;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("form").attachPatternMatched(this._onRouteMatched, this);

            minLength = sap.ui.getCore().getModel("limits").getProperty("/minLength");
            oView = this.getView();
            inputs = [
                oView.byId("motor_currentInput"),
                oView.byId("open_pressureInput"),
                oView.byId("switch_pressureInput"),
                oView.byId("flowInput"),
                oView.byId("command_idInput"),
                oView.byId("pump_idInput")
            ];
        },
        changeLanguage: function (oEvent) {
            var selectedKey = oEvent.getSource().getSelectedKey();
            sap.ui.getCore().getConfiguration().setLanguage(selectedKey);
        },
        fetchData: function () {
            jQuery.ajax({
                url: backendUrl,
                method: "GET",
                data: {
                    action: "fetchData"
                },
                success: function (response) {
                    var oModel = that.getView().getModel();
                    oModel.setProperty("/data", JSON.parse(response));
                },
                error: function () {
                    MessageToast.show(getI18nText("fetchDataError", that));
                }
            });
        },
        loadValues: function () {
            this.getView().getModel("values").setProperty("/entry", {
                motor_current: 1.7,
                open_pressure: 23.1,
                switch_pressure: 10.2,
                flow: 0.2,
                command_id: "load_values_command_id",
                pump_id: "load_values_pump_id",
            });
            inputs.forEach((input) => {
                input.fireEvent("change")
            });
            MessageToast.show(getI18nText("loadValuesSccess", this));
        },
        saveValues: function () {
            let error = [false, []];
            let allLimits = this.getView().getModel("limits").getProperty("/");

            inputs.forEach((input) => {
                let id = input.getId();
                let value = input.getValue();
                let name = id.split("--");
                name = name[name.length - 1].replace("Input", "");

                if (!name.includes("_id")) {
                    let limits = [
                        allLimits["lowLim"][name] === "N/A" ? 0 : parseFloat(allLimits["lowLim"][name]),
                        parseFloat(allLimits["upLim"][name])
                    ];

                    if (value < limits[0] || value > limits[1]) {
                        input.setValueState("Error");
                        input.setValueStateText(getI18nText("dnmLimitVLTxt", that, [limits[0], limits[1]]));
                        error[0] = true;
                        error[1].push(new StandardListItem({
                            title: getI18nText((value < limits[0] ? "dnmLowLim" : "dnmUpLim"), that, getI18nText(name, that))
                        }));
                    }
                } else if (value.length < minLength) {
                    input.setValueState("Error");
                    input.setValueStateText(getI18nText("dnmMinLengthVLTxt", that, [minLength]));
                    error[0] = true;
                    error[1].push(new StandardListItem({
                        title: getI18nText("dnmMinLength", that, [getI18nText(name, that), minLength])
                    }));
                }
            });

            if (!error[0]) {
                let data = this.getView().getModel("values").getProperty("/entry");

                jQuery.ajax({
                    url: backendUrl,
                    method: "POST",
                    data: {
                        action: "insertData",
                        data: JSON.stringify(data)
                    },
                    success: function () {
                        MessageToast.show(getI18nText("saveValuesSccess", that));
                        that.getView().getModel("values").setProperty("/entry", {
                            motor_current: 0.000,
                            open_pressure: 0.000,
                            switch_pressure: 0.000,
                            flow: 0.000,
                            command_id: "",
                            pump_id: "",
                        });
                    },
                    error: function () {
                        MessageToast.show(getI18nText("saveValuesError", that));
                    }
                });
            } else {
                MessageBox.error(new List({mode: "None", items: error[1]}), {
                    actions: [MessageBox.Action.OK],
                    title: getI18nText("error", that),
                });
            }
        },
        clearError: function (oEvent) {
            oEvent.oSource.setValueState("None");
            oEvent.oSource.setValueStateText("");
        },
        openHistory: function () {
            this.fetchData();

            if (!this.byId("historyDialog")) {
                var oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.skoleni.view.History", this);
                oView.addDependent(oDialog);
                oDialog.open();
            } else {
                this.byId("historyDialog").open();
            }
        },
        closeHistory: function () {
            this.byId("historyDialog").close()
        },
        onDelete: function (oEvent) {
            let toDelete = oEvent.id;
            MessageBox.warning(getI18nText("dataLossWarning", this), {
                actions: [getI18nText("cancel", this), getI18nText("delete", this)],
                emphasizedAction: getI18nText("delete", this),
                title: getI18nText("deleteWarningTitle", this, [toDelete]),
                onClose: function (sAction) {
                    if (sAction === getI18nText("delete", that)) {
                        jQuery.ajax({
                            url: backendUrl,
                            method: "POST",
                            data: {
                                action: "deleteData",
                                id: toDelete
                            },
                            success: function () {
                                that.fetchData();
                                MessageToast.show(getI18nText("deleteSccess", that));
                            },
                            error: function () {
                                MessageToast.show(getI18nText("deleteError", that));
                            }
                        });
                    }
                }
            });
        },
        navBack: function () {
            this.getOwnerComponent().getRouter().navTo("startpage");
        },

        _onRouteMatched: function (oEvent) {
            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            let lang = ["eng", "cz", "pol", "de"].includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(langugage);
        }
    });
});

function getI18nText(key, That, params = []) {
    if (params.length > 0) {
        return That.getView().getModel("i18n").getResourceBundle().getText(key, params);
    }
    return That.getView().getModel("i18n").getResourceBundle().getText(key);
}