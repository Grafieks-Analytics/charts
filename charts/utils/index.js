const d3 = require("d3");
const { axisBasedCharts, chartsMargins } = require("../constants");

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
    grafieks.chartsConfig = { margins: chartsMargins };
};

const getSvg = () => {
    const { width, height, lengends: { legendWidth = 0, legenedHeight = 0 } = {} } = window.grafieks.chartsConfig;
    return d3.create("svg").attr("viewBox", [0, 0, width - legendWidth, height - legenedHeight]);
};

const getAxisWidth = () => {
    const margins = window.grafieks.chartsConfig.margins;
    return window.innerWidth - margins.left - margins.right;
};

const getNumberOfTicks = () => {
    return Math.floor(window.innerHeight / 70);
};

const clearChart = () => {
    d3.select(".charts-div").html(""); // Clear Chart
    d3.select(".tooltip").html(""); // Clear Tooltip
    d3.select(".legend").html(""); // Clear legend
};

const makeYaxisGridLines = (scale) => {
    return d3
        .axisLeft(scale)
        .ticks(window.innerHeight / 70)
        .tickSize(-getAxisWidth())
        .tickFormat(d3.format(".2s"));
};

const isAxisBasedChart = (chartName) => {
    return axisBasedCharts.includes(chartName);
};

const getMinimumValue = (array) => {
    let minValue = d3.min(array);
    if (minValue > 0) {
        minValue = 0;
    }
    return minValue;
};

const getMaximumValue = (array) => {
    let maxValue = d3.max(array);
    if (maxValue < 0) {
        maxValue = 0;
    }
    return maxValue;
};

const getYScale = (domain, range) => {
    return d3.scaleLinear().domain(domain).nice().range(range);
};

const getXScale = (domain, range, options = {}) => {
    const { padding = 0.25 } = options;
    return d3.scaleBand().domain(domain).range(range).padding(padding);
};

const getYRange = () => {
    const { height, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [height - chartsMargins.bottom, chartsMargins.top];
};

const getXRange = () => {
    const { width, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [chartsMargins.left, width - chartsMargins.right];
};

const showTooltip = () => {
    // Show tooltip on mouseover
    // Move this to function and move it to utils

    d3.selectAll(".visualPlotting")
        .on("mouseout", function (d, i) {
            d3.select(".tooltip").style("display", "none");
            d3.selectAll(".visualPlotting").style("opacity", 1);
        })
        .on("mouseover mousemove", function (d, i) {
            // let xpos = d3.pointer(this)[0] + margin.left;
            // let ypos = d3.pointer(this)[1];

            // let xValue = this.getAttribute("data-value-x");
            // let yValue = this.getAttribute("data-value-y");

            // tooltip Ui fix

            d3.selectAll(".visualPlotting").style("opacity", 0.3);
            d3.select(this).style("opacity", 1);
        });
};

module.exports = {
    setInitialConfig,
    getSvg,
    getAxisWidth,
    getNumberOfTicks,
    makeYaxisGridLines,
    isAxisBasedChart,
    clearChart,
    getMinimumValue,
    getMaximumValue,
    getYScale,
    getXScale,
    getYRange,
    getXRange,
    showTooltip
};
