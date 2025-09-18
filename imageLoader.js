// imageLoader.js
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function preloadManifestImages(manifest) {
    const entries = Object.entries(manifest);

    const results = await Promise.all(
        entries.map(async ([key, paths]) => [key, await Promise.all(paths.map(loadImage))])
    );

    return Object.fromEntries(results);
}
