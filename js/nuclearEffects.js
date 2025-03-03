/**
 * Visualiseringsverktøy for atomvåpeneffekter
 * Kun for utdanningsformål for å demonstrere effektradius
 */

class NuclearEffectsVisualizer {
    constructor(map) {
        this.map = map;
        this.selectedBomb = null;
        this.effectLayers = L.layerGroup().addTo(map);
        this.bombs = this.getBombData();
        this.createLegend();
    }

    // Data om atomvåpen og deres effekter
    getBombData() {
        return {
            "Little Boy (Hiroshima, 15kt)": {
                yieldKt: 15,
                flameRadius: 1.0,       // km
                highDamageRadius: 1.8,   // km
                moderateDamageRadius: 2.7, // km
                thirdDegreeBurnRadius: 3.0, // km
                description: "Første atombombe brukt i krig, 6. august 1945"
            },
            "Fat Man (Nagasaki, 21kt)": {
                yieldKt: 21,
                flameRadius: 1.2,       // km
                highDamageRadius: 2.0,   // km
                moderateDamageRadius: 3.1, // km
                thirdDegreeBurnRadius: 3.5, // km
                description: "Andre atombombe brukt i krig, 9. august 1945"
            },
            "B61 (Taktisk, 300kt)": {
                yieldKt: 300,
                flameRadius: 2.9,       // km
                highDamageRadius: 4.7,   // km
                moderateDamageRadius: 7.1, // km
                thirdDegreeBurnRadius: 9.1, // km
                description: "Moderne amerikansk taktisk atomvåpen"
            },
            "Topol (SS-25, 800kt)": {
                yieldKt: 800,
                flameRadius: 4.0,       // km
                highDamageRadius: 6.4,   // km
                moderateDamageRadius: 9.8, // km
                thirdDegreeBurnRadius: 13.2, // km
                description: "Russisk interkontinental ballistisk missil"
            },
            "W88 (Strategisk, 475kt)": {
                yieldKt: 475,
                flameRadius: 3.4,       // km
                highDamageRadius: 5.5,   // km
                moderateDamageRadius: 8.3, // km
                thirdDegreeBurnRadius: 10.7, // km
                description: "Moderne amerikansk strategisk atomstridshode"
            },
            "Tsar Bomba (Testet, 50Mt)": {
                yieldKt: 50000,
                flameRadius: 20.0,      // km
                highDamageRadius: 33.0,  // km
                moderateDamageRadius: 46.0, // km
                thirdDegreeBurnRadius: 62.0, // km
                description: "Den kraftigste kjernevåpendetonasjonen noensinne (1961)"
            }
        };
    }

    // Sett valgt bombe
    selectBomb(bombName) {
        if (this.selectedBomb && this.selectedBomb === this.bombs[bombName]) {
            this.selectedBomb = null;
            this.clearEffects();
            document.querySelector(`input[name="bomb-select"][value="${bombName}"]`).checked = false;
        } else {
            this.selectedBomb = this.bombs[bombName];
            this.clearEffects();
            document.querySelectorAll('input[name="bomb-select"]').forEach(input => {
                if (input.value !== bombName) {
                    input.checked = false;
                }
            });
        }
        return this.selectedBomb;
    }

    // Fjern alle effektsirkler fra kartet
    clearEffects() {
        this.effectLayers.clearLayers();
    }

