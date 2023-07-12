sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.skoleni.controller.StartPage", {

        onInit: function () {
            // set mock model
            var sPath = sap.ui.require.toUrl("sap/ui/skoleni/src/languages/tiles.json"),
                oModel = new JSONModel(sPath);

            this.getView().setModel(oModel);

        },
        onSelect: function (oEvent) {
            var language = oEvent.getSource().getBindingContext().getProperty("code").toLowerCase();
            this.getOwnerComponent().getRouter().navTo("form", {
                "language": language
            });
        },
        handleEditPress: function (oEvent) {
            var oTileContainer = this.byId("container"),
                bEditable = !oTileContainer.getEditable();

            oTileContainer.setEditable(bEditable);
            oEvent.getSource().setText(bEditable ? "Done" : "Edit");
        },

        handleBusyPress: function (oEvent) {
            var oTileContainer = this.byId("container"),
                bBusy = !oTileContainer.getBusy();

            oTileContainer.setBusy(bBusy);
            oEvent.getSource().setText(bBusy ? "Done" : "Busy state");
        },

        handleTileDelete: function (oEvent) {
            var oTile = oEvent.getParameter("tile");
            oEvent.getSource().removeTile(oTile);
        }
    });

});