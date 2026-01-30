/**
 * Represents a basic drawable object with position, size, and image properties.
 * Provides image loading functionality for rendering.
 */
export class DrawableObject {

    /**
     * Initializes default position, size, and image properties.
     */
    constructor() {
        this.x = 120;
        this.y = 250;
        this.img;
        this.width = 100;
        this.height = 150;
    }

    /**
     * Loads an image from a given file path.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
}