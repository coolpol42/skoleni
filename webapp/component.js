sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
], function (UIComponent, JSONModel) {
    "use strict";
    return UIComponent.extend("sap.ui.skoleni.Component", {

        metadata: {
            manifest: "json"
        },
        init: function () {
            // zavolání init funkce rodiče
            UIComponent.prototype.init.apply(this, arguments);
            // nastavení data modelů



            var oModel = new JSONModel();
            sap.ui.getCore().setModel(oModel);

            var oData = {
                entry: {
                    motor_current: 0.000,
                    open_pressure: 0.000,
                    switch_pressure: 0.000,
                    flow: 0.000,
                    command_id: "",
                    pump_id: "",
                }
            }
            oModel = new JSONModel(oData);
            sap.ui.getCore().setModel(oModel, "values");

            oData = {
                lowLim: {
                    motor_current: "N/A",
                    open_pressure: "22.000",
                    switch_pressure: "10.000",
                    flow: "0.180",
                },
                upLim: {
                    motor_current: "1.760",
                    open_pressure: "27.000",
                    switch_pressure: "14.000",
                    flow: "0.310",
                },
                minLength: 3
            }
            oModel = new JSONModel(oData);
            sap.ui.getCore().setModel(oModel, "limits");

            this.getRouter().initialize();

            // Nastavení UI textů - již není potřeba v manifest.json
            // var i18Model = new ResourceModel({
            //     bundleName: "sap.ui.skoleni.i18n.i18n",
            //     supportedLocales: [""],
            //     fallbackLocale: ""
            // });
            // sap.ui.getCore().setModel(i18Model, "i18n")
        },
    });
})