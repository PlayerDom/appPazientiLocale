
sap.ui.define([
    "sap/ui/core/BusyIndicator",
	'sap/ui/export/library',
], function (BusyIndicator,exportLibrary) {
    "use strict";
    var EdmType = exportLibrary.EdmType;
    var template = {

		
		createColumnConfigMaster: function (oResourceBundle, aData) {
			return [
				{
					label: oResourceBundle.getText("labelNomeCognome"),
					property: ['cognome', 'nome'],
					type: EdmType.String,
					template: "{0} {1}",
					width: this._getMaxColumnWidth(aData, ['cognome', 'nome']) // Larghezza dinamica
				},
				{
					label: oResourceBundle.getText("labelDataNascita"),
					property: 'dataNascita',
					type: EdmType.String,
					width: this._getMaxColumnWidth(aData, ['dataNascita'])
				},
				{
					label: oResourceBundle.getText("labelCodiceFiscale"),
					property: 'CF',
					type: EdmType.String,
					width: this._getMaxColumnWidth(aData, ['CF'])
				},
				{
					label: oResourceBundle.getText("labelStatusRapporto"),
					property: 'StatusRapporto/statusText',
					type: EdmType.String,
					width: this._getMaxColumnWidth(aData, ['StatusRapporto/statusText'])
				},
				{
					label: oResourceBundle.getText("labelResidenza"),
					property: 'residenza',
					type: EdmType.String,
					width: this._getMaxColumnWidth(aData, ['residenza'])
				},
				{
					label: oResourceBundle.getText("labelTelefono"),
					property: 'telefono',
					type: EdmType.String,
					width: this._getMaxColumnWidth(aData, ['telefono'])
				},
				{
					label: oResourceBundle.getText("labelEmail"),
					property: 'email',
					type: EdmType.String,
					width: this._getMaxColumnWidth(aData, ['email'])
				}
			];
		},
		
		
        _getMaxColumnWidth: function (aData, aProperties) {
            let maxLength = aProperties.map(property => property.length).reduce((a, b) => Math.max(a, b), 10); // Larghezza minima
        
            aData.forEach(item => {
                let value = aProperties.map(prop => prop.split('/').reduce((o, p) => (o && o[p]) ? o[p] : '', item)).join(' ');
                maxLength = Math.max(maxLength, value.length);
            });
        
            return maxLength + 5; // Aggiunge un po' di spazio extra
        },

    };

    return template;

},  /* bExport= */ true);