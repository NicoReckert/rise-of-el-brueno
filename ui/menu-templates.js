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
 * Creates the controls template markup.
 * @param {Object[]} controls Control configuration list.
 * @returns {string} Controls template markup.
 */
export function controlsTemplate(controls) {
    const rowsHtml = controls.map(createControlsRowTemplate).join('');
    return `
        <div class="content-card">
            <div class="controls-grid">
                ${createControlsHeaderAction()}
                ${createControlsHeaderKey()}
                ${createControlsHeaderMobile()}
                ${rowsHtml}
            </div>
        </div>`;
}

/**
 * Creates the controls row template markup.
 * @param {Object} control Control configuration.
 * @returns {string} Controls row template markup.
 */
function createControlsRowTemplate(control) {
    const mobileIconClass = getMobileIconClass(control.mobile);
    return `
        <div class="controls-grid__row">
            ${createControlsActionCell(control)}
            ${createControlsKeyCell(control)}
            ${createControlsMobileCell(control, mobileIconClass)}
        </div>`;
}

/**
 * Creates the controls action cell markup.
 * @param {Object} control Control configuration.
 * @returns {string} Controls action cell markup.
 */
function createControlsActionCell(control) {
    return `
        <div class="controls-grid__action">
            <span class="controls-text">${control.action}</span>
        </div>`;
}

/**
 * Creates the controls key cell markup.
 * @param {Object} control Control configuration.
 * @returns {string} Controls key cell markup.
 */
function createControlsKeyCell(control) {
    return `
        <div class="controls-grid__key">
            <img class="controls-img" src="./assets/icons/${control.key}.webp" alt="${control.key}">
        </div>`;
}

/**
 * Creates the controls mobile cell markup.
 * @param {Object} control Control configuration.
 * @param {string} mobileIconClass Mobile icon class.
 * @returns {string} Controls mobile cell markup.
 */
function createControlsMobileCell(control, mobileIconClass) {
    return `
        <div class="controls-grid__mobile">
            <div class="controls-mobile-icon-box">
                <img class="${mobileIconClass}" src="./assets/icons/${control.mobile}.webp" alt="${control.mobile}">
            </div>
        </div>`;
}

/**
 * Creates the controls action header markup.
 * @returns {string} Controls action header markup.
 */
function createControlsHeaderAction() {
    return `<div class="controls-grid__header controls-grid__header--action">Action</div>`;
}

/**
 * Creates the controls key header markup.
 * @returns {string} Controls key header markup.
 */
function createControlsHeaderKey() {
    return `
        <div class="controls-grid__header controls-grid__header--key">
            <img class="controls-keyboard-img" src="./assets/icons/keyboard.webp" alt="Keyboard">
        </div>`;
}

/**
 * Creates the controls mobile header markup.
 * @returns {string} Controls mobile header markup.
 */
function createControlsHeaderMobile() {
    return `
        <div class="controls-grid__header controls-grid__header--mobile">
            <img class="controls-mobile-img" src="./assets/icons/mobile.webp" alt="Mobile">
        </div>`;
}

/**
 * Gets the mobile icon class for a control type.
 * @param {string} mobileType Mobile control type.
 * @returns {string} Mobile icon class.
 */
function getMobileIconClass(mobileType) {
    return mobileType === 'throw'
        ? 'controls-mobile-throw'
        : mobileType === 'right' || mobileType === 'left'
            ? 'controls-mobile-action'
            : 'controls-mobile-icon';
}