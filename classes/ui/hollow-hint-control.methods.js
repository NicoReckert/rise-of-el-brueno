const iconCache = new Map();

export const hollowHintControlMethods = {
    /**
     * Checks whether the mobile control icon should be used.
     * @returns {boolean} True if the mobile control icon should be used, otherwise false.
     */
    useMobileControlIcon() {
        return window.matchMedia('(pointer: coarse)').matches && window.innerWidth <= 950;
    },

    /**
     * Gets the current control icon name.
     * @returns {string|null} Current control icon name.
     */
    getCurrentControlIconName() {
        if (!this.control) return null;
        return this.useMobileControlIcon()
            ? (this.control.mobile ?? null)
            : (this.control.key ?? null);
    },

    /**
     * Gets the current control icon.
     * @returns {*} Current control icon.
     */
    getCurrentControlIcon() {
        const iconName = this.getCurrentControlIconName();
        if (!iconName) return null;
        return this.getCachedIcon(`./assets/icons/${iconName}.webp`);
    },

    /**
     * Gets a cached icon image.
     * @param {string} src Icon source path.
     * @returns {Image} Cached icon image.
     */
    getCachedIcon(src) {
        if (!iconCache.has(src)) {
            const img = new Image();
            img.src = src;
            iconCache.set(src, img);
        }
        return iconCache.get(src) ?? null;
    },

    /**
     * Gets the control icon size.
     * @returns {number} Control icon size.
     */
    getControlIconSize() {
        return this.useMobileControlIcon() ? 22 : 24;
    },

    /**
     * Gets the control icon Y offset.
     * @returns {number} Control icon Y offset.
     */
    getControlIconYOffset() {
        return -3;
    }
};