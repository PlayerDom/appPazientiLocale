const cds = require('@sap/cds');
const path = require('path');

module.exports = async function () {

    // Configurazione del database SQLite
    cds.env.db = {
        kind: 'sqlite',
        file: path.join(__dirname, 'my_database.db')  // Imposta il percorso del file SQLite
    };

    // Gestione dell'autenticazione e autorizzazione
    this.on('READ', 'UserAuthorizations', (req) => {
        return {
            user   : req.user.id,
            isAdmin: req.user.is('admin'),
            isUser:  req.user.is('user')
        };
    });

 // **Leggere tutti i pazienti**
 this.on('READ', 'Pazienti', async (req) => {
    try {
        if (req.params.length > 0) {
            // **Recupera un paziente specifico per ID**
            const { ID } = req.params[0];
            const result = await db.run(SELECT.from('my_validexample_Pazienti').where({ ID }));
            
            if (result.length === 0) {
                req.error(404, `Paziente con ID ${ID} non trovato.`);
            }
            return result[0];  // Restituisce un singolo oggetto
        } else {
            // **Recupera tutti i pazienti**
            const result = await db.run(SELECT.from('my_validexample_Pazienti'));
            return result;
        }
    } catch (error) {
        console.error("Errore durante la lettura dei pazienti:", error);
        req.error(500, "Errore nel recupero dei pazienti.");
    }
});

      this.on('CREATE', 'Pazienti', async (req) => {
        try {
            const db = await cds.connect.to('db');  // Connessione al database
            const nuovoPaziente = req.data;  // Ottieni i dati inviati dalla richiesta
            
            // Inserisce il nuovo paziente
            const result = await db.run(
                INSERT.into('my_validexample_Pazienti').entries(nuovoPaziente)
            );

            console.log("Nuovo paziente inserito:", result);
            return result;
        } catch (error) {
            console.error("Errore durante l'inserimento del paziente:", error);
            req.error(500, "Errore durante la creazione del paziente");
        }
    });

    this.on('DELETE', 'Pazienti', async (req) => {
      const { ID } = req.params[0]; // Assumendo che ID sia il nome del campo chiave
  
      if (!ID) {
          req.error(400, "ID paziente mancante.");
          return;
      }
  
      try {
          const db = await cds.connect.to('db');
          const result = await db.run(DELETE.from('my_validexample_Pazienti').where({ ID }));
  
          if (result === 0) {
              req.error(404, "Paziente non trovato.");
          } else {
              req.reply({ message: "Paziente eliminato con successo!" });
          }
      } catch (error) {
          console.error("Errore nella cancellazione del paziente:", error);
          req.error(500, "Errore interno del server.");
      }
  });

    // Gestione degli errori
    this.on('error', (err, req) => {
        console.error("Errore generico:", err);
    });
};
