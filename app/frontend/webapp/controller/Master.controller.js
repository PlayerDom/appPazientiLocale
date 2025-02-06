sap.ui.define([
    "./BaseController",
    'sap/m/MessageToast',
    './utils/formatter', 'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    'sap/ui/model/Sorter',
    './utils/template',
    "sap/ui/export/Spreadsheet",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageToast, formatter, Filter, FilterOperator, JSONModel, Fragment, MessageBox, Sorter, template, Spreadsheet) {
        "use strict";

        return BaseController.extend("frontend.controller.Master", {
            formatter: formatter,
            onInit: function () {
                var oView = this.getView();
                var oFilterModel = new JSONModel([]);
                oView.setModel(oFilterModel, "filtersModel");
            },
            onNavToBooks: function () {
                this.getRouter().navTo("books");
            },
            onListItemPressed: function (oEvent) {
                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                this.getRouter().navTo("author", {
                    authorId: oCtx.getProperty("ID")
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
                    let filtroCognome = new Filter({
                        path: "cognome",
                        operator: FilterOperator.Contains,
                        value1: templateNome,
                        caseSensitive: false
                    });

                    let filtroNome = new Filter({
                        path: "nome",
                        operator: FilterOperator.Contains,
                        value1: templateNome,
                        caseSensitive: false
                    });



                    aTableFilters.push(new Filter({
                        filters: [filtroCognome, filtroNome],
                        and: false
                    }));
                }


                if (codiceFiscale != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "CF",
                        operator: FilterOperator.Contains,
                        value1: codiceFiscale,
                        caseSensitive: false
                    }));
                }


                if (residenza != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "residenza",
                        operator: FilterOperator.Contains,
                        value1: residenza,
                        caseSensitive: false
                    }));
                }
                if (email != "tutti") {
                    aTableFilters.push(new Filter({
                        path: "email",
                        operator: FilterOperator.Contains,
                        value1: email,
                        caseSensitive: false
                    }));
                }


                // Apply the filters to the table and update the model with the filters
                this.oTable = this.getView().byId("tablePazienti");
                this.oTable.getBinding("items").filter(aTableFilters);
                oView.getModel("filtersModel").setData(aTableFilters)
                this.oTable.setShowOverlay(false);

                // Update the UI elements to reflect the current filter state 
                if (this.byId("ButtonTutti").hasStyleClass("btn-custom-cta-table")) {
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
                    return
                } else {
                    for (var i = 0; i < oEvent.getSource().getParent().getItems().length; i++) {
                        if (oEvent.getSource().getParent().getItems()[i].hasStyleClass("btn btn-custom")) {
                            oEvent.getSource().getParent().getItems()[i].removeStyleClass("btn btn-custom")
                            oEvent.getSource().getParent().getItems()[i].addStyleClass("btn-custom-cta-table")

                        }
                    }
                    oEvent.getSource().removeStyleClass("btn-custom-cta-table")
                    oEvent.getSource().addStyleClass("btn btn-custom")

                }
                var sState = oEvent.getSource().mProperties.text


                switch (sState) {
                    case "Sospeso":
                        sState = "S";
                        break;
                    case "In corso":
                        sState = "I";
                        break;
                    case "Terminato":
                        sState = "T";
                        break;
                    case "Concluso":
                        sState = "C";
                        break;
                }

                var aCurrentFilters = oView.getModel("filtersModel").getData();
                var aFilters = aCurrentFilters.filter(function (oFilter) {
                    return oFilter.sPath !== "StatusRapporto/statusCode";
                });


                if (sState && sState !== "Tutti") {
                    aFilters.push(new Filter("StatusRapporto/statusCode", FilterOperator.EQ, sState));
                }
                if (sState && sState == "Tutti") {
                    aFilters.push(new Filter("StatusRapporto/statusCode", FilterOperator.NE, "E"));
                }

                oView.getModel("filtersModel").setData(aFilters);

                this.oTable = oView.byId("tablePazienti");
                this.oTable.getBinding("items").filter(aFilters);
                this.oTable.setShowOverlay(false);
            },

            onOrderTable: function (oEvent) {
                var oTable = this.byId("tablePazienti"),
                    oBinding = oTable.getBinding("items"),
                    sPath = oEvent.getSource().getCustomData()[0].getValue(),
                    bDescending,
                    aSorters = [];

                if (oBinding.aSorters[0] && oBinding.aSorters[0].sPath == sPath) {
                    bDescending = oBinding.aSorters[0].bDescending ? false : true
                } else {
                    bDescending = true;
                }

                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },



            /*----------------------------------------------------------------- SEZIONE DIALOG NUOVI PAZIENTI ---------------------------------------------------------------- */
            onOpenCreateDialog: function () {
                if (!this._oControlloDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "frontend.view.DialogCreazioneControllo",
                        controller: this
                    }).then(function (oDialog) {
                        this._oControlloDialog = oDialog;
                        this.getView().addDependent(this._oControlloDialog);
                        this._oControlloDialog.open();
                    }.bind(this));
                } else {
                    this._oControlloDialog.open();
                }
            },

            onCloseCreateDialog: function () {
                if (this._oControlloDialog) {
                    this._oControlloDialog.destroy();
                    this._oControlloDialog = undefined
                }
            },

            onDateLiveChange: function (oEvent) {
                var dateString = oEvent.getParameter("value").trim();
                // Verifica se la data è nel formato corretto
                var regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/; // Formato "dd/MM/yyyy"
                if (!regex.test(dateString)) {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Email non valida.");
                } else {
                    oEvent.getSource().setValueState("None");
                }
            },


            onEmailLiveChange: function (oEvent) {
                var sEmail = oEvent.getParameter("value").trim();
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(sEmail)) {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Email non valida.");
                } else {
                    oEvent.getSource().setValueState("None");
                }
            },

            onTelefonoLiveChange: function (oEvent) {
                var sTelefono = oEvent.getParameter("value").trim();
                // Rimuove tutto tranne i numeri
                sTelefono = sTelefono.replace(/\D/g, '');


                // Imposta il nuovo valore nel campo input
                oEvent.getSource().setValue(sTelefono);

                // Verifica se ha almeno 9 cifre
                if (sTelefono.replace(/\D/g, '').length < 9) {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Il numero di telefono deve avere almeno 9 cifre.");
                } else {
                    oEvent.getSource().setValueState("None");
                }
            },

            onCodiceFiscaleLiveChange: function (oEvent) {
                var sCodiceFiscale = oEvent.getParameter("value").toUpperCase();

                // Formatta in maiuscolo
                oEvent.getSource().setValue(sCodiceFiscale);

                // Verifica se il CF è valido (16 caratteri alfanumerici)
                var codiceFiscalePattern = /^[A-Z0-9]{16}$/;
                if (!codiceFiscalePattern.test(sCodiceFiscale)) {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Il Codice Fiscale non è valido.");
                } else {
                    oEvent.getSource().setValueState("None");
                }
            },


            onCreateNuovoPaziente: function () {
                var oView = this.getView();
                var that = this;

                // Recupero i valori degli input
                var sCognome = oView.byId("idInputCognomeDialog").getValue().trim();
                var sNome = oView.byId("idInputNomeDialog").getValue().trim();
                var sDataNascita = oView.byId("idInputDataNascitaDialog").getValue().trim();
                var sCodiceFiscale = oView.byId("idInputCodiceFiscaleDialog").getValue().trim();
                var sResidenza = oView.byId("idInputResidenzaDialog").getValue().trim();
                var sTelefono = oView.byId("idInputTelefonoDialog").getValue().trim();
                var sEmail = oView.byId("idInputEmailDialog").getValue().trim();

                // Verifica se tutti i campi sono compilati
                if (!sCognome || !sNome || !sDataNascita || !sCodiceFiscale || !sResidenza || !sTelefono || !sEmail) {
                    MessageBox.error("Tutti i campi devono essere compilati.");
                    return;
                }


                // Verifica che la data sia corretta
                var regexPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/; // Formato "dd/MM/yyyy"
                if (!regexPattern.test(sDataNascita)) {
                    MessageBox.error("La data inserita non è valida");
                    return;
                }
                // Verifica Codice Fiscale (16 caratteri alfanumerici)
                var codiceFiscalePattern = /^[A-Z0-9]{16}$/i;
                if (!codiceFiscalePattern.test(sCodiceFiscale)) {
                    MessageBox.error("Il Codice Fiscale non è valido. Deve essere di 16 caratteri alfanumerici.");
                    return;
                }

                // Verifica Telefono (solo numeri, minimo 9 caratteri)
                var telefonoPattern = /^[0-9]{9,}$/;
                if (!telefonoPattern.test(sTelefono)) {
                    MessageBox.error("Il numero di telefono non è valido. Deve contenere solo numeri e almeno 9 cifre.");
                    return;
                }

                // Verifica Email (formato base)
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(sEmail)) {
                    MessageBox.error("L'indirizzo email non è valido.");
                    return;
                }

                // Se tutte le validazioni passano, procedi con il salvataggio
                MessageToast.show("Tutti i campi sono validi. Procedi con il salvataggio.");

                // Converti la data in formato YYYY-MM-DD per SQLite
                var sDataISO = sDataNascita.split("/").reverse().join("-");





                var oNewPaziente = {
                    cognome: sCognome,
                    nome: sNome,
                    dataNascita: sDataISO,
                    CF: sCodiceFiscale,
                    StatusRapporto: { ID: "c91239b8-e180-4d55-bc9c-eab9f2d7ceb0" },
                    residenza: sResidenza,
                    telefono: sTelefono,
                    email: sEmail,
                    raccoltaAnamnestica: {},
                    anamnesiRemota: {},
                    primeFasi: {},
                    anamnesiFisiologica: {},
                    interessi: {}
                };

                // 🔥 Chiamata HTTP al backend (es. Express + SQLite)
                fetch("http://localhost:4004/odata/v4/valid/Pazienti", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(oNewPaziente)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Errore nella creazione del paziente.");
                        }
                        return response.json();
                    })
                    .then(data => {
                        MessageBox.success(that._getText("msgBoxCreatePatientSuccess"));
                        that.onCloseCreateDialog();
                    })
                    .catch(error => {
                        sap.m.MessageBox.error(error.message);
                    });
            },
        //------------------------------------------------------ DOWNLOAD EXCEL ------------------------------------------------------------------------

        onExport: function () {
            this._setBusy(true);
            let oView = this.getView();
            let oModel = oView.getModel(); 
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();
            var oFilters = this.getView().getModel("filtersModel").getData()

            let that = this;
            var aCols, oRowBinding, oSettings, oSheet;

            fetch("http://localhost:4004/odata/v4/valid/Pazienti?$expand=StatusRapporto", {  // Assumi che l'endpoint CAP sia questo
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei dati');
                }
                return response.json();
            })
            .then(oData => {
                that._setBusy(false);
                aCols = template.createColumnConfigMaster(oResourceBundle);
                oRowBinding = oData.value; // CAP solitamente restituisce { value: [...] }
                
                oSettings = {
                    workbook: {
                        columns: aCols
                    },
                    dataSource: oRowBinding,
                    fileName: 'Lista_Pazienti' + formatter.formatDateTime(new Date())
                };
            
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(() => {
                    oSheet.destroy();
                });
            })
            .catch(error => {
                that._setBusy(false);
                MessageBox.error(that._getText('excelError'));
                console.error(error);
            });
            
      

         
            
        },






        });
    });
