sap.ui.define([
    "./BaseController",
    'sap/m/MessageToast',
    './utils/formatter','sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageToast, formatter, Filter, FilterOperator, JSONModel) {
        "use strict";

        return BaseController.extend("frontend.controller.Master", {
            formatter: formatter,
            onInit: function () {
                var oView = this.getView();
                var oFilterModel = new JSONModel([]);
                oView.setModel(oFilterModel, "filtersModel");
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
            onSearch: function () {
                var oView = this.getView();
                 // Initialize the array of filters and retrieve values from UI controls to use as filters
                var aTableFilters = [];
                var templateNome = this.byId("idNomeTemplate").getValue();
                var codiceFiscale = this.byId("idCF").getValue();
                var residenza = this.byId("idResidenza").getValue();
                var email = this.byId("idEmail").getValue();
                

            
                if (templateNome) {
                    aTableFilters.push(new Filter({
                        path: "cognome",
                        operator: FilterOperator.Contains,
                        value1: templateNome
                    }));
                }


                if (codiceFiscale != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "CF",
                        operator: FilterOperator.Contains,
                        value1: codiceFiscale
                    }));
                }

            
                if (residenza != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "residenza",
                        operator: FilterOperator.Contains,
                        value1: residenza
                    }));
                }
                if (email != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "email",
                        operator: FilterOperator.Contains,
                        value1: email
                    }));
                }
                

                // Apply the filters to the table and update the model with the filters
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                oView.getModel("filtersModel").setData(aTableFilters)
                this.oTable.setShowOverlay(false);

                 // Update the UI elements to reflect the current filter state 
               if (this.byId("ButtonTutti").hasStyleClass("btn-custom-cta-table")){
                this.byId("ButtonTutti").removeStyleClass("btn-custom-cta-table")
                this.byId("ButtonTutti").addStyleClass("btn btn-custom")
                this.byId("ButtonCorso").removeStyleClass("btn btn-custom")
                this.byId("ButtonCorso").addStyleClass("btn-custom-cta-table")
                this.byId("ButtonConcluso").removeStyleClass("btn btn-custom")
                this.byId("ButtonConcluso").addStyleClass("btn-custom-cta-table")
                this.byId("ButtonSospeso").removeStyleClass("btn btn-custom")
                this.byId("ButtonSospeso").addStyleClass("btn-custom-cta-table")
                this.byId("ButtonTerminato").removeStyleClass("btn btn-custom")
                this.byId("ButtonTerminato").addStyleClass("btn-custom-cta-table")
                }
            },
            onResetFiltersPress: function () {
                var aTableFilters = [];
                aTableFilters.push(new Filter({
                    path: "Status",
                    operator: FilterOperator.NE,
                    value1: "E"
                }));
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);

                //reset the "Stato" buttons to their original state with "Tutti" selected
                var filterBar = this.getView().byId("filterbar");
                // this.byId("ButtonTutti").removeStyleClass("btn-custom-cta-table").addStyleClass("btn btn-custom").setEnabled(true)          
                // this.byId("ButtonCorso").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                // this.byId("ButtonConcluso").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                // this.byId("ButtonSospeso").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                // this.byId("ButtonTerminato").removeStyleClass("btn btn-custom").addStyleClass("btn-custom-cta-table").setEnabled(true)
                
                var filterItems = filterBar.getAllFilterItems().filter(function (item) {
                    return item.getControl();
                });


                filterItems.forEach(function (item) {
                    var control = item.getControl();

                    // Reset the value of the control depending on its type
                    if (control.setValue) {
                        control.setValue("");
                    } else if (control.setSelectedKey) {
                        control.setSelectedKey("");
                    } else if (control.setSelectedKeys) {
                        control.setSelectedKeys([]);
                    } else if (control.setSelected) {
                        control.setSelected(false);
                    } else if (control.setState) {
                        control.setState(false);
                    }
                });
            },
            onStatusButtonPress: function (oEvent) {
                var oView = this.getView();
            
                if (oEvent.getSource().hasStyleClass("btn btn-custom")) {
                    return;
                } else {
                    var aButtons = oEvent.getSource().getParent().getItems();
                    for (var i = 0; i < aButtons.length; i++) {
                        if (aButtons[i].hasStyleClass("btn btn-custom")) {
                            aButtons[i].removeStyleClass("btn btn-custom");
                            aButtons[i].addStyleClass("btn-custom-cta-table");
                        }
                    }
                    oEvent.getSource().removeStyleClass("btn-custom-cta-table");
                    oEvent.getSource().addStyleClass("btn btn-custom");
                }
            
                var sState = oEvent.getSource().getCustomData()[0].getValue();
            
                var sFilter = "";
                if (sState && sState !== "tutti") {
                    sFilter = "StatusRapporto/all(g:g/statusCode eq '" + sState + "')";
                }
            
                if (sState === "tutti") {
                    sFilter = "";
                }
            
                this.oTable = oView.byId("tablePazienti");
                var sPath = "/Pazienti"; 
            
                // Aggiorna il template con lo stesso ordine delle colonne nel tuo XML
                var oTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{cognome} {nome}" }), // Cognome e Nome
                        new sap.m.Text({ text: "{path: 'dataNascita', formatter: '.formatter.formatEta'}" }), // Età
                        new sap.m.Text({ text: "{CF}" }), // Codice Fiscale
                        new sap.m.ObjectStatus({
                            text: "{StatusRapporto/statusText}",
                            state: "{path: 'StatusRapporto/statusCode', formatter: '.formatter.formatState'}",
                            class: "sapUiSmallMarginTop sapUiMediumMarginEnd boldBlackTitle"
                        }), // Status Rapporto
                        new sap.m.Text({ text: "{residenza}" }), // Residenza
                        new sap.m.Text({ text: "{telefono}" }), // Telefono
                        new sap.m.Text({ text: "{email}" }) // Email
                    ]
                });
            
                this.oTable.bindItems({
                    path: sPath,
                    template: oTemplate,  
                    parameters: {
                        $expand: "StatusRapporto",
                        $filter: sFilter,
                        $orderby: "cognome"
                    }
                });
            
                this.oTable.setShowOverlay(false);
            }
            
            
        });
    });
