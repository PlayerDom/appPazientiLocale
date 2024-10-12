sap.ui.define([
    "./BaseController",
    'sap/m/MessageToast',
    './utils/formatter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageToast, formatter) {
        "use strict";

        return BaseController.extend("frontend.controller.Master", {
            formatter: formatter,
            onInit: function () {

            },
            onNavToBooks: function(){
                this.getRouter().navTo("books");
            },
            onListItemPressed : function(oEvent){
                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                this.getRouter().navTo("author",{
                    authorId : oCtx.getProperty("ID")
                });
            },
            onSearch: function(){
                MessageToast.show(this._getText('filterToDo'));
            }
        });
    });
