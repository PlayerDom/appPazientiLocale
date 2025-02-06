
sap.ui.define([
    "sap/ui/core/BusyIndicator",
	'sap/ui/export/library',
], function (BusyIndicator,exportLibrary) {
    "use strict";
    var EdmType = exportLibrary.EdmType;
    var template = {

		
		createColumnConfigMaster: function (oResourceBundle) {

			// Create and return the column configuration array
			return [
				{
					label: oResourceBundle.getText("labelNomeCognome"),
					property: ['cognome', 'nome'],
					type: EdmType.String,
					template: "{0} {1}"
				},
				{
					label: oResourceBundle.getText("labelDataNascita"),
					property: 'dataNascita',
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("labelCodiceFiscale"),
					property: 'CF',
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("labelStatusRapporto"),
					property: 'StatusRapporto/statusText',
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("labelResidenza"),
					property: 'residenza',
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("labelTelefono"),
					property: 'telefono',
					type: EdmType.String
				},
				{
					label: oResourceBundle.getText("labelEmail"),
					property: 'email',
					type: EdmType.String
				},				
			];
		},

    };

    return template;

},  /* bExport= */ true);