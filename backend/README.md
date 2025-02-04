src/ 
controllers/
    Her legger vi funksjoner og klasser som håndterer logikken for API-endepunkter.
    F.eks. funksjoner som behandler innkommende data, validerer dem, og kaller models/ for databaseoperasjoner.

models/
    Her ligger database- eller ORM-modeller.
    Bruker du f.eks. Prisma, Sequelize, Mongoose eller en annen databaseteknologi, kan du plassere skjema-/modelldefinisjonene her.

routes/
    Her definerer du selve rutene/endepunktene.
    F.eks. en fil per ressurs (brukerRoutes.js, dataRoutes.js osv.) som beskriver GET, POST, PUT, DELETE-endepunktene.

utils/
    Felles hjelpefunksjoner og verktøy.
    Kan inkludere funksjoner for logging, feilhåndtering, datastrukturering, tredjeparts-API-kall, etc.

index.js
    Inngangspunktet for serveren.
    Her setter du gjerne opp Express/Koa/Hapi (eller annet rammeverk), kobler til databasen, konfigurerer ruter osv.

tests/
	Her kan du legge enhetstester og integrasjonstester for backend.
	Du kan ha en mappe per modul eller én testfil per fil/funksjon du ønsker å teste.

package.json
	Lister opp avhengigheter (for eksempel express, cors, pg, mongoose, osv.).
	Inneholder scripts for bygging, kjøring og testing (eks. npm run dev, npm test).