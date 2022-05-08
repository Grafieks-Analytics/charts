const d3 = require("d3");
const CONSTANTS = require("../constants");
const { getDistanceBetweenElements } = require("../utils");

const isTickTextOverflowing = () => {
    /*
        Here we check if the tick text is overflowing the rotating margin.
        - tick length should not exceed xAxiis length
    */
    const tickText = d3.selectAll(".x-axis .tick text");
    const tickNodes = tickText.nodes();
    const xScale = window.grafieks.utils.xScale;
    let isOverflowing = false;
    const tickNodeLength = tickNodes.length;
    let rotatingMargin = grafieks.chartsConfig.margins.rotatingMargin;
    const barsWidth = xScale.bandwidth();

    for (var i = 0; i < tickNodeLength; i++) {
        const tick = tickNodes[i];
        const textLength = tick.getComputedTextLength();
        if (rotatingMargin < textLength) {
            rotatingMargin = Math.min(textLength, CONSTANTS.defaultValues.maxRotationMargin);
        }
        if (isOverflowing) {
            continue;
        }
        if (textLength > barsWidth) {
            isOverflowing = true;
        }
    }
    if (isOverflowing) {
        grafieks.chartsConfig.margins.rotatingMargin = rotatingMargin - 5;
    }
    return isOverflowing;
};

const getClippedTickText = (tick, tickNodeLength) => {
    const text = tick.innerHTML;
    const singleLetterLength = tickNodeLength / text.length;
    const totalEligibleCharacters = Math.floor(grafieks.chartsConfig.margins.rotatingMargin / singleLetterLength);
    if (text.length - totalEligibleCharacters > 3) {
        return text.substr(0, totalEligibleCharacters + 2) + "...";
    }
    return text;
};

const modifyAndHideTicks = () => {
    const tickTexts = d3.selectAll(".x-axis .tick text").nodes();
    const barsWidth = window.grafieks.utils.xScale.bandwidth();
    tickTexts.forEach((tick, i) => {
        const singleTickSpace = Math.floor(tick.getBBox().height / barsWidth);
        if (i % singleTickSpace != 0) {
            tick.remove();
            return;
        }
        // To check if the tick is overlapping, width of vertical tick (height of the tick)
        const tickNodeLength = tick.getComputedTextLength();
        if (tickNodeLength > grafieks.chartsConfig.margins.rotatingMargin) {
            tick.innerHTML = getClippedTickText(tick, tickNodeLength);
        }
    });
};

module.exports = {
    isTickTextOverflowing,
    modifyAndHideTicks
};
