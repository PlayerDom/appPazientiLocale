sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	'./utils/formatter',
	'sap/m/MessageBox'

], function (BaseController, JSONModel, formatter, MessageBox) {
	"use strict";
	/**
	 * Available Keys for the icon tab bar sections
	 */
	var _aValidTabKeys = ["All", "Bio", "Admin"];
	return BaseController.extend("frontend.controller.Paziente", {
		formatter: formatter,
		onInit: async function () {
			var oRouter = this.getRouter();
			this.getView().setModel(new JSONModel(), "view");
			oRouter.getRoute("paziente").attachMatched(this._onRouteMatched, this);
		},

		

		_onRouteMatched: function (oEvent) {
			var oArgs, oView, oRouter, idPaziente;
			oArgs = oEvent.getParameter("arguments");
			idPaziente = oArgs.pazienteId;
			oView = this.getView();
			oRouter = this.getRouter();
		
				var sUrl = `http://localhost:4004/odata/v4/valid/Pazienti(${idPaziente})?$expand=StatusRapporto`;
			
				fetch(sUrl, {
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(response => {
					if (!response.ok) {
						throw new Error("Errore nel recupero dei dati");
					}
					return response.json();
				})
				.then(data => {
					// Creazione del modello JSON e impostazione sulla view
					var oPazienteModel = new sap.ui.model.json.JSONModel(data);
					this.getView().setModel(oPazienteModel, "pazienteModel");
			
					console.log("Dati del paziente caricati:", data);
				})
				.catch(error => {
					console.error("Errore nella fetch:", error);
				});
		},

		onEditTestRaccoltaAnamnestica: function() {
			// Ottieni il controllo VBox
			var oVBox = this.byId("formRaccoltaAnamnestica");  // Sostituisci con l'ID del tuo VBox
		
			// Ottieni tutti gli input e text dal VBox
			var oInputs = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Input");
			});
			
			var oTexts = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Text");
			});
		
			// Determina lo stato corrente (se gli input sono visibili o meno)
			var bInputsVisible = oInputs[0] ? oInputs[0].getVisible() : false;
			
			// Alterna la visibilità degli input e dei text
			oInputs.forEach(function(oInput) {
				oInput.setVisible(!bInputsVisible);
			});
		
			oTexts.forEach(function(oText) {
				oText.setVisible(bInputsVisible);
			});
		
			// Cambia il testo del pulsante
			var oEditButton = this.byId("editRacAnamnestica");
			var oSaveButton = this.byId("salvaRacAnamnestica");
			var oAnnullaEdif = this.byId("annullaEditRacAnamnestica")
			
			if (bInputsVisible) {
				oEditButton.setVisible(true);
				oSaveButton.setVisible(false);
				oAnnullaEdif.setVisible(false);
			} else {
				oEditButton.setVisible(false);
				oSaveButton.setVisible(true);
				oAnnullaEdif.setVisible(true);
			}
		},

		onEditTestAnamnesiRemota: function() {
			// Ottieni il controllo VBox
			var oVBox = this.byId("formAnamnesiRemota");  // Sostituisci con l'ID del tuo VBox
		
			// Ottieni tutti gli input e text dal VBox
			var oInputs = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Input");
			});
			
			var oTexts = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Text");
			});
		
			// Determina lo stato corrente (se gli input sono visibili o meno)
			var bInputsVisible = oInputs[0] ? oInputs[0].getVisible() : false;
			
			// Alterna la visibilità degli input e dei text
			oInputs.forEach(function(oInput) {
				oInput.setVisible(!bInputsVisible);
			});
		
			oTexts.forEach(function(oText) {
				oText.setVisible(bInputsVisible);
			});
		
			// Cambia il testo del pulsante
			var oEditButton = this.byId("editAnamnesiRemota");
			var oSaveButton = this.byId("salvaAnamnesiRemota");
			var oAnnullaEdif = this.byId("annullaEditAnamnesiRemota")
			
			if (bInputsVisible) {
				oEditButton.setVisible(true);
				oSaveButton.setVisible(false);
				oAnnullaEdif.setVisible(false);
			} else {
				oEditButton.setVisible(false);
				oSaveButton.setVisible(true);
				oAnnullaEdif.setVisible(true);
			}
		},

		onEditTestAnamnesiFisiologica: function() {
			// Ottieni il controllo VBox
			var oVBox = this.byId("formAnamnesiFisiologica");  // Sostituisci con l'ID del tuo VBox
		
			// Ottieni tutti gli input e text dal VBox
			var oInputs = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Input");
			});
			
			var oTexts = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Text");
			});
		
			// Determina lo stato corrente (se gli input sono visibili o meno)
			var bInputsVisible = oInputs[0] ? oInputs[0].getVisible() : false;
			
			// Alterna la visibilità degli input e dei text
			oInputs.forEach(function(oInput) {
				oInput.setVisible(!bInputsVisible);
			});
		
			oTexts.forEach(function(oText) {
				oText.setVisible(bInputsVisible);
			});
		
			// Cambia il testo del pulsante
			var oEditButton = this.byId("editAnamnesiFisiologica");
			var oSaveButton = this.byId("salvaAnamnesiFisiologica");
			var oAnnullaEdif = this.byId("annullaEditAnamnesiFisiologica")
			
			if (bInputsVisible) {
				oEditButton.setVisible(true);
				oSaveButton.setVisible(false);
				oAnnullaEdif.setVisible(false);
			} else {
				oEditButton.setVisible(false);
				oSaveButton.setVisible(true);
				oAnnullaEdif.setVisible(true);
			}
		},

		onEditTestPrimeFasi: function() {
			// Ottieni il controllo VBox
			var oVBox = this.byId("formPrimeFasi");  // Sostituisci con l'ID del tuo VBox
		
			// Ottieni tutti gli input e text dal VBox
			var oInputs = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.TextArea");
			});
			
			var oTexts = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Text");
			});
		
			// Determina lo stato corrente (se gli input sono visibili o meno)
			var bInputsVisible = oInputs[0] ? oInputs[0].getVisible() : false;
			
			// Alterna la visibilità degli input e dei text
			oInputs.forEach(function(oInput) {
				oInput.setVisible(!bInputsVisible);
			});
		
			oTexts.forEach(function(oText) {
				oText.setVisible(bInputsVisible);
			});
		
			// Cambia il testo del pulsante
			var oEditButton = this.byId("editPrimeFasi");
			var oSaveButton = this.byId("salvaPrimeFasi");
			var oAnnullaEdif = this.byId("annullaEditPrimeFasi")
			
			if (bInputsVisible) {
				oEditButton.setVisible(true);
				oSaveButton.setVisible(false);
				oAnnullaEdif.setVisible(false);
			} else {
				oEditButton.setVisible(false);
				oSaveButton.setVisible(true);
				oAnnullaEdif.setVisible(true);
			}
		},

		onEditTestInteressi: function() {
			// Ottieni il controllo VBox
			var oVBox = this.byId("formInteressi");  // Sostituisci con l'ID del tuo VBox
		
			// Ottieni tutti gli input e text dal VBox
			var oInputs = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Input");
			});
			
			var oTexts = oVBox.getContent().filter(function(oItem) {
				return oItem.isA("sap.m.Text");
			});
		
			// Determina lo stato corrente (se gli input sono visibili o meno)
			var bInputsVisible = oInputs[0] ? oInputs[0].getVisible() : false;
			
			// Alterna la visibilità degli input e dei text
			oInputs.forEach(function(oInput) {
				oInput.setVisible(!bInputsVisible);
			});
		
			oTexts.forEach(function(oText) {
				oText.setVisible(bInputsVisible);
			});
		
			// Cambia il testo del pulsante
			var oEditButton = this.byId("editInteressi");
			var oSaveButton = this.byId("salvaInteressi");
			var oAnnullaEdif = this.byId("annullaEditInteressi")
			
			if (bInputsVisible) {
				oEditButton.setVisible(true);
				oSaveButton.setVisible(false);
				oAnnullaEdif.setVisible(false);
			} else {
				oEditButton.setVisible(false);
				oSaveButton.setVisible(true);
				oAnnullaEdif.setVisible(true);
			}
		},
	
	});



});
