import {
    characterDialogTemplate,
    largeCharacterDialogTemplate,
    storyTextTemplate,
    controlsTemplate,
    legalNoticeTemplate
} from "../ui/menu-templates.js";

export const uiManagerRenderMethods = {

    /**
     * Renders character cards into the small card container.
     * @param {Array} characters List of character data objects.
     */
    renderCharacterCards(characters) {
        const box = this.dom.smallCardBox;
        if (!box) return;
        box.innerHTML = characters
            .map(character => characterDialogTemplate(character.name, character.text))
            .join('');
    },

    /**
     * Renders a large character card into the big card container.
     * @param {Object} character Character data object.
     */
    renderBigCharacterCard(character) {
        const box = this.dom.bigCardBox;
        if (!box || !character) return;
        box.innerHTML = largeCharacterDialogTemplate(character.name, character.text2);
    },

    /**
     * Renders a story card into the story container.
     * @param {string} text Story text content.
     */
    renderStoryCard(text) {
        const box = this.dom.storyBox;
        if (!box) return;
        box.innerHTML = storyTextTemplate(text);
    },

    /**
     * Renders the controls card into the controls container.
     * @param {Object} controls Controls configuration data.
     */
    renderControlsCard(controls) {
        const box = this.dom.controlsBox;
        if (!box) return;
        box.innerHTML = controlsTemplate(controls);
    },

    /**
     * Renders the credits card into the credits container.
     */
    renderCreditsCard() {
        const box = this.dom.creditsBox;
        if (!box) return;
        box.innerHTML = legalNoticeTemplate();
    }
};