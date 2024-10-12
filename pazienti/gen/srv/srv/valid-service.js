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

    // // Gestione della lettura dei pazienti
    // this.on('READ', 'Pazienti', async (req) => {
    //     try {
    //         // Usa il metodo cds.read per accedere ai dati
    //         const result = await cds.read('my_validexample_Pazienti');  // 'Pazienti' è il nome dell'entità
    //         console.log("Dati dei pazienti:", result);
    //         req.reply(result);
    //     } catch (error) {
    //         console.error("Errore durante la lettura dei pazienti:", error);
    //         req.reply([]);  // In caso di errore, ritorna un array vuoto
    //     }
    // });

    this.on('READ', 'Pazienti', async (req) => {
        try {
          const db = await cds.connect.to('db');  // Usa il nome del database
          const result = await db.run(SELECT.from('my_validexample_Pazienti'));
          console.log("Dati dei pazienti:", result);
          req.reply(result);
        } catch (error) {
          console.error("Errore durante la lettura dei pazienti:", error);
          req.reply([]);
        }
      });

    // Gestione degli errori
    this.on('error', (err, req) => {
        console.error("Errore generico:", err);
    });
};
