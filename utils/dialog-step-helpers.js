export const bubbleStep = ({
    bubble = null,
    text = "",
    target = "canvas",
    bubbleType = "speech",
    duration = null,
    allAudios = null,
    yOffset = null
} = {}) => ({
    type: "bubble",
    bubble,
    text,
    target,
    bubbleType,
    duration,
    allAudios,
    yOffset
});

export const pauseStep = (duration = 0) => ({
    type: "pause",
    duration
});

export const callbackStep = (run = null) => ({
    type: "callback",
    run
});