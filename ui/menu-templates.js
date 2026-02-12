export function template1(characterName, characterText) {
    return ` <div class="img-text-box" data-character="${characterName}">
                <div class="name-img-box">
                    <span class="character-name">${characterName}</span>
                    <img class="character-img" src="./assets/img/characters/${characterName}.webp" alt="">
                </div>
                <span class="character-text">${characterText}</span>
            </div>`
}

export function template2(characterName, characterText) {
    return ` <div class="big__img-text-box" id="big-${characterName}">
                <div class="big__name-img-box">
                    <span class="big__character-name">${characterName}</span>
                    <img class="big__character-img" src="./assets/img/characters/${characterName}.webp" alt="">
                </div>
                <div class="big__character-text-box">
                    <span class="big__character-text">${characterText}</span>
                </div>
            </div>`
}

export function template3(storyText) {
    return ` <div class="story-box">
                <div class="story-text-box">
                    <span class="story-text">${storyText}</span>
                </div>
            </div>`
}

export function template4(controls) {
    let controlsActionHtml = "";
    let controlsKeyHtml = "";
    let controlsMobileHtml = "";
    let mobileIconClass = "";
    controls.forEach(element => {
        mobileIconClass = element.mobile === 'throw' ? `controls-mobile-throw`
            : element.mobile === 'right2' || element.mobile === 'left2' ? `controls-mobile-action`
                : `controls-mobile-icon`
        controlsActionHtml += `<span class="controls-text">${element.action}</span>`
        controlsKeyHtml += `<img class="controls-img" src="./assets/icons/${element.key}.png" alt=""></img>`
        controlsMobileHtml += `<div class="controls-mobile-icon-box">
                                <img class="${mobileIconClass}" src="./assets/icons/${element.mobile}.png" alt=""></img>
                               </div>`
    });

    return ` <div class="story-box">
                <div class="controls-text-over-box">
                    <div class="controls-action-box">
                        <span >Action</span>
                        ${controlsActionHtml}
                    </div>
                    <div class="controls-key-box">
                        <img class="controls-first-img" src="./assets/icons/keyboard.png" alt="">
                        ${controlsKeyHtml}
                    </div>
                    <div class="controls-mobile-box">
                        <img class="controls-first-img2" src="./assets/icons/mobile.png" alt="">
                        ${controlsMobileHtml}
                    </div>
                </div>
            </div>`
}

export function template5() {

    return ` <div class="story-box">
                <div class="story-text-box">               
                    <div id="impressumContent">
                        <h2 class="credits-title"><strong>Impressum / Legal Notice - Rise of El Brünö</strong></h2>
                        <br>
                        <br>
                        <p class="credits-sub-title"><strong>Angaben gemäß § 5 TMG:</strong><p>
                        <p class="credits-text">
                        Nico Reckert<br>
                        Am Park 4<br>
                        39326 Zielitz<br>
                        Deutschland</p>
                        <br>
                        <p class="credits-sub-title"><strong>Kontakt / Contact:</strong><br>
                        <p class="credits-text">
                        E-Mail: <a class="credits-links" href="mailto:n.r-86@gmx.de">n.r-86@gmx.de</a></p>

                        
                        <br>
                        <h3 class="credits-title">Verantwortlich für den Inhalt / Responsible for Content</h3>
                        <p class="credits-text">Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten verantwortlich.
                        Nach §§ 8 bis 10 TMG bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
                        oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>
                        <br>
                        <p class="credits-text">As a service provider, I am responsible for my own content on these pages according to § 7 para. 1 TMG.
                        However, according to §§ 8 to 10 TMG, I am not obligated to monitor transmitted or stored third-party information.</p>

                        
                        <br>
                        <h3 class="credits-title">Haftung für Links / Liability for Links</h3>
                        <p class="credits-text">Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe.
                        Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen.
                        Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
                        <br>
                        <p class="credits-text">My offer contains links to external third-party websites over whose content I have no influence.
                        Therefore, I cannot accept any liability for these external contents.
                        The respective provider or operator of the pages is always responsible for the content of the linked pages.</p>

                        
                        <br>
                        <h3 class="credits-title">Urheberrecht / Copyright</h3>
                        <p class="credits-text">Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                        Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
                        bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
                        <br>
                        <p class="credits-text">The content and works on these pages created by the site operator are subject to German copyright law.
                        Duplication, processing, distribution, or any form of commercialization of such material beyond the scope
                        of copyright law requires the prior written consent of the author or creator.</p>

                        
                        <br>
                        <h3 class="credits-title">Credits</h3>
                        <p class="credits-text">Sound Effects by <a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a><br>
                        Music by <a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a><br>
                        Icons by <a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a><br>
                        Fonts by <a class="credits-links" href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> (locally hosted)</p>

                        
                        <br>
                        <h3 class="credits-title">Datenschutz / Privacy</h3>
                        <p class="credits-text">Dieses Webprojekt verarbeitet keine personenbezogenen Daten, setzt keine Cookies und nutzt keine Tracking- oder Analyse-Dienste.
                        Eingebundene Schriftarten von Google Fonts werden ausschließlich lokal vom eigenen Server geladen.</p>
                        <br>
                        <p class="credits-text">This web project does not process personal data, use cookies, or employ any tracking or analytics tools.
                        Embedded Google Fonts are hosted locally on the same server.</p>

                        
                        <br>
                        <h3 class="credits-title">Nichtkommerzielles Projekt / Non-commercial Project</h3>
                        <p class="credits-text">Dies ist ein privates, nichtkommerzielles Web-Game-Projekt, das ausschließlich zu Lern- und Unterhaltungszwecken erstellt wurde.</p>
                        <br>
                        <p class="credits-text">This is a private, non-commercial web game project created for educational and entertainment purposes only.</p>
                    </div>
                </div>
            </div>`
}