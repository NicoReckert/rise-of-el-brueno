/**
 * Creates a character card template.
 * @param {string} characterName Character name.
 * @param {string} characterText Character description text.
 * @returns {string} HTML string.
 */
export function characterCardTemplate(characterName, characterText) {
    return ` <div class="character-card" data-character="${characterName}">
                <div class="character-card__media">
                    <span class="character-card__title">${characterName}</span>
                    <img class="character-card__image" src="./assets/img/characters/${characterName}.webp" alt="">
                </div>
                <span class="character-card__text">${characterText}</span>
            </div>`
}

/**
 * Creates a character detail template.
 * @param {string} characterName Character name.
 * @param {string} characterText Character description text.
 * @returns {string} HTML string.
 */
export function characterDetailTemplate(characterName, characterText) {
    return ` <div class="detail-card" id="character-detail-${characterName}">
                <div class="ornament ornament-left"></div>
                <div class="ornament ornament-right"></div>
                <div class="detail-card__media">
                    <span class="detail-card__title">${characterName}</span>
                    <img class="detail-card__image" src="./assets/img/characters/${characterName}.webp" alt="">
                </div>
                <div class="detail-card__body">
                    <span class="detail-card__text">${characterText}</span>
                </div>
            </div>`
}

/**
 * Creates a story card template.
 * @param {string} storyText Story text.
 * @returns {string} HTML string.
 */
export function storyCardTemplate(storyText) {
    return ` <div class="content-card">
                <div class="content-card__body">
                    <span class="content-card__text">${storyText}</span>
                </div>
            </div>`
}

/**
 * Returns an HTML template for the controls overview.
 * @param {Array<Object>} controls Control configuration list.
 * @returns {string} HTML template string.
 */
export function controlsTemplate(controls) {
    let controlsActionHtml = "";
    let controlsKeyHtml = "";
    let controlsMobileHtml = "";
    let mobileIconClass = "";
    controls.forEach(element => {
        mobileIconClass = element.mobile === 'throw' ? `controls-mobile-throw`
            : element.mobile === 'right' || element.mobile === 'left' ? `controls-mobile-action`
                : `controls-mobile-icon`
        controlsActionHtml += `<span class="controls-text">${element.action}</span>`
        controlsKeyHtml += `<img class="controls-img" src="./assets/icons/${element.key}.png" alt=""></img>`
        controlsMobileHtml += `<div class="controls-mobile-icon-box">
                                <img class="${mobileIconClass}" src="./assets/icons/${element.mobile}.png" alt=""></img>
                               </div>`
    });
    return ` <div class="content-card">
                <div class="controls-text-over-box">
                    <div class="controls-action-box">
                        <span >Action</span>
                        ${controlsActionHtml}
                    </div>
                    <div class="controls-key-box">
                        <img class="controls-keyboard-img" src="./assets/icons/keyboard.png" alt="">
                        ${controlsKeyHtml}
                    </div>
                    <div class="controls-mobile-box">
                        <img class="controls-mobile-img" src="./assets/icons/mobile.png" alt="">
                        ${controlsMobileHtml}
                    </div>
                </div>
            </div>`
}

/**
 * Returns an HTML template for the legal notice and credits section.
 * @returns {string} HTML template string.
 */
