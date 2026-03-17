import {
    characterCardTemplate,
    characterDetailTemplate,
    storyCardTemplate,
    controlsTemplate,
    legalNoticeTemplate
} from "../ui/menu-templates.js";

export const uiManagerRenderMethods = {

    /**
     * Renders character cards.
     * @param {Array<Object>} characters Character data.
     * @returns {void}
     */
    renderCharacterCards(characters) {
        const box = this.dom.characterList;
        if (!box) return;
        box.innerHTML = characters
            .map(character => characterCardTemplate(character.name, character.text))
            .join('');
    },

    /**
     * Renders a large character card into the big card container.
     * @param {Object} character Character data object.
     */
    renderBigCharacterCard(character) {
        const box = this.dom.detailCardContainer;
        if (!box || !character) return;
        box.innerHTML = characterDetailTemplate(character.name, character.text2);
    },

    /**
     * Renders a story card into the story container.
     * @param {string} text Story text content.
     */
    renderStoryCard(text) {
        const box = this.dom.storySection;
        if (!box) return;
        box.innerHTML = storyCardTemplate(text);
    },

    /**
     * Renders the controls card into the controls container.
     * @param {Object} controls Controls configuration data.
     */
    renderControlsCard(controls) {
        const box = this.dom.controlsSection;
        if (!box) return;
        box.innerHTML = controlsTemplate(controls);
    },

    /**
     * Renders the credits card into the credits container.
     */
    renderCreditsCard() {
        const box = this.dom.creditsSection;
        if (!box) return;
        box.innerHTML = legalNoticeTemplate();
    }
};