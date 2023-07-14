sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox) {
    "use strict";
    var that, oView, lang, video;
    return Controller.extend("sap.ui.skoleni.controller.Form", {
        onInit: function () {
            that = this;

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("video").attachPatternMatched(this._onRouteMatched, this);

            oView = this.getView();
            setTimeout(() => {
                video = document.querySelector("#video-player");
                video.addEventListener("ended", () => {
                    this.videoEnded();
                });
            }, 500);

        },
        videoEnded: function () {
            oView.byId("btn-forward").setEnabled(true);
            MessageBox.confirm("", {
                actions: [getI18nText("yes", that), getI18nText("proceedToVideo", that)],
                emphasizedAction: getI18nText("proceedToSummaryMB", that),
                title: getI18nText("replay", that),
                onClose: function (sAction) {
                    if (sAction === getI18nText("yes", that)) {
                        video.play();
                    } else {
                        that.navForward();
                    }
                }
            });
        },
        navForward: function () {
            this.getOwnerComponent().getRouter().navTo("summary", {language: lang});
        },
        navBack: function () {
            this.getOwnerComponent().getRouter().navTo("form", {language: lang});
        },

        _onRouteMatched: function (oEvent) {
            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);
        }
    });
});
