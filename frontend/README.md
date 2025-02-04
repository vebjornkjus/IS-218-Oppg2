public/
	Statiske filer som trengs for frontend.
	F.eks. index.html, favicon, bilder, fonter, etc.
	Innholdet her blir som regel bare kopiert rett inn i byggresultatet (f.eks. dist/).

src/
	components/
        Gjenbrukbare moduler eller UI-elementer, f.eks. knapper, tabeller, modaler osv.
        I React kan dette være .jsx-/.js-filer med funksjons- eller klassekomponenter.
        I Vue/Svelte/Angular-løsninger vil det være .vue / .svelte / .component.ts-filer.

pages/
    Toppnivå-sider i applikasjonen (f.eks. Home, MapView, Dashboard).
    Her håndterer du layout og funksjonalitet for hver “skjerm” eller “rute” i SPA-en.

services/
    Her legger du vanligvis fil(er) for kommunikasjon med backend.
    F.eks. api.js med funksjoner for å sende GET/POST-forespørsler til backend.

styles/
    Globale stilark (CSS, SCSS, etc.).
    Du kan også ha modulbasert CSS i egne filer.

utils/
    Hjelpefunksjoner, konstanter, verktøy som brukes av flere komponenter/sider.
    Dette kan være formattering av data, kartkonfigurasjoner, etc.

App.js (eller main.js, avhengig av rammeverk)
    Inngangspunkt for frontend-appen.
    F.eks. hvor du definerer rotkomponenten eller ruting (React Router, Vue Router, etc.).

package.json
    Lister opp avhengigheter (f.eks. react, vue, leaflet, maplibre, axios, vite/webpack osv.).
    Inneholder scripts for bygging og kjøring (eks. npm run dev, npm run build).