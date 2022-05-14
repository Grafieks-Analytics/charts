const d3 = require("d3");
const CONSTANTS = require("../constants");

const clearChart = () => {
    d3.select(".charts-div").html(""); // Clear Chart
    d3.select(".tooltip").html(""); // Clear Tooltip
    d3.select(".legend").html(""); // Clear legend
};

const isAxisBasedChart = (chartName) => {
    return CONSTANTS.axisBasedCharts.includes(chartName);
};

const isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Getter Functions Starts
const getAxisWidth = () => {
    const margins = window.grafieks.chartsConfig.margins;
    return window.innerWidth - margins.left - margins.right;
};

const getDistance = (x1, x2, y1, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const getDistanceBetweenElements = (rect1, rect2) => {
    if (!rect1 || !rect2) return 0;
    rect1 = rect1.getClientRects()[0];
    rect2 = rect2.getClientRects()[0];
    let { x: x1, y: y1, width: width1, height: height1 } = rect1;
    x1 = x1 + width1 / 2;
    y1 = y1 + height1 / 2;

    let { x: x2, y: y2, width: width2, height: height2 } = rect2;
    x2 = x2 + width2 / 2;
    y2 = y2 + height2 / 2;

    const distanceValue = getDistance(x1, x2, y1, y2);
    return distanceValue;
};

const getMaximumValue = (array) => {
    let maxValue = d3.max(array);
    if (maxValue < 0) {
        maxValue = 0;
    }
    return maxValue;
};

const getMinimumValue = (array) => {
    let minValue = d3.min(array);
    if (minValue > 0) {
        minValue = 0;
    }
    return minValue;
};

const getNumberOfTicks = () => {
    return Math.floor(window.innerHeight / 70);
};

const getSvg = () => {
    const { width, height } = window.grafieks.chartsConfig;
    return d3.create("svg").attr("width", width).attr("height", height);
    //.attr("viewBox", [0, 0, width, height]);
};

const getXRange = () => {
    const { width, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [chartsMargins.left, width - chartsMargins.right];
};

const getXScale = (domain, range, options = {}) => {
    const { padding = 0.25 } = options;
    return d3.scaleBand().domain(domain).range(range).padding(padding);
};

const getYRange = () => {
    const { height, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [height - chartsMargins.bottom - chartsMargins.rotatingMargin, chartsMargins.top];
};

const getYScale = (domain, range) => {
    return d3.scaleLinear().domain(domain).nice().range(range);
};

// Getter Functions Ends

// Setter functions Starts

const setInitialConfig = () => {
    const grafieks = (window.grafieks = window.grafieks || {}); // Setting grafieks's empty object to window

    // utils object will contain utility functions for the charts
    grafieks.utils = {};

    // data utils will contain all the values of data
    // Raw Data
    // Extracted Data
    // For Optmizing we can delete rawData key after extracting data from rawData to dataValues and dataLabels
    grafieks.dataUtils = {};

    // chart configuration will have
    // margins
    // width
    // height
    grafieks.chartsConfig = { margins: CONSTANTS.chartsMargins };

    // legend config; Will have margins to be used in tooltip
    grafieks.legend = {};

    // flags to be set in flags key
    grafieks.flags = {};
};

// Setter functions ends

module.exports = {
    setInitialConfig,
    getSvg,
    getAxisWidth,
    getNumberOfTicks,
    isAxisBasedChart,
    clearChart,
    getMinimumValue,
    getMaximumValue,
    getYScale,
    getXScale,
    getYRange,
    getXRange,
    isElementInViewport,
    getDistanceBetweenElements
};
