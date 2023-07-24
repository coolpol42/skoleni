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

            // Settings on nav to this view
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("video").attachPatternMatched(this._onRouteMatched, this);

            oView = this.getView();
            setTimeout(() => { // Setting event listener for video end
                video = document.querySelector("#video-player");
                video.addEventListener("ended", () => {
                    this.videoEnded();
                });
            }, 500);

        },
        videoEnded: function () {
            oView.byId("btn-forward").setEnabled(true);

            // Message box for replaying the video, or confirming to proceed to summary
            MessageBox.confirm(getI18nText("replayMB", that), {
                actions: [getI18nText("replayButton", that), getI18nText("proceedToSummaryMB", that)],
                emphasizedAction: getI18nText("proceedToSummaryMB", that),
                title: getI18nText("replay", that),
                onClose: function (sAction) {
                    if (sAction === getI18nText("replayButton", that)) {
                        video.play();
                    } else {
                        that.navForward();
                    }
                }
            });
        },
        navForward: function () {
            video.currentTime = 0;
            video.pause();
            this.getOwnerComponent().getModel("nav").setProperty("/videoViewed", true);
            this.getOwnerComponent().getRouter().navTo("summary", {language: lang});
        },
        navBack: function () {
            this.getOwnerComponent().getRouter().navTo("form", {language: lang});
        },

        _onRouteMatched: function (oEvent) {

            var langugage = oEvent.getParameter("arguments").language.toLowerCase();
            lang = langCodes.includes(langugage) ? langugage : "eng";

            sap.ui.getCore().getConfiguration().setLanguage(lang);

            // If the form is not filled, navigate back to startpage
            let data = this.getOwnerComponent().getModel("formValues").getProperty("/entry");
            for (let values in data) {
                if (data[values] === "") {
                    this.getOwnerComponent().getRouter().navTo("startpage");
                    return;
                }
            }

            // Resetting the view
            oView.byId("btn-forward").setEnabled(false);
            video.play();
        }
    });
});