    // Tegn effektene på den angitte plasseringen
    visualizeEffects(latlng) {
        if (!this.selectedBomb) {
            alert("Vennligst velg en bombe først");
            return;
        }

        this.clearEffects();
        
        const bomb = this.selectedBomb;
        
        // Legg til sirkler for hver effektradius
        // Flammeradius (innerst)
        L.circle(latlng, {
            radius: bomb.flameRadius * 1000, // Konverter km til meter
            color: '#ff0000',
            fillColor: '#ff5f00',
            fillOpacity: 0.4,
            weight: 2
        }).bindPopup(`Flammeradius: ${bomb.flameRadius} km`).addTo(this.effectLayers);

        // Høyeksplosiv skaderadius
        L.circle(latlng, {
            radius: bomb.highDamageRadius * 1000,
            color: '#ff7700',
            fillColor: '#ff9900',
            fillOpacity: 0.3,
            weight: 2
        }).bindPopup(`Høyeksplosiv skaderadius: ${bomb.highDamageRadius} km`).addTo(this.effectLayers);

        // Moderat skaderadius
        L.circle(latlng, {
            radius: bomb.moderateDamageRadius * 1000,
            color: '#ffcc00',
            fillColor: '#ffeb3b',
            fillOpacity: 0.2,
            weight: 2
        }).bindPopup(`Moderat eksplosjonsskaderadius: ${bomb.moderateDamageRadius} km`).addTo(this.effectLayers);

        // Tredjegrads forbrenningsradius (ytterst)
        L.circle(latlng, {
            radius: bomb.thirdDegreeBurnRadius * 1000,
            color: '#ff9e80',
            fillColor: '#ffccbc',
            fillOpacity: 0.1,
            weight: 2
        }).bindPopup(`Varmestråling (tredjegrads forbrenning): ${bomb.thirdDegreeBurnRadius} km`).addTo(this.effectLayers);

        // Lag tilpasset eksplosjonsikon med Font Awesome
        const explosionIcon = L.divIcon({
            html: '<i class="fa-solid fa-explosion" style="font-size: 24px; color: black;"></i>',
            className: 'explosion-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Legg til en markør med tilpasset eksplosjonsikon på nullpunktet
        L.marker(latlng, {
            icon: explosionIcon
        }).bindPopup(`
            <h3>${this.getSelectedBombName()}</h3>
            <p>${bomb.description}</p>
            <p>Sprengkraft: ${bomb.yieldKt} kt</p>
        `).addTo(this.effectLayers).openPopup();
    }

    // Hent navnet på den valgte bomben
    getSelectedBombName() {
        for (const [name, data] of Object.entries(this.bombs)) {
            if (data === this.selectedBomb) {
                return name;
            }
        }
        return "Ukjent bombe";
    }

    // Lag UI-elementer for sidepanelet
    createSidebarUI(sidebarElement) {
        const bombSection = document.createElement('div');
        bombSection.className = 'bomb-selector-section';
        bombSection.innerHTML = `
            <h3>Atombombeeffekter</h3>
            <p>Velg en bombe og klikk på kartet for å se effektradius.</p>
            <div class="bomb-list"></div>
            <p class="instructions">Klikk på kartet for å plassere bomben.</p>
        `;

        const bombList = bombSection.querySelector('.bomb-list');
        
        // Lag en avmerkingsboks for hver bombe
        Object.keys(this.bombs).forEach(bombName => {
            const bombItem = document.createElement('div');
            bombItem.className = 'bomb-item';
            bombItem.innerHTML = `
                <input type="checkbox" name="bomb-select" id="${bombName.replace(/\s/g, '-')}" value="${bombName}">
                <label for="${bombName.replace(/\s/g, '-')}">${bombName}</label>
            `;
            bombList.appendChild(bombItem);
        });

        // Legg til hendelseslyttere til avmerkingsboksene
        bombList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.selectBomb(e.target.value);
            }
        });

        sidebarElement.appendChild(bombSection);
    }

    // Lag en tegnforklaring
    createLegend() {
        const legendControl = L.control({ position: 'bottomright' });
        
        legendControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = `
                <div style="background: white; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                    <h4 style="margin: 0 0 5px 0;">Effektradius</h4>
                    <div style="display: flex; align-items: center; margin: 5px 0;">
                        <span style="display: inline-block; width: 15px; height: 15px; margin-right: 5px; background-color: rgba(255, 95, 0, 0.6);"></span>
                        <span>Flammeradius</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 5px 0;">
                        <span style="display: inline-block; width: 15px; height: 15px; margin-right: 5px; background-color: rgba(255, 153, 0, 0.6);"></span>
                        <span>Høyeksplosiv skade</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 5px 0;">
                        <span style="display: inline-block; width: 15px; height: 15px; margin-right: 5px; background-color: rgba(255, 235, 59, 0.6);"></span>
                        <span>Moderat eksplosjonsskade</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 5px 0;">
                        <span style="display: inline-block; width: 15px; height: 15px; margin-right: 5px; background-color: rgba(255, 204, 188, 0.6);"></span>
                        <span>Varmestråling (3. grad)</span>
                    </div>
                </div>
            `;
            return div;
        };
        
        this.legend = legendControl;
        legendControl.addTo(this.map);
    }

    // Initialiser klikkhendelse på kartet
    initMapClickEvent() {
        this.map.on('click', (e) => {
            if (this.selectedBomb) {
                this.visualizeEffects(e.latlng);
            }
        });
    }
}

export { NuclearEffectsVisualizer };