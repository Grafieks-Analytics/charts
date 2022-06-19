const d3 = require("d3");
const CONSTANTS = require("../constants");

const isTickTextOverflowing = () => {
    if (isTickExceptionalChart()) {
        return;
    }
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
    // If the text is longer than the total eligible characters, then we need to clip the text
    if (text.length - totalEligibleCharacters > 3) {
        return text.substr(0, totalEligibleCharacters + 2) + "...";
    }
    // if (text.length - totalEligibleCharacters > 0) {
    //     return text.substr(0, totalEligibleCharacters - 1) + "...";
    // }
    return text;
};

const isTickExceptionalChart = () => {
    const chartName = window.grafieks.plotConfiguration.chartName;
    if (CONSTANTS.TICKS.EXCEPTIONAL_CHARTS.indexOf(chartName) > -1) {
        return true;
    }
    return false;
};

const modifyAndHideTicks = () => {
    if (isTickExceptionalChart()) {
        return;
    }
    const tickTexts = d3.selectAll(".x-axis .tick text").nodes();
    const barsWidth = window.grafieks.utils.xScale.bandwidth();
    tickTexts.forEach((tick, i) => {
        const verticalTickWidth = tick.getBBox().height;
        // if barsWidth > verticalTickWidth => Tick is eligible to be shown;
        // Calculate the space when a tick will not collide with other ticks = i % Math.floor(verticalTickWidth / barsWidth)
        // Remove all the other ticks which are coming in between this space.
        // i % Math.floor(verticalTickWidth / barsWidth) != 0 => Tick is not eligible to be shown; because it will overlap with other ticks
        if (barsWidth < verticalTickWidth && i % Math.floor(verticalTickWidth / barsWidth) != 0) {
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