export function legalNoticeTemplate() {
    return ` <div class="content-card">
                <div class="content-card__body">               
                    <div id="legal-notice-content">
                        <h2 class="credits-title"><strong>Impressum / Legal Notice - Rise of El Brünö</strong></h2>
                        <br>
                        <br>

                        <p class="credits-sub-title"><strong>Angaben gemäß § 5 DDG:</strong></p>
                        <p class="credits-text">
                            Nico Reckert<br>
                            Am Park 4<br>
                            39326 Zielitz<br>
                            Deutschland
                        </p>
                        <br>

                        <p class="credits-sub-title"><strong>Kontakt / Contact:</strong></p>
                        <p class="credits-text">
                            E-Mail: <a class="credits-links" href="mailto:n.r-86@gmx.de">n.r-86@gmx.de</a>
                        </p>
                        <br>

                        <h3 class="credits-title">Verantwortlich für den Inhalt / Responsible for Content</h3>
                        <p class="credits-text">
                            Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten verantwortlich.
                            Nach den allgemeinen gesetzlichen Vorschriften bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen
                            ständig zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                        </p>
                        <br>
                        <p class="credits-text">
                            As a service provider, I am responsible for my own content on these pages according to the applicable legal provisions.
                            However, I am not generally obligated to permanently monitor transmitted or stored third-party information
                            or to investigate circumstances indicating illegal activity.
                        </p>
                        <br>

                        <h3 class="credits-title">Haftung für Links / Liability for Links</h3>
                        <p class="credits-text">
                            Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe.
                            Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen.
                            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                        </p>
                        <br>
                        <p class="credits-text">
                            My offer contains links to external third-party websites over whose content I have no influence.
                            Therefore, I cannot accept any liability for these external contents.
                            The respective provider or operator of the pages is always responsible for the content of the linked pages.
                        </p>
                        <br>

                        <h3 class="credits-title">Urheberrecht / Copyright</h3>
                        <p class="credits-text">
                            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                            Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
                            bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                        </p>
                        <br>
                        <p class="credits-text">
                            The content and works on these pages created by the site operator are subject to German copyright law.
                            Duplication, processing, distribution, or any form of commercialization of such material beyond the scope
                            of copyright law requires the prior written consent of the author or creator.
                        </p>
                        <br>

                        <h3 class="credits-title">Quellen / Credits</h3>
                        <p class="credits-text">
                            Dieses Projekt ist ein Schulprojekt. Für die Gestaltung und Umsetzung wurden Materialien aus folgenden Quellen verwendet:
                        </p>
                        <br>

                        <p class="credits-sub-title"><strong>Animationen, Bilder und Icons</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://voidless.dev/" target="_blank" rel="noopener">voidless.dev</a></li>
                            <li><a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a></li>
                            <li>ChatGPT</li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Musik und Soundeffekte</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a></li>
                            <li><a class="credits-links" href="https://www.udio.com/" target="_blank" rel="noopener">Udio</a></li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Text-to-Speech</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://ttsmaker.com/" target="_blank" rel="noopener">TTSMaker</a></li>
                            <li><a class="credits-links" href="https://elevenlabs.io/" target="_blank" rel="noopener">ElevenLabs</a></li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Tastatur-Icons</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://kenney-assets.itch.io/" target="_blank" rel="noopener">Kenney Assets</a></li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Schriftarten</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a></li>
                            <li><a class="credits-links" href="https://www.dafont.com/" target="_blank" rel="noopener">DaFont</a> (Adventure)</li>
                        </ul>
                        <br>

                        <p class="credits-text">
                            This project is a school project. Materials from the following sources were used for its design and implementation:
                        </p>
                        <br>

                        <p class="credits-sub-title"><strong>Animations, Images and Icons</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://voidless.dev/" target="_blank" rel="noopener">voidless.dev</a></li>
                            <li><a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a></li>
                            <li>ChatGPT</li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Music and Sound Effects</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://pixabay.com/" target="_blank" rel="noopener">Pixabay</a></li>
                            <li><a class="credits-links" href="https://www.udio.com/" target="_blank" rel="noopener">Udio</a></li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Text-to-Speech</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://ttsmaker.com/" target="_blank" rel="noopener">TTSMaker</a></li>
                            <li><a class="credits-links" href="https://elevenlabs.io/" target="_blank" rel="noopener">ElevenLabs</a></li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Keyboard Icons</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://kenney-assets.itch.io/" target="_blank" rel="noopener">Kenney Assets</a></li>
                        </ul>
                        <br>

                        <p class="credits-sub-title"><strong>Fonts</strong></p>
                        <ul class="credits-text">
                            <li><a class="credits-links" href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a></li>
                            <li><a class="credits-links" href="https://www.dafont.com/" target="_blank" rel="noopener">DaFont</a> (Adventure)</li>
                        </ul>
                        <br>

                        <h3 class="credits-title">Datenschutz / Privacy</h3>
                        <p class="credits-text">
                            Dieses Webprojekt verarbeitet nach aktuellem Stand keine personenbezogenen Daten, setzt keine Cookies
                            und nutzt keine Tracking- oder Analyse-Dienste. Eingebundene Schriftarten werden lokal vom eigenen Server geladen.
                        </p>
                        <br>
                        <p class="credits-text">
                            To the best of current knowledge, this web project does not process personal data, use cookies,
                            or employ tracking or analytics tools. Embedded fonts are hosted locally on the same server.
                        </p>
                        <br>

                        <h3 class="credits-title">Nichtkommerzielles Projekt / Non-commercial Project</h3>
                        <p class="credits-text">
                            Dies ist ein privates, nichtkommerzielles Schulprojekt, das ausschließlich zu Lern- und Unterhaltungszwecken erstellt wurde.
                        </p>
                        <br>
                        <p class="credits-text">
                            This is a private, non-commercial school project created for educational and entertainment purposes only.
                        </p>
                    </div>
                </div>
            </div>`;
}